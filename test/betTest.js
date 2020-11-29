const httpMocks = require('node-mocks-http');
const sinon = require('sinon');
const assert = require('chai').assert;
const { betModel } = require('../models/Bet');
const { userModel } = require('../models/User');
const { teamModel } = require('../models/Team');
const { getBets, getBetsByGameID, postBets, getBetsByUserID, deleteBets, helpers, postBetsHelper } = require('../routes/betRoutesHandlers');

describe("GET /api/bets", function() {  
  let stub;
  let fixture;
  beforeEach((done) =>{
    fixture = {
      _id : "fakeuser",
      name: "Fake",
      surname: "User"
    }

    stub = sinon.stub(betModel, "find").returns(fixture);
    done();
  })

  afterEach((done) => {
    stub.restore();
    done();
  })

  it("it should have status code 200 and pass data from Bet.find", function(done) {
    const mockRequest = httpMocks.createRequest({
      method: "GET",
      url: "/api/get_bets"
    });
    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      try {
        assert.strictEqual(mockResponse.statusCode, 200);
        assert.strictEqual(mockResponse._getData(), fixture);
        done();
      }
      catch (error){
        done(error);
      }
    });

    getBets(mockRequest, mockResponse);
  });
});

describe("GET /api/bets/:user_id", function() {  
  let stub;
  const fixture = {
    _id : "fakeuser",
    name: "Fake",
    surname: "User",
    user_id: "5fb83983417ae836a4e2b170"
  }
  beforeEach((done) =>{
    stub = sinon.stub(betModel, "find").callsFake((query) => { 
      return ({
        _id : "fakeuser",
        name: "Fake",
        surname: "User",
        user_id: query.user_id
      });
    });

    done();
  })

  afterEach((done) => {
    stub.restore();
    done();
  })

  it("it should have status code 200 and pass userId from Bet.find", function(done) {
    const mockRequest = httpMocks.createRequest({
      method: "GET",
      url: "/api/bets/5fb83983417ae836a4e2b170",
      params: {
        user_id: "5fb83983417ae836a4e2b170"
      }
    });
    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expected = {
        error: false,
        bets: fixture
      }
      try {
        assert.strictEqual(mockResponse.statusCode, 200);
        assert.deepStrictEqual(mockResponse._getData(), expected);
        done();
      }
      catch (error){
        done(error);
      }
    });

    getBetsByUserID(mockRequest, mockResponse);
  });
});
// ----------------------------------------------------------------------------------
describe("GET /api/bets/:gameid", function() {  
  let stub;
  let fixture;
  beforeEach((done) =>{
    stub = sinon.stub(betModel, "find").callsFake((query) => { 
      return ({
        _id : "fakeuser",
        name: "Fake",
        surname: "User",
        game_id: query.game_id
      });
    });

    fixture = {
      _id : "fakeuser",
      name: "Fake",
      surname: "User",
      game_id: 4
    }

    done();
  })

  afterEach((done) => {
    stub.restore();
    done();
  })

  it("it should have status code 202 and pass gameId from Bet.find", function(done) {
    const mockRequest = httpMocks.createRequest({
      method: "GET",
      url: "/api/bets/4",
      params: {
        game_id: 4
      }
    });
    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expected = {
        error: false,
        bets: fixture
      }
      try {
        assert.strictEqual(mockResponse.statusCode, 202);
        assert.deepStrictEqual(mockResponse._getData(), expected);
        done();
      }
      catch (error){
        done(error);
      }
    });

    getBetsByGameID(mockRequest, mockResponse);
  });
});
// ---------------------------------------------------------------------
describe("POST /api/bets", function() {  
  let mockCreate;
  let mockFindById;
  let mockFindByIdUpdate;
  let userResult;
  let mockFind;
  let mockTeamFind;
  let mockResponse;

  beforeEach((done) =>{
    userResult = {
      shreddit_balance: 10000,
      name: "Jay Rana",
      profile_image: "https://lh3.googleusercontent.com/a-/AOh14Gg629IeUkf1lWpBcSqr7-m_pEhpvQI3CdAczWijeA=s96-c",
      email: "jpr48@njit.edu",
      google_id: "108376284041323611441"
    }

    const fakeTeam = {
      name: "Arizona Cardinals",
      team_id: 1,
      key: "ARI",
      conference: "NFC",
      division: "West",
      stadium_id: 29
    }

    game = {
      game_id: "17403",
      home_team_id: 1,
    }
    mockResponse = sinon.stub(helpers,"postBetsHelper").returns(null);
    mockCreate = sinon.stub(betModel, "create").callsFake((body) => {
      return body;
    })
    mockTeamFind = sinon.stub(teamModel, "find").returns(fakeTeam);
    mockFind = sinon.stub(betModel, "find").returns(game);
    mockFindById = sinon.stub(userModel, "findById").returns(userResult);
    mockFindByIdUpdate = sinon.stub(userModel, "findByIdAndUpdate").returns(null);
    
    done();
  })

  afterEach((done) => {
    mockTeamFind.restore();
    mockFind.restore();
    mockCreate.restore();
    mockFindById.restore();
    mockFindByIdUpdate.restore();
    mockResponse.restore();
    done();
  })

  it("it should have status code 201 and pass data from body into bet.create", function(done) {
    const mockRequest = httpMocks.createRequest({
      method: "POST",
      url: "/api/bets",
      body: {
        user_id: "5fb83983417ae836a4e2b170",
        game_id: "17403",
        team_id: "1",
        amount: 1100,
        name: "Jay"
      }
    });
    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expected = {
        error: false,
        bet: {
          user_id: "5fb83983417ae836a4e2b170",
          game_id: "17403",
          team_id: "1",
          teamName:"Arizona Cardinals",
          amount: 1100,
          name: "Jay"
        }
      }
      try {
        assert.strictEqual(mockResponse.statusCode, 201);
        assert.deepStrictEqual(mockResponse._getData(), expected);
        done();
      }
      catch (error){
        done(error);
      }
    });

    postBets(mockRequest, mockResponse);
  });
});

