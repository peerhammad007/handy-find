import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { loginSuccess, loginFailure, loginStart, logout } from '../features/auth/authSlice';
import { login as loginApi, register as registerApi } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import { RegisterPayload, LoginPayload } from '../types/Auth';

export const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, token, loading, error } = useSelector((state: RootState) => state.auth);

    const getErrorMessage = (err: any) => err.response?.data?.message || 'An error occured';

    const login = async (credentials: LoginPayload) => {
        dispatch(loginStart());
        try {
            const data = await loginApi(credentials);
            dispatch(loginSuccess(data));

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            const target = data.user.role === 'provider' ? '/dashboard' : '/profile';
            navigate(target);
        } catch (err: any) {
            dispatch(loginFailure(getErrorMessage(err)))
        }
    }
    const register = async (payload: RegisterPayload) => {
        dispatch(loginStart());
        try {
            await registerApi(payload);
            await loginApi({email: payload.email, password: payload.password});
        } catch (err: any) {
            dispatch(loginFailure(getErrorMessage(err)));
        }
    }

    const signOut = () => {
        dispatch(logout());
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    }

    return { user, token, loading, error, login, register, signOut };
};

export default useAuth;
