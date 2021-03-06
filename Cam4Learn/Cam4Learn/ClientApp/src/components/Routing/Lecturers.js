﻿import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import * as Icons from '@material-ui/icons';
import * as Material from '@material-ui/core';
import { TokenLocalKey, AuthorizedAxios } from '../api';

import CustomizableTable from '../CustomizableTable';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
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

  table: {
    marginLeft: theme.spacing.unit * 6,
    marginRight: theme.spacing.unit * 6
  },
  '@media (min-width: 576px)': {
    table: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit
    }
  },
  '@media (min-width: 768px)': {
    table: {
      marginLeft: theme.spacing.unit * 2,
      marginRight: theme.spacing.unit * 2
    }
  },
  '@media (min-width: 992px)': {
    table: {
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3
    }
  },
  '@media (min-width: 1200px)': {
    table: {
      marginLeft: theme.spacing.unit * 6,
      marginRight: theme.spacing.unit * 6
    }
  },
  danger: {
    'background-color': '#F44336',
    '&:hover': {
      'background-color': '#D32F2F'
    }
  },
  add: {
    'background-color': '#4CAF50',
    '&:hover': {
      'background-color': '#388E3C'
    }
  },
  foregroundDanger: {
    'color': '#F44336'
  },
  foregroundAdd: {
    'color': '#4CAF50'
  },
  m4: {
    'margin': '1em'
  }
});


class Lecturers extends Component {
  constructor(props) {
    super(props);

    this.classes = this.props.classes;
    this.theme = this.props.theme;

    this.state = {
      data: [],
      headers: [
        {
          id: 'id',
          numeric: true,
          disablePadding: false,
          label: 'Subject Id'
        },
        {
          id: 'name',
          numeric: false,
          disablePadding: false,
          label: 'Name'
        },
        {
          id: 'surname',
          numeric: false,
          disablePadding: false,
          label: 'Surname'
        },
        {
          id: 'editBtn',
          numeric: false,
          disablePadding: false,
          label: 'Edit',
        },
        {
          id: 'deleteBtn',
          numeric: false,
          disablePadding: false,
          label: 'Delete'
        }
      ],

      deleteOpen: false,
      deleteState: {},

      editOpen: false,
      editState: {
        id: 0,
        name: '',
        surname: '',
        login: ''
      },
      editErrors: {
        name: false,
        surname: false,
        login: false
      },

      addOpen: false,
      addState: {
        name: '',
        surname: '',
        login: '',
        password: '',
      },
      addErrors: {
        name: false,
        surname: false,
        login: false,
        password: false
      },
      showPassword: false
    }

    this.createRow = this.createRow.bind(this);
    this.refresh = this.refresh.bind(this);

    this.refresh();
  }

  addShow = () => {
    this.setState({
      addOpen: true,
    });
  }

  addHide = () => {
    this.setState({
      addOpen: false,
      addState: {
        name: '',
        surname: '',
        login: '',
        password: ''
      },
      addErrors: {
        name: false,
        surname: false,
        login: false,
        password: false
      }
    });
  }

  addSubmit = () => {
    let err = false;
    if (!this.state.addState.name) {
      this.setState(prev => ({ addErrors: { ...prev.addErrors, name: true } }));
      err = true;
    }
    if (!this.state.addState.surname) {
      this.setState(prev => ({ addErrors: { ...prev.addErrors, surname: true } }));
      err = true;
    }
    if (!this.state.addState.login) {
      this.setState(prev => ({ addErrors: { ...prev.addErrors, login: true } }));
      err = true;
    }
    if (this.state.addState.password.length < 6) {
      this.setState(prev => ({ addErrors: { ...prev.addErrors, password: true } }));
      err = true;
    }

    if (!err) {
      let data = JSON.stringify({
        name: this.state.addState.name,
        surname: this.state.addState.surname,
        login: this.state.addState.login,
        password: this.state.addState.password
      });

      AuthorizedAxios().post("/api/admin/addLector", data)
        .then(response => {
          console.log(response.data);
          this.refresh();
        })
        .catch(error => {
          console.log(error);
        })
        .then(() => {
          this.addHide();
        });
    }
  }


  editShow = (obj) => {
    this.setState({
      editOpen: true,
      editState: {
        id: obj.id,
        name: obj.name,
        surname: obj.surname,
        login: obj.login
      },
    });
  }

  editHide = () => {
    this.setState({
      editOpen: false,
      editState: {
        id: 0,
        name: '',
        surname: '',
        login: ''
      },
      editErrors: {
        name: false,
        surname: false,
        login: false
      }
    });
  }

  editSubmit = () => {
    let err = false;
    if (!this.state.editState.name) {
      this.setState(prev => ({ editErrors: { ...prev.editErrors, name: true } }));
      err = true;
    }
    if (!this.state.editState.surname) {
      this.setState(prev => ({ editErrors: { ...prev.editErrors, surname: true } }));
      err = true;
    }
    if (!this.state.editState.login) {
      this.setState(prev => ({ editErrors: { ...prev.editErrors, login: true } }));
      err = true;
    }

    if (!err) {
      let data = JSON.stringify({
        id: this.state.editState.id,
        name: this.state.editState.name,
        surname: this.state.editState.surname,
        login: this.state.editState.login,
      });

      AuthorizedAxios().patch("/api/admin/changeLector", data)
        .then(response => {
          console.log(response.data);
          this.refresh();
        })
        .catch(error => {
          console.log(error);
        })
        .then(() => {
          this.editHide();
        });
    }
  }

  deleteShow = (obj) => {
    this.setState({
      deleteOpen: true,
      currentDelete: obj
    });
  }

  deleteHide = () => {
    this.setState({
      deleteOpen: false,
      currentDelete: {}
    });
  }

