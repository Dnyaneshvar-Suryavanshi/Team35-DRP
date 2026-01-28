import axios from 'axios';
import config from './config';
import { toast } from 'react-toastify';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: config.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//Response interceptor to handle common errors
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // 
        console.error('API Error Details:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });

        if (error.response) {
            // Handle 401 Unauthorized
            if (error.response.status === 401) {
                localStorage.clear();
                window.location.href = '/login';
                toast.error('Session expired. Please login again.');
            }
            // Handle 403 Forbidden
            else if (error.response.status === 403) {
                toast.error('Access denied. Insufficient permissions.');
            }
        } else if (error.request) {
            // Request was made but no response received (CORS, network, backend down)
            console.error('No response received:', error.request);
            toast.error('Cannot connect to server. Please check if backend is running.');
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);


export const authAPI = {
    register: (data) => api.post('Auth/register', data),
    login: (data) => api.post('Auth/login', data),
    logout: () => {
        localStorage.clear();
        window.location.href = '/login';
    },
};


export const adminAPI = {

    getPendingShopkeepers: () => api.get('Admin/pending-shopkeeper-list'),
    getAllShopkeepers: () => api.get('Admin/shopkeeper-list'),
    approveShopkeeper: (shopkeeperId) => api.put(`Admin/approve/${shopkeeperId}`),
    suspendShopkeeper: (shopkeeperId) => api.put(`Admin/suspend/${shopkeeperId}`, {}),


    createShop: (shopkeeperId, data) => api.post(`Admin/create-shop/${shopkeeperId}`, data),
    getAllShops: () => api.get('Admin/all-shops'),


    allocateStock: (data) => api.post('Admin/allocate', data),
    getAllAllocations: () => api.get('Admin/allocation-details'),
    getAllocationsByShop: (shopId, monthYear) => api.get(`Admin/shop/${shopId}/${monthYear}`),


    createEntitlement: (data) => api.post('Admin/create-entitlement', data),
    getAllEntitlements: () => api.get('Admin/entitlements'),
    updateEntitlement: (data) => api.put('Admin/update-entitlement', data),


    getAllFamilies: () => api.get('Admin/all-families'),
    getAllDistributionLogs: () => api.get('Admin/distribution-logs'),
};


export const shopkeeperAPI = {

    getMyShop: (shopkeeperId) => api.get(`Shopkeeper/${shopkeeperId}/shop`),


    addCitizen: (shopkeeperId, data) => api.post(`Shopkeeper/${shopkeeperId}/add-citizen`, data),
    getCitizensUnderShop: (shopkeeperId) => api.get(`Shopkeeper/${shopkeeperId}/citizens`),


    getMyAllocations: (shopkeeperId) => api.get(`Shopkeeper/stock-allocation/${shopkeeperId}`),
    confirmAllPendingStock: (shopkeeperId) => api.put(`Shopkeeper/confirm-all-pending-stock/${shopkeeperId}`),
    viewCurrentStock: (shopId) => api.get(`Shopkeeper/my-stock/${shopId}`),


    distributeRation: (data) => api.post('Shopkeeper/distribute-ration', data),
    generateOtp: (data) => api.post('Shopkeeper/generate-otp', data),
    getDistributionHistory: (shopkeeperId) => api.get(`Shopkeeper/distribution-history/${shopkeeperId}`),
};


export const citizenAPI = {
    getMyRationCard: (email) => api.get(`Citizen/my-ration-card/${email}`),
    getMyEntitlements: () => api.get('Citizen/my-entitlements'),
    getMyDistributions: (cardNumber) => api.get(`Citizen/my-distributions/${cardNumber}`),
};

export default api;
