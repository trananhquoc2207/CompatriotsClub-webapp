import { API_URL } from 'utils/contants';

const gatewayUrl = `${API_URL}/v1`;

const apiLinks = {
  statistic: {
   
  },
  role: {
    get: `${API_URL}/v1/Roles`,
    getDetail: (id) => `${API_URL}/v1/Roles/${id}`,
    post: `${API_URL}/v1/Roles`,
    put: (id) => `${API_URL}/v1/Roles/${id}`,
    delete: (id) => `${API_URL}/v1/Roles/${id}`,
    getPermission: (id) => `${API_URL}/v1/Roles/${id}/Permission`,
    addUser: (id) => `${API_URL}/v1/Roles/${id}/AddUser`,
    addPermission: (id) => `${API_URL}/v1/Roles/${id}/AddPermission`,
    removeUser: (id) => `${API_URL}/v1/Roles/${id}/RemoveUser`,
    removePermission: (id) => `${API_URL}/v1/Roles/${id}/RemovePermission`,
  },
  permission: {
    get: `${API_URL}/v1/Permissions/GetPaged`,
    post: `${API_URL}/v1/Permissions`,
    put: (id) => `${API_URL}/v1/Permissions/${id}`,
    delete: (id) => `${API_URL}/v1/Permissions/${id}`,
    getPermission: (id) => `${API_URL}/v1/Permissions/${id}/Permission`,
    addUser: (id) => `${API_URL}/v1/Permissions/${id}/AddUser`,
    removeUser: (id) => `${API_URL}/v1/Permissions/${id}/RemoveUser`,
    removeRole: (id) => `${API_URL}/v1/Permissions/${id}/RemoveRole`,
  },
  userManagement: {
    user: {
      get: `${API_URL}/v1/User/GetPaged`,
    },
  },
  employee: {
    uploadImage: (id) =>
      id ? `${API_URL}/v1/Employees/${id}/Image` : `${API_URL}/v1/Employees/Image`,
    left: (id) => `${API_URL}/v1/Employees/${id}/Left`,
    backToWork: (id) => `${API_URL}/v1/Employees/${id}/BackToWork`,
    export: `${API_URL}/v1/Exports/ExportMember`,
  },
  export: {
   
  },
  tools: {
  },
};

export default apiLinks;
