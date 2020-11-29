const httpMocks = require('node-mocks-http');
const sinon = require('sinon');
const assert = require('chai').assert;
const { teamModel } = require('../models/Team');
const { getStatsByTeamID } = require('../routes/statisticRoutesHandlers');

describe("GET /api/stats/teams/:team_id", function(){
    let mockFindByTeamId;
    before((done) => {
        mockFindByTeamId = sinon.stub(teamModel, "findById").callsFake((team_id) => {
            return ({
                wins: 6,
                losses: 4,
                touchdowns: 3,
                passing_attempts: 96,
                completion_percentage: 18.6,
                passing_yards: 701,
                fumbles_forced: 0,
                rushing_yards: 431,
                penalty_yards: 173,
                sacks: 2
            })
        })
        done();
    })

    afterEach((done) => {
        mockFindByTeamId.restore();
        done();
    })

    it("It should have status code 201 and return statistics of a Team based on the Team ID", function(done){
        const mockRequest = httpMocks.createRequest({
            method: "GET",
            url: "/api/stats/teams/ARI",
            params:{
                team_id: "ARI"
            }
        });   
        const mockResponse = httpMocks.createResponse({
            eventEmitter: require('events').EventEmitter
        });
        mockResponse.on('end', function() {
            const expected = {
                wins: 6,
                losses: 4,
                touchdowns: 3,
                passing_attempts: 96,
                completion_percentage: 18.6,
                passing_yards: 701,
                fumbles_forced: 0,
                rushing_yards: 431,
                penalty_yards: 173,
                sacks: 2
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
        getStatsByTeamID(mockRequest, mockResponse);
    });
})