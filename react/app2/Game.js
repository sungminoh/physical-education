import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'whatwg-fetch';
import distance from 'euclidean-distance'
import CountdownTimer from '../CountdownTimer';
import InputForm from './InputForm'
import Result from './Result';
import Numpad from './Numpad';
import { random, makeUrl } from '../helpers';
import { Button, Grid, Row, Col } from 'react-bootstrap';

function genPhoneNumber(){
  var regionalNumbers = [
    '02', '031', '032', '033',
    '041', '042', '043', '044', '049',
    '051', '052', '053', '054', '055',
    '061', '062', '063', '064',
    '010', '070'
  ]
  var regionalNumber = regionalNumbers[random(regionalNumbers.length)];
  var rl = regionalNumber.length;
  var phoneNumber = new Array(10);
  for(var i=0; i<rl; i++){
    phoneNumber[i] = regionalNumber[i];
  }
  for(var i=rl; i<phoneNumber.length; i++){
    phoneNumber[i] = random(10);
  }
  var phoneNumberString =
    regionalNumber + '-' +
    phoneNumber.slice(rl, rl == 2 ? rl + 4 : rl + 3).join('') + '-' +
    phoneNumber.slice(6,10).join('');
  return {
  'phoneNumberString': phoneNumberString,
  'phoneNumber': phoneNumber
  }
}


