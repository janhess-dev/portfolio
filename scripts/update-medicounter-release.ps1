[CmdletBinding()]
param(
    [string]$ShaFile,
    [string]$ZipFile,
    [string]$ReleaseDateEn,
    [string]$ReleaseDateDe
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$translationsPath = Join-Path $root "translations.js"
$indexPath = Join-Path $root "medicounter\index.html"

if (-not $ShaFile) {
    $ShaFile = Get-ChildItem -Path $root -File -Filter "MediCounter*.zip.sha256" |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1 -ExpandProperty FullName
}

if (-not $ShaFile -or -not (Test-Path $ShaFile)) {
    throw "No MediCounter .sha256 file found."
}

$shaContent = (Get-Content -Path $ShaFile -Raw).Trim()
if ($shaContent -notmatch '^([A-Fa-f0-9]{64})\s+\*?(.+\.zip)$') {
    throw "Could not parse SHA-256 file: $ShaFile"
}

$hash = $matches[1].ToUpperInvariant()
$zipNameFromSha = $matches[2]

if (-not $ZipFile) {
    $candidateZip = Join-Path $root $zipNameFromSha
    if (Test-Path $candidateZip) {
        $ZipFile = $candidateZip
    } else {
        $fallbackZip = Join-Path $root "MediCounter.zip"
        if (Test-Path $fallbackZip) {
            $ZipFile = $fallbackZip
        }
    }
}

if (-not $ZipFile -or -not (Test-Path $ZipFile)) {
    throw "No matching MediCounter zip file found."
}

$zipItem = Get-Item -LiteralPath $ZipFile
$sizeEn = ([math]::Round($zipItem.Length / 1MB, 2)).ToString("0.00", [System.Globalization.CultureInfo]::InvariantCulture) + " MB"
$sizeDe = $sizeEn.Replace(".", ",")

$shaFileName = Split-Path -Leaf $ShaFile
$versionNumber = $null
if ($shaFileName -match '^MediCounter-Beta-([0-9][0-9\.]*)-win-x64\.zip\.sha256$') {
    $versionNumber = $matches[1]
}

if (-not $versionNumber) {
    throw "Could not derive version from file name: $shaFileName"
}

$stackVersion = "Beta v$versionNumber"
$releaseVersion = "v$versionNumber Beta"

$translations = Get-Content -Path $translationsPath -Raw
$index = Get-Content -Path $indexPath -Raw

function Set-TranslationOccurrence {
    param(
        [string]$Content,
        [string]$Key,
        [string]$Value,
        [int]$Occurrence
    )

    $pattern = '"' + [regex]::Escape($Key) + '":\s*"[^"]*"'
    $matches = [regex]::Matches($Content, $pattern)

    if ($matches.Count -le $Occurrence) {
        throw "Could not find occurrence $Occurrence for translation key '$Key'."
    }

    $match = $matches[$Occurrence]
    $replacement = "`"$Key`": `"$Value`""

    return $Content.Substring(0, $match.Index) + $replacement + $Content.Substring($match.Index + $match.Length)
}

$translations = Set-TranslationOccurrence -Content $translations -Key "medicounterPage.hero.stack_beta" -Value $stackVersion -Occurrence 0
$translations = Set-TranslationOccurrence -Content $translations -Key "medicounterPage.hero.stack_beta" -Value $stackVersion -Occurrence 1
$translations = Set-TranslationOccurrence -Content $translations -Key "medicounterPage.download.version_value" -Value $releaseVersion -Occurrence 0
$translations = Set-TranslationOccurrence -Content $translations -Key "medicounterPage.download.version_value" -Value $releaseVersion -Occurrence 1
$translations = Set-TranslationOccurrence -Content $translations -Key "medicounterPage.download.size_value" -Value $sizeEn -Occurrence 0
$translations = Set-TranslationOccurrence -Content $translations -Key "medicounterPage.download.size_value" -Value $sizeDe -Occurrence 1
$translations = Set-TranslationOccurrence -Content $translations -Key "medicounterPage.download.sha_value" -Value $hash -Occurrence 0
$translations = Set-TranslationOccurrence -Content $translations -Key "medicounterPage.download.sha_value" -Value $hash -Occurrence 1

if ($ReleaseDateEn) {
    $translations = Set-TranslationOccurrence -Content $translations -Key "medicounterPage.download.date_value" -Value $ReleaseDateEn -Occurrence 0
}

if ($ReleaseDateDe) {
    $translations = Set-TranslationOccurrence -Content $translations -Key "medicounterPage.download.date_value" -Value $ReleaseDateDe -Occurrence 1
}

$index = [regex]::Replace($index, '(data-i18n="medicounterPage\.hero\.stack_beta">)([^<]*)', { param($m) $m.Groups[1].Value + $stackVersion })
$index = [regex]::Replace($index, '(data-i18n="medicounterPage\.download\.version_value">)([^<]*)', { param($m) $m.Groups[1].Value + $releaseVersion })
$index = [regex]::Replace($index, '(data-i18n="medicounterPage\.download\.size_value">)([^<]*)', { param($m) $m.Groups[1].Value + $sizeEn })
$index = [regex]::Replace($index, '(data-i18n="medicounterPage\.download\.sha_value">)([^<]*)', { param($m) $m.Groups[1].Value + $hash })

if ($ReleaseDateEn) {
    $index = [regex]::Replace($index, '(data-i18n="medicounterPage\.download\.date_value">)([^<]*)', { param($m) $m.Groups[1].Value + $ReleaseDateEn })
}

Set-Content -Path $translationsPath -Value $translations -Encoding utf8
Set-Content -Path $indexPath -Value $index -Encoding utf8

Write-Host "Updated MediCounter release metadata:"
Write-Host "  SHA file: $ShaFile"
Write-Host "  ZIP file: $ZipFile"
Write-Host "  Version:  $releaseVersion"
Write-Host "  Size EN:  $sizeEn"
Write-Host "  Size DE:  $sizeDe"
Write-Host "  SHA-256:  $hash"
if ($ReleaseDateEn) { Write-Host "  Date EN:  $ReleaseDateEn" }
if ($ReleaseDateDe) { Write-Host "  Date DE:  $ReleaseDateDe" }
