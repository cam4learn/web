import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import * as Icons from '@material-ui/icons';
import * as Material from '@material-ui/core';
import { TokenLocalKey, RoleLocalKey, UnauthorizedAxios as API } from '../api';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  flexContainer: {
    'display': [['flex'], '!important'],
    'flex-direction': [['column'], '!important'],
    'flex-grow': [[1], '!important'],
  },
  containerWrap: {
    'display': [['flex'], '!important'],
    'flex-wrap': [['wrap'], '!important'],
    'margin-top': [['0.5rem'], '!important'],
    'margin-bottom': [['0.5rem'], '!important']
  },
  displayNone: {
    'display': [['none'], '!important']
  },
  displayInherit: {
    'display': [['inherit'], '!important']
  },
  w33: {
    'width': [['33%'], '!important'],
  },
  '@media (min-width: 576px)': {
    w33: {
      'width': [['86%'], '!important']
    }
  },
  '@media (min-width: 768px)': {
    w33: {
      'width': [['70%'], '!important']
    }
  },
  '@media (min-width: 992px)': {
    w33: {
      'width': [['50%'], '!important']
    }
  },
  '@media (min-width: 1200px)': {
    w33: {
      'width': [['33%'], '!important']
    }
  }

});

class Login extends Component {
  constructor(props) {
    super(props);

    this.classes = this.props.classes;
    this.theme = this.props.theme;

    this.state = {
      loginError: false,
      passError: false,
      role: 'Lecturer',
      login: '',
      password: ''
    };

    this.apiRoutes = {
      'Lecturer': '/login',
      'Admin': '/adminLogin'
    }

    this.submit = this.submit.bind(this);
    this.loginWithoutAccount = this.loginWithoutAccount.bind(this);
  }

  render() {
    let token = localStorage.getItem(this.props.tknKey);

    if (token != null)
      return (<Redirect to="/lectures" />);
    else
      return (
        <Material.Grid container direction="column" justify="center" alignItems="center" className={this.classes.flexContainer}>
          <Material.FormControl className={classNames(this.classes.containerWrap, this.classes.w33)} error={this.state.loginError}>
            <Material.InputLabel htmlFor="component-error">Login</Material.InputLabel>
            <Material.Input
              id="component-error"
              onChange={(e) => this.setState({ login: e.target.value})}
              aria-describedby="component-error-text"
            />
            <Material.FormHelperText id="component-error-text"
              className={classNames(this.state.loginError ? this.classes.displayInherit : this.classes.displayNone)}>
              Invalid login
              </Material.FormHelperText>
          </Material.FormControl>
          <Material.FormControl className={classNames(this.classes.containerWrap, this.classes.w33)} error={this.state.passError}>
            <Material.InputLabel htmlFor="component-error">Password</Material.InputLabel>
            <Material.Input
              id="component-error"
              onChange={(e) => this.setState({ password: e.target.value })}
              aria-describedby="component-error-text"
            />
            <Material.FormHelperText id="component-error-text"
              className={classNames(this.state.passError ? this.classes.displayInherit : this.classes.displayNone)}>
              Invalid password
              </Material.FormHelperText>
          </Material.FormControl>
          <Material.FormControl className={classNames(this.classes.formControl, this.classes.w33)}>
            <Material.InputLabel htmlFor="age-simple">Role</Material.InputLabel>
            <Material.Select value={this.state.role} onChange={(e) => this.setState({ role: e.target.value })}>
              <Material.MenuItem value="Lecturer">Lecturer</Material.MenuItem>
              <Material.MenuItem value="Admin">Admin</Material.MenuItem>
            </Material.Select>
          </Material.FormControl>
          <Material.Button variant="contained" color="primary" className={this.classes.button} onClick={this.submit}>
            SUBMIT
          </Material.Button>
          <Material.Button variant="outlined" color="secondary" className={this.classes.button} onClick={this.loginWithoutAccount}>
            Login Without Account
          </Material.Button>
        </Material.Grid>
        );
  }

  submit(e) {
    e.preventDefault();
    let role = this.state.role;
    let url = this.apiRoutes[role];

    API.post(url, {
      login: this.state.login,
      password: this.state.password
    }).then((response) => {
      localStorage.setItem(TokenLocalKey, response.data.JWT);
      localStorage.setItem(RoleLocalKey, role);
      this.props.history.push(`/lectures`);
    }).catch((error) => {
      //TODO: Set state for an errors (this.setState({ loginError: true }); and so on)
    });
  }

  loginWithoutAccount(e) {
    this.props.history.push(`/export`);
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);