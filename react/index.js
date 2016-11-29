import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';
import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router';
import App1 from './app1/App1';
import App2 from './app2/App2';
import { makeUrl } from './helpers';
import { base } from './config';
import Game from './app2/Game';


function Index(props){
  return props.children;
}


var Selector = React.createClass({
  handleClick(e){
    if(e.target.id == 1){
        this.props.router.push({ pathname: makeUrl('/app1') });
    }else{
        this.props.router.push({ pathname: makeUrl('/app2') });
    }
  },
  render(){
    const wellStyles = {
      position: 'relative',
      maxWidth: 400,
      margin: 'auto'
    };
    return (
      <div className="well" style={wellStyles}>
        <Button id={1} bsStyle="primary" bsSize="large" onClick={this.handleClick} block>
          타겟 맞추기
        </Button>
        <Button id={2} bsStyle="primary" bsSize="large" onClick={this.handleClick} block>
          전화번호 누르기
        </Button>
      </div>
    )
  }
});


const routes = {
  path: base,
  component:Index,
  //component:Game,
  indexRoute: {component: Selector},
  childRoutes:[
    App1,
    App2
  ]
}


const rootElement = document.getElementById('root');
ReactDOM.render(
  <Router
    history={browserHistory}
    routes={routes}
  />, rootElement)
