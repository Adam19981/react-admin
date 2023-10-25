import { JSEncrypt } from "jsencrypt";

export function rsaEncrypt(publicKey: string, data: string): string | undefined {
	const encryptStr = new JSEncrypt();

	encryptStr.setPublicKey(publicKey); // 设置 加密公钥
	// 进行加密
	const result = encryptStr.encrypt(data);

	return result || undefined;
}
