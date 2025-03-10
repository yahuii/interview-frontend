"use client";
import {GithubFilled, LogoutOutlined, SearchOutlined,} from "@ant-design/icons";
import {ProLayout} from "@ant-design/pro-components";
import {Dropdown, Input, message, theme} from "antd";
import React, {useState} from "react";
import Image from "next/image";
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";
import GlobalFooter from "@/components/GlobalFooter";
import "./index.css";
import {menus} from "../../../config/menu";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store";
import getAccesibleMenus from "@/access/menuAccess";
import MdEditor from "@/components/MdEditor";
import MdViewer from "@/components/MdViewer";
import {userLogoutUsingPost} from "@/api/userController";
import {setLoginUser} from "@/store/loginUser";
import {DEFAULT_USER} from "@/constants/user";

/**
 * 搜索条
 * @constructor
 */
const SearchInput = () => {
  const { token } = theme.useToken();
  return (
    <div
      key="SearchOutlined"
      aria-hidden
      style={{
        display: "flex",
        alignItems: "center",
        marginInlineEnd: 24,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Input
        style={{
          borderRadius: 4,
          marginInlineEnd: 12,
          backgroundColor: token.colorBgTextHover,
        }}
        prefix={
          <SearchOutlined
            style={{
              color: token.colorTextLightSolid,
            }}
          />
        }
        placeholder="搜索题目"
        variant="borderless"
      />
    </div>
  );
};

interface Props {
  children: React.ReactNode;
}

export default function BasicLayout({ children }: Props) {
  const pathname = usePathname();
  const loginUser = useSelector((state: RootState) => state.loginUser);
  const router = useRouter();
  const dispatch = useDispatch();
    /**
     * 用户注销
     */
    const userLogout  = async () => {
        try {
            await userLogoutUsingPost();
            message.success("已退出登录");
            dispatch(setLoginUser(DEFAULT_USER));
            router.push("/user/login");
        } catch (e) {
            // @ts-ignore
            message.error("操作失败，" + e.message);
        }
        return;
    }


  const [text, setText] = useState<string>("");
  return (
    <div
      id="basicLayout"
      style={{
        height: "100vh",
        overflow: "auto",
      }}
    >
      <ProLayout
        layout={"top"}
        title={"面试刷题平台"}
        logo={
          <Image
            src="/assets/logo.png"
            height={32}
            width={32}
            alt={"assets/logo,png"}
          />
        }
        location={{
          pathname,
        }}
        avatarProps={{
          src: loginUser.userAvatar || "/assets/notLoginUser.png",
          size: "small",
          title: loginUser.userName || "顾琴",
          render: (props, dom) => {
            return loginUser.id ? (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "logout",
                      icon: <LogoutOutlined />,
                      label: "退出登录",
                    },
                  ],
                    onClick: async (event: {key:React.Key}) => {
                        const {key} = event;
                        if(key === "logout"){
                            userLogout();
                        }
                    },
                }}
              >
                {dom}
              </Dropdown>
            ) : (
                <div onClick={() => router.push("/user/login")}></div>
              );
          },
        }}
        actionsRender={(props) => {
          if (props.isMobile) return [];
          return [<SearchInput />, <GithubFilled key="GithubFilled" />];
        }}
        headerTitleRender={(logo, title, _) => {
          return (
            <a>
              {logo}
              {title}
            </a>
          );
        }}
        // 渲染底部栏
        footerRender={() => {
          return <GlobalFooter />;
        }}
        onMenuHeaderClick={(e) => console.log(e)}
        menuDataRender={() => {
          return getAccesibleMenus(loginUser, menus);
        }}
        menuItemRender={(item, dom) => (
          <Link href={item.path || "/"} target={item.target}>
            {dom}
          </Link>
        )}
      >
        {children}
        {/*<MdEditor value={text} onChange={setText} />*/}
        {/*<MdViewer value={text} />*/}
      </ProLayout>
    </div>
  );
}
