import React, { InputHTMLAttributes } from 'react';

export default function TextInput(props:InputHTMLAttributes<HTMLInputElement>) {
    return <input 
                type="text" 
                className='transition leading-tight w-full border border-gray-300 rounded-lg px-3 py-2 mb-5 text-black focus:outline-none focus:ring-2 focus:ring-gray-300'
                {...props}
            />
}