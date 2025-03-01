import React, { useCallback } from 'react';
import { CalendarDays,X} from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FilterForm = ({
  isFilterOpen,
  setIsFilterOpen,
  from_date,
  setFromdate,
  to_date,
  setTodate,
  branchList,
  filters,
  filterInputchange,
  classificationData,
  metalData,
  purityData,
  installmentTypeData,
  schemeTypeData,
  gstTypeData,
  wastageType,
  fundtype,
  applyfilterdatatable,
}) => {
  const handleCloseFilter = useCallback(() => setIsFilterOpen(false), [setIsFilterOpen]);

  return (
    <div
      className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 
                  ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-3">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <button onClick={handleCloseFilter} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form className="overflow-y-auto scrollbar-hide" onSubmit={applyfilterdatatable}>
          <div className="p-3 space-y-4 flex-1 overflow-y-auto filterscroll">
            <div className="flex flex-col border-t"></div>

            {/* From Date */}
            <div className="space-y-2">
              <label className="text-gray-700 text-sm font-medium">From Date<span className="text-red-400">*</span></label>
              <div className="relative">
                <DatePicker
                  selected={from_date}
                  onChange={(date) => setFromdate(date)}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select Date"
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  wrapperClassName="w-full"
                />
                <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-14 h-[43px] justify-center items-center flex rounded-r-md pointer-events-none">
                  <CalendarDays size={20} />
                </span>
              </div>
            </div>

            {/* To Date */}
            <div className="space-y-2">
              <label className="text-gray-700 text-sm font-medium">To Date<span className="text-red-400">*</span></label>
              <div className="relative">
                <DatePicker
                  selected={to_date}
                  onChange={(date) => setTodate(date)}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select Date"
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  wrapperClassName="w-full"
                />
                <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-14 h-[43px] justify-center items-center flex rounded-r-md pointer-events-none">
                  <CalendarDays size={20} />
                </span>
              </div>
            </div>

            {/* Branch Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Branch Name</label>
              <div className="relative">
                <select
                  name="id_branch"
                  onChange={filterInputchange}
                  className="appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  defaultValue=""
                >
                  <option value="">--Select--</option>
                  {branchList.map((branch) => (
                    <option key={branch._id} value={branch._id}>{branch.branch_name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Scheme Classification */}
            <div className="space-y-2">
              <div className="flex flex-col">
                <label className="text-gray-700 mb-2 font-medium">Scheme Classification<span className="text-red-400"> *</span></label>
                <select
                  value={filters.id_classification}
                  name="id_classification"
                  className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  onChange={filterInputchange}
                >
                  <option value="">--Select--</option>
                  {classificationData.map((classification) => (
                    <option key={classification._id} value={classification._id}>
                      {classification.classification_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Metal Type */}
            <div className="space-y-2">
              <div className="flex flex-col">
                <label className="text-black mb-1 font-medium">Metal Type<span className="text-red-400">*</span></label>
                <div className="relative">
                  <select
                    name="id_metal"
                    className="appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
                    onChange={filterInputchange}
                    value={filters.id_metal}
                  >
                    <option value="">--Select--</option>
                    {metalData.map((metal) => (
                      <option key={metal.id_metal} value={metal.id_metal}>
                        {metal.metal_name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Purity */}
            <div className="space-y-2">
              <div className="flex flex-col">
                <label className="text-black mb-1 font-medium">Purity<span className="text-red-400">*</span></label>
                <div className="relative">
                  <select
                    name="id_purity"
                    className={`appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700 ${!purityData || purityData.length === 0 ? "cursor-not-allowed bg-gray-100" : ""}`}
                    onChange={filterInputchange}
                    value={filters.id_purity}
                    disabled={!purityData || purityData.length === 0}
                  >
                    <option value="">--Select--</option>
                    {purityData.map((purity) => (
                      <option key={purity.id_purity} value={purity.id_purity}>
                        {purity.purity_name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Installment Type */}
            <div className="space-y-2">
              <div className="flex flex-col">
                <label className="text-black mb-1 font-medium">Installment Type<span className="text-red-400">*</span></label>
                <div className="relative">
                  <select
                    name="weekmonth"
                    className="appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
                    onChange={filterInputchange}
                    value={filters.weekmonth}
                  >
                    <option value="">--Select--</option>
                    {installmentTypeData.map((type) => (
                      <option key={type._id} value={type.installment_type}>
                        {type.installment_name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Scheme Type */}
            <div className="space-y-2">
              <div className="flex flex-col">
                <label className="text-black mb-1 font-medium">Scheme Type<span className="text-red-400">*</span></label>
                <div className="relative">
                  <select
                    name="scheme_type"
                    className="appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
                    onChange={filterInputchange}
                    value={filters.scheme_type}
                  >
                    <option value="">--Select--</option>
                    {schemeTypeData.map((type) => (
                      <option key={type.scheme_type} value={type.scheme_type}>
                        {type.scheme_typename}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Buy GST Type */}
            <div className="space-y-2">
              <div className="flex flex-col">
                <label className="text-black mb-1 font-medium">Buy GST Type<span className="text-red-400">*</span></label>
                <div className="relative">
                  <select
                    name="buytgsttype"
                    className="appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
                    onChange={filterInputchange}
                    value={filters.buytgsttype}
                  >
                    <option value="">--Select--</option>
                    {gstTypeData.map((type) => (
                      <option key={type._id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefit Wastage */}
            <div className="space-y-2">
              <div className="flex flex-col">
                <label className="text-black mb-1 font-medium">Benefit Wastage<span className="text-red-400">*</span></label>
                <div className="relative">
                  <select
                    name="wastagebenefit"
                    className="appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
                    onChange={filterInputchange}
                    value={filters.wastagebenefit}
                  >
                    <option value="">--Select--</option>
                    {wastageType.map((data) => (
                      <option key={data._id} value={data.id}>
                        {data.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Saving Type */}
            <div className="space-y-2">
              <div className="flex flex-col">
                <label className="text-black mb-1 font-medium">Saving Type<span className="text-red-400">*</span></label>
                <div className="relative">
                  <select
                    name="saving_type"
                    className="appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
                    onChange={filterInputchange}
                    value={filters.saving_type}
                  >
                    <option value="">--Select--</option>
                    {fundtype.map((type) => (
                      <option key={type._id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="p-4">
              <div className="bg-yellow-300 flex justify-center gap-3">
                <button type="submit" className="flex-1 px-4 py-2 bg-[#61A375] text-white rounded-md">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterForm;