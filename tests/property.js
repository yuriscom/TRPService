/**
 * Created by joseguillen on 2014-09-30.
 */
var should = require('chai').should()
  , request = require('supertest')
  , server = require('../initializer')
  ;


// describe test subject
describe('The Property test', function () {
  var url = 'localhost:3000/1.0.0/properties/';

  // remove time limit for asyncronous tests
  this.timeout(false);


  // before all hook
  before(function (done) {
    server.listen(3000, function () {
      done();
    });
  });


  // after all hook
  after(function (done) {
    server.close(function () {
      done();
    });
  });


  // before each hook
  beforeEach(function (done) {
    console.log('Before each test starts');
    done();
  });


  // after each hook
  afterEach(function (done) {
    console.log('After each test finishes');
    done();
  });


  // test cases
  describe('Property API', function () {
    it('should return a property', function (done) {
      var id = 658798;

      request(url)
        .get(id)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            throw err;
          }
          done();
        });
    });

    it('should return a Schools and Daycares near property', function (done) {
      var id = 658798;

      request(url)
        .get(id + '/amenities')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            throw err;
          }
          done();
        });
    });

    it('should return a similar properties', function (done) {
      var id = 658798;

      request(url)
        .get(id + '/similar')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            throw err;
          }
          done();
        });
    });
  });

  //// Sets failed test to pending
  //xit('should be pending', function(done) {
  //    done();
  //});


});
