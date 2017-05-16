var React = require('react');
var Search = require('./Search.js');

class Filters extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      searchingGenre: "",
      searchingUser: "",
      searchingTime: "All"
    }
  }

  handleTime(searchingTime) {
    this.setState({
      searchingTime: searchingTime
    }, () => {
      this.props.onSubmit(this.state.searchingGenre, this.state.searchingUser, this.state.searchingTime);
    })
  }

  handleSearch(searchingGenre, searchingUser){
    this.setState({
      searchingGenre: searchingGenre,
      searchingUser: searchingUser
    }, () => {
      this.props.onSubmit(this.state.searchingGenre, this.state.searchingUser, this.state.searchingTime);
    })
  }

  render(){
    <form onSubmit={this.handleSearch}>
      <TimeFilter onSubmit={this.handleTime}/>
      <Search onChange={this.handleSearch}/>
      <button className="btn btn-success searchButton"type='submit'>Search</button>
    </form>
  }
}
