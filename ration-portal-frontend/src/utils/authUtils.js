export const getAuthToken = () => localStorage.getItem('token');

export const getUserRole = () => localStorage.getItem('role');

export const getUserId = () => localStorage.getItem('userId');
export const getUserEmail = () => localStorage.getItem('email');

export const isAuthenticated = () => !!localStorage.getItem('token');

export const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('shopId');
};

export const setAuthData = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', user.role);
    localStorage.setItem('userId', user.userId);
    localStorage.setItem('email', user.email);
};
