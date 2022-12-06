import React from 'react';
import { Outlet } from 'react-router-dom';

function App() {
    return (
        <div className='flex w-full min-h-screen justify-center items-center stripes-background'>
            <header className='absolute top-3 bg-gray-100 w-[90%] px-5 py-3 rounded-xl shadow-lg'>
                <h1 className='text-2xl font-extrabold '>WEBLAB #4</h1>
                <h2 className='text-xl'>DMITRI <span className='text-violet-500'>TSIU</span> | P32312</h2>
            </header>
            <Outlet/>
        </div>
    );
}

export default App;
