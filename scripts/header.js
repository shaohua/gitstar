/** @jsx React.DOM */
var _ = require('underscore'),
  $ = require('jquery'),
  React = require('react'),
  Actions = require('./actions');

var Header = React.createClass({
  onLogin: function(){
    Actions.authLogin();
  },

  onLogout: function(){
    Actions.authLogout();
  },

  render: function(){
    var logoText = "GitStar - organize your GitHub stars",
    loginButton = <a href="#" onClick={this.onLogin}>Login</a>,
    logoutButton = <a href="#" onClick={this.onLogout}>Logout</a>;

    return (
      <div className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">{logoText}</a>
          </div>
          <div className="navbar-collapse collapse">
            <ul className="nav navbar-nav navbar-right">
              <li>
                {this.props.user ? logoutButton : loginButton}
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Header;
