import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'whatwg-fetch';
import distance from 'euclidean-distance'
import CountdownTimer from '../CountdownTimer';
import InputForm from './InputForm'
import Result from './Result';
import Numpad from './Numpad';
import { random, makeUrl, pxToMm } from '../helpers';
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
      numpadSize: 'galaxy',
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

  startGame(n, size) {
    var phoneNumberObj = genPhoneNumber();
    var phoneNumberString = phoneNumberObj.phoneNumberString;
    var phoneNumber = phoneNumberObj.phoneNumber;
    this.setState({
      game: true,
      countdown: true,
      targetDisplay: false,
      numberOfGames: n,
      phoneNumberString: phoneNumberString,
      numpadSize: size ? size : this.state.numpadSize,
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
    if(id == 'call' && this.state.typed == this.phoneNumber.join('')){
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
    //if(newTyped != this.phoneNumber.join('').slice(0, this.currentIdx+1)) return;
    //this.currentIdx += 1;
    if(newTyped != this.phoneNumber.join('').slice(0, newTyped.length)) return;
    this.currentIdx = newTyped.length;
    // delay and coordinates
    this.delays.push((Date.now() - this.numberAppeardTime)/1000.0);
    var x, y;
    if(e.type == 'touchstart'){
      x = pxToMm(e.targetTouches[0].clientX);
      y = pxToMm(e.targetTouches[0].clientY);
    }else{
      x = pxToMm(e.clientX);
      y = pxToMm(e.clientY);
    }
    this.touches.push([x, y]);
    var specs = e.target.getBoundingClientRect()
    var target_x = pxToMm((specs.left + specs.right)/2);
    var target_y = pxToMm((specs.top + specs.bottom)/2);
    if(!this.buttonSpec){
      this.buttonSpec = {'width': pxToMm(specs.width), 'height': pxToMm(specs.height)};
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
      x = pxToMm(e.changedTouches[0].clientX);
      y = pxToMm(e.changedTouches[0].clientY);
    }else{
      x = pxToMm(e.clientX);
      y = pxToMm(e.clientY);
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

  changeSize(size){
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
          changeSize={this.changeSize}
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
            textAlign: 'center',
          }}
        >
          <span
            style={{ fontSize: 40 }}>
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
          numpadSize={this.state.numpadSize}
          reset={this.resetComponent}
        />
      )
    }else{
      return null;
    }
  },
  getNumpad(){
    return(
      <div
        onTouchStart={this.hitNumberTouchStart}
        onMouseDown={this.hitNumberTouchStart}
        onTouchEnd={this.hitNumberTouchEnd}
        onMouseUp={this.hitNumberTouchEnd}
      >
        <Numpad size={this.state.numpadSize} />
      </div>
    );
  },
  deleteTyped(e){
    console.log(e.type);
    this.setState({typed: this.state.typed.slice(0, this.state.typed.length-1)});
  },
  getDeleteButton(){
    var deleteButton;
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      deleteButton = (
        <img id='del' src='../static/erase.png' style={{
          height: 40,
            float: 'right',
            position: 'absolute'
        }}
        onTouchStart={this.deleteTyped} />
      );
    }else{
      deleteButton = (
        <img id='del' src='../static/erase.png' style={{
          height: 40,
            float: 'right',
            position: 'absolute'
        }}
        onClick={this.deleteTyped} />
      );
    }
    return deleteButton
  },
  getTypedNumber(){
    if (this.state.game && this.state.targetDisplay){
      var pn = this.state.phoneNumberString;
      pn = pn.split('-');
      var l = pn[0].length;
      var ml = (l == 2 ? 4 : 3);
      var typed = this.state.typed;
      var typedString = typed.slice(0, l) + '-' +
        typed.slice(l, l+ml) + '-' + typed.slice(l+ml, l+ml+4);
      //var button = (
        //<Button
          //style={{
            //background: 'white',
              //height: 26,
              //fontSize: 10,
              //float: 'right',
              //marginLeft: 5,
              //position: 'absolute'
          //}}
          //onClick={this.deleteTyped}>DEL</Button>
      //);
      var deleteButton = this.getDeleteButton();
      return (
        <div style={{ textAlign: 'center', marginTop: 10, marginBottom: 10}} >
          <span style={{ fontSize: 30, verticalAlign: 'bottom'}}>
            {typedString}
          </span>
          {deleteButton}
        </div>
      );
    }else{
      return null;
    }
  },
  render() {
    if(!this.state.game){
      var inputForm = this.getInputForm();
      var result = this.getResult();
      return (
        <div style={{height:window.innerHeight}} >
          {result}
          <div>
            {inputForm}
          </div>
        </div>
      )
    }else{
      if(this.state.countdown){
        var countdownTimer = this.getCountdownTimer();
        return countdownTimer;
      }else{
        var phoneNumber = this.getPhoneNumber();
        var typedNumber = this.getTypedNumber();
        var numpad = this.getNumpad();
        var gameStyle = {position: 'absolute', bottom: 0, width:'100%'};
        return (
          <div style={{height:window.innerHeight, position: 'relative'}} >
            <div style={gameStyle}>
              {phoneNumber}
              {typedNumber}
              {numpad}
            </div>
          </div>
        )
      }
    }
  },
  componentDidUpdate(prevProps, prevState){
    if(prevState.countdown && !this.state.countdown){
      this.numberAppeardTime = Date.now();
    }
  }
});

module.exports = Game;
