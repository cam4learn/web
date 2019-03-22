import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Main from './components/Main';
import NotFound from './components/NotFound';
import Login from './components/Login';
import Lectures from './components/Lectures';
import Students from './components/Students';
import Export from './components/Export';

import * as Material from '@material-ui/core';
import PersistentDrawer from './components/PersistentDrawer';

export default class App extends Component {
  displayName = App.name

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter basename={this.props.basename}>
        <PersistentDrawer heading="Cam4Study">
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/lectures" component={Lectures} />
            <Route exact path="/students" component={Students} />
            <Route exact path="/export" component={Export} />
            <Route component={NotFound} />
          </Switch>
        </PersistentDrawer>
      </BrowserRouter>
    );
  }
}
