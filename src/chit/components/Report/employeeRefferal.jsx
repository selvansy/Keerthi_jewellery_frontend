// import React, { useEffect, useState } from "react";
// import Table from "../../components/common/Table";
// import { useMutation } from "@tanstack/react-query";
// import "jspdf-autotable";
// import ExportDropdown from "../../components/common/Dropdown/Export";
// import { getEmployeeRefferal } from "../../../chit/api/Endpoints";
// import "react-datepicker/dist/react-datepicker.css";
// import { useSelector } from "react-redux";
// import { Breadcrumb } from "../common/breadCumbs/breadCumbs";
// import DateRangeSelector from "../common/calender";
// import { formatNumber } from "../../utils/commonFunction";
// import { formatDate } from "../../../utils/FormatDate";

// function EmployeeRefferal() {
//   const roleData = useSelector((state) => state.clientForm.roledata);
//   const accessBranch = roleData?.branch;
//   const id_branch = roleData?.id_branch;

//   const [isLoading, setisLoading] = useState(true);
//   const [employeeRefData, setEmployeeRefData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalCount, setTotalCount] = useState(0);
//   const [processData,setProcessData] = useState([])

//   const [from_date, setfrom_date] = useState();
//   const [to_date, setto_date] = useState();

//   useEffect(() => {
//     if (!roleData) return;
//     if (accessBranch == 0) {
//       getEmployeeData({
//         limit: itemsPerPage,
//         page: currentPage,
//         from_date,
//         to_date,
//       });
//     } else {
//       getEmployeeData({
//         limit: itemsPerPage,
//         page: currentPage,
//         id_branch,
//         from_date,
//         to_date,
//       });
//     }
//   }, [currentPage, itemsPerPage, roleData, from_date, to_date]);


//   const { mutate: getEmployeeData } = useMutation({
//     mutationFn: (data) => getEmployeeRefferal(data),
//     onSuccess: (response) => {
//       setEmployeeRefData(response.data);
//       setTotalPages(response.totalPages);
//       setTotalCount(response.totalCount);
//       setisLoading(false);
//     },
//     onError: (error) => {
//       setisLoading(false);
//       console.error("Error fetching payment data:", error);
//     },
//   });

//   useEffect(()=>{
//     const process = employeeRefData?.map((item,index)=>({
//       "S.no": index + 1,
//       "Employee ID":item?.employeeId,
//       "Employee Name":item?.employee_name,
//       "Customer Name":item?.customer_name,
//       "Customer Contact":item?.customerMobile,
//       "Referred Date":formatDate(item?.referredDate),
//       "Referral Bonus Amount":item?.totalBonus
//     }))
//     setProcessData(process)
//   },[employeeRefData])

//   const columns = [
//     {
//       header: "S.No",
//       cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
//     },
//     {
//       header: "Employee ID",
//       cell: (row) => row?.employeeId,
//     },
//     {
//       header: "Employee Name",
//       cell: (row) => row?.employee_name,
//     },
//     {
//       header: "Customer Name",
//       cell: (row) => row?.customer_name,
//     },
//     {
//       header: "Customer Contact",
//       cell: (row) => row?.customerMobile,
//     },
//     {
//       header: "Referred Date",
//       cell: (row) =>formatDate(row?.referredDate),
//     },
//     {
//       header: "Referral Bonus Amount",
//       cell: (row) => formatNumber({ value: row?.totalBonus || 0, decimalPlaces: 0 }),
//     }
//   ];

//   const handleItemsPerPageChange = (value) => {
//     setItemsPerPage(value);
//     setCurrentPage(1);
//   };

//   const handlePageChange = (page) => {
//     const pageNumber = Number(page);
//     if (
//       !pageNumber ||
//       isNaN(pageNumber) ||
//       pageNumber < 1 ||
//       pageNumber > totalPages
//     ) {
//       return;
//     }
//     setCurrentPage(pageNumber);
//   };

//   return (
//     <>
//       <Breadcrumb
//         items={[
//           { label: "Account Reports" },
//           { label: "Employee Referral", active: true },
//         ]}
//       />
//       <div className="flex flex-col p-4 bg-white border-2 border-[#F2F2F9] rounded-[16px] ">
//         <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
//           <div className="flex justify-between items-center w-full">
//             <div className="flex justify-start">
//             </div>
//             <div className="flex justify-end items-center gap-4">
//               <DateRangeSelector
//                 onChange={(range) => {
//                   setfrom_date(range.startDate);
//                   setto_date(range.endDate);
//                 }}
//               />
//               <ExportDropdown
//                 apiData={processData}
//                 fileName={`Employee Referral Report ${new Date().toLocaleDateString(
//                   "en-GB"
//                 )}`}
//               />
//             </div>
//           </div>
//         </div>
//         <div className="mt-4">
//           <Table
//             data={[]}
//             columns={columns}
//             loading={isLoading}
//             currentPage={currentPage}
//             handlePageChange={handlePageChange}
//             itemsPerPage={itemsPerPage}
//             totalItems={totalCount}
//             handleItemsPerPageChange={handleItemsPerPageChange}
//           />
//         </div>
//       </div>
//     </>
//   );
// }

