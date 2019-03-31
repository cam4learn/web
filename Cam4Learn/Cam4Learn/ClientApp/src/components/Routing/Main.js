import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class Main extends Component {
  render() {
    return (<Redirect to="/lecturers"/> );
  }
}