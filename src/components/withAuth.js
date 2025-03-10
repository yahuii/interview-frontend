// components/withAuth.js
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux'; // 或者使用其他全局状态管理库

export default function withAuth(Component) {
    return function AuthenticatedComponent(props) {
        const router = useRouter();
        const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // 获取用户登录状态

        useEffect(() => {
            if (!isAuthenticated) {
                // 如果未登录，重定向到登录页面
                router.push('/login');
            }
        }, [isAuthenticated]);

        // 如果未登录，不渲染组件
        if (!isAuthenticated) {
            return null;
        }

        // 如果已登录，渲染组件
        return <Component {...props} />;
    };
}
