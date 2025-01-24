import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import { Link } from "@inertiajs/react";

export default function ChatPage() {
    const [question, setQuestion] = useState("");
    const [showModal, setShowModal] = useState(true);
    const [showLoading, setShowLoading] = useState(false);

    const [responses, setResponses] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!question.trim()) return;

        setShowLoading(true);

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
                // setShowModal(true);
                setShowLoading(false);

                setResponses([
                    {
                        title: question,
                        introduction: data.response.introduction,
                        outro: data.response.outro,
                        answers: Object.values(data.response.results),
                        timestamp: new Date().getTime(),
                    },
                ]);
            } else {
                console.log(data.error);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setQuestion("");
        }
    };

    console.log(responses);

    const handleSubSearch = async (e) => {
        e.preventDefault();

        const textValue = e.target.textContent;

        setShowLoading(true);

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
                body: JSON.stringify({ question: textValue }),
            });
            const data = await res.json();

            // add response to chat
            if (res.ok) {
                setShowModal(true);
                setShowLoading(false);

                setResponses([
                    ...responses,
                    {
                        title: textValue,
                        introduction: data.response.introduction,
                        outro: data.response.outro,
                        answers: Object.values(data.response.results),
                        timestamp: new Date().getTime(),
                    },
                ]);
            } else {
                console.log(data.error);
            }
        } catch (error) {
            console.log(error);
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
                            value={question}
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
            {showModal &&
                responses.map((e, index) => (
                    <div key={e.timestamp} className="flex flex-row w-full px-4 gap-4 border-b border-gray-600">
                        {/* summary */}
                        <div
                            className="flex flex-col gap-4 w-[60rem] pr-8 pb-4"
                        >
                            <h3 className="text-xl font-semibold capitalize">
                                {e.title}
                            </h3>
                            <h4 className="text-xl capitalize">summary</h4>
                            <p className="text-justify">{e.introduction}</p>
                            <ul className="flex flex-col list-disc list-inside w-full gap-4 text-justify">
                                {e.answers.map((answer, index) => (
                                    <div key={index}>
                                        <li>
                                            <span
                                                className="font-semibold capitalize hover:cursor-pointer hover:underline hover:underline-offset-2 decoration-transparent hover:decoration-blue-500 hover:decoration-2 duration-200"
                                                onClick={(e) =>
                                                    handleSubSearch(e)
                                                }
                                            >
                                                {answer.title}
                                            </span>
                                            <p className="mt-4 pl-6">
                                                {answer.summary}{" "}
                                                <span>
                                                    <a
                                                        className="text-blue-600 hover:underline text-sm"
                                                        target="_blank"
                                                        href={answer.link}
                                                    >
                                                        [{index + 1}]
                                                    </a>
                                                </span>
                                            </p>
                                        </li>
                                    </div>
                                ))}
                            </ul>

                            <p className="text-justify">{e.outro}</p>
                        </div>

                        {/* reference */}
                        <div className="flex flex-col gap-4 w-[32rem] bg-slate-200 p-8 h-fit">
                            <h4 className="text-xl capitalize">references</h4>
                            {e.answers.map((answer, index) => (
                                <div
                                    key={index}
                                    className="flex gap-1 flex-col"
                                >
                                    <p className="text-sm capitalize">
                                        reference {index + 1}
                                    </p>
                                    <a
                                        target="_blank"
                                        href={answer.link}
                                        className="capitalize font-serif hover:underline hover:underline-offset-2 decoration-transparent hover:decoration-blue-500 hover:decoration-2 duration-200"
                                    >
                                        {answer.article_title}
                                    </a>
                                    <p className="capitalize text-sm">
                                        {answer.authors}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

            {showLoading && (
                <div className="relative w-full justify-start px-4">
                    <div className="absolute -top-4 text-3xl font-extrabold">
                        <div className="flex flex-row gap-1">
                            {/* Processing your query */}
                            <div className="motion-safe:animate-bounce"> .</div>
                            <div className="motion-safe:animate-bounce" style={{animationDelay: "140ms"}}> .</div>
                            <div className="motion-safe:animate-bounce" style={{animationDelay: "280ms"}}> .</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Continue Conversation */}
        </div>
    );
}
