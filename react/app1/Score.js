import React from 'react';

var Score = React.createClass({
  propTypes: {
    delay: React.PropTypes.number,
    accuracy: React.PropTypes.number,
    numberOfGames: React.PropTypes.number,
    count: React.PropTypes.number
  },
  render: function () {
    var delay = this.props.delay;
    var accuracy = this.props.accuracy;
    if (delay){
      delay = delay.toFixed(2);
      accuracy = accuracy.toFixed(2);
    }
    return (
      <ul>
        <li>반응시간 : {delay} sec</li>
        <li>정확도 : {accuracy} pixels</li>
        <li>회수 : {this.props.count}/{this.props.numberOfGames}</li>
      </ul>
    );
  }
});

module.exports = Score;