describe("POST /api/bets 1", function() {  
  let mockFindById;
  let mockFind;
  let mockResponse;
  const result = {
    status: 500,
    data: {
      error: true,
      msg: "Could not update because the updated amount is less than or equal to the current amount",
    }
  }

  beforeEach((done) =>{
    mockFind = sinon.stub(betModel, "find").returns(null);
    mockResponse = sinon.stub(helpers,"postBetsHelper").returns(result);
    mockFindById = sinon.stub(userModel, "findById").returns(null);
    done();
  })

  afterEach((done) => {
    mockFind.restore();
    mockFindById.restore();
    mockResponse.restore();
    done();
  })

  it("it should have status code 500 and return from the postBetsHelper", function(done) {
    const mockRequest = httpMocks.createRequest({
      method: "POST",
      url: "/api/bets",
      body: {
        user_id: "5fb83983417ae836a4e2b170",
        game_id: "17403",
        team_id: "1",
        amount: 1100,
        name: "Jay"
      }
    });
    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expected = result.data;
      try {
        assert.strictEqual(mockResponse.statusCode, 500);
        assert.deepStrictEqual(mockResponse._getData(), expected);
        done();
      }
      catch (error){
        done(error);
      }
    });

    postBets(mockRequest, mockResponse);
  });
});

