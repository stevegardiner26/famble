Heroku Link: [https://famble-sprint2.herokuapp.com/](https://famble-sprint2.herokuapp.com/)
# Famble
An app that allows people to gamble with no negative consequences.

### Built With

* [Node.js](https://nodejs.org/en/docs/)
* [React](https://reactjs.org/docs/getting-started.html)

## Contributions:

### Jay Rana - jpr48@njit.edu

- Landing page
- Bet modal 
- Linting and fixing frontend code
- Redirection based on login status

### Steven Gardiner - spg28@njit.edu 

- Helped setup MongoDB Schema
- Setup Base Application Structure
- Setup Persistent User State on Frontend
- Setup User Routes on Backend
- Setup Game Routes on Backend

### Vivek Sreenivasan - vns9@njit.edu
- Created User dashboard 
- Wrote wrapper functions to interact with API backend
- Linted backend/frontend code
- Researched potential APIs for sports data

### Pedro Ramos - par25@njit.edu
- Set up the MongoDB Schemas
- Set up Betting API along with the Betting Service
- Unit testing on the Backend
- Created the mockups

## Linting:

- Linebreak-Style: Every time it was fixed, it would somehow get reverted when pulled from Github. 
- Prop-Types: It was not working properly since I could not determine the type of props being passed. 
- No-undef: Browser localstorage was undefined but it was being used to store the login token
- No-underscore-dangle: '._id' needed to be accessed as userid for mongodb

## Getting Started


### Prerequisites
* Node (version >= 12)
* MongoDB

### Installation
1. Clone the repo
```sh
git clone 
```
2. Install the Prerequisites (See Above)
3. Install `npm` dependencies from `package.json`
```sh
$ npm install
```
4. Run the following on your local machine (Runs on port 3000):
```sh
$ npm run dev
```

### Note on Google Login Button
In order for the login to work, follow these steps:  
1. Copy your URL either from `Preview your running application` or from your Heroku deployment. 
2. Go to `https://console.developers.google.com/apis/credentials/oauthclient/<CLIENT_ID>?project=<PROJECT_NAME>` **(Replace <CLIENT_ID> and <PROJECT_NAME> with what you created in earlier steps)**
3. Under `URIs`, paste your URL and remove everything after the `.com` or whatever the end of your domain is.
4. Click `Save`

### Note on Facebook Login Button
In order for the login to work, follow these steps:
1. Copy your URL either from `Preview your running application` or from your Heroku deployment. 
2. Go to https://developers.facebook.com/apps and create an account with facebook.
3. Set Up a Facebook Login under the Add a Product
4. Under Valid OAuth Redirect URIs paste your URL and remove everything after the `.com` or whatever the end of your domain is. 
### Note: Facebook wants https: not http:
6. Copy the app ID that is given to you and paste it into your code after following this process.
7. Getting Started:
```sh
$ yarn add react-facebook-login 
```
or
```sh
$ npm install react-facebook-login
```
8. will also need react-dom for Deployment so run:
```sh
$ npm install react react-dom react-facebook-login --save --force
``` 

## Setting up Sportsdata API
1. Sign up to Sportsdata.io by Clicking on Register on the Top right
2. After you've signed up, Start a free trial subscription
3. To retrieve your API key go under 'My Account' > 'Subscriptions' There you will find API Keys: 
4. Skip to 'Setting up .env..' and make sure to add the api key in your env file.

## Setting up Twitter API
1. Create a free Twitter user account, Head over to Twitter.com and register for a free account.
2. Head over to the Twitter Dev Site and Create a New Application, Navigate to apps.twitter.com, sign in, and create a new application.
3. You now should be able to access all the required API Keys and authorization credentials. You should be able to find everything under the “Keys and Access Tokens” Tab for all the Twitter API Key details. After that, fill out all the app details.
4. Make sure to add these keys into your .env file, skip to 'Setting up .env...' for more information

## Setting up MongoDB
The easiest way to get started with MongoDB is to use Atlas, MongoDB’s fully-managed database-as-a-service.
1. If you don’t have the MongoDB Node.js Driver installed, you can install it with the following command.
```sh
npm install mongodb
```
2. Create a free MongoDB Atlas by going to https://www.mongodb.com/cloud/atlas
3. Get your cluster’s connection info: 
4. In Atlas, navigate to your cluster and click CONNECT. The Cluster Connection Wizard will appear.
5. The Wizard will prompt you to whitelist your current IP address and create a MongoDB user if you haven’t already done so.
6. Be sure to note NOTE the USERNAME and PASSWORD you use for the new MongoDB user as you’ll need them in a later step.
7. Wizard will prompt you to choose a connection method. Select Connect Your Application.
8. When the Wizard prompts you to select your driver version, select Node.js and 3.0 or later. Copy the provided connection string.

## Setting up .env should contain these variables
1. Create a .env file
```sh
$ touch .env
```

2. Enter these key variables and fill in with youre secret/api keys
```
NFL_API_TOKEN
MONGODB_URI

TWITTER_API_KEY
TWITTER_API_SECRET

TWITTER_ACCESS_TOKEN
TWITTER_ACCESS_TOKEN_SECRET
```

## Heroku Deployment
1. Sign up for heroku at heroku.com 
2. Install heroku by running npm install -g heroku
3. Go through the following steps:
    heroku login -i
    heroku create
    git push heroku master
4. Navigate to your newly-created heroku site!
5. Add your secret/API keys under settings in heroku (keys from sportsdata.io and mongodb.com) by going to https://sportsdata.io/members/subscriptions, by going to https://dashboard.heroku.com/apps and clicking into your app. Click on Settings, then scroll to "Config Vars." Click Reveal Config Vars" and add the key value pairs for each variable. Your config var key names should be:
```
NFL_API_TOKEN
MONGODB_URI

TWITTER_API_KEY
TWITTER_API_SECRET

TWITTER_ACCESS_TOKEN
TWITTER_ACCESS_TOKEN_SECRET
```
6. Configure requirements.txt with all requirements needed to run your app.
7. Configure Procfile with the command needed to run your app.
8. If you are still having issues, you may use heroku logs --tail to see what's wrong.

## CircleCI Sign Up and Set up with Heroku
1. Navigate to https://circleci.com/signup/ and Sign up with Github
2. Authorize CircleCI.
3. Make sure you're in the right repo in the top right hand corner
4. Once you've verified that, click "Set Up Project"
5. Confirm that the language is set to Javascript and click "Add Config"
6. CircleCI might ask if you want to see the new UI. If it does, click "yes" and it should redirect you.
7. All you need to do to deploy to Heroku from CircleCI is to configure your Heroku credentials in circleCI UI, add a simple config.yml file to the project, and push.

## Contact

- Jay Rana - jpr48@njit.edu
- Steven Gardiner - spg28@njit.edu 
- Vivek Sreenivasan - vns9@njit.edu
- Pedro Ramos - par25@njit.edu

Project Link: [https://github.com/stevegardiner26/famble-sprint2](https://github.com/stevegardiner26/famble-sprint2)
