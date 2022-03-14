import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/Auth';

export function AuthOnlyRoute(props: {
    children: JSX.Element;
}) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    const location = useLocation();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return props.children;
}

export function AuthBannedRoute(props: {
  children: JSX.Element;
}) {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) {
    const location = useLocation();
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return props.children;
}
