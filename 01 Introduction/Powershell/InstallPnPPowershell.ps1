# Loads Powershell Packages
Install-Module –Name PowerShellGet –Force

# Installs PnP Moduel for SP 2016
Install-Module SharePointPnPPowerShell2016 -Force

# Installs PnP Moduel for SP Online
Install-Module SharePointPnPPowerShellOnline -Force -SkipPublisherCheck -AllowClobber

# Update
Update-Module SharePointPnPPowerShell*

# List installed PowerShell Providers
Get-Module SharePointPnPPowerShell* -ListAvailable | Select-Object Name,Version | Sort-Object Version -Descending

# Sample Connect
$orgName="integrationsonline";
Connect-PnPOnline –Url https://$orgName.sharepoint.com –Credentials (Get-Credential)

# Create a Web using PnP
New-PnPWeb -Title "PnP Web" -Url pnpWeb -Description "SPWeb created using PnP" -Locale 1033 -Template "STS#0"

Write-Host "Site created"