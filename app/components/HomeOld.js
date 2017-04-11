var React = require('react')

var Home = React.createClass({

  getInitialState: function() {
    return {
      accountDetails: {},
      oauthDetails: {}
    }
  },
  componentDidMount: function() {

    var that = this

    /**
     * Obtains parameters from the hash of the URL
     * @return Object
     */
    function getHashParams() {
      var hashParams = {};
      var e, r = /([^&;=]+)=?([^&;]*)/g,
          q = window.location.hash.substring(1);
      while ( e = r.exec(q)) {
         hashParams[e[1]] = decodeURIComponent(e[2]);
      }
      return hashParams;
    }


    var params = getHashParams();

    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;

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

        $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {

              that.setState({
                accountDetails: response
              })

              $('#login').hide();
              $('#loggedin').show();
            }
        });
      } else {
          // render initial screen
          $('#login').show();
          $('#loggedin').hide();
      }

      document.getElementById('obtain-new-token').addEventListener('click', function() {
        $.ajax({
          url: '/refresh_token',
          data: {
            'refresh_token': refresh_token
          }
        }).done(function(data) {
          access_token = data.access_token;
          that.setState({
            oauthDetails: {
              access_token: access_token,
              refresh_token: refresh_token
            }
          })
        });
      }, false);
    }
  },
  render: function() {
    return (
      <html>
        <head>
          <title>Example of the Authorization Code flow with Spotify</title>
          <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css"/>
        </head>

        <body>
          <div className="container">
            <div id="login">
              <h1>This is an example of the Authorization Code flow</h1>
              <a href="/login" className="btn btn-primary">Log in with Spotify</a>
            </div>
            <div id="loggedin">
              <div id="user-profile">
                <h1>Logged in as {this.state.accountDetails.display_name}</h1>
                <div className="media">
                  <div className="media-body">
                    <dl className="dl-horizontal">
                      <div><dt>Display name</dt><dd className="clearfix">{this.state.accountDetails.display_name}</dd></div>
                      <div><dt>Id</dt><dd>{this.state.accountDetails.id}</dd></div>
                      <div><dt>Email</dt><dd>{this.state.accountDetails.email}</dd></div>
                      {this.state.accountDetails.external_urls && <div><dt>Spotify URI</dt><dd><a href="{this.state.accountDetails.external_urls.spotify}">{this.state.accountDetails.external_urls.spotify}</a></dd></div>}
                      <div><dt>Link</dt><dd><a href="{this.state.accountDetails.href}">{this.state.accountDetails.href}</a></dd></div>
                      <div><dt>Country</dt><dd>{this.state.accountDetails.country}</dd></div>
                    </dl>
                  </div>
                </div>
              </div>
              <div id="oauth">
                <h2>oAuth info</h2>
                <dl className="dl-horizontal">
                  <div><dt>Access token</dt><dd className="text-overflow">{this.state.oauthDetails.access_token}</dd></div>
                  <div><dt>Refresh token</dt><dd className="text-overflow">{this.state.oauthDetails.refresh_token}></dd></div>
                </dl>
              </div>
              <button className="btn btn-default" id="obtain-new-token">Obtain new token using the refresh token</button>
            </div>
          </div>
        </body>
      </html>
    )
  }
})

module.exports = Home;
