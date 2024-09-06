import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

// Function to check if the token is expired or invalid
const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds
        return decoded.exp < currentTime; // Check if token is expired
    } catch (error) {
        return true; // If decoding fails, consider the token expired
    }
};

// Custom hook to check authentication status
const useAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !isTokenExpired(token)) {
            const role = localStorage.getItem('role');
            if(role == "USER"){
                navigate('/quan-ly'); 
            }else if(role == "ADMIN"){
                navigate('/admin'); 
            }
        }
    }, [navigate]);
};

export default useAuth;
