import { FaSearch } from "react-icons/fa";
import { useState } from "react";

export default function Navbar() {
    const [showSearch, setShowSearch] = useState(false);

    return (
        <div className="flex top-0 left-0 absolute flex-row w-full h-16 bg-slate-800 justify-between items-center px-8">
            <div className="flex flex-row items-center justify-start">
                <h1 className="text-white font-semibold text-2xl">Bromo Ai</h1>
            </div>
            <div className="flex flex-row items-center justify-end">
                <FaSearch className="text-white" onClick={setShowSearch} />
            </div>
            {/* {showSearch && (
                <div className="flex flex-row items-center justify-end">
                    <input
                        type="text"
                        className="w-64 h-10 rounded-lg border-2 border-white"
                        placeholder="Search"
                    />
                </div>
            )
            } */}
        </div>
    )
}