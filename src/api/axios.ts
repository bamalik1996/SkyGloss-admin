import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://skygloss-backend-production.up.railway.app',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        // Unwrap standardized backend response { data, statusCode, message }
        if (response.data && response.data.hasOwnProperty('data') && response.data.hasOwnProperty('statusCode')) {
            return {
                ...response,
                data: response.data.data,
            };
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
