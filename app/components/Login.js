var React = require('react');
var styles = require('../styles/styles.css');

class Login extends React.Component {

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
