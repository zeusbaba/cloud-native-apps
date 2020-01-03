import React, {Component} from 'react';
import feathersClient from './FeathersComm';

import Spinner from 'react-spinkit';
import {Container, Row, Col} from 'react-grid-system';

import packageJson from './../../package.json';
import {appConfig, isDev, jwtHeaderName, isValidToken, getUserIdFromToken} from './AppConfig';

import {BrowserRouter as Router, Redirect, withRouter} from 'react-router-dom';
import {createBrowserHistory} from "history";
const browserHistory = createBrowserHistory();

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

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

function RedirectToMain() {
    return (
        <Router history={browserHistory}>
            <Redirect to="/"/>
        </Router>
    );
}
class AppLoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
        };

        this.registerUser = this.registerUser.bind(this);
        this.loginUser = this.loginUser.bind(this);
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
                //this.context.history.push('/');
                this.props.history.push('/');
                //push(location.state ? location.state.nextPathname : '/')
                //let history = useHistory();
                //history.pushState("/");

            })
            .catch(e => this.setState({signInError: e}));
    }

    registerUser() {
        const {user} = this.state;
        //registerUser = ({ username, userid, extra }) => {

        if (!user.extra.existingUserId) {
            // create a new user!
            feathersClient
                .service('users')
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
            feathersClient
                .service('users')
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
                        feathersClient
                            .service('users')
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
        //if (localStorage.getItem(jwtHeaderName)) {
        if (isValidToken()) {
            return (
                <RedirectToMain />
            );
        } else {
            return (
                <div style={{...styles.main}}>
                    <Container>
                        <Row>
                            <Col xs={4} md={4}/>
                            <Col xs={8} md={8}>
                                Loading...
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={8} md={8}>
                                <Spinner name="pacman" color="olive"/>
                            </Col>
                            <Col xs={4} md={4}>
                                <Spinner name="ball-triangle-path" color="olive"/>
                            </Col>
                        </Row>
                    </Container>
                </div>
            );
        }
    }
}

export default withRouter(AppLoginPage);
