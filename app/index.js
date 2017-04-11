var React = require('react');
var ReactDOM = require('react-dom');
var Home = require('./components/Home')
var routes = require('./config/routes')

ReactDOM.render(
  routes,
  document.getElementById('app')
)
