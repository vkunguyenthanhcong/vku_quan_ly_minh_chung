import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds
        return decoded.exp < currentTime; // Check if token is expired
    } catch (error) {
        console.error('Token decoding failed:', error);
        return true; // If decoding fails, consider the token expired
    }
};

const checkAuthAndRole =  (requiredRoles) => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
        console.log('Token is missing or expired');
        return false; // Token is either missing or expired
    }

    const userRole = localStorage.getItem('role');
    return requiredRoles.includes(userRole);
};

const ProtectedRoute = ({ element, requiredRoles, ...rest }) => {
    const location = useLocation();

    return checkAuthAndRole(requiredRoles) ? (
        React.cloneElement(element, rest)
    ) : (
        <Navigate to="/" state={{ from: location }} replace />
    );
};


export default ProtectedRoute;
