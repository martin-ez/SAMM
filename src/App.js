import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './scss/_reset.scss';

import Home from './views/Home/Home';
import Session from './views/Session/Session';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/session">
          <Session />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
