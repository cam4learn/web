import axios from 'axios';

var url = 'http://104.196.250.21:8030/';
var tknKey = "cam4learnTkn";
var roleKey = "cam4learnRole";

export var AuthorizedAxios = axios.create({
  baseURL: url,
  headers: {
    'JWT': localStorage.getItem(tknKey),
    'Content-Type': 'application/json',
  }
}),
  UnauthorizedAxios = axios.create({
    baseURL: url,
    headers: {
      'Content-Type': 'application/json',
    }
  }),
  TokenLocalKey = tknKey,
  RoleLocalKey = roleKey;