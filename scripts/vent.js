var _ = require('underscore'),
  $ = require('jquery'),
  Backbone = require('backbone');

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
