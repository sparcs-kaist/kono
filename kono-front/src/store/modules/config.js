/* Action Types. */

const SET_THEME = 'theme/SET_THEME';

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

/* Reducer. */
const config = (state = initialState, action) => {
    switch (action.type) {
        case SET_THEME:
            return { ...state, theme: action.theme };
        default:
            return state;
    }
}

export default config;