import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { Button } from '../components/Button';
import PointForm from '../components/PointForm';
import PointsCanvas from '../components/PointsCanvas';
import PointsTable from '../components/PointsTable';
import { logout } from '../features/auth/authSlice';
import { loadPointsFromApi } from '../features/points/pointsSlice';
import { getCanvasBitmap } from '../utils/ApiClient';

export default function HomePage() {
    const token = useAppSelector(state => state.auth.userInfo.accessToken);
    const points = useAppSelector(state => state.points.points);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [bitmap, setBitmap] = useState('');

    useEffect(() => {
        getCanvasBitmap(token)
        .then((result) => {
            if (result.success) {
                setBitmap(result.payload);
            } else {
                // Show error message
            }
        })
    }, [token]);

    useEffect(() => {
        dispatch(loadPointsFromApi)
        .then((result) => {
            if (!result.success) {
                console.log(result.message);
            }
        })
    }, [token]);

    function onClick() {
        dispatch(logout());
        localStorage.removeItem('refreshToken');
        navigate('/login')
    }

    return (
        <div>
            <div className='bg-gray-100 w-fit p-3 rounded-xl mx-auto mb-5 shadow-xl'>
                <PointsCanvas bitmapRaw={bitmap} r={1}/>
            </div>
            <PointForm/>
            <PointsTable points={points}/>
            <Button onClick={onClick}>Logout</Button>
        </div>
    )
}