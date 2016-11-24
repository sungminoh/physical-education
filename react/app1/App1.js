import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'whatwg-fetch';
import distance from 'euclidean-distance'
import CountdownTimer from './CountdownTimer';
import Display from './Display';
import Target from './Target';
import InputForm from './InputForm'
import Score from './Score';
import Result from './Result';
import { random } from './helpers';
import { clone } from './helpers';
import { Button, Grid, Row, Col } from 'react-bootstrap';


var App1 = React.createClass({
  getInitialState() {
    return {
      game: false,
      countdown: false,
      targetDisplay: false,
      done: false,
      targetAppearedTime: 0,
      numberOfGames: 0,
      count: 0
    };
  },

  countdownTimer: null,
  target: null,
  targetPositions: null,
  targetRadii: null,
  delays: null,
  touches: null,
  accuracies: null,
  durations: null,

  componentWillMount() {
    this.targetPositions = [];
    this.targetRadii = [];
    this.touches = [];
    this.accuracies = [];
    this.delays = [];
    this.durations = [];
  },

  resetComponent(){
    this.setState(this.getInitialState());
    this.componentWillMount();
  },

  startGame(n) {
    this.setState({
      game: true,
      countdown: true,
      numberOfGames: n
    });
  },

  onCountdownTimerExpired(){
    this.setState({
      countdown: false,
      targetDisplay: true,
      targetAppearedTime: Date.now()
    });
  },

  hitTarget(e) {
    // validation check
    if (!this.state.game || this.state.countdown || !this.state.targetDisplay) {return};
    // setting touch infomation
    var x = e.clientX;
    var y = e.clientY;
    this.touches.push([x, y]);
    this.accuracies.push(distance(this.targetPositions[this.targetPositions.length-1], [x, y]));
    this.delays.push(Date.now() - this.state.targetAppearedTime);
    // hide target for a while
    var nextCount = this.state.count + 1
    this.setState({
      targetDisplay: false,
      count: nextCount
    });
    // if game is done
    if(nextCount == this.state.numberOfGames){
      this.endGame();
      return;
    }
    // display target after for a while
    setTimeout(function(){
      this.setState({
        targetDisplay: true,
        targetAppearedTime: Date.now()
      });
    }.bind(this), 500);
  },

  endGame() {
    this.setState({
      game: false,
      countdown: false,
      targetDisplay: false,
      done: true
    });
  },

  getInputForm(){
    if (!this.state.game && !this.state.done){
      return (
        <InputForm
          onClick={this.startGame}
          />
      );
    }else{
      return null;
    }
  },

  getButton(){
    if (!this.state.game){
      return (
        <Button
          onClick={this.startGame}
          bsStyle='primary'
          bsSize="large"
        >
          New Game
        </Button>
      );
    }else{
      return null;
    }
  },

  getTarget(){
    if (this.state.game && this.state.targetDisplay){
      var left = random(100) + '%'
      var top = random(100) + '%'
      var width = 100 * Math.pow(0.8, this.state.count)
      var set
      return (
        <Target
          className='target'
          left={left}
          top={top}
          width={width}
          callback={this.setTargetCoordinate}
        />
      );
    }else{
      return null;
    }
  },
  setTargetCoordinate(coordinate){
    var [x, y, r] = coordinate;
    this.targetPositions.push([x, y]);
    this.targetRadii.push(r/2);
  },

  getCountdownTimer(){
    if (this.state.countdown){
      return (
        <CountdownTimer
          sec={0}
          onExpired={this.onCountdownTimerExpired}
        />
      );
    }else{
      return null;
    }
  },

  getScore(){
    if (this.state.game && !this.state.countdown){
      return (
        <Score
          delay={this.delays[this.delays.length-1]}
          accuracy={this.accuracies[this.accuracies.length-1]}
          numberOfGames={this.state.numberOfGames}
          count={this.state.count}
        />
      )
    }else{
      return null
    };
  },

  getResult(){
    if(this.state.done){
      return(
        <Result
          targetPositions={this.targetPositions}
          targetRadii={this.targetRadii}
          accuracies={this.accuracies}
          delays={this.delays}
          count={this.state.count}
          reset={this.resetComponent}
        />
      )
    }else{
      return null;
    }
  },

  render() {
    var inputForm = this.getInputForm();
    var target = this.getTarget();
    var countdownTimer = this.getCountdownTimer();
    var score = this.getScore();
    var result = this.getResult();

    return (
      <div style={{height:'100%', padding:'10px 10px 10px 10px'}}>
        {result}
        <div>
          {inputForm}
          {score}
        </div>
        <div
          className="canvas"
          style={{width:'100%', height:'100%', minHeight:'100%', padding:'10px 10px 10px 10px'}}
          onClick={this.hitTarget}>
          {countdownTimer}
          {target}
        </div>
      </div>
    );
  }
});

export default App1;
