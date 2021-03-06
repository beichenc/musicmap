/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
// var csrf = require('csurf');

var client_id = '3481c5ebeb68422e98110dd22f644daf'; // Your client id
var client_secret = '5a02f4d8b20d467d96a58a39c59d1a13'; // Your secret
// OBS change back to http://localhost:8888/callback or the real website later when uploaded, e.g. heroku.
// var redirect_uri = 'http://192.168.1.172:8888/callback'; // Your redirect uri
var redirect_uri = 'http://localhost:8888/callback';
// var redirect_uri = 'https://bestmusicmap.herokuapp.com/callback';
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

// var csrfProtection = csrf({cookie: true});

//app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname))
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-read-playback-state';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
      show_dialog: true
    }));
});

app.get('/callback', function(req, res) {

  console.log("entered callback get");

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;
        console.log(body.expires_in);

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        // res.redirect('/#' +
        //   querystring.stringify({
        //     access_token: access_token,
        //     refresh_token: refresh_token
        //   }));
        console.log("got to redirect");
        res.redirect(`/#/${access_token}/${refresh_token}`);

        // window.sessionStorage.access_token = access_token;
        // sessionStorage.refresh_token = refresh_token;

        // set a new cookie
        // res.cookie('access_token', access_token);
        // res.cookie('refresh_token', refresh_token);
        // Read somewhere that cookies are not sent with redirect... so this won't work.

        // res.redirect('/#/home')
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {
  console.log("got to refresh token")

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  console.log(refresh_token);
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    console.log("posted refresh token")
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      var expires_in = body.expires_in;
      res.send({
        'access_token': access_token,
        'expires_in': expires_in
      });
      // Added myself
      // res.redirect(`/#/${access_token}/${refresh_token}`);
    }
  });
});

console.log('Listening on 8888');
app.listen(process.env.PORT || 8888);
