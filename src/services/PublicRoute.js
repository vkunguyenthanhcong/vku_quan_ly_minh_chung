import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

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
const checkAuth = () => {
    const token = localStorage.getItem('token');
    if(token != null){
        if(isTokenExpired(token)){
            return false;
        }else {
            return true;
        }
    }else{
        return false;
    }
};

const PublicRoute = ({ element, ...rest }) => {
    const location = useLocation();
    const isAuthenticated = checkAuth();

    return isAuthenticated ? (
        <Navigate to="/quan-ly" state={{ from: location }} replace />
    ) : (
        React.cloneElement(element, rest)
    );
};

export default PublicRoute;
