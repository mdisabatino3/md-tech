export const actionTypes = {
  TOGGLE_DRAWER: "TOGGLE_DRAWER",
 }

 const toggleDrawer = (drawerOpen) => ({type: actionTypes.TOGGLE_DRAWER, drawerOpen});

 export const actions = {
  toggleDrawer,
 };