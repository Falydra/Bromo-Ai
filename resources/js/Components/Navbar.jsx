import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";

export default function Navbar() {
    const [showSearch, setShowSearch] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [menu, setMenu] = useState([
        {
            name: 'HOME',
            url: '/'
        },
        {
            name: 'PROFILE',
            url: '/profile'
        },
        {
            name: 'LAYANAN',
            url: '/layanan'
        },
        {
            name: 'FASILITAS',
            url: '/fasilitas'
        },
        {
            name: 'E-RESOURCES',
            url: '/e-resources'
        },
        {
            name: 'LINKS',
            url: '/links'
        },
        {
            name: 'DOWNLOAD',
            url: '/download'
        },
        {
            name: 'UNDIP PRESS',
            url: '/undip-press'
        }
    ]);

    return (
        <div className="flex top-0 left-0 absolute flex-row w-full h-16 bg-slate-800 justify-between items-center px-8 z-20">
            <div className="flex flex-row items-center justify-start">
                <h1 className="text-white font-semibold text-2xl">Bromo Ai</h1>
            </div>
            {!showSearch && (
                  <div className="flex flex-row items-center justify-end gap-8 text-white font-semibold">
                    {menu.map((item, index) => (
                        <a
                            key={index}
                            href={item.url}
                            className={`hover:text-slate-500 ${currentIndex === index ? 'text-orange-400' : ''}`}
                        >
                            {item.name}
                        </a>
                    ))}
  
                  <FaSearch className="text-white" onClick={() => setShowSearch(true)} />
              </div>
            )}
          
            {showSearch && (
                <div className="relative w-4/6 flex flex-row items-center justify-end">
                    <input
                        type="text"
                        className="w-full h-10 rounded-lg border-2 border-white"
                        placeholder="Search"
                    />
                    <button
                        type='submit'
                        className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500'
                    >
                        <RxCross2 className="w-6 h-6" onClick={() => setShowSearch(false)} />
                    </button>

                </div>
            )
            }
        </div>
    )
}