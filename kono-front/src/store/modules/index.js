import { combineReducers } from 'redux';

const req = require.context('.', true, /^(?!.\/index).*.js$/);
const modules = {};

req.keys().forEach(key => {
    const moduleName = /.\/(.*?).js$/.test(key) && key.match(/.\/(.*?).js$/)[1];
    modules[moduleName] = req(key).default;
});

export default combineReducers(modules);