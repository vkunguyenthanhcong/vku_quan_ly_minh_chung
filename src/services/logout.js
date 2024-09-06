import React from 'react';
import { useNavigate }from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();
    // Clear token from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Optionally remove user role

    // Redirect to login page
    
    navigate('/');
};

export default Logout;
