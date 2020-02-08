import {
    orange,
    red,
} from '@material-ui/core/colors';

export const translator = {
    form: {
        name: 'Shorten',
        label: 'Shorten',
        title: 'Shorten & Simplify',
        submit: 'Shorten!',
        error: 'Error!!! Check input fields',
        long_link: {
            hint: 'Paste long link here (url to shorten)',
            floatingLabelText: 'Long link/url',
            hintText: 'Paste long link here (url to shorten)',
        },
        simple_link: {
            hint: 'Simple name',
            expand_button: 'and... Simplify!',
            chips: {
                floatingLabelText: 'Simple names',
                hintText:
                    'You can assign simple names to make it easy to remember',
            },
        },
        errors: {
            long_link:
                'long_link is NOT a proper url, e.g. it must begin with http://... but yours is "%{long_link}" ',
            simple_link: {
                len:
                    'The simple_link must be more than %{min} and less than %{max} characters long... %{simple_link}',
                alpha:
                    'The simple_link can consist of only alphanumeric chars (letter, number), underscore (_) and dash (-)... %{simple_link}',
                limit: 'Simple links are limited by %{limit}',
            },
            recaptcha: 'You must validate ReCAPTCHA!!!',
        },
    },
    links: {
        name: 'My Links',
        title: 'My Links',
        fields: {
            id: 'short link',
            long_link: 'long link',
            simple_links: 'custom links',
            userid: 'User Id',
            createdAt: 'Created At',
        },
        buttons: {
            copy: {
                name: 'Copy',
                confirm: 'Copied! -> ',
            },
            share: 'Share',
            stats: {
                name: 'Stats',
                options: {
                    d_clicks: 'Clicks per each Link',
                    d_types: 'Request client types',
                    d_referers: 'Referers',
                    d_country_codes: 'Request locations',
                    d_browsers: 'Browser profiles',
                    d_platforms: 'Platform profiles',
                },
            },
        },
    }
};

export const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        //minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    card: {
        width: '96%',
        minHeight: 600,
        minWidth: 800,
        //padding: '4px',
        margin: '0.5em',
        display: 'inline-block',
        //verticalAlign: 'top',
        //-textAlign: 'center',
        //-alignItems: 'center',
        //justifyContent: 'center',
    },
    avatar: {
        margin: '1em',
        textAlign: 'center ',
    },
    form: {
        padding: '0 1em 1em 1em',
        inputField: {
            errorStyle: {
                color: red['A100'],
                fontSize: 'xx-small',
            },
            underlineStyle: {
                borderColor: orange['200'],
            },
            hintStyle: {
                color: orange['100'],
                fontSize: 'small',
                fontStyle: 'italic',
            },
            floatingLabelStyle: {
                color: orange['500'],
                fontSize: 'medium',
            },
            floatingLabelFocusStyle: {
                color: orange['300'],
            },
        },
    },
    input: {
        display: 'flex',
    },
    button: {
        smallIcon: {
            width: 36,
            height: 36,
        },
        mediumIcon: {
            width: 48,
            height: 48,
        },
        largeIcon: {
            width: 60,
            height: 60,
        },
        xlargeIcon: {
            width: 96,
            height: 96,
        },
        small: {
            width: 72,
            height: 72,
            padding: 16,
        },
        medium: {
            width: 96,
            height: 96,
            padding: 24,
        },
        large: {
            width: 120,
            height: 120,
            padding: 30,
        },
        xlarge: {
            width: 150,
            height: 150,
            padding: 40,
        },
    },
};
