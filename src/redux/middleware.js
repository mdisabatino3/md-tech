import { actionTypes } from './actions';

const toggleDrawerMiddleware = ({ getState, dispatch }) => next => action => {
  if (action.type === actionTypes.TOGGLE_DRAWER) {
    console.log("toggleDrawerMiddleware hit");
  }
  next(action);
}

export const middlewares = [toggleDrawerMiddleware];