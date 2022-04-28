import axios from 'axios';
import queryString from 'query-string';
import { API_URL, TOKEN } from 'utils/contants';
// https://localhost:7029/
var API_u = "https://localhost:7029"
const options = {
    baseURL: `${API_u}/v1`,
    headers: {
        'content-type': 'application/json',
    },
    paramsSerializer: (params) => queryString.stringify(params),
};

const auth = JSON.parse(localStorage.getItem(TOKEN));
if (auth && auth.token) {
    options.headers.Authorization = `Bearer ${auth.token}`;
}

const axiosClient = axios.create(options);

axiosClient.interceptors.request.use((config) => config);

axiosClient.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }

    return response.data;
}, (error) => {
    throw error;
});

export default axiosClient;
