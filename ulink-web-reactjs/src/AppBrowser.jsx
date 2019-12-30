import React from "react";
import {
    BrowserRouter as Router,
    useLocation
} from "react-router-dom";

import {renderToStaticMarkup} from "react-dom/server";
import {withLocalize} from "react-localize-redux";
import globalTranslations from "./i18n/global.json";
import {makeStyles} from "@material-ui/core";
import {myConfig, isDev} from './common/MyConfig';
import {Helmet} from "react-helmet";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MyMenu from "./common/MyMenu";
import Typography from "@material-ui/core/Typography";
import LocaleSwitcher from "./common/LocaleSwitcher";
import Container from "@material-ui/core/Container";
import AppRouter from "./AppRouter";

import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

function AppBrowser(props) {
    const classes = useStyles();
    const location = useLocation();
    if (isDev) {
        console.log("location: " + JSON.stringify(location));
    }

    /*props.initialize({
        languages: [
            {name: "English", code: "en"},
            {name: "Norwegian", code: "nb"}
        ],
        translation: globalTranslations,
        options: {renderToStaticMarkup}
    });*/

    return (
        <div>
            <div>
                <Helmet>
                    <title>{myConfig.web.header.title}</title>
                    <link rel="canonical" href={myConfig.web.baseUrl}/>
                    <meta
                        name="description"
                        content={myConfig.web.header.description}
                    />
                    <meta name="author" content={myConfig.web.header.author}/>
                    <meta name="keywords" content={myConfig.web.header.keywords}/>
                </Helmet>
            </div>

            <React.Fragment>
                <CssBaseline/>

                <AppBar position="sticky">
                    <Toolbar>
                        <MyMenu selectedItem={location.pathname}/>

                        <Typography variant="h6" className={classes.title}>
                            uLINK.no :: Shorten & Simplify Links!
                        </Typography>
                        <LocaleSwitcher/>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="sm">
                    <AppRouter/>
                </Container>

            </React.Fragment>

            <div>
                <ToastContainer
                    position="bottom-left"
                    type="default"
                    autoClose={4000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    pauseOnHover
                />
            </div>
        </div>
    );
}

export default withLocalize(AppBrowser);
