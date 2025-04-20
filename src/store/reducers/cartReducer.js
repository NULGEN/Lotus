const initialState = {
  cart: [],
  payment: {},
  address: {}
};

export const SET_CART = 'SET_CART';
export const SET_PAYMENT = 'SET_PAYMENT';
export const SET_ADDRESS = 'SET_ADDRESS';

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CART:
      return {
        ...state,
        cart: action.payload
      };
    case SET_PAYMENT:
      return {
        ...state,
        payment: action.payload
      };
    case SET_ADDRESS:
      return {
        ...state,
        address: action.payload
      };
    default:
      return state;
  }
}