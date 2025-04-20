import axios from '../../api/axios';
import { SET_USER, SET_ROLES, SET_THEME, SET_LANGUAGE } from '../reducers/clientReducer';

export const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

export const setRoles = (roles) => ({
  type: SET_ROLES,
  payload: roles
});

export const setTheme = (theme) => ({
  type: SET_THEME,
  payload: theme
});

export const setLanguage = (language) => ({
  type: SET_LANGUAGE,
  payload: language
});

// Thunk action creator for fetching roles
export const fetchRoles = () => async (dispatch, getState) => {
  const { roles } = getState().client;
  
  // Only fetch if roles are empty
  if (roles.length === 0) {
    try {
      const response = await axios.get('/roles');
      dispatch(setRoles(response.data));
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  }
};