import Axios from 'axios';
import i18n from 'i18n';
import axiosClient from './axiosClient';
import apiLinks from 'utils/api-links';

class EmployeeApi {
  get = (params) => {
    return axiosClient.get(`/Member/GetPaged`, { params })
      .then(response => {
        if (response && (response.status_code === 404 || response.status_code === 500))
          throw response.error_message;
        return response;
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
  getID = (id, params) => {
    return axiosClient.get(`/Member/${id}`, { params })
      .then(response => {
        if (response && (response.status_code === 404 || response.status_code === 500))
          throw response.error_message;
        return response;
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
  getCode = (code) => {
    return axiosClient.get(`/Member/ByMaNV/${code}`)
      .then(response => {
        if (response && (response.status_code === 404 || response.status_code === 500))
          throw response.error_message;
        return response;
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
  post = params => {
    return axiosClient.post('/Member', params)
      .then(response => {
        if (response && (response.status_code === 404 || response.status_code === 500))
          throw response.message;
        return response.data;
      })
      .catch(err => {
        var message;
        if (err.response && err.response.status) {
          switch (err.response.status) {
            case 400:
              message = 'Lỗi nhập dữ liệu.';
              break;
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
  };
  postLeaveEmployee = (id, params) => {
    return Axios.put(apiLinks.employee.left(id), params)
      .then(response => {
        if (response && (response.status_code === 404 || response.status_code === 500))
          throw response.error_message;
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
  };
  postBackToWorkEmployee = id => {
    return Axios.put(apiLinks.employee.backToWork(id))
      .then(response => {
        if (response && (response.status_code === 404 || response.status_code === 500))
          throw response.error_message;
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
  };
  put = (id, params) => {
    return axiosClient.put(`/Member/${id}`, params)
      .then(response => {
        if (response && (response.status_code === 404 || response.status_code === 500))
          throw response.error_message;
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
  };
  delete = id => {
    return axiosClient.delete(`/Member/${id}`)
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

const employeeApi = new EmployeeApi();
export default employeeApi;
