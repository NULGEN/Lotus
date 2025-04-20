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

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Thunk action creator for fetching categories with enhanced retry mechanism
export const fetchCategories = () => async (dispatch) => {
  dispatch(setFetchState('FETCHING_CATEGORIES'));
  let retries = 5;
  let waitTime = 2000;
  const maxWaitTime = 32000; // Cap maximum wait time at 32 seconds

  while (retries > 0) {
    try {
      const response = await axios.get('https://workintech-fe-ecommerce.onrender.com/categories');
      if (response.data) {
        dispatch(setCategories(response.data));
        dispatch(setFetchState('FETCHED_CATEGORIES'));
        return;
      }
      throw new Error('Invalid data format received from server');
    } catch (error) {
      retries--;
      
      if (error.response) {
        console.error('Server responded with:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });

        if (error.response.status === 404) {
          console.error('Categories endpoint not found');
          dispatch(setFetchState('FAILED_CATEGORIES'));
          return;
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }

      if (retries === 0) {
        console.error('All category retry attempts exhausted');
        dispatch(setCategories([]));
        dispatch(setFetchState('FAILED_CATEGORIES'));
        return;
      }

      console.log(`Retrying categories in ${waitTime/1000} seconds... (${retries} attempts remaining)`);
      await delay(waitTime);
      waitTime = Math.min(waitTime * 2, maxWaitTime);
    }
  }
};

// Thunk action creator for fetching products with enhanced retry mechanism
export const fetchProducts = () => async (dispatch) => {
  dispatch(setFetchState('FETCHING_PRODUCTS'));
  let retries = 7;
  let waitTime = 3000;
  const maxWaitTime = 60000;

  while (retries > 0) {
    try {
      const response = await axios.get('https://workintech-fe-ecommerce.onrender.com/products');
      
      if (response.data && Array.isArray(response.data.products)) {
        dispatch(setProductList(response.data.products));
        dispatch(setTotal(response.data.total || response.data.products.length));
        dispatch(setFetchState('FETCHED_PRODUCTS'));
        return;
      }
      throw new Error('Invalid data format received from server');
    } catch (error) {
      retries--;
      
      if (error.response) {
        console.error('Server responded with:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });

        if (error.response.status === 404) {
          console.error('Products endpoint not found');
          dispatch(setFetchState('FAILED_PRODUCTS'));
          return;
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }

      if (retries === 0) {
        console.error('All product retry attempts exhausted');
        dispatch(setProductList([]));
        dispatch(setFetchState('FAILED_PRODUCTS'));
        return;
      }

      console.log(`Retrying products in ${waitTime/1000} seconds... (${retries} attempts remaining)`);
      await delay(waitTime);
      waitTime = Math.min(waitTime * 2, maxWaitTime);
    }
  }
};