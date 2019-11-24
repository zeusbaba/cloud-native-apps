import React from "react";

import {
    BrowserRouter as Router,
    Redirect, Route
} from "react-router-dom";
import MyLoginPage from "./MyLoginPage";
//import {createBrowserHistory} from "history";
//const browserHistory = createBrowserHistory();

function RedirectToLogin() {

    return (
        // Router is already used at App level!
        <Router>
            <Redirect to="/login"/>

            <Route key="login" exact path="/login">
                <MyLoginPage/>
            </Route>
        </Router>
    );
}
export default RedirectToLogin;
