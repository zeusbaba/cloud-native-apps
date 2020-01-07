import React from "react";
import {
    BrowserRouter as Router,
    Route, Switch, withRouter
} from 'react-router-dom';
import MyLoginPage from "./common/AppLoginPage";
import InfoPages from "./pages/InfoPages";

import LinkForm from "./links/LinkForm";
import LinkShow from "./links/LinkShow";
import LinkList from "./links/LinkList";

import {createBrowserHistory} from "history";
const browserHistory = createBrowserHistory();

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

    return (

        <Router forceRefresh={true} history={browserHistory}>
            <div>
            <Switch>
                <Route key={"main"} exact path="/">
                    <LinkForm />
                </Route>
                <Route key={"links"} exact path="/links">
                    <LinkList/>
                </Route>
                <Route key={"linkShow"} exact path="/links/:link_id">
                    <LinkShow/>
                </Route>
                {/* TODO display Stats! */}
                <Route key={"linkStats"} exact path="/links/:link_id/stats">
                    <LinkShow/>
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
            </Switch>
            </div>
        </Router>
    )

}
export default AppRouter;
//export default withRouter(AppRouter);
