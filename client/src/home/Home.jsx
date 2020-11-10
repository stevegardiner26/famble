/* eslint-disable no-underscore-dangle, no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import GoogleLogin from 'react-google-login';

// SERVICES
// import gameService from '../services/gameService';
import userService from '../services/userService';
import { selectUser, login, logout } from '../store/slices/userSlice';

function Home(props) {
  const user = useSelector(selectUser);
  const [sendToDash, setSendToDash] = useState(null);

  const dispatch = useDispatch();
  const responseGoogle = async (response) => {
    const payload = {
      name: response.profileObj.name,
      profile_image: response.profileObj.imageUrl,
      email: response.profileObj.email,
      google_id: response.profileObj.googleId,
    };
    const res = await userService.signIn(payload);
    dispatch(login(res.user));

    setSendToDash(<Redirect to="/dashboard" />);
  };

  // Code to Handle Logout
  // const handleLogout = () => {
  //   dispatch(logout());
  // };
  
  // Code for getting the games -----------------
  // const [games, setGames] = useState(null);
  // const getGames = async () => {
  //   const res = await gameService.getAll();
  //   setGames(res);
  // };

  // useEffect(() => {
  //   if (!games) {
  //     getGames();
  //   }
  // });

  // const renderGame = (game) => (
  //   <li key={game._id} className="list__item game">
  //     <h3 className="game__name">{game.name}</h3>
  //     <p className="game__description">{game.description}</p>
  //   </li>
  // );
  // -------------------

  return (
    <div>
      {sendToDash}
      <GoogleLogin
          clientId="405646879728-34aukb2l8lsknikc11pprr5i53pt3lvo.apps.googleusercontent.com"
          buttonText="Sign In"
          onSuccess={responseGoogle}
      />
      {/* ---------Code for Game List----- */}
      {/* <ul className="list">
        {(games && games.length > 0) ? (
          games.map((game) => renderGame(game))
        ) : (
          <p>No games found</p>
        )}
      </ul> */}
      {/*-------- Code for logout------ */}
      {/* {user.name
        && <button type="button" onClick={handleLogout}>Logout</button>} */}
    </div>
  );
}

export default Home;
