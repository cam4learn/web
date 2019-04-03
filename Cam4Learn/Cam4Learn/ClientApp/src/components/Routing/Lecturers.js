import React, { Component } from 'react';
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
    console.log(this.classes);
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
      currentDelete: {},
    }

    this.createRow = this.createRow.bind(this);
    this.refresh = this.refresh.bind(this);

    this.refresh();
  }

  showAdd = () => {

  }

  showEdit = (obj) => {

  } 

  showDelete = (obj) => {
    this.setState({
      deleteOpen: true,
      currentDelete: obj
    });
  }

  hideDelete = () => {
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

    AuthorizedAxios.delete("/api/admin/deleteLector", { data: data })
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
            onClick={() => this.showEdit(obj)}>
            Edit
              <Icons.Edit className={this.classes.rightIcon} />
          </Material.Button>
        </Material.TableCell>
        <Material.TableCell>
          <Material.Button
            variant="contained"
            className={classNames(this.classes.danger)}
            onClick={() => this.showDelete(obj)}>
            Delete
              <Icons.Delete className={this.classes.rightIcon} />
          </Material.Button>
        </Material.TableCell>
      </Material.TableRow>
    );
  }

  refresh() {
    console.log("refresh");
    AuthorizedAxios.get("/api/admin/getLectors")
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
                onClick={this.showAdd}>
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
            onClose={this.hideDelete}
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
              <Material.Button onClick={this.hideDelete}>
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
        </Material.Grid>
      );

    //TODO: "Add" and "Edit" dialogs
  }
}

Lecturers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Lecturers);