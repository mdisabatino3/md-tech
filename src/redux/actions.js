export const actionTypes = {
  TOGGLE_DRAWER: "TOGGLE_DRAWER",
  SHOW_CONTACT_CARD: "SHOW_CONTACT_CARD"
 }

 const toggleDrawer = (drawerOpen) => ({type: actionTypes.TOGGLE_DRAWER, drawerOpen});
 const showContactCard = (showContactCard) => ({type: actionTypes.SHOW_CONTACT_CARD, showContactCard})

 export const actions = {
  toggleDrawer,
  showContactCard,
 };