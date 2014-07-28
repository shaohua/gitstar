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
      <RB.Row>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </RB.Row>
    );
  }
});

module.exports = Cards;
