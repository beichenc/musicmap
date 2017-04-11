//var imageUrl = 'https://s-media-cache-ak0.pinimg.com/originals/43/39/9a/43399abcefa8b2b516b08921e2054a9e.jpg'
var imageUrl = require('../images/record.jpg');

var styles = {

  customButtonSLogIn: {
    marginTop: '100px',
    background: 'none',
    borderRadius: '24px',
    //border: '2px solid #00C851'
  },

  customButtonLLogIn: {
    marginTop: '50px',
    background: 'none',
    borderRadius: '24px',
    //border: '2px solid #00C851'
  },

  customButtonModal: {
    //background: '#424242',
    borderRadius: '24px',
    // color: 'white'
  },

  transparentBg: {
    background: 'transparent'
  },
  space: {
    marginTop: '25px'
  },

  body: {
    textAlign: 'center',
    backgroundImage: "url(" + imageUrl + ")",
    height: '100%',
    width: '100%',
    // backgroundColor: '#252525',
    margin: '0',
    position: 'fixed',
    color: 'white',
    //fontFamily: 'Quicksand',
    fontFamily: 'Open Sans'
  },

  modal: {
    fontFamily: 'Open Sans',
    color: '#424242'
  },

  modalColor: {
    backgroundColor: '#9e9e9e',
    color: "white"
  },

  textAlignCenter: {
    textAlign: 'center'
  },

  textOverflow: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '500px'
  },

  displayNone: {
    display: 'none'
  },

  marginTop100: {
    marginTop: '100px'
  },

  height100: {
    height: '100%',
    margin: '0'
  },

  marginTop50: {
    marginTop: '50px'
  },

  popupLink: {
    display: 'block',
    marginTop: '20px',
    cursor: 'pointer'
  }
}

module.exports = styles;
