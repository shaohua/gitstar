(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null),
  $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null),
  Backbone = (typeof window !== "undefined" ? window.Backbone : typeof global !== "undefined" ? global.Backbone : null);

var Singleton = (function(){

  // Instance stores a reference to the Singleton
  var instance;

  var init = function(){
    return _.extend({}, Backbone.Events);
  };

  return {
    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: function(){
      if ( !instance ) {
        instance = init();
      }
      return instance;
    }

  };

})(); //self invoking

module.exports = Singleton;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
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

},{"../scripts/vent":1}]},{},[2]);