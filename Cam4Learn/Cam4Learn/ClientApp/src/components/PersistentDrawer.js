import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import * as Material from '@material-ui/core';
import * as Icons from '@material-ui/icons';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
});

class PersistentDrawerLeft extends React.Component {
  constructor(props) {
    super(props);

    this.classes = this.props.classes;
    this.theme = this.props.theme;
    this.state = {
      open: false
    };
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;

    return (
      <div className={this.classes.root}>
        <Material.CssBaseline />
        <Material.AppBar
          position="fixed"
          className={classNames(this.classes.appBar, {
            [this.classes.appBarShift]: open,
          })}
        >
          <Material.Toolbar disableGutters={!open}>
            <Material.IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(this.classes.menuButton, open && this.classes.hide)}
            >
              <Icons.Menu />
            </Material.IconButton>
            <Material.Typography variant="h6" color="inherit" noWrap>
              {this.props.heading}
            </Material.Typography>
          </Material.Toolbar>
        </Material.AppBar>
        <Material.Drawer
          className={this.classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: this.classes.drawerPaper,
          }}
        >
          <div className={this.classes.drawerHeader}>
            <Material.IconButton onClick={this.handleDrawerClose}>
              {this.theme.direction === 'ltr' ? <Icons.ChevronLeft /> : <Icons.ChevronRight />}
            </Material.IconButton>
          </div>
          <Material.Divider />
          <Material.List>
            <Material.ListItem button key="">
              <Material.ListItemIcon><Icons.List /></Material.ListItemIcon>
              <Material.ListItemText primary="Lectures" />
            </Material.ListItem>
            <Material.ListItem button key="">
              <Material.ListItemIcon><Icons.Group /></Material.ListItemIcon>
              <Material.ListItemText primary="Students" />
            </Material.ListItem>
          </Material.List>
        </Material.Drawer>
        <main
          className={classNames(this.classes.content, {
            [this.classes.contentShift]: open,
          })}
        >
          <div className={this.classes.drawerHeader} />
          {React.cloneElement(this.props.children)}
        </main>
      </div>
    );
  }
}

PersistentDrawerLeft.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PersistentDrawerLeft);
