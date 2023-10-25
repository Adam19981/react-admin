import { Navigate } from "react-router-dom";
import React from "react";

export default function Auth(props:any) {
    const { meta } = props;

    console.log(meta)
    // 设置标题
    if (meta && meta.title) {
        document.title = meta.title;
    }

    const token = localStorage.getItem("token");

    // 权限校验，需要token但是没有token就重定向去登录页

    if (meta && meta.needLogin && !token) {
        return <Navigate to="/login" replace></Navigate>;
    }

    return <>{props.children}</>;
}

