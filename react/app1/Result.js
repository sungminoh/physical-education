import React from 'react';
import { Table, Modal, Button } from 'react-bootstrap';

var TableRow = React.createClass({
  render(){
    return (
      <tr>
        <td>{this.props.idx}</td>
        <td>{this.props.delay.toFixed(2)}</td>
        <td>{this.props.touchDuration.toFixed(2)}</td>
        <td>{this.props.touchSize.toFixed(2)}</td>
        <td>{this.props.accuracy.toFixed(2)}</td>
        <td>{this.props.targetRadius.toFixed(2)}</td>
      </tr>
    );
  }
});

function average(arr){
  var sum = 0;
  for(var i=0; i<arr.length; i++){
    sum += parseFloat(arr[i]);
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
    targetPositions: React.PropTypes.array,
    targetRadii: React.PropTypes.array,
    touches: React.PropTypes.array,
    touchSizes: React.PropTypes.array,
    touchDurations: React.PropTypes.array,
    accuracies: React.PropTypes.array,
    delays : React.PropTypes.array,
    count: React.PropTypes.number,
    reset: React.PropTypes.func
  },

  getAvergeTr(){
    var avgOfDelays = average(this.props.delays);
    var avgOfTouchDuration = average(this.props.touchDurations);
    var avgOfTouchSize = average(this.props.touchSizes);
    var avgOfAccuracies = average(this.props.accuracies);
    var avgOfTargetRadii = average(this.props.targetRadii);

    return (
      <TableRow
        idx='avg.'
        delay={avgOfDelays}
        touchDuration={avgOfTouchDuration}
        touchSize={avgOfTouchSize}
        accuracy={avgOfAccuracies}
        targetRadius={avgOfTargetRadii}
      />
    )
  },

  getList(){
    var ret = [];
    for (var i=0; i<this.props.count; i++){
      ret.push(
        <TableRow
          key={i+1}
          idx={i+1}
          delay={this.props.delays[i]}
          touchDuration={this.props.touchDurations[i]}
          touchSize={this.props.touchSizes[i]}
          accuracy={this.props.accuracies[i]}
          targetRadius={this.props.targetRadii[i]}
        />
      )
    }
    return ret;
  },

  render() {
    return (
      <div className="static-modal">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>결과</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>반응시간</th>
                  <th>터치시간</th>
                  <th>터치크기</th>
                  <th>오차</th>
                  <th>반지름</th>
                </tr>
              </thead>
              <tbody>
                {this.getAvergeTr()}
                {this.getList()}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.reset}>닫기</Button>
            <Button bsStyle="primary" onClick={this.sendResult} disabled={this.state.saved}>저장</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    );
  },

  sendResult(){
    var requestHeader = {
      method: 'POST',
      headers: {
        //'Accept': 'application/json, application/xml, text/play, text/html, *.*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.props)
    }
    fetch('/app1/result', requestHeader)
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
