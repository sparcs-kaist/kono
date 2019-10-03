import axios from 'axios';

const { REACT_APP_KONO_API_URL: apiURL } = process.env;

export const list = ({ params }) => {
    return axios.get(apiURL + '/api/v1/post', { params });
}

export const single = (postSID) => {
    return axios.get(apiURL + `/api/v1/post/${postSID}`);
}