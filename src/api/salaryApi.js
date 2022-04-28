import i18n from 'i18n';
import axiosClient from './axiosClient';

class SalaryApi {
    getEmployee = params => {
        return axiosClient
            .get('/NhanVien/tongluongnhan', { params })
            .then(response => {
                if (response.success)
                    return response;

                throw response;
            })
            .catch(err => {
                let { message } = err.message || null;

                if (message === null) {
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

                throw new Error(message);
            });
    }
}

const salaryApi = new SalaryApi();
export default salaryApi;