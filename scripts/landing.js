/** @jsx React.DOM */
var _ = require('underscore'),
  $ = require('jquery'),
  React = require('react'),
  RB = require('react-bootstrap'),
  Actions = require('./actions');

var Landing = React.createClass({
  onLogin: function(){
    Actions.authLogin();
  },

  render: function(){
    return (
      <RB.Grid>
        <RB.Row>
          <RB.Col lg={12} className="gs-landing">
            <RB.Row>
              <RB.Col lg={4} className="col-lg-offset-4">
                <div className="gs-message">
                  <h3>Organize your GitHub stars by drag-and-drop</h3>
                  <hr className="intro-divider"/>
                  <a onClick={this.onLogin}
                    className="btn btn-default btn-lg">
                    <i className="fa fa-github fa-fw"></i>
                    Login with Github
                  </a>
                </div>
              </RB.Col>
            </RB.Row>
          </RB.Col>
        </RB.Row>
      </RB.Grid>
    );
  }
});

module.exports = Landing;
