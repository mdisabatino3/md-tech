import React, { useState, useEffect } from 'react';
import './App.css';
import { store } from './redux/store';
import { Header } from './Header';
import { SideBar } from './Sidebar';
import { Jumbotron } from './Jumbotron';
import { ContactCard } from './ContactCard';
import { About } from './About';
import Backdrop from "@material-ui/core/Backdrop";
import { Route, Switch } from 'react-router-dom';
import { MerryChristmasGabby } from './MerryChristmasGabby';

import { MerryChristmasDad } from './MerryChristmasDad';

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
  console.log("appState ",appState);
  return (
    <>
      <Header {...appState}></Header>
      <Switch>
        <Route exact path={'/'} component={Jumbotron} />
        <Route exact path={'/merryChristmasGabby'} component={MerryChristmasGabby} />
        <Route exact path={'/merryChristmasDad'} component={MerryChristmasDad} />
        <Route 
          path={'/about'} 
          {...appState}
          render = {() => <About {...appState}/>}
        />
      </Switch>
      <SideBar {...appState}></SideBar>
      <ContactCard {...appState}></ContactCard>
      <Backdrop style={backdrop} open={showContactCard} />
    </>
  );
}

export default App;