// export default EmployeeRefferal;
import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { useMutation } from "@tanstack/react-query";
import "jspdf-autotable";
import ExportDropdown from "../../components/common/Dropdown/Export";
import { getEmployeeRefferal } from "../../../chit/api/Endpoints";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";
import DateRangeSelector from "../common/calender";
import { formatNumber } from "../../utils/commonFunction";
import { formatDate } from "../../../utils/FormatDate";

function EmployeeRefferal() {
  const roleData = useSelector((state) => state.clientForm.roledata);
  const accessBranch = roleData?.branch;
  const id_branch = roleData?.id_branch;

  const [isLoading, setisLoading] = useState(false); // Changed to false since we're not loading
  const [employeeRefData, setEmployeeRefData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(5); // Set default total pages
  const [totalCount, setTotalCount] = useState(50); // Set default total count
  const [processData, setProcessData] = useState([]);

  const [from_date, setfrom_date] = useState();
  const [to_date, setto_date] = useState();

  // Mock data for demonstration
  const mockData = Array.from({ length: 50 }, (_, i) => ({
    employeeId: `EMP${1000 + i}`,
    employee_name: `Employee ${i + 1}`,
    customer_name: `Customer ${i + 1}`,
    customerMobile: `9876543${String(i).padStart(2, '0')}`,
    referredDate: new Date(Date.now() - i * 86400000).toISOString(),
    totalBonus: Math.floor(Math.random() * 5000) + 1000
  }));

  useEffect(() => {
    // Instead of API call, use mock data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = mockData.slice(startIndex, endIndex);
    
    setEmployeeRefData(paginatedData);
    setTotalPages(Math.ceil(mockData.length / itemsPerPage));
    setTotalCount(mockData.length);
  }, [currentPage, itemsPerPage, from_date, to_date]);

  useEffect(() => {
    const process = employeeRefData?.map((item, index) => ({
      "S.no": index + 1 + (currentPage - 1) * itemsPerPage,
      "Employee ID": item?.employeeId,
      "Employee Name": item?.employee_name,
      "Customer Name": item?.customer_name,
      "Customer Contact": item?.customerMobile,
      "Referred Date": formatDate(item?.referredDate),
      "Referral Bonus Amount": item?.totalBonus
    }));
    setProcessData(process);
  }, [employeeRefData, currentPage, itemsPerPage]);

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Employee ID",
      cell: (row) => row?.employeeId,
    },
    {
      header: "Employee Name",
      cell: (row) => row?.employee_name,
    },
    {
      header: "Customer Name",
      cell: (row) => row?.customer_name,
    },
    {
      header: "Customer Contact",
      cell: (row) => row?.customerMobile,
    },
    {
      header: "Referred Date",
      cell: (row) => formatDate(row?.referredDate),
    },
    {
      header: "Referral Bonus Amount",
      cell: (row) => formatNumber({ value: row?.totalBonus || 0, decimalPlaces: 0 }),
    }
  ];

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    const pageNumber = Number(page);
    if (
      !pageNumber ||
      isNaN(pageNumber) ||
      pageNumber < 1 ||
      pageNumber > totalPages
    ) {
      return;
    }
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Account Reports" },
          { label: "Employee Referral", active: true },
        ]}
      />
      <div className="flex flex-col p-4 bg-white border-2 border-[#F2F2F9] rounded-[16px] ">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-start">
            </div>
            <div className="flex justify-end items-center gap-4">
              <DateRangeSelector
                onChange={(range) => {
                  setfrom_date(range.startDate);
                  setto_date(range.endDate);
                }}
              />
              <ExportDropdown
                apiData={processData}
                fileName={`Employee Referral Report ${new Date().toLocaleDateString(
                  "en-GB"
                )}`}
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Table
            data={employeeRefData} // Pass the mock data instead of empty array
            columns={columns}
            loading={isLoading}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalCount}
            handleItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </div>
    </>
  );
}

export default EmployeeRefferal;