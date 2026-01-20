import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";


type RoleRouteProps = {
    allowedRoles: Array<'user' | 'provider'>;
    redirectTo?: string;
}

const RoleRoute = ({ allowedRoles, redirectTo = '/profile' }: RoleRouteProps) => {
    const { user, token } = useAuth();

    if(!token) return <Navigate to = '/login' replace/>
    if(!user || !allowedRoles.includes(user.role)) return <Navigate to={redirectTo} replace/>

    return <Outlet />
}

export default RoleRoute;