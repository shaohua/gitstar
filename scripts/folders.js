/** @jsx React.DOM */
var _ = require('underscore'),
  $ = require('jquery'),
  React = require('react')
  RB = require('react-bootstrap')
  Folder = require('./folder'),
  Actions = require('./actions');

var Folders = React.createClass({
  createFolder: function(){
    // console.log('createFolder');
    Actions.createFolder();
  },

  render: function(){
    var allFolders = _.map(this.props.folders, function(folder){
      return <Folder folderName={folder.name}/>;
    });
    return (
      <div className="list-group gs-folders">
        <a href="#"
          onClick={this.createFolder}
          className="list-group-item">
          <RB.Glyphicon glyph="plus" /> Create a new folder
        </a>
        {allFolders}
      </div>
    );
  }
});

module.exports = Folders;
