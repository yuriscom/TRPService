var should = require('chai').should()
  , Landmark = require('../handlers/1.0.1/landmark')
  ;

describe('Landmarks', function () {

  it('return distance to school place by example bounds', function (done) {
    var l = new Landmark()
      , schoolLat = '43.66887'
      , schoolLng = '-79.3923569'
      ;
    l.lat = '43.6694519';
    l.lng = '-79.3923569';
    var distance = l.getDistance(schoolLat, schoolLng);
    var result = parseFloat(distance.toFixed(1));
    result.should.be.equal(0.1);
    done();
  });

});