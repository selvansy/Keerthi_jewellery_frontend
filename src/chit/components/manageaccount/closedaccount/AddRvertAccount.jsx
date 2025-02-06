import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Search } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

const AddRvertAccount = () => {
  const navigate = useNavigate()
  const [startDate, setStartDate] = useState(null);
  const [maturityDate, setMaturityDate] = useState(null);

  const handleCancle = () => {
    navigate('/manageaccount/closedaccount')
  }

  return (
    <>
      <div className='flex flex-row justify-between'>
        <h2 className='text-2xl text-[#023453] font-bold justify-between'>Revert Account</h2>
      </div>
      <div className='w-full flex flex-col bg-white pl-8 pr-8 pb-4 border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]'>
        <div className='mb-8'>
          <h2 className='text-1xl font-bold mb-4 mt-4'>Customer Details</h2>
          <div className='grid grid-rows-2 md:grid-cols-2 gap-5'>
            <div className='flex flex-col mt-2 relative'>
              <label className='text-black mb-1 font-normal'>Search Mobile Number<span className='text-red-400'>*</span></label>
              <input
                type='text'
                className='border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                placeholder='Enter Here'
              />
              <div className="absolute flex items-center justify-center pointer-events-none 
                    right-[0%] rounded-r-lg top-[68%] -translate-y-1/2
                    w-10 h-[62%]
                    bg-[#023453]
                    sm:right-0
                    sm:top-[68%]
                    sm:rounded-r-lg
                    md:right-[-20%]
                    md:rounded-lg
                    lg:rounded-lg
                    lg:right-[-10%]">
                  <Search size={20} className="text-white" />
                </div>
            </div>
            <div className='lg:flex lg:flex-col lg:mt-2 md:flex md:flex-col md:mt-2 hidden'></div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Customer Name</label>
              <input
                disabled
                type='text'
                className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                placeholder='Customer Name'
              />
            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Address</label>
              <input
                disabled
                type='text'
                className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                placeholder='Customer Address'
              />
            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>City</label>
              <input
                disabled
                type='text'
                className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                placeholder='Customer City'
              />
            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Pincode</label>
              <input
                disabled
                type='text'
                className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                placeholder='Pincode'
              />
            </div>
          </div>
          <h2 className='text-1xl font-bold mb-4 mt-4'>Scheme Account Details</h2>
          <div className='grid grid-rows-1 md:grid-cols-2 gap-5'>
          <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Account Type</label>
              <input type='text' className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' placeholder='Account Type' disabled/>
            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Scheme</label>
              <input type='text' className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' placeholder='Scheme' disabled/>
            </div>
          </div>
          <h2 className='text-1xl font-bold mb-4 mt-4'>Close Form Details</h2>
          <div className='grid grid-rows-2 md:grid-cols-2 gap-5'>
          <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Bill No</label>
              <input type='text' className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' placeholder='Bill No' disabled/>
            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Paid Installment</label>
              <input type='text' className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' placeholder='Paid Installment' disabled/>
            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Paid Amount</label>
              <div className="relative">
                <input type='number' min='0' onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                    e.preventDefault();
                  }
                }} className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' placeholder='Enter Product Price' />
                <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-[#023453] w-14 h-[43px] justify-center items-center flex rounded-r-md">INR</span>
              </div>
            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Gift Amount<span className='text-red-400'>*</span></label>
              <div className="relative">
                <input type='number' min='0' onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                    e.preventDefault();
                  }
                }} className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' placeholder='Enter Product Price' />
                <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-[#023453] w-14 h-[43px] justify-center items-center flex rounded-r-md">INR</span>
              </div>
            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Total Close Amount<span className='text-red-400'>*</span></label>
              <div className="relative">
                <input type='number' min='0' onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                    e.preventDefault();
                  }
                }} className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' placeholder='Enter Product Price' />
                <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-[#023453] w-14 h-[43px] justify-center items-center flex rounded-r-md">INR</span>
              </div>
            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Remarks</label>
              <div className="relative">
                <input disabled type='text' className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' placeholder='Remarks' />
              </div>
            </div>
          </div>
        </div>
          <div className='bg-white p-2 border-t-2 border-gray-300 mt-4'>
        <div className='flex justify-end gap-2 mt-3'>
          <button
            className='bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20'
            type='button'
            onClick={handleCancle}
          >
            Cancel
          </button>
          <button
            className='bg-[#61A375] text-white rounded-md p-2 w-full lg:w-20'
            type='button'
          >
            Submit
          </button>
        </div>
      </div>
      </div>
    </>
  )
}

export default AddRvertAccount;