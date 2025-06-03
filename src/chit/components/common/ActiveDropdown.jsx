import React, { useState } from 'react'

function ActiveDropdown({setActiveFilter}) {

  const [selectedValue, setSelectedValue] = useState("")
    
  const handleSelect = (value) => {
    setSelectedValue(value)

    if(value === "active"){
      setActiveFilter(true)
    }else if(value === "inactive"){
      setActiveFilter(false)
    }else{
      setActiveFilter(null)
    }
  }

  return (
    <>
        <div className="relative sm:w-[175px]">
                <select
                  className={`appearance-none h-[36px] border-2 border-[#F2F2F9] rounded-[8px]  w-full bg-white pl-2  text-gray-700 `}
                  value={selectedValue}
                  onChange={(e) => handleSelect(e.target.value)}
                >
                  <option value="">Active/Inactive</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <svg
                            className="h-4 w-4 text-gray-400"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                            stroke="black"
                          >
                            <path d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
              </div>
    </>
  )
}

export default ActiveDropdown