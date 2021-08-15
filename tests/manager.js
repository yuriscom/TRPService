/**
 * Created by joseguillen on 2014-09-30.
 */
var should = require('chai').should()
  , request = require('supertest')
  , server = require('../initializer')
  ;


// describe test subject
describe('The Manager test', function () {
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
  describe('Resource Manager', function () {
    it('should return an array of urls', function (done) {
      var id = 44;
      var type = 'project';
      var version = 'preview_small';

      var Resource = require(PATH + '/lib/resources/manager');
      var resource = new Resource();
      setTimeout(function () {
        resource.getResources(id, type, version).then(function (res) {

          if (_.isArray(res)) {
            done();
          } else {
            throw 'Fail: Response is not an array';
          }
        });
      }, 2000);
    });

    it('should return an array of urls without logo.jpg', function (done) {
      var id = 44;
      var type = 'project';
      var version = 'preview_small';

      var Resource = require(PATH + '/lib/resources/manager');
      var resource = new Resource();
      setTimeout(function () {
        resource.getResources(id, type, version).then(function (res) {

          if (_.isArray(res)) {
            _.each(res, function (row) {
              if (row.match(/.*logo.*/i)) {
                throw 'Fail: Contains Logo';
              }
            });
            done();
          } else {
            throw 'Fail: Response is not an array';
          }
        });
      }, 2000);
    });

  });
});
