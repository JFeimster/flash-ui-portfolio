param(
  [switch]$Apply
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$sitesRoot = Join-Path $repoRoot "sites"
$dataRoot = Join-Path $repoRoot "data"
$docsRoot = Join-Path $repoRoot "docs"

Add-Type -AssemblyName System.IO.Compression.FileSystem

function ConvertTo-Slug {
  param([string]$Name)
  $slug = $Name.ToLowerInvariant()
  $slug = [regex]::Replace($slug, "[^a-z0-9]+", "-")
  $slug = $slug.Trim("-")
  if ($slug.Length -eq 0) { return "site" }
  return $slug
}

function Get-RelativePath {
  param([string]$Base, [string]$Path)
  $baseUri = [Uri]([IO.Path]::GetFullPath($Base).TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar)
  $pathUri = [Uri]([IO.Path]::GetFullPath($Path))
  return [Uri]::UnescapeDataString($baseUri.MakeRelativeUri($pathUri).ToString()).Replace("/", [IO.Path]::DirectorySeparatorChar)
}

function Get-ZipEntryText {
  param($Zip, [string]$EntryName)
  $entry = $Zip.Entries | Where-Object { $_.FullName.Replace("\", "/") -ieq $EntryName } | Select-Object -First 1
  if (-not $entry -or $entry.Length -gt 262144) { return $null }
  $stream = $entry.Open()
  try {
    $reader = [IO.StreamReader]::new($stream)
    try { return $reader.ReadToEnd() } finally { $reader.Dispose() }
  } finally {
    $stream.Dispose()
  }
}

function Get-AppRoot {
  param([string]$EntryName)
  $normalized = $EntryName.Replace("\", "/").Trim("/")
  if ($normalized -ieq "index.html") { return "" }
  return ($normalized -replace "/index\.html$", "")
}

function Test-EntryUnderRoot {
  param([string]$EntryName, [string]$Root, [string]$Relative)
  $prefix = if ($Root.Length -eq 0) { "" } else { "$Root/" }
  return $EntryName -ieq "$prefix$Relative"
}

function Get-ZipClassification {
  param([string]$ZipPath, [string]$AssetRoot)

  $fileName = [IO.Path]::GetFileName($ZipPath)
  $relativeZip = Get-RelativePath -Base $repoRoot -Path $ZipPath
  try {
    $zip = [IO.Compression.ZipFile]::OpenRead($ZipPath)
  } catch {
    $size = (Get-Item -LiteralPath $ZipPath).Length
    return [pscustomobject]@{
      zip = $relativeZip.Replace("\", "/")
      fileName = $fileName
      sizeBytes = $size
      classification = "unknown-needs-manual-review"
      reason = "Archive could not be opened as a valid ZIP: $($_.Exception.Message)"
      chosenRoot = $null
      entryCount = 0
      hasIndex = $false
      indexRoots = @()
      hasPackageJson = $false
      hasNestedZip = $false
      markdownFiles = 0
      score = -100
    }
  }
  try {
    $entries = @($zip.Entries | Where-Object { -not [string]::IsNullOrWhiteSpace($_.Name) } | ForEach-Object {
      $_.FullName.Replace("\", "/").TrimStart("/")
    } | Where-Object {
      $_ -notmatch "(^|/)__MACOSX(/|$)" -and
      $_ -notmatch "(^|/)\.DS_Store$" -and
      $_ -notmatch "(^|/)Thumbs\.db$"
    })

    $unsafe = @($entries | Where-Object {
      $_ -match "^[a-zA-Z]:" -or $_.StartsWith("/") -or $_.StartsWith("../") -or $_ -match "/\.\.(/|$)"
    })
    $nestedZip = @($entries | Where-Object { $_ -match "\.zip$" })
    $indexEntries = @($entries | Where-Object { $_ -match "(^|/)index\.html$" })
    $packageEntries = @($entries | Where-Object { $_ -match "(^|/)package\.json$" })
    $mdEntries = @($entries | Where-Object { $_ -match "\.md$" })
    $nextConfigEntries = @($entries | Where-Object { $_ -match "(^|/)next\.config\.(js|mjs|ts)$" -or $_ -match "(^|/)vite\.config\.(js|mjs|ts)$" -or $_ -match "(^|/)tsconfig\.json$" })
    $sourceDirEntries = @($entries | Where-Object { $_ -match "(^|/)(app|pages|src)/" })
    $componentEntries = @($entries | Where-Object { $_ -match "(^|/)(page|layout)\.tsx$" -or $_ -match "\.(tsx|jsx)$" })
    $appName = $fileName -match "(?i)next|nextjs|next-js|react|vite|\bapp\b"
    $wixName = $fileName -match "(?i)wix|velo"
    $notionName = $fileName -match "(?i)notion"
    $docsName = $fileName -match "(?i)markdown|\bmd\b|docs"

    $packageText = $null
    if ($packageEntries.Count -gt 0) {
      $packageText = Get-ZipEntryText -Zip $zip -EntryName $packageEntries[0]
    }
    $packageLooksApp = $false
    if ($packageText -and ($packageText -match "(?i)`"next`"|" + "`"react`"|" + "`"vite`"|" + "`"@vitejs/")) {
      $packageLooksApp = $true
    }

    $indexRoots = @($indexEntries | ForEach-Object { Get-AppRoot $_ } | Sort-Object -Unique)
    $staticCandidates = @()
    foreach ($root in $indexRoots) {
      $hasPackageAtRoot = $false
      foreach ($pkg in $packageEntries) {
        if (Test-EntryUnderRoot -EntryName $pkg -Root $root -Relative "package.json") {
          $hasPackageAtRoot = $true
        }
      }
      $assetCount = @($entries | Where-Object {
        $relative = if ($root.Length -eq 0) { $_ } elseif ($_.StartsWith("$root/")) { $_.Substring($root.Length + 1) } else { $null }
        $relative -and (
          $relative -match "(^|/)(assets|images|img|css|js|fonts)/" -or
          $relative -match "\.(css|js|mjs|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|otf)$"
        )
      }).Count

      if (-not $hasPackageAtRoot) {
        $staticCandidates += [pscustomobject]@{
          root = $root
          index = if ($root.Length -eq 0) { "index.html" } else { "$root/index.html" }
          assetCount = $assetCount
        }
      }
    }

    $label = "unknown-needs-manual-review"
    $reason = "No direct static index.html found."
    $chosenRoot = $null

    if ($unsafe.Count -gt 0) {
      $label = "unknown-needs-manual-review"
      $reason = "Unsafe or malformed paths found in archive."
    } elseif ($nestedZip.Count -gt 0) {
      $label = "unknown-needs-manual-review"
      $reason = "Archive contains nested ZIP files."
    } elseif ($packageEntries.Count -gt 0 -and ($nextConfigEntries.Count -gt 0 -or $sourceDirEntries.Count -gt 0 -or $componentEntries.Count -gt 0 -or $packageLooksApp)) {
      $label = "nextjs-app-needs-standalone-deploy"
      $reason = "Archive contains package.json and app framework indicators."
    } elseif ($indexEntries.Count -eq 0 -and ($nextConfigEntries.Count -gt 0 -or $sourceDirEntries.Count -gt 0 -or $componentEntries.Count -gt 0 -or $appName)) {
      $label = "nextjs-app-needs-standalone-deploy"
      $reason = "Archive contains app source indicators and no static index.html."
    } elseif ($wixName -and $indexEntries.Count -eq 0) {
      $label = "wix-archive-needs-review"
      $reason = "Filename suggests Wix/Velo and no direct static index.html was found."
    } elseif (($notionName -or $docsName -or $mdEntries.Count -gt 0) -and $indexEntries.Count -eq 0) {
      $label = if ($notionName) { "notion-archive-needs-review" } else { "docs-archive-needs-review" }
      $reason = "Archive looks like docs/markdown and has no direct static index.html."
    } elseif ($staticCandidates.Count -eq 1) {
      $label = "static-candidate"
      $chosenRoot = $staticCandidates[0].root
      $reason = "Archive has one static index.html root without package.json."
    } elseif ($staticCandidates.Count -gt 1) {
      $sameWrapper = @($staticCandidates | Where-Object { $_.root.Split("/").Count -le 2 })
      if ($sameWrapper.Count -eq 1) {
        $label = "static-candidate"
        $chosenRoot = $sameWrapper[0].root
        $reason = "Archive has one preferred shallow static root."
      } else {
        $label = "unknown-needs-manual-review"
        $reason = "Archive contains multiple competing static index.html roots."
      }
    } elseif ($packageEntries.Count -gt 0) {
      $label = "nextjs-app-needs-standalone-deploy"
      $reason = "Archive contains package.json but no eligible static root."
    } elseif ($wixName) {
      $label = "wix-archive-needs-review"
      $reason = "Filename suggests Wix/Velo and archive is not a clean static site."
    } elseif ($notionName -or $docsName -or $mdEntries.Count -gt 0) {
      $label = if ($notionName) { "notion-archive-needs-review" } else { "docs-archive-needs-review" }
      $reason = "Archive looks like docs/markdown and is not a clean static site."
    }

    $fileNameScore = 0
    if ($fileName -match "(?i)static|html|site|website|landing") { $fileNameScore += 20 }
    if ($fileName -match "(?i)next|react|app|package|notion|markdown|\bmd\b|docs|wix|velo") { $fileNameScore -= 15 }
    $size = (Get-Item -LiteralPath $ZipPath).Length

    $assetScore = 0
    foreach ($candidate in $staticCandidates) { $assetScore += [int]$candidate.assetCount }

    return [pscustomobject]@{
      zip = $relativeZip.Replace("\", "/")
      fileName = $fileName
      sizeBytes = $size
      classification = $label
      reason = $reason
      chosenRoot = $chosenRoot
      entryCount = $entries.Count
      hasIndex = $indexEntries.Count -gt 0
      indexRoots = $indexRoots
      hasPackageJson = $packageEntries.Count -gt 0
      hasNestedZip = $nestedZip.Count -gt 0
      markdownFiles = $mdEntries.Count
      score = ($assetScore + $fileNameScore - [int]($size / 1MB))
    }
  } finally {
    $zip.Dispose()
  }
}

function Expand-StaticZip {
  param($Classification, [string]$AssetRoot)

  $zipPath = Join-Path $repoRoot $Classification.zip
  $zip = [IO.Compression.ZipFile]::OpenRead($zipPath)
  $written = New-Object System.Collections.Generic.List[string]
  $backups = New-Object System.Collections.Generic.List[string]
  try {
    $root = [string]$Classification.chosenRoot
    $prefix = if ($root.Length -eq 0) { "" } else { "$root/" }
    foreach ($entry in $zip.Entries) {
      if ([string]::IsNullOrWhiteSpace($entry.Name)) { continue }
      $name = $entry.FullName.Replace("\", "/").TrimStart("/")
      if ($name -match "(^|/)__MACOSX(/|$)" -or $name -match "(^|/)\.DS_Store$" -or $name -match "(^|/)Thumbs\.db$") { continue }
      if ($prefix.Length -gt 0) {
        if (-not $name.StartsWith($prefix)) { continue }
        $relative = $name.Substring($prefix.Length)
      } else {
        $relative = $name
      }
      if ([string]::IsNullOrWhiteSpace($relative) -or $relative.EndsWith("/")) { continue }
      if ($relative -match "^[a-zA-Z]:" -or $relative.StartsWith("/") -or $relative.StartsWith("../") -or $relative -match "/\.\.(/|$)") {
        throw "Unsafe target path in $($Classification.zip): $relative"
      }
      $target = Join-Path $AssetRoot ($relative.Replace("/", [IO.Path]::DirectorySeparatorChar))
      $resolvedParent = [IO.Path]::GetFullPath((Split-Path -Parent $target))
      $assetFull = [IO.Path]::GetFullPath($AssetRoot)
      if (-not $resolvedParent.StartsWith($assetFull, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Resolved target escapes asset root: $target"
      }
      New-Item -ItemType Directory -Force -Path $resolvedParent | Out-Null
      if (Test-Path -LiteralPath $target) {
        $existingBytes = [IO.File]::ReadAllBytes($target)
        $stream = $entry.Open()
        try {
          $ms = [IO.MemoryStream]::new()
          try {
            $stream.CopyTo($ms)
            $newBytes = $ms.ToArray()
          } finally {
            $ms.Dispose()
          }
        } finally {
          $stream.Dispose()
        }
        $same = $existingBytes.Length -eq $newBytes.Length
        if ($same) {
          for ($i = 0; $i -lt $existingBytes.Length; $i++) {
            if ($existingBytes[$i] -ne $newBytes[$i]) { $same = $false; break }
          }
        }
        if (-not $same) {
          $backupRoot = Join-Path $AssetRoot "_extraction-backups"
          $backupTarget = Join-Path $backupRoot ($relative.Replace("/", [IO.Path]::DirectorySeparatorChar))
          New-Item -ItemType Directory -Force -Path (Split-Path -Parent $backupTarget) | Out-Null
          Copy-Item -LiteralPath $target -Destination $backupTarget -Force
          [IO.File]::WriteAllBytes($target, $newBytes)
          $backups.Add((Get-RelativePath -Base $repoRoot -Path $backupTarget).Replace("\", "/")) | Out-Null
        }
      } else {
        [IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $target)
      }
      $written.Add((Get-RelativePath -Base $repoRoot -Path $target).Replace("\", "/")) | Out-Null
    }
  } finally {
    $zip.Dispose()
  }
  return [pscustomobject]@{
    writtenFiles = @($written)
    backupFiles = @($backups)
  }
}

New-Item -ItemType Directory -Force -Path $dataRoot, $docsRoot | Out-Null

$assetFolders = @(Get-ChildItem -LiteralPath $sitesRoot -Directory | Sort-Object Name)
$folderReports = @()
$allZipReports = @()

foreach ($folder in $assetFolders) {
  $zipFiles = @(Get-ChildItem -LiteralPath $folder.FullName -Recurse -File -Filter *.zip | Sort-Object FullName)
  $hasIndexBefore = Test-Path -LiteralPath (Join-Path $folder.FullName "index.html")
  $hasPackageBefore = Test-Path -LiteralPath (Join-Path $folder.FullName "package.json")
  $classifications = @()
  foreach ($zipFile in $zipFiles) {
    $classification = Get-ZipClassification -ZipPath $zipFile.FullName -AssetRoot $folder.FullName
    $classifications += $classification
    $allZipReports += $classification
  }

  $extractionStatus = if ($hasIndexBefore) { "static-site-existing" } elseif ($hasPackageBefore) { "nextjs-app-needs-standalone-deploy" } else { "unknown-needs-manual-review" }
  $recommendedAction = if ($hasIndexBefore) { "Already has root index.html; no extraction performed." } elseif ($hasPackageBefore) { "Keep as standalone app deployment." } else { "Manual review needed; no eligible static ZIP found." }
  $selected = $null
  $extractionResult = $null
  $notes = New-Object System.Collections.Generic.List[string]

  if ($hasIndexBefore) {
    $notes.Add("Skipped extraction because root index.html already exists.") | Out-Null
  } elseif (-not $hasPackageBefore) {
    $staticCandidates = @($classifications | Where-Object { $_.classification -eq "static-candidate" } | Sort-Object @{Expression="score";Descending=$true}, @{Expression="sizeBytes";Descending=$false})
    if ($staticCandidates.Count -gt 0) {
      $selected = $staticCandidates[0]
      if ($Apply) {
        try {
          $extractionResult = Expand-StaticZip -Classification $selected -AssetRoot $folder.FullName
          $extractionStatus = "static-site-extracted"
          $recommendedAction = "Static ZIP extracted and flattened where needed."
        } catch {
          $extractionStatus = "extraction-failed"
          $recommendedAction = "Review extraction error and ZIP contents manually."
          $notes.Add($_.Exception.Message) | Out-Null
        }
      } else {
        $extractionStatus = "planned-static-site-extraction"
        $recommendedAction = "Apply extraction from selected static ZIP."
      }
      foreach ($alternate in @($staticCandidates | Where-Object { $_.zip -ne $selected.zip })) {
        $alternate.classification = "duplicate-static-alternate"
      }
    } elseif (@($classifications | Where-Object { $_.classification -eq "nextjs-app-needs-standalone-deploy" }).Count -gt 0) {
      $extractionStatus = "nextjs-app-needs-standalone-deploy"
      $recommendedAction = "Deploy as standalone app if this folder should be live."
    } elseif ($zipFiles.Count -eq 0) {
      $extractionStatus = "unknown-needs-manual-review"
      $recommendedAction = "No ZIP packages found."
    }
  }

  $hasIndexAfter = Test-Path -LiteralPath (Join-Path $folder.FullName "index.html")
  $hasPackageAfter = Test-Path -LiteralPath (Join-Path $folder.FullName "package.json")
  $sourcePackages = @($classifications | Where-Object { $_.classification -ne "static-candidate" -and $_.classification -ne "duplicate-static-alternate" } | ForEach-Object { $_.zip })
  $needsStandalone = $hasPackageAfter -or (@($classifications | Where-Object { $_.classification -eq "nextjs-app-needs-standalone-deploy" }).Count -gt 0 -and -not $hasIndexAfter)

  $folderReports += [pscustomobject]@{
    title = $folder.Name
    slug = ConvertTo-Slug $folder.Name
    path = ("sites/" + $folder.Name)
    livePath = ("/sites/" + $folder.Name + "/")
    hasIndex = $hasIndexAfter
    hasPackageJson = $hasPackageAfter
    hasZip = $zipFiles.Count -gt 0
    sourcePackages = $sourcePackages
    extractionStatus = $extractionStatus
    selectedStaticPackage = if ($selected) { $selected.zip } else { $null }
    packageClassifications = @($classifications | ForEach-Object {
      [pscustomobject]@{
        zip = $_.zip
        classification = $_.classification
        reason = $_.reason
        hasIndex = $_.hasIndex
        hasPackageJson = $_.hasPackageJson
        chosenRoot = $_.chosenRoot
      }
    })
    recommendedAction = $recommendedAction
    needsStandaloneDeploy = $needsStandalone
    notes = @($notes)
    writtenFiles = if ($extractionResult) { $extractionResult.writtenFiles } else { @() }
    backupFiles = if ($extractionResult) { $extractionResult.backupFiles } else { @() }
  }
}

$summary = [pscustomobject]@{
  generatedAt = (Get-Date).ToString("o")
  apply = [bool]$Apply
  foldersScanned = $assetFolders.Count
  zipFilesInspected = $allZipReports.Count
  staticSitesExtracted = @($folderReports | Where-Object { $_.extractionStatus -eq "static-site-extracted" }).Count
  plannedStaticSites = @($folderReports | Where-Object { $_.extractionStatus -eq "planned-static-site-extraction" }).Count
  foldersAlreadyHadIndex = @($folderReports | Where-Object { $_.extractionStatus -eq "static-site-existing" }).Count
  nextjsPackagesFound = @($allZipReports | Where-Object { $_.classification -eq "nextjs-app-needs-standalone-deploy" }).Count
  docsNotionWixPackagesFound = @($allZipReports | Where-Object { $_.classification -in @("docs-archive-needs-review", "notion-archive-needs-review", "wix-archive-needs-review") }).Count
  unknownManualReviewPackages = @($allZipReports | Where-Object { $_.classification -eq "unknown-needs-manual-review" }).Count
  skippedFolders = @($folderReports | Where-Object { $_.extractionStatus -in @("static-site-existing", "unknown-needs-manual-review", "nextjs-app-needs-standalone-deploy") }).Count
  failedExtractions = @($folderReports | Where-Object { $_.extractionStatus -eq "extraction-failed" }).Count
  foldersNeedingStandaloneNextDeploy = @($folderReports | Where-Object { $_.needsStandaloneDeploy } | ForEach-Object { $_.path })
  filesChanged = @()
}

$report = [pscustomobject]@{
  summary = $summary
  folders = $folderReports
}

$reportPath = Join-Path $dataRoot "static-zip-extraction-report.json"
$registryPath = Join-Path $dataRoot "site-registry-static-extractions.json"
$markdownPath = Join-Path $docsRoot "static-zip-extraction-report.md"

$report | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $reportPath -Encoding UTF8
$folderReports | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $registryPath -Encoding UTF8

$changed = New-Object System.Collections.Generic.List[string]
$changed.Add("data/static-zip-extraction-report.json") | Out-Null
$changed.Add("data/site-registry-static-extractions.json") | Out-Null
$changed.Add("docs/static-zip-extraction-report.md") | Out-Null
foreach ($folderReport in $folderReports) {
  foreach ($file in $folderReport.writtenFiles) { $changed.Add($file) | Out-Null }
  foreach ($file in $folderReport.backupFiles) { $changed.Add($file) | Out-Null }
}
$summary.filesChanged = @($changed | Sort-Object -Unique)
$report.summary = $summary
$report | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $reportPath -Encoding UTF8

$md = New-Object System.Collections.Generic.List[string]
$md.Add("# Static ZIP Extraction Report") | Out-Null
$md.Add("") | Out-Null
$md.Add("- Generated: $($summary.generatedAt)") | Out-Null
$md.Add("- Apply mode: $($summary.apply)") | Out-Null
$md.Add("- Folders scanned: $($summary.foldersScanned)") | Out-Null
$md.Add("- ZIP files inspected: $($summary.zipFilesInspected)") | Out-Null
$md.Add("- Static sites extracted: $($summary.staticSitesExtracted)") | Out-Null
$md.Add("- Planned static sites: $($summary.plannedStaticSites)") | Out-Null
$md.Add("- Folders already had index.html: $($summary.foldersAlreadyHadIndex)") | Out-Null
$md.Add("- Next.js/app packages found: $($summary.nextjsPackagesFound)") | Out-Null
$md.Add("- Docs/Notion/Wix packages found: $($summary.docsNotionWixPackagesFound)") | Out-Null
$md.Add("- Unknown/manual-review packages: $($summary.unknownManualReviewPackages)") | Out-Null
$md.Add("- Failed extractions: $($summary.failedExtractions)") | Out-Null
$md.Add("") | Out-Null
$md.Add("## Extracted Static Sites") | Out-Null
foreach ($folderReport in @($folderReports | Where-Object { $_.extractionStatus -eq "static-site-extracted" -or $_.extractionStatus -eq "planned-static-site-extraction" })) {
  $md.Add("- $($folderReport.path): $($folderReport.selectedStaticPackage)") | Out-Null
}
$md.Add("") | Out-Null
$md.Add("## Existing Static Sites") | Out-Null
foreach ($folderReport in @($folderReports | Where-Object { $_.extractionStatus -eq "static-site-existing" })) {
  $md.Add("- $($folderReport.path)") | Out-Null
}
$md.Add("") | Out-Null
$md.Add("## Manual Review Items") | Out-Null
foreach ($folderReport in @($folderReports | Where-Object { $_.extractionStatus -in @("unknown-needs-manual-review", "extraction-failed") })) {
  $md.Add("- $($folderReport.path): $($folderReport.recommendedAction)") | Out-Null
}
$md.Add("") | Out-Null
$md.Add("## Standalone App Deployments") | Out-Null
foreach ($folderReport in @($folderReports | Where-Object { $_.needsStandaloneDeploy })) {
  $md.Add("- $($folderReport.path)") | Out-Null
}
$md.Add("") | Out-Null
$md.Add("## Package Classifications") | Out-Null
foreach ($folderReport in $folderReports) {
  if ($folderReport.packageClassifications.Count -eq 0) { continue }
  $md.Add("") | Out-Null
  $md.Add("### $($folderReport.path)") | Out-Null
  foreach ($pkg in $folderReport.packageClassifications) {
    $md.Add("- $($pkg.classification): $($pkg.zip) - $($pkg.reason)") | Out-Null
  }
}
$md | Set-Content -LiteralPath $markdownPath -Encoding UTF8

$summary | ConvertTo-Json -Depth 8
