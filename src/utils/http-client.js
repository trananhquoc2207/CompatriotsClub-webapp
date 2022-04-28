import axios from 'axios';
import { TOKEN } from 'utils/contants';

let cancelToken;
const httpClient = {
  callApi: async ({
    method,
    contentType = 'application/json',
    url,
    data,
    params,
    onUploadProgress,
    responseType,
    cancelToken: isCancel,
  }) => {
    const auth = JSON.parse(localStorage.getItem(TOKEN));
    const headerToken = auth && auth?.token ? { Authorization: `bearer ${auth.token}` } : null;
    if (typeof cancelToken !== typeof undefined) {
      cancelToken.cancel('Operation canceled due to new request.');
    }
    cancelToken = axios.CancelToken.source();

    return axios({
      method,
      contentType,
      url,
      headers: { ...headerToken },
      data,
      params,
      onUploadProgress,
      responseType,
      cancelToken: isCancel && cancelToken.token,
    });
  },
};

export default httpClient;
