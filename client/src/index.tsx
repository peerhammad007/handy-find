import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import { loginSuccess } from './features/auth/authSlice';
import { ToastProvider } from './components/Toast/ToastProvider';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Rehydrate auth state from localStorage so user stays logged in after refresh
try {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  if (token && userStr) {
    const user = JSON.parse(userStr);
    store.dispatch(loginSuccess({ token, user }));
  }
} catch (e) {
  // ignore invalid JSON / storage errors
}
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
