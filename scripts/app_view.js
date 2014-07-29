/** @jsx React.DOM */
var _ = require('underscore'),
  $ = require('jquery'),
  // moment = require('moment'),
  React = require('react'),
  Header = require('./header'),
  Landing = require('./landing'),
  Folders = require('./folders'),
  Cards = require('./Cards'),
  RB = require('react-bootstrap'),
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

var AppView = React.createClass({
  getInitialState: function(){
    return {};
  },

  _onRefreshState: function(myStore){
    this.setState( _getStateFromStore(myStore.val()), function(){
      console.log('_onRefreshState', this.state);
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
      <RB.Grid>
        <RB.Row>
          <RB.Col sm={3} className="gs-column-groups">
            <Folders
              folderIndex={this.state.folderIndex}
              folders={this.state.folders}/>
          </RB.Col>
          <RB.Col sm={9} className="gs-column-repos col-sm-offset-3">
            <Cards cards={this.state.starsCurrentFolder}/>
          </RB.Col>
        </RB.Row>
      </RB.Grid>
    );

    if(this.state.user) {
      return (
        <div>
          <Header user={this.state.user}/>
          {loggedIn}
        </div>
      );
    } else {
      return (
        <div className='gs-fullwidth'>
          <Header/>
          <Landing />
        </div>
      );
    }
  }
});

module.exports = AppView;
