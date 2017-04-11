var Redux = require('redux');
const { combineReducers } = Redux;
var accountDetailsReducer = require('./accountDetailsReducer');

const musicMapReducer = combineReducers({
  accountDetailsReducer
})

module.exports = musicMapReducer;
