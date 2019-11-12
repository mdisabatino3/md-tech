import React, { useState, useEffect } from 'react';
import './App.css';
import { store } from './redux/store';
import { Header } from './Header';
import { SideBar } from './Sidebar';
import { Jumbotron } from './Jumbotron';
import { ContactCard } from './ContactCard';
import Backdrop from "@material-ui/core/Backdrop";

const backdrop = {
  zIndex: 0,
}

function App() {
  const [appState, setAppState] = useState(store.getState());
  useEffect(() => {
    store.subscribe(() => setAppState({ ...store.getState() }))
  }, []);
  const showContactCard = appState.showContactCard ? appState.showContactCard : false;
  console.log(showContactCard);
  console.log(appState);
  console.log()
  return (
    <>
      <Header {...appState}></Header>
      <Jumbotron></Jumbotron>
      <SideBar {...appState}></SideBar>
      <ContactCard {...appState}></ContactCard>
      <Backdrop style={backdrop} open={showContactCard} />
    </>
  );
}

export default App;
