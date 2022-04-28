import i18n from 'i18n';
import axiosClient from './axiosClient';

class ShiftGroupApi {
  get = params => {
    return axiosClient
      .get('/NhomDiCa', { params })
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
      .post('/NhomDiCa', params)
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

  put = (params) => {
    return axiosClient
      .put('/NhomDiCa', params)
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
  addEmployee = (id, params) => {
    return axiosClient
      .post(`/NhomDiCa/${id}/ThemNhanVien`, params)
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
  deleteEmployee = (id, params) => {
    return axiosClient
      .put(`/NhomDiCa/${id}/XoaNhanVien`, params)
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
      .delete(`/NhomDiCa/${id}`)
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

const shiftGroupApi = new ShiftGroupApi();
export default shiftGroupApi;