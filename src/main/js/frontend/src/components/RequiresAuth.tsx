import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import loaderImage from '../images/loader.svg';

interface RequiresAuthProps {
    children: React.ReactNode
}

export default function RequiresAuth({children}: RequiresAuthProps) {
    const { authenticated, status } = useAppSelector(state => state.auth);
    const navigate = useNavigate();

    const showLoader = !authenticated && status === 'pending';

    if (status === 'failed') {
        navigate('/login');
    }

    return (
        showLoader ? 
        <img src={loaderImage} alt='loading'/> :
        <>{children}</>
    );
}