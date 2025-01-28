import axios, { AxiosInstance, AxiosProxyConfig } from 'axios';
import { IProxyConfig, IProxyManagerConfig } from './interfaces/IProxyConfig.js';
import logger from './logger.js';

export class ProxyManager {
    private proxies: IProxyConfig[];
    private currentProxyIndex: number;
    private timeout: number;
    private enabled: boolean;

    constructor(config: IProxyManagerConfig) {
        this.proxies = config.proxies;
        this.currentProxyIndex = 0;
        this.timeout = config.timeout || 20000; // 20 секунд по умолчанию
        this.enabled = config.enabled;
    }

    public getCurrentProxy(): AxiosProxyConfig | null {
        if (!this.enabled || this.proxies.length === 0) return null;

        const proxy = this.proxies[this.currentProxyIndex];
        const proxyUrl = new URL(proxy.url);

        return {
            host: proxyUrl.hostname,
            port: parseInt(proxyUrl.port),
            protocol: proxyUrl.protocol.replace(':', ''),
            auth: proxy.auth
        };
    }

    private switchToNextProxy(): void {
        if (this.proxies.length <= 1) return;

        this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxies.length;
        logger.info(`Switching to proxy: ${this.proxies[this.currentProxyIndex].url}`);
    }

    public createAxiosInstance(): AxiosInstance {
        const instance = axios.create({
            timeout: this.timeout
        });

        // Добавляем прокси к запросам
        instance.interceptors.request.use(async (config) => {
            if (this.enabled && this.proxies.length > 0) {
                const proxy = this.getCurrentProxy();
                if (proxy) {
                    config.proxy = proxy;
                }
            }
            return config;
        });

        // Обработка ошибок и переключение прокси при таймауте
        instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (
                    error.code === 'ECONNREFUSED' || 
                    error.code === 'ETIMEDOUT' || 
                    error.message.includes('timeout')
                ) {
                    this.switchToNextProxy();
                    // Повторяем запрос с новым прокси
                    const newConfig = error.config;
                    const proxy = this.getCurrentProxy();
                    if (proxy) {
                        newConfig.proxy = proxy;
                    }
                    return axios(newConfig);
                }
                return Promise.reject(error);
            }
        );

        return instance;
    }
}