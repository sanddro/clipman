import React from 'react';
import Settings from './components/Settings';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Main from './components/Main';
import { ipcRenderer } from './utils/electron';
import Config from './config';

function App() {
  ipcRenderer.on('getConfig', (event, args) => {
    event.returnValue = Config.getConfig();
  });

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Main />
        </Route>
        <Route path="/settings">
          <Settings />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
