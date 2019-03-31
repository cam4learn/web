import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import * as Icons from '@material-ui/icons';
import * as Material from '@material-ui/core';
import { TokenLocalKey, AuthorizedAxios } from '../api';

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
  }
});


class Lecturers extends Component {
  constructor(props) {
    super(props);

    this.classes = this.props.classes;
    this.theme = this.props.theme;
  }

  render() {
    let token = localStorage.getItem(TokenLocalKey);

    if (token == null)
      return (<Redirect to="/login" />);
    else
      return (
        <Material.Grid container direction="column" justify="center" alignItems="center" className={this.classes.flexContainer}>
          Work in progress
        </Material.Grid>
        );
  }
}

Lecturers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Lecturers);