
const accountDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_ACCOUNT_DETAILS':
      return action.accountDetails;
    default:
      return state;
  }
}

module.exports = accountDetailsReducer;
