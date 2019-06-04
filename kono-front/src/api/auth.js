import axios from 'axios';

const { REACT_APP_KONO_AUTH_URL: apiURL } = process.env;

export const login = ({ password }) => {
    return axios.post(apiURL + '/api/v1/auth/login', { password }, { withCredentials: true });
};

export const check = () => {
    return axios.get(apiURL + '/api/v1/auth/check', { withCredentials: true });
};

export const logout = () => {
    return axios.post(apiURL + '/api/v1/auth/logout', { withCredentials: true });
};

export const updatePassword = ({ password }) => {
    return axios.put(apiURL + '/api/v1/auth/password', { withCredentials: true });
};