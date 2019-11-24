import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import {LocalizeProvider, localizeReducer} from "react-localize-redux";
import {combineReducers, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
//import { Provider } from "react-redux";
//import store from "./redux/store";

let store = createStore(combineReducers({
    localize: localizeReducer
}), composeWithDevTools());

const rootElement = document.getElementById("root");
/*ReactDOM.render(
    <App />,
    rootElement
);*/
ReactDOM.render(
    <LocalizeProvider store={store}>
        <App />
    </LocalizeProvider>,
    rootElement
);
/*ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootElement
);*/

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
