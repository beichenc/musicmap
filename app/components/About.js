var React = require('react');
var styles = require('../styles/styles.css');

// TODO: style the about page. Maybe some background for the text. Maybe different "sections" as you scroll down, with pictures and text.
// TODO: add some photos.

class About extends React.Component {

  render() {
    return (
      <div className="wrapperWithoutBg">
        <div id="about">
          <h1 className="aboutUs">About</h1>
          <p className="aboutText">Ever feel like you've run out of good songs to listen to? Look no further! We present to you the Music Map (Atlastune?). Our vision is to make music inspiration available anywhere, anytime. </p>
          <p className="aboutText">Join the community! To share, listen, and get inspired!</p>
          <p className="aboutText">Our upcoming features: being able to "like" songs, being able to follow users that you think have good music taste, and a news feed where you can see recently mapped songs by the people you follow!</p>
          <p className="aboutText">Have some feedback or ideas? We'd love to hear from you! Drop us an email at bestmusicmap@gmail.com</p>
        </div>
      </div>
    )
  }
}

module.exports = About;
