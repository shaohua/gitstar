var vent = require('./vent').getInstance(),
  _ = require('underscore'),
  $ = require('jquery'),
  Backbone = require('backbone');

var Store = new Backbone.Model();

var firebaseRef = new Firebase("//gitstar.firebaseIO.com");
var firebaseAuth;

/**
 * Init data
 */

var _initFolders = function(){
  var user = Store.get('user');
  if(user){
    firebaseRef.child('people').child( user.id ).child('folders')
      .on("value", function(dataSnapshot) {
        // console.log('folders', dataSnapshot.val());
        Store.set({
          folders: dataSnapshot.val()
        });
    }.bind(this));
  }
};

var _saveUser = function(user){
  console.log('user', user);
  var userObj = {
    id: user.id,
    uid: user.uid,
    provider: user.provider,
    username: user.username
  };

  var currentPeopleRef = firebaseRef.child('people').child( user.id );
  currentPeopleRef.once("value", function(peopleSnap) {
    var val = peopleSnap.val();
    // If this is a first time login, upload user details.
    if (!val) {
      currentPeopleRef.set(userObj);
    }

    currentPeopleRef.child("presence").set("online");
  });
};

/**
 * For auth
 */

vent.on('auth', function(){
  //auth callback will be invoked any time that
  //the user's authentication state changed
  firebaseAuth = new FirebaseSimpleLogin(firebaseRef, function(error, user) {
    if (error) return;

    Store.set({
      user: user
    });

    if(user && user.id) {
      _initFolders();
      _saveUser(user);
    }
  }.bind(this));
})

vent.on('auth:login', function(){
  firebaseAuth.login('github', {
    rememberMe: true
  });
});

vent.on('auth:logout', function(){
  firebaseAuth.logout();
});

/**
 * For folders
 */
var _saveFoldersToFirebase = function(folders){
  var user = Store.get('user');
  if(user){
    firebaseRef.child('people').child( user.id ).child('folders')
      .set(folders);
  }
};

var defaultFolder = {
  name: '',
  repos: []
};

vent.on('folder:create', function(data){
  var foldersCopy = (Store.get('folders') || []).slice();
  var numberFolders = foldersCopy.length;

  var newFolderName = 'Folder ' + foldersCopy.length;
  var newFolder = _.extend({}, defaultFolder, {name: newFolderName});
  foldersCopy.push(newFolder);

  Store.set('folders', foldersCopy);
  _saveFoldersToFirebase(foldersCopy);
});

/**
 * For stars
 */
//assuming id is the unique github repo id
//converting an array to an object
var _transformStars = function(input){
  var output = {};
  _.each(input, function(item){
    output[item.id] = item;
    delete output[item.id].id;
  });
  return output;
};

var _saveStarsToFirebase = function(stars){
  var user = Store.get('user');
  if(user){
    firebaseRef.child('people').child( user.id ).child('stars')
      .set(stars);
  }
};

vent.on('star:read', function(){
  console.log('getStars');
  var githubApi = 'https://api.github.com';
  var token = '&access_token=' + this.state.user.accessToken;
  $.ajax({
      type: 'GET',
      url: githubApi + '/users/shaohua/starred?per_page=100' + token
    })
    .then(function(data){
      var transformed = this._transformStars(data);
      this._saveStarsToFirebase(transformed);
    }.bind(this));
});

/**
 * For Firebase
 */
vent.on('firebase:off', function(){
  firebaseRef.off();
});

module.exports = Store;
