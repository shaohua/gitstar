(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null),
  $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null),
  React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null),
  RB = (typeof window !== "undefined" ? window.ReactBootstrap : typeof global !== "undefined" ? global.ReactBootstrap : null),
  Card = require('./card');

var Cards = React.createClass({displayName: 'Cards',
  render: function(){
    //React accepts only one element, hence the wrapper div
    var cards = [];

    for(var key in this.props.cards) {
      if (this.props.cards.hasOwnProperty(key)) {
        cards.push( Card({cardId: key, card: this.props.cards[key]}) );
      }
    };

    return (
      RB.Row(null, 
        cards
      )
    );
  }
});

module.exports = Cards;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./card":4}],2:[function(require,module,exports){
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

  updateFolder: function(payload){
    vent.trigger('folder:update', payload);
  },

  updateFolderIndex: function(payload){
    vent.trigger('folderIndex:update', payload);
  },

  offFirebase: function(){
    vent.trigger('firebase:off');
  }
};

module.exports = Actions;

},{"./vent":11}],3:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null),
  $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null),
  // moment = require('moment'),
  React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null),
  Header = require('./header'),
  Landing = require('./landing'),
  Folders = require('./folders'),
  Cards = require('./Cards'),
  RB = (typeof window !== "undefined" ? window.ReactBootstrap : typeof global !== "undefined" ? global.ReactBootstrap : null),
  Store = require('./store'),
  Actions = require('./actions');

/**
 * methods to derive data
 * todo
 * good idea or not?
 */
var _getStarsCurrentFolder = function(myStore){
  if(_.isUndefined(myStore.folders) ||
     _.isUndefined(myStore.folderIndex) ||
     _.isUndefined(myStore.stars)
    ) {
    return;
  }

  var currentFolder = myStore.folders[myStore.folderIndex];
  if(currentFolder){
    var starsInCurrentFolder = _.keys(currentFolder.repos);
    return _.pick(myStore.stars, starsInCurrentFolder);
  }
};

var _getStateFromStore = function(myStore){
  //myStore is NO longer a Backbone model
  // console.log('myStore', myStore);
  return {
    folders: myStore.folders, //array
    folderIndex: myStore.folderIndex, //int
    stars: myStore.stars, //object
    starsCurrentFolder: _getStarsCurrentFolder(myStore),  //derived data
    user: myStore.user
  };
};

var AppView = React.createClass({displayName: 'AppView',
  getInitialState: function(){
    return {};
  },

  _onRefreshState: function(myStore){
    this.setState( _getStateFromStore(myStore.val()), function(){
      // console.log('_onRefreshState', this.state);
    }.bind(this) );
  },

  componentWillMount: function(){
    Actions.auth();
  },

  componentDidMount: function(){
    Store.then(function(myStore){
      myStore.firebase.on('value', this._onRefreshState);
    }.bind(this));
  },

  //unbind events
  componentWillUnmount: function(){
    Actions.offFirebase();
    Store.then(function(myStore){
      myStore.firebase.off('value', this._onRefreshState);
    }.bind(this));
  },

  render: function() {
    var loggedIn = (
      RB.Grid(null, 
        RB.Row(null, 
          RB.Col({sm: 3, className: "gs-column-groups"}, 
            Folders({
              folderIndex: this.state.folderIndex, 
              folders: this.state.folders})
          ), 
          RB.Col({sm: 9, className: "gs-column-repos col-sm-offset-3"}, 
            Cards({cards: this.state.starsCurrentFolder})
          )
        )
      )
    );

    if(this.state.user) {
      return (
        React.DOM.div(null, 
          Header({user: this.state.user}), 
          loggedIn
        )
      );
    } else {
      return (
        React.DOM.div({className: "gs-fullwidth"}, 
          Header(null), 
          Landing(null)
        )
      );
    }
  }
});

