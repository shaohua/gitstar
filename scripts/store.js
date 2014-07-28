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

Store.set({
  folders: [],
  folderIndex: 0,
  stars: {},
  user: undefined
});

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

var _initStars = function(){
  var user = Store.get('user');
  if(user){
    firebaseRef.child('people').child( user.id ).child('stars')
      .on("value", function(dataSnapshot) {
        Store.set({
          stars: dataSnapshot.val()
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
      _initStars();
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
var _saveFolders = function(folders){
  var user = Store.get('user');
  if(user){
    firebaseRef.child('people').child( user.id ).child('folders')
      .set(folders);
  }
};

var defaultFolder = {
  name: '',
  repos: {}
};

vent.on('folder:create', function(){
  var foldersCopy = Store.get('folders').slice();
  var numberFolders = foldersCopy.length;

  var newFolderName = 'Folder ' + foldersCopy.length;
  var newFolder = _.extend({}, defaultFolder, {name: newFolderName});
  foldersCopy.push(newFolder);

  Store.set('folders', foldersCopy);
  _saveFolders(foldersCopy);
});

vent.on('folder:update', function(repoId){
  var foldersCopy = Store.get('folders').slice();
  foldersCopy[Store.get('folderIndex')].repos = foldersCopy[Store.get('folderIndex')].repos || {};
  foldersCopy[Store.get('folderIndex')].repos[repoId] = true;

  Store.set('folders', foldersCopy);
  _saveFolders(foldersCopy);
});

vent.on('folderIndex:update', function(newIndex){
  Store.set('folderIndex', newIndex);
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

var _saveStars = function(stars){
  var user = Store.get('user');
  if(user){
    firebaseRef.child('people').child( user.id ).child('stars')
      .set(stars);
  }
};

vent.on('star:read', function(){
  console.log('getStars');
  var user = Store.get('user');
  if(user){
    var githubApi = 'https://api.github.com';
    var token = '&access_token=' + user.accessToken;
    $.ajax({
        type: 'GET',
        url: githubApi + '/users/shaohua/starred?per_page=100' + token
      })
      .then(function(data){
        var transformed = _transformStars(data);
        Store.set({
          stars: transformed
        });
        _saveStars(transformed);
      }.bind(this));
  }
});

/**
 * For Firebase
 */
vent.on('firebase:off', function(){
  firebaseRef.off();
});

/**
 * For derived data
 * todo, good idea or not?
 */
Store.GetStarsCurrentFolder = function(){
 var stars = Store.get('stars'),
  folders = Store.get('folders'),
  folderIndex = Store.get('folderIndex'),
  currentFolder = folders[folderIndex];

  if(currentFolder){
    var starsInCurrentFolder = _.keys(currentFolder.repos);
    return _.pick(stars, starsInCurrentFolder);
  }
};

module.exports = Store;
