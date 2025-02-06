import React from 'react'

function Card() {
  return (
    <div className='my-3 py-3'>
         {/* Cards Section */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 shadow-lg">
          {/* Card */}
          <div className="flex flex-row items-center justify-between bg-white rounded-lg p-6 shadow-md">
            <div className="flex flex-col">
              <h5 className="text-[#67748E] text-sm">Total Customer</h5>
              <h5 className="text-2xl font-semibold">2,300</h5>
            </div>
            <div className="flex items-center justify-center bg-[#023453] p-3 rounded-md">
              {/* <img src={customer} alt="customer" className="w-6 h-6" /> */}
            </div>
          </div>
          {/* Repeat Cards */}
          <div className="flex flex-row items-center justify-between bg-white rounded-lg p-6 shadow-md">
            <div className="flex flex-col">
              <h5 className="text-[#67748E] text-sm">Total Account</h5>
              <h5 className="text-2xl font-semibold">1,245</h5>
            </div>
            <div className="flex items-center justify-center bg-[#023453] p-3 rounded-md">
              {/* <img src={account} alt="account" className="w-6 h-6" /> */}
            </div>
          </div>
          <div className="flex flex-row items-center justify-between bg-white rounded-lg p-6 shadow-md">
            <div className="flex flex-col">
              <h5 className="text-[#67748E] text-sm">Total Account</h5>
              <h5 className="text-2xl font-semibold">1,245</h5>
            </div>
            <div className="flex items-center justify-center bg-[#023453] p-3 rounded-md">
              {/* <img src={account} alt="account" className="w-6 h-6" /> */}
            </div>
          </div>
        </div>
    </div>
  )
}

export default Card