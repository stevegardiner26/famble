/* eslint-disable no-undef */
const httpMocks = require('node-mocks-http');
const sinon = require('sinon');
const assert = require('chai').assert;
const { statModel } = require('../models/Stat');
const { getStatsByTeamIDStandings, getStatsByTeamIDTeamSeasonStats } = require('../routes/statisticRoutesHandlers');

describe("getStatsByTeamIDStandings", function(){
    const data = [{
        Wins: 10,
        Losses: 30,
        TeamID: 1
    }]
    let mockFind;
    const team_stats = {
        wins: null,
        losses: null
    }

    beforeEach((done) => {
        mockFind = sinon.stub(data, "find").returns(data[0]);
        done();
    })

    afterEach((done) => {
        mockFind.restore();
        done();
    })

    it("It should return statistics of a Team based on the Team ID", function(done){
        const result = getStatsByTeamIDStandings(data, team_stats);  
        const expected = {
            wins: 10,
            losses: 30
        };
        try {
            assert.deepStrictEqual(result, expected);
            done();
        }
        catch (error){
            done(error);
        }        
    });
})

describe("getStatsByTeamIDTeamSeasonStats", function(){
    const data = [{
        Touchdowns: 0,
        PassingAttempts: 0,
        CompletionPercentage: 0,
        PassingYards: 0,
        FumblesForced: 0,
        RushingYards: 0,
        PenaltyYards: 0,
        Sacks: 0,
        TeamID: 1
    }]
    let mockFind;
    let mockCreate;
    let teamStats = {
        touchdowns: null,
        passing_attempts: null,
        completion_percentage: null,
        passing_yards: null,
        fumbles_forced: null,
        rushing_yards: null,
        penalty_yards: null,
        sacks: null
    }

    beforeEach((done) => {
        mockFind = sinon.stub(data, "find").returns(data[0]);
        mockCreate = sinon.stub(statModel, "create").returns(null);
        done();
    })

    afterEach((done) => {
        mockFind.restore();
        mockCreate.restore();
        done();
    })

    it("It should return statistics of a Team based on the Team ID", function(done){
        const mockResponse = httpMocks.createResponse({
            eventEmitter: require('events').EventEmitter
          });
          
        mockResponse.on('end', function() {
            teamStats = {
                touchdowns: 0,
                passing_attempts: 0,
                completion_percentage: 0,
                passing_yards: 0,
                fumbles_forced: 0,
                rushing_yards: 0,
                penalty_yards: 0,
                sacks: 0  
            }
            const expected = {teamStats};
            try {
              assert.strictEqual(mockResponse.statusCode, 201);
              assert.deepStrictEqual(mockResponse._getData(), expected);
              done();
            }
            catch (error){
              done(error);
            }
        }); 
        
        getStatsByTeamIDTeamSeasonStats(data, teamStats, mockResponse);  
    });
})