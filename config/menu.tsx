import { MenuDataItem } from "@ant-design/pro-layout";
import { CrownOutlined } from "@ant-design/icons";

// 菜单列表
export const menus = [
  {
    path: "/",
    name: "主页",
    hideInMenu: true,

  },
  {
    path: "/bank",
    name: "题库",
  },
  {
    path: "/question",
    name: "题目",
  },
  {
    path: "/admin",
    name: "管理",
    icon: <CrownOutlined />,
    children: [
      {
        path: "/admin/user",
        name: "用户管理",
      },
    ],
  },
] as MenuDataItem[];
