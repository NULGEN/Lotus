import {
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from '../actions/authActions';

const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');
const user = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;

const initialState = {
  token: token || null,
  user: user || null,
  loading: false,
  error: null,
  isAuthenticated: !!token,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem('user', JSON.stringify(action.payload.user)); // <-- yeni ekleme
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        loading: false,
        error: null,
        isAuthenticated: true,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        token: null,
        user: null,
        isAuthenticated: false,
      };
    case LOGOUT:
      localStorage.removeItem('user'); // <-- logout olduğunda user da temizlensin
      return {
        ...state,
        token: null,
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}
