/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import userService from './services/userService';
import gameService from './services/gameService';
import { login } from './store/slices/userSlice';

if (!localStorage.user_id && location.pathname !== '/') {
  location.href = '/';
}

// Checking if the user has been signed in already on this computer
if (localStorage.user_id) {
  userService.getCurrentUser().then((response) => {
    // TODO: If the response comes back bad we should
    // remove the localStorage val and redirect the user to sign in again
    userService.dailyFunding(localStorage.user_id).then((res) => {
      if (res.status === 200) {
        store.dispatch(login(response));
      } else if (res.status === 202) {
        store.dispatch(login(res.data.user));
      }
      gameService.updateScores();
    });
  });
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
