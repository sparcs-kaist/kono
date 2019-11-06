import storage from 'lib/browser/storage';
import { userLanguage } from 'lib/browser/navigator';

/* Action Types. */
const SET_THEME = 'config/SET_THEME';
const TOGGLE_THEME = 'config/TOGGLE_THEME';
const SET_LANGUAGE = 'config/SET_LANGUAGE';
const TOGGLE_LANGUAGE = 'config/TOGGLE_LANGUAGE';
const SET_TO_LOCAL_STORAGE_THEME = 'config/SET_TO_LOCAL_STORAGE_THEME';
const SET_TO_LOCAL_STORAGE_LANGUAGE = 'config/SET_TO_LOCAL_STORAGE_LANGUAGE';

/* String Constants. */
const THEME_DEFAULT = 'theme_default';
const THEME_DARK = 'theme_dark';
const LANGUAGE_KR = 'kr';
const LANGUAGE_EN = 'en';
const STORAGE_KEY_THEME = '__THEME__';
const STORAGE_KEY_LANGUAGE = '__LANGUAGE__';

/* Initial States. */
const initialState = {
    theme: THEME_DEFAULT,
    language: LANGUAGE_KR
};

/* Action Definitions. */

/* SetTheme(theme: string) */
export const SetTheme = (theme) => {
    return {
        type: SET_THEME,
        theme
    };
};

/* ToggleTheme() */
export const ToggleTheme = () => {
    return {
        type: TOGGLE_THEME
    };
};


/* SetLanguage(language: string) */
export const SetLanguage = (language) => {
    return {
        type: SET_LANGUAGE,
        language
    };
};

/* ToggleLanguage() */
export const ToggleLanguage = () => {
    return {
        type: TOGGLE_LANGUAGE
    };
};
  
/* SetToLocalStorageTheme() */
export const SetToLocalStorageTheme = () => {
    return {
        type: SET_TO_LOCAL_STORAGE_THEME
    };
};
  
/* SetToLocalStorageLanguage() */
export const SetToLocalStorageLanguage = () => {
    return {
        type: SET_TO_LOCAL_STORAGE_LANGUAGE
    };
};

export const ConfigMiddleWare = store => next => action => {
    const state = store.getState();
    switch (action.type) {
        case SET_THEME:
            storage.set(STORAGE_KEY_THEME, action.theme);
            break;
        case TOGGLE_THEME:
            action.theme = state.config.theme === THEME_DARK ? THEME_DEFAULT : THEME_DARK;
            storage.set(STORAGE_KEY_THEME, action.theme);
            break;
        case SET_TO_LOCAL_STORAGE_THEME:
            action.theme = storage.get(STORAGE_KEY_THEME);
            if (!action.theme) {
                action.theme = THEME_DEFAULT;
                storage.set(STORAGE_KEY_THEME, action.theme);
            }
            break;
        case SET_LANGUAGE:
            storage.set(STORAGE_KEY_LANGUAGE, action.language);
            break;
        case TOGGLE_LANGUAGE:
            action.language = state.config.language === LANGUAGE_EN ? LANGUAGE_KR : LANGUAGE_EN;
            storage.set(STORAGE_KEY_LANGUAGE, action.language);
            break;
        case SET_TO_LOCAL_STORAGE_LANGUAGE:
            action.language = storage.get(STORAGE_KEY_LANGUAGE); // Attempt to retrieve from storage
            if (!action.language) {
                action.language = userLanguage || LANGUAGE_KR;   // Attempt to retrieve from browser configuration
                storage.set(STORAGE_KEY_LANGUAGE, action.language);
            }
            break;
        default:
    }
    
    next(action);
};

/* Reducer. */
const config = (state = initialState, action) => {
    switch (action.type) {
        case SET_THEME:
        case TOGGLE_THEME:
        case SET_TO_LOCAL_STORAGE_THEME:
            return { ...state, theme: action.theme };
        case SET_LANGUAGE:
        case TOGGLE_LANGUAGE:
        case SET_TO_LOCAL_STORAGE_LANGUAGE:
            return { ...state, language: action.language };
        default:
            return state;
    }
}

export default config;