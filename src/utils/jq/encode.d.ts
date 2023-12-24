import { Config } from "../xxtea";

/**
 * headers加签
 * @param method 请求方法
 * @param data 请求数据
 * @param path 请求路径
 * @param t 服务器时间
 * @param value 加密值
 */
export declare function sign(method: string, data: string, path: string, t: string, config: Config): string;
export declare function pare(str: any): string;