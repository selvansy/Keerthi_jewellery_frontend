import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getContentTypes } from "../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { sections } from "../../../../src/utils/Constants.js";


const PolicyView = () => {
    const [activeTab, setActiveTab] = useState(1);
    const [contentData, setContentData] = useState([]);
    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    const { mutate: ContentPolicy } = useMutation({
        mutationFn: (payload) => getContentTypes(payload),
        onSuccess: (response) => {
            setContentData(response.data);
        },
        onError: (error) => {
           
            setContentData([]);
        }
    });

    useEffect(() => {
        let payload = {
            page: 1,
            limit: 10,
            type: activeTab
        };
        ContentPolicy(payload);
    }, [activeTab]);

    return (
        <>
            <nav
                className="navbar fixed top-20 inset-x-0 z-10 rounded-lg shadow-md w-full p-4 flex flex-col md:flex-row md:items-center md:justify-end transition-transform translate-y-0"
                aria-label="Navigation Tabs"
            >
                <ul className="flex w-full md:w-auto menu md:menu-horizontal gap-4 p-0 text-lg font-medium text-gray-700">
                    {sections.map(({ id, name }) => (
                        <li key={id}>
                            <button
                                onClick={() => setActiveTab(id)}
                                className={`px-3 py-2 rounded-lg transition-colors ${
                                    activeTab === id ? "text-white" : "bg-gray-200 text-black"
                                }`}
                                style={activeTab === id ? { backgroundColor: layout_color } : {}}
                            >
                                {name}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="overflow-y-auto mt-24 space-y-6 p-6 rounded-lg shadow-sm">
                {sections.map(({ id, name }) =>
                    activeTab === id ? (
                        <div key={id} id={id} className="mb-8 p-4 bg-white rounded-lg shadow-md">
                            <p className="text-xl font-semibold text-gray-900">{name}</p>
                            {contentData.length > 0 ? (
                                contentData.map((e) => (
                                    <div key={e._id} className="flex flex-col items-start">
                                        <p className="mt-2 font-semibold text-lg text-gray-600">
                                            {e.title}
                                        </p>

                                        <div className="min-h-[200px]">
                                            <ReactQuill
                                                value={e.content}
                                                readOnly={true}
                                                theme="bubble"
                                                modules={{ toolbar: false }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className=" text-gray-900 mt-3">No records found</p>
                            )}
                        </div>
                    ) : null
                )}
            </div>
        </>
    );
};

export default PolicyView;
