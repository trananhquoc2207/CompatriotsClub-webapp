import i18n from 'i18n';
import axiosClient from './axiosClient';

class AllowanceApi {
    get = id => {
        return axiosClient
            .get(`/PhuCap/${id}`)
            .then(response => { return response })
            .catch(error => {
                if (!error.response)
                    throw new Error(i18n.t('Can\'t request to server.'));

                switch (error.response.status) {
                    case 404:
                        throw new Error(i18n.t('Can\'t request to server.'));
                    default:
                        throw new Error(i18n.t('Can\'t identify error. Please report this error to admin'));
                }
            });
    }

    getByEmployee = id => {
        return axiosClient
            .get(`/PhuCap/?idNhanVien=${id}`)
            .then(response => { return response })
            .catch(error => {
                if (!error.response)
                    throw new Error(i18n.t('Can\'t request to server.'));

                switch (error.response.status) {
                    case 404:
                        throw new Error(i18n.t('Can\'t request to server.'));
                    default:
                        throw new Error(i18n.t('Can\'t identify error. Please report this error to admin'));
                }
            });
    }

    post = async (params) => {
        return await axiosClient
            .post('/PhuCap', params)//   [{}], {params: []}
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

    put = async (id, params) => {
        return await axiosClient
            .put(`/PhuCap/${id}`, params)
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

    delete = async (id) => {
        return await axiosClient
            .delete(`/PhuCap/${id}`)
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

const allowanceApi = new AllowanceApi();
export default allowanceApi;