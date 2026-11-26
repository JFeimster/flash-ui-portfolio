Set-StrictMode -Version Latest

function Get-MetadataRecord {
  param($Map, [string]$Key)
  if ($null -eq $Map -or [string]::IsNullOrWhiteSpace($Key)) { return $null }
  $property = $Map.PSObject.Properties[$Key]
  if ($property) { return $property.Value }
  return $null
}

function ConvertTo-CanonicalRoutePath {
  param([Parameter(Mandatory)][string]$Path)
  $value = $Path.Trim()
  if ([string]::IsNullOrWhiteSpace($value)) { return "" }
  if ($value -match '^[a-z][a-z0-9+.-]*://') { return ([uri]$value).AbsoluteUri }
  if (-not $value.StartsWith('/')) { $value = "/$value" }
  $uri = [uri]::new("https://canonical.invalid$value")
  $segments = $uri.AbsolutePath.Trim('/').Split('/') | Where-Object { $_ -ne '' } | ForEach-Object {
    [uri]::EscapeDataString([uri]::UnescapeDataString($_))
  }
  $normalized = '/' + ($segments -join '/')
  if ($uri.AbsolutePath.EndsWith('/') -and -not $normalized.EndsWith('/')) { $normalized += '/' }
  if ($normalized -eq '') { $normalized = '/' }
  if ($uri.Query) { $normalized += $uri.Query }
  if ($uri.Fragment) { $normalized += $uri.Fragment }
  return $normalized
}

function ConvertTo-CanonicalUrl {
  param(
    [Parameter(Mandatory)][string]$BaseUrl,
    [Parameter(Mandatory)][string]$ResolvedPath
  )
  if ($ResolvedPath -match '^[a-z][a-z0-9+.-]*://') { return ([uri]$ResolvedPath).AbsoluteUri }
  $base = [uri]($BaseUrl.TrimEnd('/') + '/')
  $path = ConvertTo-CanonicalRoutePath $ResolvedPath
  return ([uri]::new($base, $path)).AbsoluteUri
}

function Get-CanonicalSmokeCandidates {
  param(
    [Parameter(Mandatory)]$RouteResolution,
    [Parameter(Mandatory)]$AssetPreviews,
    [Parameter(Mandatory)]$AssetShowcase
  )
  $byPath = [ordered]@{}
  $allEntries = @($RouteResolution.entries)
  foreach ($entry in $allEntries) {
    $path = [string]$entry.resolvedPath
    if ($entry.resolutionStatus -ne 'resolved' -or [string]::IsNullOrWhiteSpace($path)) { continue }
    $canonicalPath = ConvertTo-CanonicalRoutePath $path
    if (-not $byPath.Contains($canonicalPath)) {
      $showcase = $null
      if ($AssetShowcase.projects) { $showcase = Get-MetadataRecord $AssetShowcase.projects ([string]$entry.slug) }
      $byPath[$canonicalPath] = [pscustomobject]@{
        path = $canonicalPath; title = if ($showcase -and $showcase.title) { [string]$showcase.title } else { [string]$entry.title }
        slug = [string]$entry.slug; type = [string]$entry.type; source = [string]$entry.source
        sourceFile = [string]$entry.sourceFile; resolutionStatus = [string]$entry.resolutionStatus
        canonicalGroupId = [string]$entry.canonicalGroupId
        variations = [System.Collections.Generic.List[object]]::new()
        metadataSources = [System.Collections.Generic.List[string]]::new()
      }
    }
    $candidate = $byPath[$canonicalPath]
    $variant = if ($entry.PSObject.Properties.Name -contains 'variantNumber') { [string]$entry.variantNumber } elseif ($entry.PSObject.Properties.Name -contains 'variantNumbers' -and $entry.variantNumbers.Count) { (@($entry.variantNumbers) -join ',') } else { '' }
    $candidate.variations.Add([pscustomobject]@{ title = [string]$entry.title; slug = [string]$entry.slug; variant = $variant; groupId = [string]$entry.canonicalGroupId })
    $candidate.metadataSources.Add('data/asset-route-resolution.json')
  }

  # The approved preview catalog is the additive fallback when a route exists
  # in current showcase metadata but has not yet been projected into resolution.
  if ($AssetPreviews.projects) {
    foreach ($key in $AssetPreviews.projects.PSObject.Properties.Name) {
      $preview = $AssetPreviews.projects.$key
      if (-not $preview.target) { continue }
      $canonicalPath = ConvertTo-CanonicalRoutePath ([string]$preview.target)
      $showcase = if ($AssetShowcase.projects) { Get-MetadataRecord $AssetShowcase.projects $key } else { $null }
      if (-not $byPath.Contains($canonicalPath)) {
        $byPath[$canonicalPath] = [pscustomobject]@{
          path = $canonicalPath; title = if ($showcase -and $showcase.title) { [string]$showcase.title } elseif ($preview.label) { [string]$preview.label } else { $key }
          slug = $key; type = 'showcase-route'; source = 'approved-asset-preview'; sourceFile = 'data/asset-previews.json'
          resolutionStatus = 'showcase-fallback'; canonicalGroupId = [string]$preview.familyId
          variations = [System.Collections.Generic.List[object]]::new()
          metadataSources = [System.Collections.Generic.List[string]]::new()
        }
      }
      $candidate = $byPath[$canonicalPath]
      if (-not ($candidate.variations | Where-Object { $_.slug -eq $key })) {
        $candidate.variations.Add([pscustomobject]@{ title = if ($showcase -and $showcase.title) { [string]$showcase.title } elseif ($preview.label) { [string]$preview.label } else { $key }; slug = $key; variant = ''; groupId = [string]$preview.familyId })
      }
      if (-not $candidate.metadataSources.Contains('data/asset-previews.json')) { $candidate.metadataSources.Add('data/asset-previews.json') }
      if ($showcase -and -not $candidate.metadataSources.Contains('data/asset-showcase.json')) { $candidate.metadataSources.Add('data/asset-showcase.json') }
    }
  }
  return @($byPath.Values | Sort-Object path)
}

