if ((Get-PSSnapin "Microsoft.SharePoint.PowerShell" -ErrorAction SilentlyContinue) -eq $null) 
{
    Add-PSSnapin "Microsoft.SharePoint.PowerShell"
}

$targetSiteUrl = "http://sp2016"
$appName = "PnPExtensions"
$certPath = "D:\O365ClientSideDev\SPSignCert.cer"
$issuerId = "6d70acdb-be76-41aa-bdc6-f00419275850"
$clientID = "af971055-c100-4611-a5ad-8419802b2453"


##$web = Get-SPWeb $site
   
$targetSite = Get-SPSite $targetSiteUrl   
$authRealm = Get-SPAuthenticationRealm -ServiceContext $targetSite
$certificate = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($certPath)
$fullAppPrincipalIdentifier = $issuerId + '@' + $authRealm 
$registeredIssuerName = $issuerID + '@' + $authRealm

Write-Host "RegisteredIssuer: " $registeredIssuerName
Write-Host "FullAppId: " $fullAppPrincipalIdentifier

Write-Host "Create Security token issuer"

New-SPTrustedRootAuthority -Name "SPCertificate" -Certificate $certificate 
$realm = Get-SPAuthenticationRealm

$secureTokenIssuer = New-SPTrustedSecurityTokenIssuer -Name "SPSignCertIssuer" -Certificate $certificate -RegisteredIssuerName $registeredIssuerName –IsTrustBroker
$secureTokenIssuer | select *    
$secureTokenIssuer  | select * | Out-File -FilePath "_log_SecureTokenIssuer.txt"

Write-Host "Create Security token issuer"

iisreset 

$serviceConfig = Get-SPSecurityTokenServiceConfig
$serviceConfig.AllowOAuthOverHttp = $true
$serviceConfig.Update()


Write-Host "Registering new app principal"
    
$registeredAppPrincipal = Register-SPAppPrincipal -NameIdentifier $fullAppPrincipalIdentifier -Site $targetSite.RootWeb -DisplayName $appName    
$registeredAppPrincipal | select * | Format-List   
$registeredAppPrincipal | select * | Format-List | Out-File -FilePath "_log_SPAppPrincipal.txt"
    
Write-Host "Registration Completed"

   

#$secureTokenIssuer = New-SPTrustedSecurityTokenIssuer –Name $appName –Certificate $appCert –RegisteredIssuerName $fullAppId 
#$appPrincipal = Register-SPAppPrincipal –NameIdentifier $fullAppId –Site $web –DisplayName $appName 

exit
Write-Host "Finished creating HighTrus AddIn: " $appName

# Useful PowerShell

Remove-SPTrustedSecurityTokenIssuer "SPSignCertIssuer" -Confirm:$false
Remove-SPTrustedRootAuthority -Identity "SPCertificate" -Confirm:$false