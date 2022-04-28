import i18n from 'i18n';
import axiosClient from './axiosClient';

class ShiftApi {
    get = params => {
        return axiosClient
            .get('/CaLamViec', { params })
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

    post = params => {
        return axiosClient
            .post('/CaLamViec', params)
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
            })
    }

    put = (id, params) => {
        return axiosClient
            .put(`/CaLamViec/${id}`, params)
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
            })
    }

    delete = id => {
        return axiosClient
            .delete(`/CaLamViec/${id}`)
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
            })
    }
}

const shiftApi = new ShiftApi();
export default shiftApi;