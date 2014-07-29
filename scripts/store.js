var vent = require('./vent').getInstance(),
  _ = require('underscore'),
  $ = require('jquery'),
  Backbone = require('backbone');

var dfd = $.Deferred();

//vanilla Backbone will be overwritten as soon as firebase is ready
var Store;

var firebaseRef = new Firebase("//gitstar.firebaseIO.com");
var firebaseAuth;

/**
 * Utils
 */
//todo
//use a better one
var deepcopy = function(input){
  return JSON.parse(JSON.stringify(input));
};

/**
 * Init data
 */
var defaultFolder = {
  name: 'defaultFolder',
  repos: {}
};

var _initStore = function(userId){
  var FirebaseModel = Backbone.Firebase.Model.extend({
    firebase: "https://gitstar.firebaseIO.com/people/" + userId
  });

  Store = new FirebaseModel();

  //fill defaults after loading
  Store.firebase.on('value', function(storeSnap){
    // console.log('storeSnap', storeSnap.val());

    if( _.isUndefined(Store.get('folders')) ) {
      Store.set({
        folders: [defaultFolder]
      });
    }
    if( _.isUndefined(Store.get('folderIndex')) ) {
      Store.set({
        folderIndex: 0
      });
    }
    if( _.isUndefined(Store.get('stars')) ) {
      Store.set({
        stars: {}
      });
    }
  });

  dfd.resolve(Store);
};

/**
 * For auth
 */

vent.on('auth', function(){
  //auth callback will be invoked any time that
  //the user's authentication state changed
  firebaseAuth = new FirebaseSimpleLogin(firebaseRef, function(error, user) {
    if (error) return;

    if(user && user.id) {
      //bind the store to a dynamic URL
      _initStore(user.id);

      var userObj = {
        id: user.id,
        uid: user.uid,
        provider: user.provider,
        username: user.username,
        accessToken: user.accessToken
      };

      Store.set({
        user: userObj
      });

      //initial import
      if(!Store.get('imported')){
        _getStars();
        Store.set('imported', true);
      }
    }
  }.bind(this));
});

vent.on('auth:login', function(){
  firebaseAuth.login('github', {
    rememberMe: true
  });
});

vent.on('auth:logout', function(){
  firebaseAuth.logout();
  //true to reload from the server rather than the cache
  location.reload(true);
});

/**
 * For folders
 */

vent.on('folder:create', function(){
  var foldersCopy = deepcopy(Store.get('folders'));
  var numberFolders = foldersCopy.length;

  var newFolderName = 'Folder ' + foldersCopy.length;
  var newFolder = _.extend({}, defaultFolder, {name: newFolderName});
  foldersCopy.push(newFolder);

  Store.set('folders', foldersCopy);
});

vent.on('folder:update', function(payload){
  var cardId = payload.cardId,
    folderIndex = payload.folderIndex;

  var foldersCopy = deepcopy(Store.get('folders'));
  //delete from everywhere
  _.each(foldersCopy, function(folder){
    if(folder.repos){
      delete folder.repos[cardId];
    }
  });
  //add to target
  foldersCopy[folderIndex].repos = foldersCopy[folderIndex].repos || {};
  foldersCopy[folderIndex].repos[cardId] = true;

  Store.set('folders', foldersCopy);
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

var _saveToDefaultFolder = function(stars){
  //deep clone is necessary to trigger change
  //trigger change is necessary for Firebase to sync
  var foldersCopy = deepcopy(Store.get('folders'));
  if(foldersCopy.length<1) {
    foldersCopy.push(defaultFolder);
  }

  var firstFolder = foldersCopy[0];
  _.chain(stars)
    .keys()
    .each(function(key){
      firstFolder.repos = firstFolder.repos || {};
      firstFolder.repos[key] = true;
    });

  Store.set('folders', foldersCopy);
};

var _getStars = function(){
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

        _saveToDefaultFolder(transformed);
      }.bind(this));
  }
};

/**
 * For Firebase
 */
vent.on('firebase:off', function(){
  firebaseRef.off();
});

module.exports = dfd.promise();
