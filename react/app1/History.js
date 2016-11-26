import React from 'react';
import { Table, Button, Form, FormGroup } from 'react-bootstrap';


var TableRow = React.createClass({
  render(){
    var date = new Date(this.props.ts);
    var dateText = date.toLocaleString();
    return (
      <tr>
        <td>{this.props.idx}</td>
        <td>{this.props.target_x}</td>
        <td>{this.props.target_y}</td>
        <td>{this.props.target_r}</td>
        <td>{this.props.touch_x}</td>
        <td>{this.props.touch_y}</td>
        <td>{this.props.touch_s}</td>
        <td>{this.props.touch_d}</td>
        <td>{this.props.accuracy}</td>
        <td>{this.props.delay}</td>
        <td>{dateText}</td>
      </tr>
    )
  }
});


function  getList(data){
  var ret = [];
  for (var i=0; i<data.length; i++){
    var row = data[i]
    ret.push(
      <TableRow
        key={i+1}
        idx={row[0]}
        target_x={row[1]}
        target_y={row[2]}
        target_r={row[3]}
        touch_x={row[4]}
        touch_y={row[5]}
        touch_s={row[6]}
        touch_d={row[7]}
        accuracy={row[8]}
        delay={row[9]}
        ts={row[10]}
      />
    )
  }
  return ret;
}


var History = React.createClass({
  getInitialState(){
    return{
      fetched: false
    }
  },
  getResultHistory(){
      fetch('/physical/app1/result', { method: 'GET', accept: 'application/json'})
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson.result;
        this.setState({fetched: true});
      })
      .catch((error) => {
        alert('데이터를 가져오지 못하였습니다. 다시 시도하세요.');
      });
  },
  redirectToGame(e){
    this.props.router.push({ pathname: '/app1/game' });
  },
  render(){
    return (
      <div>
        <Button onClick={this.redirectToGame}> 게임 하기 </Button>
        {' '}
        <Form inline style={{margin:"0", display:"inline"}} method='get' action='/app1/download'>
          <Button type='submit' > 저장 하기 </Button>
        </Form>
        <Table responsive>
          <thead>
            <tr>
              <th>실험 번호</th>
              <th>타겟 x</th>
              <th>타겟 y</th>
              <th>타겟 r</th>
              <th>터치 x</th>
              <th>터치 y</th>
              <th>터치 크기</th>
              <th>터치 시간</th>
              <th>오차</th>
              <th>반응 시간</th>
              <th>실험 시각</th>
            </tr>
          </thead>
          <tbody>
            {this.state.fetched ? getList(this.data) : null}
          </tbody>
        </Table>
      </div>
    )
  },
  componentDidMount(){
    this.getResultHistory();
  }
});

module.exports = History;
