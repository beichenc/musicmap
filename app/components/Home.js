var React = require('react')
var styles = require('../styles/styles.css');
var Map = require('./Map.js');
var axios = require('axios');
var positionIcon = require('../images/icon_bludot.png');
var Search = require('./Search.js')
var TimeFilter = require('./TimeFilter.js');
var markercluster = require('../js/markercluster.js');

// import cookie from 'react-cookie';
import Cookies from 'universal-cookie';


// var GeolocationMarker = require('geolocation-marker');
MarkerClusterer.prototype.onRemove = function () {
  this.setReady_(true);
};

class Home extends React.Component {

  constructor(props) {
    super(props);

    this.mapSong = this.mapSong.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setMatchingTime = this.setMatchingTime.bind(this);
    this.setMatchingGenres = this.setMatchingGenres.bind(this);
    this.logOut = this.logOut.bind(this);

    console.log("constructor");


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
      mapError: false,
      timeFilter: 'All',
      genreFilter: '',
      markerCounter: 0,
      errorMsg: 'Oops...error with loading data',
      allowToMap: true
    };
    this.map = {};
    this.mapMarkers=[];
    this.infowindows=[]
    this.markerCluster = {};
    this.watchId = null;
    this.cookies=new Cookies();
  }

  like() {
    console.log("like");
  }

  // Puts a marker on the map for the specific song.
  setMarkers(map, mappedSong, id) {
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
      anchor: new google.maps.Point(32, 32)
    };
    // Shapes define the clickable region of the icon. The type defines an HTML
    // <area> element 'poly' which traces out a polygon as a series of X,Y points.
    // The final coordinate closes the poly by connecting to the first coordinate.
    // var shape = {
    //   coords: [1, 1, 1, 20, 18, 20, 18, 1],
    //   type: 'poly'
    // };
    var marker = new google.maps.Marker({
      position: {lat: mappedSong.lat, lng: mappedSong.lng},
      map: map,
      icon: image,
      // shape: shape,
      title: mappedSong.songname,
      optimized: false,
      zIndex: 1,
      // start at 0
      id: this.state.markerCounter
    });

    var genres ="";
    // console.log(mappedSong.genres);
    if (mappedSong.genres != undefined) {
      mappedSong.genres.map(function(genre){
        genres = genres + genre;
        genres = genres + ", ";
      })
      genres = genres.substring(0, genres.length-2)
    }

    var contentString = "<div class='infoWindow'><div class='songName'>"+mappedSong.songname+"</div><div><ul><li>Artist: "+mappedSong.artist+"</li><li>Genre: "+ genres +"</li><li>Mapped by: "+mappedSong.username+"</li><li>Date: "+mappedSong.year+"."+mappedSong.month+"."+mappedSong.day+"</li></ul></div><a href='"+mappedSong.uri+"'><button class='btn btn-success listenButton'>Listen</button></a><p class='like'>Like</p></div>";

    var infowindow = new google.maps.InfoWindow({
      content: contentString,
      id: this.state.markerCounter
    });
    marker.addListener('click', function() {
      infowindow.open(map, marker);
      $('.like').on('click', function() {
        console.log("like");
      })
    })

    // increment
    this.setState({
      markerCounter: this.state.markerCounter + 1
    }, () => {
      // console.log(this.state.markerCounter);
    })

    this.mapMarkers.push(marker);
    this.infowindows.push(infowindow);


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
    if(this.state.allowToMap){

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
        timestamp: currentdate.getTime(),
        // unixtime: currentdate.getTime(),
        lat: this.state.pos.lat,
        lng: this.state.pos.lng,
        uri: this.state.uri
      }
      //firebase.database().ref('marker/').push(mappedSong);

      //Formatting the genres parameter to match Rails+Postgres array standard.
      var genresArrayString = "{";
      this.state.genres.map(function(genre) {
        genresArrayString += genre;
        genresArrayString += ",";
      })
      genresArrayString = genresArrayString.substring(0, genresArrayString.length-1);
      genresArrayString += "}";

      var mappedSongForPost = {
        username: this.state.username,
        songname: this.state.songname,
        artist: this.state.artist,
        genres: genresArrayString,
        songimg: this.state.songimg,
        year: currentdate.getFullYear(),
        month:currentdate.getMonth()+1,
        day:currentdate.getDate(),
        unixtime: currentdate.getTime(),
        lat: this.state.pos.lat,
        lng: this.state.pos.lng,
        uri: this.state.uri
      }

      axios.post('https://bestmusicmapapi.herokuapp.com/mapped_songs', mappedSongForPost)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });


      this.cookies.set('previously_mapped_song', this.state.uri);
      this.setState({
        allowToMap: false
      });
      this.setMarkers(this.map, mappedSong);

    } else {
      this.setState({
        error: true,
        errorMsg: "Hmm... It seems like you already mapped this song."
      })
    }
  }

  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

  getCurrentSongData() {
    // Retrieving currently playing song
    console.log("access token when getting song every 30 sec: " + this.state.oauthDetails.access_token);
    axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me/player/currently-playing',
      headers: {
        'Authorization': 'Bearer ' + this.state.oauthDetails.access_token
      }
    }).then(function(response) {
      console.log("currently playing")
      console.log(response);
      // If there is no currently playing data - happens when user logs in the first time ever
      if (response.data == "") {
        this.setState({
          errorMsg: "It looks like you're not listening to anything..."
        })
      } else if (response.status = 401) {
        this.setState({
          errorMsg: "Oops...error with loading data kbaflkalkjfkl"
        })
      }

      // Checking if currently playing song is different from previously mapped song.
      if(response.data.item.uri === this.cookies.get('previously_mapped_song')){
        console.log('checked previously_mapped_song')
        this.setState({
          allowToMap: false
        })
        console.log('checked allowToMap')
        console.log(this.cookies.get('allow_to_map'));
      } else {
        this.setState({
          allowToMap: true
        })
      }

      // Set state
      this.setState({
        songname: response.data.item.name,
        songimg: response.data.item.album.images[2].url,
        artist: response.data.item.artists[0].name,
        uri: response.data.item.uri,
        error: false,
      });

      // Retrieving genre data
      axios.get(response.data.item.artists[0].href)
        .then(function(artistDetails) {
        console.log(typeof(artistDetails.data.genres));
        console.log(artistDetails.data.genres);
        this.setState({
          genres: artistDetails.data.genres
        })
      }.bind(this))
      .catch(function(error) {
        console.log("error 1")
        this.setState({
          isLoading: false,
          error: true
        })
      }.bind(this));
    }.bind(this))
    .catch(function(error) {
      console.log("error 2");
      console.log(error);
      this.setState({
        isLoading: false,
        error: true
      })
    }.bind(this))
  }

  postUserDataToBackend(response) {
    var birthday = "not available";
    var imageurl="no image";
    var followers=0;
    if (response.data.birthdate != undefined) {
      birthday = response.data.birthdate;
    }
    if (response.data.images[0] != undefined) {
      imageurl = response.data.images[0].url;
    }
    if (response.data.followers != undefined) {
      followers = response.data.followers.total;
    }
    var user = {
      username: response.data.id,
      email: response.data.email,
      birthday: birthday,
      producttype: response.data.product,
      href: response.data.href,
      uri: response.data.uri,
      imageurl: imageurl,
      followers: followers,
      visits: 1
    }
    axios.post('https://bestmusicmapapi.herokuapp.com/users', user)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  updateVisits(username){
    axios.post('https://bestmusicmapapi.herokuapp.com/users/' + username)
    .then(function (response) {
      console.log('visits')
      console.log(response.data.visits);
    })
    .catch(function (error) {
      console.log(error);
    });
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
      console.log(response);

      axios.get('https://bestmusicmapapi.herokuapp.com/users/check/' + response.data.id)
        .then(function(checkresponse){
          if(checkresponse.data.length === 0){
            this.postUserDataToBackend(response);
          } else{
            if(this.cookies.get('visitedlogin')==='true'){
            this.updateVisits(response.data.id);
            }
          }
          this.cookies.set('visitedlogin','false');
        }.bind(this))
        .catch(function(error){
          console.log(error);
        })
      this.setState({
        username: response.data.id
      })
    }.bind(this))
    .catch(function(error) {
      this.setState({
        isLoading: false,
        error: true
      })
    }.bind(this))
  }

  getMappedSongsData(callback) {

    axios.get('https://bestmusicmapapi.herokuapp.com/mapped_songs')
      .then(function(response) {
        console.log("response from own API");
        console.log(response);
        callback(response);
      }.bind(this))
      .catch(function(error) {
        console.log(error);
        this.setState({
          isLoading: false,
          error: true
        })
      }.bind(this))

    // axios.get('https://178.62.2.218/api/todos')
    //   .then(function(response) {
    //     console.log("From Digital Ocean: ");
    //     console.log(response);
    //   })
    //   .catch(function(error) {
    //     this.setState({
    //       isLoading: false,
    //       error: true
    //     })
    //   }.bind(this))
  }

  // Sets the user's position to state.
  ourSetPosition(position) {

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
    controlUI.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
    controlUI.style.height = '23px';
    controlUI.style.width = '23px';
    controlUI.style.marginRight = '12px';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '5px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function() {
      map.setCenter(this.state.pos);
      map.setZoom(15);
    }.bind(this));

  }

  setClusters() {
    this.markerCluster = new MarkerClusterer(this.map, this.mapMarkers,
      {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      }
    );
    console.log(this.markerCluster);
    google.maps.event.addListener(this.markerCluster, 'clusterclick', function(cluster) {
      // cluster.getCenter();
      // cluster.getSize();
      if (this.map.getZoom() >= 21) {
        var markers = cluster.getMarkers();
        console.log(markers);
        var contentString = "";
        markers.map(function(marker) {
          console.log(marker.id);
          var infowindowOfMarker = this.infowindows[marker.id];
          var contentStringOfMarker = infowindowOfMarker.content;
          // contentString += "<p>";
          // contentString += marker.title;
          // contentString += "</p>";
          contentString += contentStringOfMarker;
        }.bind(this))
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        infowindow.open(this.map, markers[0]);
      }
    }.bind(this));
  }

  //Search bar for genres
  removeMarkers() {
    for(var i=0; i<this.mapMarkers.length; i++) {
      this.mapMarkers[i].setMap(null)
    }
    this.mapMarkers=[];
    this.markerCluster.clearMarkers();
    // this.markerCluster.setMap(null);
  }

  setMatchingTimeAfterCheckingGenres(currentTime, childSnapshot) {
    // Check time filter
    switch(this.state.timeFilter) {
      case 'Latest Year':
        if(currentTime.getTime() - childSnapshot.val().unixtime < 31540000000){
          this.setMarkers(this.map, childSnapshot.val());
        }
        break;
      case 'Latest Month':
        if(currentTime.getTime() - childSnapshot.val().unixtime < 2628000000){
          this.setMarkers(this.map, childSnapshot.val());
        }
        break;
      case 'Latest Week':
        if(currentTime.getTime() - childSnapshot.val().unixtime < 604800000){
          this.setMarkers(this.map, childSnapshot.val());
        }
        break;
      case 'Latest Day':
        if(currentTime.getTime() - childSnapshot.val().unixtime < 86400000){
          this.setMarkers(this.map, childSnapshot.val());
        }
        break;
      case 'All':
        this.setMarkers(this.map, childSnapshot.val());
    }
  }

  setMatchingGenres(searchingGenre){
    this.setState({
      genreFilter: searchingGenre
    })

    var currentTime = new Date();

    firebase.database().ref('/marker').once('value').then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        // console.log(childSnapshot.key);
        // Check genre filter
        // If genres is not empty
        if (childSnapshot.val().genres != undefined) {
          var matchesGenre = false;
          childSnapshot.val().genres.map(function(genre){

            if(genre.includes(searchingGenre)){
              matchesGenre = true;
            }
          }.bind(this))
          if (matchesGenre) {
            this.setMatchingTimeAfterCheckingGenres(currentTime, childSnapshot);
          }
        // If genres is empty
        } else {
          this.setMatchingTimeAfterCheckingGenres(currentTime, childSnapshot);
        }

      }.bind(this))

      this.setClusters();

    }.bind(this));
  }

  filterSnapshotAndMap(snapshot, currentTime, timeInterval) {
    snapshot.forEach(function(childSnapshot) {
      //Check time filter
      if(currentTime.getTime() - childSnapshot.val().unixtime < timeInterval){
        // If genres is not empty
        if (childSnapshot.val().genres != undefined) {
          // Check genre filter
          var matchesGenre = false;
          childSnapshot.val().genres.map(function(genre){
            if(genre.includes(this.state.genreFilter)){
              matchesGenre = true;
            }
          }.bind(this))
          if (matchesGenre) {
            this.setMarkers(this.map, childSnapshot.val());
          }
        // If genre is empty
        } else {
          this.setMarkers(this.map, childSnapshot.val());
        }
      }
    }.bind(this))
  }

  setMatchingTime(searchingTime){
    this.setState({
      timeFilter: searchingTime
    })

    firebase.database().ref('/marker').once('value').then(function(snapshot) {
      var currentTime = new Date();
      switch(searchingTime) {
        case 'Latest Year':
          this.filterSnapshotAndMap(snapshot, currentTime, 31540000000);
          break;
        case 'Latest Month':
          this.filterSnapshotAndMap(snapshot, currentTime, 2628000000);
          break;
        case 'Latest Week':
          this.filterSnapshotAndMap(snapshot, currentTime, 604800000);
          break;
        case 'Latest Day':
          this.filterSnapshotAndMap(snapshot, currentTime, 86400000);
          break;
        case 'All':
          this.filterSnapshotAndMap(snapshot, currentTime, currentTime.getTime());
      }
      this.setClusters();

    }.bind(this));
  }
  handleSubmit(searchingValue, searchingType){
    this.removeMarkers();
    if(searchingType == 'Genre'){
      this.setMatchingGenres(searchingValue);
    } else {
      this.setMatchingTime(searchingValue);
    }
  }

  logOut(){
    //AuthenticationClient.clearCookies(getApplication());
    this.cookies.set('atlastune_refresh_token','')
    console.log(this.cookies.get('atlastune_refresh_token'));
    this.setState={
    oauthDetails: {access_token: '', refresh_token: ''},
    isLoggedIn: false
    }
    window.location.href="/#"
    console.log('hello');
  }

  getNewAccessToken(callback, refresh_token) {
    axios({
      method: 'get',
      url: '/refresh_token',
      params: {
        refresh_token: refresh_token
      }
    }).then(function(response) {
      var access_token = response.data.access_token;
      console.log(response.data);
      window.location.replace(`/#/${access_token}/${refresh_token}`);
      this.setState({
        oauthDetails: {
          access_token: access_token,
          refresh_token: refresh_token
        }
      }, () => callback())
    }.bind(this))
  }

  getAllData(callback) {
    // console.log(this.state.oauthDetails.access_token);

    axios.all([this.getCurrentSongData(), this.getUserData(), this.getMappedSongsData(function(response) {
      var markerCounter = 0;
      // Read data from our backend and set to map
      for (var index in response.data) {
        var song = response.data[index];
        this.setMarkers(this.map, song);
        markerCounter += 1;
      }
      callback(markerCounter);
      this.setClusters();
    }.bind(this))])
      .then(axios.spread(function(acct, perms) {
        this.setState({
          dataLoading: false
        }, () => {
          if (this.state.mapLoading === false) {
            this.setState({
              isLoading: false
            })
          }
        })
      }.bind(this)));
  }

  // Slider functions

  extend(a, b) {
    for(var key in b) {
      if(b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  }

  each(collection, callback) {
    for (var i = 0; i < collection.length; i++) {
      var item = collection[i];
      callback(item);
    }
  }

  openSlider(body, wrapper, menu, mask, menuOpeners) {
    body.classList.add('has-active-menu');
    wrapper.classList.add('has-' + 'slide-left');
    menu.classList.add('is-active');
    mask.classList.add('is-active');
    this.disableMenuOpeners(menuOpeners);
  }

  closeSlider(body, wrapper, menu, mask, menuOpeners) {
    body.classList.remove('has-active-menu');
    wrapper.classList.remove('has-' + 'slide-left');
    menu.classList.remove('is-active');
    mask.classList.remove('is-active');
    this.enableMenuOpeners(menuOpeners);
  }

  disableMenuOpeners(menuOpeners) {
    this.each(menuOpeners, function(item) {
      item.disabled = true;
    });
  }

  enableMenuOpeners(menuOpeners) {
    this.each(menuOpeners, function(item) {
      item.disabled = false;
    });
  }

  // End slider functions

  componentDidMount() {
    console.log("component did mount");

    // Slider
    var body = document.body;
    var wrapper = document.querySelector('#o-wrapper');
    var mask = document.querySelector('#c-mask');
    var menu = document.querySelector('#c-menu--' + 'slide-left');
    var closeBtn = menu.querySelector('.c-menu__close');
    var menuOpeners = document.querySelectorAll('.c-button');

    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      this.closeSlider(body, wrapper, menu, mask, menuOpeners);
    }.bind(this));

    // Event for clicks on the mask.
    mask.addEventListener('click', function(e) {
      e.preventDefault();
      this.closeSlider(body, wrapper, menu, mask, menuOpeners);
    }.bind(this));

    var slideLeftBtn = document.querySelector('#c-button--slide-left');

    slideLeftBtn.addEventListener('click', function(e) {
      e.preventDefault;
      this.openSlider(body, wrapper, menu, mask, menuOpeners);
    }.bind(this));

    var aboutButton = document.querySelector('.aboutButton');
    aboutButton.addEventListener('click', function(e) {
      e.preventDefault;
      this.closeSlider(body, wrapper, menu, mask, menuOpeners);
    }.bind(this))

    // End slider

    // var menu = require('../js/menu.js');

    // Spotify
    var access_token = this.props.routeParams.access_token,
        refresh_token = this.props.routeParams.refresh_token,
        error = this.props.routeParams.error

    this.cookies.set('atlastune_refresh_token', refresh_token);
    console.log(this.cookies.get('atlastune_refresh_token'));

    if (error) {
      alert('There was an error during the authentication');
    } else {
      if (access_token != '') {

        var tokenLastTime = new Date().getTime();
        // Get a new access token every ~15 minutes, since they expire.
        setInterval(function() {
          console.log("900000 ms passed");
          var currentTime = new Date().getTime();
          var minutesSinceLast = ((currentTime - tokenLastTime) / 1000)/60
          console.log("New access key, minutes since last: " + minutesSinceLast);
          this.getNewAccessToken(function() {
            console.log("new access token gotten: " + this.state.oauthDetails.access_token);
          }.bind(this), refresh_token);
          tokenLastTime = currentTime;
        }.bind(this), 900000)
        // 1800000 ms = 30 min

        var markerCounter = 0;
        // Read data from our backend and set to map
        // this.getMappedSongsData(function(response) {
        //   for (var index in response.data) {
        //     var song = response.data[index];
        //     this.setMarkers(this.map, song);
        //     markerCounter += 1;
        //   }
        //   this.setClusters();
        // }.bind(this));

        // Redirected from Login page since they are already signed in.
        if (access_token = 'access_token') {
          this.getNewAccessToken(function() {
            this.getAllData(function(markerCounter) {
              markerCounter = markerCounter;
            });
          }.bind(this), refresh_token);
        // Signing in first time - not redirected.
        } else {
          // Set state and get all data from Spotify API.
          var oauthDetails = {
            access_token: access_token,
            refresh_token: refresh_token
          }
          this.setState({
            oauthDetails: oauthDetails
          }, () => {
            this.getAllData(function(markerCounter) {
              markerCounter = markerCounter;
            });
          })
        }

        var songLastTime = new Date().getTime();
        // Get currently playing song every 30 sec to update
        setInterval(function() {
          this.getCurrentSongData();
          var currentTime = new Date().getTime();
          var minutesSinceLast = ((currentTime - songLastTime) / 1000)/60
          console.log("Refreshed current song, minutes since last: " + minutesSinceLast);
          songLastTime = currentTime;
        }.bind(this), 30000)

        // Creating a map
        this.map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: {lat: -34.397, lng: 150.644},
          scrollwheel: false,
          draggable: true
        });

        // Geolocation
        if (navigator.geolocation) {
          console.log("nagivator location");

          var marker;

          // On page load, get current position and center the map on that position.
          navigator.geolocation.getCurrentPosition(function(position) {

            console.log("got current position once");
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

            this.ourSetPosition(position);
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            var image = {
              url: positionIcon,
              // The origin for this image is (0, 0).
              origin: new google.maps.Point(0, 0),
              // The anchor for this image is the base of the flagpole at (0, 32).
              anchor: new google.maps.Point(39, 39)
            };
            // console.log(markerCounter);
            marker = new google.maps.Marker({
              position: pos,
              map: this.map,
              icon: image,
              zIndex: markerCounter + 1,
              optimized: false
            });

            this.map.setCenter(pos)


          }.bind(this), function(error) {
            //this.handleLocationError(true, infoWindow, this.map.getCenter());
            console.log(error);
            this.setState({
              isLoading: false,
              mapError: true
            })
          }.bind(this), {
            enableHighAccuracy: true
          });

          //Watch the user's position without centering the map each time.
          this.watchId = navigator.geolocation.watchPosition(function(position) {
            console.log("watch position");
            this.ourSetPosition(position);
            marker.setPosition({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            })
          }.bind(this), function() {


          }.bind(this), {
            enableHighAccuracy: true
          });

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

      } else {
          // Redirect user to login page - don't really know if this works cause I dunno how to test it
          //window.location.href = '#/';
      }
    }
    // console.log(this.cookies.get('atlastune_refresh_token'));
    // console.log(this.state.oauthDetails.access_token);
  }

  componentWillUnmount() {
    // console.log("component will unmount");
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    return (

      <div className="wrapperWithoutBg">
        <div id="loggedin">
          <div id="user-profile">
            {this.state.isLoading ?
            <div className="loadingGif"></div> :
            <h1 className="currentlyPlaying">Currently playing: {this.state.songname}</h1>}
            {this.state.error && <p>{this.state.errorMsg}</p>}
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

                <li className="c-menu__item firstItem filterTitle"><p>Select genre</p>
                  <div><Search onSubmit={this.handleSubmit} placeholder="Search genre..."/></div>
                </li>
                <li className="c-menu__item filterTitle"><p>Select time interval</p></li>
                <div><TimeFilter onSubmit={this.handleSubmit}/></div>
                <li className="c-menu__item"><button className="btn btn-success logOutButton" onClick={this.logOut}>Log out</button></li>

                <li className="c-menu__item"><a href="/#/about" className="c-menu__link aboutButton">About</a></li>


              </ul>
            </nav>

          </div>
        </div>
      </div>

    )
  }
}


module.exports = Home;
