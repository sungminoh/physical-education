import React from 'react';

var countdownTimerStyle = {
  position: 'relative',
  textAlign: 'center',
  margin: 'auto',
  opacity: 0.5,
  zIndex: 99,
  fontSize: 100,
  color: 'black'
}

var CountdownTimer = React.createClass({
  getInitialState() {
    return {
      sec: 3
    };
  },
  propTypes: {
    onExpired: React.PropTypes.func.isRequired,
    sec: React.PropTypes.number
  },
  tick() {
    this.setState({sec: this.state.sec - 1});
    if (this.state.sec <= 0) {
      clearInterval(this.interval);
      this.props.onExpired();
    }
  },
  componentDidMount() {
    this.setState({sec: this.props.sec});
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount(prevProps, prevState) {
    clearInterval(this.interval);
  },
  render() {
    return (
      <div
        style={countdownTimerStyle}>
        {this.state.sec}
      </div>
    );
  }
});

module.exports = CountdownTimer;
