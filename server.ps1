# HTTP Server for CULTURA GENERAL PRO
# Serves current folder on http://localhost:8080

$port = 8080
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CULTURA GENERAL PRO - Servidor OK" -ForegroundColor Yellow
Write-Host "  URL: http://localhost:$port" -ForegroundColor Green
Write-Host "  Presiona Ctrl+C para detener" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan

Start-Process "http://localhost:$port"

$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.ico'  = 'image/x-icon'
    '.json' = 'application/json'
    '.svg'  = 'image/svg+xml'
}

try {
    while ($listener.IsListening) {
        $context  = $listener.GetContext()
        $request  = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.AbsolutePath
        if ($urlPath -eq '/' -or $urlPath -eq '') { $urlPath = '/index.html' }
        $urlPath  = [System.Uri]::UnescapeDataString($urlPath)
        $filePath = Join-Path $root ($urlPath.TrimStart('/').Replace('/', '\'))

        Write-Host "$($request.HttpMethod) $urlPath" -ForegroundColor DarkGray

        if (Test-Path $filePath -PathType Leaf) {
            $ext     = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime    = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType     = $mime
            $response.ContentLength64 = $content.Length
            $response.StatusCode      = 200
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $response.StatusCode      = 404
            $response.ContentType     = 'text/plain; charset=utf-8'
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }

        $response.OutputStream.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "Servidor detenido." -ForegroundColor Yellow
}
