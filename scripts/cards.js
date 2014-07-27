/** @jsx React.DOM */
var _ = require('underscore'),
  $ = require('jquery'),
  React = require('react'),
  RB = require('react-bootstrap'),
  Card = require('./card');

var Cards = React.createClass({
  render: function(){
    //React accepts only one element, hence the wrapper div
    return (
      <div>
        <RB.Row>
          <Card />
          <Card />
          <Card />
          <Card />
        </RB.Row>
        <RB.Row>
          <Card />
          <Card />
          <Card />
          <Card />
        </RB.Row>
      </div>
    );
  }
});

module.exports = Cards;
