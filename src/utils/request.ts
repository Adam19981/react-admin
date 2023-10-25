import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ResultData } from "@/interface/http";
import { ResultEnum } from "@/enums/http";

/**
 * pinia 错误使用说明示例
 * https://github.com/vuejs/pinia/discussions/971
 * https://github.com/vuejs/pinia/discussions/664#discussioncomment-1329898
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#single-page-applications
 */

const config = {
	// 默认地址请求地址，可在 .env 开头文件中修改
	baseURL: import.meta.env.VITE_API_URL as string,
	// 设置超时时间（10s）
	timeout: ResultEnum.TIMEOUT as number
};

class RequestHttp {
	service: AxiosInstance;
	public constructor(config: AxiosRequestConfig) {
		// 实例化axios
		this.service = axios.create(config);

		/**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的token,存储到vuex/pinia/本地储存当中
     //  */
		this.service.interceptors.request.use(
			(config: AxiosRequestConfig) => {
				if (config.headers) {
					const token = this.token();
					if (token) config.headers["token"] = token;
				}
				// * 将当前请求添加到 pending 中
				return config;
			},
			(error: AxiosError) => {
				return Promise.reject(error);
			}
		);

		/**
		 * @description 响应拦截器
		 *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
		 */
		this.service.interceptors.response.use(
			(response: AxiosResponse) => {
				const { data, config } = response;
				// const globalStore = GlobalStore();
				// * 登陆失效（code == 599）
				if (data.code == ResultEnum.OVERDUE) {
					// ElMessage.error(data.message);
					// globalStore.setToken("");

					return Promise.reject(data);
				}
				// * 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
				if (data.code && data.code !== ResultEnum.SUCCESS) {
					// ElMessage.error(data.message);
					return Promise.reject(data);
				}
				// * 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
				return data;
			},
			async (error: AxiosError) => {
				const { response } = error;
				// 请求超时单独判断，因为请求超时没有 response
				if (error.message.indexOf("timeout") !== -1) {
					// ElMessage.error("请求超时！请您稍后重试");
				}
				// 根据响应的错误状态码，做不同的处理
				// if (response) checkStatus(response.status);
				return Promise.reject(error);
			}
		);
	}

	// * 常用请求方法封装
	get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.get(url, { params, ..._object });
	}
	post<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.post(url, params, _object);
	}

	setToken(token: string) {
		localStorage.setItem("token", token);
	}

	token() {
		return localStorage.getItem("token");
	}
}

export default new RequestHttp(config);
