import React from 'react'
import { Breadcrumb } from '../../common/breadCumbs/breadCumbs';
import Select from "react-select";
import { customSelectStyles } from '../../Setup/purity';
import Table from '../../common/Table';
import { header } from 'framer-motion/client';
import { SquarePen } from 'lucide-react';

const Exisitingcustomer = () => {

    const data = [
  {
    sno: 1,
    schemeName: "Gold Savings Scheme",
    openAccount: "12 ",
    amountPaid: "₹24,000",
    closedAccount: "4 ",
  },
  {
    sno: 2,
    schemeName: "Platinum Plan",
    openAccount: "8 ",
    amountPaid: "₹18,000",
    closedAccount: "2 ",
  },
  {
    sno: 3,
    schemeName: "Diamond Saver",
    openAccount: "15 ",
    amountPaid: "₹35,000",
    closedAccount: "5 ",
  },
  {
    sno: 4,
    schemeName: "Monthly Deposit Plan",
    openAccount: "10 ",
    amountPaid: "₹20,000",
    closedAccount: "3 ",
  }
];


 const columns = [
  {
    header: "S.no",
    cell: (row) => row.sno,
  },
  {
    header: "Scheme Name",
    cell: (row) => row.schemeName,
  },
  {
    header: "Open Account",
    cell: (row) => row.openAccount,
  },
  {
    header: "Amount Paid",
    cell: (row) => row.amountPaid,
  },
  {
    header: "Closed Account",
    cell: (row) => row.closedAccount,
  },
];


 const profileData = [
    { label: 'Branch', value: 'Coimbatore' },
    { label: 'Mobile No', value: '+91-9789322156' },
    { label: 'Whatsapp No', value: '+91-9789322156' },
    { label: 'Gender', value: 'Male' },
    {
      label: 'Address',
      value: '',
    },
    { label: 'Pan Card', value: 'DLSPG7050M' },
    { label: 'Aadhar No', value: '3216 5478 9521' },
    { label: 'Date of Birth', value: '23-06-2000' },
    { label: 'Referral No', value: 'RF0123' },
    { label: 'Wedding Anniversary', value: '23-06-2023' },
  ];

    
  return (
    <div>
        
        <Breadcrumb
                items={[{ label: "Customer" }, { label: "Customer Overview", active: true }]}
              />
    <div className='border rounded-lg bg-white my-3 p-4'>
            <h1 className='text-black font-bold'>Customer Details</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5  mt-5'>
            <div>
                <label className='text-sm font-medium text-black' >
                    Branch <span className='text-red-600'>*</span>
                </label>
                <Select 
                styles={customSelectStyles(true)}
                placeholder="Select Branch"
                
                />

            </div>
            <div className='relative'>
                <label className='text-sm font-medium text-black'>
                    Mobile Number
                </label>
                <div className='relative'>
                <input 
                type='number'
                className='w-full border rounded-md px-3 py-2 text-gray-500'
                placeholder="Enter Mobile Number"
                
                />  
                <button
                 className=' absolute right-0 bg-[#004181] top-0 h-full w-1/3 flex items-center justify-center  text-sm text-white rounded-r-md'
                 >Search</button> 
                 </div>   
            </div>
        </div>
        </div>

        <div className='flex flex-cols lg:flex-cols-2 sm:flex-cols-2 gap-3 h-full'>
           
        <div className='border w-3/4 rounded-lg bg-white my-3 p-4 h-full'>

        <div className='flex flex-col h-full'>
              <div className="flex flex-row gap-3 justify-end">
                            <button
                              type="button"
                              className="p-2 bg-[#004181] text-white rounded-md"
                            >
                              <SquarePen
                                size={20}
                                className="text-gray-400"
                              />
                            </button>
                            </div>
            <div className='flex justify-center items-center'>
            <img
            className='w-24 h-24 border rounded-full object-cover items-center'
            />
            </div>

            <hr className='w-full mt-5'/>

            <div className='p-6'>
            {profileData.map((item) => (
                <div className="flex justify-between gap-4 py-2">
                <p className="text-sm font-semibold text-black">{item.label}:</p>
                <p className='text-sm font-semibold text-gray-400'>{item.value}</p>
                </div> 
            ))}
            </div>
            </div>

           </div> 
           <div className='border w-full rounded-lg bg-white my-3 p-5 h-full'>
             <h1 className='text-lg font-bold text-black'>Account Overview</h1>
            <div className='flex gap-5'>
               
            <div className='justify-start p-2 right-10'>
                <p className='text-lg font-medium text-black'> ₹ 5000</p>

                <p className='text-sm font-bold text-gray-600'>Amount Payable</p>
                </div>
                <hr className="w-px h-10 bg-gray-300 border-none mt-3" />
             <div className='justify-between p-2'>
                <p className='text-lg font-medium text-black'>  g</p>

                <p className='text-sm font-bold text-gray-600'>Weight Payable</p>
            </div>
              <hr className="w-px h-10 bg-gray-300 border-none mt-3" />
            <div className='justify-end p-2'>
                <p className='text-lg font-medium text-black'> 2</p>
                <p className='text-sm font-bold text-gray-600'>Active Accounts</p>
            </div>

            </div>

            <div className='mt-3'>
        <h1 className='text-md font-bold text-black'>Account History</h1>
          <div className='mt-5'> 
            <Table 
             data={data}
            columns={columns}
            isLoading={true}
            currentPage={1}
            handleItemsPerPageChange={true}
            handlePageChange={true}
            itemsPerPage={true}
            totalItems={true}
            
            />
            </div>
            </div>
        </div>
        </div>

        
        
    </div>
  )
}

export default Exisitingcustomer;