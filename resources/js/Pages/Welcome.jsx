import React, { useState } from 'react';
import { IoMdSend } from "react-icons/io";
import { Link } from '@inertiajs/react';

export default function LandingPage() {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowModal(true);

        if (!message.trim()) return;

        // Add user message to chat
        setChat((prevChat) => [...prevChat, { role: 'user', text: message }]);

        try {
            const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.content;
            const appUrl = import.meta.env.VITE_APP_URL;
            const url = `${appUrl}/chat`;
            console.log(url);
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ question: message }),
            });
            const data = await res.json();

            // Add bot response to chat
            if (res.ok) {
                setChat((prevChat) => [...prevChat, { role: 'bot', text: data.response }]);
            } else {
                setChat((prevChat) => [...prevChat, { role: 'bot', text: 'Something went wrong' }]);
            }
        } catch (error) {
            setChat((prevChat) => [...prevChat, { role: 'bot', text: 'Error connecting to the server.' }]);
        } finally {
            setMessage('');
        }
    };

    return (
        <div className='flex w-full h-screen justify-center items-center flex-row bg-slate-800'>
            <div className='flex flex-col w-2/12 h-full justify-center items-center border-r rounded-3xl border-white'>
                <div className='flex flex-col w-full h-full items-center justify-start py-8'>
                    <h1 className='text-white font-semibold text-2xl'>Reference AI</h1>
                    <div className='flex flex-row w-full items-start justify-start px-8 py-12'>

                        <h3 className='text-white'>History</h3>
                    </div>
                </div>
                <div className='flex flex-col w-full h-full items-center justify-end text-white py-8'>
                    <Link href={route("login")} className='w-9/12 h-12 items-center justify-center flex'>
                        <button className='w-8/12 h-12 bg-blue-500 rounded-lg' >

                            <h1>
                                Login
                            </h1>
                        </button>

                    </Link>
                </div>
            </div>
            <div className='flex flex-col w-10/12 h-full justify-center items-center'>
                <h1 className='text-white font-semibold text-5xl'>Reference AI</h1>
                <h3 className='text-white'>Selamat datang para prompters. Harap bertanya dengan sopan dan santun.</h3>
                {showModal &&  (
                    <div className='flex flex-col items-center w-5/6 h-3/4 overflow-y-auto bg-transparent rounded-lg p-4 mt-4'>
                    {/* Chat messages */}
                    {chat.map((msg, index) => (
                        <div
                            key={index}
                            className={`w-full mb-4 flex ${
                                msg.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            <div
                                className={`p-3 rounded-lg ${
                                    msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                                } max-w-xs`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
                )}

                <form onSubmit={handleSubmit} className='flex flex-col items-center w-5/6 mt-4'>
                    <div className='relative w-3/6'>
                        <input
                            className='w-full rounded-lg pr-4 py-2'
                            placeholder='Nanya yang sopan ya 😊'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            type='submit'
                            className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500'
                        >
                            <IoMdSend />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
