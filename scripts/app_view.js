/** @jsx React.DOM */
var _ = require('underscore'),
  $ = require('jquery'),
  // moment = require('moment'),
  React = require('react'),
  Header = require('./header'),
  Folders = require('./folders'),
  Cards = require('./Cards'),
  RB = require('react-bootstrap');

var AppView = React.createClass({
  getInitialState: function() {
    this.firebaseRef = new Firebase("//gitstar.firebaseIO.com");
    this.peopleRef = this.firebaseRef.child("people");
    this.compRef = this.firebaseRef.child("components");

    return {
      items: [],
      user: null
    };
  },

  componentWillMount: function() {
    //auth callback will be invoked any time that
    //the user's authentication state changed
    this.auth = new FirebaseSimpleLogin(this.firebaseRef, function(error, user) {
      if (error) return;

      this.setState({
        user: user
      });

      if(user && user.id) {
        this.saveUser(user);
      }
    }.bind(this));
  },

  componentDidMount: function() {
    //empty for now
  },

  //unbind events
  componentWillUnmount: function() {
    this.peopleRef.off();
    this.compRef.off();
    this.firebaseRef.off();
  },

  getStars: function(){
    var githubApi = 'https://api.github.com';
    var token = '&access_token=' + this.state.user.accessToken;
    $.ajax({
        type: 'GET',
        url: githubApi + '/users/shaohua/starred?per_page=100' + token
      })
      .then(function(data){
        var transformed = this.transformStars(data);
        this.saveStars(transformed);
      }.bind(this));
  },

  //assuming id is the unique github repo id
  //converting an array to an object
  transformStars: function(input){
    var output = {};
    _.each(input, function(item){
      output[item.id] = item;
      delete output[item.id].id;
    });
    return output;
  },

  saveStars: function(stars){
    var currentPeopleRef = this.peopleRef.child( this.state.user.id );
    currentPeopleRef.child('stars').set(stars);
  },

  saveUser: function(user){
    console.log('user', user);
    var currentPeopleRef = this.peopleRef.child( user.id );
    currentPeopleRef.once("value", function(peopleSnap) {
      var userObj = {
        id: user.id,
        uid: user.uid,
        provider: user.provider,
        username: user.username
      };

      var val = peopleSnap.val();
      // If this is a first time login, upload user details.
      if (!val) {
        currentPeopleRef.set(userObj);
      }

      currentPeopleRef.child("presence").set("online");
    });
  },

  onLogin: function(){
    // console.log('onLogin');
    this.auth.login('github', {
      rememberMe: true
    });
  },

  onLogout: function(){
    // console.log('onLogout');
    this.auth.logout();
  },

  render: function() {
    return (
      <div>
        <RB.Grid>
          <Header onLogin={this.onLogin}/>
          <RB.Row>
            <RB.Col sm={3} className="gs-column-groups">
              <button onClick={this.getStars}>getStars</button>
              <Folders />
            </RB.Col>

            <RB.Col sm={9} className="gs-column-repos col-sm-offset-3">
              <Cards />
            </RB.Col>
          </RB.Row>

        </RB.Grid>

      </div>
    );
  }
});

module.exports = AppView;
