import axios from 'axios';

const { REACT_APP_KONO_AUTH_URL: apiURL } = process.env;

axios.defaults.withCredentials = true;

export const login = ({ password }) => {
    return axios.post(apiURL + '/api/v1/auth/login', { password }, { withCredentials: true });
};

export const check = () => {
    return axios.get(apiURL + '/api/v1/auth/check');
};

export const logout = () => {
    return axios.post(apiURL + '/api/v1/auth/logout');
};

export const updatePassword = ({ password }) => {
    return axios.put(apiURL + '/api/v1/auth/password');
};