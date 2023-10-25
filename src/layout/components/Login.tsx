import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import loginStyle from "../index.module.scss";
import { getImages, login } from "@/api/login/loginInterface";
import { rsaEncrypt } from "@/utils";

type FieldType = {
	username?: string;
	password?: string;
	remember?: string;
};

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnKgH+2s5NRp+tmP4d41G
xhhCbAdDvd8Q8D0DAMvk0I40bLEhAj35HkZ36ETbpP98GWwPznM+gNZQ++0yoOZs
9PMkR0FQu7YnsVsv0a/7P/gaWsDemQBXWPrc51SwsFhFWfTeurH0j1moOSIFIJKw
PKls8ppOcLU1gYlR2dfRaxj0bIvXRsCmKalvVciIqAJ394z9VnU7adzkHgO9xZXP
jjK13TWXBJtOKLZ5K3fA6BzIcs7tnkVvqudDcIHR5ElS5YZTwZhintYa0zVVG2wf
6bBBbH+/s6LRsI4FJVbVvjziCL9fyjyPFTiLNOuSMywzMciUR1FKXxnB1VRNOZDc
wQIDAQAB
-----END PUBLIC KEY-----`;
const Login = () => {
	const [image, setImage] = useState<string>("");
	const onFinish = async (values: any) => {
		console.log(values);
		const req = {
			...values,
			password: rsaEncrypt(publicKey, values.password),
			imgEncrypt: form.imgEncrypt
		};
		await login(req);
	};

	useEffect(() => {
		getImages().then(res => {
			const { data } = res;
			setImage(data.image_base_64);
			form.imgEncrypt = data.img_encrypt;
		});
	}, []);

	const form = {
		imgEncrypt: ""
	};

	return (
		<div className={loginStyle.login_box}>
			<Form
				name="basic"
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				style={{ maxWidth: 600 }}
				initialValues={{ remember: true }}
				onFinish={onFinish}
				autoComplete="off"
			>
				<Form.Item<FieldType> label="账号" name="phone" rules={[{ required: true, message: "请输入账号" }]}>
					<Input />
				</Form.Item>

				<Form.Item<FieldType> label="密码" name="password" rules={[{ required: true, message: "请输入密码" }]}>
					<Input.Password />
				</Form.Item>

				<Form.Item<FieldType> label="验证码" name="code" rules={[{ required: true, message: "请输入验证码" }]}>
					<div className={loginStyle.login_box_code}>
						<Input />
						<img alt="" src={image} />
					</div>
				</Form.Item>

				<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
					<Button type="primary" htmlType="submit">
						登陆
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default Login;
