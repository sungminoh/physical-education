import React from 'react';
import { Grid, Col, Row, Button } from 'react-bootstrap';


var NumButton = React.createClass({
  propTypes: {
    size: React.PropTypes.number.isRequired,
    maxHeight: React.PropTypes.number
  },
  componentWillMount(){
    this.setState({
      size: this.props.size,
      maxHeight: this.props.maxHeight
    });
  },
  componentWillReceiveProps(nextProps){
    this.setState({size: nextProps.size});
  },
  render(){
    var circleStyle = {
      width: this.state.size,
      height: this.state.size,
      maxWidth: '100%',
      maxHeight: this.state.maxHeight,
      fontSize: Math.min(this.state.size, this.state.maxHeight)/2,
      borderRadius: '50%'
    };
    var id = this.props.num;
    var className = 'misc';
    if(id == '\u2732'){
      id = 'asterisk';
      className = 'num';
    }else if(id =='#'){
      id = 'sharp';
      className = 'num';
    }else if(id == '\u2709'){
      id = 'message';
    }else if(id == '\u260E'){
      id = 'call';
    }else if(id == '\u2630'){
      id = 'misc';
    }else{
      className = 'num';
    }
    return (
      <Button
        className={className}
        id={id}
        style={circleStyle}>
        {this.props.num}
      </Button>
    );
  }
});


var Numpad = React.createClass({
  propTypes: {
    size: React.PropTypes.number.isRequired,
    maxHeight: React.PropTypes.number
  },
  numbers: null,
  componentWillMount(){
    this.setState({
      size: this.props.size,
      maxHeight: this.props.maxHeight
    });
    this.numbers = [
      [1,2,3],
      [4,5,6],
      [7,8,9],
      ['\u2732',0,'#'],
      ['\u2709','\u260E','\u2630']
    ]
  },
  componentWillReceiveProps(nextProps){
    this.setState({size: nextProps.size});
  },
  makeNumButtons(numbers, size){
    var rows = [];
    var rowMaxHeight = this.state.maxHeight*0.8/numbers.length;
    for(var i=0; i<numbers.length; i++){
      var nums = numbers[i];
      var row = [];
      for(var j=0; j<nums.length; j++){
        var num = nums[j]
        var component = (
          <Col key={j} xs={4}
            style={{
              textAlign: j==0 ? 'right' : j==1 ? 'center' : 'left',
                padding: 0,
                maxHeight: rowMaxHeight
            }}>
            <NumButton
              num={num}
              size={size}
              maxHeight={rowMaxHeight}
            />
          </Col>
        );
        row .push(component);
      }
      rows.push(
        <Row
          key={i}
          style={{maxHeight: rowMaxHeight}}
        >
          {row}
        </Row>
      );
    }
    return rows;
  },
  render(){
    return (
      <Grid
        style={{
          position: 'absolute',
            width: '100%',
            maxHeight: this.state.maxHeight*0.8,
            bottom: this.state.maxHeight*0.1,
        }}>
        {this.makeNumButtons(this.numbers, this.state.size)}
      </Grid>
    )
  },
});

module.exports = Numpad;
