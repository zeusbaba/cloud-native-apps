import React, {Component} from 'react';

//import { connect } from 'react-redux';
//import { changeLocale as changeLocaleAction } from "../redux/actions";
//import store from '../redux/store';
import {withLocalize } from "react-localize-redux";

import Fab from '@material-ui/core/Fab';
import Flag from 'react-world-flags';
import {myConfig, isDev} from './MyConfig'; // eslint-disable-line

class LocaleSwitcher extends Component {

    constructor(props) {
        super(props);
        this.onSelectFlag = this.onSelectFlag.bind(this);

        this.state = {
            locale: localStorage.getItem('locale')
        };
    }

    componentDidMount() {

        if (!localStorage.getItem('locale')) {
            localStorage.setItem('locale', myConfig.web.defaultLocale);
        }
        const locale = localStorage.getItem('locale');
        this.setState({locale});

        this.props.setActiveLanguage(locale);
        //this.props.changeLocale(locale);
        //store.dispatch(changeLocaleAction(locale));
    }

    onSelectFlag(cc) {
        if (isDev) {
            console.log('cc -> ' + cc);
        }
        const locale = cc;

        this.props.setActiveLanguage(locale);
        //this.props.changeLocale(locale);
        //store.dispatch(changeLocaleAction(locale));

        localStorage.setItem('locale', locale);
        this.setState({locale});
    }

    render() {
        const {locale} = this.state;
        return (
            <div>
                <Fab variant="extended"
                     color={"primary"}
                    //color={(locale !== 'nb')?'secondary':'primary'}
                     style={{marginRight: 4}}
                     size={(locale !== 'nb') ? 'small' : 'medium'}
                     disabled={locale === 'nb'}
                     onClick={() => this.onSelectFlag('nb')}
                >
                    <Flag code="nor" height={(locale !== 'nb') ? '16' : '28'}/>
                </Fab>

                <Fab variant="extended"
                     color={"primary"}
                     style={{marginRight: 4}}
                     size={(locale !== 'en') ? 'small' : 'medium'}
                     disabled={locale === 'en'}
                     onClick={() => this.onSelectFlag('en')}
                >
                    <Flag code="gbr" height={(locale !== 'en') ? '16' : '28'}/>
                </Fab>
            </div>
        );
    }
}

/*const mapStateToProps = state => ({
    locale: state.locale,
});
const mapDispatchToProps = { changeLocaleAction };
*/

//export default LocaleSwitcher;
export default withLocalize(LocaleSwitcher);
/*export default connect(mapStateToProps,
    { changeLocale: changeLocaleAction } // mapDispatchToProps
)(LocaleSwitcher);*/
/*export default connect(mapStateToProps, {
  changeLocale: changeLocaleAction,
})(translate(LocaleSwitcher)); */
