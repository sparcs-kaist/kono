import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import modules from './modules';
import { ConfigMiddleWare } from './modules/config';

const devTools = process.env.NODE_ENV === 'production'
    ? applyMiddleware(thunk, ConfigMiddleWare)
    : composeWithDevTools(applyMiddleware(thunk, ConfigMiddleWare));
const store = createStore(modules, devTools);

export default store;