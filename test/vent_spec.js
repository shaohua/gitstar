describe("Trigger events on the vent object", function() {
  var vent = require('../scripts/vent').getInstance();

  it("should intialize a new vent", function(){
    expect(vent).to.not.equal(undefined);
  });

  it("should fire a test event", function(done){
    var errTimeout = setTimeout(function () {
      expect(false, 'Event never fired').to.equal(true);
      done();
    }, 1000); //timeout with an error in one second

    vent.on('test', function(){
      clearTimeout(errTimeout); //cancel error timeout
      expect(true, 'Event fired').to.equal(true);
      done();
    });
    vent.trigger('test');
  });
});
