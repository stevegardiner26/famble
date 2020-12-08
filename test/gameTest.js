/* eslint-disable no-undef */
const httpMocks = require('node-mocks-http');
const sinon = require('sinon');
const assert = require('chai').assert;
const { betModel } = require('../models/Bet');
const { userModel } = require('../models/User');
const { gameModel } = require('../models/Game');
const { 
  getGames,
  getGameById,
  getCurrentWeekGames,
  fetchWeeklyScores,
  fetchWeeklyScoresHelper,
  fetchGamesHelper,
  updateGameById,
  deleteGameById,
  fetchOddsByGame,
  fetchOddsByGameHelper,
  client,
  vars
} = require('../routes/gameRoutesHandlers');

describe("GET /api/games", function() {  
  let mockFind;
  const fakeGame = {
    game_id: 17263,
    sport_type: "NFL",
    away_team_id: 13,
    home_team_id: 16,
    canceled: false,
    status: "Final"
  }

  beforeEach((done) =>{
    mockFind = sinon.stub(gameModel, "find").returns(fakeGame)
    done();
  })

  afterEach((done) => {
    mockFind.restore();
    done();
  })

  it("it should have status code 200 and return result of Game.find", function(done) {
    const mockRequest = httpMocks.createRequest({
      method: "GET",
      url: "/api/games"
    });
    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expected = fakeGame;
      try {
        assert.strictEqual(mockResponse.statusCode, 200);
        assert.deepStrictEqual(mockResponse._getData(), expected);
        done();
      }
      catch (error){
        done(error);
      }
    });

    getGames(mockRequest, mockResponse);
  });
});

describe("GET /api/games/:id", function() {  
  let mockFind;
  const fakeGame = {
    game_id: 17263,
    sport_type: "NFL",
    away_team_id: 13,
    home_team_id: 16,
    canceled: false,
    status: "Final"
  }

  beforeEach((done) =>{
    mockFind = sinon.stub(gameModel, "findOne").callsFake((query) => {
      return ({
      game_id: query.game_id,
      sport_type: "NFL",
      away_team_id: 13,
      home_team_id: 16,
      canceled: false,
      status: "Final"
      })
    })
    done();
  })

  afterEach((done) => {
    mockFind.restore();
    done();
  })

  it("it should have status code 200 and return result of Game.findOne with gameId", function(done) {
    const mockRequest = httpMocks.createRequest({
      method: "GET",
      url: "/api/games/17263",
      params:{
        id: 17263
      }
    });
    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expected = fakeGame;
      try {
        assert.strictEqual(mockResponse.statusCode, 200);
        assert.deepStrictEqual(mockResponse._getData(), expected);
        done();
      }
      catch (error){
        done(error);
      }
    });

    getGameById(mockRequest, mockResponse);
  });
});

describe("GET /api/current_week", function() {  
  let mockFind;
  let fakeGame;

  beforeEach((done) => {
    fakeGame = [{
      game_id: 17263,
      sport_type: "NFL",
      away_team_id: 13,
      home_team_id: 16,
      canceled: false,
      status: "Final",
      start_time: "2020-09-13T17:00:00.000Z"
    }]
    mockFind = sinon.stub(gameModel, "find").returns(
      {sort: sinon.stub().returns(fakeGame)}
      );
    done();
  });

  afterEach((done) => {
    mockFind.restore();
    done();
  })

  it("it should have status code 200 and return array of games", function(done) {

    const mockRequest = httpMocks.createRequest({
      method: "GET",
      url: "/api/current_week"
    });
    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expected = fakeGame;
      try {
        assert.strictEqual(mockResponse.statusCode, 200);
        assert.deepStrictEqual(mockResponse._getData(), expected);
        done();
      }
      catch (error){
        done(error);
      }
    });

    getCurrentWeekGames(mockRequest, mockResponse);
  });
});

