import { Link } from "@inertiajs/react";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";



export default function BromoAi() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [menu, setMenu] = useState([
        {
            name: "Search All Content"

        },
        {
            name: "E-Journal"
        },
        {
            name: "Undip's Books"
        },
        {
            name: "Opac"
        },
        {
            name: "Repository"
        },
        {
            name: "Scopus"
        }
    ]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowModal(true);

        if (!message.trim()) return;

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

           
            if (res.ok) {
                setChat((prevChat) => [...prevChat, { role: 'bot', text: data.response }]);
            } else {
                setChat((prevChat) => [...prevChat, { role: 'bot', text: 'Something went wrong.' }]);
            }
        } catch (error) {
            setChat((prevChat) => [...prevChat, { role: 'bot', text: 'Error connecting to the server.' }]);
        } finally {
            setMessage('');
        }
    };

    

    return (
        <div className="flex w-full h-screen justify-center items-center flex-col bg-cover">
            <div className="relative mt-20  w-4/6 bg-slate-400 flex flex-col h-4/6 border border-slate-600 rounded-lg">
                <div className="w-full flex flex-row items-start justify-center h-1/5">
                    <div className={`border border-slate-600 w-full flex items-center justify-center h-[40px] rounded-t-lg` }>
                        {/* <h1 > Search All Content </h1> */}
                        {menu.map((item, index) => (
                        <a
                        key={index}
                        className={`w-full h-full flex items-center border border-slate-600 justify-center hover:text-blue-500 ${currentIndex === index ? 'text-orange-400 bg-white' : ''} ${index === 0 ? 'rounded-tl-lg' : ''} ${index === 5 ? 'rounded-tr-lg' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                        >
                            <h1>
                                {item.name}
                            </h1>
                        </a>
                    ))}
                    </div>
                    {/* <div className="border border-slate-600 w-full flex items-center justify-center h-[40px]">
                        <h1 > E-Journal </h1>
                    </div>
                    <div className="border border-slate-600 w-full flex items-center justify-center h-[40px]">
                        <h1 > Undip's Books </h1>
                    </div>
                    <div className="border border-slate-600 w-full flex items-center justify-center h-[40px]">
                        <h1 > Opac </h1>
                    </div>
                    <div className="border border-slate-600 w-full flex items-center justify-center h-[40px]">
                        <h1 > Repository </h1>
                    </div>
                    <div className="border border-slate-600 w-full flex items-center justify-center h-[40px] rounded-tr-lg">
                        <h1 > Search All Content </h1>
                    </div> */}
                  




                </div>
                {currentIndex === 0 && (
                     <div className="w-full h-full flex flex-col items-start justify-start px-8">
                     <h1 className="text-white font-semibold text-5xl">Bromo Ai</h1>
                     <h3 className="text-white">Halo para prompters kontol, lu kalo nanya tau diri ngentot</h3>
                    <form 
                    className="relative w-full flex flex-row items-center justify-end"
                    onSubmit={handleSubmit}
                    >

                        
                            <select
                            className='relative  top-1/2 transform -translate-y-1/2 w-2/12 h-full'
                            >
                                <option value="1" disabled>Keyword</option>
                                <option value="2">Title</option>
                                <option value="3">Author</option>
                            
                            </select>
                            <input
                                type="text"
                                className="w-8/12 h-10  border-2 border-white"
                                placeholder="Search"
                                onChange={(e) => setMessage(e.target.value)}
                                value={message}
                            />
                            <button
                                type='submit'

                                className='top-1/2 relative transform -translate-y-1/2 text-white bg-blue-900 h-full w-2/12'
                            >
                                Search
                            </button>
                        
                    </form>
                 </div>
                )}
                {currentIndex === 1 && (
                    <div className="w-full h-full flex flex-col items-start justify-start px-8">
                    <h1 className="text-white font-semibold text-5xl">E-Journal</h1>
                    <h3 className="text-white">Pencarian koleksi jurnal yang diterbitkan oleh Undip</h3>
                     <div className="relative w-full flex flex-row items-center justify-end">
                       <select
                       className='relative  top-1/2 transform -translate-y-1/2 w-2/12 h-full'
                       >
                           <option value="1" disabled>Keyword</option>
                           <option value="2">Title</option>
                           <option value="3">Author</option>
                       
                       </select>
                        <input
                            type="text"
                            className="w-8/12 h-10  border-2 border-white"
                            placeholder="Search"
                        />
                        <button
                            type='submit'
                            className='top-1/2 relative transform -translate-y-1/2 text-white bg-blue-900 h-full w-2/12'
                        >
                            Search
                        </button>
                    </div>
                </div>
                )}
                {currentIndex === 2 && (
                    <div className="w-full h-full flex flex-col items-start justify-start px-8">
                        <h1 className="text-white font-semibold text-5xl">Undip's Books</h1>
                        <h3 className="text-white">Pencarian koleksi buku yang diterbitkan oleh Undip</h3>
                        <div className="relative w-full flex flex-row items-center justify-end">
                           
                            <input
                                type="text"
                                className="w-10/12 h-10  border-2 border-white"
                                placeholder="Cari E-Books - UNDIP Press"
                            />
                            <button
                                type='submit'
                                className='top-1/2 relative transform -translate-y-1/2 text-white bg-blue-900 h-full w-2/12'
                            >
                                Search
                            </button>
                        </div>
                    </div>
                )}
                {currentIndex === 3 && (
                    <div className="w-full h-full flex flex-col items-start justify-start px-8">
                        <h1 className="text-white font-semibold text-5xl">Coming Soon</h1>
                        <h3 className="text-white">Pencarian koleksi buku yang diterbitkan oleh Undip</h3>
                        <div className="relative w-full flex flex-row items-center justify-end">
                           
                            <input
                                type="text"
                                className="w-10/12 h-10  border-2 border-white cursor-not-allowed"
                                placeholder="Cari koleksi UPT"
                                disabled
                            />
                            <button
                                type='submit'
                                disabled
                                className='cursor-not-allowed top-1/2 relative transform -translate-y-1/2 text-white bg-blue-900 h-full w-2/12'
                            >
                                Search
                            </button>
                        </div>
                    </div>
                )}
                    
                    
               

            </div>
            {showModal &&  (
                    <div className='flex flex-col items-center w-5/6 h-3/4 overflow-y-auto scrollbar-hidden bg-transparent rounded-lg '>
                    
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
        </div>
    )
}