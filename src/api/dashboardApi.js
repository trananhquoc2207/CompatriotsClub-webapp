import axiosClient from './axiosClient';

class DashboardApi {
    getAll = params => {
        return axiosClient.get('NhanVien/bangdieukhien', { params });
    };

    get = params => {
        return axiosClient.get('NhanVien/bangdieukhien', { params });
    };
}

const dashboardApi = new DashboardApi();
export default dashboardApi;