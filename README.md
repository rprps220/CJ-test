# AI对话助手 - DeepSeek API集成版

一个简洁大方的AI对话网页，集成了DeepSeek API，提供智能对话功能。

## 功能特点

- 🤖 集成DeepSeek API，提供真实的AI对话体验
- 💬 支持连续对话，保持上下文
- 🎨 现代化UI设计，简洁大方
- 📱 完全响应式，支持各种设备
- ⚡ 流畅的动画效果和用户体验
- 🔧 可配置的API参数

## 快速开始

### 1. 获取DeepSeek API Key

1. 访问 [DeepSeek官网](https://platform.deepseek.com/)
2. 注册账号并登录
3. 在API管理页面创建新的API Key
4. 复制你的API Key

### 2. 配置API Key

打开 `config.js` 文件，在 `DEEPSEEK_API_KEY` 字段填入你的API Key：

```javascript
const CONFIG = {
    DEEPSEEK_API_KEY: 'your-api-key-here', // 在这里填入你的API Key
    // ... 其他配置
};
```

### 3. 运行网页

直接在浏览器中打开 `index.html` 文件即可开始使用。

## 配置选项

在 `config.js` 文件中，你可以调整以下配置：

```javascript
const CONFIG = {
    // API配置
    DEEPSEEK_API_KEY: '', // 你的DeepSeek API Key
    MODEL: 'deepseek-chat', // 模型选择：'deepseek-chat' 或 'deepseek-reasoner'
    STREAM: false, // 是否启用流式输出
    TEMPERATURE: 0.7, // 控制回复随机性 (0-1)
    MAX_TOKENS: 2000, // 最大回复长度
    
    // 系统提示词
    SYSTEM_PROMPT: "你是一个有用的AI助手，请用中文回答用户的问题。回答要简洁明了，友好专业。"
};
```

### 模型说明

- `deepseek-chat`: DeepSeek-V3.1 非思考模式，响应更快
- `deepseek-reasoner`: DeepSeek-V3.1 思考模式，推理能力更强

## 使用说明

1. **发送消息**: 在输入框中输入消息，按Enter键或点击发送按钮
2. **换行**: 按Shift+Enter可以换行
3. **清空对话**: 点击右上角的"清空对话"按钮
4. **字符限制**: 单条消息最多2000字符

## 技术实现

- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **API**: DeepSeek API (OpenAI兼容格式)
- **样式**: 现代化渐变背景，毛玻璃效果
- **图标**: Font Awesome
- **响应式**: 支持移动端和桌面端

## 注意事项

1. **API费用**: DeepSeek API按使用量计费，请注意控制使用量
2. **网络要求**: 需要能够访问 `https://api.deepseek.com`
3. **浏览器兼容**: 建议使用现代浏览器（Chrome、Firefox、Safari、Edge）

## 故障排除

### 常见问题

1. **API Key错误**
   - 检查API Key是否正确填入
   - 确认API Key是否有效且未过期

2. **网络连接问题**
   - 检查网络连接
   - 确认能够访问DeepSeek API

3. **跨域问题**
   - 建议通过本地服务器运行，而不是直接打开HTML文件
   - 可以使用 `python -m http.server` 或 `npx serve` 启动本地服务器

## 许可证

MIT License

## 更新日志

- v1.0.0: 初始版本，集成DeepSeek API
- 支持连续对话
- 响应式设计
- 可配置参数



