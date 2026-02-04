# Windows 7/8.1 ve PowerShell 2.0 uyumluluğu için TLS 1.2'yi etkinleştir
# PowerShell 2.0'da TLS 1.2 enum değeri olmayabilir, bu yüzden değerini doğrudan kullanıyoruz
try {
    # PowerShell 3.0+ için standart yöntem
    $tls12 = [Enum]::ToObject([Net.SecurityProtocolType], 3072)  # TLS 1.2 = 0x0C00 = 3072
    [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor $tls12
} catch {
    try {
        # PowerShell 2.0 için alternatif yöntem: doğrudan değer atama
        $current = [Net.ServicePointManager]::SecurityProtocol.value__
        [Net.ServicePointManager]::SecurityProtocol = $current -bor 3072
    } catch {
        # TLS 1.2 etkinleştirme başarısız olsa bile devam et (WebClient kendisi halledebilir)
    }
}

if (-not $args) {
    Write-Host ''
    Write-Host 'https://erturk.netlify.app' -ForegroundColor Green
    Write-Host 'https://erturk.netlify.app/run' -ForegroundColor Green
    Write-Host 'https://github.com/abdullah-erturk/scan_repair_windows' -ForegroundColor Green
    Write-Host ''
}

# Sistem kullanıcı arayüzü dilini algıla (Windows 7/8.1 uyumlu)
# En güvenilir yöntem: registry'den doğrudan okuma (tüm Windows sürümlerinde çalışır)
$culture = $null
try {
    # PowerShell 3.0+ için önce Get-UICulture'ı dene (en güvenilir)
    $culture = (Get-UICulture).Name
} catch {
    # PowerShell 2.0 veya Get-UICulture başarısız olursa registry'den oku
    try {
        # Registry'den sistem dil kodunu oku (LCID - Language Code Identifier)
        # Bu değer tüm Windows sürümlerinde mevcuttur
        $lcid = (Get-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Nls\\Language" -Name Default -ErrorAction Stop).Default
        if ($lcid) {
            # LCID'yi kültür adına çevir (örn: 1055 -> tr-TR, 1033 -> en-US)
            $cultureInfo = [System.Globalization.CultureInfo]::GetCultureInfo([int]$lcid)
            $culture = $cultureInfo.Name
        } else {
            $culture = "en-US"
        }
    } catch {
        # Registry okuma da başarısız olursa varsayılan İngilizce
        $culture = "en-US"
    }
}

if ($culture -and $culture -like 'tr-*') {
    $url = 'https://raw.githubusercontent.com/abdullah-erturk/scan_repair_windows/refs/heads/main/check.bat' 
    Write-Host
    Write-Host "Turkish system detected. Downloading Turkish script..." -ForegroundColor Cyan
} else {
    $url = 'https://raw.githubusercontent.com/abdullah-erturk/scan_repair_windows/refs/heads/main/check.bat' 
    Write-Host
    Write-Host "Non-Turkish system detected. Downloading English script..." -ForegroundColor Yellow
}

# Dosya adının her seferinde benzersiz olmasını sağlamak için rastgele bir GUID oluşturur.
$guid = [guid]::NewGuid().ToString("N")
$filename = "$env:TEMP\\check_$guid.bat"

try {
    # PowerShell 2.0 uyumluluğu için önce WebClient kullan (Invoke-WebRequest PowerShell 3.0+ gerektirir)
    $downloadSuccess = $false
    try {
        # WebClient kullan (PowerShell 2.0+ uyumlu)
        $webClient = New-Object System.Net.WebClient
        # WebClient için TLS 1.2 desteği (.NET 4.0+ ile çalışır)
        $webClient.DownloadFile($url, $filename)
        $webClient.Dispose()
        $downloadSuccess = $true
    } catch {
        # WebClient başarısız olursa Invoke-WebRequest'i dene (PowerShell 3.0+)
        try {
            Invoke-WebRequest -Uri $url -OutFile $filename -UseBasicParsing -ErrorAction Stop
            $downloadSuccess = $true
        } catch {
            throw $_.Exception
        }
    }
    
    if ($downloadSuccess) {
        Write-Host
        Write-Host "Script downloaded: $filename" -ForegroundColor Green
    }
}
catch {
    Write-Host
    Write-Host "Error: Failed to download the script. The URL might be unreachable." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

try {
    # .bat dosyasını ayrı bir CMD penceresinde aç
    # cmd.exe ile açarak kesinlikle yeni bir konsol penceresi oluşturulur
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c", $filename -Wait
    Write-Host
}
catch {
    Write-Host
    Write-Host "Error: Failed to execute the script." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

try {
    Remove-Item $filename -Force -ErrorAction Stop
    Write-Host
    Write-Host "Temporary file deleted." -ForegroundColor White
    Write-Host
}
catch {
    Write-Host
    Write-Host "Warning: Temporary file could not be deleted." -ForegroundColor Red
    Write-Host
}