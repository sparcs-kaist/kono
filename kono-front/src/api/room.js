import axios from 'axios';

const { REACT_APP_KONO_API_URL: apiURL } = process.env;

export const recentList = () => {
    return axios.get(apiURL + '/api/v1/room/recent');
}

export const recentSingle = (roomNumber) => {
    return axios.get(apiURL + `/api/v1/room/recent/${roomNumber}`);
}