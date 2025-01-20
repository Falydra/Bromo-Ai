import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import { Link } from "@inertiajs/react";

export default function SearchPage() {
    const [message, setMessage] = useState("");
    const [result, setResult] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        try {
            const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.content;
            const appUrl = import.meta.env.VITE_APP_URL;
            const url = `${appUrl}/articles/search`;
            console.log(url)
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ query: message, page: 1 }),
            });

            const data = await res.json();

            if (res.ok) {
                console.log(data)
                setResult([]);
                setShowModal(true);
                Object.entries(data).forEach(([id, result]) => {
                    setResult((prevResult) => [...prevResult, {query: result}]);
                })
            } else {
                setResult((prevResult) => [...prevResult, {query: data.error}]);
            }
        } catch (error) {
            console.log(error)
            setResult((prevResult) => [...prevResult, {query: "Internal Server Error 500"}]);
        } finally {
            setMessage('');
        }
    };

    return (
        <div className="w-full flex flex-col bg-slate-100 gap-8 py-8 2xl:px-96 xl:px-64 lg:px-32 px-4 min-h-screen">
            <div className="flex flex-col gap-2 w-full justify-start px-4">
                <h1 className="font-semibold text-2xl">Undip Reference AI</h1>
                <p className="text-lg">
                    Selamat datang pejuang makalah, artikel, skripsi, disertasi,
                    dan lainnya. Have fun 🤗🤗
                </p>
                <form onSubmit={handleSubmit} className="flex flex-row w-full">
                    <div className="relative w-3/5">
                        <input
                            type="text"
                            className="w-full"
                            placeholder="Cari Artikel"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            <IoMdSend />
                        </button>
                    </div>
                </form>
            </div>
            <div className="flex flex-row w-full px-4 gap-4">
                {/* reference */}
                {showModal && (
                    <div className="flex flex-col gap-4 w-full bg-slate-200 p-8 h-fit">
                        <h4 className="text-xl capitalize">Results</h4>
                        {result.map((query, index) => (
                            <div key={index} className="flex gap-1 flex-col">
                                <a href={`https://doi.org/${query.query.doi}`} target="_blank" className="text-sm hover:underline hover:underline-offset-2 decoration-transparent hover:decoration-blue-500 hover:decoration-2 transition-color duration-300">https://doi.org/{query.query.doi}</a>
                                <a
                                    href={query.query.links} target="_blank"
                                    className="capitalize font-serif hover:underline hover:underline-offset-2 decoration-transparent hover:decoration-blue-500 hover:decoration-2 transition-color duration-300"
                                >
                                    {query.query.title}
                                </a>
                                <p>
                                    {query.query.authors.map((author, idx) => (
                                        <span key={idx}>{author},</span>
                                    ))}
                                    , <span>{query.query.year}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
