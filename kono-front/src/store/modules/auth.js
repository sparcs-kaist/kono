import { check as checkAPI } from 'api/auth';

/* Action Types. */

/* SYNCHRONOUS action: LOGIN setter */
const SET_LOGIN = 'auth/SET_LOGIN';
/* AYNCHRONOUS action used for logout */
const LOGOUT    = 'auth/LOGOUT';

/* Initial States. */
const initialState = {
    login: false
};

/* Action Definitions. */

/* SetLogin(login: boolean) */
export const SetLogin = (login) => {
    return { 
        type: SET_LOGIN, 
        login
    };
};

/* Validate() */
export const Validate = () => {
    return (dispatch) => {
        return checkAPI()
            .then(
                (res) => dispatch(() => console.log(res)),
                (err) => dispatch(() => console.log(err))
            );
    };
};

/* Logout() */
export const Logout = () => {
    return  {
        type: LOGOUT
    };
};

/* Reducer. */
const auth = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOGIN:
            return { ...state, login: action.login };
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
};

export default auth;