import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { loginStart, loginSuccess, loginFailure, logout } from '../features/auth/authSlice';
import { login as loginApi, register as registerApi } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, loading, error } = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    dispatch(loginStart());
    try {
      const data = await loginApi({ email, password });
      dispatch(loginSuccess(data));
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err: any) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
    }
  };

  const register = async (payload: any) => {
    dispatch(loginStart());
    try {
      await registerApi(payload);
      // Optionally, auto-login after register
      await login(payload.email, payload.password);
    } catch (err: any) {
      dispatch(loginFailure(err.response?.data?.message || 'Registration failed'));
    }
  };

  const signOut = () => {
    dispatch(logout());
    localStorage.removeItem('token');
  };

  return { user, token, loading, error, login, register, signOut };
};

export default useAuth;
