import axios from 'axios';
import { toast } from 'react-toastify';

export const LOGIN_START = 'LOGIN_START';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

export const login = (credentials, remember, navigate, from) => async (dispatch) => {
  dispatch({ type: LOGIN_START });

  try {
    const response = await axios.post('/api/login', credentials);
    const { token, user } = response.data;

    if (remember) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }

    dispatch({ type: LOGIN_SUCCESS, payload: { token, user } });
    toast.success('Successfully logged in!');
    navigate(from || '/');
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
    dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
    toast.error(errorMessage);
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return { type: LOGOUT };
};