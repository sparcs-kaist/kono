/* Action Types. */

const SET_THEME = 'theme/SET_THEME';
const TOGGLE_THEME = 'theme/TOGGLE_THEME';
const SET_LANGUAGE = 'theme/SET_LANGUAGE';
const TOGGLE_LANGUAGE = 'theme/TOGGLE_LANGUAGE';

/* Initial States. */
const initialState = {
    theme: 'theme_default',
    language: 'kr'
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

/* Reducer. */
const config = (state = initialState, action) => {
    switch (action.type) {
        case SET_THEME:
            return { ...state, theme: action.theme };
        case TOGGLE_THEME:
            const newTheme = state.theme === 'theme_default' ? 'theme_dark' : 'theme_default';
            return { ...state, theme: newTheme };
        case SET_LANGUAGE:
            return { ...state, language: action.language };
        case TOGGLE_LANGUAGE:
            const newLanguage = state.language === 'kr' ? 'en' : 'kr';
            return { ...state, language: newLanguage };
        default:
            return state;
    }
}

export default config;