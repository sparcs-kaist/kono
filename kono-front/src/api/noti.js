import axios from 'axios';

const { REACT_APP_KONO_API_URL: apiURL = '' } = process.env;

axios.defaults.withCredentials = true;

export const retrieve = (params) => {
    return axios.get(apiURL + '/api/v1/noti', { params });
};

export const create = ({ noti_kr, noti_en }) => {
    return axios.post(apiURL + '/api/v1/noti', { noti_kr, noti_en }, { withCredentials: true });
};

export const update = (sid, { noti_kr, noti_en }) => {
    return axios.put(apiURL + `/api/v1/noti/${sid}`, { noti_kr, noti_en }, { withCredentials: true });
};

export const remove = (sid) => {
    return axios.delete(apiURL + `/api/v1/noti/${sid}`, { withCredentials: true });
};
