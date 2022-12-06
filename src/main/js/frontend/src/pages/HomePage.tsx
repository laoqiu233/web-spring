import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { Button } from '../components/Button';
import { logout } from '../features/auth/authSlice';

export default function HomePage() {
    const username = useAppSelector(state => state.auth.userInfo.username);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    function onClick() {
        dispatch(logout());
        localStorage.removeItem('refreshToken');
        navigate('/login')
    }

    return (
        <>
            <h1>{username}</h1>
            <Button onClick={onClick}>Logout</Button>
        </>
    )
}