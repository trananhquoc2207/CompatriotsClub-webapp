import i18n from 'i18n';
import axiosClient from './axiosClient';

class ProductApi {
    getAll = async (params) => {
        return await axiosClient
            .get('/SanPham', { params })
            .then(response => {
                if (response.success)
                    return response;
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

    post = async (params) => {
        return await axiosClient
            .post('/SanPham', params)
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

    put = async (id, params) => {
        return await axiosClient
            .put(`/SanPham/${id}`, params)
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

    delete = async (id) => {
        return await axiosClient
            .delete(`/SanPham/${id}`)
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

const productApi = new ProductApi();
export default productApi;