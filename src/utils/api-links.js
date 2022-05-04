import { API_URL } from 'utils/contants';

const gatewayUrl = `${API_URL}/v1`;

const apiLinks = {
  statistic: {
    getOverBodyTemperature: `${gatewayUrl}/EmployeeStatistic/OverBodyTemperature`,
    getAbsentStatistic: `${API_URL}/v1/Statistics/GetAbsentStatisticByEmployee`,
    getMealStatistic: `${API_URL}/v1/Com/thongKeComNGay`,
    getListEmployeePostByLeader: `${API_URL}/v1/Com/GetListEmployeePostByLeader`,
    getRiceRegisteredOfEmployee: `${API_URL}/v1/Meal/GetRiceRegisteredOfEmployee`,
    updateStatusRegisteredOfEmployee: `${API_URL}/v1/Com/UpdateStatusRegisteredOfEmployee`,
    updateMealRegisteredOfEmployee: (id) => `${API_URL}/v1/Com/${id}`,
    deleteRiceRegisteredOfEmployee: (riceId) => `${API_URL}/v1/Com/DeleteRiceRegisteredOfEmployee?RiceId=${riceId}`,
    postByLeader: `${API_URL}/v1/Com/PostByLeader`,
    updateRegistedRice: ({ date, riceRegisterType }) => `${API_URL}/v1/Com/UpdateRegistered?NgayDangKy=${date}&&IDComTheoCa=${riceRegisterType}`,
  },
  attendance: {
    attendanceByManual: `${API_URL}/v1/Attendances/AttendanceByManual`,
    updateAttendanceByManual: `${API_URL}/v1/Attendances/UpdateAttendanceByManual`,
    additionalReason: `${API_URL}/v1/AttendanceAdditionalReasons`,
    updateAdditionalReason: (id) => `${API_URL}/v1/AttendanceAdditionalReasons/${id}`,
    deleteAdditionalReason: (id) => `${API_URL}/v1/AttendanceAdditionalReasons/${id}`,
  },
  scheduleGroup: {
    get: `${API_URL}/v1/ScheduleGroups`,
    post: `${API_URL}/v1/ScheduleGroups`,
    put: (id) => `${API_URL}/v1/ScheduleGroups/${id}`,
    delete: (id) => `${API_URL}/v1/ScheduleGroups/${id}`,
    getDetail: (id) => `${API_URL}/v1/ScheduleGroups/${id}`,
    addScheduleLoop: (id) => `${API_URL}/v1/ScheduleGroups/${id}/AddScheduleLoop`,
    deleteScheduleLoop: (id, loopId) => `${API_URL}/v1/ScheduleGroups/${id}/DeleteScheduleLoop/${loopId}`,
  },
  shift: {
    get: `${API_URL}/v1/Shifts`,
  },
  meal: {
    getMealType: `${API_URL}/v1/LoaiDangKyCom`,
    post: `${API_URL}/v1/Com/DangKyComDanhChoTruongPhong`,
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
    historyAttendances: `${API_URL}/v1/Exports/Attendances/AttendanceHistory`,
    statisticAttendances: `${API_URL}/v1/Exports/Attendances/AttendanceStatistic`,
    synthenticStatisticAttendances: `${API_URL}/v1/Exports/Attendances/AttendanceSynthenticStatistic`,
    statisticMealByDay: `${API_URL}/v1/Com/ThongKeComNgayExcel`,
    statisticMealByMonth: `${API_URL}/v1/Com/QuyetToanComExcel`,
  },
  tools: {
    syncAttendance: `${API_URL}/v1/Tools/Attendance/GenerateAttendanceSession`,
  },
};

export default apiLinks;
