import React, { useEffect, useState } from 'react';
import Table from '../../components/common/Table';
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExportDropdown from '../../components/common/Dropdown/Export';
import { ExportToExcel } from '../common/Dropdown/Excelexport';
import { ExportToPDF } from '../common/Dropdown/ExportPdf';
import {
   getallbranch, getallschemetypes,allbranchclassification 
} from "../../../chit/api/Endpoints";
import {SetaccExp ,SetOutreport} from "../../../redux/clientFormSlice"
import {getOutstandingSummaryReport} from "../../api/Endpoints"
import {toast} from "react-toastify"
import { SlidersHorizontal, Search, X } from 'lucide-react'
import { CalendarDays, RefreshCcw} from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';

export default function OutStandingReport() {

    // OutStandingWeight
    const [outreport, setoutreport] = useState([])  

    const [accExp, setaccExp] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

     const [totalPages, setTotalPages] = useState(0);
     const [search,setSearch] = useState("")
     const [from_date, setFromdate] = useState('');
     const [to_date, setTodate] = useState('');
     const [filters, setFilters] = React.useState({
        from_date: null,
        to_date: null,
        limit: itemsPerPage,
        id_classification: '',
        id_scheme: '',
        id_branch: '',
    });



    return (
        <div className="flex flex-col p-4">
            <h2 className="text-2xl text-gray-900 font-bold">Outstanding Summary Report</h2>

            <OutStandingFilter
               
               
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                setCurrentPage={setCurrentPage}
             
                setItemsPerPage={setItemsPerPage}
              
                totalPages={totalPages}
                />

            <OutstandingTable

                currentPage={currentPage}
                itemsPerPage={itemsPerPage} 
                setCurrentPage={setCurrentPage}
                setItemsPerPage={setItemsPerPage}
                
            
                />
        </div>
    )
}

export const OutstandingTable = ({itemsPerPage, currentPage,setItemsPerPage,setCurrentPage }) => {

   
    const layout_color = useSelector((state) => state.clientForm.layoutColor);
    const outreport = useSelector((state) => state.clientForm.outreport);
    let dispatch = useDispatch();


    const [isLoading,setisLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(0);
    const [search,setSearch] = useState("")


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;


    useEffect(() => {

        getOutstandingReport();
    
    }, [])

      //mutation to get scheme type
      const { mutate: getOutstandingReport } = useMutation({
        mutationFn: 
            getOutstandingSummaryReport,
        onSuccess: (response) => {
          
            dispatch(SetOutreport((response.data)))
            let arrayData = [];

            if (response.data.length !== 0) {

                for (const i in response.data) {
                    arrayData.push({
                        scheme_name: response.data[i].scheme_name,
                        code: response.data[i].scheme_name,
                        open: response.data[i].scheme_name,
                        close: response.data[i].scheme_name,
                        complete: response.data[i].scheme_name,
                        total: response.data[i].scheme_name
                    });
                }

            }
            dispatch(SetaccExp(arrayData))
            setisLoading(false)
        },
        onError: (error) => {
            console.error('Error:', error);
            setisLoading(false)
        }
    });


    const currentItems = outreport?.slice(indexOfFirstItem, indexOfLastItem);
    

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (items) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    const paginationButtons = [];
    for (let i = 1; i <= totalPages; i++) {
        paginationButtons.push(
            <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`p-2 w-10 h-10 rounded-md  ${currentPage === i ? ' text-white' : 'text-slate-400'}`}
                style={{ backgroundColor: layout_color }} >
                {i}
            </button>
        );
    }

    const columns = [
        {
            header: 'S.No',
            cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
        },
        {
            header: 'Scheme',
            cell: (row) => row?.scheme_name,
        },
        {
            header: "Code",
            cell: (row) => row?.code,
        },
        {
            header: "Total Open",
            cell: (row) => row?.total_open
        },
        {
            header: "Complete",
            cell: (row) => row?.total_complete
        },
        {
            header: "Total Close",
            cell: (row) => row?.total_close
        },
        {
            header: "Total Refund",
            cell: (row) => row?.total_refund
        },
        {
            header: "Total partaiclose",
            cell: (row) => row?.total_partaiclose
        },
        {
            header: "Total PartialPreclose",
            cell: (row) => row?.total_partaipreclose
        },
        {
            header: "Total PaidAccount",
            cell: (row) => row?.total_paidaccount
        },
        {
            header: "Total UnPaidAccount",
            cell: (row) => row?.total_unpaidaccount
        },
        {
            header: "Total Account",
            cell: (row) => row?.total_account
        },


    ];


    return <>
        {/* Table  */}
        <div className="mt-4">
            <Table data={outreport} columns={columns} isLoading={isLoading} height="250px"/>
        </div>

        <div className="flex justify-between mt-4 p-2">
            <div className="flex flex-row items-center justify-center gap-2">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        readOnly={currentPage === 1}
                        className="p-2  text-gray-500 rounded-md"
                    >
                        Previous
                    </button>
                </div>

                <div className="flex flex-row items-center justify-center gap-2">
                    {paginationButtons}
                </div>
                <div className="flex items-center">
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        readOnly={currentPage === totalPages}
                        className="p-2 text-gray-500 rounded-md"
                    >
                        Next
                    </button>
                </div>
            </div>
            <div className="mt-4 flex gap-2 justify-center items-center">
                <span className="text-gray-500">Show</span>
                <select name="dataTable_length" aria-controls="dataTable" className="">
                    <option value="10">10</option><option value="25">25</option>
                    <option value="50">50</option><option value="100">100</option><option value="250">250</option><option value="500">500</option><option value="1000">1,000</option></select>
                <span className="text-gray-500">entries</span>
            </div>
        </div>
    </>
}