var Game = React.createClass({
  getInitialState() {
    return {
      game: false,
      countdown: false,
      targetDisplay: false,
      done: false,
      numberOfGames: 0,
      numpadSize: 50,
      numpadMaxHeight: 0,
      panelHeight: 0,
      phoneNumberString: '',
      typed: ''
    };
  },

  phoneNumber: null,
  currentIdx: null,
  numberAppeardTime: null,
  touches: null,
  touchSizes: null,
  touchDurations: null,
  touchStartTime: null,
  accuracies: null,
  delays: null,
  buttonSpec: null,
  results: [],

  componentWillMount() {
    this.phoneNumber = [];
    this.currentIdx = 0;
    this.numberAppeardTime = 0;
    this.touches = [];
    this.touchSizes = [];
    this.touchDurations = [];
    this.touchStartTime = 0;
    this.accuracies = [];
    this.delays = [];
  },

  resetComponent(){
    this.setState(this.getInitialState());
    this.componentWillMount();
    this.buttonSpec = null;
    this.results = [];
  },

  startGame(n) {
    var phoneNumberObj = genPhoneNumber();
    var phoneNumberString = phoneNumberObj.phoneNumberString;
    var phoneNumber = phoneNumberObj.phoneNumber;
    this.setState({
      game: true,
      countdown: true,
      targetDisplay: false,
      numberOfGames: n,
      phoneNumberString: phoneNumberString,
      typed: ''
    });
    this.phoneNumber = phoneNumber;
  },

  onCountdownTimerExpired(){
    this.setState({
      countdown: false,
      targetDisplay: true,
    });
  },
  nextNumber(){
    var result = {
      'phoneNumber': this.state.phoneNumberString,
      'touchDurations': this.touchDurations,
      'touchSizes': this.touchSizes,
      'accuracies': this.accuracies,
      'delays': this.delays
    }
    this.results.push(result);
    this.componentWillMount();
    var numberOfGames = this.state.numberOfGames - 1;
    if(numberOfGames > 0){
      this.startGame(numberOfGames);
    }else{
      this.endGame();
    }
  },
  hitNumberTouchStart(e) {
    // validation check
    if (!this.state.game || this.state.countdown || !this.state.targetDisplay) return;
    e.preventDefault();
    var id = e.target.id;
    // if call
    if(id == 'call' && this.currentIdx == this.phoneNumber.length){
      this.nextNumber();
      return;
    }
    // wrong case
    var className = e.target.classList[0]
    if(className == 'misc') return;
    // number case
    if(this.state.typed.length >= this.phoneNumber.length) return;
    var newTyped = this.state.typed+e.target.textContent;
    this.setState({typed: newTyped});
    // if it is not correct then return
    if(newTyped != this.phoneNumber.join('').slice(0, this.currentIdx+1)) return;
    this.currentIdx += 1;
    // delay and coordinates
    this.delays.push((Date.now() - this.numberAppeardTime)/1000.0);
    var x, y;
    if(e.type == 'touchstart'){
      x = e.targetTouches[0].clientX;
      y = e.targetTouches[0].clientY;
    }else{
      x = e.clientX;
      y = e.clientY;
    }
    this.touches.push([x, y]);
    var specs = e.target.getBoundingClientRect()
    var target_x = (specs.left + specs.right)/2
    var target_y = (specs.top + specs.bottom)/2
    if(!this.buttonSpec){
      this.buttonSpec = {'width': specs.width, 'height': specs.height};
    }
    this.accuracies.push(distance([target_x, target_y], [x, y]));
    this.touchStartTime = Date.now()
    return;
  },
  hitNumberTouchEnd(e) {
    // validation check
    if (!this.state.game || this.state.countdown || !this.state.targetDisplay) return;
    if (this.delays.length <= this.touchSizes.length) return;
    // setting touch infomation
    e.preventDefault();
    var x, y;
    if(e.type == 'touchend'){
      x = e.changedTouches[0].clientX;
      y = e.changedTouches[0].clientY;
    }else{
      x = e.clientX;
      y = e.clientY;
    }
    this.touchSizes.push(distance(this.touches[this.touches.length-1], [x, y]));
    this.touchDurations.push((Date.now() - this.touchStartTime)/1000.0);
  },
  endGame() {
    this.setState({
      game: false,
      countdown: false,
      targetDisplay: false,
      done: true
    });
  },

  redirectToHistory(e){
    this.props.router.push({ pathname: makeUrl('/app2/history') });
  },

  changeSlider(size){
    this.setState({numpadSize: size});
  },

  getInputForm(){
    if (!this.state.game && !this.state.done){
      var historyButton = (
        <Button
          onClick={this.redirectToHistory}
        >
          기록 보기
        </Button>
      );
      return (
        <InputForm
          onClick={this.startGame}
          additionalButtons={historyButton}
          defaultValue={this.state.numpadSize}
          changeSize={this.changeSlider}
        />
      );
    }else{
      return null;
    }
  },

  getPhoneNumber(){
    if (this.state.game && this.state.targetDisplay){
      var phoneNumberString = this.state.phoneNumberString;
      return (
        <div
          style={{
            height: this.state.panelHeight*0.8,
              textAlign: 'center',
              marginTop: this.state.panelHeight*0.8/2
          }}
        >
          <span
            style={{
              fontSize: 40
            }}>
            {phoneNumberString}
          </span>
        </div>
      );
    }else{
      return null;
    }
  },
  getCountdownTimer(){
    if (this.state.countdown){
      return (
        <CountdownTimer
          sec={3}
          onExpired={this.onCountdownTimerExpired}
        />
      );
    }else{
      return null;
    }
  },

  //getScore(){
  //if (this.state.game && !this.state.countdown){
  //return (
  //<Score
  ///>
  //)
  //}else{
  //return null
  //};
  //},

  getResult(){
    if(this.state.done){
      return(
        <Result
          results={this.results}
          buttonSpec={this.buttonSpec}
          reset={this.resetComponent}
        />
      )
    }else{
      return null;
    }
  },
  getNumpad(){
    if (this.state.numpadMaxHeight != 0){
      return(
        <div
          onTouchStart={this.hitNumberTouchStart}
          onMouseDown={this.hitNumberTouchStart}
          onTouchEnd={this.hitNumberTouchEnd}
          onMouseUp={this.hitNumberTouchEnd}
        >
          <Numpad
            size={this.state.numpadSize}
            maxHeight={this.state.numpadMaxHeight}
          />
        </div>
      );
    }else{
      return null;
    }
  },
  deleteTyped(){
    this.setState({typed: this.state.typed.slice(0, this.state.typed.length-1)});
  },
  getTypedNumber(){
    if (this.state.game && this.state.targetDisplay){
      var pn = this.state.phoneNumberString;
      pn = pn.split('-');
      var l = pn[0].length;
      var typed = this.state.typed;
      var typedString = typed.slice(0, l) + '-' + typed.slice(l, l+3) + '-' + typed.slice(l+3, l+7);
      return (
        <div
          style={{
            height: this.state.panelHeight*0.2,
              textAlign: 'center',
              marginTop: this.state.panelHeight*0.2/2
          }}
        >
          <span
            style={{
              fontSize: 30
            }}>
            {typedString}
          </span>
          <Button
            style={{float: 'right', position:'absolute'}}
            onClick={this.deleteTyped}>DEL</Button>
        </div>
      );
    }else{
      return null;
    }
  },
  render() {
    var inputForm = this.getInputForm();
    var result = this.getResult();
    var countdownTimer = this.getCountdownTimer();
    var phoneNumber = this.getPhoneNumber();
    //var score = this.getScore();
    var numpad = this.getNumpad();
    var typedNumber = this.getTypedNumber();

    if(!this.state.game){
      return (
        <div style={{height:'100vh'}} >
          {result}
          <div ref={(div) => this.setHeight(div)} >
            {inputForm}
          </div>
          {numpad}
        </div>
      )
    }else{
      return (
        <div style={{height:'100vh'}} >
          {countdownTimer}
          {phoneNumber}
          {typedNumber}
          {numpad}
        </div>
      )
    }
  },
  setHeight(div){
    if(!div) return;
    if(this.state.numpadMaxHeight == 0){
      var divHeight = div.getBoundingClientRect().height;
      var remainder = window.screen.height - divHeight;
      this.setState({
        numpadMaxHeight: remainder,
        panelHeight: divHeight
      })
    }
  },
  componentDidUpdate(prevProps, prevState){
    if(prevState.countdown && !this.state.countdown){
      this.numberAppeardTime = Date.now();
    }
  }
});

module.exports = Game;
