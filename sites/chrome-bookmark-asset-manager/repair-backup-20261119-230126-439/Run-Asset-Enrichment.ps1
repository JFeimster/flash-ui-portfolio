param([switch]$CheckWeb,[switch]$GitHub,[switch]$Screenshots,[int]$Limit=0)
$ErrorActionPreference='Stop'
Set-Location $PSScriptRoot
$python = Get-Command py -ErrorAction SilentlyContinue
if ($python) { $exe='py'; $prefix=@('-3') }
else { $python=Get-Command python -ErrorAction SilentlyContinue; if(-not $python){throw 'Install Python 3 first.'}; $exe='python'; $prefix=@() }
$argsList=@('enrich_assets.py')
if($CheckWeb){$argsList+='--check-web'}
if($GitHub){$argsList+='--github'}
if($Screenshots){$argsList+='--screenshots'}
if($Limit -gt 0){$argsList+=@('--limit',"$Limit")}
& $exe @prefix @argsList
if($LASTEXITCODE -ne 0){throw 'Enrichment failed. No retry performed.'}
Start-Process (Join-Path $PSScriptRoot 'OPEN-BOOKMARK-LIBRARY-ASSET-MANAGER.html')
