param([string]$SourceApp,[string]$NodePath,[string]$Destination,[string]$ExistingAppDir,[string]$ProfileDir,[switch]$Launch,[switch]$NoDesktopShortcut)
$ErrorActionPreference='Stop'
if(-not $Destination){$Destination=Join-Path $env:LOCALAPPDATA 'Qdex2007'}
$Destination=[IO.Path]::GetFullPath($Destination)
if($Destination -match 'WindowsApps'){throw 'Choose a local user installation directory'}
if(-not $NodePath){$nodeCommand=Get-Command node.exe -ErrorAction SilentlyContinue;if($nodeCommand){$NodePath=$nodeCommand.Source}}
if(-not $NodePath -or -not (Test-Path -LiteralPath $NodePath)){throw 'Supply -NodePath for an existing Node 22+ executable; no runtime will be downloaded'}
$NodePath=(Resolve-Path -LiteralPath $NodePath).Path
$nodeVersion=& $NodePath --version
$major=($nodeVersion -replace '^v','').Split('.')[0]
if($LASTEXITCODE -ne 0 -or [int]$major -lt 22){throw 'Node 22+ required'}
$bundle=Split-Path $PSScriptRoot -Parent
$installedBundle=Join-Path $Destination 'skill'
if([IO.Path]::GetFullPath($bundle).TrimEnd('\') -ne [IO.Path]::GetFullPath($installedBundle).TrimEnd('\')){
New-Item -ItemType Directory -Path $installedBundle -Force | Out-Null
foreach($item in @('assets','scripts','references','SKILL.md','README.md','NOTICE.md','manifest.json')){Copy-Item -LiteralPath (Join-Path $bundle $item) -Destination $installedBundle -Recurse -Force}}
if($ExistingAppDir){$appDir=(Resolve-Path -LiteralPath $ExistingAppDir).Path}else{
if(-not $SourceApp){$package=Get-AppxPackage -Name OpenAI.Codex | Select-Object -First 1;if($package){$SourceApp=Join-Path $package.InstallLocation 'app'}}
if(-not $SourceApp){throw 'Supply -SourceApp with the installed GUI app directory'}
$deployment=Join-Path $Destination 'deploy'
if(Test-Path -LiteralPath $deployment){throw 'Existing deployment retained; use -ExistingAppDir or a new destination'}
& (Join-Path $installedBundle 'scripts\Build.ps1') -SourceApp $SourceApp -Destination $deployment -NodePath $NodePath
$appDir=Join-Path $deployment 'app'}
& $NodePath (Join-Path $installedBundle 'scripts\verify-app.mjs') $appDir
if($LASTEXITCODE -ne 0){throw 'Application verification failed; desktop shortcut not changed'}
if(-not $ProfileDir){$ProfileDir=Join-Path $Destination 'profile'}
$ProfileDir=[IO.Path]::GetFullPath($ProfileDir)
$icon=Join-Path $installedBundle 'assets\qq-penguin.ico'
$config=@{version='1.1.0';appDir=$appDir;nodePath=$NodePath;profileDir=$ProfileDir;installedBundle=$installedBundle}
$config | ConvertTo-Json | Set-Content -Encoding utf8 (Join-Path $Destination 'installation.json')
$start=Join-Path $installedBundle 'scripts\Start.ps1'
if(-not $NoDesktopShortcut){
$desktop=[Environment]::GetFolderPath('Desktop')
$shortcutPath=Join-Path $desktop 'Qdex 2007.lnk'
if(Test-Path -LiteralPath $shortcutPath){$backup=$shortcutPath+'.before-qdx-'+(Get-Date -Format 'yyyyMMddHHmmss');Copy-Item -LiteralPath $shortcutPath -Destination $backup}
$start=Join-Path $installedBundle 'scripts\Start.ps1'
$shell=New-Object -ComObject WScript.Shell
$link=$shell.CreateShortcut($shortcutPath)
$link.TargetPath=Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
$link.Arguments='-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "'+$start+'" -AppDir "'+$appDir+'" -NodePath "'+$NodePath+'" -ProfileDir "'+$ProfileDir+'"'
$link.WorkingDirectory=$Destination
$link.IconLocation=$icon+',0'
$link.Description='Qdex 2007 — 原生 / QQ 双模式启动器'
$link.WindowStyle=7
$link.Save()
$check=$shell.CreateShortcut($shortcutPath)
if($check.IconLocation -ne $icon+',0' -or -not (Test-Path -LiteralPath $check.TargetPath)){throw 'Shortcut verification failed'}
Write-Output ('Desktop shortcut created: '+$shortcutPath)
}else{Write-Output 'Existing desktop/Headroom launcher preserved; no new shortcut created'}
if($Launch){& $start -AppDir $appDir -NodePath $NodePath -ProfileDir $ProfileDir}
Get-Content -LiteralPath (Join-Path $installedBundle 'references\first-use.md') -Encoding utf8 | Write-Output
Write-Output 'Installation assistants: explain this usage in the current chat; do not send a separate chat message.'
