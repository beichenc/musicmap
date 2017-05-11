var React = require('react');
var styles = require('../styles/styles.css');
var musicicon = require('../images/musicicon.png');

// TODO: style the about page. Maybe some background for the text. Maybe different "sections" as you scroll down, with pictures and text.
// TODO: add some photos.

class About extends React.Component {

  render() {
    return (
      <div className="wrapperAbout">
        <div id="about">
          {/* <div className="header">
            <h1 className="aboutTitle">Music Map</h1>
          </div> */}
          <div className="col-md-12">
            <img src={musicicon} className="musicIcon"></img>
          </div>
          <div className="aboutBody col-md-8 col-md-offset-2">
            <p className="aboutText">Ever feel like you've run out of good songs to listen to? Look no further! We present to you the Music Map (Atlastune?). Our vision is to make music inspiration available anywhere, anytime. </p>
            <p className="aboutText">Join the community! To share, listen, and get inspired!</p>
            <p className="aboutText">Our upcoming features: being able to "like" songs, being able to follow users that you think have good music taste, and a news feed where you can see recently mapped songs by the people you follow!</p>
            <p className="aboutText">Have some feedback or ideas? We'd love to hear from you! Drop us an email at bestmusicmap@gmail.com, or fill in this short survey: <a className="surveyLink" target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSduK5_w-fr1Zd1-kY1RnSvpn6BSwcilxllnxQUuAF6NveTk_w/viewform?usp=sf_link">here</a>.</p>
            <p className="aboutText">&copy; Amy Chen, Beichen Chen 2017</p>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = About;
