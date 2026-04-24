exports.handler = async function (event) {
    const psScript = `# This code downloads the script file for the Turkish or English PMAS [Powershell Multi Activation System] application from the Github site, depending on the operating system language.

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
    Write-Host 'https://erturk-dev.netlify.app' -ForegroundColor Green
    Write-Host 'https://erturk-dev.netlify.app/run' -ForegroundColor Green
    Write-Host 'https://github.com/abdullah-erturk/pmas' -ForegroundColor Green
    Write-Host 'https://www.tnctr.com/topic/1254611-pmas' -ForegroundColor Green
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
    $url = 'https://raw.githubusercontent.com/abdullah-erturk/pmas/refs/heads/main/PMAS.bat'  
    Write-Host
    Write-Host "Turkish system detected. Downloading Turkish script..." -ForegroundColor Cyan
} else {
    $url = 'https://raw.githubusercontent.com/abdullah-erturk/pmas/refs/heads/main/PMAS.bat'  
    Write-Host
    Write-Host "Non-Turkish system detected. Downloading English script..." -ForegroundColor Yellow
}

# Dosya adının her seferinde benzersiz olmasını sağlamak için rastgele bir GUID oluşturur.
$guid = [guid]::NewGuid().ToString("N")
$filename = "$env:TEMP\\pmas_$guid.bat"

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
}`;

    // Basit HTML içeriği (tarayıcılar için)
    const htmlContent = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>PMAS</title>
</head>
<body>
<section style="font-family: Consolas, monospace; background: #1e1e1e; color: #e4e4e4; padding: 20px; border-radius: 10px; max-width: 950px; margin: 40px auto;">
	<div style="margin-bottom: 20px;">
		<a href="https://erturk-dev.netlify.app" style="display: inline-block; padding: 10px 20px; background: #4fc3f7; color: #1e1e1e; text-decoration: none; border-radius: 5px; font-weight: bold; transition: background 0.3s;">Ana Sayfa / Home</a>
	</div>  <h3>TR: <br> Windows ve Office ürünlerini etkinleştirmek için PowerShell Multi Activation System hazır.</h3>
  <h3>EN: <br> PowerShell Multi Activation System is ready to activate Windows and Office products.</h3>
  <hr style="border: 1px solid #333; margin: 20px 0;">

  <h3 style="color: #4fc3f7;">💻 TR -> PowerShell Komut Satırı Üzerinden Çalıştırmak İçin:</h3>
  <h3 style="color: #4fc3f7;">💻 EN -> To Run via PowerShell Command Line:</h3>

  <ol style="margin-left: 20px;">
    <li>TR -> PowerShell'i açın.
      <small><br>(Bunu yapmak için <strong>Windows tuşu + X</strong> tuşlarına basın ve ardından <strong>PowerShell</strong> veya <strong>Terminal</strong> seçeneğini tıklayın.)</small><br>
      EN -> Open PowerShell.
      <small><br>(To do this, press <strong>Windows key + X</strong> and select <strong>PowerShell</strong> or <strong>Terminal</strong>.)</small><br><br>
    </li>
    <li> TR -> Aşağıdaki komutu kopyalayıp yapıştırın ve <strong>Enter</strong> tuşuna basın:<br>
      EN -> Copy and paste the command below and press <strong>Enter</strong>:
    </li>
  </ol>


  <small>TR -> Kullandığınız Windows sürümüne uygun komutu seçin. <br>
  EN -> Use the command that matches your Windows version.</small>
  
  <h4 style="color: #ffb74d;">Windows 7 (PowerShell 2.0):</h4>
  <pre style="background: #2d2d2d; color: #ffb74d; padding: 12px; border-radius: 8px; overflow-x: auto;">(New-Object Net.WebClient).DownloadString('https://erturk-dev.netlify.app/run?ps=1') | iex</pre>

  <h4 style="color: #ffeb3b;">Windows 8.1 ve Windows Server:</h4>
  <pre style="background: #2d2d2d; color: #ffeb3b; padding: 12px; border-radius: 8px; overflow-x: auto;">[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; irm erturk-dev.netlify.app/run | iex</pre>

  <h4 style="color: #81c784;">Windows 10 ve Windows 11:</h4>
  <pre style="background: #2d2d2d; color: #00e676; padding: 12px; border-radius: 8px; overflow-x: auto;">irm erturk-dev.netlify.app/run | iex</pre>

</section>
</body>
</html>`;

    const ua = (event.headers['user-agent'] || '').toLowerCase();
    const qs = event.queryStringParameters || {};

    // PowerShell user-agent'ı tespiti (tüm sürümler)
    const isPowershell =
        ua.includes('powershell') ||
        ua.includes('windows-powershell') ||
        ua.includes('pwsh');

    // Sorgu parametresi ile PowerShell çıktısını zorla (ör: ?ps=1 veya ?raw=1)
    const forcePs =
        (typeof qs.ps !== 'undefined' && qs.ps === '1') ||
        (typeof qs.raw !== 'undefined' && qs.raw === '1');

    if (isPowershell || forcePs) {
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'X-Content-Type-Options': 'nosniff'
            },
            body: psScript
        };
    }

    // Diğer (tarayıcı vb.) -> HTML döndür
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache'
        },
        body: htmlContent
    };
};
