var vent = require('./vent').getInstance();

var Actions = {
  auth: function(){
    vent.trigger('auth');
  },

  authLogin: function(){
    vent.trigger('auth:login');
  },

  authLogout: function(){
    vent.trigger('auth:logout');
  },

  createFolder: function(){
    vent.trigger('folder:create');
  },

  readStar: function(){
    vent.trigger('star:read');
  },

  offFirebase: function(){
    vent.trigger('firebase:off');
  }
};

module.exports = Actions;
