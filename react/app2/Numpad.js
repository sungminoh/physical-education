import React from 'react';
import { Grid, Col, Row, Button } from 'react-bootstrap';


var NumButton = React.createClass({
  propTypes: {
    size: React.PropTypes.string.isRequired,
  },
  componentWillMount(){
    this.setState({
      size: this.props.size,
    });
  },
  componentWillReceiveProps(nextProps){
    this.setState({size: nextProps.size});
  },
  getButtonStyle(size){
    var style = {display: 'inline-block'};
    if(size == 'iphone'){
      style['width'] = '20mm';
      style['height'] = '20mm';
      style['borderRadius'] = '50%';
      style['fontSize'] = '10mm';
      style['fontWeight'] = 100;
      style['background'] = 'white';
      style['marginLeft'] = '2.5mm';
      style['marginRight'] = '2.5mm';
      style['marginTop'] = '1mm';
      style['marginBottom'] = '1mm';
    }else if(size == 'galaxy'){
      style['width'] = '31.5mm';
      style['height'] = '16.8mm';
      style['borderRadius'] = '0';
      style['fontSize'] = '8mm';
      style['background'] = 'white';
      style['margin'] = 0;
    }else if(size == 'note'){
      style['width'] = '35.9mm';
      style['height'] = '19.1mm';
      style['borderRadius'] = '0';
      style['fontSize'] = '9mm';
      style['background'] = 'white';
      style['margin'] = 0;
    }
    return style;
  },
  render(){
    var buttonStyle = this.getButtonStyle(this.state.size);
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
    if (this.props.num === '' ) buttonStyle['visibility'] = 'hidden';
    var num;
    var imgStyle = {};
    if (this.props.numpadSize == 'iphone') imgStyle['width'] = '100%';
    else imgStyle['height'] = '100%';
    if (this.props.num == 'call'){
      num = <img id='call' src='../static/call2.png' style={imgStyle}/>
    } else if(this.props.num == 'video'){
      num = <img id='video' src='../static/video.png' style={imgStyle}/>
    } else {
      num = this.props.num;
    }
    return (
      <Button
        className={className}
        id={id}
        style={buttonStyle}>
        {num}
      </Button>
    );
  }
});


var Numpad = React.createClass({
  propTypes: {
    size: React.PropTypes.string.isRequired,
  },
  numbers: null,
  componentWillMount(){
    this.setState({ size: this.props.size, });
    this.numbers = [
      [1,2,3],
      [4,5,6],
      [7,8,9]
      //['\u2709','\u260E','\u2630']
      //['', 'call', '']
    ];
    if(this.props.size == 'iphone'){
      this.numbers.push(['call', '0', '']);
    }else{
      this.numbers.push(['\u2732',0,'#'], ['video', 'call', '\u2630']);
    }
  },
  componentWillReceiveProps(nextProps){
    this.setState({size: nextProps.size});
  },
  makeNumButtons(numbers, size){
    var rowStyle = {textAlign: 'center', margin: 'auto'};
    if(size == 'iphone'){
      rowStyle['width'] = '85mm';
    }else if(size == 'galaxy'){
      rowStyle['width'] = '95mm';
    }else if(size == 'note'){
      rowStyle['width'] = '108mm';
    }
    var rows = [];
    for(var i=0; i<numbers.length; i++){
      var nums = numbers[i];
      var row = [];
      for(var j=0; j<nums.length; j++){
        var num = nums[j]
        var component = (
          <NumButton
            key = {j}
            num={num}
            size={size}
          />
        );
        row .push(component);
      }
      rows.push(
        <Row key={i}
          style={rowStyle}
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
        style={{ width: '100%', padding: 0}}>
        {this.makeNumButtons(this.numbers, this.state.size)}
      </Grid>
    )
  },
});

module.exports = Numpad;
