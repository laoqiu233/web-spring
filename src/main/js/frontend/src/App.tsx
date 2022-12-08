import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import ToastsList from './components/ToastsList';
import UserInfo from './components/UserInfo';
import { logout, refreshUserCredentials } from './features/auth/authSlice';
import { toastAdded, toastRemoved } from './features/toasts/toastsSlice';
import loaderSvg from './images/loader.svg'

function App() {
    const toasts = useAppSelector(state => state.toasts.toasts);
    const { authenticated, userInfo: { username } } = useAppSelector(state => state.auth);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Try to authorize user
    useEffect(() => {
        dispatch(refreshUserCredentials())
        .unwrap()
        .then((res) => navigate('/home'))
        .catch((err) => navigate('/login'));
    }, []);

    function logoutOnClick() {
        dispatch(logout());
        localStorage.removeItem('refreshToken');
        navigate('/login');
    }

    return (
        <div className='w-full pt-3 min-h-screen stripes-background'>
            <header className='mb-7 mx-auto bg-gray-100 w-[90%] px-5 py-3 rounded-xl shadow-lg flex flex-row flex-nowrap items-center justify-between'>
                <div>
                    <h1 className='text-xl font-extrabold md:text-2xl'>WEBLAB #4</h1>
                    <h2 className='text-sm md:text-xl'>DMITRI <span className='text-violet-500'>TSIU</span> | P32312</h2>
                </div>
                { authenticated && 
                <div className='flex flex-row flex-nowrap items-center gap-3'>
                    <div className='hidden md:block'>
                        <UserInfo username={username} />
                    </div>
                    <i className="bi bi-box-arrow-right hover:text-violet-500 hover:cursor-pointer text-xl" onClick={logoutOnClick}></i>
                </div>
                }
            </header>
            {location.pathname === '/' && <img src={loaderSvg} alt='Loading...'/>}
            <Outlet/>
            <ToastsList toasts={toasts} onToastClose={(id) => dispatch(toastRemoved(id))}/>
        </div>
    );
}

export default App;