module.exports = AppView;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Cards":1,"./actions":2,"./folders":6,"./header":7,"./landing":9,"./store":10}],4:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */
/**
 * Cross-Browser Drag and Drop is inspired by
 * http://facebook.github.io/react/docs/events.html
 * http://mereskin.github.io/dnd/
 * https://gist.github.com/brigand/11464156
 * http://enome.github.io/javascript/2014/03/24/drag-and-drop-with-react-js.html
 * http://webcloud.se/sortable-list-component-react-js/
 */

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null),
  $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null),
  React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null),
  RB = (typeof window !== "undefined" ? window.ReactBootstrap : typeof global !== "undefined" ? global.ReactBootstrap : null);

var Card = React.createClass({displayName: 'Card',
  onDragStart: function(event){
    var dragData = this.props.cardId;
    event.dataTransfer.setData('text', dragData);
  },

  onDragEnd: function(event){
    //todo, delete card after drag end and a success drop
    // console.log('onDragEnd');
  },

  render: function(){
    var card = this.props.card,
      cardId = this.props.cardId;
    return (
      React.DOM.div({
        draggable: "true", 
        onDragStart: this.onDragStart, 
        onDragEnd: this.onDragEnd, 
        className: "col-lg-3 col-md-6"}, 
        React.DOM.div({className: "panel panel-success"}, 
          React.DOM.div({className: "panel-heading"}, 
            RB.Row(null, 
              RB.Col({xs: 3}, 
                React.DOM.img({
                  src: card.owner.avatar_url, 
                  className: "img-responsive img-rounded"})
              ), 
              RB.Col({xs: 9}, 
                card.full_name
              )
            )
          ), 
          React.DOM.div({className: "panel-footer"}, 
            React.DOM.span({className: "pull-left"}, RB.Glyphicon({glyph: "star-empty"}), " ", card.watchers_count), 
            React.DOM.span({className: "pull-right"}), 
            React.DOM.div({className: "clearfix"})
          )
        )
      )
    );
  }
});

module.exports = Card;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null),
  $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null),
  React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null),
  RB = (typeof window !== "undefined" ? window.ReactBootstrap : typeof global !== "undefined" ? global.ReactBootstrap : null),
  Actions = require('./actions');

var Folder = React.createClass({displayName: 'Folder',
  getInitialState: function(){
    return {isDropSuccess: false};
  },

  // clear state after 1 second
  resetDropSuccess: function(){
    setTimeout(function(){
      this.setState({
        isDropSuccess: false
      });
    }.bind(this), 1000);
  },

  //need to cancel multiple events for drag-and-drop
  preventDefault: function(event){
    event.preventDefault();
  },

  onDrop: function(event){
    event.preventDefault();

    var inputData = '';
    try {
      inputData = JSON.parse(event.dataTransfer.getData('text'));
    } catch (e) {
      console.log('Error parsing dropped data: ', e);
    }
    Actions.updateFolder({
      folderIndex: this.props.domIndex,
      cardId: inputData
    });
    this.setState({
      isDropSuccess: true
    }, function(){
      this.resetDropSuccess();
    }.bind(this));
  },

  navigate: function(){
    Actions.updateFolderIndex(this.props.domIndex);
  },

  render: function(){
    var cx = React.addons.classSet;
    var classes = cx({
      'list-group-item': true,
      'list-group-item-success': this.state.isDropSuccess,
      'active': (this.props.activeFolderIndex === this.props.domIndex)
    });

    return (
      React.DOM.a({href: "#", 
        onClick: this.navigate, 
        onDragEnter: this.preventDefault, 
        onDragOver: this.preventDefault, 
        onDrop: this.onDrop, 
        className: classes}, 
        RB.Glyphicon({glyph: "folder-open"}), " ", this.props.folderName
      )
    );
  }
});

module.exports = Folder;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./actions":2}],6:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null),
  $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null),
  React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null)
  RB = (typeof window !== "undefined" ? window.ReactBootstrap : typeof global !== "undefined" ? global.ReactBootstrap : null)
  Folder = require('./folder'),
  Actions = require('./actions');

