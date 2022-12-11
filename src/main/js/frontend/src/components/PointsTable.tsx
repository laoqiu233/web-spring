import { PointAttempt } from "../utils/ApiClient"
import loaderImage from '../images/loader.svg';
import UserInfo from "./UserInfo";

interface PointsTableProps {
    points: PointAttempt[],
    showLoader: boolean,
    totalPointsCount: number,
    onlyOwned: boolean,
    setOnlyOwned(onlyOwned: boolean):void
};

export default function PointsTable({points, showLoader, totalPointsCount, onlyOwned, setOnlyOwned}: PointsTableProps) {
    return (
        <>
            <div className='flex flex-row flex-nowrap items-baseline justify-between'>
                <div className='mb-1'>
                    <h1 className='font-extrabold text-xl'>Attempts</h1>
                    <div className="flex flex-row flex-nowrap items-center justify-start gap-2 text-xs">
                        <input type='checkbox' id='only-owned' checked={onlyOwned} onChange={(e) => setOnlyOwned(e.target.checked)}/>
                        <label htmlFor="only-owned">Show owned</label>
                    </div>
                </div>
                <h1 className='text-xs'>Showing {points.length} of {totalPointsCount}</h1>
            </div>
            <div className='overflow-x-scroll rounded-xl'>
                <table className='w-full text-center text-xs md:text-base'>
                    <thead>
                        <tr className='bg-violet-500 text-white'>
                            <th className='p-3'>Attempt #</th>
                            <th className='p-3'>X</th>
                            <th className='p-3'>Y</th>
                            <th className='p-3'>R</th>
                            <th className='p-3'>Attempt time</th>
                            <th className='p-3'>Process time</th>
                            <th className='p-3'>Result</th>
                            <th className='p-3'>User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            !showLoader && points.map((v) => (
                                <tr className='odd:bg-violet-100' key={v.id}>
                                    <td>{v.id}</td>
                                    <td>{v.x}</td>
                                    <td>{v.y}</td>
                                    <td>{v.r}</td>
                                    <td>{new Date(v.attemptTime).toLocaleString()}</td>
                                    <td>{v.processTime} ms</td>
                                    <td>{v.success ? <span className="text-violet-500">HIT</span> : <span className="text-red-500">MISS</span>}</td>
                                    <td><UserInfo username={v.username} userId={v.userId}/></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {showLoader && <img src={loaderImage} className='fill-violet-500 mx-auto mt-3 p-2 w-10 h-10 bg-violet-500 rounded-xl' alt='Loading'/>}
        </>
    )
}