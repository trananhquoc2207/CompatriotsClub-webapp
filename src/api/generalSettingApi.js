import i18n from 'i18n';
import axiosClient from './axiosClient';

class GeneralSettingApi {
    getInsurance = () => {
        return axiosClient
            .get('/CaiDat');
    }

    getAllowance = () => {
        return axiosClient.get('/NhanVien');
    }
}
const generalSettingApi = new GeneralSettingApi();
export default generalSettingApi;
