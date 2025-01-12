import { Link } from "@inertiajs/react";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";



export default function BromoAi() {
    const [currentIndex, setCurrentIndex] = useState(0);
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

    return (
        <div className="flex w-full h-screen justify-center items-center flex-col bg-cover">
            <div className="w-4/6 bg-slate-400 flex flex-col h-3/6 border border-slate-600 rounded-lg">
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
        </div>
    )
}