export const OutStandingFilter = ({ getOutstandingReport, itemsPerPage, currentPage }) => {



    const roledata = useSelector((state) => state.clientForm.roledata);
    const layout_color = useSelector((state) => state.clientForm.layoutColor);
    const accExp = useSelector((state)=>state.clientForm.accExp);
    const outreport = useSelector((state) => state.clientForm.outreport);


    const id_role = roledata?.id_role?.id_role;
    const id_client = roledata?.id_client;
    const id_branch = roledata?.branch;



    const [isFilterOpen, setIsFilterOpen] = React.useState(false);
    const [branchList, setBranchList] = useState([]);
    const [schemeTypeData, setSchemeTypeData] = useState([]);
    const [classificationData, setClassification] = useState([])
    const [search,setSearch] = useState("")


    const [from_date, setFromdate] = useState('');
    const [to_date, setTodate] = useState('');
    const [filters, setFilters] = React.useState({
        from_date: "",
        to_date: "",
        limit: itemsPerPage,
        id_classification: '',
        id_scheme: '',
        id_branch: '',
    });

   
     useEffect(() => {
       if (id_branch === '0') {
        getBranchList();
       } 
   
       if (id_branch !== '0') {
         setFilters({ ...filters, id_branch: id_branch })
       }
   
     }, [id_branch]);

    useEffect(() => {
        if (isFilterOpen === true) {
            getBranchList();
            getAllSchemeTypes()
            allclassification({ id: id_branch })
        }

    }, [isFilterOpen])


    useEffect(() => {

        const filterTosend = {
            page: currentPage,
            from_date: from_date,
            to_date: to_date,
            limit: itemsPerPage,
            search: search,
            added_by: filters.added_by,
            scheme_status: filters.scheme_status,
            id_classification: filters.id_classification,
            collectionuserid: filters.collectionuserid,
            id_scheme: filters.id_scheme,
            id_branch: filters.id_branch,
            scheme_type: filters.scheme_type
        };

        if(isFilterOpen === true){
            getOutstandingReport(filterTosend)
        }
    }, [currentPage, itemsPerPage])

    const handleSearch = (e) => {
        
        setSearch(e.target.value)
      }

     useEffect(() => {
        
        const filterTosend = {
            page: currentPage,
            from_date: from_date,
            to_date: to_date,
            limit: itemsPerPage,
            search: search,
            added_by: filters.added_by,
            scheme_status: filters.scheme_status,
            id_classification: filters.id_classification,
            collectionuserid: filters.collectionuserid,
            id_scheme: filters.id_scheme,
            id_branch: filters.id_branch,
            scheme_type: filters.scheme_type
        };

        if(search !== ""){
            getOutstandingReport(filterTosend)
        }
      
      }, [search]);


    const { mutate: getBranchList } = useMutation({
        mutationFn: getallbranch,
        onSuccess: (response) => {
            setBranchList(response.data);
        },
        onError: (error) => {
            console.error("Error fetching countries:", error);
        },
    });

    const { mutate: allclassification } = useMutation({
        mutationFn: allbranchclassification,
        onSuccess: (response) => {
            setClassification(response.data);
        },
        onError: (error) => {
            console.error("Error fetching branches:", error);
        },
    });


    const { mutate: getAllSchemeTypes } = useMutation({
        mutationFn: getallschemetypes,
        onSuccess: (response) => {
            setSchemeTypeData(response.data);
        },
        onError: (error) => {
            console.error("Error fetching scheme types:", error);
        },
    });

    const filterInputchange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        if (name === 'id_branch') {
            allclassification({ id_branch: value });
        }

    };


    const applyfilterdatatable = (e) => {

        e.preventDefault();
        const filterTosend = {
            page: currentPage,
            from_date: from_date,
            to_date: to_date,
            limit: itemsPerPage,
            search: search,
            added_by: filters.added_by,
            scheme_status: filters.scheme_status,
            id_classification: filters.id_classification,
            collectionuserid: filters.collectionuserid,
            id_scheme: filters.id_scheme,
            id_branch: filters.id_branch,
            scheme_type: filters.scheme_type
        };

            getproductData(filterTosend);
            setIsFilterOpen(false)
            setFromdate("")
            setTodate("")
            setFilters({
        from_date: "",
        to_date: "",
        limit: itemsPerPage,
        id_classification: '',
        id_scheme: '',
        id_branch: '',
            })
        
    };



    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (date) => {
        setFilters(prev => ({
            ...prev,
            dateRange: date
        }));
    };

    const handleReset = (e) => {
        setFromdate("");
        setTodate("");
        setFilters({
            from_date: "",
            to_date: "",
            limit: itemsPerPage,
            id_classification: '',
            id_scheme: '',
            id_branch: '',
                })
        toast.success("Filter is cleared");
     
        getOutstandingReport({
            from_date: "",
            to_date: "",
            limit: itemsPerPage,
            id_classification: '',
            id_scheme: '',
            id_branch: '',
                });
      }


    
    return <>
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
            <div className="relative w-full lg:w-1/3 min-w-[200px]">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Search className="text-gray-500" />
                </div>
                <input
                    placeholder="Search..."
                    className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
                    onChange={(e)=>handleSearch(e)}
                />
            </div>

            <div className="flex flex-row items-center justify-end gap-2">
                <button
                    id="filter"
                    className="text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
                    onClick={() => setIsFilterOpen(true)}
                    style={{ backgroundColor: layout_color }}>
                    <SlidersHorizontal size={20} />
                </button>

                <button
            id="filter"
            className="text-white bg-[#023453] w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
            onClick={() => handleReset()}
          >
            <RefreshCcw size={20} />
          </button>
              
                <ExportToExcel apiData={outreport} fileName="Account Summary Report" />
                <ExportToPDF apiData={accExp} fileName="Account Summary Report" />

            </div>
            <div
                className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 
        ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-3">
                        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                        <button
                            onClick={() => setIsFilterOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >

                            <X size={20} />
                        </button>
                    </div>
                    {/* Filter Form  */}
                    <div className="p-3 space-y-4 flex-1 overflow-y-auto">
                        <div className="flex flex-col border-t"></div>
                        {/* Date Range Filter */}
                        <div className="space-y-2">
                            <label className='text-gray-700 text-sm font-medium'>From Date<span className='text-red-400'>*</span></label>
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

                        <div className="space-y-2">
                            <label className='text-gray-700 text-sm font-medium'>To Date<span className='text-red-400'>*</span></label>
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

                        {/* Branch Filter */}
                        <div className="space-y-2">
                            {id_branch === "0" && (
                                <div className="flex flex-col">
                                    <label className="text-black mb-1 font-medium">
                                        Branch<span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="id_branch"
                                            className="appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
                                            defaultValue=""
                                            onChange={filterInputchange}
                                            value={filters.id_branch}
                                        >
                                            <option value="" readOnly className="text-gray-700">
                                                --Select--
                                            </option>
                                            {branchList.map((branch) => (
                                                <option
                                                    className="text-gray-700"
                                                    key={branch._id}
                                                    value={branch._id}
                                                >
                                                    {branch.branch_name}
                                                </option>
                                            ))}
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

                                </div>
                            )}
                        </div>

                        {/* Scheme Type Filter */}
                        <div className="space-y-2">
                            <div className="flex flex-col">
                                <label className="text-gray-700 mb-2 font-medium">
                                    Scheme Classification<span className="text-red-400"> *</span>
                                </label>
                                <select
                                    value={filters.id_classification}
                                    name="id_classification"
                                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                    defaultValue=""
                                    onChange={filterInputchange}
                                >
                                    <option value="" readOnly>
                                        --Select--
                                    </option>
                                    {classificationData.map((classification) => (
                                        <option
                                            className="text-gray-700"
                                            key={classification._id}
                                            value={classification._id}
                                        >
                                            {classification.classification_name}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>

                        {/* Scheme Name Filter */}
                        <div className="space-y-2">
                            <div className="flex flex-col">
                                <label className="text-black mb-1 font-medium">
                                    Scheme Type<span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        name="scheme_type"
                                        className="appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
                                        defaultValue=""
                                        onChange={filterInputchange}
                                        value={filters.scheme_type}
                                    >
                                        <option value="" readOnly className="text-gray-700">
                                            --Select--
                                        </option>
                                        {schemeTypeData.map((type) => (
                                            <option key={type._id} value={type.scheme_type}>
                                                {type.scheme_typename}
                                            </option>
                                        ))}
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

                            </div>
                        </div>





                        {/* Apply Button */}
                        <div className="p-4 borde">
                            <div className="bg-yellow-300 flex justify-center gap-3">
                                <button
                                    onClick={applyfilterdatatable}
                                    className="flex-1 px-4 py-2 bg-[#61A375] text-white rounded-md"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isFilterOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsFilterOpen(false)}
                />
            )}
        </div>
    </>
}

