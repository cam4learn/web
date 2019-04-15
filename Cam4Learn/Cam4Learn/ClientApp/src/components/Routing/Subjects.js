import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import * as Icons from '@material-ui/icons';
import * as Material from '@material-ui/core';
import { TokenLocalKey, AuthorizedAxios, UnauthorizedAxios } from '../api';
import { downloadFile } from '../fileDownload';

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
  exportCSV: {
    'background-color': '#9ccc65',
    '&:hover': {
      'background-color': '#6b9b37'
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
  },
  mt4: {
    'margin-top': '1rem'
  }
});

class Subjects extends Component {
  constructor(props) {
    super(props);

    this.classes = this.props.classes;
    this.theme = this.props.theme;

    this.state = {
      data: [],
      lecturers: [],
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
          id: 'lectName',
          numeric: false,
          disablePadding: false,
          label: 'Lecturer name',
        },
        {
          id: 'lectSurname',
          numeric: false,
          disablePadding: false,
          label: 'Lecturer surname',
        },
        {
          id: 'deleteBtn',
          numeric: false,
          disablePadding: false,
          label: 'Delete'
        }
      ],

      deleteOpen: false,
      currentDelete: { },

      editAddOpen: false,
      currentEdit: { },
      isEdit: false,
      addEditTitle: 'Add subject',

