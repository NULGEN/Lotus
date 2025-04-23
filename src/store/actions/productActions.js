import axios from '../../api/axios';
import {
  SET_CATEGORIES,
  SET_PRODUCT_LIST,
  SET_TOTAL,
  SET_FETCH_STATE,
  SET_LIMIT,
  SET_OFFSET,
  SET_FILTER
} from '../reducers/productReducer';

export const setCategories = (categories) => ({
  type: SET_CATEGORIES,
  payload: categories
});

export const setProductList = (products) => ({
  type: SET_PRODUCT_LIST,
  payload: products
});

export const setTotal = (total) => ({
  type: SET_TOTAL,
  payload: total
});

export const setFetchState = (state) => ({
  type: SET_FETCH_STATE,
  payload: state
});

export const setLimit = (limit) => ({
  type: SET_LIMIT,
  payload: limit
});

export const setOffset = (offset) => ({
  type: SET_OFFSET,
  payload: offset
});

export const setFilter = (filter) => ({
  type: SET_FILTER,
  payload: filter
});

const getUserFriendlyErrorMessage = (error) => {
  if (error.response) {
    if (error.response.status === 504) {
      return 'The server is taking too long to respond. Please try again in a few moments.';
    }
    if (error.response.status === 502) {
      return 'The server is temporarily unavailable. Please wait a moment while we try to reconnect.';
    }
    if (error.response.status === 500) {
      return 'The server is currently experiencing technical difficulties. Please try again in a few minutes.';
    }
    if (error.response.status === 404) {
      return 'The requested resource was not found. Please check your request and try again.';
    }
    if (error.response.status === 503) {
      return 'The service is temporarily unavailable. Please try again in a few minutes.';
    }
    return 'An unexpected error occurred. Please try again later.';
  }
  if (error.code === 'ECONNABORTED') {
    return 'The request timed out. Please check your internet connection and try again.';
  }
  if (error.code === 'ECONNRESET') {
    return 'The connection was interrupted. Please wait while we try to reconnect.';
  }
  return 'An unexpected error occurred. Please try again later.';
};

const retryWithBackoff = async (fn, maxRetries = 3) => {
  let retries = 0;
  let lastError = null;
  
  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      retries++;
      
      if (retries === maxRetries) {
        break;
      }
      
      const delay = Math.min(2000 * Math.pow(2, retries), 20000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

export const fetchProducts = (params = {}) => async (dispatch) => {
  dispatch(setFetchState('FETCHING_PRODUCTS'));
  
  try {
    const queryParams = new URLSearchParams();
    
    if (params.category) {
      queryParams.append('category', params.category);
    }
    if (params.filter) {
      queryParams.append('filter', params.filter);
    }
    if (params.sort) {
      queryParams.append('sort', params.sort);
    }
    
    const response = await retryWithBackoff(async () => {
      const result = await axios.get(`/products?${queryParams.toString()}`);
      
      if (!result.data) {
        throw new Error('Invalid data format received from server');
      }
      return result;
    });
    
    const products = response.data.products || response.data;
    dispatch(setProductList(Array.isArray(products) ? products : []));
    dispatch(setTotal(response.data.total || products.length));
    dispatch(setFetchState('FETCHED_PRODUCTS'));
  } catch (error) {
    console.error('Error fetching products:', error);
    const userFriendlyMessage = getUserFriendlyErrorMessage(error);
    dispatch(setProductList([]));
    dispatch(setFetchState('FAILED_PRODUCTS'));
  }
};

export const fetchCategories = () => async (dispatch) => {
  dispatch(setFetchState('FETCHING_CATEGORIES'));
  
  try {
    const response = await retryWithBackoff(async () => {
      const result = await axios.get('/categories');
      
      if (!result.data) {
        throw new Error('Invalid data format received from server');
      }
      return result;
    }, 5);
    
    dispatch(setCategories(response.data));
    dispatch(setFetchState('FETCHED_CATEGORIES'));
  } catch (error) {
    console.error('Error fetching categories:', error);
    const userFriendlyMessage = getUserFriendlyErrorMessage(error);
    dispatch(setCategories([]));
    dispatch(setFetchState('FAILED_CATEGORIES'));
  }
};