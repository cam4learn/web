import axios from 'axios';

var url = `https://987f547e.ngrok.io`;
var tknKey = "cam4learnTkn";
var roleKey = "cam4learnRole";

export var AuthorizedAxios = axios.create({
  baseURL: url,
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem(tknKey) }
}),
  UnauthorizedAxios = axios.create({
    baseURL: url
  }),
  TokenLocalKey = tknKey,
  RoleLocalKey = roleKey;