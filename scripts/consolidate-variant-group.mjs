#!/usr/bin/env node

import fs from "fs";
import path from "path";

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, "$1")), "..");
const mapPath = path.join(repoRoot, "data", "variant-migration-map.json");
const dataReportDir = path.join(repoRoot, "data", "migration-reports");
const docsReportDir = path.join(repoRoot, "docs", "migration-reports");

const args = process.argv.slice(2);

function printUsage() {
  console.log([
    "Usage:",
    "  node scripts/consolidate-variant-group.mjs --group <group-id>",
    "  node scripts/consolidate-variant-group.mjs --group <group-id> --apply",
    "  node scripts/consolidate-variant-group.mjs --all",
    "  node scripts/consolidate-variant-group.mjs --all --apply"
  ].join("\n"));
}

function parseArgs(argv) {
  const parsed = {
    apply: false,
    all: false,
    groupId: null
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--apply") {
      parsed.apply = true;
      continue;
    }

    if (arg === "--all") {
      parsed.all = true;
      continue;
    }

    if (arg === "--group") {
      const next = argv[index + 1];
      if (!next || next.startsWith("--")) {
        throw new Error("Missing value for --group.");
      }
      parsed.groupId = next;
      index += 1;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!parsed.help) {
    if (parsed.all && parsed.groupId) {
      throw new Error("Use either --group <group-id> or --all, not both.");
    }

    if (!parsed.all && !parsed.groupId) {
      throw new Error("Specify --group <group-id> or --all.");
    }
  }

  return parsed;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function normalizeRelativePath(relativePath) {
  return relativePath.replace(/\\/g, "/");
}

function absolutePath(relativePath) {
  return path.join(repoRoot, relativePath);
}

function publicPathFromRelative(relativePath, encoded = false) {
  const segments = normalizeRelativePath(relativePath).split("/");
  const publicSegments = encoded ? segments.map((segment) => encodeURIComponent(segment)) : segments;
  return `/${publicSegments.join("/")}/`;
}

function walkDirectory(directoryPath, basePath = directoryPath) {
  const entries = [];

  if (!fs.existsSync(directoryPath)) {
    return entries;
  }

  const dirEntries = fs.readdirSync(directoryPath, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name));

  for (const entry of dirEntries) {
    const entryPath = path.join(directoryPath, entry.name);
    const relativePath = normalizeRelativePath(path.relative(basePath, entryPath));

    if (entry.isDirectory()) {
      entries.push({
        relativePath,
        type: "directory"
      });
      entries.push(...walkDirectory(entryPath, basePath));
      continue;
    }

    if (entry.isFile()) {
      const stats = fs.statSync(entryPath);
      entries.push({
        relativePath,
        type: "file",
        size: stats.size
      });
    }
  }

  return entries;
}

function fileList(directoryPath) {
  return walkDirectory(directoryPath)
    .filter((entry) => entry.type === "file")
    .map((entry) => entry.relativePath);
}

function manifestsMatch(sourcePath, targetPath) {
  const sourceManifest = walkDirectory(sourcePath);
  const targetManifest = walkDirectory(targetPath);
  return JSON.stringify(sourceManifest) === JSON.stringify(targetManifest);
}

function copyDirectoryRecursive(sourcePath, targetPath) {
  ensureDirectory(targetPath);

  const entries = fs.readdirSync(sourcePath, { withFileTypes: true });
  for (const entry of entries) {
    const sourceEntryPath = path.join(sourcePath, entry.name);
    const targetEntryPath = path.join(targetPath, entry.name);

    if (entry.isDirectory()) {
      copyDirectoryRecursive(sourceEntryPath, targetEntryPath);
      continue;
    }

    if (entry.isFile()) {
      ensureDirectory(path.dirname(targetEntryPath));
      fs.copyFileSync(sourceEntryPath, targetEntryPath);
    }
  }
}

function moveDirectorySafe(sourcePath, targetPath) {
  ensureDirectory(path.dirname(targetPath));

  try {
    fs.renameSync(sourcePath, targetPath);
    return {
      mode: "rename"
    };
  } catch (error) {
    if (error.code !== "EXDEV" && error.code !== "EPERM" && error.code !== "EINVAL") {
      throw error;
    }

    copyDirectoryRecursive(sourcePath, targetPath);

    if (!manifestsMatch(sourcePath, targetPath)) {
      throw new Error(`Copy verification failed for ${sourcePath} -> ${targetPath}`);
    }

    fs.rmSync(sourcePath, { recursive: true, force: false });

    return {
      mode: "copy-delete",
      fallbackReason: error.code
    };
  }
}

