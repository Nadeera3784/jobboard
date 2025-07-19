import axios from 'axios';

import { AppConstants } from '../constants';
import { getJWTToken } from '.';

const Intercom = axios.create({
  baseURL: AppConstants.API_URL,
});

Intercom.interceptors.request.use(
  async function (config) {
    const token = getJWTToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

Intercom.interceptors.response.use(
  function (response) {
    return Promise.resolve(response);
  },
  function (error) {
    if (error.response.status === 401 || error.response.status === 403) {
      const currentPath = window.location.pathname;
      const isPublicRoute =
        currentPath === '/' ||
        currentPath.startsWith('/search') ||
        currentPath.startsWith('/auth');

      if (!isPublicRoute) {
        localStorage.clear();
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  },
);

//http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export { Intercom };
