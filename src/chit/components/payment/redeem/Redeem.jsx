import React from 'react'
import Table from '../../common/Table'
import { Search } from 'lucide-react'

const Redeem = () => {
  
  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-[#023453] font-bold">Redeem</h2> 
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
        <div className="relative w-full lg:w-1/3 min-w-[200px]">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="text-gray-500" />
          </div>
          <input 
            placeholder="Search..."
            className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
          />
        </div>
      </div>

      <div className="mt-4">
        <Table />
      </div>
    </div>
  )
}

export default Redeem