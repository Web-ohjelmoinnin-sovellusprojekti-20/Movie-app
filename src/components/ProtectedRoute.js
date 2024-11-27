import React from 'react'
import { useAccount } from '../context/useAccount.js'
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
    const { account } = useAccount();
    if(!account || !account.token) return <Navigate to={'/signin'}></Navigate>;
    return <Outlet></Outlet>;
}
