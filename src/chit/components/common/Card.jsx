import React from 'react'
import { useSelector } from 'react-redux';
import gold from "../../../assets/Gold 22.svg";
import gold22 from "../../../assets/Vector.svg"
import gold18 from "../../../assets/gold.svg"
import silver from "../../../assets/SilverImg.svg";
import platinum from "../../../assets/Platinum.svg";
import diamond from "../../../assets/Dimond 1.svg";


function Card({metalRate}) {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  return (
    <div className='my-3 py-3 bg-[#f5f5f5] shadow-lg'>
         {/* Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 px-2">
              {/* Gold Rate */}
              <div className="p-4 rounded-lg bg-[#E8B9233D] border border-gray-200">
                <img src={gold22} alt="Gold (22CT)" className="h-20 w-20 mx-auto mb-2" />
                <h3 className="text-2xl font-medium text-center mb-1">{metalRate?.goldrate_22ct?.$numberDecimal}</h3>
                <p className="text-sm text-center text-gray-600">Gold (22CT)</p>
                {/* <p className="text-xs text-blue-500 text-center mt-1">+5% from yesterday</p> */}
              </div>

              {/* Platinum Rate */}
              <div className="p-4 rounded-lg bg-[#fafbfa] border border-gray-200">
                <img src={platinum} alt="Platinum" className="h-20 w-20 mx-auto mb-2" />
                <h3 className="text-2xl font-medium text-center mb-1">{metalRate?.goldrate_22ct?.$numberDecimal}</h3>
                <p className="text-sm text-center text-gray-600">Platinum</p>
                {/* <p className="text-xs text-blue-500 text-center mt-1">+5% from yesterday</p> */}
              </div>

              {/* Gold Rate */}
              <div className="p-4 rounded-lg bg-[#E8B9233D] border border-gray-200">
                <img src={gold} alt="Gold (20CT)" className="h-20 w-20 mx-auto mb-2" />
                <h3 className="text-2xl font-medium text-center mb-1">{metalRate?.goldrate_20ct?.$numberDecimal}</h3>
                <p className="text-sm text-center text-gray-600">Gold (20CT)</p>
                {/* <p className="text-xs text-blue-500 text-center mt-1">+5% from yesterday</p> */}
              </div>


              {/* Silver Rate */}
              <div className="p-4 rounded-lg bg-[#fafbfa] border border-gray-200">
                <img src={silver} alt="Silver" className="h-20 w-20 mx-auto mb-2" />
                <h3 className="text-xl font-medium text-center mb-1"> {metalRate?.silverrate_1gm?.$numberDecimal}</h3>
                <p className="text-sm text-center text-gray-600">Silver</p>
                {/* <p className="text-xs text-blue-500 text-center mt-1">+5% from yesterday</p> */}
              </div>

              {/* Gold Rate */}
              <div className="p-4 rounded-lg bg-[#E8B9233D] border border-gray-200">
                <img src={gold18} alt="Gold (22CT)" className="h-20 w-20 mx-auto mb-2" />
                <h3 className="text-2xl font-medium text-center mb-1">{metalRate?.goldrate_22ct?.$numberDecimal}</h3>
                <p className="text-sm text-center text-gray-600">Gold COIN</p>
                {/* <p className="text-xs text-blue-500 text-center mt-1">+5% from yesterday</p> */}
              </div>


              {/* Diamond Rate */}
              <div className="p-4 rounded-lg bg-[#fafbfa] border border-gray-200">
                <img src={diamond} alt="Diamond" className="h-20 w-20 mx-auto mb-2" />
                <h3 className="text-xl font-medium text-center mb-1"> {metalRate?.silverrate_1gm?.$numberDecimal}</h3>
                <p className="text-sm text-center text-gray-600">Diamond</p>
                {/* <p className="text-xs text-blue-500 text-center mt-1">+5% from yesterday</p> */}
              </div>

            </div>
          </div>
  )
}

export default Card