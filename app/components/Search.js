var React = require('react');

class Search extends React.Component {
  constructor(props){
    super(props);
    this.state={
      searchingGenre: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  handleChange(event){
    this.setState({
      searchingGenre: event.target.value
    })
  }
  handleSubmit(event){
    event.preventDefault();
    this.props.onSubmit(this.state.searchingGenre, 'Genre');
  }
  // handleKeyUp(event){
  //   event.preventDefault();
  //   if(event.keyCode==13){
  //     console.log("pressed enter");
  //     this.props.onSubmit(this.state.searchingGenre, 'Genre');
  //   }
  // }
  render(){
    return (
      <form onSubmit={this.handleSubmit}>
      <input type='text' className="form-control searchInput" placeholder="Search Genre..." value={this.state.searchingGenre} onChange={this.handleChange}/>
      <button className="btn btn-success searchButton"type='submit'>Search</button>
      </form>
    )
  }
}




module.exports = Search;