function replaceAllOccurrences(content, searchValue, replaceValue) {
  if (!searchValue || searchValue === replaceValue || !content.includes(searchValue)) {
    return {
      content,
      replaced: false
    };
  }

  return {
    content: content.split(searchValue).join(replaceValue),
    replaced: true
  };
}

function updateHubLinks(group, dryRun) {
  const hubAbsolutePath = absolutePath(group.hubPath);
  const originalContent = fs.readFileSync(hubAbsolutePath, "utf8");
  let updatedContent = originalContent;
  const replacements = [];

  for (const variant of group.variants) {
    if (!variant.fromSite) {
      continue;
    }

    const targetHref = publicPathFromRelative(variant.toPath, false);
    const candidates = [
      publicPathFromRelative(variant.fromSite, true),
      publicPathFromRelative(variant.fromSite, false)
    ];

    for (const candidate of candidates) {
      const result = replaceAllOccurrences(updatedContent, candidate, targetHref);
      updatedContent = result.content;
      if (result.replaced) {
        replacements.push({
          from: candidate,
          to: targetHref
        });
      }
    }
  }

  if (updatedContent !== originalContent && !dryRun) {
    fs.writeFileSync(hubAbsolutePath, updatedContent, "utf8");
  }

  return {
    changed: updatedContent !== originalContent,
    replacements
  };
}

function processGroup(group, dryRun) {
  const report = {
    groupId: group.groupId,
    title: group.title,
    status: group.status,
    hubPath: group.hubPath,
    dryRun,
    variantsProcessed: [],
    skippedItems: [],
    warnings: [],
    errors: [],
    hubLinksUpdated: false,
    hubLinkReplacements: []
  };

  const hubAbsolutePath = absolutePath(group.hubPath);
  if (!fs.existsSync(hubAbsolutePath)) {
    report.errors.push(`Hub index does not exist: ${group.hubPath}`);
    return report;
  }

  if (group.status === "completed") {
    report.skippedItems.push("Group is marked completed/reference in the migration map.");
    const variantTargetsMissing = group.variants
      .map((variant) => variant.toPath)
      .filter((toPath) => !fs.existsSync(absolutePath(toPath)));

    if (variantTargetsMissing.length > 0) {
      report.errors.push(`Completed reference group is missing expected target paths: ${variantTargetsMissing.join(", ")}`);
    }

    return report;
  }

  for (const variant of group.variants) {
    const fromAbsolutePath = absolutePath(variant.fromSite);
    const toAbsolutePath = absolutePath(variant.toPath);
    const targetExists = fs.existsSync(toAbsolutePath);
    const sourceExists = fs.existsSync(fromAbsolutePath);
    const variantReport = {
      variantNumber: variant.variantNumber,
      fromSitesPath: variant.fromSite,
      toPath: variant.toPath,
      filesMovedCopied: [],
      skippedItems: [],
      warnings: [],
      errors: [],
      oldPathRemoved: false,
      hubLinksUpdated: false,
      movementMode: dryRun ? "dry-run" : "not-run"
    };

    if (!sourceExists) {
      if (targetExists) {
        variantReport.skippedItems.push("Source path missing and target already exists; treated as previously consolidated.");
        variantReport.oldPathRemoved = true;
        report.warnings.push(`Source missing but target already exists for ${variant.toPath}.`);
      } else {
        variantReport.errors.push(`Source path does not exist: ${variant.fromSite}`);
        report.errors.push(`Source path does not exist: ${variant.fromSite}`);
      }

      report.variantsProcessed.push(variantReport);
      continue;
    }

    const sourceFiles = fileList(fromAbsolutePath);
    variantReport.filesMovedCopied = sourceFiles;

    if (targetExists) {
      if (manifestsMatch(fromAbsolutePath, toAbsolutePath)) {
        variantReport.skippedItems.push("Target already exists with matching file manifest; no overwrite performed.");
        variantReport.oldPathRemoved = !dryRun ? !fs.existsSync(fromAbsolutePath) : false;
        variantReport.warnings.push("Matching target already exists.");
        report.warnings.push(`Target already exists with matching file manifest: ${variant.toPath}`);
      } else {
        variantReport.errors.push(`Target path already exists with a different file manifest: ${variant.toPath}`);
        report.errors.push(`Target path already exists with a different file manifest: ${variant.toPath}`);
      }

      report.variantsProcessed.push(variantReport);
      continue;
    }

    if (dryRun) {
      variantReport.warnings.push("Dry-run only; no files moved.");
      report.variantsProcessed.push(variantReport);
      continue;
    }

    const movement = moveDirectorySafe(fromAbsolutePath, toAbsolutePath);
    variantReport.movementMode = movement.mode;
    if (movement.fallbackReason) {
      variantReport.warnings.push(`Rename fallback used: ${movement.fallbackReason}`);
      report.warnings.push(`Rename fallback used for ${variant.toPath}: ${movement.fallbackReason}`);
    }

    variantReport.oldPathRemoved = !fs.existsSync(fromAbsolutePath);
    report.variantsProcessed.push(variantReport);
  }

  const hubUpdate = updateHubLinks(group, dryRun);
  report.hubLinksUpdated = hubUpdate.changed;
  report.hubLinkReplacements = hubUpdate.replacements;

  for (const variantReport of report.variantsProcessed) {
    if (hubUpdate.replacements.some((replacement) => replacement.to.endsWith(`/variant-${variantReport.variantNumber}/`))) {
      variantReport.hubLinksUpdated = true;
    }
  }

  return report;
}

