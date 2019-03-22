import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class Main extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var redirect = "/lectures";
    if (localStorage.getItem("cam4studyTkn") == null)
      redirect = "/login";
      
    return (
      <Redirect to={redirect} />
    );
  }
}