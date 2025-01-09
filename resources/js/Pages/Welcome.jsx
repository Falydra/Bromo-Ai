import React, { useState } from 'react';
import { IoMdSend } from "react-icons/io";

export default function LandingPage() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });
        const data = await res.json();
        setResponse(data.response);
    };

    return (
        <div className='flex w-full h-screen justify-center items-center flex-row bg-slate-800'>
            <div className='flex flex-col w-2/12 h-full justify-center items-center border-r rounded-3xl border-white'>
            </div>
            <div className='flex flex-col w-10/12 h-full justify-center items-center'>
                <h1 className='text-white font-semibold text-5xl'>Bromo Ai</h1>
                <h3 className='text-white '>Halo para pormpters kontol, lu kalo nanya tau diri ngentot</h3>
                <form onSubmit={handleSubmit} className='flex flex-col items-center w-5/6'>
                    <div className='relative w-3/6 mt-12'>
                        <input
                            className='w-full rounded-lg  pr-4 py-2'
                            placeholder='Nanya yang sopan ya 😊'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type='submit' className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500'>
                            <IoMdSend />
                        </button>
                    </div>
                </form>
                {response && (
                    <div className='mt-4 p-4 bg-gray-700 text-white rounded-lg'>
                        {response}
                    </div>
                )}
            </div>
        </div>
    );
}