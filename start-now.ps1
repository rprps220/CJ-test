# 简单的PowerShell Web服务器
$port = 8000
$url = "http://localhost:$port/"

Write-Host "=== AI对话助手服务器 ===" -ForegroundColor Green
Write-Host "正在启动服务器..." -ForegroundColor Yellow
Write-Host "服务器地址: $url" -ForegroundColor Cyan
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Red
Write-Host ""

# 创建HTTP监听器
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)

try {
    $listener.Start()
    Write-Host "✅ 服务器启动成功！" -ForegroundColor Green
    Write-Host "🌐 请在浏览器中访问: $url" -ForegroundColor Cyan
    Write-Host ""
    
    # 自动打开浏览器
    Start-Process $url
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") { $localPath = "/index.html" }
        
        $filePath = Join-Path (Get-Location) $localPath.TrimStart('/')
        
        if (Test-Path $filePath) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $content.Length
            
            # 设置正确的MIME类型
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($extension) {
                ".html" { $response.ContentType = "text/html; charset=utf-8" }
                ".css" { $response.ContentType = "text/css" }
                ".js" { $response.ContentType = "application/javascript" }
                ".json" { $response.ContentType = "application/json" }
                default { $response.ContentType = "text/plain" }
            }
            
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
            $errorMsg = [System.Text.Encoding]::UTF8.GetBytes("文件未找到: $localPath")
            $response.ContentLength64 = $errorMsg.Length
            $response.OutputStream.Write($errorMsg, 0, $errorMsg.Length)
        }
        
        $response.Close()
    }
} catch {
    Write-Host "❌ 服务器启动失败: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    Write-Host "🛑 服务器已停止" -ForegroundColor Red
}


