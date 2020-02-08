import { isDev } from '../../common/AppConfig';
import { combineReducers } from "redux";
import {
    CHANGE_LOCALE
} from "../actions";

const initialState = {
    //locale: "en"
};
function changeLocale(state = initialState, action) {
    switch (action.type) {
        case CHANGE_LOCALE: {
            if (isDev) {
                console.log("REDUCER changeLocale: " + JSON.stringify(action));
            }
            state.locale = action.locale;
            return state;
        }
        default:
            return state;
    }
}

export default combineReducers({changeLocale});
