import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import ToastsList from './components/ToastsList';
import { refreshUserCredentials } from './features/auth/authSlice';
import { toastAdded, toastRemoved } from './features/toasts/toastsSlice';
import loaderSvg from './images/loader.svg'

function App() {
    const toasts = useAppSelector(state => state.toasts.toasts);
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

    return (
        <div className='w-full pt-3 min-h-screen stripes-background'>
            <header className='mb-7 mx-auto bg-gray-100 w-[90%] px-5 py-3 rounded-xl shadow-lg'>
                <h1 className='text-2xl font-extrabold '>WEBLAB #4</h1>
                <h2 className='text-xl'>DMITRI <span className='text-violet-500'>TSIU</span> | P32312</h2>
                <button onClick={() => dispatch(toastAdded({id:0, type:'warning', message:'This is a warning'}))}>Warning toast</button>
                <button onClick={() => dispatch(toastAdded({id:0, type:'info', message:'This is an info'}))}>Info toast</button>
                <button onClick={() => dispatch(toastAdded({id:0, type:'success', message:'This is a success'}))}>Success toast</button>
            </header>
            {location.pathname === '/' && <img src={loaderSvg} alt='Loading...'/>}
            <Outlet/>
            <ToastsList toasts={toasts} onToastClose={(id) => dispatch(toastRemoved(id))}/>
        </div>
    );
}

export default App;
