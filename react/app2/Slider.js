import React from 'react';
import Slider from 'react-rangeslider';


var Slide= React.createClass({
  getInitialState: function(){
    return {
      value: 10,
    };
  },

  handleChange: function(value) {
    this.setState({
      value: value,
    });
  },

  render: function() {
    return (
      <Slider
        value={this.value}
        orientation="vertical"
        onChange={this.handleChange}
      />
    );
  }
});

module.exports = Slide;

