var React = require('react')
var styles = require('../styles/styles.css');
var Map = require('./Map.js');
var axios = require('axios');

class Home extends React.Component {

  constructor(props) {
    super(props);

    this.mapSong = this.mapSong.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);

    this.state = {
      songname: "",
      songimg: "",
      genres: [],
      artist: "",
      username: "",
      oauthDetails: {},
      isLoggedIn: false,
      pos: {},
      dataLoading: true,
      mapLoading: true,
      isLoading: true,
      error: false,
      mapError: false
    };
    this.map = {}
  }

  // Puts a marker on the map for the specific song.
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
    var contentString = "<div class='infoWindow'><div class='songName'>"+mappedSong.songname+"</div><div><ul><li>Artist: "+mappedSong.artist+"</li><li>Genre: "+ genres +"</li><li>Mapped by: "+mappedSong.username+"</li><li>Date: "+mappedSong.year+"."+mappedSong.month+"."+mappedSong.day+"</li></ul></div><a href='"+mappedSong.uri+"'><button class='btn btn-success listenButton'>Listen</button></a></div>";

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    })

    // google.maps.event.addListener(infowindow, 'domready', function() {
    //   // Reference to the DIV that wraps the bottom of infowindow
    //   var iwOuter = $('.gm-style-iw');
    //
    //   var iwBackground = iwOuter.prev();
    //   console.log(iwBackground);
    //   // Removes background shadow DIV
    //   iwBackground.children(':nth-child(2)').css({'display' : 'none'});
    //   // Removes white background DIV
    //   iwBackground.children(':nth-child(4)').css({'display' : 'none'});
    //   // Reference to the div that groups the close button elements.
    //   var iwCloseBtn = iwOuter.next();
    //
    //   iwCloseBtn.css({opacity: '1', right: '38px', top: '3px', border: '3px solid #48b5e9', 'border-radius': '13px', 'box-shadow': '0 0 5px #3990B9'});
    // })

  }

  // Sends the song data to Firebase and calls setMarkers().
  mapSong() {
    var currentdate = new Date();
    var mappedSong = {
      username: this.state.username,
      songname: this.state.songname,
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

  getSongData() {
    // Retrieving currently playing song
    axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me/player/currently-playing',
      headers: {
        'Authorization': 'Bearer ' + this.state.oauthDetails.access_token
      }
    }).then(function(response) {
      console.log(response);
      this.setState({
        songname: response.data.item.name,
        songimg: response.data.item.album.images[2].url,
        artist: response.data.item.artists[0].name,
        uri: response.data.item.uri
      })
      // Retrieving genre data
      axios.get(response.data.item.artists[0].href)
        .then(function(artistDetails) {
        console.log(artistDetails);
        this.setState({
          genres: artistDetails.data.genres
        })
      }.bind(this))
      .catch(function(error) {
        this.setState({
          isLoading: false,
          error: true
        })
      })
    }.bind(this))
    .catch(function(error) {
      this.setState({
        isLoading: false,
        error: true
      })
    })
  }

  getUserData() {
    // Retrieving user data
    axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + this.state.oauthDetails.access_token
      }
    }).then(function(response) {
      this.setState({
        username: response.data.id
      })
    }.bind(this))
    .catch(function(error) {
      this.setState({
        isLoading: false,
        error: true
      })
    })
  }

  getOwnData() {

    // Testing own API
    axios.get('https://pacific-reaches-20267.herokuapp.com/api/todos')
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        this.setState({
          isLoading: false,
          error: true
        })
      })

    axios.get('https://178.62.2.218/api/todos')
      .then(function(response) {
        console.log("From Digital Ocean: ");
        console.log(response);
      })
      .catch(function(error) {
        this.setState({
          isLoading: false,
          error: true
        })
      })
  }

  // Sets the user's position to state.
  setPosition(position) {

    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    console.log(pos);
    // var marker = new google.maps.Marker({
    //   position: pos,
    //   map: this.map
    // });
    this.setState(function() {
      return {
        pos: pos
      }
    })
    // var infoWindow = new google.maps.InfoWindow({
    //   content: "<p style='color: black;'> Location found. </p>"
    // })
    // infoWindow.setPosition(pos);
    // infoWindow.open(this.map);
    //this.map.setCenter(pos);
  }

  CenterControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Center Map';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function() {
      map.setCenter(this.state.pos);
      map.setZoom(15);
    }.bind(this));

  }

  componentDidMount() {
    // Read data from firebase and set to map
    firebase.database().ref('/marker').once('value').then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
          this.setMarkers(this.map, childSnapshot.val())
      }.bind(this))
    }.bind(this));

    //var infoWindow = {};

    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: {lat: -34.397, lng: 150.644},
      scrollwheel: false,
      draggable: true
    });

    $(window).resize(function() {
      google.maps.event.trigger(map, "resize");
    })


    if (navigator.geolocation) {

      // On page load, get current position and center the map on that position.
      navigator.geolocation.getCurrentPosition(function(position) {

        // Not loading anymore
        this.setState({
          mapLoading: false
        }, () => {
          if (this.state.dataLoading === false) {
            this.setState({
              isLoading: false
            })
          }
        })

        this.setPosition(position);
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // var marker = new google.maps.Marker({
        //   position: pos,
        //   map: this.map
        // });
        // var infoWindow = new google.maps.InfoWindow({
        //   content: "<p style='color: black;'> Location found. </p>"
        // })
        // infoWindow.setPosition(pos);
        // infoWindow.open(this.map);
        this.map.setCenter(pos)


      }.bind(this), function() {
        //this.handleLocationError(true, infoWindow, this.map.getCenter());
        this.setState({
          isLoading: false,
          mapError: true
        })
      }.bind(this));

      //Watch the user's position without centering the map each time.
      navigator.geolocation.watchPosition(function(position) {
        this.setPosition(position);
      }.bind(this), function() {

      }.bind(this));

      // Create a button to center the map.
      var centerControlDiv = document.createElement('div');

      this.CenterControl(centerControlDiv, this.map);
      centerControlDiv.index = 1;
      this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);

    } else {
      // Browser doesn't support Geolocation
      //this.handleLocationError(false, infoWindow, this.map.getCenter());
      this.setState({
        isLoading: false,
        mapError: true
      })
    }

    var menu = require('../js/menu.js');

    // Spotify
    var access_token = this.props.routeParams.access_token,
        refresh_token = this.props.routeParams.refresh_token,
        error = this.props.routeParams.error;

    if (error) {
      alert('There was an error during the authentication');
    } else {
      if (access_token) {
        // Get a new access token every ~30 minutes, since they expire.
        setInterval(function() {
          console.log("1700000 ms passed")
          axios({
            method: 'get',
            url: '/refresh_token',
            params: {
              refresh_token: refresh_token
            }
          }).then(function(response) {
            access_token = response.data.access_token;
            window.location.replace(`/#/${access_token}/${refresh_token}`);
          })
        }, 1700000)
        // 1800000 ms = 30 min

        // Set state and get all data from Spotify API.
        var oauthDetails = {
          access_token: access_token,
          refresh_token: refresh_token
        }
        this.setState({
          oauthDetails: oauthDetails
        }, () => {
          console.log(this.state.oauthDetails.access_token);
          axios.all([this.getSongData(), this.getUserData(), this.getOwnData()])
            .then(function(acct, perms) {
              this.setState({
                dataLoading: false
              }, () => {
                if (this.state.mapLoading === false) {
                  this.setState({
                    isLoading: false
                  })
                }
              })
            }.bind(this))
        })

        // Get currently playing song every 30 sec to update
        setInterval(function() {
          this.getSongData();
        }.bind(this), 30000)


        // Currently playing song
        // $.ajax({
        //     url: 'https://api.spotify.com/v1/me/player/currently-playing',
        //     headers: {
        //       'Authorization': 'Bearer ' + access_token
        //     },
        //     success: function(response) {
        //       console.log(response);
        //       this.setState({
        //         songname: response.item.name,
        //         songimg: response.item.album.images[2].url,
        //         artist: response.item.artists[0].name,
        //         uri: response.item.uri
        //       })
        //       $.ajax({
        //         url: response.item.artists[0].href,
        //         success: function(artistDetails) {
        //           console.log(artistDetails);
        //           that.setState({
        //             genres: artistDetails.genres
        //           })
        //         }.bind(this);
        //       })
        //
        //     }.bind(this);
        // });

        // $.ajax({
        //   url: 'https://api.spotify.com/v1/me',
        //   headers: {
        //     'Authorization': 'Bearer ' + access_token
        //   },
        //   success: function(response) {
        //     that.setState({
        //       username: response.id
        //     })
        //   }
        // })



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
            {this.state.isLoading ?
            <div className="loadingGif"></div> :
            <h1 className="currentlyPlaying">Currently playing: {this.state.songname}</h1>}
            {this.state.error && <p>Oops...error with loading data</p>}
            {this.state.mapError && <p>Oops...error with geolocation</p>}

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
