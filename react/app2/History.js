import React from 'react';
import { Table, Button, Form, FormGroup } from 'react-bootstrap';
import { makeUrl } from '../helpers';


var TableRow = React.createClass({
  render(){
    var date = new Date(this.props.ts);
    var dateText = date.toLocaleString();
    return (
      <tr>
        <td>{this.props.idx}</td>
        <td>{this.props.phoneNumber}</td>
        <td>{this.props.touch_s}</td>
        <td>{this.props.touch_d}</td>
        <td>{this.props.accuracy}</td>
        <td>{this.props.delay}</td>
        <td>{this.props.numpadSize}</td>
        <td>{this.props.buttonWidth}</td>
        <td>{this.props.buttonHeight}</td>
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
        phoneNumber={row[1]}
        touch_s={row[2]}
        touch_d={row[3]}
        accuracy={row[4]}
        delay={row[5]}
        numpadSize={row[6]}
        buttonWidth={row[7]}
        buttonHeight={row[8]}
        ts={row[9]}
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
    fetch(makeUrl('/app2/result'), { method: 'GET', accept: 'application/json'})
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
    this.props.router.push({ pathname: makeUrl('/app2/game') });
  },
  requestRemoveAll(e){
    fetch(makeUrl('/app2/result'), { method: 'DELETE', accept: 'application/json'})
      .then((response) => response.ok)
      .then((responseOk) => {
        if(responseOk){
          this.setState({fetched: false});
          alert('데이터를 성공적으로 삭제하였습니다.');
        }
      })
      .catch((error) => {
        alert('데이터를 삭제하는데 실패하였습니다. 다시 시도하세요.');
      });
  },
  render(){
    return (
      <div>
        <Button onClick={this.redirectToGame}> 게임 하기 </Button>
        {' '}
        <Form inline style={{margin:"0", display:"inline"}} method='get' action={makeUrl('/app2/download')}>
          <Button type='submit' > 저장 하기 </Button>
        </Form>
        {' '}
        <Button onClick={this.requestRemoveAll} > 전체 삭제 </Button>

        <Table responsive>
          <thead>
            <tr>
              <th>실험 번호</th>
              <th>전화 번호</th>
              <th>터치 크기</th>
              <th>터치 시간</th>
              <th>오차</th>
              <th>소요 시간</th>
              <th>타입</th>
              <th>버튼 폭</th>
              <th>버튼 높이</th>
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
