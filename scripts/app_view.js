/** @jsx React.DOM */
var _ = require('underscore'),
  $ = require('jquery'),
  // moment = require('moment'),
  React = require('react'),
  Header = require('./header'),
  Folders = require('./folders'),
  Cards = require('./Cards'),
  RB = require('react-bootstrap'),
  Store = require('./store'),
  Actions = require('./actions');

var _getStateFromStore = function(){
  return {
    folders: Store.get('folders') || [],
    user: Store.get('user')
  };
};

var AppView = React.createClass({
  getInitialState: function(){
    return _getStateFromStore();
  },

  _onRefreshState: function(){
    this.setState( _getStateFromStore() );
  },

  componentWillMount: function(){
    Actions.auth();
  },

  componentDidMount: function(){
    Store.on('change', this._onRefreshState);
  },

  //unbind events
  componentWillUnmount: function(){
    Actions.offFirebase();
    Store.off('change', this._onRefreshState);
  },

  getStars: function(){
    Actions.readStar();
  },

  onLogin: function(){
    Actions.trigger('auth:login');
  },

  onLogout: function(){
    Actions.trigger('auth:logout');
  },

  render: function() {
    return (
      <div>
        <RB.Grid>
          <Header onLogin={this.onLogin}/>
          <RB.Row>
            <RB.Col sm={3} className="gs-column-groups">
              <button onClick={this.getStars}>getStars</button>
              <Folders
                folders={this.state.folders}/>
            </RB.Col>

            <RB.Col sm={9} className="gs-column-repos col-sm-offset-3">
              <Cards />
            </RB.Col>
          </RB.Row>

        </RB.Grid>

      </div>
    );
  }
});

module.exports = AppView;