describe("GET /api/fetch_weekly_scores", function() {  
  let mockSetDate;
  let mockCache;

  beforeEach((done) =>{
    const curr = new Date('2020-11-23T00:00:00.000Z');
    const cache = new Date('2020-11-23T00:00:00.000Z')
    mockSetDate = sinon.useFakeTimers(curr);
    mockCache = sinon.stub(vars, "date_cache").value(cache);
    done();
  })

  afterEach((done) => {
    mockSetDate.restore();
    mockCache.restore();
    done();
  })

  it("it should have status code 200 and return waiting message", function(done) {
    const mockRequest = httpMocks.createRequest({
      method: "GET",
      url: "/api/fetch_weekly_scores"
    });
    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expire_time = new Date("2020-11-23T00:10:00.000Z")
      const expected = {
        message: "Waiting to update week...",
        expire_time: expire_time
      };
      try {
        assert.strictEqual(mockResponse.statusCode, 200);
        assert.deepStrictEqual(mockResponse._getData(), expected);
        done();
      }
      catch (error){
        done(error);
      }
    });

    fetchWeeklyScores(mockRequest, mockResponse);
  });
});

describe("fetchWeeklyScoresHelper", function() {  
  let mockSetDate;
  let mockFind;
  let mockFindById
  let mockFindByIdUpdateUser;
  let mockFindByIdUpdateBet;
  let mockFindOne;
  let week; 
  const user = {
    shreddit_balance: 4140,
    name: "Jay Rana",
    profile_image: "https://lh3.googleusercontent.com/a-/AOh14Gg629IeUkf1lWpBcSqr7-m_pEhpvQI3CdAczWijeA=s96-c",
    email: "jpr48@njit.edu",
    google_id: "108376284041323611441"
  }
  const bets = [{
      active: true,
      user_id: "5fb83983417ae836a4e2b170",
      game_id: "17445",
      team_id: "20",
      name: "Jay Rana",
      amount: 100,
      teamName: "Minnesota Vikings",
      type: "bot"
  },
  {
    active: true,
    user_id: "5fb83983417ae836a4e2b170",
    game_id: "17445",
    team_id: "20",
    name: "Jay Rana",
    amount: 100,
    teamName: "Minnesota Vikings",
    type: "default"
  }];
  const curr = new Date('2020-11-23T00:00:00.000Z');
  const game = {
    away_odds: 447,
    home_odds: -534
  }

  beforeEach((done) =>{
    mockSetDate = sinon.useFakeTimers(curr);
    mockFind = sinon.stub(betModel, "find").returns(bets);
    mockFindById = sinon.stub(userModel, "findById").returns(user);
    mockFindByIdUpdateUser = sinon.stub(userModel, "findByIdAndUpdate").returns(null);
    mockFindByIdUpdateBet = sinon.stub(betModel, "findByIdAndUpdate").returns(null);
    mockFindOne = sinon.stub(gameModel, "findOneAndUpdate").returns(null);
    mockFindOneGame = sinon.stub(gameModel, "findOne").returns(game);
    done();
  })

  afterEach((done) => {
    mockSetDate.restore();
    mockFind.restore();
    mockFindById.restore();
    mockFindByIdUpdateBet.restore();
    mockFindByIdUpdateUser.restore();
    mockFindOne.restore();
    mockFindOneGame.restore();
    done();
  })

  it("it should have status code 200 and return update success message", function(done) {
    week = [{
      AwayScore: 36,
      HomeScore: 30,
      GlobalAwayTeamID: 20,
      GlobalGameID: 17445,
      Canceled: false,
      Status: "Final",
      IsInProgress: false,
      GameEndDateTime: "2020-09-24T23:24:45"   
    }];

    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expected = {
        message: "Updated This Weeks Games!"
      };
      try {
        assert.strictEqual(mockResponse.statusCode, 200);
        assert.deepStrictEqual(mockResponse._getData(), expected);
        done();
      }
      catch (error){
        done(error);
      }
    });

    fetchWeeklyScoresHelper(week, mockResponse);
  });

  it("it should have status code 200 and return update success message Home Team Win", function(done) {
    week = [{
      AwayScore: 30,
      HomeScore: 36,
      GlobalHomeTeamID: 20,
      GlobalGameID: 17445,
      Canceled: false,
      Status: "Final",
      IsInProgress: false,
      GameEndDateTime: "2020-09-24T23:24:45"
    }];

    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expected = {
        message: "Updated This Weeks Games!"
      };
      try {
        assert.strictEqual(mockResponse.statusCode, 200);
        assert.deepStrictEqual(mockResponse._getData(), expected);
        done();
      }
      catch (error){
        done(error);
      }
    });

    fetchWeeklyScoresHelper(week, mockResponse);
  });
});

