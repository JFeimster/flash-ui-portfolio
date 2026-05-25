param(
  [string]$BaseUrl = "https://flash-ui-portfolio.vercel.app",
  [int]$TimeoutSeconds = 15
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$dataRoot = Join-Path $repoRoot "data"
$docsRoot = Join-Path $repoRoot "docs"
$sourceFiles = @(
  "data/site-registry.json",
  "data/site-registry-batch-5-additions.json",
  "data/site-registry-static-extractions.json"
)

function ConvertTo-Slug {
  param([string]$Value)
  $slug = $Value.ToLowerInvariant()
  $slug = [regex]::Replace($slug, "[^a-z0-9]+", "-").Trim("-")
  if ($slug.Length -eq 0) { return "site" }
  return $slug
}

function Guess-Category {
  param([string]$Name)
  if ($Name -like "*Lead Magnet*") { return "Lead Magnets" }
  if ($Name -like "*Funding Calculators*" -or $Name -like "*Calculator*" -or $Name -like "*Credit*" -or $Name -like "*Funding Route*" -or $Name -like "*CFO*" -or $Name -like "*CAC*") { return "Funding Tools" }
  if (@("Referral", "Partner", "Affiliate", "Darwin") | Where-Object { $Name -like "*$_*" }) { return "Partner Sites" }
  if (@("Personal", "Founder", "Jester", "Radical Libertarian") | Where-Object { $Name -like "*$_*" }) { return "Personal Brand Sites" }
  if ($Name -like "*AI Agent*") { return "AI Agent Libraries" }
  if ($Name -like "*Widget*" -or $Name -like "*Embed*") { return "Widgets" }
  if ($Name -like "*From Idea to URL*" -or $Name -like "*Static Site Generator*") { return "Static Site Factories" }
  if (@("Editorial", "Bento", "Content Hub") | Where-Object { $Name -like "*$_*" }) { return "Content Hubs" }
  if (@("CFO", "financing-widget", "moonshine-affiliate-hub") | Where-Object { $Name -like "*$_*" }) { return "Apps" }
  return "Experiments"
}

function Get-ObjectValue {
  param(
    $Object,
    [string]$Name,
    $Default = $null
  )
  if ($null -eq $Object) { return $Default }
  if ($Object.PSObject.Properties.Name -contains $Name) {
    $value = $Object.$Name
    if ($null -ne $value) { return $value }
  }
  return $Default
}

function Encode-Path {
  param(
    [string]$Path,
    [bool]$TrailingSlash = $false
  )
  $pathValue = $Path
  $hasLeadingSlash = $pathValue.StartsWith("/")
  $trimmed = $pathValue.Trim("/")
  $segments = @()
  if ($trimmed.Length -gt 0) {
    $segments = $trimmed.Split("/") | ForEach-Object {
      try {
        [Uri]::EscapeDataString([Uri]::UnescapeDataString($_))
      } catch {
        [Uri]::EscapeDataString($_)
      }
    }
  }
  $encoded = ($segments -join "/")
  $prefix = if ($hasLeadingSlash) { "/" } else { "" }
  return "$prefix$encoded$(if ($TrailingSlash -and -not $encoded.EndsWith('/')) { '/' } else { '' })"
}

function Join-BaseUrl {
  param([string]$Base, [string]$LivePath)
  $baseClean = $Base.TrimEnd("/")
  $path = if ($LivePath.StartsWith("/")) { $LivePath } else { "/$LivePath" }
  $trailingSlash = $path.EndsWith("/")
  return "$baseClean$(Encode-Path -Path $path -TrailingSlash $trailingSlash)"
}

function Build-RootHtmlEntry {
  param([string]$FileName)
  $title = $FileName -replace " index\.html$", "" -replace "\.html$", ""
  return [pscustomobject]@{
    title = "sites $title"
    slug = "sites-$(ConvertTo-Slug $title)"
    category = Guess-Category $title
    type = "sites-root-html"
    status = "portfolio-root-html"
    source = "incremental-sync"
    path = "sites/$FileName"
    livePath = Encode-Path -Path "sites/$FileName"
    hasIndex = $true
    hasPackageJson = $false
    hasZip = $false
    hasMarkdown = $false
    needsStandaloneDeploy = $false
    sourceFile = "data/site-registry-batch-5-additions.json"
  }
}

function Build-StaticEntry {
  param($Tuple)
  $name = [string]$Tuple[0]
  $subdir = if ($Tuple.Count -gt 1) { [string]$Tuple[1] } else { "" }
  $hasZip = if ($Tuple.Count -gt 2) { [bool]$Tuple[2] } else { $false }
  $hasMarkdown = if ($Tuple.Count -gt 3) { [bool]$Tuple[3] } else { $false }
  $livePath = if ($subdir) { "sites/$name/$subdir" } else { "sites/$name" }
  return [pscustomobject]@{
    title = "sites $name"
    slug = "sites-$(ConvertTo-Slug $name)"
    category = Guess-Category $name
    type = "static-site"
    status = "portfolio-site"
    source = "incremental-sync"
    path = "sites/$name"
    livePath = Encode-Path -Path $livePath -TrailingSlash $true
    hasIndex = $true
    hasPackageJson = $false
    hasZip = $hasZip
    hasMarkdown = $hasMarkdown
    needsStandaloneDeploy = $false
    sourceFile = "data/site-registry-batch-5-additions.json"
  }
}

function Build-DocsEntry {
  param([string]$Name)
  return [pscustomobject]@{
    title = "sites $Name"
    slug = "sites-$(ConvertTo-Slug $Name)"
    category = "Docs"
    type = "docs-archive"
    status = "archive-needs-review"
    source = "incremental-sync"
    path = "sites/$Name"
    livePath = ""
    hasIndex = $false
    hasPackageJson = $false
    hasZip = $false
    hasMarkdown = $true
    needsStandaloneDeploy = $false
    sourceFile = "data/site-registry-batch-5-additions.json"
  }
}

function Build-AppEntry {
  param($Tuple)
  $name = [string]$Tuple[0]
  $folder = [string]$Tuple[1]
  $category = if ($Tuple.Count -gt 2) { [string]$Tuple[2] } else { "Apps" }
  return [pscustomobject]@{
    title = "sites $name"
    slug = "sites-$(ConvertTo-Slug $name)"
    category = $category
    type = "nextjs-app"
    status = "nested-app-needs-standalone-deploy"
    source = "incremental-sync"
    path = "sites/$folder"
    livePath = ""
    hasIndex = $false
    hasPackageJson = $true
    hasZip = $false
    hasMarkdown = $true
    needsStandaloneDeploy = $true
    sourceFile = "data/site-registry-batch-5-additions.json"
  }
}

function Expand-Batch5Manifest {
  param($Manifest)
  $items = @()
  if ($Manifest.PSObject.Properties.Name -contains "rootHtml") {
    foreach ($file in @($Manifest.rootHtml)) { $items += Build-RootHtmlEntry $file }
  }
  if ($Manifest.PSObject.Properties.Name -contains "static") {
    foreach ($tuple in @($Manifest.static)) { $items += Build-StaticEntry $tuple }
  }
  if ($Manifest.PSObject.Properties.Name -contains "docs") {
    foreach ($name in @($Manifest.docs)) { $items += Build-DocsEntry $name }
  }
  if ($Manifest.PSObject.Properties.Name -contains "apps") {
    foreach ($tuple in @($Manifest.apps)) { $items += Build-AppEntry $tuple }
  }
  return $items
}

function Normalize-StaticExtractionEntry {
  param($Item)
  $titleValue = Get-ObjectValue -Object $Item -Name "title" -Default (Get-ObjectValue -Object $Item -Name "path" -Default "Untitled static extraction")
  $title = [string]$titleValue
  $extractionStatus = [string](Get-ObjectValue -Object $Item -Name "extractionStatus" -Default "unknown-needs-manual-review")
  $isStatic = @("static-site-extracted", "static-site-existing", "skipped-existing-index") -contains $extractionStatus
  $isStandalone = $extractionStatus -eq "nextjs-app-needs-standalone-deploy" -or [bool](Get-ObjectValue -Object $Item -Name "needsStandaloneDeploy" -Default $false)
  $status = if ($isStatic) { "portfolio-site" } elseif ($isStandalone) { "nested-app-needs-standalone-deploy" } else { "archive-needs-review" }
  $type = if ($isStatic) { "static-site" } elseif ($isStandalone) { "nextjs-app" } else { "zip-archive" }
  return [pscustomobject]@{
    title = $title
    slug = [string](Get-ObjectValue -Object $Item -Name "slug" -Default (ConvertTo-Slug $title))
    category = [string](Get-ObjectValue -Object $Item -Name "category" -Default (Guess-Category $title))
    type = [string](Get-ObjectValue -Object $Item -Name "type" -Default $type)
    status = [string](Get-ObjectValue -Object $Item -Name "status" -Default $status)
    source = [string](Get-ObjectValue -Object $Item -Name "source" -Default "static-zip-extraction")
    path = [string](Get-ObjectValue -Object $Item -Name "path" -Default "")
    livePath = if ($isStatic) { [string](Get-ObjectValue -Object $Item -Name "livePath" -Default "") } else { "" }
    hasIndex = [bool](Get-ObjectValue -Object $Item -Name "hasIndex" -Default $false)
    hasPackageJson = [bool](Get-ObjectValue -Object $Item -Name "hasPackageJson" -Default $false)
    hasZip = [bool](Get-ObjectValue -Object $Item -Name "hasZip" -Default $false)
    hasMarkdown = [bool](Get-ObjectValue -Object $Item -Name "hasMarkdown" -Default $false)
    needsStandaloneDeploy = $isStandalone
    sourceFile = "data/site-registry-static-extractions.json"
  }
}

function Load-RegistryEntries {
  $entries = @()
  $used = @()
  foreach ($sourceFile in $sourceFiles) {
    $fullPath = Join-Path $repoRoot $sourceFile
    if (-not (Test-Path -LiteralPath $fullPath)) { continue }
    $used += $sourceFile
    $data = Get-Content -LiteralPath $fullPath -Raw | ConvertFrom-Json
    if ($sourceFile -eq "data/site-registry-batch-5-additions.json") {
      $entries += Expand-Batch5Manifest $data
    } elseif ($sourceFile -eq "data/site-registry-static-extractions.json") {
      foreach ($item in @($data)) { $entries += Normalize-StaticExtractionEntry $item }
    } else {
      foreach ($item in @($data)) {
        $item | Add-Member -NotePropertyName sourceFile -NotePropertyValue $sourceFile -Force
        $entries += $item
      }
    }
  }
  return [pscustomobject]@{
    entries = $entries
    used = $used
  }
}

function Get-SkipResult {
  param($Item)
  $livePath = if ($Item.livePath) { [string]$Item.livePath } else { "" }
  if ([string]::IsNullOrWhiteSpace($livePath)) {
    if ([bool]$Item.needsStandaloneDeploy -or [string]$Item.type -eq "nextjs-app") { return "skipped-nested-app" }
    if ([string]$Item.status -eq "archive-needs-review" -or [string]$Item.type -match "archive|docs") { return "skipped-archive" }
    return "skipped-no-live-path"
  }
  return $null
}

function Get-ResultClass {
  param([int]$StatusCode, [bool]$Redirected, [string]$ErrorKind)
  if ($ErrorKind -eq "timeout") { return "fail-timeout" }
  if ($ErrorKind -eq "network") { return "fail-network" }
  if ($StatusCode -eq 200) {
    if ($Redirected) { return "redirected-pass" }
    return "pass"
  }
  if ($StatusCode -eq 404) { return "fail-404" }
  if ($StatusCode -ge 500) { return "fail-server-error" }
  return "manual-review"
}

function Invoke-SmokeRequest {
  param([string]$Url, [string]$Method)
  try {
    $response = Invoke-WebRequest -Uri $Url -Method $Method -TimeoutSec $TimeoutSeconds -MaximumRedirection 5 -ErrorAction Stop
    $finalUrl = $Url
    if ($response.BaseResponse.PSObject.Properties.Name -contains "ResponseMessage" -and $response.BaseResponse.ResponseMessage) {
      $finalUrl = $response.BaseResponse.ResponseMessage.RequestMessage.RequestUri.AbsoluteUri
    } elseif ($response.BaseResponse.PSObject.Properties.Name -contains "ResponseUri" -and $response.BaseResponse.ResponseUri) {
      $finalUrl = $response.BaseResponse.ResponseUri.AbsoluteUri
    }
    $contentType = $response.Headers["Content-Type"]
    return [pscustomobject]@{
      ok = $true
      statusCode = [int]$response.StatusCode
      finalUrl = $finalUrl
      contentType = $contentType
      errorKind = ""
      errorMessage = ""
      redirected = $finalUrl -ne $Url
    }
  } catch {
    $statusCode = 0
    $finalUrl = $Url
    $contentType = ""
    $errorKind = "network"
    if ($_.Exception.PSObject.Properties.Name -contains "Response" -and $_.Exception.Response) {
      try {
        $statusCode = [int]$_.Exception.Response.StatusCode
        if ($_.Exception.Response.Headers["Content-Type"]) { $contentType = $_.Exception.Response.Headers["Content-Type"] }
      } catch {}
    }
    if ($_.Exception.Message -match "timed out|timeout|operation canceled") { $errorKind = "timeout" }
    return [pscustomobject]@{
      ok = $false
      statusCode = $statusCode
      finalUrl = $finalUrl
      contentType = $contentType
      errorKind = $errorKind
      errorMessage = $_.Exception.Message
      redirected = $false
    }
  }
}

function Test-LiveUrl {
  param([string]$Url, [string]$LivePath)
  $attempts = @()
  $head = Invoke-SmokeRequest -Url $Url -Method "HEAD"
  $attempts += "HEAD:$($head.statusCode)"
  $best = $head
  $methodUsed = "HEAD"

  if ($head.statusCode -ne 200 -or $head.errorKind -ne "") {
    $get = Invoke-SmokeRequest -Url $Url -Method "GET"
    $attempts += "GET:$($get.statusCode)"
    $best = $get
    $methodUsed = "GET"
  }

  $looksFolderPath = -not $LivePath.EndsWith("/") -and -not ([IO.Path]::GetFileName($LivePath) -match "\.[a-z0-9]+$")
  if ($best.statusCode -eq 404 -and $looksFolderPath) {
    $fallbackUrl = "$($Url.TrimEnd('/'))/"
    $fallback = Invoke-SmokeRequest -Url $fallbackUrl -Method "GET"
    $attempts += "GET-fallback-slash:$($fallback.statusCode)"
    if ($fallback.statusCode -eq 200) {
      $best = $fallback
      $methodUsed = "GET-fallback-slash"
    }
  }

  $result = Get-ResultClass -StatusCode $best.statusCode -Redirected $best.redirected -ErrorKind $best.errorKind
  return [pscustomobject]@{
    statusCode = $best.statusCode
    finalUrl = $best.finalUrl
    contentType = $best.contentType
    result = $result
    methodUsed = $methodUsed
    notes = if ($best.errorMessage) { "$($attempts -join ', '); $($best.errorMessage)" } else { $attempts -join ", " }
  }
}

New-Item -ItemType Directory -Force -Path $dataRoot, $docsRoot | Out-Null

$loaded = Load-RegistryEntries
$entries = @($loaded.entries)
$results = @()
$candidateMap = [ordered]@{}

foreach ($item in $entries) {
  $skip = Get-SkipResult $item
  if ($skip) {
    $results += [pscustomobject]@{
      title = $item.title
      slug = $item.slug
      category = $item.category
      type = $item.type
      status = $item.status
      sourceFile = $item.sourceFile
      source = $item.source
      path = $item.path
      livePath = if ($item.livePath) { $item.livePath } else { "" }
      url = ""
      finalUrl = ""
      httpStatus = $null
      contentType = ""
      result = $skip
      methodUsed = ""
      notes = "No production request made."
    }
    continue
  }

  $url = Join-BaseUrl -Base $BaseUrl -LivePath ([string]$item.livePath)
  if (-not $candidateMap.Contains($url)) {
    $candidateMap[$url] = $item
  }
}

foreach ($url in $candidateMap.Keys) {
  $item = $candidateMap[$url]
  $test = Test-LiveUrl -Url $url -LivePath ([string]$item.livePath)
  $results += [pscustomobject]@{
    title = $item.title
    slug = $item.slug
    category = $item.category
    type = $item.type
    status = $item.status
    sourceFile = $item.sourceFile
    source = $item.source
    path = $item.path
    livePath = $item.livePath
    url = $url
    finalUrl = $test.finalUrl
    httpStatus = $test.statusCode
    contentType = $test.contentType
    result = $test.result
    methodUsed = $test.methodUsed
    notes = $test.notes
  }
  Start-Sleep -Milliseconds 125
}

$passed = @($results | Where-Object { $_.result -in @("pass", "redirected-pass") })
$failed = @($results | Where-Object { $_.result -like "fail-*" })
$skipped = @($results | Where-Object { $_.result -like "skipped-*" })
$candidates = @($results | Where-Object { $_.url })
$passRate = if ($candidates.Count -gt 0) { [math]::Round(($passed.Count / $candidates.Count) * 100, 2) } else { 0 }

$report = [pscustomobject]@{
  generatedAt = (Get-Date).ToString("o")
  baseUrl = $BaseUrl
  totalRegistryEntriesSeen = $entries.Count
  totalCandidateUrls = $candidates.Count
  totalPassed = $passed.Count
  totalFailed = $failed.Count
  totalSkipped = $skipped.Count
  passRate = $passRate
  sourceFilesUsed = @($loaded.used)
  results = @($results | Sort-Object @{Expression = "result"; Descending = $false}, title)
}

$jsonPath = Join-Path $dataRoot "live-path-smoke-test.json"
$mdPath = Join-Path $docsRoot "live-path-smoke-test.md"
$report | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $jsonPath -Encoding UTF8

$manual = @($results | Where-Object { $_.result -eq "manual-review" })
$passedSample = @($passed | Select-Object -First 25)
$skippedGroups = @($skipped | Group-Object result | Sort-Object Name)

$md = New-Object System.Collections.Generic.List[string]
$md.Add("# Live Path Smoke Test") | Out-Null
$md.Add("") | Out-Null
$md.Add("- Generated: $($report.generatedAt)") | Out-Null
$md.Add("- Base URL: $BaseUrl") | Out-Null
$md.Add("- Registry entries seen: $($report.totalRegistryEntriesSeen)") | Out-Null
$md.Add("- Candidate URLs tested: $($report.totalCandidateUrls)") | Out-Null
$md.Add("- Passed: $($report.totalPassed)") | Out-Null
$md.Add("- Failed: $($report.totalFailed)") | Out-Null
$md.Add("- Skipped: $($report.totalSkipped)") | Out-Null
$md.Add("- Pass rate: $($report.passRate)%") | Out-Null
$md.Add("- Source files used: $($report.sourceFilesUsed -join ', ')") | Out-Null
$md.Add("") | Out-Null
$md.Add("## Failed URLs") | Out-Null
if ($failed.Count -eq 0) {
  $md.Add("No failed URLs.") | Out-Null
} else {
  $md.Add("| Result | Status | Title | URL | Notes |") | Out-Null
  $md.Add("| --- | ---: | --- | --- | --- |") | Out-Null
  foreach ($row in $failed) {
    $md.Add("| $($row.result) | $($row.httpStatus) | $($row.title) | $($row.url) | $($row.notes -replace '\|','/') |") | Out-Null
  }
}
$md.Add("") | Out-Null
$md.Add("## Manual Review") | Out-Null
if ($manual.Count -eq 0) {
  $md.Add("No manual-review URL results.") | Out-Null
} else {
  $md.Add("| Status | Title | URL | Notes |") | Out-Null
  $md.Add("| ---: | --- | --- | --- |") | Out-Null
  foreach ($row in $manual) {
    $md.Add("| $($row.httpStatus) | $($row.title) | $($row.url) | $($row.notes -replace '\|','/') |") | Out-Null
  }
}
$md.Add("") | Out-Null
$md.Add("## Skipped Summary") | Out-Null
if ($skippedGroups.Count -eq 0) {
  $md.Add("No skipped entries.") | Out-Null
} else {
  foreach ($group in $skippedGroups) {
    $md.Add("- $($group.Name): $($group.Count)") | Out-Null
  }
}
$md.Add("") | Out-Null
$md.Add("## Passed Sample") | Out-Null
foreach ($row in $passedSample) {
  $md.Add("- $($row.title): $($row.url)") | Out-Null
}
$md.Add("") | Out-Null
$md.Add("## Recommended Next Actions") | Out-Null
if ($failed.Count -gt 0) {
  $md.Add("- Fix or remove failed live paths from the relevant registry addition source.") | Out-Null
  $md.Add("- Re-run `scripts/live-path-smoke-test.ps1` after production redeploys.") | Out-Null
} else {
  $md.Add("- Keep this script as the Batch 9 production smoke test before future registry merges.") | Out-Null
  $md.Add("- Re-run after the next Vercel deployment that changes `/sites` or registry data.") | Out-Null
}
$md | Set-Content -LiteralPath $mdPath -Encoding UTF8

$report | Select-Object generatedAt, baseUrl, totalRegistryEntriesSeen, totalCandidateUrls, totalPassed, totalFailed, totalSkipped, passRate, sourceFilesUsed | ConvertTo-Json -Depth 5
