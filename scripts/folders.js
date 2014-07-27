/** @jsx React.DOM */
var _ = require('underscore'),
  $ = require('jquery'),
  React = require('react')
  RB = require('react-bootstrap')
  Folder = require('./folder');

var Folders = React.createClass({
  render: function(){
    return (
      <div className="list-group gs-folders">
        <a href="#" className="list-group-item">
          <RB.Glyphicon glyph="plus" /> Create a new folder
        </a>
        <Folder />
        <Folder />
        <Folder />
        <Folder />
        <Folder />
      </div>
    );
  }
});

module.exports = Folders;
