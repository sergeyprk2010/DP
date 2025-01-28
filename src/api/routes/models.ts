import lodash from 'lodash';

export default {

    prefix: '/v1',

    get: {
        '/models': async () => {
            return {
                "data": [
                    {
                        "id": "deepseek-chat",
                        "object": "model",
                        "owned_by": "deepseek-free-api",
                        "description": "Default chat model"
                    },
                    {
                        "id": "deepseek-chat-search",
                        "object": "model",
                        "owned_by": "deepseek-free-api",
                        "description": "Chat model with internet search capability"
                    },
                    {
                        "id": "deepseek-chat-think",
                        "object": "model",
                        "owned_by": "deepseek-free-api",
                        "description": "Chat model with deep thinking capability"
                    },
                    {
                        "id": "deepseek-chat-think-silent",
                        "object": "model",
                        "owned_by": "deepseek-free-api",
                        "description": "Chat model with hidden thinking process"
                    },
                    {
                        "id": "deepseek-chat-think-fold",
                        "object": "model",
                        "owned_by": "deepseek-free-api",
                        "description": "Chat model with collapsible thinking process"
                    },
                    {
                        "id": "deepseek-chat-think-search",
                        "object": "model",
                        "owned_by": "deepseek-free-api",
                        "description": "Chat model with thinking and search capabilities"
                    },
                    {
                        "id": "deepseek-coder",
                        "object": "model",
                        "owned_by": "deepseek-free-api",
                        "description": "Code-specialized model"
                    }
                ]
            };
        }
    }
}