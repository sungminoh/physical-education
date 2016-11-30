import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl, Button, Row } from 'react-bootstrap';

require('rc-slider/assets/index.css');
import Rcslider from 'rc-slider';


var InputForm = React.createClass({
  PropTypes: {
    onClick: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      numberOfGames: 3,
      size: 70,
      validity: true
    };
  },

  getValidationState() {
    if (this.state.validity){
      return 'success';
    }else{
      return 'error';
    }
  },

  changeNumber(e) {
    const parsedNumberOfGames = parseInt(e.target.value);
    this.setState({validity: !isNaN(parsedNumberOfGames) && parsedNumberOfGames != 0});
    this.setState({ numberOfGames: e.target.value});
  },

  changeSize(e) {
    const parsedSize = parseInt(e);
    this.setState({validity: !isNaN(parsedSize) && parsedSize != 0});
    this.setState({ size: e });
    this.props.changeSize(e);
  },

  startGame(){
    this.props.onClick(parseInt(this.state.numberOfGames));
  },

  render() {
    return (
      <Form style={{margin: 10}}>
        <FormGroup validationState={this.getValidationState()} >
          <ControlLabel>횟수:</ControlLabel>
          {' '}
          <FormControl
            type='number'
            placeholder={this.state.numberOfGames}
            onChange={this.changeNumber}
          />
          <FormControl.Feedback/>
        </FormGroup>
        {' '}
        <FormGroup validationState={this.getValidationState()}>
          <ControlLabel>크기:</ControlLabel>
          {' '}
          <Rcslider
            min={10}
            max={100}
            defaultValue={this.props.defaultValue}
            onChange={this.changeSize}/>
        </FormGroup>
        {' '}
        <Button
          onClick={this.startGame}
          disabled={!this.state.validity}
        >
          시작
        </Button>
        {' '}
        {this.props.additionalButtons}
      </Form>
    );
  }
});

module.exports = InputForm;
