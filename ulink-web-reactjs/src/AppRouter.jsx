import React from "react";
import {
    BrowserRouter as Router,
    Route, Switch, withRouter
} from 'react-router-dom';
import AppLoginPage from "./common/AppLoginPage";
import InfoPages from "./pages/InfoPages";

import LinkForm from "./links/LinkForm";
import LinkShow from "./links/LinkShow";
import LinkList from "./links/LinkList";

import {createBrowserHistory} from "history";
export const browserHistory = createBrowserHistory();

function AppRouter() {

    return (

        <Router forceRefresh={true} history={browserHistory}>
            <div>
            <Switch>
                <Route key={"main"} exact path="/">
                    <LinkForm />
                </Route>
                <Route key={"linkShow"} path="/links/:link_id">
                    <LinkShow/>
                </Route>
                {/* TODO display Stats! */}
                <Route key={"linkStats"} path="/links/:link_id/stats">
                    <LinkShow/>
                </Route>
                <Route key={"links"} path="/links">
                    <LinkList/>
                </Route>

                <Route key={"about"} path="/about">
                    <InfoPages />
                </Route>
                <Route key={"login"} path="/login">
                    <AppLoginPage/>
                </Route>
                <Route key={"k8s-status"} path="/k8s-status">
                    <div>OK</div>
                </Route>
            </Switch>
            </div>
        </Router>
    )

}
export default AppRouter;
//export default withRouter(AppRouter);
