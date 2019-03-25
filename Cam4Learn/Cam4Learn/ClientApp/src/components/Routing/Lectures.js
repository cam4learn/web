import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { TokenLocalKey } from '../api';

export default class Lectures extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let token = localStorage.getItem(TokenLocalKey);

    if (token == null)
      return (<Redirect to="/login" />);
    else
      return (<h1>Lectures</h1>);
  }
}