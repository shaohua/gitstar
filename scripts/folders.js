/** @jsx React.DOM */
var _ = require('underscore'),
  $ = require('jquery'),
  React = require('react')
  RB = require('react-bootstrap')
  Folder = require('./folder');

var Folders = React.createClass({
  createFolder: function(){
    console.log('createFolder');
  },

  render: function(){
    return (
      <div className="list-group gs-folders">
        <a href="#"
          onClick={this.createFolder}
          className="list-group-item">
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
