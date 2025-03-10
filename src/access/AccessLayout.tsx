import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store";
import {useCallback, useEffect} from "react";
import {setLoginUser} from "@/store/loginUser";
import LoginUserVO = API.LoginUserVO;
import {getLoginUserUsingGet} from "@/api/userController";
import {usePathname} from "next/navigation";
import {findAllMenuItemByPath} from "../../config/menu";
import ACCESS_ENUM from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";
import Forbidden from "@/app/forbidden";

/**
 * 统一权限校验拦截器
 * @param children
 * @constructor
 */
const AccessLayout: React.FC<
    Readonly<{
        children: React.ReactNode;
    }>
> = ({ children }) => {

    const pathName = usePathname();

    const loginUser =  useSelector((state: RootState) => state.loginUser);

    const menu = findAllMenuItemByPath(pathName);

    const needAccess = menu?.access ?? ACCESS_ENUM.NOT_LOGIN;

    const canAccess = checkAccess(loginUser,needAccess);
    if(!canAccess){
        return <Forbidden/>
    }


    return children;
};

export default AccessLayout;