/** @jsx React.DOM */
var _ = require('underscore'),
  $ = require('jquery'),
  React = require('react'),
  RB = require('react-bootstrap'),
  Card = require('./card');

var Cards = React.createClass({
  render: function(){
    //React accepts only one element, hence the wrapper div
    var cards = [];

    for(var key in this.props.cards) {
      if (this.props.cards.hasOwnProperty(key)) {
        cards.push( <Card cardId={key} card={this.props.cards[key]} /> );
      }
    };

    return (
      <RB.Row>
        {cards}
      </RB.Row>
    );
  }
});

module.exports = Cards;
