import i18n from 'i18n';
import axiosClient from './axiosClient';

class SiteApi {
    get = params => {
        return axiosClient
            .get('/ChiNhanh', { params })
            .then(response => {
                if (response.success)
                    return response;
                throw response.error_message;
            })
            .catch(err => {
                var message;
                if (err.response && err.response.success) {
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
    }

    post = params => {
        return axiosClient
            .post('/ChiNhanh', params)
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

    put = (id, params) => {
        return axiosClient
            .put(`/ChiNhanh/${id}`, params)
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

    delete = id => {
        return axiosClient
            .delete(`/ChiNhanh/${id}`)
            .then(response => {
                if (response && (response.status_code === 404 || response.status_code === 500))
                    throw response.error_message;
                return 'success';
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
    }
}

const siteApi = new SiteApi();
export default siteApi;