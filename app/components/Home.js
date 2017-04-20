var React = require('react')
var styles = require('../styles/styles.css');
// var markerIcon = require('../images/markerBlue.png');

var Home = React.createClass({

  getInitialState: function() {
    return {
      accountDetails: {
        item: {}
      },
      oauthDetails: {},
      isLoggedIn: false
    }
  },

  componentDidMount: function() {
    var menu = require('../js/menu.js');
    var that = this;

    // Spotify
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
              that.setState({
                accountDetails: response
              })

              // $('#login').hide();
              // $('#loggedin').show();

            }
        });
      } else {
          // render initial screen
          // $('#login').show();
          // $('#loggedin').hide();

          // Redirect user to login page - don't really know if this works cause I dunno how to test it
          //window.location.href = '#/';
      }
    }
    // For testing - delete later
    // $('#login').hide();
    // $('#loggedin').show();
    //
    // this.setState({
    //  isLoggedIn: true
    // })
  },



  render: function() {
    return (
      <div className="wrapperWithoutBg">
        <div id="loggedin">
          <div id="user-profile">
            <h1 className="currentlyPlaying">Currently playing: {this.state.accountDetails.item.name}</h1>

            <div id="o-wrapper" className="o-wrapper">
              <div className="c-buttons">
                <button id="c-button--slide-left" className="c-button btn btn-lg btn-success">More</button>
                <button id="c-button--slide-right" className="c-button btn btn-lg btn-success">Map!</button>
              </div>
            </div>

            <div id="c-mask" className="c-mask"></div>

            <nav id="c-menu--slide-left" className="c-menu c-menu--slide-left">
              <button className="c-menu__close">&larr; Close Menu</button>
              <ul className="c-menu__items">
                <li className="c-menu__item"><a href="#" className="c-menu__link">Filters</a></li>
                <li className="c-menu__item"><a href="#" className="c-menu__link">Search location</a></li>
                <li className="c-menu__item"><a href="#" className="c-menu__link">Playlists</a></li>
                <li className="c-menu__item"><a href="#" className="c-menu__link">About</a></li>
              </ul>
            </nav>

          </div>
        </div>
      </div>
    )
  }
})

module.exports = Home;
