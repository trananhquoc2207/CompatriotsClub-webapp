import types from 'actions/types';
import apiLinks from 'utils/api-links';
import httpClient from 'utils/http-client';
import { notify } from 'utils/helpers';

const exportRequest = () => ({
  type: types.EXPORT_REQUEST,
});
const exportSuccess = (response) => ({
  type: types.EXPORT_SUCCESS,
  payload: response,
});
const exportFailure = (error) => ({
  type: types.EXPORT_FAILURE,
  payload: error,
});
const exportExcel =
  ({ method, url, data, params, fileName }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(exportRequest());
        httpClient
          .callApi({
            method,
            responseType: 'blob',
            url,
            data,
            params,
          })
          .then((response) => {
            dispatch(exportSuccess(response.data));
            const tempUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = tempUrl;
            link.setAttribute(
              'download',
              `${fileName || 'Xuất báo cáo'}.xlsx`,
            );
            document.body.appendChild(link);
            link.click();
            resolve(response.data);
          })
          .catch((error) => {
            notify('warning', error.response?.data ?? 'Lỗi không thể xác định.');
            dispatch(exportFailure(error));
            reject();
          });
      });

export { exportExcel };
