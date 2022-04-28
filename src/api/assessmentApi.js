import axiosClient from './axiosClient';
class AssessmentApi {
    get = (params) => {
        const url = '/Nhanvien/danhgianhanvien';
        return axiosClient.get(url, { params });
    };

}

const assessmentApi = new AssessmentApi();
export default assessmentApi;