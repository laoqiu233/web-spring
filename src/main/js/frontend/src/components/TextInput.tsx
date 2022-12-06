import React, { InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    warningText?: string
}

export default function TextInput(props:TextInputProps) {
    let propsForInput = {...props};
    delete propsForInput['warningText'];
    delete propsForInput['children'];

    return (
        <div className='mb-3'>
            <div className='relative'>
                <input 
                    type="text" 
                    className='transition leading-tight w-full border border-gray-300 rounded-lg px-3 py-2 mb-1 text-black focus:outline-none focus:ring-2 focus:ring-gray-300'
                    {...propsForInput}
                />
                {props.children}
            </div>
            {props.warningText !== undefined && <p className='text-red-500 text-xs'>{props.warningText}</p>}
        </div>
    )
}