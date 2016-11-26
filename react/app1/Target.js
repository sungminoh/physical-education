import React from 'react';
import distance from 'euclidean-distance';
import { random } from './helpers';

var Target = React.createClass({
  propTypes: {
    left: React.PropTypes.string.isRequired,
    top: React.PropTypes.string.isRequired,
    width: React.PropTypes.number.isRequired,
    callback: React.PropTypes.func.isRequired
  },
  setCoordinates(dom){
    if(!dom) return;
    var specs = dom.getBoundingClientRect();
    this.props.callback([(specs.left+specs.right)/2, (specs.top+specs.bottom)/2, specs.width]);
  },
  render() {
    var circleStyle = {
      position: 'relative',
      left: this.props.left,
      top: this.props.top,
      cursor: 'pointer',
      borderStyle: 'solid',
      borderColor: '#f00',
      width: this.props.width,
      height: this.props.width,
      marginLeft: -this.props.width/2,
      marginTop: -this.props.width/2,
      borderRadius: '50%'
    };
    var horizentalStyle = {
      position: 'relative',
      left: '50%',
      top: '50%',
      borderWidth: '1px 0px 1px 0px',
      borderStyle: 'solid',
      borderColor: '#f00',
      width: this.props.width*1.3,
      height: 0,
      marginTop: -1,
      marginLeft: -(this.props.width*1.3)/2,
    };
    var verticalStyle = {
      position: 'relative',
      left: '50%',
      top: '50%',
      borderWidth: '0px 1px 0px 1px',
      borderStyle: 'solid',
      borderColor: '#f00',
      height: this.props.width*1.3,
      width: 0,
      marginLeft: -1,
      marginTop: -(this.props.width*1.3)/2,
    };
    return (
      <div
        className="target"
        style={circleStyle}
        ref={(div) => this.setCoordinates(div)} >
        <div
          className="target"
          style={horizentalStyle}/>
        <div
          className="target"
          style={verticalStyle}/>
      </div>
    );
  },
});

module.exports = Target;
