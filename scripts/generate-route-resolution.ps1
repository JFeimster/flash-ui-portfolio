param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$dataRoot = Join-Path $RepoRoot "data"

function Read-Json([string]$RelativePath) {
  $path = Join-Path $RepoRoot $RelativePath
  if (-not (Test-Path -LiteralPath $path)) { return $null }
  return Get-Content -LiteralPath $path -Raw | ConvertFrom-Json
}

function As-Array($Value) {
  if ($null -eq $Value) { return @() }
  return @($Value)
}

function Slugify([string]$Value) {
  $slug = ([string]$Value).ToLowerInvariant()
  $slug = [regex]::Replace($slug, "[^a-z0-9]+", "-").Trim("-")
  return $slug
}

function Normalize-Key([string]$Value) {
  $value = ([string]$Value).Trim() -replace "^/?sites/", "" -replace "(/index\.html|\.html)$", ""
  return Slugify $value
}

function Normalize-Path([string]$Value) {
  if ([string]::IsNullOrWhiteSpace($Value)) { return "" }
  $path = ([string]$Value).Replace("\\", "/")
  if (-not $path.StartsWith("/")) { $path = "/$path" }
  return $path
}

function To-RepoPath([string]$Value) {
  $path = ([string]$Value).Replace("/", "\").TrimStart("\")
  return Join-Path $RepoRoot $path
}

function Has-Entrypoint([string]$RepoPath) {
  if (-not (Test-Path -LiteralPath $RepoPath)) { return $false }
  $item = Get-Item -LiteralPath $RepoPath
  if ($item.PSIsContainer) { return Test-Path -LiteralPath (Join-Path $RepoPath "index.html") }
  return $item.Extension -ieq ".html"
}

function Is-Archive($Item) {
  return ([string](Get-Value $Item "type" "") -match "archive|docs") -or [bool](Get-Value $Item "hasZip" $false) -or [bool](Get-Value $Item "hasMarkdown" $false) -or ([string](Get-Value $Item "status" "") -match "archive")
}

function Is-Standalone($Item) {
  return ([string](Get-Value $Item "type" "") -eq "nextjs-app") -or [bool](Get-Value $Item "needsStandaloneDeploy" $false) -or [bool](Get-Value $Item "hasPackageJson" $false)
}

function Get-Value($Object, [string]$Name, $Default = $null) {
  if ($null -eq $Object) { return $Default }
  if ($Object.PSObject.Properties.Name -contains $Name -and $null -ne $Object.$Name) { return $Object.$Name }
  return $Default
}

function Plain-Text([string]$Value) {
  return [System.Net.WebUtility]::HtmlDecode(([regex]::Replace($Value, '<[^>]+>', ' ') -replace '\s+', ' ')).Trim()
}

function Read-HtmlMetadata([string]$File) {
  $html = Get-Content -LiteralPath $File -Raw
  $title = Plain-Text ([regex]::Match($html, '(?is)<title\b[^>]*>(.*?)</title>').Groups[1].Value)
  $heading = Plain-Text ([regex]::Match($html, '(?is)<h1\b[^>]*>(.*?)</h1>').Groups[1].Value)
  $description = ''
  foreach ($meta in [regex]::Matches($html, '(?is)<meta\b[^>]*>')) {
    if ($meta.Value -match '(?i)\bname\s*=\s*["'']description["'']') {
      $description = Plain-Text ([regex]::Match($meta.Value, '(?is)\bcontent\s*=\s*(["''])(.*?)\1').Groups[2].Value)
    }
  }
  return @{
    documentTitle = $title; sourceHeading = $heading; description = $description
    structuralValidity = [ordered]@{
      hasHtml = $html -match '(?i)<html\b'; hasBody = $html -match '(?i)<body\b'
      hasTitle = [bool]$title
      valid = ($html -match '(?i)<html\b') -and ($html -match '(?i)<body\b') -and ($html -match '(?i)</body\s*>') -and ($html -match '(?i)</html\s*>')
    }
  }
}

$baseRegistry = As-Array (Read-Json "data/site-registry.json")
$staticRegistry = As-Array (Read-Json "data/site-registry-static-extractions.json")
$batch = Read-Json "data/site-registry-batch-5-additions.json"
$groupsData = Read-Json "data/asset-groups.json"
$migrationData = Read-Json "data/variant-migration-map.json"
$verificationData = Read-Json "data/live-path-smoke-test.json"

$batchItems = @()
foreach ($file in As-Array (Get-Value $batch "rootHtml" @())) {
  $batchItems += [pscustomobject]@{ title = "sites $file"; path = "sites/$file"; type = "sites-root-html"; sourceFile = "data/site-registry-batch-5-additions.json" }
}
foreach ($tuple in As-Array (Get-Value $batch "static" @())) {
  $name = [string]$tuple[0]
  $subdir = if ($tuple.Count -gt 1) { [string]$tuple[1] } else { "" }
  $batchItems += [pscustomobject]@{ title = "sites $name"; path = "sites/$name"; livePath = if ($subdir) { "/sites/$name/$subdir/" } else { "/sites/$name/" }; type = "static-site"; sourceFile = "data/site-registry-batch-5-additions.json" }
}
foreach ($name in As-Array (Get-Value $batch "docs" @())) {
  $batchItems += [pscustomobject]@{ title = "sites $name"; path = "sites/$name"; type = "docs-archive"; status = "archive-needs-review"; hasMarkdown = $true; sourceFile = "data/site-registry-batch-5-additions.json" }
}
foreach ($tuple in As-Array (Get-Value $batch "apps" @())) {
  $batchItems += [pscustomobject]@{ title = "sites $($tuple[0])"; path = "sites/$($tuple[1])"; type = "nextjs-app"; status = "nested-app-needs-standalone-deploy"; needsStandaloneDeploy = $true; hasPackageJson = $true; sourceFile = "data/site-registry-batch-5-additions.json" }
}

$allEntries = @()
foreach ($item in $baseRegistry) {
  $item | Add-Member -NotePropertyName sourceFile -NotePropertyValue "data/site-registry.json" -Force
  $allEntries += $item
}
foreach ($item in $staticRegistry) {
  $item | Add-Member -NotePropertyName sourceFile -NotePropertyValue "data/site-registry-static-extractions.json" -Force
  $allEntries += $item
}
$allEntries += $batchItems

$groupByKey = @{}
$groupDefinitions = @{}
foreach ($group in As-Array (Get-Value $groupsData "groups" @())) {
  $groupId = [string](Get-Value $group "groupId" "")
  if (-not $groupId) { continue }
  $groupDefinitions[$groupId] = $group
  $keys = @($groupId, (Get-Value $group "displayTitle" ""), (Get-Value $group "recommendedPrimary" "")) + (As-Array (Get-Value $group "items" @()))
  foreach ($key in $keys) {
    if ($key) { $groupByKey[(Normalize-Key $key)] = $groupId }
  }
}
foreach ($item in $baseRegistry | Where-Object { $_.type -eq "group-hub" }) {
  $groupId = [string]$item.slug
  if (-not $groupDefinitions.ContainsKey($groupId)) {
    $groupDefinitions[$groupId] = [pscustomobject]@{
      groupId = $groupId; displayTitle = [string]$item.title; category = [string]$item.category
      groupType = "variant-set"; recommendedPrimary = ""; confidence = "registry"
      items = @(); variantCount = @($item.variantNumbers).Count; hubPath = "/$($item.path.Trim('/'))/"
    }
  }
  foreach ($key in @($item.slug, $item.title, $item.path)) { $groupByKey[(Normalize-Key $key)] = $groupId }
}

$migrationByKey = @{}
foreach ($group in As-Array (Get-Value $migrationData "groups" @())) {
  foreach ($variant in As-Array (Get-Value $group "variants" @())) {
    $from = [string](Get-Value $variant "fromSite" "")
    $to = [string](Get-Value $variant "toPath" "")
    if ($from -and $to) { $migrationByKey[(Normalize-Key $from)] = [pscustomobject]@{ groupId = [string]$group.groupId; toPath = Normalize-Path $to; source = "data/variant-migration-map.json" } }
  }
}

$verificationByPath = @{}
foreach ($result in As-Array (Get-Value $verificationData "results" @())) {
  $key = Normalize-Path (Get-Value $result "livePath" "")
  if ($key) { $verificationByPath[$key] = $result }
}

$merged = [ordered]@{}
foreach ($item in @($baseRegistry) + @($staticRegistry) + @($batchItems)) {
  $key = [string](Get-Value $item "path" (Get-Value $item "slug" (Get-Value $item "title" "")))
  if ($key -and -not $merged.Contains($key)) { $merged[$key] = $item }
}

$resolvedEntries = @()
foreach ($item in $merged.Values) {
  $title = [string](Get-Value $item "title" (Get-Value $item "path" "Untitled asset"))
  $path = [string](Get-Value $item "path" "")
  $originalPath = Normalize-Path (Get-Value $item "livePath" $path)
  $titleKey = Normalize-Key $title
  $pathKey = Normalize-Key $path
  $migration = if ($migrationByKey.ContainsKey($titleKey)) { $migrationByKey[$titleKey] } elseif ($migrationByKey.ContainsKey($pathKey)) { $migrationByKey[$pathKey] } else { $null }
  $groupId = if ($migration) { $migration.groupId } elseif ($groupByKey.ContainsKey($titleKey)) { $groupByKey[$titleKey] } elseif ($groupByKey.ContainsKey($pathKey)) { $groupByKey[$pathKey] } else { "" }
  $group = if ($groupId -and $groupDefinitions.ContainsKey($groupId)) { $groupDefinitions[$groupId] } else { $null }
  $originalRepoPath = if ($path) { To-RepoPath $path } else { "" }
  $originalExists = if ($originalRepoPath) { Test-Path -LiteralPath $originalRepoPath } else { $false }
  $originalEntrypoint = if ($originalRepoPath) { Has-Entrypoint $originalRepoPath } else { $false }
  $resolvedPath = ""
  $status = "unresolved"
  $reason = "No verified local entrypoint or canonical destination evidence was found."
  $entrypointEvidence = @("source path: $path")

  if ($migration -and (Has-Entrypoint (To-RepoPath $migration.toPath))) {
    $resolvedPath = Normalize-Path $migration.toPath
    $status = "resolved"
    $reason = "Variant migration metadata matches this historical entry and the canonical target index.html exists."
    $entrypointEvidence += "migration target index: $($migration.toPath)"
  } elseif (Is-Standalone $item) {
    $status = "standalone-app"
    $reason = "Registry marks this asset as an app or standalone deployment candidate."
  } elseif ($group -and $groupId -and ((Normalize-Key $title) -eq (Normalize-Key (Get-Value $group "displayTitle" "")) -or [string](Get-Value $item "type" "") -eq "group-hub")) {
    $hub = [string](Get-Value $group "hubPath" "")
    if (-not $hub) { $hub = "/sites/$groupId/" }
    if (Has-Entrypoint (To-RepoPath $hub)) {
      $resolvedPath = Normalize-Path $hub
      $status = "resolved"
      $reason = "Canonical group metadata matches this hub and the canonical hub index.html exists."
      $entrypointEvidence += "canonical hub index: $hub"
    }
  } elseif ($group -and $groupId -and ((As-Array (Get-Value $group "items" @())) | Where-Object { (Normalize-Key $_) -eq $titleKey })) {
    $variantNumber = 0
    if ($title -match "(?:\s|\()([0-9]+)\)?$") { $variantNumber = [int]$Matches[1] }
    $target = if ($variantNumber -gt 0) { "/sites/$groupId/variant-$variantNumber/" } else { "" }
    if ($target -and (Has-Entrypoint (To-RepoPath $target))) {
      $resolvedPath = $target
      $status = "resolved"
      $reason = "Canonical group item membership and the matching variant index identify the destination."
      $entrypointEvidence += "canonical variant index: $target"
    }
  } elseif (Is-Archive $item) {
    $status = "archive"
    $reason = "Registry marks this asset as an archive, documentation, or source package."
  } elseif ($originalEntrypoint) {
    $resolvedPath = if ((Get-Item -LiteralPath $originalRepoPath).PSIsContainer) { "$(Normalize-Path $path)/" } else { Normalize-Path $path }
    $status = "resolved"
    $reason = "The source path has a local HTML entrypoint."
    $entrypointEvidence += "source entrypoint exists"
  } elseif ($originalExists) {
    $status = "missing-entrypoint"
    $reason = "The source path exists locally but has no index.html entrypoint."
  }

  if ($resolvedPath) {
    $resolvedCandidate = To-RepoPath $resolvedPath
    if ((Test-Path -LiteralPath $resolvedCandidate) -and (Get-Item -LiteralPath $resolvedCandidate).PSIsContainer -and -not $resolvedPath.EndsWith("/")) { $resolvedPath = "$resolvedPath/" }
  }
  $verification = if ($resolvedPath -and $verificationByPath.ContainsKey($resolvedPath)) { $verificationByPath[$resolvedPath] } else { $null }
  $productionStatus = if ($verification -and [string]$verification.result -in @("pass", "redirected-pass")) { "verified" } else { "pending" }
  $resolvedRepoPath = if ($resolvedPath) { To-RepoPath $resolvedPath } else { "" }
  $resolvedEntrypoint = if ($resolvedRepoPath) { Has-Entrypoint $resolvedRepoPath } else { $false }

  $resolvedEntries += [ordered]@{
    title = $title
    slug = [string](Get-Value $item "slug" (Slugify $title))
    category = [string](Get-Value $item "category" "Experiments")
    type = [string](Get-Value $item "type" "unknown")
    source = [string](Get-Value $item "source" "unknown")
    sourceFile = [string](Get-Value $item "sourceFile" "unknown")
    originalPath = $originalPath
    resolvedPath = $resolvedPath
    canonicalGroupId = $groupId
    resolutionStatus = $status
    resolutionReason = $reason
    productionVerification = $productionStatus
    entrypointEvidence = [ordered]@{
      originalPathExists = [bool]$originalExists
      originalEntrypointExists = [bool]$originalEntrypoint
      resolvedEntrypointExists = [bool]$resolvedEntrypoint
      evidence = @($entrypointEvidence)
    }
    notes = [string](Get-Value $item "notes" (Get-Value $item "recommendedAction" ""))
    variantNumbers = @(Get-Value $item "variantNumbers" @())
  }
}

# The filesystem is authoritative for child previews. Historical registries are
# provenance, not an exhaustive list of the HTML that is actually present.
$candidateFolders = [ordered]@{}
$variantFiles = Get-ChildItem -LiteralPath (Join-Path $RepoRoot 'sites') -Directory | ForEach-Object {
  Get-ChildItem -LiteralPath $_.FullName -Directory | Where-Object { $_.Name -match '^variant-\d+$' } | ForEach-Object {
    $index = Join-Path $_.FullName 'index.html'
    if (Test-Path -LiteralPath $index -PathType Leaf) { Get-Item -LiteralPath $index }
  }
}
foreach ($file in $variantFiles) {
  $familyId = $file.Directory.Parent.Name
  $number = [int]($file.Directory.Name -replace '^variant-', '')
  $route = "/sites/$familyId/variant-$number/"
  $sourcePath = "$($route.TrimStart('/'))index.html"
  $metadata = Read-HtmlMetadata $file.FullName
  $matches = @($resolvedEntries | Where-Object { $_.resolvedPath.TrimEnd('/') -eq $route.TrimEnd('/') })
  if ($matches.Count) {
    $entry = $matches[0]
    $entry['historicalRecords'] = @($matches | ForEach-Object { [ordered]@{ title = $_.title; originalPath = $_.originalPath; sourceFile = $_.sourceFile } })
    $resolvedEntries = @($resolvedEntries | Where-Object { $_.resolvedPath.TrimEnd('/') -ne $route.TrimEnd('/') })
  } else {
    $entry = [ordered]@{
      title = "$familyId variant $number"; slug = "$familyId-variant-$number"
      category = if ($groupDefinitions.ContainsKey($familyId)) { Get-Value $groupDefinitions[$familyId] 'category' 'Experiments' } else { 'Experiments' }
      type = 'static-site'; source = 'filesystem'; sourceFile = $sourcePath; originalPath = "/$sourcePath"
      productionVerification = 'pending'; notes = ''; variantNumbers = @()
      entrypointEvidence = [ordered]@{ originalPathExists = $true; originalEntrypointExists = $true; resolvedEntrypointExists = $true; evidence = @("discovered HTML: $sourcePath") }
    }
  }
  foreach ($key in $metadata.Keys) { $entry[$key] = $metadata[$key] }
  $entry['canonicalGroupId'] = $familyId
  $entry['variantNumber'] = $number
  $entry['resolvedPath'] = $route
  $entry['sourcePath'] = $sourcePath
  $entry['resolutionStatus'] = if ($metadata.structuralValidity.valid) { 'resolved' } else { 'invalid-entrypoint' }
  $entry['resolutionReason'] = if ($metadata.structuralValidity.valid) { 'Canonical child HTML discovered on disk; document structure checked.' } else { 'Child file exists but is missing complete HTML/body structure; repair required.' }
  if ($metadata.documentTitle -and $metadata.documentTitle -notmatch '^(Flash UI Export|Untitled|Document)$') { $entry['title'] = $metadata.documentTitle }
  elseif ($metadata.sourceHeading) { $entry['title'] = $metadata.sourceHeading }
  else { $entry['title'] = "Variant $number" }
  $resolvedEntries += $entry
  if (-not $groupDefinitions.ContainsKey($familyId)) {
    if (-not $candidateFolders.Contains($familyId)) { $candidateFolders[$familyId] = @() }
    $candidateFolders[$familyId] += $route
  }
}

# Source actions must point to the current file, including migrated records.
foreach ($entry in $resolvedEntries) {
  if ($entry.resolvedPath) {
    $local = To-RepoPath $entry.resolvedPath
    if (Test-Path -LiteralPath $local) {
      $entry['sourcePath'] = $entry.resolvedPath.TrimStart('/')
      if ((Get-Item -LiteralPath $local).PSIsContainer) { $entry['sourcePath'] = "$($entry.sourcePath.TrimEnd('/'))/index.html" }
    }
  } elseif (Test-Path -LiteralPath (To-RepoPath $entry.originalPath)) {
    $entry['sourcePath'] = $entry.originalPath.TrimStart('/')
  }
  if ($entry.Contains('sourcePath')) {
    $encoded = ($entry.sourcePath.Split('/') | ForEach-Object { [uri]::EscapeDataString($_) }) -join '/'
    $kind = if ([IO.Path]::HasExtension($entry.sourcePath)) { 'blob' } else { 'tree' }
    $entry['sourceUrl'] = "https://github.com/JFeimster/flash-ui-portfolio/$kind/main/$encoded"
  }
}

$groups = @()
foreach ($groupId in $groupDefinitions.Keys) {
  $group = $groupDefinitions[$groupId]
  $hubPath = [string](Get-Value $group "hubPath" "/sites/$groupId/")
  $items = @(Get-Value $group "items" @())
  $variants = @($resolvedEntries | Where-Object { $_.canonicalGroupId -eq $groupId -and $_.resolutionStatus -eq "resolved" -and $_.resolvedPath -match "/variant-\d+/?$" })
  $variantNumbers = @($variants | ForEach-Object { if ($_.resolvedPath -match "/variant-(\d+)/") { [int]$Matches[1] } } | Sort-Object -Unique)
  if (-not $items.Count) { $items = @($variants | ForEach-Object { $_.title }) }
  $groups += [ordered]@{
    groupId = $groupId
    displayTitle = [string](Get-Value $group "displayTitle" $groupId)
    category = [string](Get-Value $group "category" "Experiments")
    groupType = [string](Get-Value $group "groupType" "variant-set")
    confidence = [string](Get-Value $group "confidence" "registry")
    recommendedPrimary = [string](Get-Value $group "recommendedPrimary" "")
    hubPath = Normalize-Path $hubPath
    items = @($items)
    variantNumbers = @($variantNumbers)
    variantCount = @($variantNumbers).Count
  }
}

$summary = [ordered]@{
  totalEntriesExamined = $resolvedEntries.Count
  resolved = @($resolvedEntries | Where-Object { $_.resolutionStatus -eq "resolved" }).Count
  unresolved = @($resolvedEntries | Where-Object { $_.resolutionStatus -eq "unresolved" }).Count
  missingEntrypoint = @($resolvedEntries | Where-Object { $_.resolutionStatus -eq "missing-entrypoint" }).Count
  invalidEntrypoint = @($resolvedEntries | Where-Object { $_.resolutionStatus -eq "invalid-entrypoint" }).Count
  standaloneApps = @($resolvedEntries | Where-Object { $_.resolutionStatus -eq "standalone-app" }).Count
  archives = @($resolvedEntries | Where-Object { $_.resolutionStatus -eq "archive" }).Count
  productionVerified = @($resolvedEntries | Where-Object { $_.productionVerification -eq "verified" }).Count
}

$output = [ordered]@{
  version = "1.1.0"
  generatedAt = (Get-Date).ToUniversalTime().ToString("o")
  sourceFiles = @("data/site-registry.json", "data/site-registry-static-extractions.json", "data/site-registry-batch-5-additions.json", "data/asset-groups.json", "data/variant-migration-map.json")
  verificationNote = "Local entrypoint evidence is structural only; production availability remains unverified until an authorized deployment smoke test is run."
  summary = $summary
  groups = @($groups | Sort-Object displayTitle)
  groupCandidates = @($candidateFolders.Keys | Sort-Object | ForEach-Object {
    [ordered]@{ familyId = $_; paths = @($candidateFolders[$_]); reason = 'Variant folder absent from grouped index; retained for internal review without creating a canonical project.' }
  })
  entries = @($resolvedEntries | Sort-Object title, originalPath)
}

$output | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath (Join-Path $dataRoot "asset-route-resolution.json") -Encoding UTF8
$summary | ConvertTo-Json
