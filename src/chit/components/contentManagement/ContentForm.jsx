import React, { useEffect, useState } from 'react'
import SpinLoading from '../common/spinLoading';
import { useSelector } from 'react-redux';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import { getallContent, addContent } from "../../api/Endpoints"
import { customSelectStyles } from "../../components/Setup/purity/index"
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../../../../components/ui/accordion";
import Loading from '../common/Loading';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function ContentForm() {

  
    const navigate = useNavigate()

    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({});
    const [contentType, setContentType] = useState([])
    const [isLoading, setIsLoading] = useState(false)

   

    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    const { data: contentResponse, isLoading: loadingContent } = useQuery({
        queryKey: ["content", formData.type],
        queryFn: getallContent,
    });


    const { mutate: addContentPolicy } = useMutation({
        mutationFn: (payload) => addContent(payload),
        onSuccess: (response) => {
            
            if (response) {
                toast.success(response.message)
                navigate("/help/policy")
            }
       
            setIsLoading(false)
            handleClear()
        },
        onError: (error) => {
            console.log("erro",error)
            toast.error(error?.response?.data?.message)
            setIsLoading(false)
            
        }
    });

    

    useEffect(() => {

        if (contentResponse) {
            const data = contentResponse.data;

            const content = data.map((content) => ({
                value: Number(content.id),
                label: content.name,
            }));
            setContentType(content);
        }

    }, [contentResponse])



    const handleSubmit = (e) => {
        e.preventDefault();
      
        setIsLoading(true)
        addContentPolicy(formData)
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    const handleClear = () => {
        setFormData({})
    }


    return (
        <div className='w-full flex flex-col  bg-white mt-5'>
            <h3 className="text-2xl text-gray-900 font-bold my-3 mx-10">Legal Policies</h3>

            <div className='flex flex-col pl-8 pr-8 pb-4 pt-2 relative space-y-2'>

                <>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        handleSubmit(e)
                    }} >

                        <div className='grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300'>

                            <div className='flex flex-col'>
                                <label className='text-gray-700 mb-1 font-medium'>Title<span className='text-red-400'> *</span></label>
                                <input
                                    type='text'
                                    name='title'
                                    value={formData.title}
                                    onChange={(e) => {
                                        handleChange(e)
                                    }}
                                    className='border-2 border-gray-300 rounded-md p-[6.20px] focus:outline-none focus:ring-2 focus-[#D1D5DB] focus:border-transparent'
                                    placeholder='Enter Here'
                                />
                                {formErrors.title ? <div style={{ color: "red" }}>{formErrors.title}</div> : null}
                            </div>


                            <div className='flex flex-col'>
                                <label className='text-black mb-1 font-medium'>
                                    Content Type<span className='text-red-400'> *</span>
                                </label>

                                <Select
                                    options={contentType}
                                    value={contentType.find(option => option.value === formData?.type) || ""}
                                    onChange={(selectedOption) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            type: selectedOption.value
                                        }));
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                        }
                                    }}
                                    customSelectStyles={customSelectStyles}
                                    isLoading={loadingContent}
                                    placeholder="Select Content"
                                />

                                {formErrors.type && <div style={{ color: "red" }}>{formErrors.type}</div>}
                            </div>
                        </div>

                        <Accordion type="single" value='content' className="space-y-4">
                            <AccordionItem value="content" className="rounded-lg bg-white border-2 border-gray-300 p-[6.20px] focus:outline-none focus:ring-2 focus-[#D1D5DB]">
                                <AccordionTrigger className="px-6 py-4 text-[18px]">
                                    Content
                                </AccordionTrigger>
                                <hr className="border-gray-300" />
                                <AccordionContent value="content" className="px-6 py-4 text-[16px]">
                                    <div className="p-2 border-gray-300 rounded-lg">
                                        <ReactQuill
                                            value={formData.content}
                                            onChange={(value) => {  
                                                setFormData(prev => ({
                                                    ...prev,
                                                    content: value
                                                }));
                                            }}
                                            theme="snow"
                                            modules={{
                                                history: {
                                                    delay: 2000,
                                                    maxStack: 500,
                                                    userOnly: true,
                                                }
                                            }}
                                        />


                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <div>

                            <div className='bg-white mt-6'>
                                <div className='flex justify-end gap-2 mt-3'>
                                    <button
                                        className='bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20'
                                        type='button'

                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className=" text-white rounded-md p-2 w-full lg:w-20"
                                        type='submit'
                                        style={{ backgroundColor: layout_color }}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <SpinLoading /> : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </>
            </div>
        </div>

    )
}

export default ContentForm