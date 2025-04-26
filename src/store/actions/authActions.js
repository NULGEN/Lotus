import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { setUser } from './clientActions';

export const LOGIN_START = 'LOGIN_START';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

export const verifyToken = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  
  if (!token) return;

  try {
    const response = await axios.get('/verify');
    const { user } = response.data;
    
    dispatch({ type: LOGIN_SUCCESS, payload: { token, user } });
    dispatch(setUser(user));
  } catch (error) {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: LOGOUT });
  }
};

export const login = (credentials, remember, navigate, from) => async (dispatch) => {
  dispatch({ type: LOGIN_START });

  try {
    const response = await axios.post('/login', credentials);

    const { token, name, email, role_id } = response.data; // değişiklik burada

    const user = { name, email, role_id }; // user nesnesini kendimiz oluşturuyoruz

    if (remember) {
      localStorage.setItem('token', token);
    }

    axios.defaults.headers.common['Authorization'] = token;
    
    dispatch({ type: LOGIN_SUCCESS, payload: { token, user } });
    dispatch(setUser(user));
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
  delete axios.defaults.headers.common['Authorization'];
  return { type: LOGOUT };
};
