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

// Thunk action creator for fetching products
export const fetchProducts = () => async (dispatch) => {
  dispatch(setFetchState('FETCHING_PRODUCTS'));
  
  try {
    const response = await axios.get('/products');
    
    if (response.data && Array.isArray(response.data.products)) {
      dispatch(setProductList(response.data.products));
      dispatch(setTotal(response.data.total));
      dispatch(setFetchState('FETCHED_PRODUCTS'));
    } else {
      throw new Error('Invalid data format received from server');
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    dispatch(setProductList([]));
    dispatch(setFetchState('FAILED_PRODUCTS'));
  }
};

// Keep existing fetchCategories function
export const fetchCategories = () => async (dispatch) => {
  dispatch(setFetchState('FETCHING_CATEGORIES'));
  
  try {
    const response = await axios.get('/categories');
    if (response.data) {
      dispatch(setCategories(response.data));
      dispatch(setFetchState('FETCHED_CATEGORIES'));
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    dispatch(setCategories([]));
    dispatch(setFetchState('FAILED_CATEGORIES'));
  }
};