import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * RoleGuard - Protects routes based on user roles
 * 
 * @param {string[]} allowedRoles - Array of roles allowed to access (e.g., ['ADMIN', 'EVENT_MANAGER'])
 * @param {ReactNode} children - The component to render if authorized
 * 
 * Usage:
 * <RoleGuard allowedRoles={['ADMIN']}>
 *   <AdminDashboard />
 * </RoleGuard>
 */
const RoleGuard = ({ allowedRoles, children }) => {
    const { user, loading } = useAuth();

    // Wait for auth check to complete
    if (loading) {
        return null; // or a loading spinner
    }

    // User not authenticated - redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // User doesn't have required role - redirect to forbidden
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/forbidden" replace />;
    }

    // User has required role - render children
    return children;
};

export default RoleGuard;
