import React, {useState} from 'react';

//import {withLocalize } from "react-localize-redux";

import Fab from '@material-ui/core/Fab';
import Flag from 'react-world-flags';
import {appConfig} from "./AppConfig";

function LocaleSwitcher(props) {

    if (!localStorage.getItem('locale')) {
        localStorage.setItem('locale', appConfig.web.defaultLocale);
    }
    const [locale, setLocale] = useState(localStorage.getItem('locale'));

    return (
        <div>
            <Fab variant="extended"
                 color={"primary"}
                //color={(locale !== 'nb')?'secondary':'primary'}
                 style={{marginRight: 4}}
                 size={(locale !== 'nb') ? 'small' : 'medium'}
                 disabled={locale === 'nb'}
                 onClick={() => {
                     setLocale('nb');
                     localStorage.setItem('locale', 'nb');
                     props.setActiveLanguage('nb');
                 } }
            >
                <Flag code="nor" height={(locale !== 'nb') ? '16' : '28'}/>
            </Fab>

            <Fab variant="extended"
                 color={"primary"}
                 style={{marginRight: 4}}
                 size={(locale !== 'en') ? 'small' : 'medium'}
                 disabled={locale === 'en'}
                 onClick={() => {
                     setLocale('en');
                     localStorage.setItem('locale', 'en');
                     props.setActiveLanguage('en');
                 } }
            >
                <Flag code="gbr" height={(locale !== 'en') ? '16' : '28'}/>
            </Fab>
        </div>
    );
}

/*const mapStateToProps = state => ({
    locale: state.locale,
});
const mapDispatchToProps = { changeLocaleAction };
*/

export default LocaleSwitcher;
//export default withLocalize(LocaleSwitcher);
/*export default connect(mapStateToProps,
    { changeLocale: changeLocaleAction } // mapDispatchToProps
)(LocaleSwitcher);*/
/*export default connect(mapStateToProps, {
  changeLocale: changeLocaleAction,
})(translate(LocaleSwitcher)); */
