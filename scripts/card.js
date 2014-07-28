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
  React = require('react'),
  RB = require('react-bootstrap');

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
        className="col-lg-3 col-md-6">
        <div className="panel panel-success">
          <div className="panel-heading">
            <RB.Row>
              <RB.Col xs={3}>
                <img
                  src={card.owner.avatar_url}
                  className="img-responsive img-rounded"/>
              </RB.Col>
              <RB.Col xs={9}>
                {card.full_name}
              </RB.Col>
            </RB.Row>
          </div>
          <div className="panel-footer">
            <span className="pull-left"><RB.Glyphicon glyph="star-empty" /> {card.watchers_count}</span>
            <span className="pull-right"></span>
            <div className="clearfix"></div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Card;
