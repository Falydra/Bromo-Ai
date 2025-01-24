import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";

export default function DownloadPage() {
    const [formModal, setFormModal] = useState(true);
    const [responseModal, setResponseModal] = useState(false);
    const [response, setResponse] = useState("");

    const [queryInfo, setQueryInfo] = useState({
        pageSize: "",
        pageAmount: "",
        pageStart: "",
    });

    const [query, setQuery] = useState([
        {
            query: "",
            timestamp: new Date().getTime(),
        },
    ]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ((!queryInfo.pageSize) && (!queryInfo.pageAmount) && (!queryInfo.pageStart)) return;

        try {
            const csrfToken = document.head.querySelector(
                'meta[name="csrf-token"]'
            )?.content;
            const appUrl = import.meta.env.VITE_APP_URL;
            const url = `${appUrl}/test/download`;
            console.log(`Sending request to ${url}`)

            // make request
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify({
                    settings: queryInfo,
                    queries: query,
                }),
            });
            const data = await res.json();

            console.log(data)

            // add response
            if (res.ok) {
                setFormModal(false);
                setResponseModal(true);

                setResponse(data.message);
            } else {
                setResponse(data.error);
            }
        } catch (error) {
            setResponse("Internal Server Error 500");
            console.log(error);
        } finally {

        }
    };

    // console.log(queryInfo);
    // console.log(query);

    const handleInput = async (e) => {
        const { name, value } = e.target;
        setQueryInfo({
            ...queryInfo,
            [name]: value,
        });
    };

    const handleQuery = (e, index) => {
        const { name, value } = e.target;

        let newQuery = [...query];
        newQuery[index][name] = value;
        setQuery(newQuery);
    };

    const handleAddQuery = async (e) => {
        setQuery([
            ...query,
            {
                query: "",
                timestamp: new Date().getTime(),
            },
        ]);
    };

    const handleDeleteQuery = (i) => {
        let deleteQuery = [...query];
        deleteQuery.splice(i, 1);
        setQuery(deleteQuery);
    };

    return (
        <div className="w-full flex flex-col bg-slate-100 gap-8 py-8 2xl:px-96 xl:px-64 lg:px-32 px-4 min-h-screen">
            <div className="flex flex-col gap-2 w-full justify-start px-4 h-screen">
                <h1 className="font-semibold text-2xl">Download Article</h1>
                <p className="text-lg">
                    Tempat untuk menyimpan artikel ke database. Have fun 🤗🤗
                </p>

                {formModal && (
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col py-6 gap-6"
                    >
                        <fieldset className="flex flex-row gap-4 text-sm">
                            <div className="flex flex-col capitalize relative">
                                <label
                                    htmlFor="pageSize"
                                    className="absolute bg-slate-100 -top-3 px-1 left-2"
                                >
                                    article per page
                                </label>
                                <input
                                    onChange={handleInput}
                                    type="number"
                                    name="pageSize"
                                    id="pageSize"
                                    className="bg-slate-100 p-2"
                                    max={20}
                                />
                            </div>
                            <div className="flex flex-col capitalize relative">
                                <label
                                    htmlFor="pageAmount"
                                    className="absolute bg-slate-100 -top-3 px-1 left-2"
                                >
                                    page amount
                                </label>
                                <input
                                    onChange={handleInput}
                                    type="number"
                                    name="pageAmount"
                                    id="pageAmount"
                                    className="bg-slate-100 p-2"
                                />
                            </div>
                            <div className="flex flex-col capitalize relative">
                                <label
                                    htmlFor="pageStart"
                                    className="absolute bg-slate-100 -top-3 px-1 left-2"
                                >
                                    page start
                                </label>
                                <input
                                    onChange={handleInput}
                                    type="number"
                                    name="pageStart"
                                    id="pageStart"
                                    className="bg-slate-100 p-2"
                                />
                            </div>
                        </fieldset>

                        <fieldset className="flex flex-col gap-6 text-sm">
                            {query.map((e, index) => (
                                <div
                                    key={e.timestamp}
                                    className="flex flex-row relative capitalize max-w-[13.5rem] gap-4"
                                >
                                    <label
                                        htmlFor="query"
                                        className="absolute bg-slate-100 -top-3 px-1 left-2"
                                    >
                                        query {index + 1}
                                    </label>
                                    <input
                                        type="text"
                                        name="query"
                                        id="query"
                                        className="bg-slate-100 p-2"
                                        onChange={(e) => handleQuery(e, index)}
                                    />
                                    <button
                                        className="text-red-500 hover:text-red-600 active:text-red-700 transition-colors duration-100"
                                        onClick={() => handleDeleteQuery(index)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="size-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                            <div>
                                <button
                                    className="bg-blue-400 text-white py-2 px-3 rounded-sm hover:bg-blue-500 active:bg-blue-600 transition-colors duration-100"
                                    type="button"
                                    onClick={handleAddQuery}
                                >
                                    Add Query
                                </button>
                            </div>
                        </fieldset>
                        <button type="submit" className="bg-green-400 text-white py-2 px-3 rounded-sm hover:bg-green-500 active:bg-green-600 transition-colors duration-100 w-fit mx-auto">Submit</button>
                    </form>
                )}

                {responseModal && (
                    <div className="flex flex-col gap-4">
                        {response}
                    </div>
                )}
            </div>
        </div>
    );
}
