import { API_URL } from 'utils/contants';

const gatewayUrl = `${API_URL}/v1`;

const apiLinks = {
  statistic: {
    getOverBodyTemperature: `${gatewayUrl}/EmployeeStatistic/OverBodyTemperature`,
    getAbsentStatistic: `${API_URL}/api/Statistics/GetAbsentStatisticByEmployee`,
    getMealStatistic: `${API_URL}/v1/Com/thongKeComNGay`,
    getListEmployeePostByLeader: `${API_URL}/v1/Com/GetListEmployeePostByLeader`,
    getRiceRegisteredOfEmployee: `${API_URL}/api/Meal/GetRiceRegisteredOfEmployee`,
    updateStatusRegisteredOfEmployee: `${API_URL}/v1/Com/UpdateStatusRegisteredOfEmployee`,
    updateMealRegisteredOfEmployee: (id) => `${API_URL}/v1/Com/${id}`,
    deleteRiceRegisteredOfEmployee: (riceId) => `${API_URL}/v1/Com/DeleteRiceRegisteredOfEmployee?RiceId=${riceId}`,
    postByLeader: `${API_URL}/v1/Com/PostByLeader`,
    updateRegistedRice: ({ date, riceRegisterType }) => `${API_URL}/v1/Com/UpdateRegistered?NgayDangKy=${date}&&IDComTheoCa=${riceRegisterType}`,
  },
  attendance: {
    attendanceByManual: `${API_URL}/api/Attendances/AttendanceByManual`,
    updateAttendanceByManual: `${API_URL}/api/Attendances/UpdateAttendanceByManual`,
    additionalReason: `${API_URL}/api/AttendanceAdditionalReasons`,
    updateAdditionalReason: (id) => `${API_URL}/api/AttendanceAdditionalReasons/${id}`,
    deleteAdditionalReason: (id) => `${API_URL}/api/AttendanceAdditionalReasons/${id}`,
  },
  scheduleGroup: {
    get: `${API_URL}/api/ScheduleGroups`,
    post: `${API_URL}/api/ScheduleGroups`,
    put: (id) => `${API_URL}/api/ScheduleGroups/${id}`,
    delete: (id) => `${API_URL}/api/ScheduleGroups/${id}`,
    getDetail: (id) => `${API_URL}/api/ScheduleGroups/${id}`,
    addScheduleLoop: (id) => `${API_URL}/api/ScheduleGroups/${id}/AddScheduleLoop`,
    deleteScheduleLoop: (id, loopId) => `${API_URL}/api/ScheduleGroups/${id}/DeleteScheduleLoop/${loopId}`,
  },
  shift: {
    get: `${API_URL}/api/Shifts`,
  },
  meal: {
    getMealType: `${API_URL}/v1/LoaiDangKyCom`,
    post: `${API_URL}/v1/Com/DangKyComDanhChoTruongPhong`,
  },
  role: {
    get: `${API_URL}/api/Roles`,
    getDetail: (id) => `${API_URL}/api/Roles/${id}`,
    post: `${API_URL}/api/Roles`,
    put: (id) => `${API_URL}/api/Roles/${id}`,
    delete: (id) => `${API_URL}/api/Roles/${id}`,
    getPermission: (id) => `${API_URL}/api/Roles/${id}/Permission`,
    addUser: (id) => `${API_URL}/api/Roles/${id}/AddUser`,
    addPermission: (id) => `${API_URL}/api/Roles/${id}/AddPermission`,
    removeUser: (id) => `${API_URL}/api/Roles/${id}/RemoveUser`,
    removePermission: (id) => `${API_URL}/api/Roles/${id}/RemovePermission`,
  },
  permission: {
    get: `${API_URL}/api/Permissions`,
    post: `${API_URL}/api/Permissions`,
    put: (id) => `${API_URL}/api/Permissions/${id}`,
    delete: (id) => `${API_URL}/api/Permissions/${id}`,
    getPermission: (id) => `${API_URL}/api/Permissions/${id}/Permission`,
    addUser: (id) => `${API_URL}/api/Permissions/${id}/AddUser`,
    removeUser: (id) => `${API_URL}/api/Permissions/${id}/RemoveUser`,
    removeRole: (id) => `${API_URL}/api/Permissions/${id}/RemoveRole`,
  },
  userManagement: {
    user: {
      get: `${API_URL}/api/Users`,
    },
  },
  employee: {
    uploadImage: (id) =>
      id ? `${API_URL}/api/Employees/${id}/Image` : `${API_URL}/api/Employees/Image`,
    left: (id) => `${API_URL}/api/Employees/${id}/Left`,
    backToWork: (id) => `${API_URL}/api/Employees/${id}/BackToWork`,
    export: `${API_URL}/v1/NhanVien/danhsachnhanvien/export`,
  },
  export: {
    historyAttendances: `${API_URL}/api/Exports/Attendances/AttendanceHistory`,
    statisticAttendances: `${API_URL}/api/Exports/Attendances/AttendanceStatistic`,
    synthenticStatisticAttendances: `${API_URL}/api/Exports/Attendances/AttendanceSynthenticStatistic`,
    statisticMealByDay: `${API_URL}/v1/Com/ThongKeComNgayExcel`,
    statisticMealByMonth: `${API_URL}/v1/Com/QuyetToanComExcel`,
  },
  tools: {
    syncAttendance: `${API_URL}/api/Tools/Attendance/GenerateAttendanceSession`,
  },
};

export default apiLinks;
