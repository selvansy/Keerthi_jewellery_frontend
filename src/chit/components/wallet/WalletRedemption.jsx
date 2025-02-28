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
    const [walletData, setWalletData] = useState([])
    const [visibleaccount, setVisibleaccount] = useState(false);
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
              <div className="flex justify-between items-center">
              <h2 className='text-[18px] text-gray-900 font-bold mt-3 px-8'>
                    Add Wallet Redemption
                </h2>
                <div className="flex flex-col">
                <h2 className='text-[18px] text-gray-900 font-bold mt-3 px-8'>
                    Wallet Rate
                </h2>
                <p className='text-center'>2000</p>
                </div>
              </div>
                <div className='flex flex-col bg-white px-8 pb-4 pt-2 relative'>

                    <div className='grid grid-rows-1 md:grid-cols-2 gap-5'>
                        <div className='flex flex-col mt-2 mb-4 relative'>
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

                        </div>
                    </div>
                    <div className="w-full">

                        <div className="py-3 my-5 border-gray-300">
                            <table className="min-w-full table-auto my-3">
                                <thead>
                                    <tr className=" text-gray-600">
                                        <th className="px-2 py-2 text-center">Name</th>
                                        <th className="px-2 py-2 text-center">Phone Number</th>
                                        <th className="px-2 py-2 text-center">Active Scheme</th>
                                        <th className="px-2 py-2 text-center">Available Point</th>
                                        <th className="px-2 py-2 text-center">Redeemed Point</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {walletData.length > 0 ? (
                                        walletData.map((e, index) => (
                                            <tr key={index}>
                                                <td className="text-center px-2 py-2">{quantity || "-"}</td>
                                                <td className="px-2 py-2 text-center">{e.ecode || "-"}</td>
                                                <td className="px-2 py-2 text-center">{e.id_gift ? e.id_gift.gift_name : "-"}</td>
                                                <td className="px-2 py-2 text-center">{e.cus_sellprice > 0 ? e.cus_sellprice : "-"}</td>
                                               
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className="px-2 py-2 text-center">-</td>
                                            <td className="px-2 py-2 text-center">-</td>
                                            <td className="px-2 py-2 text-center">-</td>
                                            <td className="px-2 py-2 text-center">-</td>
                                            <td className="px-2 py-2 text-center">-</td>
                                           
                                        </tr>
                                    )}
                                </tbody>


                            </table>
                        </div>
                    </div>

                    <div className='grid grid-rows-2 md:grid-cols-2 gap-6 mt-5'>

                        <div className='flex flex-col gap-2'>
                            <label className='text-gray-700 font-medium'>Redeem Point<span className='text-red-400'>*</span></label>
                            <input
                                type='number'
                                name='redeem_point'
                                value={formData.redeem_point}
                                onChange={handleInputChange}
                                className='border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                                placeholder='Enter redeem_point'
                            />
                            {formErrors.redeem_point && <span className="text-red-500 text-sm mt-1">{formErrors.redeem_point}</span>}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label className='text-gray-700 font-medium'>Amount Value<span className='text-red-400'>*</span></label>
                            <input
                                type='number'
                                name='amount_value'
                                value={formData.amount_value}
                                onChange={handleInputChange}
                                className='border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                                placeholder='Enter amount value'
                            />
                            {formErrors.amount_value && <span className="text-red-500 text-sm mt-1">{formErrors.amount_value}</span>}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label className='text-gray-700 font-medium'>Purpose of Redeem<span className='text-red-400'>*</span></label>
                            <input
                                type='text'
                                name='purpose_redeem'
                                value={formData.purpose_redeem}
                                onChange={handleInputChange}
                                className='border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                                placeholder='Enter purpose_redeem'
                            />
                            {formErrors.purpose_redeem && <span className="text-red-500 text-sm mt-1">{formErrors.purpose_redeem}</span>}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label className='text-gray-700 font-medium'>Bill no<span className='text-red-400'>*</span></label>
                            <input
                                type='number'
                                name='billno'
                                value={formData.billno}
                                onChange={handleInputChange}
                                min='0'
                                onKeyDown={(e) => {
                                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                        e.preventDefault();
                                    }
                                }}
                                className='border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                                placeholder='Enter billno'
                            />
                            {formErrors.billno && <span className="text-red-500 text-sm mt-1">{formErrors.billno}</span>}
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