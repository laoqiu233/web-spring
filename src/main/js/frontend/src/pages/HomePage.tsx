import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { Button } from '../components/Button';
import PointForm from '../components/PointForm';
import PointsCanvas from '../components/PointsCanvas';
import PointsTable from '../components/PointsTable';
import { logout } from '../features/auth/authSlice';
import { loadPointsFromApi } from '../features/points/pointsSlice';
import { CompoundPointRequest, getCanvasBitmap, sendPoints } from '../utils/ApiClient';

export default function HomePage() {
    const { authenticated, userInfo: {accessToken} } = useAppSelector(state => state.auth);
    const { points, status } = useAppSelector(state => state.points);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [bitmap, setBitmap] = useState('');
    const [disableForm, setDisableForm] = useState(false);

    useEffect(() => {
        getCanvasBitmap(accessToken)
        .then((result) => {
            if (result.success) {
                setBitmap(result.payload);
            } else {
                // Show error message
            }
        })
    }, [accessToken]);

    // Get points
    useEffect(() => {
        dispatch(loadPointsFromApi(false))
        .unwrap()
        .then((points) => {
            console.log(`Loaded ${points.length} points`);
        }) 
        .catch((err) => {
            console.log(err);
        });
    }, [authenticated, dispatch]);

    function onClick() {
        dispatch(logout());
        localStorage.removeItem('refreshToken');
        navigate('/login')
    }

    function submitPoints(request: CompoundPointRequest) {
        console.log(request);
        setDisableForm(true);
        sendPoints(request, accessToken)
        .then((result) => {
            if (result.success) {
                dispatch(loadPointsFromApi(false))
                .unwrap()
                .then((points) => {
                    console.log(`Loaded ${points.length} points`);
                }) 
                .catch((err) => {
                    console.log(err);
                });
            } else {
                console.log(result.message);
            }
            setDisableForm(false);
        })
    }

    return (
        <div>
            <div className='bg-gray-100 w-fit p-3 rounded-xl mx-auto mb-5 shadow-xl'>
                <PointsCanvas bitmapRaw={bitmap} r={1}/>
            </div>
            <PointForm showLoader={disableForm} onSubmit={submitPoints}/>
            <PointsTable points={points} showLoader={status === 'pending'}/>
            <Button onClick={onClick}>Logout</Button>
        </div>
    )
}