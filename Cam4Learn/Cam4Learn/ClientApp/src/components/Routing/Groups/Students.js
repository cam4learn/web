import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import * as Icons from '@material-ui/icons';
import * as Material from '@material-ui/core';
import { TokenLocalKey, AuthorizedAxios } from '../../api';
import Dropzone from 'react-dropzone'

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
  upload: {
    'background-color': '#29b6f6',
    '&:hover': {
      'background-color': '#2196f3'
    }
  },
  foregroundDanger: {
    'color': '#F44336'
  },
  foregroundAdd: {
    'color': '#4CAF50'
  },
  m4: {
    'margin': '1rem'
  },
  p4: {
    'padding': '1rem'
  },
  dropzone: {
    'display': 'flex',
    'align-items': 'center',
    'justify-content': 'center',
    'border-style': 'dashed',
    'border-color': '#3f51b5',
    'min-height': '20rem'
  },
  dropzoneText: {
    'text-align': [['center'], '!important'],
    'font-size': '1rem'
  }
});


class Students extends Component {
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
          label: 'Id'
        },
        {
          id: 'studentName',
          numeric: false,
          disablePadding: false,
          label: 'Name'
        },
        {
          id: 'studentSurname',
          numeric: false,
          disablePadding: false,
          label: 'Surname'
        },
        {
          id: 'studentGroup',
          numeric: false,
          disablePadding: false,
          label: 'Group'
        },
        {
          id: 'isTaught',
          numeric: false,
          disablePadding: false,
          label: 'Photo uploaded'
        },
        {
          id: 'uploadBtn',
          numeric: false,
          disablePadding: false,
          label: 'Upload Photo',
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
      groups: [],

      deleteOpen: false,
      deleteState: {},

      editOpen: false,
      editState: {
        id: -1,
        name: '',
        surname: '',
        groupId: -1
      },
      editErrors: {
        name: false,
        surname: false,
        group: false
      },

      addOpen: false,
      addState: {
        id: -1,
        name: '',
        surname: '',
        groupId: -1
      },
      addErrors: {
        name: false,
        surname: false,
        group: false
      },

      uploadOpen: false,
      uploadId: -1
    }

    this.groupId = this.props.match.params.id;

    this.createRow = this.createRow.bind(this);
    this.refresh = this.refresh.bind(this);

    this.refresh();
  }

  addShow = () => {
    this.setState({
      addOpen: true,
      addState: {
        groupId: (this.state.groups[0] || {}).id,
      }
    });
  }

  addHide = () => {
    this.setState({
      addOpen: false,
      addState: {
        name: '',
        surname: '',
        groupId: -1
      },
      addErrors: {
        name: false,
        surname: false,
        group: false
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
    if (!this.state.addState.groupId) {
      this.setState(prev => ({ addErrors: { ...prev.addErrors, group: true } }));
      err = true;
    }

    if (!err) {
      let data = JSON.stringify({
        name: this.state.addState.name,
        surname: this.state.addState.surname,
        groupId: this.state.addState.groupId
      });

      AuthorizedAxios().post("/api/admin/student", data)
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
        groupId: this.state.groups.find(x => x.name === obj.group).id,
      },
    });
  }

  editHide = () => {
    this.setState({
      editOpen: false,
      editState: {
        id: -1,
        name: '',
        surname: '',
        groupId: -1,
      },
      editErrors: {
        name: false,
        surname: false,
      }
    });
  }

  editSubmit = () => {
    let err = false;
    console.log('edit submit', this.state.editState);
    if (!this.state.editState.name) {
      this.setState(prev => ({ editErrors: { ...prev.editErrors, name: true } }));
      err = true;
    }
    if (!this.state.editState.surname) {
      this.setState(prev => ({ editErrors: { ...prev.editErrors, surname: true } }));
      err = true;
    }

    if (!err) {
      const data = JSON.stringify({
        id: this.state.editState.id,
        name: this.state.editState.name,
        surname: this.state.editState.surname,
        groupId: this.state.editState.groupId,
      });

      AuthorizedAxios().patch("/api/admin/student", data)
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

  deleteStudent = () => {
    console.log('delete', this.state.currentDelete);
    AuthorizedAxios().delete("/api/admin/student", { params: { id: this.state.currentDelete.id } })
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

  uploadShow = (id) => {
    this.setState({
      uploadOpen: true,
      uploadId: id
    });
  }

  uploadHide = () => {
    this.setState({
      uploadOpen: false,
      uploadId: -1
    });
  }

  uploadSubmit = (files) => {
    let file = files[0];
    console.log(file);
    let id = this.state.uploadId;

    if (file != undefined) {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        const binaryStr = reader.result;
        const baseStr = btoa(binaryStr);
        AuthorizedAxios()
          .post("/api/admin/teachStudent", {
          id: id,
          photo: baseStr
        })
          .then(response => {
            console.log("Refresh");
            console.log(response);
            this.uploadHide();
          }).catch(error => {
            console.log(error);
          });
      }
      reader.readAsBinaryString(file);
    }
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
          case 'groupId':
            this.setState(prev => ({ editState: { ...prev.editState, groupId: value } }));
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
          case 'groupId':
            this.setState(prev => ({ addState: { ...prev.addState, groupId: value } }));
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
          {obj.group}
        </Material.TableCell>
        <Material.TableCell>
          {
            obj.isPresent
              ? <Icons.Done />
              : <Icons.Clear />
          }
        </Material.TableCell>
        <Material.TableCell>
          <Material.Button
            variant="contained"
            className={classNames(this.classes.upload)}
            onClick={() => this.uploadShow(obj.id)}>
            Upload
            <Icons.CloudUpload className={this.classes.rightIcon} />
          </Material.Button>
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
    AuthorizedAxios().get("/api/admin/student")
      .then(response => {
        console.log("Refresh");
        console.log(response);
        this.setState({ data: response.data });
      }).catch(error => {
      console.log(error);
    });
    AuthorizedAxios().get("/api/admin/group")
      .then(response => {
        console.log("Refresh");
        console.log(response);
        this.setState({ groups: response.data });
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
              title="Students"
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
                {"Are you sure you want to delete this student?"}
              </Material.DialogContentText>
            </Material.DialogContent>
            <Material.DialogActions>
              <Material.Button onClick={this.deleteHide}>
                Cancel
              </Material.Button>
              <Material.Button
                onClick={this.deleteStudent}
                className={this.classes.foregroundDanger}
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
              Create new student
            </Material.DialogTitle>

            <Material.DialogContent className={this.classes.flexContainer}>

              <Material.FormControl className={this.classes.m4} error={this.state.addErrors.name}>
                <Material.InputLabel htmlFor="add-name-input">
                  Name
                </Material.InputLabel>

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

              <Material.FormControl className={this.classes.m4} error={this.state.addErrors.surname}>
                <Material.InputLabel htmlFor="add-surname-input">
                  Surname
                </Material.InputLabel>
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

              <Material.FormControl className={this.classes.m4} error={this.state.addErrors.group}>
                <Material.InputLabel htmlFor="add-group-input">
                  Group
                </Material.InputLabel>
                <Material.Select
                  id="add-group-input"
                  value={this.state.addState.groupId}
                  onChange={(e) => this.changeField(e, 'add', 'groupId')}>
                  {
                    this.state.groups.map((obj) => {
                      console.log("Render group select");
                      console.log(obj);
                      return (
                        <Material.MenuItem key={obj.id} value={obj.id}>
                          {obj.name}
                        </Material.MenuItem>
                      )
                    })
                  }
                </Material.Select>
                <Material.FormHelperText id="add-group-err"
                  className={classNames(this.state.addErrors.group ? this.classes.displayInherit : this.classes.displayNone)}>
                  Group is required
                </Material.FormHelperText>
              </Material.FormControl>

            </Material.DialogContent>

            <Material.DialogActions>
              <Material.Button
                onClick={this.addHide}
                className={this.classes.foregroundDanger}>>
                Cancel
              </Material.Button>
              <Material.Button
                onClick={this.addSubmit}
                className={this.classes.foregroundAdd}
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

            <Material.DialogContent className={this.classes.flexContainer}>
              <Material.FormControl className={this.classes.m4} error={this.state.editErrors.name}>
                <Material.InputLabel htmlFor="edit-name-input">
                  Name
                </Material.InputLabel>

                <Material.Input
                  id="edit-name-input"
                  value={this.state.editState.name}
                  onChange={(e) => this.changeField(e, 'edit', 'name')}
                  aria-describedby="edit-name-err"
                />
                <Material.FormHelperText id="edit-name-err"
                  className={classNames(this.state.editErrors.name ? this.classes.displayInherit : this.classes.displayNone)}>
                  Name is required
                </Material.FormHelperText>
              </Material.FormControl>

              <Material.FormControl className={this.classes.m4} error={this.state.editErrors.surname}>
                <Material.InputLabel htmlFor="edit-surname-input">
                  Surname
                </Material.InputLabel>
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

              <Material.FormControl className={this.classes.m4} error={this.state.editErrors.group}>
                <Material.InputLabel htmlFor="edit-group-input">
                  Group
                </Material.InputLabel>
                <Material.Select
                  id="edit-group-input"
                  value={this.state.editState.groupId}
                  onChange={(e) => this.changeField(e, 'edit', 'groupId')}>
                  {
                    this.state.groups.map((obj) => {
                      console.log("Render group select");
                      console.log(obj);
                      return (
                        <Material.MenuItem key={obj.id} value={obj.id}>
                          {obj.name}
                        </Material.MenuItem>
                      )
                    })
                  }
                </Material.Select>
                <Material.FormHelperText
                  id="edit-group-err"
                  className={classNames(this.state.editErrors.group ? this.classes.displayInherit : this.classes.displayNone)}>
                  Group is required
                </Material.FormHelperText>
              </Material.FormControl>
            </Material.DialogContent>
            <Material.DialogActions>
              <Material.Button
                onClick={this.editHide}
                className={this.classes.foregroundDanger}>
                Cancel
              </Material.Button>
              <Material.Button
                onClick={this.editSubmit}
                className={this.classes.foregroundAdd}
                autoFocus>
                Submit
              </Material.Button>
            </Material.DialogActions>
          </Material.Dialog>

          <Material.Dialog
            fullScreen={fullScreen}
            open={this.state.uploadOpen}
            maxWidth='sm'
            fullWidth={true}
            onClose={this.uploadHide}
            aria-labelledby="upload-dialog-title">

            <Material.DialogTitle id="upload-dialog-title">
              Upload photo
            </Material.DialogTitle>

            <Material.DialogContent
              className={classNames(this.classes.flexContainer, this.classes.p4)}
              >
              <Dropzone
                accept="image/jpeg"
                onDrop={acceptedFiles => this.uploadSubmit(acceptedFiles)}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}
                      className={classNames(this.classes.dropzone, this.classes.p4)}
                    >
                      <input
                        {...getInputProps()}
                      />
                      <Material.Typography
                        variant="h6"
                        className={this.classes.dropzoneText}>
                        Drag 'n' drop file here, or click to select file (.jpg)
                      </Material.Typography>
                    </div>
                  </section>
                )}
              </Dropzone>
            </Material.DialogContent>
          </Material.Dialog>

        </Material.Grid>
      );
  }
}

Students.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Students);