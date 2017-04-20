var React = require('react');
var ReactRouter = require('react-router')
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var Home = require('../components/Home');
var Main = require('../components/Main');
var Login = require('../components/Login');
var hashHistory = ReactRouter.hashHistory


var routes = (
  <Router history={hashHistory}>
    <Route path="/" component={Main}>
      <IndexRoute component={Login}/>
      <Route path="/:access_token/:refresh_token" component={Home}/>
      <Route path="/test" component={Home}/>
    </Route>
  </Router>
)

module.exports = routes;
