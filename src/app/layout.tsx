"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";
import BasicLayout from "@/layouts/BasicLayout";
import { useCallback, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store, { AppDispatch } from "@/store";
import { getLoginUserUsingGet } from "@/api/userController";
import { setLoginUser } from "@/store/loginUser";

/**
 * 全局初始化逻辑
 * @param children
 * @constructor
 */
const InitLayOut: React.FC<
  Readonly<{
    children: React.ReactNode;
  }>
> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  /**
   * 全局初始化函数，有全局单词调用的代码，都可以写到这里
   */
  const doInitLoginUser = useCallback(async () => {
    const res = await getLoginUserUsingGet();
    if (res.data) {
      // 更新全局状态
      // @ts-ignore
      dispatch(setLoginUser(res.data.data));
    }
  }, []);

  // deps中发生变化才会再次执行函数
  // deps 什么都不写，达到只执行一次的效果
  useEffect(() => {
    doInitLoginUser();
  }, []);

  return children;
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body>
        <AntdRegistry>
          <Provider store={store}>
            <InitLayOut>
              <BasicLayout>{children}</BasicLayout>
            </InitLayOut>
          </Provider>
        </AntdRegistry>
      </body>
    </html>
  );
}