describe("fetchGamesHelper", function() {  
  let mockFind;
  let mockCreate;
  let mockFindOneUpdate;
  const data = [{
    AwayScore: 30,
    HomeScore: 36,
    GlobalHomeTeamID: 10,
    GlobalAwayTeamID: 5,
    GlobalGameID: 17420,
    Canceled: false,
    Status: "Final",
    Date: "2020-09-10T20:20:00",
    IsInProgress: false,
    GameEndDateTime: "2020-09-24T23:24:45"
  }];
  const fakeGame = {
    game_id: 17263,
    sport_type: "NFL",
    away_team_id: 13,
    home_team_id: 16,
    canceled: false,
    status: "Final"
  }

  beforeEach((done) =>{
    mockCreate = sinon.stub(gameModel, "create").returns(null);
    mockFindOneUpdate = sinon.stub(gameModel, "findOneAndUpdate").returns(null);
    done();
  })

  afterEach((done) => {
    mockFind.restore();
    mockCreate.restore();
    mockFindOneUpdate.restore();
    done();
  })

  it("it should have status code 201 and return success message", function(done) {
    mockFind = sinon.stub(gameModel, "findOne").returns(fakeGame);

    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expected = {
        message: "Imported All Games!"
      };
      try {
        assert.strictEqual(mockResponse.statusCode, 201);
        assert.deepStrictEqual(mockResponse._getData(), expected);
        done();
      }
      catch (error){
        done(error);
      }
    });

    fetchGamesHelper(data, mockResponse);
  });

  it("it should have status code 201 and return success message", function(done) {
    mockFind = sinon.stub(gameModel, "findOne").returns(null);

    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expected = {
        message: "Imported All Games!"
      };
      try {
        assert.strictEqual(mockResponse.statusCode, 201);
        assert.deepStrictEqual(mockResponse._getData(), expected);
        done();
      }
      catch (error){
        done(error);
      }
    });

    fetchGamesHelper(data, mockResponse);
  });
});

describe("PUT /api/games/:id", function() {  
  let mockFind;
  const fakeGame = {
    game_id: 17263,
    sport_type: "NFL",
    away_team_id: 13,
    home_team_id: 16,
    canceled: false,
    status: "Final"
  }

  beforeEach((done) =>{
    mockFind = sinon.stub(gameModel, "findOneAndUpdate").callsFake((id, body) => {
      return ({
        game_id: id.game_id,
        ...body
      })
    })
    done();
  })

  afterEach((done) => {
    mockFind.restore();
    done();
  })

  it("it should have status code 202 and return result of Game.findByIdAndUpdate", function(done) {
    const mockRequest = httpMocks.createRequest({
      method: "PUT",
      url: "/api/games/:id",
      params: {
        id: 17263
      },
      body: {
        sport_type: "NFL",
        away_team_id: 13,
        home_team_id: 16,
        canceled: false,
        status: "Final"
      }
    });
    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expected = {
        error: false,
        game: fakeGame
      };
      try {
        assert.strictEqual(mockResponse.statusCode, 202);
        assert.deepStrictEqual(mockResponse._getData(), expected);
        done();
      }
      catch (error){
        done(error);
      }
    });

    updateGameById(mockRequest, mockResponse);
  });
});

