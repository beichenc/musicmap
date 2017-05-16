
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
    this.props.onSubmit(event.target.value);
  }
  render(){
    return (
      <div>
        <li className="c-menu__item firstItem filterTitle"><p>Select time interval</p></li>

        <select className='form-control timeDropdown' onChange={this.handleChange}>
          <option value='All'>All</option>
          <option value='86400000'>Latest Day</option>
          <option value='604800000'>Latest Week</option>
          <option value='2628000000'>Latest Month</option>
          <option value='31540000000'>Latest Year</option>
        </select>
      </div>
    )
  }
}
module.exports = TimeFilter;
