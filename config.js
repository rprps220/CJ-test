// DeepSeek API 配置文件
// 请在这里填入你的 DeepSeek API Key

const CONFIG = {
    // DeepSeek API 配置
    DEEPSEEK_API_KEY: 'sk-d4cd0ad461f548d5985d761412cefc5d', // 请在这里填入你的 DeepSeek API Key
    
    // 可选配置
    MODEL: 'deepseek-chat', // 'deepseek-chat' 或 'deepseek-reasoner'
    STREAM: false, // 是否启用流式输出
    TEMPERATURE: 0.7, // 控制回复的随机性 (0-1)
    MAX_TOKENS: 2000, // 最大回复长度
    
    // 系统提示词
    SYSTEM_PROMPT: "你是一个有用的AI助手，请用中文回答用户的问题。回答要简洁明了，友好专业。"
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
