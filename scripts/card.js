/** @jsx React.DOM */
var _ = require('underscore'),
  $ = require('jquery'),
  React = require('react');

var Card = React.createClass({
  render: function(){
    return (
      <div className="col-lg-3 col-md-6 panel panel-primary">
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