describe("DELETE /api/games/:id", function() {  
  let mockFind;
  const fakeGame = {
    game_id: 17263,
    sport_type: "NFL",
    away_team_id: 13,
    home_team_id: 16,
    canceled: false,
    status: "Final"
  }

  beforeEach((done) =>{
    mockFind = sinon.stub(gameModel, "findByIdAndDelete").callsFake((id) => {
      return ({
        game_id: id,
        sport_type: "NFL",
        away_team_id: 13,
        home_team_id: 16,
        canceled: false,
        status: "Final"
      })
    })
    done();
  })

  afterEach((done) => {
    mockFind.restore();
    done();
  })

  it("it should have status code 202 and return result of Game.findByIdAndDelete", function(done) {
    const mockRequest = httpMocks.createRequest({
      method: "PUT",
      url: "/api/games/:id",
      params: {
        id: 17263
      },
      body: {
        sport_type: "NFL",
        away_team_id: 13,
        home_team_id: 16,
        canceled: false,
        status: "Final"
      }
    });
    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expected = {
        error: false,
        game: fakeGame
      };
      try {
        assert.strictEqual(mockResponse.statusCode, 202);
        assert.deepStrictEqual(mockResponse._getData(), expected);
        done();
      }
      catch (error){
        done(error);
      }
    }); 

    deleteGameById(mockRequest, mockResponse);
  });
});

describe("GET /api/games/odds/:id", function() {  
  let mockFind;
  let mockClient;
  const fakeGame = {
    game_id: 17263,
    sport_type: "NFL",
    away_team_id: 13,
    home_team_id: 16,
    canceled: false,
    status: "Final",
    score_id: 17263,
    away_odds: 447,
    home_odds: -534
  }

  beforeEach((done) =>{
    mockFind = sinon.stub(gameModel, "findOne").returns(fakeGame);
    mockClient = sinon.stub(client, "get").returns(null);
    done();
  })

  afterEach((done) => {
    mockFind.restore();
    mockClient.restore();
    done();
  })

  it("it should have status code 200 and return game odds", function(done) {
    const mockRequest = httpMocks.createRequest({
      method: "GET",
      url: "/api/games/odds/:id",
      params: {
        id: '17263'
      }
    });
    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expected = {
        error: false,
        away_odds: fakeGame.away_odds,
        home_odds: fakeGame.home_odds,
      };
      try {
        assert.strictEqual(mockResponse.statusCode, 200);
        assert.deepStrictEqual(mockResponse._getData(), expected);
        done();
      }
      catch (error){
        done(error);
      }
    }); 

    fetchOddsByGame(mockRequest, mockResponse);
  });
});

describe("fetchOddsByGameHelper", function() {  
  let mockFind;
  let data;

  beforeEach((done) =>{
    mockFind = sinon.stub(gameModel, "findOneAndUpdate").returns(null);
    done();
  })

  afterEach((done) => {
    mockFind.restore();
    done();
  })

  it("it should have status code 200 and return away and home team odds", function(done) {
    data = [{
      PregameOdds: 
      [
        {
        AwayMoneyLine: null,
        HomeMoneyLine: null
        },
        {
          AwayMoneyLine: 467,
          HomeMoneyLine: -561
        }
      ]
    }];
    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expected = {
        error: false,
        away_odds: 467,
        home_odds: -561
      };
      try {
        assert.strictEqual(mockResponse.statusCode, 200);
        assert.deepStrictEqual(mockResponse._getData(), expected);
        done();
      }
      catch (error){
        done(error);
      }
    }); 

    fetchOddsByGameHelper(data, mockResponse, 17263);
  });

  it("it should have status code 200 and return error", function(done) {
    data = [{
      PregameOdds: []
    }];
    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expected = {
        error: true
      };
      try {
        assert.strictEqual(mockResponse.statusCode, 200);
        assert.deepStrictEqual(mockResponse._getData(), expected);
        done();
      }
      catch (error){
        done(error);
      }
    }); 

    fetchOddsByGameHelper(data, mockResponse, 17263);
  });
});