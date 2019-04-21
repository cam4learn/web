import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import * as Icons from '@material-ui/icons';
import * as Material from '@material-ui/core';
import { TokenLocalKey, AuthorizedAxios } from '../../api';

import Groups from './Groups';
import Students from './Students';

const styles = theme => ({
  flexContainer: {
    'display': [['flex'], '!important'],
    'flex-direction': [['column'], '!important'],
    'flex-grow': [[1], '!important'],
  },
});

class GroupsRouter extends Component {
  render() {
    let { classes } = this.props;

    return (
      <Material.Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.flexContainer}>
        <Switch>
          <Route exact path="/groups/list" component={Groups} />
          <Route exact path="/groups/:id/students" component={Students} />
        </Switch>
      </Material.Grid>
      );
  }
}

GroupsRouter.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GroupsRouter);