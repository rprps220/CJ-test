# PowerShell 启动脚本
Write-Host "正在启动AI对话助手服务器..." -ForegroundColor Green

# 检查Python是否可用
try {
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "找到Python: $pythonVersion" -ForegroundColor Yellow
        Write-Host "启动Python HTTP服务器..." -ForegroundColor Yellow
        Write-Host "服务器地址: http://localhost:8000" -ForegroundColor Cyan
        Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Red
        Write-Host ""
        
        # 启动Python服务器
        python -m http.server 8000
    } else {
        throw "Python未找到"
    }
} catch {
    Write-Host "Python未安装或不可用，尝试使用PowerShell内置服务器..." -ForegroundColor Yellow
    
    # 使用PowerShell内置的Web服务器
    $port = 8000
    $url = "http://localhost:$port/"
    
    Write-Host "启动PowerShell Web服务器..." -ForegroundColor Yellow
    Write-Host "服务器地址: $url" -ForegroundColor Cyan
    Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Red
    Write-Host ""
    
    # 创建简单的HTTP服务器
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($url)
    $listener.Start()
    
    Write-Host "服务器已启动！" -ForegroundColor Green
    
    try {
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
                $response.OutputStream.Write($content, 0, $content.Length)
            } else {
                $response.StatusCode = 404
            }
            
            $response.Close()
        }
    } finally {
        $listener.Stop()
        Write-Host "服务器已停止。" -ForegroundColor Red
    }
}


