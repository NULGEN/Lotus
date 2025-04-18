import { combineReducers } from 'redux';

// Placeholder reducer that returns the initial state
const initialState = {};
const placeholderReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  placeholder: placeholderReducer
});

export default rootReducer;