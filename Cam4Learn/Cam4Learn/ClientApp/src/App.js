import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PersistentDrawer from './components/PersistentDrawer';
import Main from './components/Routing/Main';
import NotFound from './components/Routing/NotFound';
import Login from './components/Routing/Login';
import Lecturers from './components/Routing/Lecturers';
import Subjects from './components/Routing/Subjects';
import Export from './components/Routing/Export';
import Rooms from './components/Routing/Rooms';

import * as Icons from '@material-ui/icons';
import * as Material from '@material-ui/core';
import { TokenLocalKey, RoleLocalKey } from './components/api';

export default class App extends Component {
  displayName = App.name

  constructor(props) {
    super(props);

    this.menuRoutes = [
      {
        title: "Subjects",
        icon: <Icons.LibraryBooks />,
        route: "/subjects",
        role: ['Admin']
      },
      {
        title: "Lecturers",
        icon: <Icons.SupervisedUserCircle />,
        route: "/lecturers",
        role: ['Admin']
      },
      {
        title: "Rooms",
        icon: <Icons.MeetingRoom />,
        route: "/rooms",
        role: ['Admin']
      },
      {
        title: "Export",
        icon: <Icons.ImportExport />,
        route: "/export",
        role: ['Admin', 'NoneAuth']
      }
    ];

    let role = localStorage.getItem(RoleLocalKey);

    this.state = {
      role: role,
      isLogged: role != null,
      redirect: false
    }
    this.authChange = this.authChange.bind(this);
  }

  render() {
    if (this.state.redirect) {
      this.state.redirect = false;
      if (this.state.role == null) {
        return (
          <Redirect to="/login" />
        );
      }
      else {
        return (
          <Redirect to="/lecturers" />
        );
      }
    }

    return (
      <PersistentDrawer heading="Cam4Study"
        routes={this.menuRoutes}
        className="flexColumnGrow1 w-100"
        role={this.state.role}
        authCallback={this.authChange}>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/login" render={(props) => <Login {...props} authCallback={this.authChange} />} />
          <Route exact path="/lecturers" component={Lecturers} />
          <Route exact path="/subjects" component={Subjects} />
          <Route exact path="/rooms" component={Rooms} />
          <Route exact path="/export" component={Export} />
          <Route component={NotFound} />
        </Switch>
      </PersistentDrawer>
    );
  }

  authChange(isLogin) {
    if (isLogin) {
      this.setState({ isLogged: true, role: localStorage.getItem(RoleLocalKey), redirect: true });
    }
    else {
      this.setState({ isLogged: false, role: null, redirect: true });
    }
    console.log("authCallback");
  }
}