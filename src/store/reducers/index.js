import { combineReducers } from 'redux';
import clientReducer from './clientReducer';
import productReducer from './productReducer';
import cartReducer from './cartReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
  client: clientReducer,
  products: productReducer,
  cart: cartReducer,
  auth: authReducer
});

export default rootReducer;