import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import * as Icons from '@material-ui/icons';
import * as Material from '@material-ui/core';
import { UnauthorizedAxios } from '../api';
import { downloadFile } from '../fileDownload';

import CustomizableTable from '../CustomizableTable';

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
  },
  exportCSV: {
    'background-color': '#9ccc65',
    '&:hover': {
      'background-color': '#6b9b37'
    }
  },
  exportJSON: {
    'background-color': '#bdbdbd',
    '&:hover': {
      'background-color': '#8d8d8d'
    }
  },
  table: {
    marginLeft: theme.spacing.unit * 6,
    marginRight: theme.spacing.unit * 6
  },
  mt4: {
    'margin-top': '1rem'
  }
});

class Export extends Component {
  constructor(props) {
    super(props);

    this.classes = this.props.classes;
    this.theme = this.props.theme;

    this.state = {
      data: [],
      headers: [
        {
          id: 'surname',
          numeric: true,
          disablePadding: false,
          label: 'Surname'
        },
        {
          id: 'group',
          numeric: false,
          disablePadding: false,
          label: 'Group'
        },
        {
          id: 'value',
          numeric: true,
          disablePadding: false,
          label: 'Value',
        },
        {
          id: 'isPresent',
          numeric: false,
          disablePadding: false,
          label: 'Is Present',
        }
      ],
    };

    this.exportCSV = this.exportCSV.bind(this);
    this.exportJSON = this.exportJSON.bind(this);
    this.createRow = this.createRow.bind(this);
    this.refresh = this.refresh.bind(this);

    this.refresh();
  }

  exportCSV() {
    UnauthorizedAxios.get('/subjectStatisticCsv?subjectId=7')
      .then(resp => {
        downloadFile('subjectStatitics.csv', resp.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  exportJSON() {
    UnauthorizedAxios.get('/subjectStatisticJson?subjectId=7')
      .then(response => {
        downloadFile('subjectStatitics.json',
          JSON.stringify(response.data[0].attendanceList));
      })
      .catch(err => {
        console.log(err);
      });
  }

  createRow(obj) {
    return (
      <Material.TableRow hover tabIndex={-1} key={obj.id}>
        <Material.TableCell>{obj.surname}</Material.TableCell>
        <Material.TableCell>{obj.group}</Material.TableCell>
        <Material.TableCell>{obj.value}</Material.TableCell>
        <Material.TableCell>
          {
            obj.isPresent
              ? <Icons.Done />
              : <Icons.Clear />
          }
        </Material.TableCell>
      </Material.TableRow>
    );
  }

  refresh() {
    UnauthorizedAxios.get("/subjectStatisticJson?subjectId=7")
      .then(response => {
        console.log(response.data);
        this.setState({ data: response.data[0].attendanceList });
      }).catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <Material.Grid container direction="column" justify="center" alignItems="center" className={this.classes.flexContainer}>
        <Material.Grid className={classNames(this.classes.table)}>
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

            <Material.Button
              variant="contained"
              className={classNames(this.classes.exportJSON)}
              onClick={this.exportJSON}>
              Export JSON
              <Icons.TableChart className={this.classes.rightIcon} />
            </Material.Button>

          </Material.Grid>
        </Material.Grid>
      </Material.Grid>
    );
  }
}

Export.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Export);