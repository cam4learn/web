import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import * as Icons from '@material-ui/icons';
import * as Material from '@material-ui/core';
import { TokenLocalKey, AuthorizedAxios } from '../../api';

import CustomizableTable from '../../CustomizableTable';

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


class Groups extends Component {
  constructor(props) {
    super(props);

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
        id: -1,
        name: ''
      },
      editErrors: {
        id: false,
        name: false
      },

      addOpen: false,
      addState: {
        name: ''
      },
      addErrors: {
        name: false
      },
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
        id: -1,
        name: ''
      },
      addErrors: {
        name: false
      }
    });
  }

  addSubmit = () => {
    let err = false;
    if (!this.state.addState.name) {
      this.setState(prev => ({ addErrors: { ...prev.addErrors, name: true } }));
      err = true;
    }

    if (!err) {
      let data = JSON.stringify({
        name: this.state.addState.name,
      });

      AuthorizedAxios().post("/api/admin/group", data)
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
      },
    });
  }

  editHide = () => {
    this.setState({
      editOpen: false,
      editState: {
        id: -1,
        name: '',
      },
      editErrors: {
        id: false,
        name: false,
      }
    });
  }

  editSubmit = () => {
    let err = false;
    if (!this.state.editState.name) {
      this.setState(prev => ({ editErrors: { ...prev.editErrors, name: true } }));
      err = true;
    }

    if (!err) {
      let data = JSON.stringify({
        id: this.state.editState.id,
        name: this.state.editState.name,
      });

      AuthorizedAxios().patch("/api/admin/group", data)
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

  deleteGroup = () => {
	console.log("deleteGroup");
	console.log(this.state.currentDelete);
	var data = JSON.stringify({
		id: this.state.currentDelete.id
	});

	  console.log(data);
	  AuthorizedAxios().delete("/api/admin/group", { data: data })
		.then(response => {
			console.log(response.data);
			this.refresh();
		})
		.catch(error => {
			console.log(error);
		})
		.then(() => {
			this.deleteHide();
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
        }
        break;
      case 'add':
        switch (field) {
          case 'name':
            this.setState(prev => ({ addState: { ...prev.addState, name: value } }));
            break;
        }
    }
  }

  createRow(obj) {
    console.log("Create row");
    console.log(obj);
    const { classes } = this.props;

    return (
      <Material.TableRow hover tabIndex={-1} key={obj.id}>
        <Material.TableCell component="th" scope="row">
          {obj.id}
        </Material.TableCell>
        <Material.TableCell>
          {obj.name}
        </Material.TableCell>
        <Material.TableCell>
          <Material.Button
            variant="contained"
            color="secondary"
            onClick={() => this.editShow(obj)}>
            Edit
              <Icons.Edit className={classes.rightIcon} />
          </Material.Button>
        </Material.TableCell>
        <Material.TableCell>
          <Material.Button
            variant="contained"
            className={classNames(classes.danger)}
            onClick={() => this.deleteShow(obj)}>
            Delete
              <Icons.Delete className={classes.rightIcon} />
          </Material.Button>
        </Material.TableCell>
      </Material.TableRow>
    );
  }

  refresh() {
    console.log("refresh");
    AuthorizedAxios().get("/api/admin/group")
      .then(response => {
        console.log("Refresh");
        console.log(response);
        this.setState({ data: response.data });
      }).catch(error => {
        console.log(error);
      });
  }

  render() {
    const { fullScreen, classes, theme } = this.props;

    let token = localStorage.getItem(TokenLocalKey);

    if (token == null)
      return (<Redirect to="/login" />);
    else
      return (
        <Material.Grid container direction="column" justify="center" alignItems="center" className={classes.flexContainer}>
          <Material.Grid className={classNames(classes.table)}>
            <Material.Grid container direction="row" justify="space-between" alignItems="flex-end">
              <Material.Button
                variant="contained"
                onClick={this.refresh}>
                Refresh
                <Icons.Refresh className={classes.rightIcon} />
              </Material.Button>
              <Material.Button
                variant="contained"
                className={classNames(classes.add)}
                onClick={this.addShow}>
                Add
              <Icons.Add className={classes.rightIcon} />
              </Material.Button>
            </Material.Grid>

            <CustomizableTable
              headers={this.state.headers}
              data={this.state.data}
              title="Groups"
              createRow={this.createRow}
            />
          </Material.Grid>

          <Material.Dialog
            fullScreen={fullScreen}
            open={this.state.deleteOpen}
            onClose={this.deleteHide}
            aria-labelledby="responsive-dialog-title">

            <Material.DialogTitle id="responsive-dialog-title">
              {"Groups delete"}
            </Material.DialogTitle>

            <Material.DialogContent>
              <Material.DialogContentText>
                {"Are you sure you want to delete this group?"}
              </Material.DialogContentText>
            </Material.DialogContent>
            <Material.DialogActions>
              <Material.Button onClick={this.deleteHide}>
                Cancel
              </Material.Button>
              <Material.Button
                onClick={this.deleteGroup}
                className={classes.foregroundDanger}
                autoFocus>
                Delete
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
              Create new group
            </Material.DialogTitle>

            <Material.DialogContent className={classes.flexContainer}>

              <Material.FormControl className={classes.m4}
                error={this.state.addErrors.name}>
                <Material.InputLabel htmlFor="add-name-input">Name</Material.InputLabel>
                <Material.Input
                  id="add-name-input"
                  value={this.state.addState.name}
                  onChange={(e) => this.changeField(e, 'add', 'name')}
                  aria-describedby="add-name-err"
                />
                <Material.FormHelperText id="add-name-err"
                  className={classNames(this.state.addErrors.name ? classes.displayInherit : classes.displayNone)}>
                  Name is required
                </Material.FormHelperText>
              </Material.FormControl>

            </Material.DialogContent>
            <Material.DialogActions>
              <Material.Button onClick={this.addHide}>
                Cancel
              </Material.Button>
              <Material.Button
                onClick={this.addSubmit}
                className={classes.foregroundDanger}
                autoFocus>
                Submit
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
              Group edit
            </Material.DialogTitle>

            <Material.DialogContent className={classes.flexContainer}>
              <Material.FormControl className={classes.m4}
                                    error={this.state.editErrors.name}>
                <Material.InputLabel htmlFor="edit-name-input">Name</Material.InputLabel>
                <Material.Input
                  id="edit-name-input"
                  value={this.state.editState.name}
                  onChange={(e) => this.changeField(e, 'edit', 'name')}
                  aria-describedby="edit-name-err"
                />
                <Material.FormHelperText id="edit-name-err"
                                         className={classNames(this.state.editErrors.name ? classes.displayInherit : classes.displayNone)}>
                  Name is required
                </Material.FormHelperText>
              </Material.FormControl>
            </Material.DialogContent>

            <Material.DialogActions>
              <Material.Button onClick={this.editHide}>
                Cancel
              </Material.Button>
              <Material.Button
                onClick={this.editSubmit}
                className={classes.foregroundDanger}
                autoFocus>
                Submit
              </Material.Button>
            </Material.DialogActions>
          </Material.Dialog>
        </Material.Grid>
      );
  }
}

Groups.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Groups);