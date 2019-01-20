// Start up point for client side app
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import axios from 'axios';
import { composeWithDevTools } from 'redux-devtools-extension';

import webConfig from './../webConfig';
import Routes from './routes';
import reducers from './reducers';
import {notify} from 'react-notify-toast';

const axiosInstance = axios.create({
    baseURL: webConfig.axiosInstance_baseURL
});


// Add a response interceptor
axiosInstance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if(error.response.status === 401 && !(window.location.href.includes("/login")  || window.location.href.includes("/register") || window.location.href.includes("/reset-password"))) {
        window.location.href = "/login";
    } else if(error.response.status === 400){
        notify.show(error.response.data.error.message, 'error');
    }
    return error;
});


const store = createStore(
    reducers, 
    window.INITIAL_STATE,
    composeWithDevTools(applyMiddleware(thunk.withExtraArgument(axiosInstance)))
);

export default axiosInstance;

ReactDOM.hydrate(
    <Provider store={store}>
        <BrowserRouter>
            <div>{renderRoutes(Routes)}</div>
        </BrowserRouter>
    </Provider>
    , document.querySelector('#root'));