function summarizeReport(groupReports) {
  const pendingReports = groupReports.filter((report) => report.status !== "completed");
  const variantsPlanned = pendingReports.reduce((total, report) => total + report.variantsProcessed.length, 0);
  const variantsWithErrors = pendingReports.reduce((total, report) => total + report.variantsProcessed.filter((variant) => variant.errors.length > 0).length, 0);
  const variantsMoved = pendingReports.reduce((total, report) => total + report.variantsProcessed.filter((variant) => variant.oldPathRemoved).length, 0);
  const warnings = pendingReports.reduce((total, report) => total + report.warnings.length, 0);
  const errors = pendingReports.reduce((total, report) => total + report.errors.length, 0);

  return {
    groupsProcessed: groupReports.length,
    variantsPlanned,
    variantsMoved,
    variantsWithErrors,
    warnings,
    errors
  };
}

function markdownForGroupReport(report) {
  const lines = [
    `# ${report.title} Variant Consolidation Report`,
    "",
    `- Group ID: \`${report.groupId}\``,
    `- Status: \`${report.status}\``,
    `- Hub path: \`${report.hubPath}\``,
    `- Dry run: \`${report.dryRun}\``,
    `- Hub links updated: \`${report.hubLinksUpdated}\``,
    ""
  ];

  if (report.skippedItems.length > 0) {
    lines.push("## Skipped Items", "");
    for (const item of report.skippedItems) {
      lines.push(`- ${item}`);
    }
    lines.push("");
  }

  lines.push("## Variants", "");
  for (const variant of report.variantsProcessed) {
    lines.push(`### Variant ${variant.variantNumber}`, "");
    lines.push(`- From: \`${variant.fromSitesPath ?? "n/a"}\``);
    lines.push(`- To: \`${variant.toPath}\``);
    lines.push(`- Files moved/copied: ${variant.filesMovedCopied.length}`);
    lines.push(`- Old path removed: \`${variant.oldPathRemoved}\``);
    lines.push(`- Hub links updated: \`${variant.hubLinksUpdated}\``);
    lines.push(`- Skipped items: ${variant.skippedItems.length > 0 ? variant.skippedItems.join("; ") : "none"}`);
    lines.push(`- Warnings: ${variant.warnings.length > 0 ? variant.warnings.join("; ") : "none"}`);
    lines.push(`- Errors: ${variant.errors.length > 0 ? variant.errors.join("; ") : "none"}`);
    lines.push("");
  }

  lines.push("## Warnings", "");
  if (report.warnings.length === 0) {
    lines.push("- None", "");
  } else {
    for (const warning of report.warnings) {
      lines.push(`- ${warning}`);
    }
    lines.push("");
  }

  lines.push("## Errors", "");
  if (report.errors.length === 0) {
    lines.push("- None", "");
  } else {
    for (const error of report.errors) {
      lines.push(`- ${error}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

function markdownForAggregateReport(aggregateReport) {
  const lines = [
    "# All Variant Consolidation Report",
    "",
    `- Dry run: \`${aggregateReport.dryRun}\``,
    `- Groups processed: \`${aggregateReport.summary.groupsProcessed}\``,
    `- Variants planned: \`${aggregateReport.summary.variantsPlanned}\``,
    `- Variants moved: \`${aggregateReport.summary.variantsMoved}\``,
    `- Variants with errors: \`${aggregateReport.summary.variantsWithErrors}\``,
    `- Warnings: \`${aggregateReport.summary.warnings}\``,
    `- Errors: \`${aggregateReport.summary.errors}\``,
    ""
  ];

  for (const report of aggregateReport.groups) {
    lines.push(`## ${report.title}`, "");
    lines.push(`- Group ID: \`${report.groupId}\``);
    lines.push(`- Status: \`${report.status}\``);
    lines.push(`- Hub path: \`${report.hubPath}\``);
    lines.push(`- Hub links updated: \`${report.hubLinksUpdated}\``);
    lines.push(`- Variants processed: \`${report.variantsProcessed.length}\``);
    lines.push(`- Warnings: \`${report.warnings.length}\``);
    lines.push(`- Errors: \`${report.errors.length}\``);
    lines.push("");
  }

  return lines.join("\n");
}

function writeReportFiles(baseName, jsonData, markdownContent) {
  ensureDirectory(dataReportDir);
  ensureDirectory(docsReportDir);

  const jsonOutputPath = path.join(dataReportDir, `${baseName}.json`);
  const markdownOutputPath = path.join(docsReportDir, `${baseName}.md`);

  fs.writeFileSync(jsonOutputPath, `${JSON.stringify(jsonData, null, 2)}\n`, "utf8");
  fs.writeFileSync(markdownOutputPath, `${markdownContent}\n`, "utf8");

  return {
    jsonOutputPath,
    markdownOutputPath
  };
}

function exitWithSummary(summary, reportPaths, hasErrors, dryRun) {
  const modeLabel = dryRun ? "DRY-RUN" : "APPLY";
  console.log(`${modeLabel} summary: groups=${summary.groupsProcessed}, variants=${summary.variantsPlanned}, moved=${summary.variantsMoved}, warnings=${summary.warnings}, errors=${summary.errors}`);
  console.log(`Reports: ${path.relative(repoRoot, reportPaths.jsonOutputPath)} | ${path.relative(repoRoot, reportPaths.markdownOutputPath)}`);

  if (hasErrors) {
    process.exitCode = 1;
  }
}

function main() {
  let parsedArgs;

  try {
    parsedArgs = parseArgs(args);
  } catch (error) {
    console.error(`Argument error: ${error.message}`);
    printUsage();
    process.exit(1);
  }

  if (parsedArgs.help) {
    printUsage();
    return;
  }

  const migrationMap = readJson(mapPath);
  const groupById = new Map(migrationMap.groups.map((group) => [group.groupId, group]));
  const dryRun = !parsedArgs.apply;

  if (parsedArgs.groupId && !groupById.has(parsedArgs.groupId)) {
    console.error(`Validation error: group not found in migration map: ${parsedArgs.groupId}`);
    process.exit(1);
  }

  const selectedGroups = parsedArgs.all
    ? migrationMap.groups.filter((group) => group.status !== "completed")
    : [groupById.get(parsedArgs.groupId)];

  const groupReports = selectedGroups.map((group) => processGroup(group, dryRun));
  const summary = summarizeReport(groupReports);
  const hasErrors = groupReports.some((report) => report.errors.length > 0);

  if (parsedArgs.all) {
    const aggregateReport = {
      generatedAt: new Date().toISOString(),
      dryRun,
      groups: groupReports,
      summary
    };
    const reportPaths = writeReportFiles(
      "all-variant-consolidation-report",
      aggregateReport,
      markdownForAggregateReport(aggregateReport)
    );
    exitWithSummary(summary, reportPaths, hasErrors, dryRun);
    return;
  }

  const groupReport = groupReports[0];
  const reportPaths = writeReportFiles(
    `${groupReport.groupId}-variant-consolidation-report`,
    groupReport,
    markdownForGroupReport(groupReport)
  );
  exitWithSummary(summary, reportPaths, hasErrors, dryRun);
}

main();
