import i18n from 'i18n';
import axiosClient from './axiosClient';

class RecorderApi {

    getAll = async (params) => {
        return await axiosClient.get('/MayChamCong', { params })
            .then(response => {
                return response
            })
            .catch(err => {
                if (!err.response)
                    throw new Error(i18n.t('Can\'t request to server'))
                switch (err.response.status) {
                    case 404:
                        throw new Error(i18n.t('Can\'t request to server'));
                    default:
                        throw new Error(i18n.t('Can\'t identify error! Please report to the support team'))
                }
            });
    }

    post = async (params) => {
        return await axiosClient.post('/MayChamCong', params)
            .then(response => {
                return response;
            })
            .catch(err => {
                if (!err.response)
                    throw new Error(i18n.t('Can\'t request to server'))
                switch (err.response.status) {
                    case 404:
                        throw new Error(i18n.t('Can\'t request to server'));
                    default:
                        throw new Error(i18n.t('Can\'t identify error! Please report to the support team '));
                }
            })
    }
    put = async (id, params) => {
        return await axiosClient.put(`/MayChamCong/Update/${id}`, params)
            .then(response => {
                return response;
            })
            .catch(err => {
                if (!err.response)
                    throw new Error(i18n.t('Can\'t request to server'))
                switch (err.response.status) {
                    case 404:
                        throw new Error(i18n.t('Can\'t request to server'));
                    default:
                        throw new Error(i18n.t('Can\'t identify error! Please report to the support team '));
                }
            })

    }
    delete = id => {
        return axiosClient
            .delete(`/MayChamCong/${id}`)
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
const recorderApi = new RecorderApi();
export default recorderApi;