export const actionTypes = {
  TOGGLE_DRAWER: "TOGGLE_DRAWER",
  SHOW_CONTACT_CARD: "SHOW_CONTACT_CARD",
  SHOW_ABOUTME_MODAL: "SHOW_ABOUTME_MODAL",
 }

 const toggleDrawer = (drawerOpen) => ({type: actionTypes.TOGGLE_DRAWER, drawerOpen});
 const showContactCard = (showContactCard) => ({type: actionTypes.SHOW_CONTACT_CARD, showContactCard})
 const showAboutMeModal = (modalState) => ({type: actionTypes.SHOW_ABOUTME_MODAL, modalState})

 export const actions = {
  toggleDrawer,
  showContactCard,
  showAboutMeModal,
 };