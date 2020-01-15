import React from 'react';

import { translator, styles } from './LinkAssets';
import {appConfig, isDev, isLocalHost, jwtHeaderName} from './../common/AppConfig';

import {feathersClient} from '../common/FeathersComm';

import Validator from 'validator';
import { toast } from 'react-toastify';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconTransform from '@material-ui/icons/Transform';
import Image from 'material-ui-image';

import ChipInput from 'material-ui-chip-input';
import Chip from '@material-ui/core/Chip';

import {browserHistory} from "../AppRouter";

import ReCAPTCHA from 'react-google-recaptcha';
const toastPosition = toast.POSITION.BOTTOM_RIGHT;
let reCAPTCHA;

class LinkForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dizform: {
                long_link: '',
                simple_links: [],
                //simple_links_error: ''
            },
            formError: false,
            recaptcha: false,
            submitting: false
        };

        this.handleLongLink = this.handleLongLink.bind(this);
        this.handleAddChip = this.handleAddChip.bind(this);
        this.handleDeleteChip = this.handleDeleteChip.bind(this);
        this.submitForm = this.submitForm.bind(this);

        this.onChangeReCAPTCHA = this.onChangeReCAPTCHA.bind(this);
    }
    componentDidMount() {
        if (isLocalHost()) {// recaptcha is skipped in local
            this.setState({recaptcha: true});
        }
    }

    handleLongLink(event) {
        //const { translate } = this.props; // eslint-disable-line
        const { dizform } = this.state;
        //dizform[event.target.name] = event.target.value;
        //this.setState({ dizform });

        const long_link = event.target.value;
        let long_link_error = '';
        if (
            !Validator.isLength(long_link, appConfig.diz.long_link.len) ||
            !Validator.isURL(long_link, appConfig.diz.long_link.validation)
        ) {
            //long_link_error = translate('resources.links.form.errors.long_link', { long_link: long_link });
            long_link_error = translator.form.errors.long_link + " long_link: "+long_link;
        }

        if (!Validator.isEmpty(long_link_error)) {
            dizform['long_link_error'] = long_link_error;
        } else {
            dizform['long_link_error'] = '';
            dizform['long_link'] = long_link;
        }
        this.setState({ dizform });
    }
    handleAddChip(simple_link) {
        //const { translate } = this.props;
        const { dizform } = this.state;

        let simple_links_error = '';
        if (
            dizform.simple_links &&
            dizform.simple_links.length >= appConfig.diz.simple_link.limit
        ) {
            /*simple_links_error = translate(
                'resources.links.form.errors.simple_link.limit',
                { limit: appConfig.diz.simple_link.limit },
            );*/
            simple_links_error = translator.form.errors.simple_link.limit + " limit: "+appConfig.diz.simple_link.limit;
        } else if (!Validator.isLength(simple_link, appConfig.diz.simple_link.len)) {
            /*simple_links_error = translate(
                'resources.links.form.errors.simple_link.len',
                {
                    min: appConfig.diz.simple_link.len.min,
                    max: appConfig.diz.simple_link.len.max,
                    simple_link: simple_link,
                },
            );*/
            simple_links_error = translator.form.errors.simple_link.len;// TODO: "set min+max";
        } else if (!Validator.isAlphanumeric(simple_link)) {
            if (
                !Validator.contains(simple_link, '_') &&
                !Validator.contains(simple_link, '-')
            ) {
                /*simple_links_error = translate(
                    'resources.links.form.errors.simple_link.alpha',
                    { simple_link: simple_link },
                );*/
                simple_links_error = translator.form.errors.simple_link.alpha + " simple_link: "+simple_link;
            }
        }
        if (!Validator.isEmpty(simple_links_error)) {
            dizform['simple_links_error'] = simple_links_error;
        } else {
            dizform['simple_links_error'] = '';
            dizform['simple_links'] = [...dizform.simple_links, simple_link];
        }
        this.setState({ dizform });

        if (isDev) {
            console.log('simple_links_error -> ' + simple_links_error);
            console.log('handleAddChip -> ' + JSON.stringify(this.state.dizform));
        }
    }
    handleDeleteChip(deletedChip) {
        const { dizform } = this.state;
        dizform['simple_links'] = dizform.simple_links.filter(
            c => c !== deletedChip,
        );
        this.setState({ dizform });
        if (isDev) {
            console.log('handleDeleteChip -> ' + JSON.stringify(this.state.dizform));
        }
    }

    submitForm() {
        //const { push, location } = this.props; // eslint-disable-line
        const { dizform, recaptcha } = this.state;
        if (isDev) {
            //console.log('isDev: '+isDev);
            console.log('dizform -> ' + JSON.stringify(dizform));
        }

        // validate all input, then submit to make link!
        let errorMessage;
        if (!recaptcha) {
            //errorMessage = translate('resources.links.form.errors.recaptcha');
            errorMessage = translator.form.errors.recaptcha;
        } else if (
            Validator.isEmpty(dizform.long_link) ||
            !Validator.isLength(dizform.long_link, appConfig.diz.long_link.len) ||
            !Validator.isURL(dizform.long_link, appConfig.diz.long_link.validation)
        ) {
            /*errorMessage = translate('resources.links.form.errors.long_link', {
                long_link: dizform.long_link,
            });*/
            errorMessage = translator.form.errors.long_link + " long_link: "+dizform.long_link;
        }

        if (errorMessage) {
            toast.error(errorMessage, {
                position: toastPosition, //toast.POSITION.BOTTOM_LEFT,
                className: 'dark-toast',
                progressClassName: 'transparent-progress',
                autoClose: 5000,
            });

            return;
        }

        this.setState({submitting: true});
        return (
            feathersClient
                .service('links')
                .create({
                    long_link: dizform.long_link,
                    simple_links: dizform.simple_links,
                },{
                    headers: {'Authorization': 'Bearer ' + localStorage.getItem(jwtHeaderName)}
                })
                .then(resp => {
                    this.setState({submitting: false});
                    if (isDev) {
                        console.log('resp' + JSON.stringify(resp));
                    }
                    // resp{"_id":"18vv57","simple_links":["duckduck"],"long_link":"http://duckduckgo.com","createdAt":"2017-09-09T20:44:21.893Z","short_link":"18vv57"}
                    let redirectTo = '/';
                    if (resp._id) {
                        redirectTo = '/links/' + resp._id + '/show';
                    }
                    if (isDev) {
                        toast.info(
                            'redirectTo: '+redirectTo + ' | ' + JSON.stringify(resp),
                            {
                            position: toastPosition, //toast.POSITION.BOTTOM_LEFT,
                            className: 'dark-toast',
                            progressClassName: 'transparent-progress',
                            autoClose: 5000,
                        });
                    }
                    browserHistory.push(redirectTo);
                    //this.props.history.push(redirectTo);
                    //push(location.state ? location.state.nextPathname : redirectTo);
                })
                //.catch(e => this.setState({ formError: e }));
                .catch(error => {
                    this.setState({submitting: false});
                    /*
                  {name: "BadRequest", message: "simple_link already exists!!!", code: 400, className: "bad-request",…}
                    className:"bad-request"
                    code:400
                    data: {simple_link: ["duckduckgo"]}
                    errors:{}
                    message:"simple_link already exists!!!"
                    name:"BadRequest"
                  */
                    toast.error(error.message, {
                        position: toastPosition, //toast.POSITION.BOTTOM_LEFT,
                        className: 'dark-toast',
                        progressClassName: 'transparent-progress',
                        autoClose: 5000,
                    });
                })
        );
    }

    onChangeReCAPTCHA(value) {
        if (isDev) {
            console.log('ReCAPTCHA value: ' + value);
        }
        if (value === null) {
            this.setState({ recaptcha: false });
            if (reCAPTCHA) {
                reCAPTCHA.reset();
            }
        } else {
            feathersClient
                .service('validate_recaptcha')
                .create({ q: value })
                .then(result => {
                    if (isDev) {
                        console.log('result: ' + result);
                    }
                    this.setState({ recaptcha: true });
                }).catch(e => this.setState({ recaptcha: false })); // eslint-disable-line
        }
    }

    render() {
        const { submitting } = this.state; // eslint-disable-line

        return (

            <div
                // TODO style={{ ...styles.main, backgroundColor: primary1Color }}
            >
                <Card style={styles.card}>
                    <CardContent>
                        <Image
                            src={"/images/logo_main.png"}
                            aspectRatio={4}
                            imageStyle={{ align: 'center', width: '100%', height: '100%' }}
                        />
                    </CardContent>


                    <form
                        style={styles.form}
                        onSubmit={e => {
                            this.submitForm();
                            e.preventDefault();
                        }}
                    >
                        <CardContent>
                            {/* FIXME for long_link
                  InputLabelProps={{
                  }}
                  floatingLabelStyle={styles.form.inputField.floatingLabelStyle}
                  floatingLabelFocusStyle={
                    styles.form.inputField.floatingLabelFocusStyle
                  }
                  hintStyle={styles.form.inputField.hintStyle}
                  errorStyle={styles.form.inputField.errorStyle}
                  underlineStyle={styles.form.inputField.underlineStyle}
                */}
                            <TextField
                                id="long_link"
                                onChange={this.handleLongLink}
                                fullWidth
                                placeholder={
                                    //translate('resources.links.form.long_link.floatingLabelText')
                                    translator.form.long_link.floatingLabelText
                                }
                                label={
                                    //translate('resources.links.form.long_link.hintText')
                                    translator.form.long_link.hintText
                                }
                                helperText={this.state.dizform.long_link_error}
                            />
                        </CardContent>

                        <CardContent>

                            {/* FIXME for simple_links
                  chipContainerStyle={{
                    overflow: 'auto',
                    maxHeight: '144px',
                    textAlign: 'left',
                  }}
                  floatingLabelStyle={styles.form.inputField.floatingLabelStyle}
                  floatingLabelFocusStyle={
                    styles.form.inputField.floatingLabelFocusStyle
                  }
                  hintStyle={styles.form.inputField.hintStyle}
                  errorStyle={styles.form.inputField.errorStyle}
                  underlineStyle={styles.form.inputField.underlineStyle}
                  */}
                            <ChipInput
                                id="simple_links-chipinput"
                                allowDuplicates={false}
                                newChipKeyCodes={[13, 188, 32]}
                                fullWidthInput
                                fullWidth
                                placeholder={
                                    //translate('resources.links.form.simple_link.chips.floatingLabelText')
                                    translator.form.simple_link.chips.floatingLabelText
                                }
                                label={
                                    //translate('resources.links.form.simple_link.chips.hintText')
                                    translator.form.simple_link.chips.hintText
                                }
                                helperText={this.state.dizform.simple_links_error}
                                value={this.state.dizform.simple_links}
                                onAdd={chip => this.handleAddChip(chip)}
                                onDelete={(chip, index) =>
                                    this.handleDeleteChip(chip, index)
                                }
                                chipRenderer={
                                    ({ value, text, chip,
                                         isFocused, isDisabled,
                                         handleClick, handleDelete, className
                                     }, key) => (
                                        <Chip
                                            key={key}
                                            label={chip}
                                            avatar={<Avatar src={'/images/logo_icon.png'}
                                                            alt="logo"
                                                //className={{width:16, height:16, margin:10}}
                                            />}
                                            onClick={handleClick}
                                            onDelete={handleDelete}
                                        >
                                        </Chip>
                                    )}
                            />
                        </CardContent>

                        <CardContent/>

                        <CardActions>
                            <ReCAPTCHA
                                sitekey={appConfig.web.recaptcha.sitekey}
                                onChange={value => this.onChangeReCAPTCHA(value)}
                                ref={el => {
                                    reCAPTCHA = el;
                                }}
                            />
                            <Button variant="contained" color="primary" size="medium"
                                    type="submit"
                                    disabled={submitting}
                                //-icon={submitting && <CircularProgress size={25} thickness={2} />}
                            >
                                <Typography gutterBottom
                                            variant="h5"
                                            align="left"
                                            component="h5"
                                            color="inherit"
                                >
                                    {
                                        //translate('resources.links.form.submit')
                                        translator.form.submit
                                    }
                                </Typography>
                                <IconTransform fontSize="large"/>

                            </Button>
                        </CardActions>
                    </form>

                </Card>
            </div>

        );
    }
}

export default LinkForm;