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
            <div className="max-w-5xl mx-auto p-6 border border-blue-400 rounded-md mt-8 bg-white shadow-sm">
                {/* Title */}
                <h1 className="text-center font-semibold text-lg mb-4">Policies</h1>

                {/* Tabs */}
                <nav
                    className="flex flex-col md:flex-row md:justify-center gap-3 mb-6"
                    aria-label="Navigation Tabs"
                >
                    <ul className="flex flex-wrap justify-center md:justify-start gap-4 text-md font-medium">
                        {sections.map(({ id, name }) => (
                            <li key={id}>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab(id)}
                                    className={`px-4 py-2 rounded-lg transition-colors ${activeTab === id
                                        ? "text-white"
                                        : "bg-gray-200 text-black"
                                        }`}
                                    style={{
                                        fontSize: "14px",
                                        ...(activeTab === id && { backgroundColor: layout_color }),
                                    }}
                                >
                                    {name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Content Area */}
                <div className="space-y-6">
                    {sections.map(({ id, name }) =>
                        activeTab === id ? (
                            <div key={id} id={id} className="p-4 bg-white rounded-lg shadow-md">
                                <p className="text-xl font-semibold text-gray-900 mb-4">{name}</p>

                                {contentData.length > 0 ? (
                                    contentData.map((e) => (
                                        <div key={e._id} className="flex flex-col gap-2 mb-6">
                                            <p className="text-lg font-semibold text-gray-700">{e.title}</p>

                                            <div className="min-h-[200px]">
                                                {/* <ReactQuill
                                                value={e.content}
                                                readOnly={true}
                                                theme="bubble"
                                                modules={{ toolbar: false }}
                                            /> */}
                                            
                                                {/* Render HTML directly */}
                                                <div
                                                    className="min-h-[200px] prose max-w-none text-gray-800"
                                                    dangerouslySetInnerHTML={{ __html: e.content }}
                                                ></div>

                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400">No records found</p>
                                )}
                            </div>
                        ) : null
                    )}
                </div>
            </div>
        </>
    );
};

export default PolicyView;
