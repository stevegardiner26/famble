const httpMocks = require('node-mocks-http');
const sinon = require('sinon');
const assert = require('chai').assert;
const { userModel } = require('../models/User');
const { getUserById, createUser, getUsers } = require('../routes/userRoutesHandlers');

describe("GET /api/users/:id", function() {  
  let mockFindById;

  beforeEach((done) =>{
    mockFindById = sinon.stub(userModel, "findById").callsFake((id) => {
      return ({
        name: "Jay Rana",
        profile_image: "https://lh3.googleusercontent.com/a-/AOh14Gg629IeUkf1lWpBcSqr7-m_pEhpvQI3CdAczWijeA=s96-c",
        email: "jpr48@njit.edu",
        google_id: "108376284041323611441",
        id: id
      });
    });
    done();
  })

  afterEach((done) => {
    mockFindById.restore();
    done();
  })

  it("it should have status code 200 and pass id into user.create since user does not exist", function(done) {
    const mockRequest = httpMocks.createRequest({
      method: "GET",
      url: "/api/users/5fb83983417ae836a4e2b170",
      params:{
        id: "5fb83983417ae836a4e2b170"
      }
    });
    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expected = {
        name: "Jay Rana",
        profile_image: "https://lh3.googleusercontent.com/a-/AOh14Gg629IeUkf1lWpBcSqr7-m_pEhpvQI3CdAczWijeA=s96-c",
        email: "jpr48@njit.edu",
        google_id: "108376284041323611441",
        id: "5fb83983417ae836a4e2b170"
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

    getUserById(mockRequest, mockResponse);
  });
});

describe("POST /api/users", function() {  
  let mockCreate;
  let mockFindOne;

  beforeEach((done) =>{

    mockCreate = sinon.stub(userModel, "create").callsFake((body) => {
      return body;
    })
    mockFindOne = sinon.stub(userModel, "findOne").returns(null);
    done();
  })

  afterEach((done) => {
    mockCreate.restore();
    mockFindOne.restore();
    done();
  })

  it("it should have status code 201 and pass data from body into user.create since user does not exist", function(done) {
    const mockRequest = httpMocks.createRequest({
      method: "POST",
      url: "/api/users",
      body: {
        name: "Jay Rana",
        profile_image: "https://lh3.googleusercontent.com/a-/AOh14Gg629IeUkf1lWpBcSqr7-m_pEhpvQI3CdAczWijeA=s96-c",
        email: "jpr48@njit.edu",
        google_id: "108376284041323611441"
      }
    });
    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expected = {
        error: false,
        user: {
          name: "Jay Rana",
          profile_image: "https://lh3.googleusercontent.com/a-/AOh14Gg629IeUkf1lWpBcSqr7-m_pEhpvQI3CdAczWijeA=s96-c",
          email: "jpr48@njit.edu",
          google_id: "108376284041323611441"
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

    createUser(mockRequest, mockResponse);
  });
});

describe("POST /api/users 1", function() {  
  let mockFindOne;
  const fakeUser = {
    shreddit_balance: 7770,
    name: "Jay Rana",
    profile_image: "https://lh3.googleusercontent.com/a-/AOh14Gg629IeUkf1lWpBcSqr7-m_pEhpvQI3CdAczWijeA=s96-c",
    email: "jpr48@njit.edu",
    google_id: "108376284041323611441",
  }

  beforeEach((done) =>{
    mockFindOne = sinon.stub(userModel, "findOne").returns(fakeUser);
    done();
  })

  afterEach((done) => {
    mockFindOne.restore();
    done();
  })

  it("it should have status code 201 and return since user exists", function(done) {
    const mockRequest = httpMocks.createRequest({
      method: "POST",
      url: "/api/users",
      body: {
        name: "Jay Rana",
        profile_image: "https://lh3.googleusercontent.com/a-/AOh14Gg629IeUkf1lWpBcSqr7-m_pEhpvQI3CdAczWijeA=s96-c",
        email: "jpr48@njit.edu",
        google_id: "108376284041323611441"
      }
    });
    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expected = {
        error: false,
        user: fakeUser
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

    createUser(mockRequest, mockResponse);
  });
});

describe("GET /api/users/rank/:id", function() {  
  let mockFind;
  let fakeUsers = [{
    name: "Jay Rana",
    profile_image: "https://lh3.googleusercontent.com/a-/AOh14Gg629IeUkf1lWpBcSqr7-m_pEhpvQI3CdAczWijeA=s96-c",
    email: "jpr48@njit.edu",
    google_id: "108376284041323611441",
    id: "5fb83983417ae836a4e2b1701234"
  }, 
  {
    name: "Jay Rana",
    profile_image: "https://lh3.googleusercontent.com/a-/AOh14Gg629IeUkf1lWpBcSqr7-m_pEhpvQI3CdAczWijeA=s96-c",
    email: "jpr48@njit.edu",
    google_id: "108376284041323611441",
    id: "5fb83983417ae836a4e2b170"
  }]

  beforeEach((done) =>{
    mockFind = sinon.stub(userModel, "find").returns({sort: sinon.stub().returns(fakeUsers)});
    done();
  })

  afterEach((done) => {
    mockFind.restore();
    done();
  })

  it("it should have status code 200 and rank of user and all users", function(done) {
    const mockRequest = httpMocks.createRequest({
      method: "GET",
      url: "/api/users/rank/5fb83983417ae836a4e2b170",
      params:{
        id: "5fb83983417ae836a4e2b170"
      }
    });
    const mockResponse = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    
    mockResponse.on('end', function() {
      const expected = {
        users: fakeUsers,
        rank: 2
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

    getUsers(mockRequest, mockResponse);
  });
});