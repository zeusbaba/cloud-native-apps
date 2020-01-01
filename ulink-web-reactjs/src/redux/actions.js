import { isDev } from '../common/AppConfig';

export const CHANGE_LOCALE = 'CHANGE_LOCALE';
export function changeLocale(locale) {
    if (isDev) {
        console.log("ACTION changeLocale: " + locale);
    }
    return {
        type: 'CHANGE_LOCALE',
        locale
    };
}
