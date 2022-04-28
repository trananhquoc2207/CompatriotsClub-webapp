import { TOKEN } from 'utils/contants';

const useAuth = () => {
  const isAdmin = () => {
    const token = JSON.parse(localStorage.getItem(TOKEN));
    if (token) {
      if ((token?.displayName ?? '').toLowerCase().includes('admin')) {
        return true;
      }
    }
    return false;
  };
  const getUserInfo = () => {
    const token = JSON.parse(localStorage.getItem(TOKEN));
    if (token) {
      return token;
    }
    return null;
  };
  const getPermission = () => {
    const token = JSON.parse(localStorage.getItem(TOKEN));
    if (token) {
      if (token?.permissionList) {
        return token.permissionList;
      }
    }
    return [];
  };
  return {
    isAdmin,
    getUserInfo,
    getPermission,
  };
};

export default useAuth;
