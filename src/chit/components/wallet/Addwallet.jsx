import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {getallwallet,addwalletData} from "../../api/Endpoints"
import SpinLoading from '../common/spinLoading';
import ModelOne from "../../components/common/Modelone";
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

function Addwallet() {

    const dispatch = useDispatch();
    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    const [formData, setFormData] = useState({
        points: "",
        rupee_per_points: "",
    });

  
    const [isLoading, setIsLoading] = useState(false)
    const [formErrors, setFormErrors] = useState({});
   

    useEffect(() => {
        getallWalletData();
    }, []);

    const { mutate: getallWalletData } = useMutation({
        mutationFn: getallwallet,
        onSuccess: (response) => {
       setFormData(prev=>({
        ...prev,
        rupee_per_points:response.data.rupee_per_points,
        points:response.data.points
       }))

        },
        onError: (error) => {
          ;
    
        },
      });

      const { mutate: addWallet } = useMutation({
        mutationFn: addwalletData,
        onSuccess: (response) => {
            toast.success(response.message)
       setIsLoading(false)
      
        },

        onError: (error) => {
            setIsLoading(false)
          ;
        },
      });


    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedValue = Number(value)
        setFormData((prev) => ({
            ...prev,
            [name]: updatedValue,
        }));

    };


    const handleClear = () => {
        getallWalletData()
    }


    const handleSubmit = () => {   
        try {
            setIsLoading(true)
            const updateData = {
                points: formData.points,
                rupee_per_points: formData.rupee_per_points,
            };

            addWallet(updateData);
            
        } catch (error) {
            console.error("Error:", error);
        }
    };


    return (
        <div className='bg-white overflow-y-auto scrollbar-hide w-1/2 my-10 mx-auto'>
            <div className='flex flex-col pl-8 pr-8 pb-4 pt-2 relative space-y-2'>
                <h2 className='text-gray-900 font-semibold text-xl my-2'>Add Wallet Point Rate</h2>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col space-y-2">
                        <label className="font-medium text-gray-700">
                            Wallet Point<span className="text-red-400"> *</span>
                        </label>
                        <input
                            type="text"
                            name="points"
                            value={formData.points}
                            onChange={handleChange}
                            placeholder="Wallet point"
                            readOnly
                            className="p-3 w-full border border-gray-300 bg-[#e2e8f0] cursor-not-allowed rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formErrors.points && (
                            <div className="text-red-500 text-sm">{formErrors.points}</div>
                        )}
                    </div>

                    <div className="flex  flex-col space-y-2">
                        <label className="font-medium text-gray-700">
                            Rate<span className="text-red-400"> *</span>
                        </label>

                        <input
                            type="text"
                            name="rupee_per_points"
                            value={formData.rupee_per_points}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                                if ((e.target.value.match(/\./g) || []).length > 1) {
                                    e.target.value = e.target.value.replace(/\.+$/, '');
                                }
                            }}
                            maxLength={"5"}
                            pattern="\d{5}"
                            placeholder="Enter rate"
                            className="p-3 border w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formErrors.rupee_per_points && (
                            <div className="text-red-500 text-sm">{formErrors.rupee_per_points}</div>
                        )}
                    </div>

                    <div className="bg-white p-2 mt-6">
                        <div className="flex justify-start gap-2">
                            <button
                                type="button"
                                className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
                                onClick={handleClear}
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
                                {isLoading ? <SpinLoading /> : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Addwallet