import { MenuDataItem } from "@ant-design/pro-layout";
import { CrownOutlined } from "@ant-design/icons";
import ACCESS_ENUM from "@/access/accessEnum";

// 菜单列表
export const menus = [
  {
    path: "/",
    name: "主页",
  },
  {
    path:"/user",
    name:"用户",
    hideInMenu:true,
    children:[
      {
        path: "/user/login",
        name: "用户登录",
      },
      {
        path: "/user/register",
        name: "用户注册",
      },
    ]
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
    access: ACCESS_ENUM.ADMIN,
    children: [
      {
        path: "/admin/user",
        name: "用户管理",
        access: ACCESS_ENUM.ADMIN,
      },
      {
        path: "/admin/bank",
        name: "题库管理",
        access: ACCESS_ENUM.ADMIN,
      },
      {
        path: "/admin/question",
        name: "题目管理",
        access: ACCESS_ENUM.ADMIN,
      },
    ],
  },
] as MenuDataItem[];


// 根据路径查找所有菜单

export const findAllMenuItemByPath = (path:string): MenuDataItem|null =>{
  return findMenuItemByPath(menus,path);
}

const findMenuItemByPath = (menus:MenuDataItem[],path:string):MenuDataItem | null =>{
  for (const menu of menus) {
    if(menu.path === path){
      return menu;
    }
    if(menu.children){
      const matchedMenuItem = findMenuItemByPath(menu.children,path);
      if(matchedMenuItem){
        return matchedMenuItem;
      }
    }
  }
  return null;
}