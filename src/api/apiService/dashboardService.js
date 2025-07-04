// src/api/apiService/dashboardService.js

import api from './userService'; 

export const getDashboardData = () => {
  return api.get('/api/users/dashboard/');
};


const dashboardService = {
  getDashboardData,
};

export default dashboardService;