/* Action Types. */

const SET_THEME = 'theme/SET_THEME';
const TOGGLE_THEME = 'theme/TOGGLE_THEME';

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
    switch (action.type) {
        case SET_THEME:
            return { ...state, theme: action.theme };
        case TOGGLE_THEME:
            const newTheme = state.theme === 'theme_default' ? 'theme_dark' : 'theme_default';
            return { ...state, theme: newTheme };
        default:
            return state;
    }
}

export default config;