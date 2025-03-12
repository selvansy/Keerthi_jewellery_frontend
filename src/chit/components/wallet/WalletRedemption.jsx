import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { mobilesearch, redeemType, getallwallet, walletRedeem, getmultipaymentmode } from '../../../chit/api/Endpoints'
import { formatNumber } from "../../utils/commonFunction"
import SpinLoading from '../common/spinLoading';
import { customSelectStyles } from "../../../chit/components/Setup/purity";
import Select from "react-select";

function WalletRedemption() {

    const [formErrors, setFormErrors] = useState({})
    const [isLoading, setLoading] = useState(false)
    const [mobile, setMobile] = useState("")
    const [walletData, setWalletData] = useState({})
    const [walletPoints, setWalletPoints] = useState({})
    const [redeem_type, setRedeemType] = useState([])
    const [paymentData, setPaymentData] = useState([])
    const [formData, setFormData] = useState({
        billno: "",
        redeem_amt: "",
        redeem_point: walletData.available_point || "",
        redeem_type: "",
        payment_mode: ""
    });

    const layout_color = useSelector((state) => state.clientForm.layoutColor);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const numericValue = value.trim() === "" ? 0 : Number(value);

        setFormData((prevData) => {
            let updatedData = { ...prevData };
            let errors = { ...formErrors };

            const conversionRate = walletPoints.points && Number(walletPoints.points);

            const validateAndSet = (field, limit, relatedField, conversion) => {

                if (isNaN(numericValue) || numericValue < 0) {
                    errors[field] = "Invalid value";
                    return prevData;
                }

                const isExceeding = numericValue > limit;
                errors[field] = isExceeding ? `Value shouldn't exceed ${limit}` : "";

                if (!isExceeding) {
                    updatedData[field] = numericValue;
                    updatedData[relatedField] = conversion(numericValue);
                }
            };

            if (name === "redeem_point") {
                validateAndSet(
                    "redeem_point",
                    walletData.available_point,
                    "redeem_amt",
                    (val) => Number((val / conversionRate).toFixed(2))
                );
            } else if (name === "redeem_amt") {
                const maxRedeemableAmt = walletData.available_point / conversionRate;

                validateAndSet(
                    "redeem_amt",
                    maxRedeemableAmt,
                    "redeem_point",
                    (val) => Number(Math.floor(val * conversionRate))
                );
            } else {
                updatedData[name] = name === "billno" ? value : numericValue;
            }

            setFormErrors(errors);
            return updatedData;
        });
    };


    const validateForm = () => {
        let errors = {}
        if (!formData.redeem_point) errors.redeem_point = "RedeemPoint is required"
        if (!formData.redeem_amt) errors.redeem_amt = "RedeemAmount is required"
        if (!formData.redeem_type) errors.redeem_type = "ReedType is required"
        if (formData.redeem_type == "2") {
            if (!formData.billno) errors.billno = "Billno is required"
        }
        if (formData.redeem_type == "1") {
            if (!formData.payment_mode) errors.payment_mode = "Payment mode is required"
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0;
    }



    const handleClear = () => {
        setFormData({
            billno: "",
            redeem_amt: "",
            redeem_point: "",
            redeem_type: ""
        })
        setWalletData({})
        setMobile("")

    }

    const handleSave = () => {
        if (!validateForm()) {
            return
        }

        setLoading(true)
        handleRedeemPoints(formData)
    }


    const handleSearchmobile = () => {
        setLoading(true)
        handlesearchcustomer(mobile);

    };


    const { mutate: handleRedeemPoints } = useMutation({
        mutationFn: (payload) => walletRedeem(payload),
        onSuccess: (response) => {
            if (response) {
                handleClear()
            }

            setLoading(false)
            toast.success(response.message)
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message)
            setLoading(false)
        }
    });



    const { mutate: handlesearchcustomer } = useMutation({
        mutationFn: mobilesearch,
        onSuccess: (response) => {
            if (response) {
                const res = response.data.custData;
                setWalletData({
                    customer_name: res.firstname + ' ' + res.lastname,
                    phone: res.mobile,
                    redeemed_point: response.data?.walletData?.redeemed_point,
                    balance_point: response.data?.walletData?.balance_point,
                    active_scheme: response.data?.activeScheme,
                })

                setFormData((prevData) => ({
                    ...prevData,
                    id_customer: res._id,
                }));
            }
            setLoading(false)
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message)
            setLoading(false)
        }
    });

    const { data: walletPointsRate } = useQuery({
        queryKey: ["walletpoints"],
        queryFn: getallwallet,
    });


    const { data: redeemTypeData } = useQuery({
        queryKey: ["redeem"],
        queryFn: redeemType,
    });

    const { data: paymentModeData } = useQuery({
        queryKey: ["payment"],
        queryFn: getmultipaymentmode,
    });

    useEffect(() => {
        if (redeemTypeData) {
            const data = redeemTypeData.data.map(item => ({
                label: item.name,
                value: item.id
            }));

            setRedeemType(data);
        }

 
        if (paymentModeData) {
            const data = paymentModeData.data.map(item => ({
                label: item.name,
                value: item.id
            }));

            setPaymentData(data);
        }

        if (walletPointsRate) {
            const data = walletPointsRate.data
            setWalletPoints(prev => ({
                ...prev,
                points: data.points,
                rupee: data.rupee_per_points
            }))

        }

    }, [redeemTypeData, walletPointsRate, paymentModeData])



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
                        <p className='text-center'>{walletPoints.points} Points = {formatNumber({ value: walletPoints.rupee, decimalPlaces: 0 })}</p>
                    </div>
                </div>
                <div className='flex flex-col bg-white px-8 pb-4 pt-2 relative'>

                    <div className='grid grid-rows-1 md:grid-cols-2 gap-5'>
                        <div className='flex flex-col mt-2 mb-4 relative'>
                            <div className="flex flex-col gap-3mt-3">
                                <div className='flex flex-col gap-3relative'>
                                    <label className='text-black mb-1 font-normal'>Phone Number<span className='text-red-400'>*</span></label>
                                    <input
                                        type='text'
                                        value={mobile}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            setMobile(value)
                                        }}
                                        name='mobile'
                                        onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                        pattern="\d{10}"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handlesearchcustomer(mobile)
                                            }
                                        }}
                                        maxLength={"10"}
                                        className='border-2 border-gray-300 rounded-md p-3 focus:border-transparent'
                                        placeholder='Enter Here'
                                    />

                                    {/* Search Icon */}
                                    <div onClick={handleSearchmobile} className="absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[60%] -translate-y-1/2 w-10 md:h-[50px] md:top-[53px] h-[50%] sm:right-0 sm:top-[73%] lg:right-[0%]"
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
                       <div>{console.log(walletData)}</div>
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
                                    <tr>
                                        <td className="text-center px-2 py-2">{walletData.customer_name || "-"}</td>
                                        <td className="px-2 py-2 text-center">{walletData.phone || "-"}</td>
                                        <td className="px-2 py-2 text-center">{walletData.active_scheme ?? "-"}</td>
                                        <td className="px-2 py-2 text-center">{walletData.balance_point ?? "-"}</td>
                                        <td className="px-2 py-2 text-center">{walletData.redeemed_point ?? "-"}</td>
                                    </tr>
                                </tbody>


                            </table>
                        </div>
                    </div>

                    <div className='grid grid-rows-2 md:grid-cols-2 gap-6 mt-5'>

                        <div className='flex flex-col gap-2'>
                            <label className='text-gray-700 font-medium'>Redeem Point<span className='text-red-400'>*</span></label>
                            <input
                                type='text'
                                name='redeem_point'
                                value={formData.redeem_point}
                                onChange={handleInputChange}
                                onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                pattern="\d{5}"
                                max={"5"}
                                maxLength={"5"}
                                className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                                placeholder='Enter redeem_point'
                            />
                            {formErrors.redeem_point && <span className="text-red-500 text-sm mt-1">{formErrors.redeem_point}</span>}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label className='text-gray-700 font-medium'>Amount Value<span className='text-red-400'>*</span></label>
                            <input
                                type='text'
                                name='redeem_amt'
                                maxLength={"5"}
                                value={formData.redeem_amt}
                                readOnly
                                // onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                pattern="\d{5}"
                                onChange={handleInputChange}
                                className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                                placeholder='Enter amount value'
                            />
                            {formErrors.redeem_amt && <span className="text-red-500 text-sm mt-1">{formErrors.redeem_amt}</span>}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label className='text-gray-700 font-medium'>
                                Purpose of Redeem<span className='text-red-400'>*</span>
                            </label>

                            <Select
                                name="redeem_type"
                                value={redeem_type.find(option => option.value === formData.redeem_type)}
                                onChange={(selectedOption) =>
                                    handleInputChange({ target: { name: 'redeem_type', value: selectedOption?.value } })
                                }
                                options={redeem_type}
                                styles={customSelectStyles}
                                placeholder="-- Select --"
                            />

                            {formErrors.redeem_type && (
                                <span className="text-red-500 text-sm mt-1">{formErrors.redeem_type}</span>
                            )}
                        </div>


                        {(formData.redeem_type === "1" || formData.redeem_type === 1) && (
                            <div className='flex flex-col gap-2'>
                                <label className='text-gray-700 font-medium'>
                                    Payment Mode<span className='text-red-400'>*</span>
                                </label>

                                <Select
                                    name="paymentData"
                                    value={paymentData.find(option => option.value === formData.payment_mode)}
                                    onChange={(selectedOption) =>
                                        handleInputChange({ target: { name: 'payment_mode', value: selectedOption?.value } })
                                    }
                                    options={paymentData}
                                    styles={customSelectStyles}
                                    placeholder="-- Select --"
                                />

                                {formErrors.payment_mode && (
                                    <span className="text-red-500 text-sm mt-1">{formErrors.payment_mode}</span>
                                )}
                            </div>
                        )}



                        <div className='flex flex-col gap-2'>
                            <label className='text-gray-700 font-medium'>Bill no<span className='text-red-400'></span></label>
                            <input
                                type='text'
                                name='billno'
                                value={formData.billno}
                                onChange={handleInputChange}
                                className='border-2 border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                                placeholder='Enter billno'
                            />
                            {formErrors.billno && <span className="text-red-500 text-sm mt-1">{formErrors.billno}</span>}
                        </div>
                    </div>

                    <div className='bg-white mt-6'>
                        <div className='flex justify-start gap-3 mt-3'>
                            <button
                                className='bg-[#E2E8F0] text-black rounded-md p-3 w-1/2  lg:w-20'
                                type='button'
                                onClick={handleClear}
                            >
                                Clear
                            </button>
                            <button
                                className=' text-white rounded-md p-3 w-1/2 lg:w-20'
                                type='button'
                                style={{ backgroundColor: layout_color }}
                                onClick={handleSave}
                                disabled={isLoading}
                            >
                                {isLoading ? <SpinLoading /> : "Save"}
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