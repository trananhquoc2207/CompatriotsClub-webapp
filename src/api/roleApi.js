import i18n from 'i18n';
import axiosClient from './axiosClient';

class RoleApi {
    getAll = async (params) => {
        return await axiosClient.get('/PhanQuyen')
    }

    post = async (params) => {
        return await axiosClient
            .post('/TaiKhoan/PhanQuyenChoTaiKhoan', params)
            .then(response => {
                return 'success';
            })
            .catch(err => { throw err; })
    }
}

const roleApi = new RoleApi();
export default roleApi;