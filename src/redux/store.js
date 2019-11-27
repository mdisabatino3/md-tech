import { createStore, applyMiddleware } from 'redux';
import { actionTypes } from './actions';
import { middlewares } from './middleware';

const initialState = {
   modalState: {
      modalOpen: false,
      modalTitle: "",
      modalDescription: "",
      modalDetails: "",
      modalLocation: "",
      modalStart: "",
      modalEnd: ""
   },
};

const reducer = (state, action) => {
   if (!action) return state;
   switch (action.type) {
      case actionTypes.TOGGLE_DRAWER:
         return {...state, drawerOpen: action.drawerOpen }
      case actionTypes.SHOW_CONTACT_CARD:
         return {...state, showContactCard: action.showContactCard}
      case actionTypes.SHOW_ABOUTME_MODAL:
         return {...state, modalState: action.modalState}
      default:
         return state
   }
}
const enhancers = applyMiddleware(...middlewares);

export const store = createStore(reducer, initialState, enhancers);