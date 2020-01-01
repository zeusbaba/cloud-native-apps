import React from 'react';

import BrowserDetection from 'react-browser-detection';

import { isValidToken } from './common/AppConfig';
import AppBrowser from "./AppBrowser";
import RedirectToLogin from "./common/RedirectToLogin";

import './App.css';
//import {LocalizeProvider} from "react-localize-redux";
import {BrowserRouter as Router} from "react-router-dom";

import {withLocalize} from "react-localize-redux";
import {renderToStaticMarkup} from "react-dom/server";
import globalTranslations from "./i18n/global.json";

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

        //<LocalizeProvider>
            <Router forceRefresh={true}>
                <AppBrowser />
            </Router>
        //</LocalizeProvider>
        ),
};

function App(props) {

    /*props.initialize({
        languages: [
            {name: "English", code: "en"},
            {name: "Norwegian", code: "nb"}
        ],
        translation: globalTranslations,
        options: {renderToStaticMarkup}
    });*/

    return !isValidToken()?
            ( <RedirectToLogin /> )
            : ( <BrowserDetection>{browserHandler}</BrowserDetection> )
    ;
}
export default withLocalize(App);
