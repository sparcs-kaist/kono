import storage from '../../lib/storage';

/* Action Types. */
const SET_THEME = 'theme/SET_THEME';
const TOGGLE_THEME = 'theme/TOGGLE_THEME';
const SET_TO_LOCAL_STORAGE_THEME = 'theme/SET_TO_LOCAL_STORAGE_THEME';

/* String Constants. */
const THEME_DEFAULT = 'theme_default';
const THEME_DARK = 'theme_dark';
const STORAGE_KEY_THEME = '__THEME__';

/* Initial States. */
const initialState = {
    theme: THEME_DEFAULT
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

/* SetToLocalStorageTheme() */
export const SetToLocalStorageTheme = () => {
    return {
        type: SET_TO_LOCAL_STORAGE_THEME
    };
};

export const ConfigMiddleWare = store => next => action => {
    const state = store.getState();
    switch (action.type) {
        case SET_THEME:
            break;
        case TOGGLE_THEME:
            action.theme = state.config.theme === THEME_DARK ? THEME_DEFAULT : THEME_DARK;
            break;
        case SET_TO_LOCAL_STORAGE_THEME:
            action.theme = storage.get(STORAGE_KEY_THEME);
            break;
        default:
    }
    // In case action.theme is set to undefined or other unexpected string values.
    action.theme = (action.theme === THEME_DEFAULT || action.theme === THEME_DARK) ? action.theme : THEME_DEFAULT;
    storage.set(STORAGE_KEY_THEME, action.theme);
    next(action);
};

/* Reducer. */
const config = (state = initialState, action) => {
    switch (action.type) {
        case SET_THEME:
        case TOGGLE_THEME:
        case SET_TO_LOCAL_STORAGE_THEME:
            return { ...state, theme: action.theme };
        default:
            return state;
    }
}

export default config;