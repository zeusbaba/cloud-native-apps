import React, { useState, useEffect } from 'react';
import {feathersClient, usersService} from './FeathersComm';

import packageJson from './../../package.json';
import {appConfig, isDev, jwtHeaderName, isValidToken, getUserIdFromToken} from './AppConfig';

import {withRouter, useHistory} from 'react-router-dom';

import Loading from "./Loading";
import {createBrowserHistory} from "history";
const browserHistory = createBrowserHistory();

function generateUUID() {
    let d = new Date().getTime();
    // 'uLINK-2020-yxxx-xxxxxxxxxxxx'
    const uuid = appConfig.backend.uuidSourceValue.replace(/[xy]/g, function (c) {
        let r = ((d + Math.random() * 16) % 16) | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16);
    });
    return uuid;
}

function AppLoginPage() {

    const [dizUser, setDizUser] = useState({});
    let history = useHistory();

    useEffect(() => {

        if (!localStorage.getItem('locale')) {
            localStorage.setItem('locale', appConfig.web.defaultLocale);
        }

        const currentToken = localStorage.getItem(jwtHeaderName);
        if (!currentToken) {
            let userId = generateUUID();
            if (isDev) {
                console.log('NEW user with userId: ' + userId);
            }

            let user = {};
            user['userid'] = userId;
            user['password'] = userId;
            user['extra'] = {
                appInfo: {
                    name: packageJson.name,
                    version: packageJson.version,
                    //engines: packageJson.engines,
                },
            };
            setDizUser(user);
            //this.setState({user});

            registerUser();
        } else {
            if (!isValidToken(currentToken)) {
                const userId = getUserIdFromToken(currentToken);
                if(isDev) {
                    console.log("token expired, will re-create for the same userId... " + userId);
                }

                let user = {};//const {user} = this.state;
                user['userid'] = userId;
                user['password'] = userId;
                user['extra'] = {
                    existingUserId : userId,
                    appInfo: {
                        name: packageJson.name,
                        version: packageJson.version,
                        //engines: packageJson.engines,
                    },
                };
                setDizUser(...user);
                //this.setState({user});
                registerUser(); //this.loginUser();
            }
            if (isDev) console.log('-> existing user! ...redirect');
        }
    }, [dizUser]);

    //loginUser = ({ username, userid }) => {
    const loginUser = (() => {

        //const { push, location} = this.props; // eslint-disable-line
        let user = dizUser;//const {user} = this.state;

        feathersClient
            .authenticate({
                strategy: 'local',
                userid: user.userid,
                password: user.password,
            })
            .then(() => {
                if (isDev) {
                    console.log('user authenticated OK... now redirect to main page');
                }

                // FIXME: redirect is not working!
                history.push('/');
                //this.goToMainPage();

                //this.context.history.push('/');
                //push(location.state ? location.state.nextPathname : '/')
                //let history = useHistory();
                //history.pushState("/");
            })
            .catch(e =>
                setDizUser({signInError: e})
                //this.setState({signInError: e})
            );
    });

    const registerUser = (() => {
        let user = dizUser; //const {user} = this.state;
        //registerUser = ({ username, userid, extra }) => {

        if (user.extra && !user.extra.existingUserId) {
            // create a new user!
            usersService
                .create({
                    userid: user.userid,
                    password: user.password,
                    extra: user.extra,
                })
                .then(() => {
                    if (isDev) {
                        console.log('user created OK... userid: ' + user.userid);
                    }
                    //this.loginUser({username, userid});
                    loginUser();
                })
                .catch(e =>
                    setDizUser({registerError: e})//this.setState({registerError: e})
                );
        } else {
            // check for existing user! if not create one!
            console.log("check for existing user! if not create one!");
            usersService
                /* .find({
                  query: { userid: user.userid },
                }) */
                .get(user.userid)
                .then(result => {
                    throw result;
                })
                .catch(fish => {
                    if (isDev) {
                        console.log('user-result -> ' + JSON.stringify(fish));
                    }
                    //if (!fish.errors && fish.total && fish.total > 0) {
                    if (!fish.errors) {
                        // user already exists, do login
                        if (isDev) {
                            console.log('user already exists, do login...userid: ' + fish.userid);
                        }
                        loginUser();
                    } else {
                        // user not found, create new
                        usersService
                            .create({
                                userid: user.userid,
                                password: user.password,
                                extra: user.extra,
                            })
                            .then(() => {
                                //this.loginUser({username, userid});
                                loginUser();
                            })
                            .catch(e =>
                                setDizUser({registerError: e})//this.setState({registerError: e})
                            );
                    }
                });
        }
    });

    return(
        //isValidToken()? <RedirectToMain /> : <Loading/>
        //isValidToken()? this.props.history.push("/") : <Loading/>
        isValidToken()? history.push("/") : <Loading/>
    );
}

export default withRouter(AppLoginPage);
