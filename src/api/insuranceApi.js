import i18n from 'i18n';
import axiosClient from './axiosClient';

class InsuranceApi {
    getAll = (params) => {
        const url = '/CaiDat';
        return axiosClient.get(url, { params });
    };

    put = (params) => {
        return axiosClient.put('/CaiDat', params)
            .then(response => {
                if (response && (response.status_code === 404 || response.status_code === 500))
                    throw response.error_message;
                return response.data;
            })
            .catch(err => {
                var message;
                if (err.response && err.response.status) {
                    switch (err.response.status) {
                        case 404:
                            message = i18n.t('Failed to connect to server.');
                            break;
                        case 500:
                            message = i18n.t('Something went wrong, please contact our support team.');
                            break;
                        default:
                            message = err[1];
                            break;
                    }
                }

                throw message;
            });
    };
}

const insuranceApi = new InsuranceApi();
export default insuranceApi;