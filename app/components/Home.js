var React = require('react')
var styles = require('../styles/styles.css');
var Map = require('./Map.js');
// var markerIcon = require('../images/markerBlue.png');

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.mapSong = this.mapSong.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.state = {
      accountDetails: {
        item: {}
      },
      songimg:"",
      oauthDetails: {},
      isLoggedIn: false,
      pos: {}
    };
  }
  mapSong(){
    var currentdate = new Date();
    firebase.database().ref('marker/').push({
    username: "",
    songname: this.state.accountDetails.item.name,
    artist: "",
    genre: "",
    songimg: this.state.songimg,
    year: currentdate.getFullYear(),
    month:currentdate.getMonth()+1,
    day:currentdate.getDate(),
    lat: pos.lat,
    lng: pos.lng
  });
  console.log(this.state.accountDetails.item.name);
  }

  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

  componentDidMount() {
    var infoWindow = new google.maps.InfoWindow;

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: {lat: -34.397, lng: 150.644}
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var marker = new google.maps.Marker({
          position: pos,
          map:map
        });
        this.setState(function() {
          return {
            pos: pos
          }
        })
        infoWindow = new google.maps.InfoWindow;
        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        infoWindow.open(map);
        map.setCenter(pos);
      }.bind(this), function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }

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
              $.ajax({
                  url: response.item.href,
                  success: function(response2){
                    that.setState({
                      songimg: response2.images[2].url
                    })
                  }
                })
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
  }

  render() {
    return (
      <div className="wrapperWithoutBg">
        <div id="loggedin">
          <div id="user-profile">
            <h1 className="currentlyPlaying">Currently playing: {this.state.accountDetails.item.name}</h1>

            <div id="o-wrapper" className="o-wrapper">
              <div className="c-buttons">
                <button id="c-button--slide-left" className="c-button btn btn-lg btn-success">More</button>
                <button id="c-button--slide-right" className="c-button btn btn-lg btn-success" onClick={this.mapSong}>Map!</button>
              </div>
            </div>
            <div id="map"></div>

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
}


module.exports = Home;
