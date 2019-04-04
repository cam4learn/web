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
    'width': [['86%'], '!important'],
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
      login: '',
      password: '',
      showPassword: false
    };

    this.submit = this.submit.bind(this);
    this.loginWithoutAccount = this.loginWithoutAccount.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
  }

  render() {
    let token = localStorage.getItem(this.props.tknKey);

    if (token != null)
      return (<Redirect to="/lectures" />);
    else
      return (
        <Material.Grid container direction="column" justify="center" alignItems="center" className={this.classes.flexContainer}>
          <Material.FormControl className={classNames(this.classes.containerWrap, this.classes.w33)} error={this.state.loginError}>
            <Material.InputLabel htmlFor="login-input">Login</Material.InputLabel>
            <Material.Input
              id="login-input"
              onChange={(e) => this.onChangeInput('login', e)}
              aria-describedby="login-input-err"
            />
            <Material.FormHelperText id="login-input-err"
              className={classNames(this.state.loginError ? this.classes.displayInherit : this.classes.displayNone)}>
              Invalid login
            </Material.FormHelperText>
          </Material.FormControl>

          <Material.FormControl className={classNames(this.classes.containerWrap, this.classes.w33)} error={this.state.passError}>
            <Material.InputLabel htmlFor="pass-input">Password</Material.InputLabel>
            <Material.Input
              id="pass-input"
              onChange={(e) => this.onChangeInput('password', e)}
              aria-describedby="pass-input-err"
              type={this.state.showPassword ? 'text' : 'password'}
              endAdornment={
                <Material.InputAdornment position="end">
                  <Material.IconButton
                    aria-label="Toggle password visibility"
                    onClick={this.handleClickShowPassword}
                  >
                    {this.state.showPassword ? <Icons.Visibility /> : <Icons.VisibilityOff />}
                  </Material.IconButton>
                </Material.InputAdornment>
              }
            />
            <Material.FormHelperText id="pass-input-err"
              className={classNames(this.state.passError ? this.classes.displayInherit : this.classes.displayNone)}>
              Invalid password
            </Material.FormHelperText>
          </Material.FormControl>

          <Material.Button variant="contained" color="primary" className={this.classes.button} onClick={this.submit}>
            SUBMIT
          </Material.Button>
          <Material.Button variant="outlined" color="secondary" className={this.classes.button} onClick={this.loginWithoutAccount}>
            Export Without Account
          </Material.Button>
        </Material.Grid>
        );
  }

  submit(e) {
    e.preventDefault();
    let url = "/adminLogin";
    let err = false;

    if (this.state.login == '') {
      this.setState({ loginError: true });
      err = true;
    }

    if (this.state.password.length < 6) {
      this.setState({ passError: true });
      err = true;
    }

    if (!err) {
      var data = JSON.stringify({
        "login": this.state.login,
        "password": this.state.password
      });
      API.post(url, data).then((response) => {
        localStorage.setItem(TokenLocalKey, response.data.JWT);
        localStorage.setItem(RoleLocalKey, 'Admin');
        this.props.authCallback(true);
        }).catch((error) => {
          if (error.response) {
            if (error.response.status == 400) {
              this.setState({ loginError: true });
            }
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log('Error', error.message);
          }
      });
    }
  }

  onChangeInput(field, e) {
    switch (field) {
      case 'login':
        this.setState({ login: e.target.value, loginError: false });
        break;
      case 'password':
        this.setState({ password: e.target.value, passError: false });
        break;
    }
  }

  loginWithoutAccount(e) {
    this.props.history.push(`/export`);
  }

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);