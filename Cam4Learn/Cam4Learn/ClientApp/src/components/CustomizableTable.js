import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import * as Material from '@material-ui/core';
import * as Icons from '@material-ui/icons';

/*
 *            TABLE GUIDE
 * To create table, you need 4 things:
 * 1. Array of header-objects of the table that will be displayed on top. 
 * Structure:
 *    {
 *      id: 'string',   --- Id of field
 *      numeric: true / false   --- If it's numeric, it can be sorted (in table)
 *      disablePadding: true / false   --- JUST enter false for normal use
 *      label: 'string'  --- Label in header
 *    }
 * 2. Array of appropriate data (use Axios, see in Subjects page)
 * 3. Title of table (string)
 * 4. Function (callback) that takes object and returns React markup (render of 1 row)
 * 
 */

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

class CustomizableTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  constructor(props) {
    super(props);

    this.state = {
      headers: this.props.headers
    }
  }

  render() {
    const { order, orderBy, rowCount, headers } = this.props;

    return (
      <Material.TableHead>
        <Material.TableRow>
          {
            headers.map(
            row => (
              <Material.TableCell
                key={row.id}
                margin={row.margin || 0}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Material.Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <Material.TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </Material.TableSortLabel>
                </Material.Tooltip>
              </Material.TableCell>
            ),
            this,
          )}
        </Material.TableRow>
      </Material.TableHead>
    );
  }
}

CustomizableTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

let CustomizableTableToolbar = props => {
  const { classes, title } = props;

  return (
    <Material.Toolbar className={classNames(classes.root)}>
      <div className={classes.title}>
         <Material.Typography variant="h6" id="tableTitle">
            {title}
         </Material.Typography>
      </div>
      <div className={classes.spacer} />
    </Material.Toolbar>
  );
};

CustomizableTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired
};

CustomizableTableToolbar = withStyles(toolbarStyles)(CustomizableTableToolbar);

class CustomizableTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: 'asc',
      orderBy: 'calories',
      page: 0,
      rowsPerPage: 5,
    };
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { classes, createRow, data, headers } = this.props;
    const { order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    console.log("Render table");
    console.log(data);

    return (
      <Material.Paper className={classes.root}>
        <CustomizableTableToolbar title={this.props.title} />
        <div className={classes.tableWrapper}>
          <Material.Table className={classes.table} aria-labelledby="tableTitle">
            <CustomizableTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
              headers={headers}
            />
            <Material.TableBody>
              {
                stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => createRow(n))
              }
              {emptyRows > 0 && (
                <Material.TableRow style={{ height: 49 * emptyRows }}>
                  <Material.TableCell colSpan={6} />
                </Material.TableRow>
              )}
            </Material.TableBody>
          </Material.Table>
        </div>
        <Material.TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Material.Paper>
    );
  }
}

CustomizableTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomizableTable);