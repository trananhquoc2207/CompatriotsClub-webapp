import i18n from 'i18n';
import axiosClient from './axiosClient';

class UnitApi {
  get = (params) => axiosClient
      .get('/DonVi', { params })
      .then((response) => {
        if (response) return response;
        throw response;
      })
      .catch((err) => {
        let message;
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

  post = (params) => axiosClient
      .post('/DonVi', params)
      .then((response) => {
        if (response) return response;
        throw response;
      })
      .catch((err) => {
        let message;
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
      })

  put = (params) => axiosClient
      .put('/DonVi', params)
      .then((response) => {
        if (response.success) return response.data;
        throw response;
      })
      .catch((err) => {
        let message;
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
      })

  delete = (id) => axiosClient
      .delete(`/DonVi/${id}`)
      .then((response) => {
        if (response && (response.status_code === 404 || response.status_code === 500)) throw response.error_message;
        return 'success';
      })
      .catch((err) => {
        let message;
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
      })
}

const unitApi = new UnitApi();
export default unitApi;
