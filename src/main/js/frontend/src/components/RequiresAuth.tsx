import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { ReactComponent as Loader } from '../images/loader.svg';

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
        <Loader/> :
        <>{children}</>
    );
}