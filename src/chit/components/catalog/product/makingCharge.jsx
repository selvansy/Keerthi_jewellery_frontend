import React, { useState } from 'react';
import {  useSelector } from "react-redux";
const FormSection = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-gray-800 pb-2 border-b-2  mb-4">
      {title}
    </h2>
    {children}
  </div>
);

const InputGroup = ({ 
  label, 
  type = 'number', 
  id, 
  value, 
  onChange, 
  symbol = '', 
  required = false,
  placeholder = '',
  symbolColor = 'bg-black'
}) => {
      const layout_color = useSelector((state) => state.clientForm.layoutColor);
    return(
  <div className="flex flex-col mt-2">
    <label className="text-gray-700 mb-2 font-medium">
      {label}{required && <span className="text-red-400">*</span>}
    </label>
    <div className="relative">
      <input
        name={id}
        type={type}
        value={value}
        className="border-2 border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        placeholder={placeholder || `Enter ${label}`}
        onChange={onChange}
        onWheel={(e) => e.target.blur()}
      />
      {symbol && (
        <span
          className={`absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md `}
          style={{ backgroundColor: layout_color }}
        >
          {symbol}
        </span>
      )}
    </div>
  </div>
)};

const DropdownSelect = ({ 
  label, 
  id, 
  options, 
  value, 
  onChange, 
  required = false,
  className = '' 
}) => (
  <div className={`flex flex-col mt-2 ${className}`}>
    <label className="text-gray-700 mb-2 font-medium">
      {label}{required && <span className="text-red-400">*</span>}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const ChargesSection = ({ 
  section, 
  formData, 
  handleChange 
}) => {
  const isWeight = formData[`mode${section}`] === 'weight';
  const isPerGram = formData[`calculationType${section}`] === 'per-gram';

  return (
    <>
      <div className="grid md:grid-cols-3 gap-4">
        <DropdownSelect
          label="Mode"
          id={`mode${section}`}
          value={formData[`mode${section}`]}
          onChange={handleChange(section, 'mode')}
          options={[
            { value: 'payment', label: 'Payment' },
            { value: 'weight', label: 'Weight' }
          ]}
        />
       
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <InputGroup
          label="Actual Value"
          id={`actualValue${section}`}
          value={formData[`actualValue${section}`]}
          onChange={handleChange(section, 'actualValue')}
          symbol={isWeight ? 'gms' : '₹'}
          placeholder={`Enter ${isWeight ? 'Weight' : 'Amount'}`}
          required
        />
        <InputGroup
          label="Discounted Value"
          id={`discountedValue${section}`}
          value={formData[`discountedValue${section}`]}
          onChange={handleChange(section, 'discountedValue')}
          symbol={isWeight ? 'gms' : '₹'}
          placeholder={`Enter Discounted ${isWeight ? 'Weight' : 'Amount'}`}
          required
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <InputGroup
          label="Discounted Percentage"
          id={`discountedPercentage${section}`}
          value={formData[`discountedPercentage${section}`]}
          onChange={handleChange(section, 'discountedPercentage')}
          symbol="%"
          placeholder="Enter Discount %"
          required
        />
        <div className="flex items-center space-x-2 mt-8">
          <input
            type="checkbox"
            id={`discountView${section}`}
            checked={formData[`discountView${section}`]}
            onChange={handleChange(section, 'discountView')}
            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
          />
          <label 
            htmlFor={`discountView${section}`} 
            className="text-sm font-medium text-gray-700"
          >
            Discount View
          </label>
        </div>
      </div>
    </>
  );
};

const MakingChargesForm = () => {
  const [formData, setFormData] = useState({
    // Making Charges
    mode1: 'payment',
 
    actualValue1: '',
    discountedValue1: '',
    discountedPercentage1: '',
    discountView1: false,
    
    // Wastage Charges
    mode2: 'payment',

    actualValue2: '',
    discountedValue2: '',
    discountedPercentage2: '',
    discountView2: false,
    
    // Additional Views
    mcView: false,
    wastageView: false
  });

  const handleChange = (section, field) => (e) => {
    const value = e.target.type === 'checkbox' 
      ? e.target.checked 
      : e.target.value;
    
    setFormData(prev => ({
      ...prev,
      [`${field}${section}`]: value
    }));

    // Additional validation and calculation logic can be added here
    if (field === 'mode' && value === 'payment') {
      // Reset calculation type and value when switching to payment
      setFormData(prev => ({
        ...prev,
        [`calculationType${section}`]: 'flat',
        [`value${section}`]: 'gross-weight'
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add form submission logic
  };

  return (
    <div className="  flex items-center justify-center">
      <form 
        onSubmit={handleSubmit} 
        className="w-full  p-1"
      >
        <FormSection title="Making Charges">
          <ChargesSection 
            section={1} 
            formData={formData} 
            handleChange={handleChange} 
          />
        </FormSection>

        <FormSection title="Wastage Charges">
          <ChargesSection 
            section={2} 
            formData={formData} 
            handleChange={handleChange} 
          />
        </FormSection>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="mcView"
              checked={formData.mcView}
              onChange={handleChange('', 'mcView')}
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label 
              htmlFor="mcView" 
              className="text-sm font-medium text-gray-700"
            >
              MC View
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="wastageView"
              checked={formData.wastageView}
              onChange={handleChange('', 'wastageView')}
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label 
              htmlFor="wastageView" 
              className="text-sm font-medium text-gray-700"
            >
              Wastage View
            </label>
          </div>
        </div>

      </form>
    </div>
  );
};

export default MakingChargesForm;