param(
  [string]$BaseUrl = 'https://flash-ui-portfolio.vercel.app',
  [int]$TimeoutSeconds = 15,
  [switch]$PlanOnly
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Import-Module (Join-Path $PSScriptRoot 'lib/LivePathSmokeTest.psm1') -Force

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$dataRoot = Join-Path $repoRoot 'data'
$docsRoot = Join-Path $repoRoot 'docs'
$routeResolution = Get-Content (Join-Path $dataRoot 'asset-route-resolution.json') -Raw | ConvertFrom-Json
$assetPreviews = Get-Content (Join-Path $dataRoot 'asset-previews.json') -Raw | ConvertFrom-Json
$assetShowcase = Get-Content (Join-Path $dataRoot 'asset-showcase.json') -Raw | ConvertFrom-Json
$candidates = @(Get-CanonicalSmokeCandidates $routeResolution $assetPreviews $assetShowcase)
$requests = @(Get-CanonicalRequestCandidates -Candidates $candidates -BaseUrl $BaseUrl)

function Invoke-CanonicalGet {
  param([string]$Url)
  try {
    $response = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec $TimeoutSeconds -MaximumRedirection 8 -ErrorAction Stop
    $finalUrl = $Url
    if ($response.BaseResponse.PSObject.Properties.Name -contains 'ResponseUri' -and $response.BaseResponse.ResponseUri) {
      $finalUrl = $response.BaseResponse.ResponseUri.AbsoluteUri
    } elseif ($response.BaseResponse.PSObject.Properties.Name -contains 'ResponseMessage' -and $response.BaseResponse.ResponseMessage) {
      $finalUrl = $response.BaseResponse.ResponseMessage.RequestMessage.RequestUri.AbsoluteUri
    }
    $contentType = [string]$response.Headers['Content-Type']
    $body = [string]$response.Content
    return [pscustomobject]@{
      statusCode = [int]$response.StatusCode; finalUrl = $finalUrl; contentType = $contentType
      body = $body; errorKind = ''; errorMessage = ''; redirected = $finalUrl -ne $Url
    }
  } catch {
    $statusCode = 0
    $contentType = ''
    if ($_.Exception.PSObject.Properties.Name -contains 'Response' -and $_.Exception.Response) {
      try { $statusCode = [int]$_.Exception.Response.StatusCode } catch {}
      try { $contentType = [string]$_.Exception.Response.Headers['Content-Type'] } catch {}
    }
    $errorKind = if ($_.Exception.Message -match 'timed out|timeout|operation canceled') { 'timeout' } else { 'network' }
    return [pscustomobject]@{
      statusCode = $statusCode; finalUrl = $Url; contentType = $contentType; body = ''
      errorKind = $errorKind; errorMessage = $_.Exception.Message; redirected = $false
    }
  }
}

$resultsByUrl = [ordered]@{}
foreach ($request in $requests) {
  $candidate = $request.candidate
  $url = $request.url
  if ($PlanOnly) {
    $response = [pscustomobject]@{ statusCode = $null; finalUrl = ''; contentType = ''; body = ''; errorKind = ''; errorMessage = ''; redirected = $false }
    $result = 'planned'
  } else {
    $response = Invoke-CanonicalGet $url
    $result = Get-ResponseClassification -StatusCode $response.statusCode -ContentType $response.contentType -Body $response.body -ErrorKind $response.errorKind
  }
  $resultsByUrl[$url] = [pscustomobject]@{
    title = $candidate.title; slug = $candidate.slug; path = $candidate.path; url = $url
    finalUrl = $response.finalUrl; httpStatus = $response.statusCode; contentType = $response.contentType
    result = if ($result -eq 'pass' -and $response.redirected) { 'redirected-pass' } else { $result }
    methodUsed = if ($PlanOnly) { '' } else { 'GET' }; source = $candidate.source; sourceFile = $candidate.sourceFile
    resolutionStatus = $candidate.resolutionStatus; canonicalGroupId = $candidate.canonicalGroupId
    variations = @($request.variations); metadataSources = @($request.metadataSources)
    notes = if ($response.errorMessage) { $response.errorMessage } else { '' }
  }
  if (-not $PlanOnly) { Start-Sleep -Milliseconds 100 }
}

# Batch 42 imported 75 site folders in the PR #129 merge. Resolve each folder
# against the canonical resolution data and link it to its independently
# requested canonical URL result (shared paths reuse one physical GET).
$batch42Folders = @()
$mergeCommit = 'e939bfaaa77971dcb59e6d617a124dad1f61e4ae'
try {
  $addedPaths = @(& git -C $repoRoot diff-tree -r --name-only --diff-filter=A "$mergeCommit^1" $mergeCommit)
  $batch42Folders = @($addedPaths | ForEach-Object { if ($_ -match '^sites/([^/]+)/') { $matches[1] } } | Sort-Object -Unique)
} catch { $batch42Folders = @() }
$batch42Coverage = @()
foreach ($folder in $batch42Folders) {
  $prefix = "sites/$folder/"
  $routeEntries = @($routeResolution.entries | Where-Object {
    $_.resolutionStatus -eq 'resolved' -and (
      [string]$_.sourcePath -like "$prefix*" -or
      (ConvertTo-CanonicalRoutePath ([string]$_.resolvedPath)) -eq (ConvertTo-CanonicalRoutePath "/sites/$folder/")
    )
  })
  $paths = @($routeEntries | ForEach-Object { ConvertTo-CanonicalRoutePath ([string]$_.resolvedPath) } | Sort-Object -Unique)
  foreach ($path in $paths) {
    $url = ConvertTo-CanonicalUrl -BaseUrl $BaseUrl -ResolvedPath $path
    $batch42Coverage += [pscustomobject]@{ folder = $folder; canonicalPath = $path; url = $url; result = if ($resultsByUrl.Contains($url)) { $resultsByUrl[$url].result } else { 'unresolved' } }
  }
  if (-not $paths.Count) {
    $batch42Coverage += [pscustomobject]@{ folder = $folder; canonicalPath = ''; url = ''; result = 'unresolved' }
  }
}

$unresolved = @($routeResolution.entries | Where-Object { $_.resolutionStatus -in @('unresolved', 'missing-entrypoint', 'invalid-entrypoint') } | ForEach-Object {
  [pscustomobject]@{ title = $_.title; slug = $_.slug; resolvedPath = $_.resolvedPath; originalPath = $_.originalPath; resolutionStatus = $_.resolutionStatus; reason = $_.resolutionReason }
})
$archives = @($routeResolution.entries | Where-Object { $_.resolutionStatus -eq 'archive' } | ForEach-Object { [pscustomobject]@{ title = $_.title; slug = $_.slug; path = $_.originalPath; sourceFile = $_.sourceFile } })
$standaloneApps = @($routeResolution.entries | Where-Object { $_.resolutionStatus -eq 'standalone-app' } | ForEach-Object { [pscustomobject]@{ title = $_.title; slug = $_.slug; path = $_.originalPath; sourceFile = $_.sourceFile } })

# Legacy static extraction / Batch 5 routes are retained for audit context,
# but never counted as production failures unless the canonical resolver still
# selects that exact route.
$legacyPaths = @()
$batch5Path = Join-Path $dataRoot 'site-registry-batch-5-additions.json'
if (Test-Path $batch5Path) {
  $batch5 = Get-Content $batch5Path -Raw | ConvertFrom-Json
  foreach ($file in @($batch5.rootHtml)) {
    $legacyPaths += [pscustomobject]@{ sourceFile = 'data/site-registry-batch-5-additions.json'; title = [string]$file; path = (ConvertTo-CanonicalRoutePath "sites/$file") }
  }
  foreach ($tuple in @($batch5.static)) {
    $name = [string]$tuple[0]
    $subdir = if ($tuple.Count -gt 1) { [string]$tuple[1] } else { '' }
    $path = if ($subdir) { "sites/$name/$subdir" } else { "sites/$name" }
    $legacyPaths += [pscustomobject]@{ sourceFile = 'data/site-registry-batch-5-additions.json'; title = $name; path = (ConvertTo-CanonicalRoutePath $path) }
  }
}
foreach ($source in @('site-registry-batch-5-additions.json', 'site-registry-static-extractions.json')) {
  if ($source -eq 'site-registry-batch-5-additions.json') { continue }
  $path = Join-Path $dataRoot $source
  if (-not (Test-Path $path)) { continue }
  $legacy = Get-Content $path -Raw | ConvertFrom-Json
  foreach ($entry in @($legacy)) {
    $livePath = if ($entry.PSObject.Properties['livePath']) { [string]$entry.livePath } else { '' }
    if ($livePath) { $legacyPaths += [pscustomobject]@{ sourceFile = "data/$source"; title = [string]$entry.title; path = (ConvertTo-CanonicalRoutePath $livePath) } }
  }
}
$canonicalPathSet = @{}
foreach ($candidate in $candidates) { $canonicalPathSet[$candidate.path] = $true }
$supersededLegacy = @($legacyPaths | Where-Object { -not $canonicalPathSet.ContainsKey($_.path) } | Sort-Object path -Unique)
$supersededLegacyBySource = [ordered]@{}
foreach ($group in @($supersededLegacy | Group-Object sourceFile)) { $supersededLegacyBySource[$group.Name] = $group.Count }

$rows = @($resultsByUrl.Values)
$passed = @($rows | Where-Object { $_.result -in @('pass', 'redirected-pass') })
$failed = @($rows | Where-Object { $_.result -like 'fail-*' })
$manual = @($rows | Where-Object { $_.result -eq 'manual-review' })
$passRate = if ($rows.Count) { [math]::Round(100 * $passed.Count / $rows.Count, 2) } else { 0 }
$report = [pscustomobject]@{
  generatedAt = (Get-Date).ToUniversalTime().ToString('o'); baseUrl = $BaseUrl; method = 'GET'
  routeResolutionFile = 'data/asset-route-resolution.json'; routeResolutionEntriesSeen = @($routeResolution.entries).Count
  totalCandidateUrls = $rows.Count; totalPassed = $passed.Count; totalFailed = $failed.Count; totalManualReview = $manual.Count; passRate = $passRate
  coverageSources = @('data/asset-route-resolution.json', 'data/asset-previews.json', 'data/asset-showcase.json')
  batch42ExpectedImports = 75; batch42ImportsDiscovered = $batch42Folders.Count; batch42ImportsWithCanonicalRoutes = @($batch42Coverage | Where-Object { $_.canonicalPath }).Count
  batch42Coverage = @($batch42Coverage | Sort-Object folder, canonicalPath)
  supersededLegacyPathCount = $supersededLegacy.Count; supersededLegacyBySource = $supersededLegacyBySource; supersededLegacyPaths = @($supersededLegacy)
  unresolvedEntries = $unresolved; archives = $archives; standaloneApplications = $standaloneApps
  results = @($rows | Sort-Object result, title)
}

$report | ConvertTo-Json -Depth 16 | Set-Content -LiteralPath (Join-Path $dataRoot 'live-path-smoke-test.json') -Encoding UTF8
$md = [System.Collections.Generic.List[string]]::new()
$md.Add('# Canonical Live Path Smoke Test'); $md.Add('')
$md.Add("- Generated: $($report.generatedAt)"); $md.Add("- Base URL: $BaseUrl"); $md.Add('- Method: GET'); $md.Add("- Route resolution entries: $($report.routeResolutionEntriesSeen)")
$md.Add("- Canonical URLs tested: $($report.totalCandidateUrls)"); $md.Add("- Passed: $($report.totalPassed)"); $md.Add("- Failed: $($report.totalFailed)"); $md.Add("- Manual review: $($report.totalManualReview)"); $md.Add("- Pass rate: $($report.passRate)%")
$md.Add("- Coverage sources: $($report.coverageSources -join ', ')"); $md.Add("- Batch 42 imports: $($report.batch42ImportsWithCanonicalRoutes)/$($report.batch42ExpectedImports) mapped from $($report.batch42ImportsDiscovered) imported folders")
$md.Add(''); $md.Add('## Genuine Production Failures'); $md.Add('')
if (-not $failed.Count) { $md.Add('No production failures were observed.') } else {
  $md.Add('| Result | HTTP | Title | URL | Content type | Notes |'); $md.Add('| --- | ---: | --- | --- | --- | --- |')
  foreach ($row in $failed) { $md.Add("| $($row.result) | $($row.httpStatus) | $($row.title -replace '\|','/') | $($row.url) | $($row.contentType) | $($row.notes -replace '\|','/') |") }
}
$md.Add(''); $md.Add('## Unresolved Route Entries'); $md.Add('')
if (-not $unresolved.Count) { $md.Add('No unresolved route-resolution entries.') } else { foreach ($item in $unresolved) { $md.Add("- $($item.resolutionStatus): $($item.title) — $($item.originalPath) ($($item.reason))") } }
$md.Add(''); $md.Add('## Archives and Standalone Applications'); $md.Add(''); $md.Add("- Archives: $($archives.Count)"); $md.Add("- Standalone applications: $($standaloneApps.Count)")
$md.Add(''); $md.Add('## Superseded Legacy Paths'); $md.Add(''); $md.Add("$($supersededLegacy.Count) legacy paths no longer selected by canonical route resolution. They are reported separately and are not production failures.")
foreach ($sourceName in $supersededLegacyBySource.Keys) { $md.Add("- ${sourceName}: $($supersededLegacyBySource[$sourceName])") }
foreach ($item in $supersededLegacy) { $md.Add("- $($item.path) — $($item.title) [$($item.sourceFile)]") }
$md.Add(''); $md.Add('## Batch 42 Import Coverage'); $md.Add(''); $md.Add('| Imported folder | Canonical path | Result | URL |'); $md.Add('| --- | --- | --- | --- |')
foreach ($item in $report.batch42Coverage) { $md.Add("| $($item.folder) | $($item.canonicalPath) | $($item.result) | $($item.url) |") }
$md.Add(''); $md.Add('## Recommended Remediation'); $md.Add('')
if ($failed.Count) { $md.Add('- Repair each failed canonical route at its reported URL, then rerun this GET smoke test after deployment.') } else { $md.Add('- Keep the canonical resolver and approved showcase metadata current; rerun after route deployments.') }
$md | Set-Content -LiteralPath (Join-Path $docsRoot 'live-path-smoke-test.md') -Encoding UTF8
$report | Select-Object generatedAt, totalCandidateUrls, totalPassed, totalFailed, totalManualReview, passRate, batch42ImportsDiscovered, batch42ImportsWithCanonicalRoutes, supersededLegacyPathCount | ConvertTo-Json
