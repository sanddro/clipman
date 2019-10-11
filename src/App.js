import React from 'react';
import Settings from './components/Settings';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Main from './components/Main';

function App() {

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
