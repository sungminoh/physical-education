import React from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import { makeUrl } from '../helpers'

var TableRow = React.createClass({
  //<th>#</th>
  //<th>번호</th>
  //<th>소요시간</th>
  //<th>평균터치시간</th>
  //<th>평균터치크기</th>
  //<th>평균오차</th>
  //<th>버튼높이</th>
  //<th>버튼폭</th>
  render(){
    return (
      <tr>
        <td>{this.props.idx}</td>
        <td>{this.props.phoneNumber}</td>
        <td>{this.props.delay.toFixed(2)}</td>
        <td>{this.props.touchDuration.toFixed(2)}</td>
        <td>{this.props.touchSize.toFixed(2)}</td>
        <td>{this.props.accuracy.toFixed(2)}</td>
        <td>{this.props.buttonHeight.toFixed(2)}</td>
        <td>{this.props.buttonWidth.toFixed(2)}</td>
      </tr>
    );
  }
});

function average(arr, subject){
  var sum = 0;
  for(var i=0; i<arr.length; i++){
    if (subject){
      sum += parseFloat(average(arr[i][subject]));
    }else{
      sum += parseFloat(arr[i]);
    }
  }
  return sum/arr.length;
}

var Result = React.createClass({
  getInitialState(){
    return{
      saved: false
    };
  },

  propTypes: {
    results: React.PropTypes.array,
    //var result = {
    //'phoneNumber': this.state.phoneNumberString,
    //'touchDurations': this.touchDurations,
    //'touchSizes': this.touchSizes,
    //'accuracies': this.accuracies,
    //'delays': this.delays
    //}
    buttonSpec: React.PropTypes.object,
    reset: React.PropTypes.func
  },

  getAvergeTr(){
    var resultsLength = this.props.results.length
    var avgOfDelays = 0;
    for(var i=0; i<resultsLength; i++){
      var result = this.props.results[i];
      avgOfDelays += result.delays[result.delays.length-1]
    }
    avgOfDelays /= resultsLength;
    var avgOfTouchDuration = average(this.props.results, 'touchDurations');
    var avgOfTouchSize = average(this.props.results, 'touchSizes');
    var avgOfAccuracies = average(this.props.results, 'accuracies');

    return (
      <TableRow
        idx='avg.'
        delay={avgOfDelays}
        touchDuration={avgOfTouchDuration}
        touchSize={avgOfTouchSize}
        accuracy={avgOfAccuracies}
        buttonHeight={this.props.buttonSpec.height}
        buttonWidth={this.props.buttonSpec.width}
      />
    )
  },

  results: {
    'delays': [],
    'touchDurations': [],
    'touchSizes': [],
    'accuracies': [],
    'phoneNumbers': [],
    'buttonWidths': [],
    'buttonHeights': []
  },
  getList(){
    var ret = [];
    for (var i=0; i<this.props.results.length; i++){
      var result = this.props.results[i];
      var delay = result.delays[result.delays.length - 1];
      var avgOfTouchDurations = average(result.touchDurations);
      var avgOfTouchSizes = average(result.touchSizes);
      var avgOfAccuracies = average(result.accuracies);
      var phoneNumber = result.phoneNumber;
      this.results.delays.push(delay);
      this.results.touchDurations.push(avgOfTouchDurations);
      this.results.touchSizes.push(avgOfTouchSizes);
      this.results.accuracies.push(avgOfAccuracies);
      this.results.phoneNumbers.push(phoneNumber);
      this.results.buttonWidths.push(this.props.buttonSpec.width);
      this.results.buttonHeights.push(this.props.buttonSpec.height);
      ret.push(
        <TableRow
          key={i+1}
          idx={i+1}
          phoneNumber={phoneNumber}
          delay={delay}
          touchDuration={avgOfTouchDurations}
          touchSize={avgOfTouchSizes}
          accuracy={avgOfAccuracies}
          buttonHeight={this.props.buttonSpec.height}
          buttonWidth={this.props.buttonSpec.width}
        />
      )
    }
    return ret;
  },
  reset(){
    this.props.reset();
    this.results.delays = [];
    this.results.touchDurations = [];
    this.results.touchSizes = [];
    this.results.accuracies = [];
    this.results.phoneNumbers = [];
    this.results.buttonWidths = [];
    this.results.buttonHeights = [];
  },

  render() {
    return (
      //<div className="static-modal">
      <Modal.Dialog style={{overflowY: 'auto'}}>
        <Modal.Header>
          <Modal.Title>결과</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>번호</th>
                <th>소요시간</th>
                <th>평균터치시간</th>
                <th>평균터치크기</th>
                <th>평균오차</th>
                <th>버튼높이</th>
                <th>버튼폭</th>
              </tr>
            </thead>
            <tbody>
              {this.getAvergeTr()}
              {this.getList()}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.reset}>닫기</Button>
          <Button bsStyle="primary" onClick={this.sendResult} disabled={this.state.saved}>저장</Button>
        </Modal.Footer>
      </Modal.Dialog>
        //</div>
    );
  },

  sendResult(){
    var requestHeader = {
      method: 'POST',
      headers: {
        //'Accept': 'application/json, application/xml, text/play, text/html, *.*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.results)
    }
    fetch(makeUrl('/app2/result'), requestHeader)
      .then((response) => {
        if (response.ok){
          alert('성공적으로 저장되었습니다.');
          this.setState({saved: true});
        }
      })
    //.then((response) => response.json())
    //.then((responseJson) => {
    //console.log(responseJson);
    //})
      .catch((error) => {
        alert('데이터가 정상적으로 저장되지 못하였습니다. 다시 시도하세요.');
      });
  }
});

module.exports = Result;
