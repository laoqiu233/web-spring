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
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        if (status !== 'pending') {
            setShowLoading(false);
        }

        if (authenticated && status === 'failed') {
            navigate('/login');
        } else if (!authenticated && status === 'pending') {
            setShowLoading(true);
        }
    }, [authenticated, status, navigate]);

    return (
        showLoading ? 
        <img className='absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2' src={loaderImage} alt='loading'/> :
        <>{children}</>
    );
}