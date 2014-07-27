/** @jsx React.DOM */
var _ = require('underscore'),
  $ = require('jquery'),
  React = require('react')
  RB = require('react-bootstrap');

var Folders = React.createClass({
  render: function(){
    return (
      <div className="list-group gs-folders">
        <a href="#" className="list-group-item">
          <RB.Glyphicon glyph="plus" /> Create a new folder
        </a>
        <a href="#" className="list-group-item"><RB.Glyphicon glyph="folder-open" />Cras justo odio</a>
        <a href="#" className="list-group-item"><RB.Glyphicon glyph="folder-open" />Dapibus ac facilisis in</a>
        <a href="#" className="list-group-item"><RB.Glyphicon glyph="folder-open" />Morbi leo risus</a>
        <a href="#" className="list-group-item"><RB.Glyphicon glyph="folder-open" />Porta ac consectetur ac</a>
        <a href="#" className="list-group-item"><RB.Glyphicon glyph="folder-open" />Vestibulum at eros</a>
      </div>
    );
  }
});

module.exports = Folders;
