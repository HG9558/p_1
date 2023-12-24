import { Config } from "../xxtea";

export declare function encryptQuery(query: any, config: Config): string;

/**
 * 解密后端返回的数据
 * @param query 解密字符串
 * @param config {value: number} 加密值 
 */
export declare function decryptQuery(query: string, config: Config): string;