  deleteLecturer = () => {
    console.log("deleteSubject");
    console.log(this.state.currentDelete);
    var data = JSON.stringify({
      id: this.state.currentDelete.id
    });

    AuthorizedAxios().delete("/api/admin/deleteLector", { data: data })
      .then(response => {
        console.log(response.data);
        this.refresh();
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => {
        this.hideDelete();
      });
  }

  changeField = (e, section, field) => {
    let value = e.target.value;

    switch (section) {
      case 'edit':
        switch (field) {
          case 'name':
            this.setState(prev => ({ editState: { ...prev.editState, name: value } }));
            break;
          case 'surname':
            this.setState(prev => ({ editState: { ...prev.editState, surname: value } }));
            break;
          case 'login':
            this.setState(prev => ({ editState: { ...prev.editState, login: value } }));
            break;
        }
        break;
      case 'add':
        switch (field) {
          case 'name':
            this.setState(prev => ({ addState: { ...prev.addState, name: value } }));
            break;
          case 'surname':
            this.setState(prev => ({ addState: { ...prev.addState, surname: value } }));
            break;
          case 'login':
            this.setState(prev => ({ addState: { ...prev.addState, login: value } }));
            break;
          case 'password':
            this.setState(prev => ({ addState: { ...prev.addState, password: value } }));
            break;
        }
    }
  }

  createRow(obj) {
    console.log("Create row");
    console.log(obj);
    return (
      <Material.TableRow hover tabIndex={-1} key={obj.id}>
        <Material.TableCell component="th" scope="row">
          {obj.id}
        </Material.TableCell>
        <Material.TableCell>
          {obj.name}
        </Material.TableCell>
        <Material.TableCell>
          {obj.surname}
        </Material.TableCell>
        <Material.TableCell>
          <Material.Button
            variant="contained"
            color="secondary"
            onClick={() => this.editShow(obj)}>
            Edit
              <Icons.Edit className={this.classes.rightIcon} />
          </Material.Button>
        </Material.TableCell>
        <Material.TableCell>
          <Material.Button
            variant="contained"
            className={classNames(this.classes.danger)}
            onClick={() => this.deleteShow(obj)}>
            Delete
              <Icons.Delete className={this.classes.rightIcon} />
          </Material.Button>
        </Material.TableCell>
      </Material.TableRow>
    );
  }

  refresh() {
    console.log("refresh");
    AuthorizedAxios().get("/api/admin/getLectors")
      .then(response => {
        console.log("Refresh");
        console.log(response);
        this.setState({ data: response.data });
      }).catch(error => {
        console.log(error);
      });
  }

  render() {
    const { fullScreen } = this.props;

    let token = localStorage.getItem(TokenLocalKey);

    if (token == null)
      return (<Redirect to="/login" />);
    else
      return (
        <Material.Grid container direction="column" justify="center" alignItems="center" className={this.classes.flexContainer}>
          <Material.Grid className={classNames(this.classes.table)}>
            <Material.Grid container direction="row" justify="space-between" alignItems="flex-end">
              <Material.Button
                variant="contained"
                onClick={this.refresh}>
                Refresh
                <Icons.Refresh className={this.classes.rightIcon} />
              </Material.Button>
              <Material.Button
                variant="contained"
                className={classNames(this.classes.add)}
                onClick={this.addShow}>
                Add
              <Icons.Add className={this.classes.rightIcon} />
              </Material.Button>
            </Material.Grid>

            <CustomizableTable
              headers={this.state.headers}
              data={this.state.data}
              title="Lecturers"
              createRow={this.createRow}
            />
          </Material.Grid>

          <Material.Dialog
            fullScreen={fullScreen}
            open={this.state.deleteOpen}
            onClose={this.deleteHide}
            aria-labelledby="responsive-dialog-title">

            <Material.DialogTitle id="responsive-dialog-title">
              {"Lecturer delete"}
            </Material.DialogTitle>

            <Material.DialogContent>
              <Material.DialogContentText>
                {"Are you sure you want to delete this lecturer?"}
              </Material.DialogContentText>
            </Material.DialogContent>
            <Material.DialogActions>
              <Material.Button onClick={this.deleteHide}>
                Cancel
              </Material.Button>
              <Material.Button
                onClick={this.deleteLecturer}
                className={this.classes.foregroundDanger}
                autoFocus>
                Delete
              </Material.Button>
            </Material.DialogActions>
          </Material.Dialog>

          <Material.Dialog
            fullScreen={fullScreen}
            open={this.state.editOpen}
            onClose={this.editHide}
            maxWidth='sm'
            fullWidth={true}
            aria-labelledby="responsive-dialog-title">

            <Material.DialogTitle id="responsive-dialog-title">
              Lecturer edit
            </Material.DialogTitle>

            <Material.DialogContent className={this.classes.flexContainer}>
              <Material.FormControl className={this.classes.m4}
                error={this.state.editErrors.name}>
                <Material.InputLabel htmlFor="edit-name-input">Name</Material.InputLabel>
                <Material.Input
                  id="edit-name-input"
                  value={this.state.editState.name}
                  onChange={(e) => this.changeField(e, 'edit', 'name')}
                  aria-describedby="edit-name-err"/>
                <Material.FormHelperText id="edit-name-err"
                  className={classNames(this.state.editErrors.name ? this.classes.displayInherit : this.classes.displayNone)}>
                  Name is required
                </Material.FormHelperText>
              </Material.FormControl>

              <Material.FormControl className={this.classes.m4}
                error={this.state.editErrors.surname}>
                <Material.InputLabel htmlFor="edit-surname-input">Surname</Material.InputLabel>
                <Material.Input
                  id="edit-surname-input"
                  value={this.state.editState.surname}
                  onChange={(e) => this.changeField(e, 'edit', 'surname')}
                  aria-describedby="edit-surname-err">
                </Material.Input>
                <Material.FormHelperText id="edit-surname-err"
                  className={classNames(this.state.editErrors.surname ? this.classes.displayInherit : this.classes.displayNone)}>
                  Surname is required
                </Material.FormHelperText>
              </Material.FormControl>

              <Material.FormControl className={this.classes.m4}
                error={this.state.editErrors.login}>
                <Material.InputLabel htmlFor="edit-login-input">Login</Material.InputLabel>
                <Material.Input
                  id="edit-login-input"
                  value={this.state.editState.login}
                  onChange={(e) => this.changeField(e, 'edit', 'login')}
                  aria-describedby="edit-login-err">
                </Material.Input>
                <Material.FormHelperText id="edit-login-err"
                  className={classNames(this.state.editErrors.login ? this.classes.displayInherit : this.classes.displayNone)}>
                  Login is required
                </Material.FormHelperText>
              </Material.FormControl>
            </Material.DialogContent>
            <Material.DialogActions>
              <Material.Button onClick={this.editHide}>
                Cancel
              </Material.Button>
              <Material.Button
                onClick={this.editSubmit}
                className={this.classes.foregroundDanger}
                autoFocus>
                Submit
              </Material.Button>
            </Material.DialogActions>
          </Material.Dialog>

          <Material.Dialog
            fullScreen={fullScreen}
            open={this.state.addOpen}
            maxWidth='sm'
            fullWidth={true}
            onClose={this.addHide}
            aria-labelledby="responsive-dialog-title">

            <Material.DialogTitle id="responsive-dialog-title">
              Create new lecturer
            </Material.DialogTitle>

            <Material.DialogContent className={this.classes.flexContainer}>
              <Material.FormControl className={this.classes.m4}
                error={this.state.addErrors.name}>
                <Material.InputLabel htmlFor="add-name-input">Name</Material.InputLabel>
                <Material.Input
                  id="add-name-input"
                  value={this.state.addState.name}
                  onChange={(e) => this.changeField(e, 'add', 'name')}
                  aria-describedby="add-name-err"
                />
                <Material.FormHelperText id="add-name-err"
                  className={classNames(this.state.addErrors.name ? this.classes.displayInherit : this.classes.displayNone)}>
                  Name is required
                </Material.FormHelperText>
              </Material.FormControl>

              <Material.FormControl className={this.classes.m4}
                error={this.state.addErrors.surname}>
                <Material.InputLabel htmlFor="add-surname-input">Surname</Material.InputLabel>
                <Material.Input
                  id="add-surname-input"
                  value={this.state.addState.surname}
                  onChange={(e) => this.changeField(e, 'add', 'surname')}
                  aria-describedby="add-surname-err">
                </Material.Input>
                <Material.FormHelperText id="add-surname-err"
                  className={classNames(this.state.addErrors.surname ? this.classes.displayInherit : this.classes.displayNone)}>
                  Surname is required
                </Material.FormHelperText>
              </Material.FormControl>

              <Material.FormControl className={this.classes.m4}
                error={this.state.addErrors.login}>
                <Material.InputLabel htmlFor="add-login-input">Login</Material.InputLabel>
                <Material.Input
                  id="add-login-input"
                  value={this.state.addState.login}
                  onChange={(e) => this.changeField(e, 'add', 'login')}
                  aria-describedby="add-login-err">
                </Material.Input>
                <Material.FormHelperText id="add-login-err"
                  className={classNames(this.state.addErrors.login ? this.classes.displayInherit : this.classes.displayNone)}>
                  Login is required
                </Material.FormHelperText>
              </Material.FormControl>

              <Material.FormControl className={this.classes.m4}
                error={this.state.addErrors.password}>
                <Material.InputLabel htmlFor="add-password-input">Password</Material.InputLabel>
                <Material.Input
                  id="add-password-input"
                  type={this.state.showPassword ? 'text' : 'password'}
                  value={this.state.addState.password}
                  onChange={(e) => this.changeField(e, 'add', 'password')}
                  aria-describedby="add-password-err"
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
                >
                </Material.Input>
                <Material.FormHelperText id="add-password-err"
                  className={classNames(this.state.addErrors.password ? this.classes.displayInherit : this.classes.displayNone)}>
                  Password must be not less than 6 characters
                </Material.FormHelperText>
              </Material.FormControl>

            </Material.DialogContent>
            <Material.DialogActions>
              <Material.Button onClick={this.addHide}>
                Cancel
              </Material.Button>
              <Material.Button
                onClick={this.addSubmit}
                className={this.classes.foregroundDanger}
                autoFocus>
                Submit
              </Material.Button>
            </Material.DialogActions>
          </Material.Dialog>
        </Material.Grid>
      );
  }

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };
}

Lecturers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Lecturers);