import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { Button } from '../components/Button';
import PointForm from '../components/PointForm';
import PointsCanvas from '../components/PointsCanvas';
import PointsTable from '../components/PointsTable';
import { logout } from '../features/auth/authSlice';
import { loadPointsFromApi } from '../features/points/pointsSlice';
import { successToast, toastAdded, warningToast } from '../features/toasts/toastsSlice';
import { CompoundPointRequest, getCanvasBitmap, sendPoints } from '../utils/ApiClient';

export default function HomePage() {
    const { authenticated, userInfo: {accessToken} } = useAppSelector(state => state.auth);
    const { points, status } = useAppSelector(state => state.points);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [bitmap, setBitmap] = useState('');
    const [disableForm, setDisableForm] = useState(false);
    const [globalR, setGlobalR] = useState(0);

    function loadNewPoints(showOwned: boolean) {
        dispatch(loadPointsFromApi(false))
        .unwrap()
        .then((points) => {
            console.log(`Loaded ${points.length} points`);
        }) 
        .catch((err) => {
            dispatch(warningToast(`Failed to load new points: ${err}`));
        })
    }

    useEffect(() => {
        if (authenticated) {
            getCanvasBitmap(accessToken)
            .then((result) => {
                if (result.success) {
                    setBitmap(result.payload);
                } else {
                    dispatch(warningToast(`Failed to load area image: ${result.message}`));
                }
            })
        }
    }, [authenticated, accessToken]);

    // Get points
    useEffect(() => {
        if (authenticated) {
            loadNewPoints(false);
        }
    }, [authenticated]);

    function onClick() {
        dispatch(logout());
        localStorage.removeItem('refreshToken');
        navigate('/login')
    }

    function submitPoints(request: CompoundPointRequest) {
        setDisableForm(true);
        sendPoints(request, accessToken)
        .then((result) => {
            if (result.success) {
                const pointsCount = result.payload.length;
                const pointsHit = result.payload.filter((v) => v.success).length;
                dispatch(successToast(`Sent ${pointsCount} points, ${pointsHit} hits, ${pointsCount - pointsHit} misses.`));
                loadNewPoints(false);
            } else {
                dispatch(warningToast(`Submission failed: ${result.message}`));
            }
            setDisableForm(false);
        });
    }

    return (
        <div>
            <div className='bg-gray-100 w-fit p-3 rounded-xl mx-auto mb-5 shadow-xl'>
                <PointsCanvas bitmapRaw={bitmap} points={points} r={globalR} onClick={(x,y) => submitPoints({x:[x], y:[y], r:[globalR]})}/>
            </div>
            <PointForm showLoader={disableForm} onSubmit={submitPoints} setGlobalR={setGlobalR}/>
            <PointsTable points={points} showLoader={status === 'pending'}/>
            <Button onClick={onClick}>Logout</Button>
        </div>
    )
}