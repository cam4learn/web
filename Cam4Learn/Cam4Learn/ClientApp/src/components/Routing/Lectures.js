import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class Lectures extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let token = localStorage.getItem(this.props.tknKey);

    if (token == null)
      return (<Redirect to="/login" />);
    else
      return (<h1>Lectures</h1>);
  }
}