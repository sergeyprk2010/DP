export interface IProxyConfig {
    url: string;
    auth?: {
        username: string;
        password: string;
    };
}

export interface IProxyManagerConfig {
    enabled: boolean;
    proxies: IProxyConfig[];
    timeout?: number; // таймаут в мс, по умолчанию 20000 (20 секунд)
}