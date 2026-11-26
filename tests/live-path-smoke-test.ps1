$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Import-Module (Join-Path $repoRoot 'scripts/lib/LivePathSmokeTest.psm1') -Force

function Assert-Equal([object]$Actual, [object]$Expected, [string]$Message) {
  if ($Actual -cne $Expected) { throw "$Message (expected '$Expected', got '$Actual')" }
}

Assert-Equal (ConvertTo-CanonicalUrl 'https://flash-ui-portfolio.vercel.app/' '/sites/loan tool/') 'https://flash-ui-portfolio.vercel.app/sites/loan%20tool/' 'Internal URL path encoding'
Assert-Equal (ConvertTo-CanonicalUrl 'https://flash-ui-portfolio.vercel.app' '/sites/loan%20tool/') 'https://flash-ui-portfolio.vercel.app/sites/loan%20tool/' 'Already encoded path is not double encoded'
Assert-Equal (ConvertTo-CanonicalUrl 'https://flash-ui-portfolio.vercel.app' 'https://jester-quotes.vercel.app/editions/dada-riot/') 'https://jester-quotes.vercel.app/editions/dada-riot/' 'Absolute external URLs keep their origin'
Assert-Equal (ConvertTo-CanonicalRoutePath 'sites//funding tool///') '/sites/funding%20tool/' 'Canonical route normalization'
Assert-Equal (Get-ResponseClassification 200 'text/html; charset=utf-8' '<html><title>Project</title></html>') 'pass' 'HTML success classification'
Assert-Equal (Get-ResponseClassification 200 'text/html' '<html><title>404: Not Found</title></html>') 'fail-soft-404' 'Soft 404 classification'
Assert-Equal (Get-ResponseClassification 200 'application/json' '{}') 'fail-non-html' 'Non-HTML response classification'
$duplicateRequests = @(Get-CanonicalRequestCandidates -BaseUrl 'https://flash-ui-portfolio.vercel.app' -Candidates @(
  [pscustomobject]@{ path = '/sites/shared/'; variations = @([pscustomobject]@{ title = 'Design A'; slug = 'shared-a'; variant = '1' }); metadataSources = @('route-resolution') },
  [pscustomobject]@{ path = 'https://flash-ui-portfolio.vercel.app/sites/shared/'; variations = @([pscustomobject]@{ title = 'Design B'; slug = 'shared-b'; variant = '2' }); metadataSources = @('showcase') }
))
Assert-Equal $duplicateRequests.Count 1 'Equivalent canonical URLs are requested once'
Assert-Equal $duplicateRequests[0].variations.Count 2 'Distinct design variations survive URL deduplication'

$routeResolution = Get-Content (Join-Path $repoRoot 'data/asset-route-resolution.json') -Raw | ConvertFrom-Json
$assetPreviews = Get-Content (Join-Path $repoRoot 'data/asset-previews.json') -Raw | ConvertFrom-Json
$assetShowcase = Get-Content (Join-Path $repoRoot 'data/asset-showcase.json') -Raw | ConvertFrom-Json
$candidates = @(Get-CanonicalSmokeCandidates $routeResolution $assetPreviews $assetShowcase)
$candidatePaths = @{}; foreach ($candidate in $candidates) { $candidatePaths[$candidate.path] = $true }
$mergeCommit = 'e939bfaaa77971dcb59e6d617a124dad1f61e4ae'
$addedPaths = @(& git -C $repoRoot diff-tree -r --name-only --diff-filter=A "$mergeCommit^1" $mergeCommit)
$folders = @($addedPaths | ForEach-Object { if ($_ -match '^sites/([^/]+)/') { $matches[1] } } | Sort-Object -Unique)
Assert-Equal $folders.Count 75 'Batch 42 import manifest size'
$missing = @()
foreach ($folder in $folders) {
  $prefix = "sites/$folder/"
  $entries = @($routeResolution.entries | Where-Object {
    $_.resolutionStatus -eq 'resolved' -and ([string]$_.sourcePath -like "$prefix*" -or (ConvertTo-CanonicalRoutePath ([string]$_.resolvedPath)) -eq (ConvertTo-CanonicalRoutePath "/sites/$folder/"))
  })
  if (-not $entries.Count) { $missing += $folder; continue }
  foreach ($entry in $entries) {
    if (-not $candidatePaths.ContainsKey((ConvertTo-CanonicalRoutePath ([string]$entry.resolvedPath)))) { $missing += "$folder -> $($entry.resolvedPath)" }
  }
}
if ($missing.Count) { throw "Batch 42 canonical route coverage missing: $($missing -join ', ')" }
Write-Output "PASS: URL construction, route normalization, response classification, and all $($folders.Count) Batch 42 imports."
