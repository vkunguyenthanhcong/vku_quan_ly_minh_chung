import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

// Function to check if the token is expired or invalid
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

// Function to check if the user is authenticated and has the required role
const checkAuthAndRole = (requiredRole) => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
        console.log('Token is missing or expired');
        return false; // Token is either missing or expired
    }

    const userRole = localStorage.getItem('role');
    return userRole === requiredRole;
};

const ProtectedRoute = ({ element, requiredRole, ...rest }) => {
    const location = useLocation();

    return checkAuthAndRole(requiredRole) ? (
        React.cloneElement(element, rest) // Render the protected component
    ) : (
        <Navigate to="/" state={{ from: location }} replace /> // Redirect to login if not authenticated or role does not match
    );
};

export default ProtectedRoute;
