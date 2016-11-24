import React from 'react';

var style = {
  position: 'fixed',
  textAlign: 'center',
  bottom: '50%',
  right: '50%',
  opacity: 0.5,
  zIndex: 99,
  fontSize: 100,
  color: 'black'
}

var CountdownTimer = React.createClass({
  getInitialState: function() {
    return {
      sec: 3
    };
  },
  propTypes: {
    onExpired: React.PropTypes.func.isRequired,
    sec: React.PropTypes.number
  },
  tick: function() {
    this.setState({sec: this.state.sec - 1});
    if (this.state.sec <= 0) {
      clearInterval(this.interval);
      this.props.onExpired();
    }
  },
  componentDidMount: function() {
    this.setState({sec: this.props.sec});
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function(prevProps, prevState) {
    clearInterval(this.interval);
  },
  render: function() {
    return (
      <div
        style={style}>
        {this.state.sec}
      </div>
    );
  }
});

module.exports = CountdownTimer;
