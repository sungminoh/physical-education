import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl, Button, Row } from 'react-bootstrap';

var InputForm = React.createClass({
  PropTypes: {
    onClick: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      value: 10,
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

  handleChange(e) {
    const parsedValue = parseInt(e.target.value);
    this.setState({validity: !isNaN(parsedValue) && parsedValue != 0});
    this.setState({ value: e.target.value });
  },

  startGame(){
    this.props.onClick(parseInt(this.state.value));
  },

  render() {
    return (
      <Form inline style={{margin: 10}}>
        <FormGroup validationState={this.getValidationState()} >
          <ControlLabel>횟수:</ControlLabel>
          {' '}
          <FormControl
            type='text'
            placeholder={this.state.value}
            onChange={this.handleChange}
          />
          <FormControl.Feedback/>
        </FormGroup>
        {' '}
        <Button
          onClick={this.startGame}
          disabled={!this.state.validity}
        >
          시작
        </Button>
        {this.props.additionalButtons}
      </Form>
    );
  }
});

module.exports = InputForm;
