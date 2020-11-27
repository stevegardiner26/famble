/* eslint-disable no-underscore-dangle, no-unused-vars */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { Jumbotron } from 'reactstrap';
import styles from './Home.module.css';
// SERVICES
import userService from '../services/userService';
import { login } from '../store/slices/userSlice';
import InfoCard from './InfoCard';

function Home() {
  const dispatch = useDispatch();
  const responseGoogle = async (response) => {
    const payload = {
      name: response.profileObj.name,
      profile_image: response.profileObj.imageUrl,
      email: response.profileObj.email,
      google_id: response.profileObj.googleId,
      auth_type: 'google',
    };
    const res = await userService.signIn(payload);
    dispatch(login(res.user));
  };

  const responseFacebook = async (response) => {
    const payload = {
      name: response.name,
      profile_image: response.picture.data.url,
      email: response.email,
      auth_type: 'facebook',
    };
    const res = await userService.signIn(payload);
    dispatch(login(res.user));
  };
  const about = (`Famble is an application that allows users to gamble
  on real NFL games with a fake amount of money known as Shredits. 
  Every user initially starts out with 10,000 Shredits and they can bet till
  they're broke without losing real money. The users can also bet against our bot’s 
  prediction to win even more Shredits. Users can use Shredits to make high-stake 
  bets and build their fortune till their heart’s content!`);

  const mission = (`According to the National Council on Problem Gambling, around
   2 million U.S. adults are estimated to meet criteria for severe gambling problems 
   each year and another 4-6 million would be considered to have mild or moderate gambling 
   problems. Akin to an e-cigarette, the aim of Famble is to help people on the path to 
   recovery from gambling addiction. By offering the ability to gamble without the consequences, 
   people can safely work their way toward a healthier life.`);

  const team = (`We are a group of passionate developers that are all hoping to solve the
   world’s problems with technology. Our team is comprised of the following: Steven Gardiner, 
   Pedro Ramos, Jay Rana, and Vivek Sreenivasan. Some of us have had experience working as software 
   developers in some capacity. From the first proposal to the final presentation, we enjoyed creating 
   this application and are proud of what we have built.`);

  const development = (`Famble was built with MongoDB, Express JS, React JS, Node JS
   and LOVE. MongoDB was used for data persistence, storing users, bets, teams, and 
   the NFL schedule. Node and Express were used to map routes for the front-end (React) 
   to access/update information from the database. The NFL schedule and statistics are 
   all being pulled from sportsdata.io one time, and it is also being used for the live scores.`);

  return (
    <div>
      <Jumbotron className={styles.jumbo}>
        <h1 className={styles.display_text}>Welcome to Famble!</h1>
        <p className={styles.display_subtext}>Sports betting without the cost.</p>
        <p>
          <GoogleLogin
            className={styles.google}
            clientId="405646879728-34aukb2l8lsknikc11pprr5i53pt3lvo.apps.googleusercontent.com"
            buttonText="Sign In"
            onSuccess={responseGoogle}
          />
        </p>
        <p>
          <FacebookLogin
            appId="392101635039578"
            autoLoad={false}
            fields="name,email,picture"
            callback={responseFacebook}
          />
        </p>
      </Jumbotron>
      <InfoCard imgSide="left" title="About" content={about} image="/Features.jpg" />
      <InfoCard imgSide="right" title="Our Mission" content={mission} image="/Mission.jpg" />
      <InfoCard imgSide="left" title="Our Team" content={team} image="/Collage.png" />
      <InfoCard imgSide="right" title="Development" content={development} image="/Development.png" />
      <br />
    </div>
  );
}

export default Home;
