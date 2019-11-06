
/* Action Types. */
const TOGGLE_MOBILE_HEADER = 'layout/TOGGLE_MOBILE_HEADER';
const CLOSE_MOBILE_HEADER = 'layout/CLOSE_MOBILE_HEADER';

/* Initial States. */
const initialState = {
    headerOpen: true
};

/* Action Definitions. */
/* ToggleMobileHeader() */
export const ToggleMobileHeader = () => {
    return {
        type: TOGGLE_MOBILE_HEADER
    };
};

/* CloseMobileHeader() */
export const CloseMobileHeader = () => {
    return {
        type: CLOSE_MOBILE_HEADER
    };
};

/* Reducer. */
const layout = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_MOBILE_HEADER:
            return { ...state, headerOpen: !state.headerOpen };
        case CLOSE_MOBILE_HEADER:
            return { ...state, headerOpen: false };
        default:
            return state;
    }
}

export default layout;