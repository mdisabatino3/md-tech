import { createStore, applyMiddleware } from 'redux';
import { actionTypes } from './actions';
import { middlewares } from './middleware';

const initialState = {};

const reducer = (state, action) => {
   if (!action) return state;
   switch (action.type) {
      case actionTypes.TOGGLE_DRAWER:
         return { ...state, drawerOpen: action.drawerOpen }
      default:
         return state
   }
}
const enhancers = applyMiddleware(...middlewares);

export const store = createStore(reducer, initialState, enhancers);