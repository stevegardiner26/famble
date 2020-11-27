/* eslint-disable no-underscore-dangle */
// /client/src/App.jsx

import React from 'react';
import {
  BrowserRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from './store/slices/userSlice';
import Dashboard from './dashboard/Dashboard';
import Home from './home/Home';
import './App.css';
import BetPage from './dashboard/BetPage';

function App() {
  const user = useSelector(selectUser);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            {user.name ? <Redirect to="/dashboard" /> : <Home /> }
          </Route>
          <Route exact path="/dashboard">
            {!user.name ? <Redirect to="/" /> : <Dashboard /> }
          </Route>
          <Route
            path="/betpage/:id"
            render={(props) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <BetPage {...props} />
            )}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
