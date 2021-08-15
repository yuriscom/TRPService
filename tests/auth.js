/**
 * Created by petro on 2014-10-08.
 */
var should    = require('chai').should()
  , request   = require('supertest')
  , superagent = require('superagent')
  , server    = require('../initializer')
  , when      = require('when')
  ;

// describe test subject
describe('Testing Endpoint Authentication', function() {

  // remove time limit for asyncronous tests
  this.timeout(false);

  // before all hook
  before(function(done) {
    server.listen(3000, function serverStarted() {
      console.log('Start TheRedPin Application');
      done();
    });
  });


  // after all hook
  after(function(done) {
    server.close(function() {
      done();
    });
  });


  // before each hook
  beforeEach(function(done) {
    console.log('Before each test starts');
    done();
  });


  // after each hook
  afterEach(function(done) {
    console.log('After each test finishes');
    done();
  });


  // test cases
  describe('Single Property Endpoint Auth', function() {

    it('should return a non-authenticated response', function(done) {
      var url = 'localhost:3000/latest';
      request.agent(url)
      .get('/properties/752599')
      .end(function (err, res) {
        res.body.result.should.have.property('redirectUrl','/authenticate');
        done();
      });
    });

    it('should return a property, after creating token', function(done) {
      var url = 'localhost:3000/latest';
      superagent.post(url+'/sessions')
      .send({ grant_type: 'password', client_id: 'trpweb',
        client_secret: 'theredpin', username: 'newIOPG@mailinator.com', password: 'blabla' })
      .end(function (err, res) {
        if (err) { throw err; }
//          if (res.body.hasOwnProperty('access_token')){
          superagent.get(url+'/properties/752599')
            .set('Authorization','Bearer '+res.body.access_token)
            .end(function (err, res) {
              if (err) { throw err; }
              res.body.result.should.have.property('id',752599);
              done();
          });
      });
    });
  });
});