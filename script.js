

// DOM元素
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');
const clearBtn = document.getElementById('clearBtn');
const charCount = document.getElementById('charCount');
const loading = document.getElementById('loading');

// DeepSeek API 配置
const DEEPSEEK_CONFIG = {
    baseURL: 'https://api.deepseek.com',
    model: CONFIG.MODEL,
    apiKey: CONFIG.DEEPSEEK_API_KEY,
    stream: CONFIG.STREAM,
    temperature: CONFIG.TEMPERATURE,
    maxTokens: CONFIG.MAX_TOKENS
};

// 对话历史记录
let conversationHistory = [
    {
        role: "system",
        content: CONFIG.SYSTEM_PROMPT
    }
];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 自动聚焦到输入框
    messageInput.focus();
    
    // 绑定事件监听器
    messageInput.addEventListener('input', handleInput);
    messageInput.addEventListener('keydown', handleKeyDown);
    sendBtn.addEventListener('click', sendMessage);
    clearBtn.addEventListener('click', clearChat);
    
    // 自动调整输入框高度
    autoResizeTextarea();
});

// 处理输入变化
function handleInput() {
    const text = messageInput.value.trim();
    const length = messageInput.value.length;
    
    // 更新字符计数
    charCount.textContent = `${length}/2000`;
    
    // 启用/禁用发送按钮
    sendBtn.disabled = text.length === 0 || length > 2000;
    
    // 自动调整高度
    autoResizeTextarea();
}

// 处理键盘事件
function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!sendBtn.disabled) {
            sendMessage();
        }
    }
}

// 自动调整输入框高度
function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
}

// 发送消息
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || message.length > 2000) return;
    
    // 检查API密钥
    if (!DEEPSEEK_CONFIG.apiKey) {
        alert('请先在代码中配置你的 DeepSeek API Key！\n\n在 config.js 文件的 DEEPSEEK_API_KEY 字段中填入你的 API Key。');
        return;
    }
    
    // 检查是否在本地文件模式
    if (window.location.protocol === 'file:') {
        addMessage('检测到你在使用本地文件模式。由于浏览器安全限制，无法直接调用API。\n\n请使用以下方法之一：\n1. 使用本地服务器（推荐）\n2. 或者我可以为你提供模拟回复来测试界面', 'ai');
        return;
    }
    
    // 添加用户消息到界面
    addMessage(message, 'user');
    
    // 添加用户消息到对话历史
    conversationHistory.push({
        role: "user",
        content: message
    });
    
    // 清空输入框
    messageInput.value = '';
    handleInput();
    
    // 显示加载动画
    showLoading();
    
    try {
        // 调用 DeepSeek API
        const aiResponse = await callDeepSeekAPI();
        
        // 隐藏加载动画
        hideLoading();
        
        // 添加AI回复到界面
        addMessage(aiResponse, 'ai');
        
        // 添加AI回复到对话历史
        conversationHistory.push({
            role: "assistant",
            content: aiResponse
        });
        
    } catch (error) {
        // 隐藏加载动画
        hideLoading();
        
        // 显示错误消息
        console.error('API调用错误:', error);
        
        // 提供更详细的错误信息和解决方案
        let errorMessage = '抱歉，我遇到了一些技术问题。\n\n';
        errorMessage += '可能的原因：\n';
        errorMessage += '1. 网络连接问题\n';
        errorMessage += '2. API Key配置问题\n';
        errorMessage += '3. 跨域限制（建议使用本地服务器）\n\n';
        errorMessage += '解决方案：\n';
        errorMessage += '1. 检查网络连接\n';
        errorMessage += '2. 确认API Key是否正确\n';
        errorMessage += '3. 使用本地服务器运行（如：python -m http.server 8000）\n\n';
        errorMessage += `错误详情：${error.message}`;
        
        addMessage(errorMessage, 'ai');
    }
}

// 添加消息到聊天区域
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    messageText.textContent = text;
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = getCurrentTime();
    
    content.appendChild(messageText);
    content.appendChild(messageTime);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    
    // 滚动到底部
    scrollToBottom();
}

// 调用 DeepSeek API
async function callDeepSeekAPI() {
    const requestBody = {
        model: DEEPSEEK_CONFIG.model,
        messages: conversationHistory,
        stream: DEEPSEEK_CONFIG.stream,
        temperature: DEEPSEEK_CONFIG.temperature,
        max_tokens: DEEPSEEK_CONFIG.maxTokens
    };
    
    console.log('发送API请求:', requestBody);
    console.log('API Key:', DEEPSEEK_CONFIG.apiKey ? '已配置' : '未配置');
    
    try {
        const response = await fetch(`${DEEPSEEK_CONFIG.baseURL}/chat/completions`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_CONFIG.apiKey}`
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('API响应状态:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API错误响应:', errorText);
            
            let errorMessage = `API请求失败: ${response.status} ${response.statusText}`;
            try {
                const errorData = JSON.parse(errorText);
                if (errorData.error && errorData.error.message) {
                    errorMessage += `. ${errorData.error.message}`;
                }
            } catch (e) {
                errorMessage += `. 响应内容: ${errorText}`;
            }
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        console.log('API响应数据:', data);
        
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        } else {
            throw new Error('API返回数据格式异常: 没有找到choices字段');
        }
    } catch (error) {
        console.error('API调用异常:', error);
        throw error;
    }
}

// 获取当前时间
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// 显示加载动画
function showLoading() {
    loading.classList.add('show');
}

// 隐藏加载动画
function hideLoading() {
    loading.classList.remove('show');
}

// 滚动到底部
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 清空聊天记录
function clearChat() {
    if (confirm('确定要清空所有对话记录吗？')) {
        // 清空界面消息
        chatMessages.innerHTML = '';
        
        // 重置对话历史，保留系统消息
        conversationHistory = [
            {
                role: "system",
                content: CONFIG.SYSTEM_PROMPT
            }
        ];
        
        // 重新添加欢迎消息
        addMessage('你好！我是你的AI助手，有什么可以帮助你的吗？', 'ai');
        
        // 聚焦到输入框
        messageInput.focus();
    }
}

// 添加一些实用的功能

// 复制消息功能
function copyMessage(text) {
    navigator.clipboard.writeText(text).then(() => {
        // 可以添加一个提示
        console.log('消息已复制到剪贴板');
    });
}

// 导出聊天记录
function exportChat() {
    const messages = chatMessages.querySelectorAll('.message');
    let chatText = 'AI对话记录\n' + '='.repeat(20) + '\n\n';
    
    messages.forEach(message => {
        const isUser = message.classList.contains('user-message');
        const text = message.querySelector('.message-text').textContent;
        const time = message.querySelector('.message-time').textContent;
        
        chatText += `[${time}] ${isUser ? '用户' : 'AI'}: ${text}\n\n`;
    });
    
    // 创建下载链接
    const blob = new Blob([chatText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI对话记录_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 添加右键菜单功能（可选）
document.addEventListener('contextmenu', function(e) {
    if (e.target.closest('.message-text')) {
        e.preventDefault();
        // 可以在这里添加复制等右键菜单功能
    }
});

// 防止页面刷新时丢失输入内容
window.addEventListener('beforeunload', function() {
    if (messageInput.value.trim()) {
        localStorage.setItem('draftMessage', messageInput.value);
    }
});

// 恢复草稿
window.addEventListener('load', function() {
    const draft = localStorage.getItem('draftMessage');
    if (draft) {
        messageInput.value = draft;
        handleInput();
        localStorage.removeItem('draftMessage');
    }
});
