import React from 'react';

import BrowserDetection from 'react-browser-detection';

import { isValidToken } from './common/AppConfig';
import AppBrowser from "./AppBrowser";
import {RedirectToLogin} from "./common/RedirectToPage";

import './App.css';
//import {LocalizeProvider} from "react-localize-redux";
import {BrowserRouter as Router} from "react-router-dom";

function BadBrowser(props) {
    return (
        <div>
            Unfortunately you are still using <em>{props.browser}?!</em> which we dont
            support... <br/>
            Please use <em>a decent browser</em> like Chrome, Firefox, Safari.
        </div>
    );
}

const browserHandler = {
    ie: browser => <BadBrowser browser={browser} />,
    default: () => (
        //<AppBrowser />
        <Router forceRefresh={true}>
            <AppBrowser />
        </Router>
        ),
};

function App() {

    return !isValidToken()?
            ( <RedirectToLogin /> )
            : ( <BrowserDetection>{browserHandler}</BrowserDetection> )
    ;
}
export default App;
