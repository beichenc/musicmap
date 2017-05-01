var React = require('react');

class Search extends React.Component {
  constructor(props){
    super(props);
    this.state={
      input: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  handleChange(event){
    this.setState({
      input: event.target.value
    })
  }
  handleSubmit(event){
    event.preventDefault();
    this.props.onSubmit(this.state.input, 'Genre');
  }
  handleKeyUp(event){
    event.preventDefault();
    if(event.keyCode==13){
      this.props.onSubmit(this.state.input);
    }
  }
  render(){
    return (
      <form onSubmit={this.handleSubmit}>
      <input type='text' className="form-control" placeholder={this.props.placeholder} value={this.state.input} onChange={this.handleChange} onKeyUp={this.handleKeyUp}/>
      <button type='submit'>Search</button>
      </form>
    )
  }
}




module.exports = Search;
