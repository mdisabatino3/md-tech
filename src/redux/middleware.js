import { actionTypes } from './actions';

const toggleDrawerMiddleware = ({ getState, dispatch }) => next => action => {
  if (action.type === actionTypes.TOGGLE_DRAWER) {
    console.log("toggleDrawerMiddleware hit");
  }
  next(action);
}

const showContactCardMiddleware = ({ getState, dispatch }) => next => action => {
  if (action.type === actionTypes.SHOW_CONTACT_CARD) {
    console.log("showContactCardMiddleware hit");
  }
  next(action);
}

export const middlewares = [toggleDrawerMiddleware, showContactCardMiddleware];