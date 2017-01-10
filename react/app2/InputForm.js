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
      numpadSize: this.props.defaultValue,
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
    this.setState({ numpadSize: e.target.value });
  },

  startGame(){
    this.props.onClick(this.state.numberOfGames, this.state.numpadSize);
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
          <select value={this.state.numpadSize} onChange={this.changeSize}>
            <option value='iphone'>아이폰5s</option>
            <option value='galaxy'>갤럭시S5</option>
            <option value='note'>갤럭시노트5</option>
          </select>
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