describe("postBetsHelper", function() {  
  let mockFindByIdUpdate;
  let mockFindByIdUpdateBet;

  beforeEach((done) =>{
    mockFindByIdUpdateBet = sinon.stub(betModel, "findByIdAndUpdate").returns(null);
    mockFindByIdUpdate = sinon.stub(userModel, "findByIdAndUpdate").returns(null);
    done();
  })

  afterEach((done) => {
    mockFindByIdUpdateBet.restore();
    mockFindByIdUpdate.restore();
    done();
  })

  it("it should have status code 201 and error false", function(done) {
    const body = {
        user_id: "5fb83983417ae836a4e2b170",
        game_id: "17403",
        team_id: "5",
        amount: 1100,
        name: "Jay"
    }
    const user = {
      shreddit_balance: 10000,
      name: "Jay Rana",
      profile_image: "https://lh3.googleusercontent.com/a-/AOh14Gg629IeUkf1lWpBcSqr7-m_pEhpvQI3CdAczWijeA=s96-c",
      email: "jpr48@njit.edu",
      google_id: "108376284041323611441"
    }
    const bets = [{
      user_id: "5fb83983417ae836a4e2b170",
      game_id: "17403",
      team_id: "5",
      amount: 100,
    }]
    const expected = {
      status: 201,
      data: {
        error: false,
      }
    }
    postBetsHelper(body, bets, user).then((result) => {
      try {
        assert.deepStrictEqual(result, expected);
        done();
      }
      catch (error){
        done(error);
      }   
    });
  });

  it("it should have status code 500 and error true with message since bet amount less than already bet", function(done) {
    const body = {
        user_id: "5fb83983417ae836a4e2b170",
        game_id: "17403",
        team_id: "5",
        amount: 100,
        name: "Jay"
    }
    const user = {
      shreddit_balance: 10000,
      name: "Jay Rana",
      profile_image: "https://lh3.googleusercontent.com/a-/AOh14Gg629IeUkf1lWpBcSqr7-m_pEhpvQI3CdAczWijeA=s96-c",
      email: "jpr48@njit.edu",
      google_id: "108376284041323611441"
    }
    const bets = [{
      user_id: "5fb83983417ae836a4e2b170",
      game_id: "17403",
      team_id: "5",
      amount: 1100,
    }]
    const expected = {
      status: 500,
      data: {
        error: true,
        msg: "Could not update because the updated amount is less than or equal to the current amount",
      }
    }
    postBetsHelper(body, bets, user).then((result) => {
      try {
        assert.deepStrictEqual(result, expected);
        done();
      }
      catch (error){
        done(error);
      }   
    });
  });

  it("it should have status code 500 and error true with trying to change team message", function(done) {
    const body = {
        user_id: "5fb83983417ae836a4e2b170",
        game_id: "17403",
        team_id: "5",
        amount: 100,
        name: "Jay"
    }
    const user = {
      shreddit_balance: 10000,
      name: "Jay Rana",
      profile_image: "https://lh3.googleusercontent.com/a-/AOh14Gg629IeUkf1lWpBcSqr7-m_pEhpvQI3CdAczWijeA=s96-c",
      email: "jpr48@njit.edu",
      google_id: "108376284041323611441"
    }
    const bets = [{
      user_id: "5fb83983417ae836a4e2b170",
      game_id: "17403",
      team_id: "1",
      amount: 1100,
    }]
    const expected = {
      status: 500,
      data: {
        error: true,
        msg: "You are trying to change the team you are betting on, you are locked in after placing your bet",
      }
    }
    postBetsHelper(body, bets, user).then((result) => {
      try {
        assert.deepStrictEqual(result, expected);
        done();
      }
      catch (error){
        done(error);
      }   
    });
  });
});

describe("DELETE /api/bets/:id", function() {  
  let stub;
  const fixture = {
    _id : "5fb83983417ae836a4e2b170",
    user_id: "5fb83983417ae836a4e2b170",
    game_id: "17403",
    team_id: "5",
    amount: 3330,
  }

  beforeEach((done) =>{
    stub = sinon.stub(betModel, "findByIdAndDelete").callsFake((id) => { 
      return ({
        _id : id,
        user_id: "5fb83983417ae836a4e2b170",
        game_id: "17403",
        team_id: "5",
        amount: 3330,
      });
    });

    done();
  })

  afterEach((done) => {
    stub.restore();
    done();
  })

  it("it should have status code 202 and pass deleted bet from Bet.findByIDAndDelete", function(done) {
    const mockRequest = httpMocks.createRequest({
      method: "DELETE",
      url: "/api/bets/5fb83983417ae836a4e2b170",
      params: {
        id: "5fb83983417ae836a4e2b170"
      }
    });
    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expected = {
        error: false,
        bet: fixture
      }
      try {
        assert.strictEqual(mockResponse.statusCode, 202);
        assert.deepStrictEqual(mockResponse._getData(), expected);
        done();
      }
      catch (error){
        done(error);
      }
    });

    deleteBets(mockRequest, mockResponse);
  });
});