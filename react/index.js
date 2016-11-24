import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';
import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router';
import App1 from './app1/App1';


function Index(props){
  return (<div>{props.children}</div>);
}


var Selector = React.createClass({
  handleClick(e){
    if(e.target.id == 1){
      this.props.router.push({ pathname: '/app1' });
    }else{
      this.props.router.push({ pathname: '/app2' });
    }
  },
  render(){
    const wellStyles = {
      position: 'relative',
      maxWidth: 400,
      margin: 'auto'
    };
    return (
      <div>
        <div className="well" style={wellStyles}>
          <Button id={1} bsStyle="primary" bsSize="large" onClick={this.handleClick} block>
            타겟 맞추기
          </Button>
          <Button id={2} bsStyle="primary" bsSize="large" onClick={this.handleClick} block>
            전화번호 누르기
          </Button>
        </div>
      </div>
    )
  }
});


const rootElement = document.getElementById('root');
ReactDOM.render(
  <Router history={browserHistory}>
    <Route path = "/" component = {Index}>
      <IndexRoute component = {Selector} />
      <Route path = "app1" component = {App1} />
    </Route>
  </Router>, rootElement);
