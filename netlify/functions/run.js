// netlify/functions/run.js
exports.handler = async function (event) {
  // PowerShell script'i Base64 formatında kodlandı.
  // Bu yöntem, JavaScript içindeki özel karakter (", \, `) sorunlarını tamamen ortadan kaldırır.
  const psScriptBase64 = "IyBUaGlzIGNvZGUgZG93bmxvYWRzIHRoZSBzY3JpcHQgZmlsZSBmb3IgdGhlIFR1cmtpc2ggb3IgRW5nbGlzaCBQTUFTIHY1IFtQb3dlcnNoZWxsIE11bHRpIEFjdGl2YXRpb24gU3lzdGVtXSBhcHBsaWNhdGlvbiBmcm9tIHRoZSBHaXRodWIgc2l0ZSwgZGVwZW5kaW5nIG9uIHRoZSBvcGVyYXRpbmcgc3lzdGVtIGxhbmd1YWdlLg0KDQppZiAoLW5vdCAkYXJncykgew0KICAgIFdyaXRlLUhvc3QgJycNCiAgICBXcml0ZS1Ib3N0ICdodHRwczovL2VydHVyay5uZXRsaWZ5LmFwcCcgLUZvcmVncm91bmRDb2xvciBHcmVlbg0KICAgIFdyaXRlLUhvc3QgJ2h0dHBzOi8vZ2l0aHViLmNvbS9hYmR1bGxhaC1lcnR1cmsvcG1hcycgLUZvcmVncm91bmRDb2xvciBHcmVlbg0KICAgIFdyaXRlLUhvc3QgJ2h0dHBzOi8vd3d3LnRuY3RyLmNvbS90b3BpYy8xMjU0NjExLXBtYXMtdjUtcG93ZXJzaGVsbC1tdWx0aS1hY3RpdmF0aW9uLXN5c3RlbS1lc2tpZGVuLXRzZi1hY3RpdmF0aW9uLycgLUZvcmVncm91bmRDb2xvciBHcmVlbg0KICAgIFdyaXRlLUhvc3QgJycNCn0NCg0KICAgIHRyeSB7DQogICAgICAgIFt2b2lkXVtTeXN0ZW0uQXBwRG9tYWluXTo6Q3VycmVudERvbWFpbi5HZXRBc3NlbWJsaWVzKCk7IFt2b2lkXVtTeXN0ZW0uTWF0aF06OlNxcnQoMTQ0KQ0KICAgIH0NCiAgICBjYXRjaCB7DQogICAgICAgIFdyaXRlLUhvc3QgIkVycm9yOiAkKCRfLkV4Y2VwdGlvbi5NZXNzYWdlKSIgLUZvcmVncm91bmRDb2xvciBSZWQNCiAgICAgICAgV3JpdGUtSG9zdCAiUG93ZXJzaGVsbCBmYWlsZWQgdG8gbG9hZCAuTkVUIGNvbW1hbmQuIg0KICAgICAgICByZXR1cm4NCiAgICB9DQoNCiAgICBmdW5jdGlvbiBDaGVjazNyZEFWIHsNCiAgICAgICAgdHJ5IHsNCiAgICAgICAgICAgICRjbWQgPSBpZiAoJHBzdiAtZ2UgMykgeyAnR2V0LUNpbUluc3RhbmNlJyB9IGVsc2UgeyAnR2V0LVdtaU9iamVjdCcgfQ0KICAgICAgICAgICAgJGF2TGlzdCA9ICYgJGNtZCAtTmFtZXNwYWNlIHJvb3RcU2VjdXJpdHlDZW50ZXIyIC1DbGFzcyBBbnRpVmlydXNQcm9kdWN0IC1FcnJvckFjdGlvbiBTaWxlbnRseUNvbnRpbnVlIHwgV2hlcmUtT2JqZWN0IHsgJF8uZGlzcGxheU5hbWUgLW5vdGxpa2UgJyp3aW5kb3dzKicgfSB8IFNlbGVjdC1PZmplY3QgLUV4cGFuZFByb3BlcnR5IGRpc3BsYXlOYW1lDQoNCiAgICAgICAgICAgIGlmICgkYXZMaXN0KSB7DQogICAgICAgICAgICAgICAgV3JpdGUtSG9zdCAnM3JkIHBhcnR5IEFudGl2aXJ1cyBtaWdodCBiZSBibG9ja2luZyB0aGUgc2NyaXB0IC0gJyAtRm9yZWdyb3VuZENvbG9yIFdoaXRlIC1CYWNrZ3JvdW5kQ29sb3IgQmx1ZSAtTm9OZXdsaW5lDQogICAgICAgICAgICAgICAgV3JpdGUtSG9zdCAiICQoJGF2TGlzdCAtam9pbiAnLCAnKSIgLUZvcmVncm91bmRDb2xvciBEYXJrUmVkIC1CYWNrZ3JvdW5kQ29sb3IgV2hpdGUNCiAgICAgICAgICAgIH0NCiAgICAgICAgfQ0KICAgICAgICBjYXRjaCB7DQogICAgICAgIH0NCiAgICB9DQoNCiAgICBmdW5jdGlvbiBDaGVja0ZpbGUgew0KICAgICAgICBwYXJhbSAoW3N0cmluZ10kRmlsZVBhdGgpDQogICAgICAgIGlmICgtbm90IChUZXN0LVBhdGggJEZpbGVQYXRoKSkgew0KICAgICAgICAgICAgQ2hlY2szcmRBVg0KICAgICAgICAgICAgV3JpdGUtSG9zdCAiRmFpbGVkIHRvIGNyZWF0ZSBQTUFTIGZpbGUgaW4gdGVtcCBmb2xkZXIsIGFib3J0aW5nIQ0KICAgICAgICAgICAgdGhyb3cNCiAgICAgICAgfQ0KICAgIH0NCg0KICAgIHRyeSB7IFtOZXQuU2VydmljZVBvaW50TWFuYWdlcl06OlNlY3VyaXR5UHJvdG9jb2wgPSBbTmV0LlNlY3VyaXR5UHJvdG9jb2xUeXBlXTo6VscxMiB9IGNhdGNoIHt9DQoNCiAgICAjIC0tLSBEZXRlY3Qgc3lzdGVtIGxhbmd1YWdlIC0tLQ0KICAgICRvc0xhbmd1YWdlID0gKEdldC1VSUN1bHR1cmUpLk5hbWUNCiAgICANCiAgICBpZiAoLW5vdCAkb3NMYW5ndWFnZSkgew0KICAgICAgICB0cnkgew0KICAgICAgICAgICAgJG9zTGFuZ3VhZ2UgPSBbU3lzdGVtLkdsb2JhbGl6YXRpb24uQ3VsdHVyZUluZm9dOjpJbnN0YWxsZWRVSUN1bHR1cmUuTmFtZQ0KICAgICAgICB9IGNhdGNoIHsNCiAgICAgICAgICAgICRvc0xhbmd1YWdlID0gKEdldC1DdWx0dXJlKS5OYW1lDQogICAgICAgIH0NCiAgICB9DQoNCiAgICAjIE9ubHkgdXNlIFR1cmtpc2ggdmVyc2lvbiBpZiBzeXN0ZW0gbGFuZ3VhZ2UgaXMgVHVya2lzaCwgb3RoZXJ3aXNlIHVzZSBFbmdsaXNoDQogICAgaWYgKCRvc0xhbmd1YWdlIC1saWtlICd0ci0qJykgew0KICAgICAgICAkdXJsID0gJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9hYmR1bGxhaC1lcnR1cmsvcG1hcy9yZWZzL2hlYWRzL21haW4vVFIvUE1BU192NV9UUi5iYXQnDQogICAgICAgIFdyaXRlLUhvc3QNCiAgICAgICAgV3JpdGUtSG9zdCAiVHVya2lzaCBzeXN0ZW0gZGV0ZWN0ZWQgWyRvc0xhbmd1YWdlXS4gRG93bmxvYWRpbmcgVHVya2lzaCBzY3JpcHQuLi4iIC1Gb3JlZ3JvdW5kQ29sb3IgQ3lhbg0KICAgIH0gZWxzZSB7DQogICAgICAgICR1cmwgPSAnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2FiZHVsbGFoLWVydHVyay9wbWFzL3JlZnMvaGVhZHMvbWFpbi9FTkcvUE1BU192NV9FTkcuYmF0Jw0KICAgICAgICBXcml0ZS1Ib3N0DQogICAgICAgIFdyaXRlLUhvc3QgIk5vbi1UdXJraXNoIHN5c3RlbSBkZXRlY3RlZCBbJG9zTGFuZ3VhZ2VdLiBEb3dubG9hZGluZyBFbmdsaXNoIHNjcmlwdC4uLiIgLUZvcmVncm91bmRDb2xvciBZZWxsb3cNCiAgICB9DQoNCiAgICAkVVJMexA9IEAoJHVybCkNCg0KICAgIFdyaXRlLVByb2dyZXNzIC1BY3Rpdml0eSAiRG93bmxvYWRpbmcuLi4iIC1TdGF0dXMgIlBsZWFzZSB3YWl0Ig0KICAgICRlcnJvcnMgPSBAKCkNCiAgICAkcmVzcG9uc2VCeXRlcyA9ICRudWxsDQogICAgDQogICAgZm9yZWFjaCAoJFVSTCBpbiAkVVJMcyB8IFNvcnQtT2JqZWN0IHsgR2V0LVJhbmRvbSB9KSB7DQogICAgICAgIHRyeSB7DQogICAgICAgICAgICBpZiAoJHBzdiAtZ2UgMykgew0KICAgICAgICAgICAgICAgICR3ZWJSZXNwb25zZSA9IEludm9rZS1XZWJSZXF1ZXN0IC1VcmkgJFVSTCAtVXNlQmFzaWNQYXJzaW5nDQogICAgICAgICAgICAgICAgaWYgKCR3ZWJSZXNwb25zZS5Db250ZW50IC1pcyBbYnl0ZVtdXSkgeyANCiAgICAgICAgICAgICAgICAgICAgJHJlc3BvbnNlQnl0ZXMgPSAkd2ViUmVzcG9uc2UuQ29udGVudA0KICAgICAgICAgICAgICAgIH0gZWxzZSB7DQogICAgICAgICAgICAgICAgICAgICRyZXNwb25zZUJ5dGVzID0gW1N5c3RlbS5UZXh0LkVuY29kaW5nXTo6RGVmYXVsdC5HZXRCeXRlcygkd2ViUmVzcG9uc2UuQ29udGVudCkNCiAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICB9DQogICAgICAgICAgICBlbHNlIHsNCiAgICAgICAgICAgICAgICAkdyA9IE5ldy1PZmplY3QgTmV0LldlYkNsaWVudA0KICAgICAgICAgICAgICAgICRyZXNwb25zZUJ5dGVzID0gJHcuRG93bmxvYWREYXRhKCRVUkwpDQogICAgICAgICAgICB9DQogICAgICAgICAgICBicmVhaw0KICAgICAgICB9DQogICAgICAgIGNhdGNoIHsNCiAgICAgICAgICAgICRlcnJvcnMgKz0gJF8NCiAgICAgICAgfQ0KICAgIH0NCiAgICBXcml0ZS1Qcm9ncmVzcyAtQWN0aXZpdHkgIkRvd25sb2FkaW5nLi4uIiAtU3RhdHVzICJEb25lIiAtQ29tcGxldGVkDQoNCiAgICBpZiAoLW5vdCAkcmVzcG9uc2VCeXRlcyAtb3IgJHJlc3BvbnNlQnl0ZXMuTGVuZ3RoIC1lcSAwKSB7DQogICAgICAgIENoZWNrM3JkQVYNCiAgICAgICAgZm9yZWFjaCAoJGVyciBpbiAkZXJyb3JzKSB7DQogICAgICAgICAgICBXcml0ZS1Ib3N0ICJFcnJvcjogJCgkZXJyLkV4Y2VwdGlvbi5NZXNzYWdlKSIgLUZvcmVncm91bmRDb2xvciBSZWQNCiAgICAgICAgfQ0KICAgICAgICBXcml0ZS1Ib3N0ICJGYWlsZWQgdG8gcmV0cmlldmUgUE1BUyBmcm9tIHJlcG9zaXRvcnksIGFib3J0aW5nIQ0KICAgICAgICBXcml0ZS1Ib3N0ICJDaGVjayBpZiBhbnRpdmlydXMgb3IgZmlyZXdhbGwgaXMgYmxvY2tpbmcgdGhlIGNvbm5lY3Rpb24uIg0KICAgICAgICByZXR1cm4NCiAgICB9DQoNCiAgICAjIENoZWNrIGZvciBBdXRvUnVuIHJlZ2lzdHJ5IHdoaWNoIG1heSBjcmVhdGUgaXNzdWVzIHdpdGggQ01EDQogICAgJHBhdGhzID0gIkhLQ1U6XFNPRlRXQVJFXE1pY3Jvc29mdFxDb21tYW5kIFByb2Nlc3NvciIsICJIS0xNOlxTT0ZUV0FSRVxNaWNyb3NvZnRcbWFtbWFuZCBQcm9jZXNzb3IiDQogICAgZm9yZWFjaCAoJHBhdGggaW4gJHBhdGhzKSB7IA0KICAgICAgICBpZiAoR2V0LUl0ZW1Qcm9wZXJ0eSAtUGF0aCAkcGF0aCAtTmFtZSAiQXV0b3J1biIgLUVycm9yQWN0aW9uIFNpbGVudGx5Q29udGludWUpIHsgDQogICAgICAgICAgICBXcml0ZS1XYXJuaW5nICJBdXRvcnVuIHJlZ2lzdHJ5IGZvdW5kLCBDTUQgbWF5IGNyYXNoISBgblRhaWx5IGNvcHktcGFzdGUgdGhlIGJlbG93IGNvbW1hbmQgdG8gZml4Li4uYG5SZW1vdmUtSXRlbVByb3BlcnR5IC1QYXRoICckcGF0aCcgLU5hbWUgJ0F1dG9ydW4nIg0KICAgICAgICB9IA0KICAgIH0NCg0KICAgICRyYW5kID0gW0d1aWRdOjpOZXdDdWRKCkuR3VpZCAgIA0KICAgICRmaWxlbmFtZSA9ICJQTUFTXyRyYW5kLmJhdCIgICAgDQogICAgJEZpbGVQYXRoID0gSm9pbi1QYXRoICRlbnY6VEVNUC hallwaysZmlsZW5hbWUNCiAgICANCiAgICAjIFdyaXRlIGJ5dGVzIGRpcmVjdGx5IHRvIGZpbGUNCiAgICBbU3lzdGVtLklPLkZpbGVdOjpXcml0ZUFsbEJ5dGVzKCRGaWxlUGF0aCwgJHJlc3BvbnNlQnl0ZXMpDQogICAgDQogICAgV3JpdGUtSG9zdCAnJw0KICAgIFdyaXRlLUhvc3QgIlNjcmlwdCBkb3dubG9hZGVkOiAkRmlsZVBhdGgiIC1Gb3JlZ3JvdW5kQ29sb3IgV2hpdGUNCiAgICBXcml0ZS1Ib3N0ICcnDQogICAgDQogICAgQ2hlY2tGaWxlICRGaWxlUGF0aA0KDQogICAgJGVudjpDb21TcGVjID0gIiRlbnY6U3lzdGVtUm9vdFxzeXN0ZW0zMlxjbWQuZXhlIg0KICAgICRja2NtZCA9ICYgJGVudjpDb21TcGVjIC9jICJlY2hvIENEIGlzIHdvcmtpbmciDQogICAgaWYgKCRja2NtZCAtbm90Y29udGFpbnMgIkNNRCBocyB3b3JraW5nIikgew0KICAgICAgICBXcml0ZS1XYXJuaW5nICJjbWQuZXhlIGlzIG5vdCB3b3JraW5nLiINCiAgICB9DQoNCiAgICBpZiAoJHBzdiAtbHQgMykgew0KICAgICAgICBpZiAoVGVzdC1QYXRoICIkZW52OlN5c3RlbVJvb3RcU3lzbmF0aXZlIikgew0KICAgICAgICAgICAgV3JpdGUtV2FybmluZyAiQ29tbWFuZCBpcyBydW5uaW5nIHdpdGggeDg2IFBvd2Vyc2hlbGwsIHJ1biBpdCB3aXRoIHg2NCBQb3dlcnNoZWxsIGluc3RlYWQuLi4iDQogICAgICAgICAgICByZXR1cm4NCiAgICAgICAgfQ0KICAgICAgICAkcCA9IHNhcHMgLUZpbGVQYXRoICRlbnY6Q29tU3BlYyAtQXJndW1lbnRMaXN0ICIvYyBcIlwiXCIkRmlsZVBhdGhcIlwiIC1lbCAtcWVkaXQgJGFyZ3NcIlwiIiAtVmVyYiBSdW5BcyAtUGFzc1RocnUNCiAgICAgICAgJHAuV2FpdEZvckV4aXQoKQ0KICAgIH0NCiAgICBlbHNlIHsNCiAgICAgICAgc2FwcyAtRmlsZVBhdGggJGVudjpDb21TcGVjIC1Bcmd1bWVudExpc3QgIi9jIFwiXCIXCIkRmlsZVBhdGhcIlwiIC1lbCAkYXJnc1wiXCIiIC1XYWl0IC1WZXJiIFJ1bkFzDQogICAgfSAgIA0KICAgIENoZWNrRmlsZSAkRmlsZVBhdGgNCg0KICAgICRVc2VyVGVtcFBhdGggPSBKb2luLVBhdGggJGVudjpURU1QICJQTUFTKi5iYXQiDQogICAgR2V0LUl0ZW0gJFVzZXJUZW1wUGF0aCAtRXJyb3JBY3Rpb24gU2lsZW50bHlDb250aW51ZSB8IFJlbW92ZS1JdGVtDQogICAgV3JpdGUtSG9zdCAiVGVtcG9yYXJ5IGZpbGUgZGVsZXRlZC4iIC1Gb3JlZ3JvdW5kQ29sb3IgUmVkDQogICAgV3JpdGUtSG9zdCAnJw0KICAgIFdyaXRlLUhvc3QgIkV4aXRpbmcuLi4iIC1Gb3JlZ3JvdW5kQ29sb3IgUmVkDQogICAgU3RhcnQtU2xlZXAgLVNlY29uZHMgMw==";

  // PowerShell'e Base64 dizesini çözüp çalıştırmasını söyleyen komut.
  const psCommand = `[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${psScriptBase64}')) | Invoke-Expression`;
  
  // Basit HTML içeriği (tarayıcılar için) - değişmedi
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
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff'
      },
      // Komutu PowerShell'e gönder
      body: psCommand
    };
  }

  // Tarayıcılar için HTML döndür
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    },
    body: htmlContent
  };
};