var Folders = React.createClass({displayName: 'Folders',
  createFolder: function(){
    // console.log('createFolder');
    Actions.createFolder();
  },

  render: function(){
    var allFolders = _.map(this.props.folders, function(folder, index){
      return Folder({
        domIndex: index, 
        activeFolderIndex: this.props.folderIndex, 
        folderName: folder.name});
    }, this);
    return (
      React.DOM.div({className: "list-group gs-folders"}, 
        React.DOM.a({href: "#", 
          onClick: this.createFolder, 
          className: "list-group-item"}, 
          RB.Glyphicon({glyph: "plus"}), " Create a new folder"
        ), 
        allFolders
      )
    );
  }
});

module.exports = Folders;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./actions":2,"./folder":5}],7:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null),
  $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null),
  React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null),
  Actions = require('./actions');

var Header = React.createClass({displayName: 'Header',
  onLogin: function(){
    Actions.authLogin();
  },

  onLogout: function(){
    Actions.authLogout();
  },

  render: function(){
    var logoText = "GitStar - organize your GitHub stars",
    loginButton = React.DOM.a({href: "#", onClick: this.onLogin}, "Login"),
    logoutButton = React.DOM.a({href: "#", onClick: this.onLogout}, "Logout");

    return (
      React.DOM.div({className: "navbar navbar-inverse navbar-fixed-top", role: "navigation"}, 
        React.DOM.div({className: "container-fluid"}, 
          React.DOM.div({className: "navbar-header"}, 
            React.DOM.button({type: "button", className: "navbar-toggle", 'data-toggle': "collapse", 'data-target': ".navbar-collapse"}, 
              React.DOM.span({className: "sr-only"}, "Toggle navigation"), 
              React.DOM.span({className: "icon-bar"}), 
              React.DOM.span({className: "icon-bar"}), 
              React.DOM.span({className: "icon-bar"})
            ), 
            React.DOM.a({className: "navbar-brand", href: "#"}, logoText)
          ), 
          React.DOM.div({className: "navbar-collapse collapse"}, 
            React.DOM.ul({className: "nav navbar-nav navbar-right"}, 
              React.DOM.li(null, 
                this.props.user ? logoutButton : loginButton
              )
            )
          )
        )
      )
    );
  }
});

module.exports = Header;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./actions":2}],8:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null),
  $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null),
  React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null),
  AppView = require('./app_view');

$(document).ready(function(){
  React.renderComponent(AppView(null), $('#main-app')[0]);
});

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./app_view":3}],9:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null),
  $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null),
  React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null),
  RB = (typeof window !== "undefined" ? window.ReactBootstrap : typeof global !== "undefined" ? global.ReactBootstrap : null),
  Actions = require('./actions');

var Landing = React.createClass({displayName: 'Landing',
  onLogin: function(){
    Actions.authLogin();
  },

  render: function(){
    return (
      RB.Grid(null, 
        RB.Row(null, 
          RB.Col({lg: 12, className: "gs-landing"}, 
            RB.Row(null, 
              RB.Col({lg: 4, className: "col-lg-offset-4"}, 
                React.DOM.div({className: "gs-message"}, 
                  React.DOM.h3(null, "Organize your GitHub stars by drag-and-drop"), 
                  React.DOM.hr({className: "intro-divider"}), 
                  React.DOM.a({onClick: this.onLogin, 
                    className: "btn btn-default btn-lg"}, 
                    React.DOM.i({className: "fa fa-github fa-fw"}), 
                    "Login with Github"
                  )
                )
              )
            )
          )
        )
      )
    );
  }
});

module.exports = Landing;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./actions":2}],10:[function(require,module,exports){
(function (global){
var vent = require('./vent').getInstance(),
  _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null),
  $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null),
  Backbone = (typeof window !== "undefined" ? window.Backbone : typeof global !== "undefined" ? global.Backbone : null);

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
})

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

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./vent":11}],11:[function(require,module,exports){
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
},{}]},{},[8]);