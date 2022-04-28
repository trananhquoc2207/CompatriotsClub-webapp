import axiosClient from 'api/axiosClient';
import i18n from 'i18n';

class AccountApi {
    login = async (params) => {
        return await axiosClient
            .post('/User/Login', params)
            .then(response => {
                if (response.status_code >= 200 || response.status_code <= 299)
                    return response.data;
                throw response.data;
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
                        case 401:
                            message = i18n.t('Username or password is incorrect.');
                            break;
                        default:
                            message = err[1];
                            break;
                    }
                }

                throw message;
            });
    }

    changePassword = async (params) => {
        return await axiosClient
            .put('/TaiKhoan/CapNhapMatKhauBySelf', params)
            .then(response => {
                if (response.status_code >= 200 || response.status_code <= 299)
                    return i18n.t('Changed password.');
                throw response.data;
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
                        case 401:
                            message = i18n.t('Username or password is incorrect.');
                            break;
                        default:
                            message = err[1];
                            break;
                    }
                }

                throw message;
            });
    }

    forgetPassword = async (params) => {
        return await axiosClient
            .post('/TaiKhoan/QuenMatKhau', params)
            .then(response => {
                if (response.status_code >= 200 || response.status_code <= 299)
                    return i18n.t('Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.');
                throw response.data;
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
                        case 401:
                            message = i18n.t('Username or password is incorrect.');
                            break;
                        default:
                            message = err[1];
                            break;
                    }
                }

                throw message;
            });
    }

    get = async (id) => {
        return await axiosClient
            .get(`/TaiKhoan/${id}`);
    }

    getAll = params => {
        return axiosClient
            .get('/TaiKhoan', { params });
    }

    post = async (params) => {
        return await axiosClient
            .post('/TaiKhoan', params)
            .then(response => {
                if (response && (response.status_code === 404 || response.status_code === 500))
                    throw response;
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
    }

    put = async (id, params) => {
        return await axiosClient
            .put(`/TaiKhoan/${id}`, params)
            .then(response => {
                if (response && (response.status_code === 404 || response.status_code === 500))
                    throw response;
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
            .delete(`/TaiKhoan/${id}`)
            .then(response => {
                if (response && (response.status_code === 404 || response.status_code === 500))
                    throw response;
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

    isValidEmail = email => {
        return axiosClient
            .get(`/TaiKhoan/CheckValidEmail?email=${email}`);
    }

    isValidEmployee = employee => {
        return axiosClient
            .get(`/NhanVien/ByMaNV/${employee}`)
            .then(response => { return response; })
            .catch(error => { return false; });
    }

    isValidUsername = user => {
        return axiosClient
            .get(`/TaiKhoan/CheckValidUsername?username=${user}`)
            .then(response => {
                if (response.success && response.data)
                    return true;

                return false;
            })
            .catch(error => { return false; });
    }
}

const accountApi = new AccountApi();
export default accountApi;