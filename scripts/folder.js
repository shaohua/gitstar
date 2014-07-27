/** @jsx React.DOM */
var _ = require('underscore'),
  $ = require('jquery'),
  React = require('react'),
  RB = require('react-bootstrap');

var Folder = React.createClass({
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
    console.log('Drop inputData', inputData);
    this.setState({
      isDropSuccess: true
    }, function(){
      this.resetDropSuccess();
    }.bind(this));
  },

  render: function(){
    var cx = React.addons.classSet;
    var classes = cx({
      'list-group-item': true,
      'list-group-item-success': this.state.isDropSuccess
    });

    return (
      <a href="#"
        onDragEnter={this.preventDefault}
        onDragOver={this.preventDefault}
        onDrop={this.onDrop}
        className={classes}>
        <RB.Glyphicon glyph="folder-open" />{this.props.folderName}
      </a>
    );
  }
});

module.exports = Folder;
