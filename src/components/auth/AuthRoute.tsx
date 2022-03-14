import React from 'react'
import { Navigate, Route, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/Auth';

export function AuthOnlyRoute(props: {
    children: any;
    path: string;
}) {
    const { isLoggedIn } = useAuth()
    if (isLoggedIn) {
        const location = useLocation();
        return <Navigate to='/login' state={{ from: location }} replace/>
    }
    return <Route {...props}/>
}

export function AuthBannedRoute( props: {
    children: any;
    path: string;
}) {
    const { isLoggedIn } = useAuth()
    if (!isLoggedIn) {
        const location = useLocation();
        return <Navigate to='/' state={{ from: location }} replace/>
    }
    return <Route {...props}/>
}