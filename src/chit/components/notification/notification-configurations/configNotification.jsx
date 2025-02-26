import React, { useState } from 'react';

const configNotification = () => {
  const [activeTab, setActiveTab] = useState('Push Notification');
  const [selectedOptions, setSelectedOptions] = useState({
    schemeWise: ['Payment Proceed', 'Scheme Joining', 'Scheme Completion', 'Scheme Close', 'Scheme Referral', 'Wallet Amount Redeem', 'Alert Notification'],
    wishes: ['Birthday', 'Wedding Anniversary'],
    product: ['New Arrival']
  });

  const handleOptionToggle = (category, option) => {
    setSelectedOptions(prev => {
      const updatedCategory = [...prev[category]];
      
      if (updatedCategory.includes(option)) {
        return {
          ...prev,
          [category]: updatedCategory.filter(item => item !== option)
        };
      } else {
        return {
          ...prev,
          [category]: [...updatedCategory, option]
        };
      }
    });
  };

  return (
    <div className=" bg-white rounded-lg shadow p-6">
      <h1 className="text-xl font-bold mb-4">Add Configuration</h1>
      
      {/* Notification Tabs */}
      <div className="flex border-b mb-6">
        {['Push Notification', 'Sms', 'WhatsApp', 'Email'].map(tab => (
          <button
            key={tab}
            className={`py-2 px-4 ${activeTab === tab ? 'text-blue-900 border-b-2 border-blue-900 font-medium' : 'text-black'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Scheme Wise Section */}
      <div className="mb-6">
        <h2 className="text-sm font-medium mb-2">
          Scheme Wise<span className="text-red-500">*</span>
        </h2>
        <div className="grid grid-cols-5  mt-5">
          {[
            'Payment Proceed',
            'Scheme Joining',
            'Scheme Completion',
            'Scheme Close',
            'Scheme Referral',
            'Wallet Amount Redeem',
            'Alert Notification'
          ].map(option => (
            <div key={option} className="flex items-center my-5">
              <input
                type="checkbox"
                id={option.replace(/\s+/g, '')}
                checked={selectedOptions.schemeWise.includes(option)}
                onChange={() => handleOptionToggle('schemeWise', option)}
                className="w-4 h-4 text-blue-900 rounded border-gray-300 focus:ring-blue-900"
              />
              <label htmlFor={option.replace(/\s+/g, '')} className="ml-2 text-sm text-gray-700">
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Wishes Section */}
      <div className="mb-6">
        <h2 className="text-sm font-medium mb-2">
          Wishes<span className="text-red-500">*</span>
        </h2>
        <div className="flex gap-4">
          {['Birthday', 'Wedding Anniversary'].map(option => (
            <div key={option} className="flex items-center">
              <input
                type="checkbox"
                id={option.replace(/\s+/g, '')}
                checked={selectedOptions.wishes.includes(option)}
                onChange={() => handleOptionToggle('wishes', option)}
                className="w-4 h-4 text-blue-900 rounded border-gray-300 focus:ring-blue-900"
              />
              <label htmlFor={option.replace(/\s+/g, '')} className="ml-2 text-sm text-gray-700">
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Product Section */}
      <div className="mb-6">
        <h2 className="text-sm font-medium mb-2">
          Product<span className="text-red-500">*</span>
        </h2>
        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="NewArrival"
              checked={selectedOptions.product.includes('New Arrival')}
              onChange={() => handleOptionToggle('product', 'New Arrival')}
              className="w-4 h-4 text-blue-900 rounded border-gray-300 focus:ring-blue-900"
            />
            <label htmlFor="NewArrival" className="ml-2 text-sm text-gray-700">
              New Arrival
            </label>
          </div>
        </div>
      </div>
      
      {/* Buttons */}
      <div className='flex flex-row justify-end border-t-2 p-3 mt-8'>
          <div className='flex flex-row gap-6 justify-center'>
            <button
              type='button'
              className='bg-[#E2E8F0] rounded-md p-2 text-black'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='text-white bg-[#61A375] w-16 h-10 text-center p-2 rounded-md'
            >
                Submit
            </button>
          </div>
        </div>
    </div>
  );
};

export default configNotification;