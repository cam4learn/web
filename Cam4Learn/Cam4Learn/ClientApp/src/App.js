import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PersistentDrawer from './components/PersistentDrawer';
import Main from './components/Routing/Main';
import NotFound from './components/Routing/NotFound';
import Login from './components/Routing/Login';
import Lectures from './components/Routing/Lectures';
import Students from './components/Routing/Students';
import Export from './components/Routing/Export';

import * as Icons from '@material-ui/icons';
import * as Material from '@material-ui/core';

export default class App extends Component {
  displayName = App.name

  constructor(props) {
    super(props);

    this.menuRoutes = [
      {
        title: "Lectures",
        icon: <Icons.List />,
        route: "/lectures"
      },
      {
        title: "Students",
        icon: <Icons.Group />,
        route: "/student"
      }
    ];
  }

  render() {
    return (
      <BrowserRouter basename={this.props.basename} >
          <PersistentDrawer heading="Cam4Study" routes={this.menuRoutes} className="flexColumnGrow1 w-100">
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