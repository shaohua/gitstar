/** @jsx React.DOM */

var _ = require('underscore'),
  $ = require('jquery'),
  React = require('react'),
  AppView = require('./app_view');

$(document).ready(function(){
  React.renderComponent(<AppView />, $('#main-app')[0]);
});
