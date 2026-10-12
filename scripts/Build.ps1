param([Parameter(Mandatory=$true)][string]$SourceApp,[Parameter(Mandatory=$true)][string]$Destination,[Parameter(Mandatory=$true)][string]$NodePath)
$ErrorActionPreference='Stop'
$source=(Resolve-Path -LiteralPath $SourceApp).Path
$target=[IO.Path]::GetFullPath($Destination)
if($target.StartsWith($source.TrimEnd('\')+'\',[StringComparison]::OrdinalIgnoreCase)){throw 'Destination must be outside source application'}
if(Test-Path -LiteralPath $target){throw 'Destination must be a new directory'}
if(-not (Test-Path -LiteralPath (Join-Path $source 'ChatGPT.exe'))){throw 'Source GUI application missing'}
New-Item -ItemType Directory -Path $target | Out-Null
Copy-Item -LiteralPath $source -Destination (Join-Path $target 'app') -Recurse
& $NodePath (Join-Path $PSScriptRoot 'patch-app.mjs') $target
if($LASTEXITCODE -ne 0){throw 'Patch failed; staged copy has not been installed'}
Copy-Item -LiteralPath (Join-Path $target 'app.asar.first-frame.tmp') -Destination (Join-Path $target 'app\resources\app.asar') -Force
Copy-Item -LiteralPath (Join-Path $target 'ChatGPT.first-frame.tmp') -Destination (Join-Path $target 'app\ChatGPT.exe') -Force
Write-Output ('Staged Qodex application: '+$target)
