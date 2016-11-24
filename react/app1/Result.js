import React from 'react';
import { Table, Modal, Button } from 'react-bootstrap';

var TableRow = React.createClass({
  render(){
    return (
      <tr>
        <td>{this.props.idx}</td>
        <td>{(this.props.delay/1000).toFixed(2)}</td>
        <td>{this.props.accuracy.toFixed(2)}</td>
        <td>{this.props.targetRadius.toFixed(2)}</td>
      </tr>
    )
  }
});

var Result = React.createClass({
  getInitialState(){
    return{
      visible: true
    };
  },

  propTypes: {
    targetPositions: React.PropTypes.array,
    targetRadii: React.PropTypes.array,
    accuracies: React.PropTypes.array,
    delays : React.PropTypes.array,
    count: React.PropTypes.number,
    reset: React.PropTypes.func
  },

  getAvergeTr(){
    var sumOfAccuracies = 0;
    for (var i=0; i<this.props.count; i++){
      sumOfAccuracies += parseFloat(this.props.accuracies[i]);
    }
    var avgOfAccuracies = sumOfAccuracies/this.props.count;

    var sumOfDelays = 0;
    for (var i=0; i<this.props.count; i++){
      sumOfDelays += parseFloat(this.props.delays[i]);
    }
    var avgOfDelays = (sumOfDelays)/this.props.count;

    var sumOfTargetRadii = 0;
    for (var i=0; i<this.props.count; i++){
      sumOfTargetRadii += parseFloat(this.props.targetRadii[i]);
    }
    var avgOfTargetRadii = sumOfTargetRadii/this.props.count;

    return (
      <TableRow
        idx='avg.'
        delay={avgOfDelays}
        accuracy={avgOfAccuracies}
        targetRadius={avgOfTargetRadii}
      />
    )
  },

  sendResult(){
    var formData = new FormData()
    for(var key in this.props) formData.append(key, this.props[key]);
    var requestHeader = {
      method: 'POST',
      body: formData
    }
    fetch('/result', requestHeader).then(function(response){
      if(response.ok){
        alert('ok');
      }else{
        alert('err');
      }
    }).catch(function(error){
      alert('errr m');
    });
  },

  getList(){
    var ret = [];
    for (var i=0; i<this.props.count; i++){
      ret.push(
        <TableRow
          key={i+1}
          idx={i+1}
          delay={this.props.delays[i]}
          accuracy={this.props.accuracies[i]}
          targetRadius={this.props.targetRadii[i]}
        />
      )
    }
    return ret;
  },

  reset(){
    this.setState({
      visible: false
    })
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
                  <th>정확도</th>
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
            <Button onClick={this.props.reset}>Close</Button>
            <Button bsStyle="primary" onClick={this.sendResult}>Send</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    );
  }
});

module.exports = Result;
