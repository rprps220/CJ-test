@echo off
echo 启动简单HTTP服务器...
echo 服务器地址: http://localhost:8000
echo 按 Ctrl+C 停止服务器
python -m http.server 8000
pause



