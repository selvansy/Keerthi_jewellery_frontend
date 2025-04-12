import React from 'react'
import Select from "react-select";
const getStartOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };
  
  // Helper function to get end of day (23:59:59)
  const getEndOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  };
  
  const now = new Date();
  
  const options = [
    {
      label: "Today",
      value: new Date().toISOString(),
    },
    {
      label: "Last Week",
      value: new Date(new Date().setDate(now.getDate() - 7)).toISOString(),
    },
    {
      label: "This Month",
      value: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
    },
    {
      label: "This Year",
      value: new Date(now.getFullYear(), 0, 1).toISOString(),
    },
    {
      label: "Custom",
      value: "",
    },
  ];
function ModeOfPayment() {
    const tableData = [
        {
          id: 1,
          customerName: "John",
          schemeName: "Gold Plan",
          paidAmount: "1000",
          paidDate: "2025-02-28",
        },
        {
          id: 2,
          customerName: "Jane",
          schemeName: "Silver Plan",
          paidAmount: "800",
          paidDate: "2025-02-27",
        },
        {
          id: 3,
          customerName: "Michael",
          schemeName: "Diamond Plan",
          paidAmount: "1500",
          paidDate: "2025-02-26",
        },
        {
          id: 4,
          customerName: "Alice",
          schemeName: "End Weight",
          paidAmount: "1900",
          paidDate: "2025-02-26",
        },
      ];
  return (
    <div className="">
            
    <div className="bg-[#FFFFFF] pt-4  px-4 rounded-[16px]">
      <div className="flex justify-between items-center mb-[15px] ">
        <h2 className="text-[#2F1C6A] font-semibold text-xl">
          Mode of Payment
        </h2>

        <Select
          options={options}
          defaultValue={options[1]}
          className="w-[150px]"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "white",
              borderRadius: "6px",
              borderColor: "#e2e8f0",
              padding: "2px",
              cursor: "pointer",
            }),
          }}
        />
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500  my-5">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Payment Mode
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b  border-gray-200">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
              >
                Bank Transfer
              </th>
              <td className="px-6 py-4">1500</td>
            </tr>

            <tr className="bg-white border-b  border-gray-200">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
              >
                Gpay
              </th>
              <td className="px-6 py-4">1000</td>
            </tr>

            <tr className="bg-white border-b  border-gray-200">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
              >
                Credit Card
              </th>
              <td className="px-6 py-4">1000</td>
            </tr>

            <tr className="bg-white border-b  border-gray-200">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
              >
                Debit Card
              </th>
              <td className="px-6 py-4">5000</td>
            </tr>
            <tr className="bg-white   border-gray-200">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
              >
                Razor Pay
              </th>
              <td className="px-6 py-4">1200</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div>

     

    </div>
  </div>
  )
}

export default ModeOfPayment