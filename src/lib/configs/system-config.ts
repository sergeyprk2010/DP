import path from 'path';

import fs from 'fs-extra';
import yaml from 'yaml';
import _ from 'lodash';

import environment from '../environment.ts';
import { IProxyConfig } from '../interfaces/IProxyConfig.js';

const CONFIG_PATH = path.join(path.resolve(), 'configs/', environment.env, "/system.yml");

/**
 * 系统配置
 */
export class SystemConfig {

    /** 是否开启请求日志 */
    requestLog: boolean;
    /** 临时目录路径 */
    tmpDir: string;
    /** 日志目录路径 */
    logDir: string;
    /** 日志写入间隔（毫秒） */
    logWriteInterval: number;
    /** 日志文件有效期（毫秒） */
    logFileExpires: number;
    /** 公共目录路径 */
    publicDir: string;
    /** 临时文件有效期（毫秒） */
    tmpFileExpires: number;
    /** 请求体配置 */
    requestBody: any;
    /** 是否调试模式 */
    debug: boolean;
    /** 代理配置 */
    proxy: {
        enabled: boolean;
        timeout: number;
        proxies: IProxyConfig[];
    };

    constructor(options?: any) {
        const { requestLog, tmpDir, logDir, logWriteInterval, logFileExpires, publicDir, tmpFileExpires, requestBody, debug, proxy } = options || {};
        this.requestLog = _.defaultTo(requestLog, false);
        this.tmpDir = _.defaultTo(tmpDir, './tmp');
        this.logDir = _.defaultTo(logDir, './logs');
        this.logWriteInterval = _.defaultTo(logWriteInterval, 200);
        this.logFileExpires = _.defaultTo(logFileExpires, 2626560000);
        this.publicDir = _.defaultTo(publicDir, './public');
        this.tmpFileExpires = _.defaultTo(tmpFileExpires, 86400000);
        this.requestBody = Object.assign(requestBody || {}, {
            enableTypes: ['json', 'form', 'text', 'xml'],
            encoding: 'utf-8',
            formLimit: '100mb',
            jsonLimit: '100mb',
            textLimit: '100mb',
            xmlLimit: '100mb',
            formidable: {
                maxFileSize: '100mb'
            },
            multipart: true,
            parsedMethods: ['POST', 'PUT', 'PATCH']
        });
        this.debug = _.defaultTo(debug, true);
        
        // Инициализация прокси конфигурации
        this.proxy = {
            enabled: false,
            timeout: 20000,
            proxies: []
        };

        // Загрузка конфигурации прокси из env если есть
        if (process.env.PROXY_LIST) {
            try {
                const proxyList = JSON.parse(process.env.PROXY_LIST);
                if (Array.isArray(proxyList) && proxyList.length > 0) {
                    this.proxy.enabled = true;
                    this.proxy.proxies = proxyList;
                }
            } catch (error) {
                console.error('Error parsing PROXY_LIST:', error);
            }
        }

        // Применяем конфигурацию из файла если есть
        if (proxy) {
            this.proxy = {
                ...this.proxy,
                ...proxy
            };
        }

        // Переопределение таймаута из env если есть
        if (process.env.PROXY_TIMEOUT) {
            this.proxy.timeout = parseInt(process.env.PROXY_TIMEOUT);
        }
    }

    get rootDirPath() {
        return path.resolve();
    }

    get tmpDirPath() {
        return path.resolve(this.tmpDir);
    }

    get logDirPath() {
        return path.resolve(this.logDir);
    }

    get publicDirPath() {
        return path.resolve(this.publicDir);
    }

    static load() {
        if (!fs.pathExistsSync(CONFIG_PATH)) return new SystemConfig();
        const data = yaml.parse(fs.readFileSync(CONFIG_PATH).toString());
        return new SystemConfig(data);
    }
}

export default SystemConfig.load();