function Get-CanonicalRequestCandidates {
  param([Parameter(Mandatory)][object[]]$Candidates, [Parameter(Mandatory)][string]$BaseUrl)
  $byUrl = [ordered]@{}
  foreach ($candidate in $Candidates) {
    $url = ConvertTo-CanonicalUrl -BaseUrl $BaseUrl -ResolvedPath ([string]$candidate.path)
    if (-not $byUrl.Contains($url)) {
      $byUrl[$url] = [pscustomobject]@{
        url = $url; candidate = $candidate
        variations = [System.Collections.Generic.List[object]]::new()
        metadataSources = [System.Collections.Generic.List[string]]::new()
      }
    }
    $request = $byUrl[$url]
    foreach ($variation in @($candidate.variations)) {
      if (-not ($request.variations | Where-Object { $_.slug -eq $variation.slug -and $_.variant -eq $variation.variant -and $_.title -eq $variation.title })) { $request.variations.Add($variation) }
    }
    foreach ($source in @($candidate.metadataSources)) { if (-not $request.metadataSources.Contains($source)) { $request.metadataSources.Add($source) } }
  }
  return @($byUrl.Values | Sort-Object url)
}

function Get-ResponseClassification {
  param([int]$StatusCode, [string]$ContentType, [string]$Body, [string]$ErrorKind = '')
  if ($ErrorKind) { return "fail-$ErrorKind" }
  if ($StatusCode -eq 404) { return 'fail-404' }
  if ($StatusCode -ge 500) { return 'fail-server-error' }
  if ($StatusCode -lt 200 -or $StatusCode -ge 300) { return 'manual-review' }
  if ($ContentType -notmatch 'text/html|application/xhtml\+xml') { return 'fail-non-html' }
  if ($Body -match '(?is)<title[^>]*>\s*(?:404\b|not found\b)|<h[1-3][^>]*>\s*(?:404\b|page not found\b)|this page could not be found') { return 'fail-soft-404' }
  return 'pass'
}

Export-ModuleMember -Function ConvertTo-CanonicalRoutePath, ConvertTo-CanonicalUrl, Get-CanonicalSmokeCandidates, Get-CanonicalRequestCandidates, Get-ResponseClassification
