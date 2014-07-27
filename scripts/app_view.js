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
    this.firebaseRef = new Firebase("//reactjsx.firebaseio.com");
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

    //get all the data initially and after every change
    //from /facebook/react/obj1 and /react-bootstrap/react-bootstrap/obj2
    //to [obj1, obj2]
    var data, allItems;
    this.compRef.on("value", function(dataSnapshot) {
      data = dataSnapshot.val();
      allItems = _.chain(data)
        .values()
        .map(function(item){ return _.values(item); })
        .flatten()
        .value();

      if (typeof window !== 'undefined') { //browser only
        this.setState({
          items: allItems
        });
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

  saveUser: function(user){
    console.log('user', user);
    var currentPeopleRef = this.peopleRef.child( user.id );
    currentPeopleRef.once("value", function(peopleSnap) {
      var val = peopleSnap.val();
      if (!val) {
        // If this is a first time login, upload user details.
        currentPeopleRef.set({
          id: user.id,
          uid: user.uid,
          provider: user.provider,
          username: user.username
        });
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
          <Header />
          <RB.Row>
            <RB.Col sm={3} className="gs-column-groups">
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
