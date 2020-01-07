import React from "react";

import {
    BrowserRouter as Router,
    Redirect, Route
} from "react-router-dom";
import MyLoginPage from "./AppLoginPage";
import LinkForm from "../links/LinkForm";

export function RedirectToLogin() {

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
//export default RedirectToPage;

export function RedirectToForm() {

    return (
        // Router is already used at App level!
        <Router>
            <Redirect to="/"/>

            <Route key="main" exact path="/">
                <LinkForm/>
            </Route>
        </Router>
    );
}