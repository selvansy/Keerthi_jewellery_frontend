import React, { useDebugValue, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux';
import SpinLoading from '../../common/spinLoading';
import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { addTopup } from "../../../api/Endpoints"

function Topup() {

    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    const { id } = useParams()

    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        SMS: false,
        WhatsApp: false,
        Email: false,
        limitRequest: 0,
        limitRate: 0,
        requestedAmount: 0,
        actualAmount: 0
    });

    useEffect(() => {
        const limit_rate = 1.5;
        setFormData((prev) => ({
            ...prev,
            limitRate: limit_rate,
            actualAmount: 900
        }));

    }, [formData.limitRequest])



    const handleChange = (e) => {
        const { name, value } = e.target;

        const numericValue = value.replace(/\D/g, "");

        setFormData((prev) => {
            const updatedLimitRequest = name === "limitRequest" ? numericValue : prev.limitRequest;

            return {
                ...prev,
                [name]: numericValue,
                ...(name === "limitRequest" && {
                    requestedAmount: updatedLimitRequest * prev.limitRate || 0,
                }),
            };
        });

        setFormErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };


    const handleCancel = () => {
        setFormData({
            SMS: false,
            WhatsApp: false,
            Email: false,
            limitRequest: 0,
        })
    }


    const { mutate: addTopupMutate } = useMutation({
        mutationFn: (payload) => addTopup(payload),
        onSuccess: (response) => {
            if (response) {
                toast.success(response.message)
            }
            setIsLoading(false)
            setFormData({
                SMS: false,
                WhatsApp: false,
                Email: false,
                limitRequest: 0,
            })
        },
        onError: () => {
            setIsLoading(false)
            toast.error("Failed to add top-up")
        },
    });



    const validateForm = () => {
        const errors = {};


        if (!formData.limitRequest) {
            errors.limitRequest = "purchase limit is required";
        }

        if (!formData.limitRequest) {
            errors.limitRequest = "purchase limit is required";
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

            addTopupMutate(formData);

        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };



    return (
        <>
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
                                        { label: 'SMS', key: 'SMS' },
                                        { label: 'WhatsApp', key: 'WhatsApp' },
                                        { label: 'Email', key: 'Email' }
                                    ].map((notify_type) => (
                                        <label
                                            key={notify_type.key}
                                            className="flex items-center space-x-2 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="notificationType"
                                                checked={formData[notify_type.key]} 
                                                onChange={() => {
                                                    setFormData({
                                                        SMS: false,
                                                        WhatsApp: false,
                                                        Email: false,
                                                        [notify_type.key]: true,
                                                    });
                                                }}
                                                className="hidden"
                                            />

                                            <div
                                                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors duration-200 ${formData[notify_type.key] ? 'bg-[#023453] border-[#023453]' : 'border-gray-400'
                                                    }`}
                                            >
                                                {formData[notify_type.key] && (
                                                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                                )}
                                            </div>
                                            <span className="text-gray-700">{notify_type.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>


                            <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300 mb-10 mt-10">
                                <div className="flex flex-col space-y-2">
                                    <label className="font-medium text-gray-700">
                                        Purchase limit<span className="text-red-400"> *</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="limitRequest"
                                        value={formData.limitRequest}
                                        onChange={handleChange}
                                        placeholder="Enter purchase limit"
                                        maxLength={10}
                                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                    {formErrors.limitRequest && (
                                        <div className="text-red-500 text-sm">{formErrors.limitRequest}</div>
                                    )}
                                </div>


                                <div className="flex flex-col space-y-2">
                                    <label className="font-medium text-gray-700">
                                        Availabe notification credit<span className="text-red-400"> *</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="actualAmount"
                                        value={formData.actualAmount}
                                        onChange={handleChange}
                                        minLength={"2"}
                                        readOnly
                                        placeholder="Enter available limit"
                                        className="p-3 border bg-[#e5e7eb] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                </div>

                                <div className="flex flex-col space-y-2">
                                    <label className="font-medium text-gray-700">
                                        Limit Rate<span className="text-red-400"> *</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="limit_rate"
                                        value={formData.limitRate}
                                        onChange={handleChange}
                                        minLength={"2"}
                                        readOnly
                                        placeholder="Enter limit rate"
                                        className="p-3 border bg-[#e5e7eb] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                </div>

                                <div className="flex flex-col space-y-2">
                                    <label className="font-medium text-gray-700">
                                        Payable Amount<span className="text-red-400"> *</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="requestedAmount"
                                        value={formData.requestedAmount}
                                        onChange={handleChange}
                                        readOnly
                                        placeholder="Enter PayableAmount"
                                        className="p-3 border bg-[#e5e7eb] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {formErrors.requestedAmount && (
                                        <div className="text-red-500 text-sm">{formErrors.requestedAmount}</div>
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
        </>
    )
}

export default Topup