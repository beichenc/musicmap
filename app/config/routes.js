var React = require('react');
var ReactRouter = require('react-router')
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var Home = require('../components/Home');
var Body = require('../components/Body');
var hashHistory = ReactRouter.hashHistory


var routes = (
  <Router history={hashHistory}>
    <Route path="/" component={Body}>
      <IndexRoute component={Home}/>
      <Route path="/:access_token/:refresh_token" component={Home}/>
    </Route>
  </Router>
)

module.exports = routes;
