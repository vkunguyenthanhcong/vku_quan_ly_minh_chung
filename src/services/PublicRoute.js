import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const checkAuth = () => {
    const token = localStorage.getItem('token');
    if(token != null){
        return true;
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
