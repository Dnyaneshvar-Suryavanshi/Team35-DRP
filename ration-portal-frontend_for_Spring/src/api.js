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
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => {
        localStorage.clear();
        window.location.href = '/login';
    },
};


export const adminAPI = {

    getPendingShopkeepers: () => api.get('/admin/pending-shopkeeper-list'),
    getAllShopkeepers: () => api.get('/admin/shopkeeper-list'),
    approveShopkeeper: (shopkeeperId) => api.put(`/admin/approve/${shopkeeperId}`, {}),
    suspendShopkeeper: (shopkeeperId) => api.put(`/admin/suspend/${shopkeeperId}`, {}),


    createShop: (shopkeeperId, data) => api.post(`/admin/create-shop/${shopkeeperId}`, data),
    getAllShops: () => api.get('/admin/all-shops'),


    allocateStock: (data) => api.post('/admin/allocate', data),
    getAllAllocations: () => api.get('/admin/allocation-details'),
    getAllocationsByShop: (shopId, monthYear) => api.get(`/admin/shop/${shopId}/${monthYear}`),


    createEntitlement: (data) => api.post('/admin/create-entitlement', data),
    getAllEntitlements: () => api.get('/admin/entitlements'),
    updateEntitlement: (data) => api.put('/admin/update-entitlement', data),


    getAllFamilies: () => api.get('/admin/all-families'),
    getAllDistributionLogs: () => api.get('/admin/distribution-logs'),
};


export const shopkeeperAPI = {

    getMyShop: (shopkeeperId) => api.get(`/shopkeeper/${shopkeeperId}/shop`),


    addCitizen: (shopkeeperId, data) => api.post(`/shopkeeper/${shopkeeperId}/add-citizen`, data),
    updateCitizen: (shopkeeperId, cardNumber, data) => api.put(`/shopkeeper/${shopkeeperId}/update-citizen/${cardNumber}`, data),
    deleteCitizen: (shopkeeperId, citizenEmail) => api.delete(`/shopkeeper/${shopkeeperId}/delete-citizen/${citizenEmail}`),
    getCitizensUnderShop: (shopkeeperId) => api.get(`/shopkeeper/${shopkeeperId}/citizens`),


    getMyAllocations: (shopkeeperId) => api.get(`/shopkeeper/stock-allocation/${shopkeeperId}`),
    viewCurrentStock: (shopId) => api.get(`/shopkeeper/my-stock/${shopId}`),


    distributeRation: (data) => api.post('/shopkeeper/distribute-ration', data),
    generateOtp: (data) => api.post('/shopkeeper/generate-otp', data),
    getDistributionHistory: (shopkeeperId) => api.get(`/shopkeeper/distribution-history/${shopkeeperId}`),


    getEntitlements: () => api.get('/admin/entitlements'),

    sendPaymentSuccessEmail: (data) => api.post('/payment/process', data), // Updated to use PaymentController
    getPaymentHistory: (shopkeeperId) => api.get(`/payment/history/${shopkeeperId}`), // Added
    addFeedback: (data) => api.post('/feedback/add', data),
};

export const paymentAPI = {
    getAllPayments: () => api.get('/payment/all'),
};


export const citizenAPI = {
    getMyRationCard: (email) => api.get(`/citizen/my-ration-card/${email}`),
    getMyDistributions: (email) => api.get(`/citizen/my-distributions/${email}`),
};

export default api;
