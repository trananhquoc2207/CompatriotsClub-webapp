import i18n from 'i18n';
import axiosClient from './axiosClient';

class DeductionSlipApi {


    post = async (params) => {
        return await axiosClient
            .post('/KhauTru', params)
            .then(response => {
                if (response.success)
                    return response.data;
                throw response;
            })
            .catch(err => {
                var message;
                if (err.response && err.response.success) {
                    switch (err.response.success) {
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
    }



}

const deductionSlipApi = new DeductionSlipApi();
export default deductionSlipApi;