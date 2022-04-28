import i18n from 'i18n';
import axiosClient from './axiosClient';

class TimesheetApi {
  get = params => {
    return axiosClient.get('/ChamCong', { params });
  };
  getHistory = params => {
    return axiosClient.get('/ChamCong/LichSuChamCongAdmin', { params });
  }
  getAnalysis = params => {
    return axiosClient.get('/ChamCong/TrangThaiChamCong', { params });
  }
  postAttendance = params => {
    return axiosClient
      .post('/ChamCong/DanhSachChamCong', params)
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
  }
}

const timeSheetApi = new TimesheetApi();
export default timeSheetApi;