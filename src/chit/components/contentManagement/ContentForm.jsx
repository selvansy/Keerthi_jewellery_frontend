import React, { useEffect, useState } from 'react';
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
import { Breadcrumb } from '../common/breadCumbs/breadCumbs';
import { customStyles } from '../ourscheme/scheme/AddScheme';

function ContentForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isViewMode = Boolean(id);

    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [contentType, setContentType] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    const { data: contentResponse, isLoading: loadingContent } = useQuery({
        queryKey: ["content", formData.type],
        queryFn: getallContent,
    });

    const { data: contentDetails, isLoading: loadingContentDetails } = useQuery({
        queryKey: ["contentDetails", id],
        queryFn: () => getContentById(id),
        enabled: isViewMode,
    });

    const { mutate: addContentPolicy } = useMutation({
        mutationFn: (payload) => addContent(payload),
        onSuccess: (response) => {
            toast.success(response.message);
            navigate("/help/policy");
            setIsLoading(false);
            handleClear();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
            setIsLoading(false);
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
    }, [contentResponse]);

    useEffect(() => {
        if (contentDetails) {
            setFormData(contentDetails.data);
        }
    }, [contentDetails]);

    function cleanHtml(html) {
        return html
            .replace(/<p><br><\/p>$/, '') 
            .replace(/\s+$/, '');         
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        addContentPolicy(formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "content") {
            const cleanedContent = cleanHtml(value); 
            setFormData((prev) => ({
                ...prev,
                content: cleanedContent,
            }));
        }    

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleClear = () => {
        setFormData({});
    };

    const inputHeight = "42px";

    return (
       <>
        <Breadcrumb
    items={[{ label: "Help" }, { label: "Policies", active: true }]}
  />
        <div className='w-full flex flex-col bg-white border rounded-md'>
            <h3 className="text-2xl text-gray-900 font-bold my-3 mx-10">Legal Policies</h3>

            <div className='flex flex-col px-8 pb-4 pt-2 relative space-y-6'>
                {loadingContentDetails ? (
                    <Loading />
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='flex flex-col space-y-2'>
                                <label className='text-gray-700 font-medium'>
                                    Title<span className='text-red-400'> *</span>
                                </label>
                                <input
                                    type='text'
                                    name='title'
                                    value={formData.title || ""}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus-[#D1D5DB] focus:border-transparent disabled:bg-gray-100'
                                    placeholder='Enter Here'
                                    style={{ height: inputHeight }}
                                />
                                {formErrors.title && <div className="text-red-500">{formErrors.title}</div>}
                            </div>

                            <div className='flex flex-col space-y-2'>
                                <label className='text-black font-medium'>
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
                                    isDisabled={isViewMode}
                                    styles={customStyles(true)}
                                    isLoading={loadingContent}
                                    placeholder="Select Content"
                                />
                                {formErrors.type && <div className="text-red-500">{formErrors.type}</div>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Accordion type="single" value='content' className="w-full">
                                <AccordionItem value="content" className="rounded-lg bg-white border-2 border-gray-300">
                                    <AccordionTrigger className="px-6 py-4 text-lg hover:no-underline">
                                        Content
                                    </AccordionTrigger>
                                    <hr className="border-gray-300 mx-6" />
                                    <AccordionContent className="px-6 py-4">
                                        <div className="border-gray-300 rounded-lg">
                                            <ReactQuill
                                                value={formData.content || ""}
                                                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                                                theme="snow"
                                                readOnly={isViewMode}
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        {!isViewMode && (
                            <div className='flex justify-end gap-4 pt-4'>
                                <button 
                                    className='bg-gray-200 text-black rounded-md px-4 py-2 w-full md:w-24 hover:bg-gray-300 transition-colors' 
                                    type='button'
                                    onClick={()=>navigate("/help/policy")}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="text-white rounded-md px-4 py-2 w-full md:w-24 hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: layout_color }}
                                    type='submit'
                                    disabled={isLoading}
                                >
                                    {isLoading ? <SpinLoading /> : 'Save'}
                                </button>
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
       </>
    );
}

export default ContentForm;