var React = require('react')


var Body = React.createClass({
  render: function() {
    return (
      <div className="main-container">
        {this.props.children}
      </div>
    )
  }
})

module.exports = Body;
