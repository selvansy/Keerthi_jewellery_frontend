import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { searchcustomermobile, getallbranch } from '../../../chit/api/Endpoints'

function WalletRedemption() {

    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({})
    const [isLoading, setLoading] = useState(false)
    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleSearchmobile = () => {
        setLoading(true)
        handlesearchcustomer({ id_branch: formData.id_branch, search_mobile: formData.mobile });

    };


    const { mutate: handlesearchcustomer } = useMutation({
        mutationFn: searchcustomermobile,
        onSuccess: (response) => {
            if (response) {
                setFormData(prev => ({
                    ...prev,
                    customer_name: response.data.firstname + ' ' + response.data.lastname
                }));
            }
            toast.success(response.message)
            setLoading(false)
        },
        onError: (error) => {

            toast.error(error?.response?.data?.message)
            setLoading(false)
        }
    });

    return (
        <>
            <div className='w-full flex flex-col bg-white mt-10 p-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]'>
                <h2 className='text-[18px] text-[#023453] font-bold mt-3 px-8'>
                    Add Wallet Redemption
                </h2>
                <div className='flex flex-col bg-white px-8 pb-4 pt-2 relative'>

                    <div className="flex flex-col gap-2 mt-3">
                        <div className='flex flex-col gap-2 relative'>
                            <label className='text-black mb-1 font-normal'>Phone Number<span className='text-red-400'>*</span></label>
                            <input
                                type='text'
                                value={formData.mobile}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData(prev => ({
                                        ...prev,
                                        mobile: value
                                    }))
                                }}
                                name='mobile'
                                onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                pattern="\d{10}"
                                maxLength={"10"}
                                className='border-2 border-gray-300 rounded-md p-2  focus:border-transparent'
                                placeholder='Enter Here'
                            />

                            {/* Search Icon */}
                            <div onClick={handleSearchmobile} className="absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[60%] -translate-y-1/2 w-10 md:h-[40px] md:top-[58px] h-[20%] sm:right-0 sm:top-[68%] lg:right-[0%]"
                                style={{ backgroundColor: layout_color }}>
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                ) : (
                                    <Search size={15} className="text-white" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='grid grid-rows-2 md:grid-cols-2 gap-6 mt-5'>

                        <div className='flex flex-col gap-2'>
                            <label className='text-gray-700 font-medium'>Mobile<span className='text-red-400'>*</span></label>
                            <input
                                type='number'
                                name='mobile'
                                value={formData.mobile}
                                onChange={handleInputChange}
                                className='border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                                placeholder='Enter Mobile No'
                            />
                            {formErrors.mobile && <span className="text-red-500 text-sm mt-1">{formErrors.mobile}</span>}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label className='text-gray-700 font-medium'>Whatsapp<span className='text-red-400'>*</span></label>
                            <input
                                type='number'
                                name='whatsapp_no'
                                value={formData.whatsapp_no}
                                onChange={handleInputChange}
                                className='border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                                placeholder='Enter Whatsapp No'
                            />
                            {formErrors.whatsapp_no && <span className="text-red-500 text-sm mt-1">{formErrors.whatsapp_no}</span>}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label className='text-gray-700 font-medium'>Address<span className='text-red-400'>*</span></label>
                            <input
                                type='text'
                                name='address'
                                value={formData.address}
                                onChange={handleInputChange}
                                className='border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                                placeholder='Enter Address'
                            />
                            {formErrors.address && <span className="text-red-500 text-sm mt-1">{formErrors.address}</span>}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label className='text-gray-700 font-medium'>Pincode<span className='text-red-400'>*</span></label>
                            <input
                                type='number'
                                name='pincode'
                                value={formData.pincode}
                                onChange={handleInputChange}
                                min='0'
                                onKeyDown={(e) => {
                                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                        e.preventDefault();
                                    }
                                }}
                                className='border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                                placeholder='Enter Pincode'
                            />
                            {formErrors.pincode && <span className="text-red-500 text-sm mt-1">{formErrors.pincode}</span>}
                        </div>
                    </div>

                    <div className='bg-white mt-6'>
                        <div className='flex justify-start gap-2 mt-3'>
                            <button
                                className='bg-[#E2E8F0] text-black rounded-md p-3 w-1/2  lg:w-20'
                                type='button'
                            //   onClick={handleClear}
                            >
                                Clear
                            </button>
                            <button
                                className=' text-white rounded-md p-3 w-1/2 lg:w-20'
                                type='button'
                                style={{ backgroundColor: layout_color }}
                            //   onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>

                </div>
                <div>
                </div>
            </div>
        </>
    )
}

export default WalletRedemption