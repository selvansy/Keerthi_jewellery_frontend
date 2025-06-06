import React, { useEffect, useState } from 'react'
import SpinLoading from '../common/spinLoading';
import { useSelector } from 'react-redux';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import { getallContent, getContentById, addContent } from "../../api/Endpoints";
import { customSelectStyles } from "../../components/Setup/purity/index";
import { useMutation, useQuery } from '@tanstack/react-query';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../../components/ui/accordion";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../common/Loading';

function ContentView() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isViewMode = Boolean(id);


    const [contentData, setContentData] = useState(null);
    const [filteredContent, setFilteredContent] = useState([]);
    const [isLoading, setIsLoading] = useState(false);



    const layout_color = useSelector((state) => state.clientForm.layoutColor);


    const { data: contentDetails, isLoading: loadingContentDetails } = useQuery({
        queryKey: ["content", id],
        queryFn: () => getContentById(id),

    });
  

    const content = [
        { id: 1, name: "Terms & Conditions" },
        { id: 2, name: "Privacy Policy" },
        { id: 4, name: "Refund Policy" }]
    useEffect(() => {
        if (contentDetails) {
            setContentData(contentDetails.data);
        }

    }, [contentDetails]);


    useEffect(() => {
        if (contentData?.type) {
            const filtered = content.filter(e => e.id === Number(contentData.type));
            setFilteredContent(filtered);
        }
    }, [contentData]);


    return (
        <div className='w-full flex flex-col bg-white mt-5'>
            <h3 className="text-2xl text-gray-900 font-bold my-3 mx-10">Legal Policies</h3>

            <div className='flex flex-col pl-8 pr-8 pb-4 pt-2 relative space-y-2'>
                <>
                    {loadingContentDetails ? (
                        <Loading />
                    ) : (
                        <>
                            <div className='flex flex-col justify-center  items-start gap-5 border-gray-300 border-[1px]'>
                                <div className='flex flex-col '>
                                    <div className='text-gray-700 mb-1 mx-2'>
                                        
                                        <div className='text-black mb-1 text-lg mx-2'>
                                            <h2>{contentData?.title}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <div className='flex flex-col'>
                                        <div className='text-black mb-1 text-lg mx-2 underline'>
                                            <h2>{filteredContent.length > 0 ? filteredContent[0].name : ""}</h2>
                                        </div>
                                    </div>

                                    <div className="flex flex-col text-md ">
                                        <div className="min-h-[200px]">
                                            <ReactQuill
                                                value={contentData?.content || ""}
                                                readOnly={true}
                                                theme="bubble"
                                                modules={{ toolbar: false }}
                                            />
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </>
                    )}
                </>
            </div>
        </div>
    );
}

export default ContentView;
