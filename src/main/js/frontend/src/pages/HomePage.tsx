import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Paginator from '../components/Paginator';
import PointForm from '../components/PointForm';
import PointsCanvas from '../components/PointsCanvas';
import PointsTable from '../components/PointsTable';
import { loadPointsFromApi } from '../features/points/pointsSlice';
import { successToast, warningToast } from '../features/toasts/toastsSlice';
import { CompoundPointRequest, getCanvasBitmap, sendPoints } from '../utils/ApiClient';

export default function HomePage() {
    const { authenticated, userInfo: {accessToken} } = useAppSelector(state => state.auth);
    const { points, totalPointsCount, status, currentPage, totalPages } = useAppSelector(state => state.points);
    const dispatch = useAppDispatch();
    const [bitmap, setBitmap] = useState('');
    const [disableForm, setDisableForm] = useState(false);
    const [globalR, setGlobalR] = useState(0);
    const [onlyOwned, setOnlyOwned] = useState(false);

    function loadNewPoints(page: number, showOwned: boolean) {
        dispatch(loadPointsFromApi({page, onlyOwned: showOwned}))
        .unwrap()
        .then((resp) => {
            console.log(`Loaded ${resp.points.length} points`);
            if (resp.pageNum >= resp.pageCount && resp.pageNum !== 0) {
                loadNewPoints(0, showOwned);
            }
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
            loadNewPoints(currentPage, onlyOwned);
        }
    }, [authenticated, onlyOwned]);

    function submitPoints(request: CompoundPointRequest) {
        setDisableForm(true);
        sendPoints(request, accessToken)
        .then((result) => {
            if (result.success) {
                const pointsCount = result.payload.length;
                const pointsHit = result.payload.filter((v) => v.success).length;
                dispatch(successToast(`Sent ${pointsCount} points, ${pointsHit} hits, ${pointsCount - pointsHit} misses.`));
                loadNewPoints(currentPage, onlyOwned);
            } else {
                dispatch(warningToast(`Submission failed: ${result.message}`));
            }
            setDisableForm(false);
        });
    }

    return (
        <div>
            <div className='bg-gray-100 w-fit p-3 rounded-xl mx-auto mb-5 shadow-xl'>
                <PointsCanvas bitmapRaw={bitmap} points={points} r={globalR} disabled={disableForm || status === 'pending'} onClick={(x,y) => submitPoints({x:[x], y:[y], r:[globalR]})}/>
            </div>
            <PointForm showLoader={disableForm || status === 'pending'} onSubmit={submitPoints} setGlobalR={setGlobalR}/>
            <div className="bg-gray-100 w-[90%] px-5 py-3 mx-auto mb-5 rounded-xl shadow-xl lg:px-10">
                <PointsTable points={points} totalPointsCount={totalPointsCount} onlyOwned={onlyOwned} setOnlyOwned={setOnlyOwned} showLoader={status === 'pending'}/>
                <Paginator currentPage={currentPage} totalPageCount={totalPages} selectPage={(page) => loadNewPoints(page, onlyOwned)}/>
            </div>
        </div>
    )
}