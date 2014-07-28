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
    var dragData = this.props.cardId;
    event.dataTransfer.setData('text', dragData);
  },

  onDragEnd: function(event){
    //todo, delete card after drag end and a success drop
    console.log('onDragEnd');
  },

  render: function(){
    var card = this.props.card,
      cardId = this.props.cardId;
    return (
      <div
        draggable="true"
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        className="col-lg-3 col-md-6 panel panel-primary">
        <div className="panel-heading">{card.full_name}</div>
        <div class="panel-body">
          <p>ID: {cardId}</p>
        </div>
        <div className="panel-footer">{card.watchers_count}</div>
      </div>
    );
  }
});

module.exports = Card;
