import { PointAttempt } from "../utils/ApiClient"

interface PointsTableProps {
    points: PointAttempt[]
};

export default function PointsTable({points}: PointsTableProps) {
    return (
        <div className="bg-gray-100 w-[90%] px-5 py-3 mx-auto mb-5 rounded-xl shadow-xl lg:px-10">
            <h1 className='font-extrabold text-xl'>Attempts</h1>
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
                            points.map((v) => (
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
        </div>
    )
}