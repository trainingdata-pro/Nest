import axios from "axios";

export const API_URL = 'http://192.168.1.83:8000'
const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,

})


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
            const cookieValue = document.cookie
                .split('; ')
                .find((row) => row.startsWith('refresh='))?.split('=')[1];
            const response = await $api.post(`/api/token/refresh/`, {'refresh': cookieValue})
            localStorage.setItem('token', response.data.access)
            document.cookie = `refresh=${response.data.refresh}`
            return $api.request(originalRequest)
        } catch (error:any) {
            console.error('Произошла ошибка при обновлении токена:', error);
        }
    }

    return Promise.reject(error);
})
export default $api;