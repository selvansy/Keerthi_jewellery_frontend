import React, { useState, useEffect } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../../../../../components/ui/accordion";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getfaqCat, addFaq, getFaqId ,updateFaq  } from "../../../api/Endpoints";
import Select from "react-select";
import customSelectStyles from "../../common/customSelectStyles";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import SpinLoading from "../../common/spinLoading";

const FAQForm = () => {
    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    const { id } = useParams();
    
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});

    const [category, setCategory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const validate = () => {
        const errors = {};
        if (!formData.question) errors.question = "Question is required.";
        if (!formData.answer) errors.answer = "Answer is required.";
        if (!formData.category) errors.category = "Category is required.";
        if (!formData.order) errors.order = "Order is required.";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validate()) return; 
    
        const payload = { id, values: formData };
    
        id ? updateFaqContent(payload) : addFaqContent(formData);
    };
    


    useEffect(() => {
        if (id) {
            getFaqById(id)
        }
    }, [id])


    const handleClear = () => {
        if(id){
            getFaqById(id)
        }else{
        setFormData({})
        setFormErrors({})
        }
    }


    const { mutate: getFaqById } = useMutation({
        mutationFn: (id) => getFaqId(id),
        onSuccess: (response) => {
      
            if (response) {
                setFormData(response.data)
            }


        },
        onError: (error) => {
          
            toast.error(error?.response?.data?.message);

        }
    });


    const { mutate: addFaqContent } = useMutation({
        mutationFn: (payload) => addFaq(payload),
        onSuccess: (response) => {
            if (response) {
                toast.success("FAQs added successfully!");
            }
            handleClear()
            setIsLoading(false);
            navigate("/help/faq/table");

        },
        onError: (error) => {
              
            toast.error(error?.response?.data?.message);
            setIsLoading(false);
        }
    });

    const { mutate: updateFaqContent } = useMutation({
        mutationFn: (payload) => updateFaq(payload),
        onSuccess: (response) => {
            if (response) {
                toast.success(response.message);
            }
            handleClear()
            setIsLoading(false);
            navigate("/help/faq/table");
        
        },
        onError: (error) => {
            
            toast.error(error?.response?.data?.message);
            setIsLoading(false);
        }
    });


    const { data: categoryResponse, isLoading: loadingCategory } = useQuery({
        queryKey: ["category", category],
        queryFn: getfaqCat,
    });


    useEffect(() => {
        if (categoryResponse) {
            const data = categoryResponse.data;
            const categoryOptions = data.map((category) => ({
                value: category.id,
                label: category.name,
            }));
            setCategory(categoryOptions);
        }
    }, [categoryResponse]);

    return (
        <div className="w-full flex flex-col bg-white mt-5">
            <h3 className="text-2xl text-gray-900 font-bold my-3 mx-10">FAQs</h3>

            <div className="flex flex-col pl-8 pr-8 pb-4 pt-2 relative space-y-2">
                <form>
                    <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300">
                        <div className="flex flex-col">
                            <label className="text-gray-700 mb-1 font-medium">
                                Question<span className="text-red-400"> *</span>
                            </label>
                            <input
                                type="text"
                                name="question"
                                value={formData.question || ""}
                                onChange={handleChange}
                                className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus-[#D1D5DB] focus:border-transparent"
                                placeholder="Enter Here"
                            />
                            {formErrors.question && <div style={{ color: "red" }}>{formErrors.question}</div>}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 mb-1 font-medium">
                                Order<span className="text-red-400"> *</span>
                            </label>
                            <input
                                type="text"
                                name="order"
                                value={formData.order || ""}
                                onChange={handleChange}
                                className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus-[#D1D5DB] focus:border-transparent"
                                placeholder="Enter Here"
                            />
                            {formErrors.order && <div style={{ color: "red" }}>{formErrors.order}</div>}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-black mb-1 font-medium">Category<span className="text-red-400"> *</span></label>
                            <Select
                                options={category}
                                value={category.find(cat => Number(cat.value) === Number(formData.category)) || null}
                                onChange={(ele) => setFormData((prev) => ({ ...prev, category: Number(ele.value) }))}  // Store as number
                                styles={customSelectStyles}
                                isLoading={loadingCategory}
                                placeholder="Select Category"
                            />


                            {formErrors.category && <div style={{ color: "red" }}>{formErrors.category}</div>}
                        </div>
                    </div>

                    <div className="flex flex-col mt-4">
                        <label className="text-black mb-1 font-medium">Answer<span className="text-red-400"> *</span></label>
                        <ReactQuill
                            value={formData.answer || ""}
                            onChange={(value) => setFormData(prev => ({ ...prev, answer: value }))}
                            theme="snow"
                        />
                        {formErrors.answer && <div style={{ color: "red" }}>{formErrors.answer}</div>}
                    </div>

                    <div className="bg-white mt-6 flex justify-end gap-2">
                        <button className="bg-gray-300 text-black rounded-md p-2 w-full lg:w-20"
                            type="button"
                            onClick={handleClear}>
                            Cancel
                        </button>
                        <button
                            className="text-white rounded-md p-2 w-full lg:w-20"
                            type="submit"
                            style={{ backgroundColor: layout_color }}
                            disabled={isLoading}
                            onClick={handleSubmit}
                        >
                            {isLoading ? <SpinLoading /> : id ? "Update" : "Submit"}
                        </button>

                    </div>
                </form>

            </div>
        </div>
    );
};

export default FAQForm;
