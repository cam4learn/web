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


class Rooms extends Component {
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
          id: 'room',
          numeric: true,
          disablePadding: false,
          label: 'Room'
        },
        {
          id: 'mac',
          numeric: false,
          disablePadding: false,
          label: 'MAC Address'
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
	      room: '',
	      mac: ''
      },
      editErrors: {
	      room: false,
	      mac: false
      },

      addOpen: false,
      addState: {
	      id: 0,
	      room: '',
	      mac: ''
      },
      addErrors: {
	      room: false,
	      mac: false
      }
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
			  room: '',
			  mac: ''
		  },
		  addErrors: {
			  room: false,
			  mac: false
		  }
	  });
  }

  addSubmit = () => {
	  let err = false;
	  if (!this.state.addState.mac) {
		  this.setState(prev => ({ addErrors: { ...prev.addErrors, mac: true } }));
		  err = true;
	  }
	  if (!this.state.addState.room) {
		  this.setState(prev => ({ addErrors: { ...prev.addErrors, room: true } }));
		  err = true;
	  }

	  if (!err) {
		  let data = JSON.stringify({
			  address: this.state.addState.mac,
			  room: this.state.addState.room
		  });

		  AuthorizedAxios.post("/api/admin/device", data)
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
			  mac: obj.address,
			  room: obj.room
		  },
	  });
  }

  editHide = () => {
	  this.setState({
		  editOpen: false,
		  editState: {
			  id: 0,
			  room: '',
			  mac: ''
		  },
		  editErrors: {
			  room: false,
			  mac: false
		  }
	  });
  }

  editSubmit = () => {
	let err = false;
	if (!this.state.editState.mac) {
		this.setState(prev => ({ editErrors: { ...prev.editErrors, mac: true } }));
		err = true;
	}
	if (!this.state.editState.room) {
		this.setState(prev => ({ editErrors: { ...prev.editErrors, room: true } }));
		err = true;
	}

	  if (!err) {
		  let data = JSON.stringify({
			  id: this.state.editState.id,
			  address: this.state.editState.mac,
			  room: this.state.editState.room
		  });

		  AuthorizedAxios.patch("/api/admin/device", data)
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

  deleteRoom = () => {
	  console.log("deleteRoom");
	  console.log(this.state.currentDelete);
	  var data = JSON.stringify({
		  id: this.state.currentDelete.id
	  });

	  AuthorizedAxios.delete("/api/admin/device", { data: data })
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
	    case 'mac':
		    this.setState(prev => ({ editState: { ...prev.editState, mac: value } }));
		    break;
	    case 'room':
		    this.setState(prev => ({ editState: { ...prev.editState, room: value } }));
		    break;
	    }
	    break;
    case 'add':
	    switch (field) {
	    case 'mac':
		    this.setState(prev => ({ addState: { ...prev.addState, mac: value } }));
		    break;
	    case 'room':
		    this.setState(prev => ({ addState: { ...prev.addState, room: value } }));
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
          {obj.room}
        </Material.TableCell>
        <Material.TableCell>
          {obj.address}
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
    AuthorizedAxios.get("/api/admin/device")
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
              title="Rooms"
              createRow={this.createRow}
            />
          </Material.Grid>

          <Material.Dialog
            fullScreen={fullScreen}
            open={this.state.deleteOpen}
            onClose={this.deleteHide}
            aria-labelledby="responsive-dialog-title">

            <Material.DialogTitle id="responsive-dialog-title">
              {"Room delete"}
            </Material.DialogTitle>

            <Material.DialogContent>
              <Material.DialogContentText>
                {"Are you sure you want to delete this room?"}
              </Material.DialogContentText>
            </Material.DialogContent>
            <Material.DialogActions>
              <Material.Button onClick={this.deleteHide}>
                Cancel
              </Material.Button>
              <Material.Button
                onClick={this.deleteRoom}
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
              Room edit
            </Material.DialogTitle>

			<Material.DialogContent className={this.classes.flexContainer}>

				<Material.FormControl className={this.classes.m4} error={this.state.editErrors.mac}>
					<Material.InputLabel htmlFor="edit-name-input">Address</Material.InputLabel>
						<Material.Input
							  id="edit-mac-input"
							  value={this.state.editState.mac}
							  onChange={(e) => this.changeField(e, 'edit', 'mac')}
							  aria-describedby="edit-mac-err" />
					<Material.FormHelperText id="edit-mac-err"
							  className={classNames(this.state.editErrors.mac ? this.classes.displayInherit : this.classes.displayNone)}>
							  Address is required
					</Material.FormHelperText>
				</Material.FormControl>

				<Material.FormControl className={this.classes.m4}
						  error={this.state.editErrors.room}>
						  <Material.InputLabel htmlFor="edit-surname-input">Room</Material.InputLabel>
						  <Material.Input
							  id="edit-room-input"
							  value={this.state.editState.room}
							  onChange={(e) => this.changeField(e, 'edit', 'room')}
							  aria-describedby="edit-room-err">
						  </Material.Input>
					<Material.FormHelperText id="edit-room-err"
							className={classNames(this.state.editErrors.room ? this.classes.displayInherit : this.classes.displayNone)}>
							Room is required and should be numeric
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
              Create new room
            </Material.DialogTitle>

            <Material.DialogContent className={this.classes.flexContainer}>

			<Material.FormControl className={this.classes.m4} error={this.state.addErrors.mac}>
				<Material.InputLabel htmlFor="add-mac-input">
					Address
				</Material.InputLabel>

				<Material.Input
					id="add-mac-input"
					value={this.state.addState.mac}
					onChange={(e) => this.changeField(e, 'add', 'mac')}
					aria-describedby="add-mac-err"
					/>
				<Material.FormHelperText id="add-mac-err"
					className={classNames(this.state.addErrors.mac ? this.classes.displayInherit : this.classes.displayNone)}>
					Address is required
				</Material.FormHelperText>
			</Material.FormControl>

			<Material.FormControl className={this.classes.m4}error={this.state.addErrors.room}>
				<Material.InputLabel htmlFor="add-room-input">
				Room
				</Material.InputLabel>
				<Material.Input
				  id="add-room-input"
				  value={this.state.addState.room}
				  onChange={(e) => this.changeField(e, 'add', 'room')}
				  aria-describedby="add-room-err">
			  </Material.Input>
				<Material.FormHelperText id="add-room-err"
				  className={classNames(this.state.addErrors.room ? this.classes.displayInherit : this.classes.displayNone)}>
				  Room is required and should be numeric
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
}

Rooms.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Rooms);