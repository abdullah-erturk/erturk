// netlify/functions/run.js
exports.handler = async function (event) {
const psScript = `# This code downloads the script file for the Turkish or English PMAS [Powershell Multi Activation System] application from the Github site, depending on the operating system language.

if (-not $args) {
    Write-Host ''
    Write-Host 'https://erturk.netlify.app' -ForegroundColor Green
    Write-Host 'https://github.com/abdullah-erturk/pmas' -ForegroundColor Green
    Write-Host 'https://www.tnctr.com/topic/1254611-pmas-v5-powershell-multi-activation-system-eskiden-tsf-activation/' -ForegroundColor Green
    Write-Host ''
}

    try {
        [void][System.AppDomain]::CurrentDomain.GetAssemblies(); [void][System.Math]::Sqrt(144)
    }
    catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Powershell failed to load .NET command."
        return
    }

    function Check3rdAV {
        try {
            $cmd = if ($psv -ge 3) { 'Get-CimInstance' } else { 'Get-WmiObject' }
            $avList = & $cmd -Namespace root\\SecurityCenter2 -Class AntiVirusProduct -ErrorAction SilentlyContinue | Where-Object { $_.displayName -notlike '*windows*' } | Select-Object -ExpandProperty displayName

            if ($avList) {
                Write-Host '3rd party Antivirus might be blocking the script - ' -ForegroundColor White -BackgroundColor Blue -NoNewline
                Write-Host " $($avList -join ', ')" -ForegroundColor DarkRed -BackgroundColor White
            }
        }
        catch {
        }
    }

    function CheckFile {
        param ([string]$FilePath)
        if (-not (Test-Path $FilePath)) {
            Check3rdAV
            Write-Host "Failed to create PMAS file in temp folder, aborting!"
            throw
        }
    }

    try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 } catch {}

    # --- Detect system language ---
    $osLanguage = (Get-UICulture).Name
    
    if (-not $osLanguage) {
        try {
            $osLanguage = [System.Globalization.CultureInfo]::InstalledUICulture.Name
        } catch {
            $osLanguage = (Get-Culture).Name
        }
    }

    # Only use Turkish version if system language is Turkish, otherwise use English
    if ($osLanguage -like 'tr-*') {
        $url = 'https://raw.githubusercontent.com/abdullah-erturk/pmas/refs/heads/main/TR/PMAS_v5_TR.bat'
        Write-Host
        Write-Host "Turkish system detected [$osLanguage]. Downloading Turkish script..." -ForegroundColor Cyan
    } else {
        $url = 'https://raw.githubusercontent.com/abdullah-erturk/pmas/refs/heads/main/ENG/PMAS_v5_ENG.bat'
        Write-Host
        Write-Host "Non-Turkish system detected [$osLanguage]. Downloading English script..." -ForegroundColor Yellow
    }

    $URLs = @($url)

    Write-Progress -Activity "Downloading..." -Status "Please wait"
    $errors = @()
    $responseBytes = $null
    
    foreach ($URL in $URLs | Sort-Object { Get-Random }) {
        try {
            if ($psv -ge 3) {
                $webResponse = Invoke-WebRequest -Uri $URL -UseBasicParsing
                if ($webResponse.Content -is [byte[]]) {
                    $responseBytes = $webResponse.Content
                } else {
                    $responseBytes = [System.Text.Encoding]::Default.GetBytes($webResponse.Content)
                }
            }
            else {
                $w = new-object Net.WebClient
                $responseBytes = $w.DownloadData($URL)
            }
            break
        }
        catch {
            $errors += $_
        }
    }
    Write-Progress -Activity "Downloading..." -Status "Done" -Completed

    if (-not $responseBytes -or $responseBytes.Length -eq 0) {
        Check3rdAV
        foreach ($err in $errors) {
            Write-Host "Error: $($err.Exception.Message)" -ForegroundColor Red
        }
        Write-Host "Failed to retrieve PMAS from repository, aborting!"
        Write-Host "Check if antivirus or firewall is blocking the connection."
        return
    }

    # Check for AutoRun registry which may create issues with CMD
    $paths = "HKCU:\\SOFTWARE\\Microsoft\\Command Processor", "HKLM:\\SOFTWARE\\Microsoft\\Command Processor"
    foreach ($path in $paths) { 
        if (Get-ItemProperty -Path $path -Name "Autorun" -ErrorAction SilentlyContinue) { 
            Write-Warning "Autorun registry found, CMD may crash! \`nManually copy-paste the below command to fix...\`nRemove-ItemProperty -Path '$path' -Name 'Autorun'"
        } 
    }

    $rand = [Guid]::NewGuid().Guid
    $filename = "PMAS_$rand.bat"
    $FilePath = Join-Path $env:TEMP $filename
    
    # Write bytes directly to file
    [System.IO.File]::WriteAllBytes($FilePath, $responseBytes)
    
    Write-Host ''
    Write-Host "Script downloaded: $FilePath" -ForegroundColor White
    Write-Host ''
    
    CheckFile $FilePath

    $env:ComSpec = "$env:SystemRoot\\system32\\cmd.exe"
    $chkcmd = & $env:ComSpec /c "echo CMD is working"
    if ($chkcmd -notcontains "CMD is working") {
        Write-Warning "cmd.exe is not working."
    }

    if ($psv -lt 3) {
        if (Test-Path "$env:SystemRoot\\Sysnative") {
            Write-Warning "Command is running with x86 Powershell, run it with x64 Powershell instead..."
            return
        }
        $p = saps -FilePath $env:ComSpec -ArgumentList "/c \`"\`"\`"$FilePath\`"\`" -el -qedit $args\`"\`"" -Verb RunAs -PassThru
        $p.WaitForExit()
    }
    else {
        saps -FilePath $env:ComSpec -ArgumentList "/c \`"\`"\`"$FilePath\`"\`" -el $args\`"\`"" -Wait -Verb RunAs
    }
    CheckFile $FilePath

    $UserTempPath = Join-Path $env:TEMP "PMAS*.bat"
    Get-Item $UserTempPath -ErrorAction SilentlyContinue | Remove-Item
    Write-Host "Temporary file deleted." -ForegroundColor Red
    Write-Host ''
    Write-Host "Exiting..." -ForegroundColor Red
    Start-Sleep -Seconds 3`;

  // Script'i UTF-16LE formatına çevirip Base64 ile kodla. -EncodedCommand için bu gereklidir.
  const encodedCommand = Buffer.from(psScript, 'utf16le').toString('base64');

  // PowerShell'e gönderilecek son, basit ve güvenli komut.
  const psRunnerCommand = `powershell.exe -NoProfile -EncodedCommand ${encodedCommand}`;

  const htmlContent = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>PMAS</title>
</head>
<body>
<section style="font-family: Consolas, monospace; background: #1e1e1e; color: #e4e4e4; padding: 20px; border-radius: 10px; max-width: 950px; margin: 40px auto;">
  <h3>TR: <br> Windows ve Office ürünlerini etkinleştirmek için PowerShell Multi Activation System hazır.</h3>
  <h3>EN: <br> PowerShell Multi Activation System is ready to activate Windows and Office products.</h3>
  <hr style="border: 1px solid #333; margin: 20px 0;">
  <h3 style="color: #4fc3f7;">💻 TR -> PowerShell Komut Satırı Üzerinden Çalıştırmak İçin:</h3>
  <h3 style="color: #4fc3f7;">💻 EN -> To Run via PowerShell Command Line:</h3>
  <ol style="margin-left: 20px;">
    <li>TR -> PowerShell'i açın. (Minimum Powershell versiyonu: 5.0/5.1)
      <small><br>(Bunu yapmak için <strong>Windows tuşu + X</strong> tuşlarına basın ve ardından <strong>PowerShell</strong> veya <strong>Terminal</strong> seçeneğini tıklayın.)</small><br>
        EN -> Open PowerShell. (Minimum Powershell version: 5.0/5.1)
      <small><br>(To do this, press <strong>Windows key + X</strong> and select <strong>PowerShell</strong> or <strong>Terminal</strong>.)</small><br><br>
    </li>
    <li> TR -> Aşağıdaki komutu kopyalayıp yapıştırın ve <strong>Enter</strong> tuşuna basın:<br>
          EN -> Copy and paste the command below and press <strong>Enter</strong>:
    </li>
  </ol>
  <pre style="background: #2d2d2d; color: #00e676; padding: 12px; border-radius: 8px; overflow-x: auto;">irm erturk.netlify.app/run | iex</pre>
  <small>TR -> Powershell sürümünüz 5.0'dan düşükse TLS 1.2 bağlantı hatası ile karşılaşabilirsiniz.. </small><br>
  <small>EN -> If your Powershell version is lower than 5.0, you may encounter a TLS 1.2 connection error.. </small>
  <p></p>
  <li>TR -> Eğer TLS 1.2 hatası alırsanız aşağıdaki komutu kullanın:</li>
  <li>EN -> If you get a TLS 1.2 error, use the command below instead:</li>
  <pre style="background: #2d2d2d; color: #00e676; padding: 12px; border-radius: 8px; overflow-x: auto;">[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; irm erturk.netlify.app/run | iex</pre>
</section>
</body>
</html>`;

  const ua = (event.headers['user-agent'] || '').toLowerCase();
  const isPowershell = ua.includes('powershell') || ua.includes('windows-powershell') || ua.includes('pwsh');

  if (isPowershell) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: psRunnerCommand
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: htmlContent
  };
};
