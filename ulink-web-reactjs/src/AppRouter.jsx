import React from "react";
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import {withLocalize } from "react-localize-redux";
import { isDev } from "./common/AppConfig";
//import {createBrowserHistory} from "history";
//const browserHistory = createBrowserHistory();
import MyLoginPage from "./common/AppLoginPage";
import InfoPages from "./pages/InfoPages";

// TODO: move each into separate component!
function MainPage(props) {
    if (isDev) {
        console.log("MainPage -> locale: " + props.activeLanguage);
    }
    return (<div>Main page... TODO load component</div>);
}
function LinksPage() {
    return (<div>Links page... TODO load component</div>);
}

/*
const routes = [
    {
        path: "/",
        component: MainPage
    },
    {
        path: "/links",
        component: LinksPage
    },
    {
        path: "/about",
        component: AboutPage
    },
    {
        path: "/login",
        component: MyLoginPage
    },
];*/

function AppRouter(props) {

    if (isDev) {
        console.log("AppRouter -> locale: " + JSON.stringify(props.activeLanguage));
        console.log("languages: " + JSON.stringify(props.languages));
    }

    return (

        <Router forceRefresh={true} >
            <div>
                <Route key={"main"} exact path="/">
                    <MainPage/>
                </Route>
                <Route key={"links"} exact path="/links">
                    <LinksPage/>
                </Route>
                <Route key={"about"} exact path="/about">
                    <InfoPages />
                </Route>
                <Route key={"login"} exact path="/login">
                    <MyLoginPage/>
                </Route>
                <Route key={"k8s-status"} exact path="/k8s-status">
                    <div>OK</div>
                </Route>
            </div>
        </Router>
    )

}

export default withLocalize(AppRouter);
