/** @jsx React.DOM */
/**
 * Cross-Browser Drag and Drop is inspired by
 * http://facebook.github.io/react/docs/events.html
 * http://mereskin.github.io/dnd/
 * https://gist.github.com/brigand/11464156
 * http://enome.github.io/javascript/2014/03/24/drag-and-drop-with-react-js.html
 * http://webcloud.se/sortable-list-component-react-js/
 */

var _ = require('underscore'),
  $ = require('jquery'),
  React = require('react');

var Card = React.createClass({
  onDragStart: function(event){
    var testData = {
      name: 'facebook/react'
    };
    event.dataTransfer.setData('text', JSON.stringify(testData));
  },

  onDragEnd: function(event){
    //todo, delete card after drag end and a success drop
    console.log('onDragEnd');
  },

  render: function(){
    return (
      <div
        draggable="true"
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        className="col-lg-3 col-md-6 panel panel-primary">
        <div className="panel-heading">facebook/react</div>
        <div class="panel-body">
          <p>React is a JavaScript library for building user interfaces. It's declarative, efficient, and extremely flexible. What's more, it works with the libraries and frameworks that you already know.</p>
        </div>
        <div className="panel-footer">Preview</div>
      </div>
    );
  }
});

module.exports = Card;
