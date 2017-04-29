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
      songimg: "",
      genres: [],
      artist: "",
      username: "",
      oauthDetails: {},
      isLoggedIn: false,
      pos: {}
    };
    this.map = {}
  }

  setMarkers(map, mappedSong) {
    // Adds markers to the map.

    // Marker sizes are expressed as a Size of X,Y where the origin of the image
    // (0,0) is located in the top left of the image.

    // Origins, anchor positions and coordinates of the marker increase in the X
    // direction to the right and in the Y direction down.
    var image = {
      url: mappedSong.songimg,
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(64, 64),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32)
    };
    // Shapes define the clickable region of the icon. The type defines an HTML
    // <area> element 'poly' which traces out a polygon as a series of X,Y points.
    // The final coordinate closes the poly by connecting to the first coordinate.
    // var shape = {
    //   coords: [1, 1, 1, 20, 18, 20, 18, 1],
    //   type: 'poly'
    // };
    var marker = new google.maps.Marker({
      position: {lat: mappedSong.lat ,lng: mappedSong.lng},
      map: map,
      icon: image,
      // shape: shape,
      title: mappedSong.songname
    });
    console.log(marker)

    var genres ="";
    mappedSong.genres.map(function(genre){
      genres = genres + genre;
      genres = genres + ", ";
    })
    genres = genres.substring(0, genres.length-2)
    var contentString = "<div style='color: black;'><div>"+mappedSong.songname+"</div><div><ul><li>Artist: "+mappedSong.artist+"</li><li>Genre: "+ genres +"</li><li>Mapped by: "+mappedSong.username+"</li><li>Date: "+mappedSong.year+"."+mappedSong.month+"."+mappedSong.day+"</li></ul></div><a href='"+mappedSong.uri+"'><button>Listen</button></a></div>";
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
      marker.addListener('click', function() {
      infowindow.open(map, marker);
    })

  }

  mapSong() {
    var currentdate = new Date();
    var mappedSong = {
      username: this.state.username,
      songname: this.state.accountDetails.item.name,
      artist: this.state.artist,
      genres: this.state.genres,
      songimg: this.state.songimg,
      year: currentdate.getFullYear(),
      month:currentdate.getMonth()+1,
      day:currentdate.getDate(),
      lat: this.state.pos.lat,
      lng: this.state.pos.lng,
      uri: this.state.uri
    }
    firebase.database().ref('marker/').push(mappedSong);

    this.setMarkers(this.map, mappedSong);

  }

  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

  componentDidMount() {
    firebase.database().ref('/marker').once('value').then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
          this.setMarkers(this.map, childSnapshot.val())
      }.bind(this))
    }.bind(this));

    var infoWindow = {};

    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
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
          map: this.map
        });
        var infowindow = new google.maps.InfoWindow({
          content: "<div>Hello</div>"
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        })
        this.setState(function() {
          return {
            pos: pos
          }
        })
        infoWindow = new google.maps.InfoWindow({
          content: "<p style='color: black;'> Location found. </p>"
        })
        infoWindow.setPosition(pos);
        infoWindow.open(this.map);
        this.map.setCenter(pos);
      }.bind(this), function() {
        handleLocationError(true, infoWindow, this.map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, this.map.getCenter());
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
        that.setState(function() {
          return {
            oauthDetails: {
              access_token: access_token,
              refresh_token: refresh_token
            }
          }
        })

        console.log("access token retrieved")

        // Currently playing song
        $.ajax({
            url: 'https://api.spotify.com/v1/me/player/currently-playing',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
              console.log(response);
              that.setState({
                accountDetails: response,
                songimg: response.item.album.images[2].url,
                artist: response.item.artists[0].name,
                uri: response.item.uri
              })
              $.ajax({
                url: response.item.artists[0].href,
                success: function(artistDetails) {
                  console.log(artistDetails);
                  that.setState({
                    genres: artistDetails.genres
                  })
                }
              })

            }
        });

        $.ajax({
          url: 'https://api.spotify.com/v1/me',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            that.setState({
              username: response.id
            })
          }
        })

        // Testing own API
        $.ajax({
          url: 'http://pacific-reaches-20267.herokuapp.com/api/todos',
          success: function(response) {
            console.log(response);
          }
        })

      } else {
          // Redirect user to login page - don't really know if this works cause I dunno how to test it
          //window.location.href = '#/';
      }
    }
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
