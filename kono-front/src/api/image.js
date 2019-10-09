import axios from 'axios';

const { REACT_APP_KONO_API_URL: apiURL } = process.env;

export const list = ({ params }) => {
    return axios.get(apiURL + '/api/v1/image', { params });
}

export const count = () => {
    return axios.get(apiURL + `/api/v1/image/count`);
}