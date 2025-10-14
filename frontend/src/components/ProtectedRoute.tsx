import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from './LoadingScreen';
import ErrorDisplay from './ErrorDisplay';

interface ProtectedRouteProps {
    children: React.ReactNode;
    role?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    if (isLoading) {
        return <LoadingScreen loadingText="Verifying authentication..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (role && user?.role !== role) {
        return <ErrorDisplay 
            message={'This page is not accessible'} 
            buttonText={'Go Home'} 
            handleClick={() => navigate('/')} 
        />
    }

    return <>{children}</>;
};

export default ProtectedRoute;
