import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import { Link } from "@inertiajs/react";

export default function SearchPage() {
    const [question, setQuestion] = useState("");
    const [summary, setSummary] = useState("");
    const [outro, setOutro] = useState("");
    const [title, setTitle] = useState("");
    const [response, setResponse] = useState([]);
    const [resultFound, setResultFound] = useState(false);
    const [showModal, setShowModal] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!question.trim()) return;

        setSummary("");
        setOutro("");
        setTitle("");
        setResponse([]);
        setShowModal(false);

        try {
            const csrfToken = document.head.querySelector(
                'meta[name="csrf-token"]'
            )?.content;
            const appUrl = import.meta.env.VITE_APP_URL;
            const url = `${appUrl}/chat`;
            console.log(url);

            // make request
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify({ question: question }),
            });
            const data = await res.json();

            // add response to chat
            if (res.ok) {
                setShowModal(true);
                setTitle(question)
                if (data.resultSize === 0) {
                    setResultFound(false);
                } else {
                    setResultFound(true);
                    setSummary(data.response.introduction);
                    Object.entries(data.response.results).forEach(([id, result]) => {
                        setResponse((prevResponse) => [...prevResponse, result]);
                    })
                    setOutro(data.response.outro);
                }
            } else {
                console.log(data.error)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setQuestion('');
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
                            placeholder="Tanya yang sopan ya"
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <button
                            type="submite"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            <IoMdSend />
                        </button>
                    </div>
                </form>
            </div>

            {/* Responses */}
            {showModal && resultFound && (
                <div className="flex flex-row w-full px-4 gap-4">
                    {/* summary */}
                    <div className="flex flex-col gap-4 w-[60rem] pr-8">
                        <h3 className="text-xl font-semibold capitalize">
                            {title}
                        </h3>
                        <h4 className="text-xl capitalize">summary</h4>
                        <p className="text-justify">{summary}</p>
                        <ul className="flex flex-col list-disc list-inside w-full gap-4 text-justify">
                            {response.map((message, index) => (
                                <div key={index}>
                                    <li>
                                        <span className="font-semibold capitalize">
                                            {message.title}
                                        </span>
                                        <p className="mt-4 pl-6">
                                            {message.summary} <span><a className="text-blue-600 hover:underline text-sm" href={message.link}>[{index+1}]</a></span>
                                        </p>
                                    </li>
                                </div>
                            ))}
                        </ul>
                        <p className="text-justify">{outro}</p>
                    </div>

                    {/* reference */}
                    <div className="flex flex-col gap-4 w-[32rem] bg-slate-200 p-8 h-fit">
                        <h4 className="text-xl capitalize">references</h4>
                        {response.map((message, index) => (
                            <div key={index} className="flex gap-1 flex-col">
                                <p className="text-sm capitalize">reference {index+1}</p>
                                <a
                                    href={message.link}
                                    className="capitalize font-serif hover:underline hover:underline-offset-2 decoration-transparent hover:decoration-blue-500 hover:decoration-2 duration-200"
                                >
                                    {message.article_title}
                                </a>
                                <p className="capitalize text-sm">{message.authors}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Continue Conversation */}
        </div>
    );
}
