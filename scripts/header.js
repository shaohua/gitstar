/** @jsx React.DOM */
var _ = require('underscore'),
  $ = require('jquery'),
  React = require('react');

var Header = React.createClass({
  render: function(){
    var logoText = "GitStar - organize your Github stars";
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
              <li><a href="#">Profile</a></li>
              <li><a href="#">Help</a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Header;
