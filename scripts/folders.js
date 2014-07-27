/** @jsx React.DOM */
var _ = require('underscore'),
  $ = require('jquery'),
  React = require('react')
  RB = require('react-bootstrap')
  Folder = require('./folder');

var Folders = React.createClass({
  getInitialState: function(){
    //anti-pattern
    //store a local copy of props as state
    return {
      folders: this.props.folders || []
    };
  },

  //this helps the anti-pattern in getInitialState
  //by updating the local copy of props all the time
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      folders: nextProps.folders || []
    });
  },

  createFolder: function(){
    // console.log('createFolder');
    var defaultFolder = {
      name: '',
      repos: []
    };

    //copy and modify
    //https://groups.google.com/forum/#!topic/reactjs/RorfQ8a1KoA
    var foldersCopy = this.state.folders.slice();
    var newFolderName = 'Folder ' + foldersCopy.length;
    var newFolder = _.extend({}, defaultFolder, {name: newFolderName});
    foldersCopy.push(newFolder);
    this.setState({
      folders: foldersCopy
    }, function(){
      this.props.save(this.state);  //save via its parent
    }.bind(this));
  },

  render: function(){
    var allFolders = _.map(this.state.folders, function(folder){
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
