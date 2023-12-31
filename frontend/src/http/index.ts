import axios from "axios";
import Cookies from "universal-cookie";

export const API_URL = process.env.NODE_ENV !== 'development' ? 'https://nest.trainingdata.solutions' : 'http://localhost:8000'

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,

})
const cookie = new Cookies()

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
})

$api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.post(`${API_URL}/api/token/refresh/`, {'refresh': cookie.get('refresh')})
            localStorage.setItem('token', response.data.access)
            return $api.request(originalRequest)
        } catch (error:any) {
            console.error('Произошла ошибка при обновлении токена:', error);
        }
    }
    return Promise.reject(error);
})
export default $api;