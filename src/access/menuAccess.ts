import {menus} from "../../config/menu";
import checkAccess from "@/access/checkAccess";
import {MenuDataItem} from "@ant-design/pro-layout";


const getAccesibleMenus = (loginUser: API.LoginUserVO, menuItems = menus)=>{
    return menuItems.filter((item) =>{
        if(!checkAccess(loginUser,item.access)){
            return false;
        }
        if(item.children){
            item.children = getAccesibleMenus(loginUser,item.children)
        }
        return true;
    })
}

export default getAccesibleMenus;