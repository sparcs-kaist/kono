/* Action Types. */

const SET_VISIBLE = 'fullscreen/SET_VISIBLE';
const SET_IMAGE_URLS = 'fullscreen/SET_IMAGE_URLS';
const SET_IMAGE_INDEX = 'fullscreen/SET_IMAGE_INDEX';
const INCREMENT_IMAGE_INDEX = 'fullscreen/INCREMENT_IMAGE_INDEX';
const DECREMENT_IMAGE_INDEX = 'fullscreen/DECREMENT_IMAGE_INDEX';

/* Initial States. */
const initialState = {
    visible: false,
    imageURLs: [],
    imageIndex: 0
};

/* Action Definitions. */

/* SetVisible(visible: boolean) */
export const SetVisible = (visible) => {
    return {
        type: SET_VISIBLE,
        visible
    };
};

/* SetImageURLs(imageURLs: Array(string)) */
export const SetImageURLs = (imageURLs) => {
    return {
        type: SET_IMAGE_URLS,
        imageURLs
    };
};

/* SetImageIndex(imageIndex: number) */
export const SetImageIndex = (imageIndex) => {
    return {
        type: SET_IMAGE_INDEX,
        imageIndex
    };
};

/* IncrementImageIndex() */
export const IncrementImageIndex = () => {
    return {
        type: INCREMENT_IMAGE_INDEX
    };
};

/* DecrementImageIndex() */
export const DecrementImageIndex = () => {
    return {
        type: DECREMENT_IMAGE_INDEX
    };
};

/* Reducer. */
const fullscreen = (state = initialState, action) => {
    switch (action.type) {
        case SET_VISIBLE:
            return { ...state, visible: action.visible };
        case SET_IMAGE_URLS:
            return { ...state, imageURLs: action.imageURLs };
        case SET_IMAGE_INDEX:
            return { ...state, imageIndex: action.imageIndex };
        case INCREMENT_IMAGE_INDEX:
        {
            const newImageIndex = state.imageURLs.length === 0 ? 0 : (state.imageIndex + 1) % state.imageURLs.length;
            return { ...state, imageIndex: newImageIndex };
        }
        case DECREMENT_IMAGE_INDEX:
        {
            const newImageIndex = state.imageURLs.length === 0 ? 0 : (state.imageIndex + state.imageURLs.length - 1) % state.imageURLs.length;
            return { ...state, imageIndex: newImageIndex };
        }
        default:
            return state;
    }
}

export default fullscreen;