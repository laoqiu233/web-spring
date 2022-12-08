import { PointAttempt } from "../utils/ApiClient"
import loaderImage from '../images/loader.svg';

interface PointsTableProps {
    points: PointAttempt[],
    showLoader: boolean,
    totalPointsCount: number
};

export default function PointsTable({points, showLoader, totalPointsCount}: PointsTableProps) {
    return (
        <>
            <div className='flex flex-row flex-nowrap items-end justify-between'>
                <h1 className='font-extrabold text-xl'>Attempts</h1>
                <h1 className='text-md'>Showing {points.length} of {totalPointsCount}</h1>
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
                                    <td>{v.user}</td>
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