import React from 'react';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import * as Material from '@material-ui/core';
import * as Icons from '@material-ui/icons';

import { TokenLocalKey, RoleLocalKey } from './api';

const drawerWidth = 260;

const styles = theme => ({
  root: {
    display: 'flex',
    width: `100%`,
    margin: 0
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
    display: `flex`,
    flexDirection: `column`,
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
  grow: {
    flexGrow: 1,
  }
});

class PersistentDrawerLeft extends React.Component {
  constructor(props) {
    super(props);

    this.classes = this.props.classes;
    this.theme = this.props.theme;
    this.state = {
      open: false,
      role: this.props.role
    };

    this.routes = this.props.routes;
    if (this.routes == undefined)
      this.routes = [];

    this.logout = this.logout.bind(this);
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;
    let token = localStorage.getItem(TokenLocalKey); 
    let role = localStorage.getItem(RoleLocalKey) || 'NoneAuth';

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

            <div className={this.classes.grow} />

            <Material.IconButton onClick={this.logout} color="inherit"
              className={classNames((this.state.role == null) && this.classes.hide)}>
              <Icons.ExitToApp />
            </Material.IconButton>
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
            {
              this.routes
                .filter(obj => obj.role.indexOf(role) != -1)
                .map((obj, ind) => (
                <Material.Link component={RouterLink} to={obj.route} style={{ textDecoration: 'none' }} key={obj.title}>
                  <Material.ListItem button>
                    <Material.ListItemIcon>{obj.icon}</Material.ListItemIcon>
                    <Material.ListItemText primary={obj.title} />
                  </Material.ListItem>
                </Material.Link>
                ))
            }
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

  logout() {
    localStorage.removeItem(TokenLocalKey);
    localStorage.removeItem(RoleLocalKey);
    this.props.authCallback();
  }
}

PersistentDrawerLeft.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PersistentDrawerLeft);
