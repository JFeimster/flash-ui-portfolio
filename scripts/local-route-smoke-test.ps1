param(
  [string]$BaseUrl = "http://127.0.0.1:4173",
  [int]$TimeoutSeconds = 10
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$routeData = Get-Content (Join-Path $repoRoot "data/asset-route-resolution.json") -Raw | ConvertFrom-Json
$contractFile = Join-Path $repoRoot "data/variant-route-contracts.json"
$contractGroups = if (Test-Path -LiteralPath $contractFile) { @((Get-Content -LiteralPath $contractFile -Raw | ConvertFrom-Json).groups) } else { @() }

function Get-Url([string]$Path) { return "$($BaseUrl.TrimEnd('/'))/$($Path.TrimStart('/'))" }
function Request([string]$Path) {
  $url = Get-Url $Path
  try {
    $response = Invoke-WebRequest -Uri $url -Method Get -TimeoutSec $TimeoutSeconds -MaximumRedirection 0 -ErrorAction Stop
    $body = if ($Path -match '\.(jpe?g|png|webp)$') { "" } else { [string]$response.Content }
    return [pscustomobject]@{ path = $Path; status = [int]$response.StatusCode; contentType = [string]$response.Headers["Content-Type"]; body = $body; redirected = $false }
  } catch {
    $status = 0
    $redirected = $false
    if ($_.Exception.PSObject.Properties['Response'] -and $_.Exception.Response) {
      try { $status = [int]$_.Exception.Response.StatusCode; $redirected = $status -ge 300 -and $status -lt 400 } catch {}
    }
    return [pscustomobject]@{ path = $Path; status = $status; contentType = ""; body = ""; redirected = $redirected }
  }
}

$checks = @()
$checks += Request "/"
$checks += Request "/sites/"
$checks += Request "/assets/js/app.js"
$checks += Request "/assets/css/styles.css"
$checks += Request "/assets/css/layout-fixes.css"
$checks += Request "/data/asset-route-resolution.json"
$checks += Request "/sites/Embed%20Code%20Generator%203/"
$checks += Request "/_batch-31-unknown-route/"

$resolved = @($routeData.entries | Where-Object { $_.resolutionStatus -eq "resolved" -and $_.resolvedPath })
foreach ($entry in $resolved) { $checks += Request ([string]$entry.resolvedPath) }

$contractTitles = @{}
$contractPaths = @()
foreach ($group in $contractGroups) {
  $resolvedGroups = @($routeData.groups | Where-Object { $_.groupId -eq $group.groupId })
  if ($resolvedGroups.Count -ne 1 -or $resolvedGroups[0].displayTitle -ne $group.displayTitle -or
      $resolvedGroups[0].hubPath -ne $group.hubPath -or $resolvedGroups[0].variantCount -ne @($group.variants).Count) {
    throw "Resolved group metadata differs from variant route contract: $($group.groupId)"
  }
  $contractPaths += [string]$group.hubPath
  foreach ($variant in @($group.variants)) {
    $path = [string]$variant.path
    $resolvedVariants = @($routeData.entries | Where-Object { $_.canonicalGroupId -eq $group.groupId -and $_.PSObject.Properties['variantNumber'] -and $_.variantNumber -eq $variant.number })
    if ($resolvedVariants.Count -ne 1 -or $resolvedVariants[0].resolutionStatus -ne "resolved" -or
        $resolvedVariants[0].resolvedPath -ne $path -or $resolvedVariants[0].title -ne $variant.title -or
        $resolvedVariants[0].description -ne $variant.description) {
      throw "Resolved variant metadata differs from variant route contract: $($group.groupId) variant $($variant.number)"
    }
    $contractPaths += $path
    $contractTitles[$path] = [string]$variant.title
    foreach ($asset in @($variant.assets)) { $contractPaths += "$($path.TrimEnd('/'))/$asset" }
  }
  $contractPaths += @($group.preservedPaths)
  $contractPaths += @($group.preservedAssets)
}
foreach ($path in ($contractPaths | Select-Object -Unique)) {
  if ($checks.path -notcontains $path) { $checks += Request $path }
}

$failures = @()
foreach ($check in $checks) {
  $isJson = $check.path -like "*.json"
  $isScript = $check.path -like "*.js"
  $isCss = $check.path -like "*.css"
  $isJpeg = $check.path -match '\.jpe?g$'
  $isPng = $check.path -like "*.png"
  $isWebp = $check.path -like "*.webp"
  $expectedType = if ($isJson) { "application/json" } elseif ($isScript) { "javascript" } elseif ($isCss) { "text/css" } elseif ($isJpeg) { "image/jpeg" } elseif ($isPng) { "image/png" } elseif ($isWebp) { "image/webp" } else { "text/html" }
  $typeOk = $check.contentType -match $expectedType
  $bodyOk = if ($check.path -eq "/") { $check.body -match "Flash UI" -and $check.body -match "assets/js/app\.js" } elseif ($check.path -eq "/sites/") { $check.body -match 'data-page="catalog"' -and $check.body -match "assets/js/app\.js" } else { $true }
  if ($contractTitles.ContainsKey($check.path)) { $bodyOk = $bodyOk -and $check.body.Contains($contractTitles[$check.path]) }
  $expectedMissing = $check.path -like "*Embed%20Code%20Generator%203*" -or $check.path -eq "/_batch-31-unknown-route/"
  $ok = if ($expectedMissing) { $check.status -eq 404 -and -not $check.redirected } else { $check.status -eq 200 -and $typeOk -and $bodyOk }
  if (-not $ok) { $failures += [pscustomobject]@{ path = $check.path; status = $check.status; contentType = $check.contentType; expected = $expectedType } }
}

$summary = [ordered]@{
  baseUrl = $BaseUrl
  checked = $checks.Count
  resolvedRoutesChecked = $resolved.Count
  passed = $checks.Count - $failures.Count
  failed = $failures.Count
  staleEmbedRoute = if ($checks | Where-Object { $_.path -like "*Embed%20Code%20Generator%203*" -and $_.status -eq 404 -and -not $_.redirected }) { "404-no-redirect" } else { "failed" }
  unknownRoute = if ($checks | Where-Object { $_.path -eq "/_batch-31-unknown-route/" -and $_.status -eq 404 -and -not $_.redirected }) { "404-no-redirect" } else { "failed" }
  failures = @($failures)
}
$summary | ConvertTo-Json -Depth 8
if ($failures.Count -gt 0) { exit 1 }
