import storage from '../../lib/storage'

/* Action Types. */

const SET_THEME = 'theme/SET_THEME';
const TOGGLE_THEME = 'theme/TOGGLE_THEME';

const LOCAL_STORAGE_KEY_CONFIG = '__CONFIG__'

/* Initial States. */
const initialState = {
    theme: 'theme_default'
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
export const ToggleTheme = (theme) => {
    return {
        type: TOGGLE_THEME
    };
};

/* Reducer. */
const config = (state = initialState, action) => {
    const localStorageState = storage.get(LOCAL_STORAGE_KEY_CONFIG);
    if (localStorageState) {
        state = localStorageState;
    }
    
    let newState;
    switch (action.type) {
        case SET_THEME:
            newState = { ...state, theme: action.theme };
            break;
        case TOGGLE_THEME:
            const newTheme = state.theme === 'theme_default' ? 'theme_dark' : 'theme_default';
            newState = { ...state, theme: newTheme };
            break;
        default:
            newState = state;
    }
    storage.set(LOCAL_STORAGE_KEY_CONFIG, newState);
    return newState;
}

export default config;