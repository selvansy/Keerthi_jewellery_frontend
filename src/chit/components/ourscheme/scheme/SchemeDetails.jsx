import React from 'react'
import { use } from 'react'
import { useNavigate } from 'react-router-dom'

const SchemeDetails = () => {
    const navigate= useNavigate()

    const handleBack= ()=>{
        navigate('/scheme')
    } 

  return (
    <>
    <div className='flex flex-row justify-between'>
        <h2 className='text-2xl text-[#023453] font-bold justify-between'>Scheme Details</h2>
        <div className='flex flex-row gap-2 justify-center'>
            <button
              className='bg-[#E2E8F0] rounded-md p-2 text-black'
              onClick={handleBack}
            >
              Back
            </button>
            <button className='text-white bg-[#61A375] w-16 h-10 text-center p-2 rounded-md'>
              Submit
            </button>
          </div>
      </div>
    <div className='w-full flex flex-col bg-white p-8 border-t-2 border-[#023453] mt-3'>
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold text-[#023453] mb-4'>Scheme Details</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col'>
            <label className='text-gray-700 mb-2 font-medium'>Scheme Name<span className='text-red-400'>*</span></label>
            <input
              type='text'
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
              placeholder='Enter Here'
            />
            <label className='text-gray-700 mb-2 mt-2 font-medium'>Scheme Classification</label>
            <select
            className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
            defaultValue=''
            >
            <option value='' disabled>--Select--</option>
            <option value='1'>scheme classification</option>
            </select>
            <label className='text-gray-700 mb-2 mt-2 font-medium'>Scheme Type</label>
            <select
            className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
            defaultValue=''
            >
            <option value='' disabled>--Select--</option>
            <option value='1'>first option</option>
            </select>
            <label className='text-gray-700 mb-2 mt-2 font-medium'>Maturity Month</label>
            <input
              type='text'
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
              placeholder='Enter Here'
            />
          </div>
          <div className='flex flex-col'>
            <label className='text-gray-700 mb-2 font-medium'>Scheme Code</label>
            <input
              type='text'
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
              placeholder='Enter scheme code'
            />
            <label className='text-gray-700 mb-2 mt-2 font-medium'>Metal Type</label>
            <select
            className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
            defaultValue=''
            >
            <option value='' disabled>--Select--</option>
            <option value='1'>first option</option>
            </select>
            <label className='text-gray-700 mb-2 mt-2 font-medium'>Installment Type</label>
            <select
            className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
            defaultValue=''
            >
            <option value='' disabled>--Select--</option>
            <option value='1'>first option</option>
            </select>
          </div>
        </div>
      </div>
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold text-[#023453] mb-4'>Payment Details</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col'>
            <label className='text-gray-700 mb-2 font-medium'>Payment Account Number</label>
            <input
              type='number'
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#023453] focus:border-transparent'
              placeholder='Enter payment amount'
            />
            <label className='text-gray-700 mb-2 mt-2 font-medium'>Installments</label>
            <select
            className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
            defaultValue=''
            >
            <option value='' disabled>--Select--</option>
            <option value='1'>first option</option>
            </select>
            <label className='text-gray-700 mb-2 font-medium'>Amounts</label>
            <input
              type='number'
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#023453] focus:border-transparent'
              placeholder='Enter payment amount'
            />
            <label className='text-gray-700 mb-2 font-medium'>Benefit Wastage</label>
            <select
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#023453] focus:border-transparent'
            >
              <option value='credit'>Credit Card</option>
              <option value='debit'>Debit Card</option>
              <option value='paypal'>PayPal</option>
              <option value='bank'>Bank Transfer</option>
            </select>
            <label className='text-gray-700 mb-2 font-medium'>Benefit Bonus</label>
            <input
              type='number'
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#023453] focus:border-transparent'
              placeholder='Enter payment amount'
            />
          </div>
          <div className='flex flex-col'>
          <label className='text-gray-700 mb-2 font-medium'>Payment Reciepient Number</label>
            <input
              type='number'
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#023453] focus:border-transparent'
              placeholder='Enter Here'
            />
            <label className='text-gray-700 mb-2 font-medium'>Buy Gst</label>
            <input
              type='number'
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#023453] focus:border-transparent'
              placeholder='Enter Here'
            />
            <label className='text-gray-700 mb-2 font-medium'>Benefit Minimum Installments</label>
            <select
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#023453] focus:border-transparent'
            >
              <option value='credit'>Credit Card</option>
              <option value='debit'>Debit Card</option>
              <option value='paypal'>PayPal</option>
              <option value='bank'>Bank Transfer</option>
            </select>
            <label className='text-gray-700 mb-2 font-medium'>Benefit Making Charges</label>
            <select
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#023453] focus:border-transparent'
            >
              <option value='credit'>Credit Card</option>
              <option value='debit'>Debit Card</option>
              <option value='paypal'>PayPal</option>
              <option value='bank'>Bank Transfer</option>
            </select>
          </div>
        </div>
      </div>
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold text-[#023453] mb-4'>Advanced Settings</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col'>
          <label className='text-gray-700 mb-2 font-medium'>Monthly Limit Installment</label>
            <input
              type='number'
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#023453] focus:border-transparent'
              placeholder='Enter Here'
            />
            <label className='text-gray-700 mb-2 font-medium'>Scheme Customer Limit</label>
            <input
              type='number'
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#023453] focus:border-transparent'
              placeholder='Enter Here'
            />
            <label className='text-gray-700 mb-2 font-medium'>Gift Percentage</label>
            <input
              type='number'
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#023453] focus:border-transparent'
              placeholder='Enter Here'
            />
            <label className='text-gray-700 mb-2 font-medium'>Reward Amount</label>
            <input
              type='number'
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#023453] focus:border-transparent'
              placeholder='Enter Here'
            />
            <label className='text-gray-700 mb-2 font-medium'>Convenience Fees</label>
            <input
              type='number'
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#023453] focus:border-transparent'
              placeholder='Enter Here'
            />
             <label className='text-gray-700 mb-2 font-medium'>Display Referal</label>
            <button>yes/No</button>
          </div>
          <div className='flex flex-col'>
            <label className='text-gray-700 mb-2 font-medium'>Pending Due Limit Installment</label>
            <input
              type='date'
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#023453] focus:border-transparent'
            />
            <label className='text-gray-700 mb-2 font-medium'>No.of Gifts</label>
            <input
              type='date'
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#023453] focus:border-transparent'
            />
            <label className='text-gray-700 mb-2 font-medium'>Referral Amount</label>
            <input
              type='date'
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#023453] focus:border-transparent'
            />
            <label className='text-gray-700 mb-2 font-medium'>Not paid Limit Installment</label>
            <input
              type='date'
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#023453] focus:border-transparent'
            />
            <label className='text-gray-700 mb-2 font-medium'>Fine Amount</label>
            <input
              type='date'
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#023453] focus:border-transparent'
            />
            <label className='text-gray-700 mb-2 font-medium'>Buy GST %</label>
            <input
              type='date'
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#023453] focus:border-transparent'
            />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default SchemeDetails