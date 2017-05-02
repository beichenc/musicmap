<<<<<<< HEAD
var React = require('react');

class TimeFilter extends React.Component {
  constructor(props){
  super(props);
  this.state={
    time:''
  }
  this.handleChange=this.handleChange.bind(this);
  }
  handleChange(){
    this.setState({
      time: event.target.value
    })
    this.props.onSubmit(event.target.value, 'Time');
  }
  render(){
    return (
      <select className='form-control' onChange={this.handleChange}>
        <option value='All'>All</option>
        <option value='Latest Day'>Latest Day</option>
        <option value='Latest Week'>Latest Week</option>
        <option value='Latest Month'>Latest Month</option>
        <option value='Latest Year'>Latest Year</option>
      </select>
    )
  }
}
module.exports = TimeFilter;
=======
>>>>>>> parent of e03c0d5... added filter by chosen time interval
