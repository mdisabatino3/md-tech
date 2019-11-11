import React, { useState, useEffect } from 'react';
import './App.css';
import { store } from './redux/store';
import { Header } from './Header';
import { SideBar } from './Sidebar';
import { Jumbotron } from './Jumbotron';



function App() {
  const [appState, setAppState] = useState(store.getState());
  useEffect(() => {
    store.subscribe(() => setAppState({ ...store.getState() }))
  }, []);
  return (
    <>
      <Header {...appState}></Header>
      <Jumbotron></Jumbotron>
      <SideBar {...appState}></SideBar>
    </>
  );
}

export default App;
