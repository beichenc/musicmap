var React = require('react');
var styles = require('../styles/styles.css');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;

var Home = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      accountDetails: {},
      oauthDetails: {}
    }
  },
  componentDidMount: function() {


    // Spotify

    var that = this
    console.log("component did mount")

    var access_token = this.props.routeParams.access_token,
        refresh_token = this.props.routeParams.refresh_token,
        error = this.props.routeParams.error;

    if (error) {
      alert('There was an error during the authentication');
    } else {
      if (access_token) {
        // render oauth info
        that.setState({
          oauthDetails: {
            access_token: access_token,
            refresh_token: refresh_token
          }
        })

        console.log("access token retrieved")

        $.ajax({
            url: 'https://api.spotify.com/v1/me/player/currently-playing',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {

              console.log(response);

              that.setState({
                accountDetails: response
              })

              console.log(response);
              console.log(response.item.name);

              $('#login').hide();
              $('#loggedin').show();
            }
        });
      } else {
          // render initial screen
          $('#login').show();
          $('#loggedin').hide();
      }
    }
    // For testing - delete later
    // $('#login').hide();
    // $('#loggedin').show();
  },

  render: function() {
    return (
      <div className="body">
        <div className="container">
          <div id="login" className="displayNone">
            <h1 className="loginElement">Log in with your Spotify account</h1>
            <a href="/login" className="btn btn-lg btn-success customButtonSLogIn">Log in</a>
          </div>


          <div id="loggedin" className="displayNone">
            <div id="user-profile">
              {this.state.accountDetails.item &&<h1 className="loginElement">Currently playing: {this.state.accountDetails.item.name}</h1>}
            </div>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = Home;
