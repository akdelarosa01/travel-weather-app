import axios from "axios";

const axiosRequest = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
});

export default axiosRequest;