      subjectName: '',
      lectorId: 0
    }

    this.refresh = this.refresh.bind(this);
    this.createRow = this.createRow.bind(this);

    this.showDelete = this.showDelete.bind(this);
    this.hideDelete = this.hideDelete.bind(this);
    this.deleteSubject = this.deleteSubject.bind(this);

    this.showEdit = this.showEdit.bind(this);
    this.showAdd = this.showAdd.bind(this);
    this.hideAddEdit = this.hideAddEdit.bind(this);
    this.addSubject = this.addSubject.bind(this);
    this.editSubject = this.editSubject.bind(this);
    this.addEditSubmit = this.addEditSubmit.bind(this);

    this.onChangeInput = this.onChangeInput.bind(this);
    this.exportCSV = this.exportCSV.bind(this);

    this.refresh();
  }

  createRow(obj) {
    console.log("Create row");
    console.log(obj);
    return (
        <Material.TableRow hover tabIndex={-1} key={obj.id}>
          <Material.TableCell component="th" scope="row">
            {obj.id}
          </Material.TableCell>
          <Material.TableCell>{obj.title}</Material.TableCell>
          <Material.TableCell>{obj.name}</Material.TableCell>
          <Material.TableCell>{obj.surname}</Material.TableCell>
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

  showDelete(obj) {
    console.log("showDelete");
    this.setState({ deleteOpen: true, currentDelete: obj });
  }

  hideDelete() {
    console.log("hideDelete");
    this.setState({ deleteOpen: false, currentDelete: {} });
  }

  deleteSubject() {
    console.log("deleteSubject");
    console.log(this.state.currentDelete);
    var data = JSON.stringify({
      id: this.state.currentDelete.id
    });

    AuthorizedAxios.delete("/api/admin/deleteSubject", { data: data })
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

  showEdit(obj) {
    console.log("showEdit");

    this.setState({
      addEditTitle: 'Edit subject',
      isEdit: true,
      currentEdit: obj,
      subjectName: obj.title,
      editAddOpen: true
    });
  }

  showAdd() {
    console.log("showAdd");
    this.setState({
      addEditTitle: 'Add subject',
      isEdit: false,
      subjectName: '',
      editAddOpen: true,
      lectorId: 0
    });
  }

  hideAddEdit() {
    console.log("hideAddEdit");
    this.setState({
      isEdit: false,
      subjectName: '',
      editAddOpen: false
    });
  }

  addEditSubmit() {
    console.log("addEditSubmit");

    if (this.state.isEdit) {
      this.editSubject();
    }
    else {
      this.addSubject();
    }
  }

  addSubject() {
    console.log("addSubject");
    let data = JSON.stringify({
      lector: this.state.lectorId,
      title: this.state.subjectName
    });

    AuthorizedAxios.post("/api/admin/addSubject", data)
      .then(response => {
        console.log("Refresh");
        console.log(response);
        this.hideAddEdit();
        this.refresh();
      }).catch(error => {
        console.log(error);
      });
  }

  editSubject() {
    console.log("editSubject");
    

    this.hideAddEdit();
  }

  exportCSV() {
    UnauthorizedAxios.get('/getSubjectsCsv')
      .then(resp => {
        downloadFile('subjects.csv', resp.data);
      })
      .catch(err => {
        console.log(err);
      })
  }

  onChangeInput(name, e) {
    switch (name) {
      case 'subjectName':
        this.setState({ subjectName: e.target.value });
        break;
      case 'lecturer':
        this.setState({ lectorId: e.target.value });
        break;
    }
  }

  refresh() {
    console.log("refresh");
    AuthorizedAxios.get("/api/admin/getSubjects")
      .then(response => {
        console.log("Refresh");
        console.log(response);
        this.setState({ data: response.data });

        AuthorizedAxios.get("/api/lectors")
          .then(resp => {
            console.log("Lectors");
            console.log(resp);
            this.setState({ lecturers: resp.data });
            console.log(this.state.lecturers);
          })

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
              title="Subjects"
              createRow={this.createRow}
            />

            <Material.Grid container
              direction="row"
              justify="space-between"
              alignItems="flex-end"
              className={classNames(this.classes.mt4)} >
              <Material.Button
                variant="contained"
                className={classNames(this.classes.exportCSV)}
                onClick={this.exportCSV}>
                Export CSV
              <Icons.TableChart className={this.classes.rightIcon} />
              </Material.Button>
            </Material.Grid>
          </Material.Grid>

          <Material.Dialog
            fullScreen={fullScreen}
            open={this.state.deleteOpen}
            onClose={this.hideDelete}
            aria-labelledby="responsive-dialog-title">

            <Material.DialogTitle id="responsive-dialog-title">
              {"Subject delete"}
            </Material.DialogTitle>

            <Material.DialogContent>
              <Material.DialogContentText>
                {"Are you sure you want to delete this subject?"}
              </Material.DialogContentText>
            </Material.DialogContent>
            <Material.DialogActions>
              <Material.Button onClick={this.hideDelete}>
                Cancel
              </Material.Button>
              <Material.Button
                onClick={this.deleteSubject}
                className={this.classes.foregroundDanger}
                autoFocus>
                Delete
              </Material.Button>
            </Material.DialogActions>
          </Material.Dialog>

          <Material.Dialog
            fullScreen={fullScreen}
            open={this.state.editAddOpen}
            onClose={this.hideAddEdit}
            aria-labelledby="responsive-dialog-title">

            <Material.DialogTitle id="responsive-dialog-title">
              {this.state.addEditTitle}
            </Material.DialogTitle>

            <Material.DialogContent className={this.classes.flexContainer}>
              <Material.FormControl className={this.classes.m4}>
                <Material.InputLabel htmlFor="subject-name-input">Subject name</Material.InputLabel>
                <Material.Input
                  id="subject-name-input"
                  value={this.state.subjectName}
                  onChange={(e) => this.onChangeInput('subjectName', e)}
                />
              </Material.FormControl>

              <Material.FormControl className={this.classes.m4}>
                <Material.InputLabel htmlFor="lecturer-input">Lecturer</Material.InputLabel>
                <Material.Select
                  id="lecturer-input"
                  value={this.state.lectorId}
                  onChange={(e) => this.onChangeInput('lecturer', e)}>
                  {
                    this.state.lecturers.map((obj) => {
                      console.log("Render lects");
                      console.log(obj);
                      return (
                        <Material.MenuItem key={obj.id} value={obj.id}>
                          {obj.name + " " + obj.surname}
                        </Material.MenuItem>
                        )
                    })
                  }
                </Material.Select>
              </Material.FormControl>
            </Material.DialogContent>
            <Material.DialogActions>
              <Material.Button onClick={this.hideAddEdit}>
                Cancel
              </Material.Button>
              <Material.Button
                onClick={this.addEditSubmit}
                className={this.classes.foregroundDanger}
                autoFocus>
                Submit
              </Material.Button>
            </Material.DialogActions>
          </Material.Dialog>

        </Material.Grid>
        );
  }
}

Subjects.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Subjects);