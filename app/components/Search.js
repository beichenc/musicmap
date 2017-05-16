var React = require('react');

class Search extends React.Component {
  constructor(props){
    super(props);
    this.state={
      searchingGenre: '',
      searchingUser:''
    }
    this.handleChangeGenre = this.handleChangeGenre.bind(this);
    this.handleChangeUser = this.handleChangeUser.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  handleChangeGenre(event){
    this.setState({
      searchingGenre: event.target.value
    })
  }
  handleChangeUser(event){
    this.setState({
      searchingUser: event.target.value
    })
  }
  handleSubmit(event){
    event.preventDefault();
    this.props.onSubmit(this.state.searchingGenre, this.state.searchingUser);
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

        <li className="c-menu__item secondItem filterTitle"><p>Select genre</p></li>
        <input type='text' className="form-control searchInput" placeholder="Search Genre..." value={this.state.searchingGenre} onChange={this.handleChangeGenre}/>
        <li className="c-menu__item secondItem filterTitle"><p>Select User</p></li>
        <input type='text' className="form-control searchInput" placeholder="Search Username..." value={this.state.searchingUser} onChange={this.handleChangeUser}/>
        <button className="btn btn-success searchButton"type='submit'>Search</button>

      </form>

    )
  }
}




module.exports = Search;
