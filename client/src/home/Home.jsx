/* eslint-disable no-underscore-dangle, no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
// SERVICES
import userService from '../services/userService';
import { login } from '../store/slices/userSlice';

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

  return (
      <div>
        <div className="spinner-wrapper">
          <div className="spinner">
            <div className="bounce1"/>
            <div className="bounce2"/>
            <div className="bounce3"/>
          </div>
        </div>
        <nav className="navbar navbar-expand-md navbar-dark navbar-custom fixed-top">
          <a className="navbar-brand logo-text page-scroll" href="/">Famble</a>
          <div className="collapse navbar-collapse" id="navbarsExampleDefault">
            <ul className="navbar-nav ml-auto"></ul>
            <span className="nav-item social-icons">
              <GoogleLogin
                  clientId="405646879728-34aukb2l8lsknikc11pprr5i53pt3lvo.apps.googleusercontent.com"
                  buttonText="Sign In"
                  onSuccess={responseGoogle}
              />
              <FacebookLogin
                cssClass="myFacebookButtonClass"
                appId="392101635039578"
                autoLoad={false}
                fields="name,email,picture"
                callback={responseFacebook}
              />
            </span>
          </div>
        </nav>
        <header id="header" className="header">
          <div className="header-content">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="text-container">
                    <h1>Famble</h1>
                    <p className="p-heading p-large">Famble is a top gambling website specializing in fighting gambling
                      addictions using real sports, and fake money.</p>
                    <a className="btn-solid-lg page-scroll" href="#intro">DISCOVER</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div id="intro" className="basic-1">
          <div className="container">
            <div className="row">
              <div className="col-lg-5">
                <div className="text-container">
                  <div className="section-title">INTRO</div>
                  <h2>We Offer The Best Gambling Platform In the World</h2>
                  <p>According to the National Council on Problem Gambling, around
                    2 million U.S. adults are estimated to meet criteria for severe gambling problems
                    each year and another 4-6 million would be considered to have mild or moderate gambling
                    problems.</p>
                  <p className="testimonial-text">"Akin to an e-cigarette, Famble's mission is to help people on the path to
                    recovery from gambling addiction. By offering the ability to gamble without the consequences,
                    people can safely work their way toward a healthier life."</p>
                  <div className="testimonial-author">Some Guy - Spokesperson</div>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="image-container">
                  <img className="img-fluid" src="images/gambling.jpg" alt="alternative"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="cards-1">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <span className="fa-stack">
                    <span className="hexagon"/>
                    <i className="fas fa-money-bill fa-stack-1x"/>
                  </span>
                  <div className="card-body">
                    <h4 className="card-title">Bet for FREE</h4>
                    <p>Every user initially starts out with 10,000 Shredits (Fake currency) and they can bet till
                      they're broke without losing real money.
                    </p>
                  </div>
                </div>
                <div className="card">
                  <span className="fa-stack">
                    <span className="hexagon"/>
                    <i className="fas fa-chart-line fa-stack-1x"/>
                  </span>
                  <div className="card-body">
                    <h4 className="card-title">Bet Against AI</h4>
                    <p>The users can also bet against our bot’s
                      prediction to win even more Shredits. Users can use Shredits to make high-stake
                      bets and build their fortune till their heart’s content!</p>
                  </div>
                </div>
                <div className="card">
                  <span className="fa-stack">
                    <span className="hexagon"/>
                    <i className="fas fa-football-ball fa-stack-1x"/>
                  </span>
                  <div className="card-body">
                    <h4 className="card-title">Real Time NFL</h4>
                    <p>Famble is an application that allows users to gamble
                      on REAL TIME NFL games with your friends!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="about" className="counter">
          <div className="container">
            <div className="row">
              <div className="col-lg-5 col-xl-6">
                <div className="image-container">
                  <img className="img-fluid" src="images/helping_people.jpg" alt="alternative"/>
                </div>
              </div>
              <div className="col-lg-7 col-xl-6">
                <div className="text-container">
                  <div className="section-title">ABOUT</div>
                  <h2>We're Passionate About Helping people</h2>
                  <p>Our goal is to provide the perfect simulation for sports gambling without the risk of losing your
                    house or marriage. All the fun without any of the stress!</p>
                  <ul className="list-unstyled li-space-lg">
                    <li className="media">
                      <i className="fas fa-square"/>
                      <div className="media-body">Everything we do has direct positive impact on the community</div>
                    </li>
                    <li className="media">
                      <i className="fas fa-square"/>
                      <div className="media-body">You will become an important member of our community</div>
                    </li>
                  </ul>
                  <div id="counter">
                    <div className="cell">
                      <div className="counter-value number-count" data-count={18}>1</div>
                      <div className="counter-info">Happy<br/>Users</div>
                    </div>
                    <div className="cell">
                      <div className="counter-value number-count" data-count={4}>1</div>
                      <div className="counter-info">Additions<br/>Cured</div>
                    </div>
                    <div className="cell">
                      <div className="counter-value number-count" data-count={9}>1</div>
                      <div className="counter-info">Good<br/>Reviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="details" className="accordion">
          <div className="area-1">
          </div><div className="area-2">

          <div className="accordion-container" id="accordionOne">
            <h2>Development</h2>
            <div className="item">
              <div id="headingOne">
                        <span data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" role="button">
                            <span className="circle-numbering">1</span><span className="accordion-title">Main Development</span>
                        </span>
              </div>
              <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionOne">
                <div className="accordion-body">
                  Famble was built with MongoDB, Express JS, React JS, Node JS and LOVE.
                </div>
              </div>
            </div>

            <div className="item">
              <div id="headingTwo">
                        <span className="collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo" role="button">
                            <span className="circle-numbering">2</span><span className="accordion-title">Backend & API</span>
                        </span>
              </div>
              <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionOne">
                <div className="accordion-body">
                  Node and Express were used to map routes for the front-end (React) to access/update information from the database. The NFL schedule and statistics
                  are all being pulled from sportsdata.io one time, and it is also being used for the live scores.
                </div>
              </div>
            </div>

            <div className="item">
              <div id="headingThree">
                        <span className="collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree" role="button">
                            <span className="circle-numbering">3</span><span className="accordion-title">Database</span>
                        </span>
              </div>
              <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionOne">
                <div className="accordion-body">
                  MongoDB was used for data persistence, storing users, bets, teams, and the NFL schedule.
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        <div className="tabs">
          <div className="area-1">
            <div className="tabs-container">
              <div className="tab-content" id="ariaTabsContent">

                <div className="tab-pane fade show active" id="tab-1" role="tabpanel" aria-labelledby="tab-1">
                  <h4>Future Development</h4>
                  <p>Famble provides the most innovative and customized gambling service in the industry. And we are not
                  done yet, we still have plenty more that is coming soon!</p>

                  <div className="progress-container">
                    <div className="title">NFL Betting 100%</div>
                    <div className="progress">
                      <div className="progress-bar first" role="progressbar" aria-valuenow="100" aria-valuemin="0"
                           aria-valuemax="100"></div>
                    </div>
                    <div className="title">NHL Betting 0%</div>
                    <div className="progress">
                      <div className="progress-bar second" role="progressbar" aria-valuenow="0" aria-valuemin="0"
                           aria-valuemax="100"></div>
                    </div>
                    <div className="title">E-Sports Betting 0%</div>
                    <div className="progress">
                      <div className="progress-bar third" role="progressbar" aria-valuenow="0" aria-valuemin="0"
                           aria-valuemax="100"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="area-2"></div>
        </div>

        <div className="slider">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <h2>Read Our Customer Testimonials</h2>
                <p className="p-heading">Our clients are our partners and we can not imagine a better future for our
                  company without helping them reach their objectives</p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="slider-container">
                  <div className="swiper-container card-slider">
                    <div className="swiper-wrapper">
                      <div className="swiper-slide">
                        <div className="card">
                          <img className="card-image" src="images/testimonial-1.jpg" alt="alternative"/>
                          <div className="card-body">
                            <div className="testimonial-text">The guys from Aria helped with getting my business off the
                              ground and turning into a profitable company.
                            </div>
                            <div className="testimonial-author">Jude Thorn - Founder</div>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="card">
                          <img className="card-image" src="images/testimonial-2.jpg" alt="alternative"/>
                          <div className="card-body">
                            <div className="testimonial-text">I purchased the Growth Accelerator service pack a few
                              years ago and I renewed the contract each year.
                            </div>
                            <div className="testimonial-author">Marsha Singer - Marketer</div>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="card">
                          <img className="card-image" src="images/testimonial-3.jpg" alt="alternative"/>
                          <div className="card-body">
                            <div className="testimonial-text">Aria's CEO personally attends client meetings and gives
                              his feedback on business growth strategies.
                            </div>
                            <div className="testimonial-author">Roy Smith - Developer</div>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="card">
                          <img className="card-image" src="images/testimonial-4.jpg" alt="alternative"/>
                          <div className="card-body">
                            <div className="testimonial-text">At the beginning I thought the prices are a little high
                              for what they offer but they over deliver each and every time.
                            </div>
                            <div className="testimonial-author">Ronald Spice - Owner</div>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="card">
                          <img className="card-image" src="images/testimonial-5.jpg" alt="alternative"/>
                          <div className="card-body">
                            <div className="testimonial-text">I recommend Aria to every business owner or growth leader
                              that wants to take his company to the next level.
                            </div>
                            <div className="testimonial-author">Lindsay Rune - Manager</div>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="card">
                          <img className="card-image" src="images/testimonial-6.jpg" alt="alternative"/>
                          <div className="card-body">
                            <div className="testimonial-text">My goals for using Aria's services seemed high when I
                              first set them but they've met them with no problems.
                            </div>
                            <div className="testimonial-author">Ann Black - Consultant</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="swiper-button-next"/>
                    <div className="swiper-button-prev"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="basic-2">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <h2>Our Team</h2>
                <p className="p-heading">We are a group of passionate developers that are all hoping to solve the
                  world’s problems with technology. Some of us have had experience working as software
                  developers in some capacity. From the first proposal to the final presentation, we enjoyed creating
                  this application and are proud of what we have built.</p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="team-member">
                  <div className="image-wrapper">
                    <img className="img-fluid" src="images/team-1.png" alt="alternative"/>
                  </div>
                  <p className="p-large">Steven Gardiner</p>
                  <p className="job-title">Developer</p>
                  <span className="social-icons">
                    <span className="fa-stack">
                      <a href="https://github.com/stevegardiner26">
                        <span className="hexagon"/>
                        <i className="fab fa-github fa-stack-1x"/>
                      </a>
                    </span>
                  </span>
                </div>
                <div className="team-member">
                  <div className="image-wrapper">
                    <img className="img-fluid" src="images/team-2.png" alt="alternative"/>
                  </div>
                  <p className="p-large">Pedro Ramos</p>
                  <p className="job-title">Developer</p>
                  <span className="social-icons">
                    <span className="fa-stack">
                      <a href="https://github.com/PRamos1196">
                        <span className="hexagon"/>
                        <i className="fab fa-github fa-stack-1x"/>
                      </a>
                    </span>
                  </span>
                </div>
                <div className="team-member">
                  <div className="image-wrapper">
                    <img className="img-fluid" src="images/team-3.png" alt="alternative"/>
                  </div>
                  <p className="p-large">Jay Rana</p>
                  <p className="job-title">Developer</p>
                  <span className="social-icons">
                    <span className="fa-stack">
                      <a href="https://github.com/ranajay5699">
                        <span className="hexagon"/>
                        <i className="fab fa-github fa-stack-1x"/>
                      </a>
                    </span>
                  </span>
                </div>
                <div className="team-member">
                  <div className="image-wrapper">
                    <img className="img-fluid" src="images/team-4.png" alt="alternative"/>
                  </div>
                  <p className="p-large">Vivek Sreenivasan</p>
                  <p className="job-title">Developer</p>
                  <span className="social-icons">
                    <span className="fa-stack">
                      <a href="https://github.com/VivekSreenivasan">
                        <span className="hexagon"/>
                        <i className="fab fa-github fa-stack-1x"/>
                      </a>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div className="text-container about">
                  <h4>Few Words About Famble</h4>
                  <p className="white">We're passionate about delivering the best gambling site for people of all ages
                    just born or as old as time.</p>
                </div>
              </div>
              <div className="col-md-2">
              </div>
              <div className="col-md-2">
                <div className="text-container">
                  <h4>Tools</h4>
                  <ul className="list-unstyled li-space-lg">
                    <li>
                      <a className="white" href="#">sportsdataio</a>
                    </li>
                    <li>
                      <a className="white" href="https://onepagelove.com/aria" target="_blank">Template: Aria-Business HTML Landing Page Template</a>
                    </li>
                    <li className="media">
                      <a className="white" href="https://stackoverflow.com/">stackoverflow</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-2">
                <div className="text-container">
                  <h4>Partners</h4>
                  <ul className="list-unstyled li-space-lg">
                    <li>
                      <a className="white" href="https://njit.edu/">NJIT</a>
                    </li>
                    <li>
                      <a className="white" href="#">Ourselves</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <p className="p-small">Copyright © 2020 Famble</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Home;
