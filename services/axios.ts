import { getToken } from '@/storage/token';
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api-beta-lac.vercel.app/api',
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();

      if (token) {
        config.headers.Authorization = `${token}`;
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);
