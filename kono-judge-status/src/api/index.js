import axios from 'axios'

const { REACT_APP_JUDGE_API_URL: apiURL = '' } = process.env;

export const data = (device_id, recent) => {
    return axios.get(apiURL + `/${device_id}?recent=${recent}`);
};

export const devices = () => {
    return axios.get(apiURL + `/device_ids`);
};