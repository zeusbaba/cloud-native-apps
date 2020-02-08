import React, {Component} from 'react';
import {feathersClient, usersService} from './FeathersComm';

import packageJson from './../../package.json';
import {appConfig, isDev, jwtHeaderName, isValidToken, getUserIdFromToken} from './AppConfig';

import {withRouter} from 'react-router-dom';

import Loading from "./Loading";
import {browserHistory} from "../AppRouter";

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

class AppLoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
        };

        this.registerUser = this.registerUser.bind(this);
        this.loginUser = this.loginUser.bind(this);
        this.goToMainPage = this.goToMainPage.bind(this);
    }

    componentDidMount() {

        if (!localStorage.getItem('locale')) {
            localStorage.setItem('locale', appConfig.web.defaultLocale);
        }

        const currentToken = localStorage.getItem(jwtHeaderName);
        if (!currentToken) {
            let userId = generateUUID();
            if (isDev) {
                console.log('NEW user with userId: ' + userId);
            }

            const {user} = this.state;
            user['userid'] = userId;
            user['password'] = userId;
            user['extra'] = {
                appInfo: {
                    name: packageJson.name,
                    version: packageJson.version,
                    //engines: packageJson.engines,
                },
            };
            this.setState({user});

            this.registerUser();
        } else {
            if (!isValidToken(currentToken)) {
                const userId = getUserIdFromToken(currentToken);
                if(isDev) {
                    console.log("token expired, will re-create for the same userId... " + userId);
                }

                const {user} = this.state;
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
                this.setState({user});
                this.registerUser(); //this.loginUser();
            }
            if (isDev) console.log('-> existing user! ...redirect');
        }
    }

    //loginUser = ({ username, userid }) => {
    loginUser() {

        //const { push, location} = this.props; // eslint-disable-line
        const {user} = this.state;

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
                //this.props.history.push('/');
                this.goToMainPage();

                //this.context.history.push('/');
                //push(location.state ? location.state.nextPathname : '/')
                //let history = useHistory();
                //history.pushState("/");
            })
            .catch(e => this.setState({signInError: e}));
    }

    goToMainPage() {
        //let history = useHistory();
        //history.push('/');
        browserHistory.push('/'); //this.props.history.push('/');
        //return <Router><Redirect to={"/"} /></Router>
        //return <RedirectToForm />
    };

    registerUser() {
        const {user} = this.state;
        //registerUser = ({ username, userid, extra }) => {

        if (!user.extra.existingUserId) {
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
                    this.loginUser();
                })
                .catch(e => this.setState({registerError: e}));
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
                        this.loginUser();
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
                                this.loginUser();
                            })
                            .catch(e => this.setState({registerError: e}));
                    }
                });
        }
    }

    render() {

        return(
            //isValidToken()? <RedirectToMain /> : <Loading/>
            isValidToken()? this.props.history.push("/") : <Loading/>
        );
    }
}

export default withRouter(AppLoginPage);
