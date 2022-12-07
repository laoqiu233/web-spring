import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from './app/hooks';
import { refreshUserCredentials } from './features/auth/authSlice';
import loaderSvg from './images/loader.svg'

function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Try to authorize user
    useEffect(() => {
        dispatch(refreshUserCredentials)
            .then((res) => {
                navigate((res.success ? '/home' : '/login'));
            })
    }, []);

    return (
        <div className='w-full pt-3 min-h-screen stripes-background'>
            <header className='mb-7 mx-auto bg-gray-100 w-[90%] px-5 py-3 rounded-xl shadow-lg'>
                <h1 className='text-2xl font-extrabold '>WEBLAB #4</h1>
                <h2 className='text-xl'>DMITRI <span className='text-violet-500'>TSIU</span> | P32312</h2>
            </header>
            {location.pathname === '/' && <img src={loaderSvg} alt='Loading...'/>}
            <Outlet/>
        </div>
    );
}

export default App;
