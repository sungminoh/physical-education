import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

var InputForm = React.createClass({
  PropTypes: {
    onClick: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      value: 10
    };
  },

  isValid(){
    const value = this.state.value;
    return value.length == 0 || !isNaN(parseInt(value))
  },

  getValidationState() {
    if (this.isValid()){
      return 'success';
    }else{
      return 'error';
    }
  },

  handleChange(e) {
    this.setState({ value: e.target.value });
  },

  handleClick(){
    this.props.onClick(parseInt(this.state.value));
  },

  render() {
    return (
      <Form inline>
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
          onClick={this.handleClick}
          disabled={!this.isValid()}
        >
          시작
        </Button>
      </Form>
    );
  }
});

module.exports = InputForm;
