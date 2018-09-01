import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

/************ Components ************/
import Auth from './components/Auth/index';
import Dashboard from './components/dashboard/index';
import Image from './components/image/index';
import SubGroup from './components/sub-group/index';
import NoMatch from './components/404/index';

ReactDOM.render((
    <Router>
        <Switch>
            <Route exact path="/" component={Auth} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/image/:projectId" component={Image} />
            <Route path="/subgroup/:projectId" component={SubGroup} />     
            <Route component={NoMatch} />     
        </Switch>
    </Router>  
  ), document.getElementById('root'));

registerServiceWorker();
