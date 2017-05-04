var React = require('react');
var styles = require('../styles/styles.css');
import Cookies from 'universal-cookie';

class Login extends React.Component {
  componentWillMount() {
    const cookies = new Cookies();
    var refresh_token = cookies.get('atlastune_refresh_token')
    if(refresh_token) {
      window.location.href=`/#/access_token/${refresh_token}`
    }
  }

  render() {
    return (
      <div className="wrapper">
        <div id="login">
          <h1 className="loginElement">Log in with your Spotify account</h1>
          <a href="/login" className="btn btn-lg btn-success customButtonSLogIn">Log in</a>
        </div>
      </div>
    )
  }
}

module.exports = Login;
