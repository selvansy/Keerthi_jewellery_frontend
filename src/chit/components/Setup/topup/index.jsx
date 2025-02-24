import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import SpinLoading from '../../common/spinLoading';
import { useParams } from 'react-router-dom';

function Topup() {

    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    const clearId = () => {
        setId("");
    };

    const {id} = useParams()

    const [formData, setFormData] = useState({
        notify_type: 1,
        purchase_limit: "",
        avl_limit: "",
        limit_rate: ""
    });

    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false)

    const handleCancel = () => {
 
        setIsOpen(false);
        clearId();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setFormErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.notify_type) {
            errors.notify_type = "notification Type is required";
        }
        if (!formData.purchase_limit) {
            errors.purchase_limit = "purchase limit is required";
        }
        if (!formData.avl_limit) {
            errors.avl_limit = "available limit is required";
        }
        if (!formData.limit_rate) {
            errors.limit_rate = "available limit is required";
        }


        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
          return;
        }
        setIsLoading(true)
    
        try {
          
          if (id) {
            updateData.id = id;
            updatedeptMutate(updateData);
          } else {
            adddeptMutate(updateData);
          }
        } catch (error) {
          console.error("Error submitting form:", error);
        }
      };

    return (
        <div>
            <div className="flex flex-col p-4 relative">
                <>
                    <h2 className="text-2xl text-gray-900 font-bold">Add Top-Up</h2>
                    <div className="w-full flex flex-col bg-[#F5F5F5] border-t-2 border-[#023453]  overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]">
                    <div className="flex flex-col p-4 bg-white relative mb-3">
                    <div className="flex flex-col space-y-2 my-2">
                            <label className="font-medium text-gray-700">
                                Notifications Type<span className="text-red-400">*</span>
                            </label>
                            <div className="flex flex-row gap-6 justify-start">
                                {[
                                    { label: 'SMS', value: 1 },
                                    { label: 'Whatsapp', value: 2 },
                                    { label: 'Email', value: 3 }
                                ].map((notify_type) => (
                                    <label
                                        key={notify_type.value}
                                        className="flex items-center space-x-2 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="notify_type"
                                            value={notify_type.value}
                                            checked={formData.notify_type == notify_type.value}
                                            onChange={ (e)=>{
                                                const value = e.target.value;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    notify_type: value,
                                                }))
                                            }}
                                            className="hidden"
                                        />
                                        <div
                                            className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors duration-200 ${formData.notify_type == notify_type.value
                                                    ? 'bg-[#023453] border-[#023453]'
                                                    : 'border-gray-400'
                                                }`}
                                        >
                                            {formData.notify_type == notify_type.value && (
                                                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                        <span className="text-gray-700">{notify_type.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>


                    <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300 mb-10"> 

                        <div className="flex flex-col space-y-2">
                        <label className="font-medium text-gray-700 mt-2">Notify Limit</label>
                            <input
                                type="text"
                                name="notify_limit"
                                value={formData.notify_limit}
                                onChange={handleChange}
                                minLength="2"
                                placeholder="Enter notification limit"
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {formErrors.notify_limit && (
                                <div className="text-red-500 text-sm">{formErrors.notify_limit}</div>
                            )}
                        </div>


                        <div className="flex flex-col space-y-2">
                            <label className="font-medium text-gray-700">
                                Purchase limit<span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="purchase_limit"
                                value={formData.purchase_limit}
                                onChange={handleChange}
                                minLength={"2"}
                                placeholder="Enter purchase limit"
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {formErrors.purchase_limit && (
                                <div className="text-red-500 text-sm">{formErrors.purchase_limit}</div>
                            )}
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="font-medium text-gray-700">
                                Availabe limit<span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="avl_limit"
                                value={formData.avl_limit}
                                onChange={handleChange}
                                minLength={"2"}
                                placeholder="Enter available limit"
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {formErrors.avl_limit && (
                                <div className="text-red-500 text-sm">{formErrors.avl_limit}</div>
                            )}
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="font-medium text-gray-700">
                                Limit Rate<span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="limit_rate"
                                value={formData.limit_rate}
                                onChange={handleChange}
                                minLength={"2"}
                                placeholder="Enter limit rate"
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {formErrors.limit_rate && (
                                <div className="text-red-500 text-sm">{formErrors.limit_rate}</div>
                            )}
                        </div>
                    </div>
                    <div className="bg-white">
                        <div className="flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
                                    onClick={handleCancel}
                                >
                                    Clear
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className=" text-white rounded-md p-2 w-full lg:w-20"
                                    style={{ backgroundColor: layout_color }}
                                >
                                    {isLoading ? <SpinLoading /> : id ? "Update" : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>

                </>

            </div>
        </div>
    )
}

export default Topup