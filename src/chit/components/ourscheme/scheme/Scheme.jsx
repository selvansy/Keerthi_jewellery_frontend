import React, { useEffect, useState } from 'react'
import Table from '../../common/Table'
import { useDebounce } from '../../../hooks/useDebounce';
import { SlidersHorizontal, Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify"
import {
  getSchemeTable, getallbranch, changeschemestatus, allbranchclassification, getallmetal, getallschemetypes, getschemeById, allinstallmenttype, allFundtype, addscheme,
  updateScheme, puritybymetal, buygsttype, wastagetype, deleteScheme
} from "../../../api/Endpoints"
import { setid } from "../../../../redux/clientFormSlice"
import { useDispatch, useSelector } from 'react-redux';
import { CalendarDays, RefreshCcw } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { eventEmitter } from '../../../../utils/EventEmitter';
import { openModal } from '../../../../redux/modalSlice';
import Modal from '../../../components/common/Modal';
import usePagination from '../../../hooks/usePagination'

const Scheme = () => { 

  let dispatch = useDispatch();
  const navigate = useNavigate()
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);

  const id_branch = roledata?.branch;

  const [isLoading, setisLoading] = useState(true)
  const [filtered, SetFiltered] = useState(false)
  const [classificationData, setClassification] = useState([])
  const [metalData, setMetalData] = useState([]);
  const [purityData, setPurityData] = useState([]);
  const [installmentTypeData, setInstallmentTypeData] = useState([]);
  const [schemeTypeData, setSchemeTypeData] = useState([]);
  const [gstTypeData, setgstTypeData] = useState([]);
  const [wastageType, setWastage] = useState([])
  let [fundtype, setFundType] = useState([]);
  const [metalid, setMetalid] = useState('')

  let [schemeData, setSchemeData] = useState([]);
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 600)

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);


  const [selectedRow, setSelectedRow] = useState(null)
  const [activeDropdown, setActiveDropdown] = useState(null)

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [from_date, setFromdate] = useState("");
  const [to_date, setTodate] = useState("");
  const [branchList, setBranchList] = useState([]);
  const [filters, setFilters] = React.useState({
    from_date: "",
    to_date: "",
    page: currentPage,
    limit: itemsPerPage,
    id_classification: "",
    id_metal: "",
    id_branch: id_branch,
    id_purity: "",
    weekmonth: "",
    scheme_type: "",
    buytgsttype: ""

  });


  

  const handlePageChange = (page) => {

    const pageNumber = Number(page);
      if (!pageNumber || isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
        return;
      }
   
      setCurrentPage(pageNumber);
    
  };


    const nextPage = () => {
      setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
    };
  
    const prevPage = () => {
      setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
    };
  

  const paginationData = {totalItems:totalPages,currentPage:currentPage,itemsPerPage:itemsPerPage,handlePageChange:handlePageChange}
  const paginationButtons = usePagination(paginationData)

  const handleReset = (e) => {

    setFromdate("");
    setTodate("");
    setFilters(prev => ({
      ...prev,

      id_classification: "",
      id_metal: "",
      id_branch: id_branch,
      id_purity: "",
      weekmonth: "",
      scheme_type: "",
      buytgsttype: ""
    }));
    SetFiltered(false)
    toast.success("Filter is cleared");
    getSchemeTable({
      from_date: "",
      to_date: "",
      page: currentPage,
      limit: itemsPerPage,
      id_classification: "",
      id_metal: "",
      id_branch: id_branch,
      id_purity: "",
      weekmonth: "",
      scheme_type: "",
      buytgsttype: ""
    })
  }

  const handleallbranch = async (e) => {

    const response = await getallbranch();
    if (response) {
      setBranchList(response.data);
    }
  };

  useEffect(() => {

    if (metalid) {
      getPurity(metalid);
    }
  }, [metalid]);

  const { mutate: allbranchclassificationmuate } = useMutation({
    mutationFn: allbranchclassification,
    onSuccess: (response) => {
      setClassification(response.data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });


  const { mutate: getAllMetals } = useMutation({
    mutationFn: getallmetal,
    onSuccess: (response) => {
      setMetalData(response.data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });



  const { mutate: getAllInstallmentTypes } = useMutation({
    mutationFn: allinstallmenttype,
    onSuccess: (response) => {

      setInstallmentTypeData(response.data);
    },
    onError: (error) => {
      console.error("Error fetching installment types:", error);
    },
  });

  const { mutate: getPurity } = useMutation({
    mutationFn: puritybymetal,
    onSuccess: (response) => {
      setPurityData(response.data);
    },
    onError: (error) => {
      console.error("Error fetching purity types:", error);
      setPurityData([]);
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

  const { mutate: getAllWastage } = useMutation({
    mutationFn: wastagetype,
    onSuccess: (response) => {
      setWastage(response.data);
    },
    onError: (error) => {
      console.error("Error fetching scheme types:", error);
    },
  });

  const { mutate: gstTypeDataTable } = useMutation({
    mutationFn: buygsttype,
    onSuccess: (response) => {
      setgstTypeData(response.data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const { mutate: getSavingType } = useMutation({
    mutationFn: allFundtype,
    onSuccess: (response) => {
      setFundType(response.data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const filterInputchange = (e) => {
    const { name, value } = e.target;


    if (name === 'id_purity' || name === 'weekmonth' || name === "scheme_type" || name === "buytgsttype" || name === "wastagebenefit") {
      setFilters({
        ...filters,
        [name]: Number(value)
      })
      return
    }
    if (name === "id_branch") {
      allbranchclassificationmuate(value);
    }
    if (name === "id_metal") {

      setMetalid(value);
      setFilters({
        ...filters,
        [name]: value,
        id_purity: ''
      });
    }

    setFilters(prev => ({ ...prev, [name]: value }));

  };

  const applyfilterdatatable = (e) => {
    e.preventDefault();
    const filterTosend = {
      from_date: from_date,
      to_date: to_date,
      search: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage,
      id_branch: filters.id_branch,
      id_classification: filters.id_classification,
      metalid: filters.metalid,
      id_purity: filters.id_purity,
      weekmonth: filters.weekmonth,
      wastagebenefit: filters.wastagebenefit,
      scheme_type: filters.scheme_type,
      buytgsttype: filters.buytgsttype

    };
    SetFiltered(true)
    getSchemeDataTable(filterTosend)
  };


  useEffect(() => {
    getSchemeDataTable({
      from_date: "",
      to_date: "",
      search: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage,
      id_branch: filters.id_branch,
      id_classification: "",
      metalid: "",
      id_purity: "",
      weekmonth: "",
      wastagebenefit: "",
      scheme_type: "",
      buytgsttype: ""

    })
  }, [currentPage, itemsPerPage, debouncedSearch])

  useEffect(() => {
    eventEmitter.on('CONFIRMATION_SUBMIT',  async(data) => {
      try {
        deleteSchemeId(data.schemeId);
      } catch (error) {
        console.error('Error:', error);
      }
    });
    return () => {
      eventEmitter.off('CONFIRMATION_SUBMIT');
    };
  }, []);



  const { mutate: getSchemeDataTable } = useMutation({
    mutationFn: (payload) => getSchemeTable(payload),
    onSuccess: (response) => {
      if (response) {
        setSchemeData(response.data);
      }
      setisLoading(false)
    },
    onError: (error) => {
      setisLoading(false)
      console.error("Error:", error);
    },
  });


  const handleCreateSchemeClick = () => {
    navigate('/scheme/addscheme')
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const handleStatusToggle = async (id) => {
    let response = await changeschemestatus(id);
    if (response) {
      toast.success(response.message);
      getSchemeTable({
        from_date: from_date,
        to_date: to_date,
        search: debouncedSearch,
        page: currentPage,
        limit: itemsPerPage,
        id_branch: filters.id_branch,
        id_classification: filters.id_classification,
        metalid: filters.metalid,
        id_purity: filters.id_purity,
        weekmonth: filters.weekmonth,
        wastagebenefit: filters.wastagebenefit,
        scheme_type: filters.scheme_type,
        buytgsttype: filters.buytgsttype

      })
    }
  };

  const handleEdit = (id) => {
    navigate(`/scheme/addscheme/${id}`)
  };


  const handleItemsPerPageChange = (value) => {

    setItemsPerPage(value);
    setCurrentPage(1);
  };

  


  const columns = [
   
    {
      header: 'S.No',
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: 'Actions',
      cell: (row, rowIndex) => (
        <div className="dropdown-container relative">
          <button
            className="p-1 hover:bg-gray-100 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRow(row?._id);
              setActiveDropdown(activeDropdown === row?._id ? null : row?._id);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>

          {activeDropdown === row?._id && (
            <div
              className="absolute"
              style={{
                top: rowIndex >= schemeData.length - 2 ? 'auto' : '72%',
                bottom: rowIndex >= schemeData.length - 2 ? '-74%' : 'auto',
                // top: 'auto',
                // bottom: '-440%',
                zIndex: 9999,
                marginBottom: '8px',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))'
              }}
            >
              <div className="w-32 rounded-md bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => {
                      handleEdit(row?._id);
                      setActiveDropdown(null);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>

                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => {
                      handleDelete(row?._id);
                      setActiveDropdown(null);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>

                </div>
              </div>
            </div>
          )}
        </div>
      ),

    },
    {
      header: 'Scheme',
      cell: (row) => {
        if (row?.scheme_type === 0 || row?.scheme_type === 1 || row?.scheme_type === 2) {
          return `${row?.scheme_name} (₹ ${row?.amount})`;
        } else if (row?.scheme_type === 3) {
          return `${row?.scheme_name} (GRM ${row?.min_weight} - ${row?.max_weight})`;
        } else {
          return `${row?.scheme_name} (₹  ${row?.min_amount} - ${row?.max_amount})`;
        }
      }
    },
    {
      header: "Code",
      cell: (row) => row?.code
    },
    {
      header: 'Metal Name',
      cell: (row) => {
        return row?.id_metal === 1 ? 'Gold' :
          row?.id_metal === 2 ? 'Silver' :
            row?.id_metal === 3 ? 'Diamond' :
              row?.id_metal === 4 ? 'Platinum' : 'Gold Coins';
      }
    },
    {
      header: "Installments",
      cell: (row) => row?.total_installments
    },
    {
      header: "Maturity Month",
      cell: (row) => row?.maturity_month
    },
    {
      header: 'Scheme Type',
      cell: (row) => {
        if (row?.scheme_type === 1) {
          return `Amount End Weight`;
        } else if (row?.scheme_type === 2) {
          return `Amount To Weight`;
        } else if (row?.scheme_type === 3) {
          return `Weight`;
        } else if (row?.scheme_type === 4) {
          return `Flexible Amount To Bonus`;
        } else if (row?.scheme_type === 5) {
          return `Flexiable Amount To Weight`;
        } else if (row?.scheme_type === 6) {
          return `Fixed Amount To Weight`;
        } else if (row?.scheme_type === 7) {
          return `Fixed Amount End Weight`;
        } else if (row?.scheme_type === 8) {
          return `Fixed Amount To Bonus`;
        } else if (row?.scheme_type === 9) {
          return `Flexible Amount End Weight`;
        } else if (row?.scheme_type === 10) {
          return `Digi Gold`;
        } else {
          return `Amount To Bonus`;
        }
      }
    },
    {
      header: "Classification",
      cell: (row) => row?.classificationDetails?.classification_name || 'N/A'
    },

    {
      header: "Create Date",
      cell: (row) => {
        const date = new Date(row?.createdAt);
        return date.toLocaleDateString('en-GB');
      }
    },
    {
      header: 'Active',
      accessor: 'active',
      cell: (row) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={row?.active === true}
            onChange={() => handleStatusToggle(row?._id)}
          />
          <div
            className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-black p-[2px] after:duration-300 after:bg-black ${row?.active === true
              ? 'peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]'
              : 'peer-checked:bg-gray-400 peer-checked:ring-gray-400'
              } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-white peer-hover:after:scale-95`}
          ></div>
        </label>
      )
    }

  ];


  const handleClickfilter = (e) => {

    handleallbranch();
    getAllMetals();
    getAllInstallmentTypes();
    getAllSchemeTypes();
    getAllWastage();
    gstTypeDataTable();
    getSavingType();
    setIsFilterOpen(true);
  }



  const handleDelete = (id) => {
    setActiveDropdown(null);
    dispatch(openModal({
      modalType: 'CONFIRMATION',
      header: 'Delete Scheme',
      formData: {
        message: 'Are you sure you want to delete?',
        schemeId: id
      },
      buttons: {
        cancel: {
          text: 'Cancel'
        },
        submit: {
          text: 'Delete'
        }
      }
    }));


  };

  //mutation to get purity type
  const { mutate: deleteSchemeId } = useMutation({
    mutationFn: deleteScheme,
    onSuccess: (response) => {
      toast.success(response.message);
      getSchemeDataTable({
        from_date: "",
        to_date: "",
        search: debouncedSearch,
        page: currentPage,
        limit: itemsPerPage,
        id_branch: filters.id_branch,
        id_classification: "",
        metalid: "",
        id_purity: "",
        weekmonth: "",
        wastagebenefit: "",
        scheme_type: "",
        buytgsttype: ""

      })
      eventEmitter.off('CONFIRMATION_SUBMIT');
    },
    onError: (error) => {
      eventEmitter.off('CONFIRMATION_SUBMIT');
      console.error("Error:", error);
    },
  });


  



  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">Schemes</h2>
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
        <div className="relative w-full lg:w-1/3 min-w-[200px]">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="text-gray-500" />
          </div>
          <input
            placeholder="Search..."
            className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
            onChange={handleSearch}
          />
        </div>
        <div className="flex flex-row items-center justify-end gap-2">
          <button
            className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
            onClick={handleCreateSchemeClick}
            style={{ backgroundColor: layout_color }}>
            + Create Scheme
          </button>

          {
            filtered ?
              <>
                <button
                  id="filter"
                  className="text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
                  onClick={() => handleReset()}
                  style={{ backgroundColor: layout_color }}>
                  <RefreshCcw size={20} />
                </button>
              </>
              :
              <>

                <button
                  id="filter"
                  className="text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
                  onClick={(e) => {
                    handleClickfilter(e);
                  }}

                  style={{ backgroundColor: layout_color }} >
                  <SlidersHorizontal size={20} />
                </button>
              </>

          }
          
        </div>
      </div>

      <div
        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 
                ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`} >
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

          <form className='overflow-y-auto scrollbar-hide'>
            <div className="p-3 space-y-4 flex-1 overflow-y-auto filterscroll">
              <div className="flex flex-col border-t"></div>
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

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Branch Name
                </label>
                <div className="relative">
                  <select name="id_branch" onChange={(e) => { filterInputchange(e); }} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                    <option value='' >--Select--</option>
                    {branchList.map((branch) => (
                      <option key={branch._id} value={branch._id}>{branch.branch_name}</option>
                    ))
                    }
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
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
                    <option value="" disabled>
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

              <div className="space-y-2">
                <div className="flex flex-col">
                  <label className="text-black mb-1 font-medium">
                    Metal Type<span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="id_metal"
                      className="appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
                      defaultValue=""

                      onChange={filterInputchange}
                      value={filters.id_metal}
                    >
                      <option value="" disabled className="text-gray-700">
                        --Select--
                      </option>
                      {metalData.map((metal) => (
                        <option key={metal.id_metal} value={metal.id_metal}>
                          {metal.metal_name}
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

              <div className="space-y-2">
                <div className="flex flex-col">
                  <label className="text-black mb-1 font-medium">
                    Purity<span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="id_purity"
                      className={`appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700 ${!purityData || purityData.length === 0 ? "cursor-not-allowed bg-gray-100" : ""
                        }`}
                      disabled={!purityData || purityData.length === 0}
                      defaultValue=""
                      onChange={filterInputchange}

                      value={filters.id_purity}
                    >
                      <option value="" disabled className="text-gray-700">
                        --Select--
                      </option>
                      {purityData.map((purity) => (
                        <option key={purity.id_purity} value={purity.id_purity}>
                          {purity.purity_name}
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

              <div className="space-y-2">
                <div className="flex flex-col">
                  <label className="text-black mb-1 font-medium">
                    Installment Type<span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="weekmonth"
                      className="appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
                      defaultValue=""
                      onChange={filterInputchange}
                      value={filters.weekmonth}
                    >
                      <option value="" disabled className="text-gray-700">
                        --Select--
                      </option>
                      {installmentTypeData.map((type) => (
                        <option key={type._id} value={type.installment_type}>
                          {type.installment_name}
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
                      <option value="" disabled className="text-gray-700">
                        --Select--
                      </option>
                      {schemeTypeData.map((type) => (
                        <option key={type.scheme_type} value={type.scheme_type}>
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

              <div className="space-y-2">
                <div className="flex flex-col">
                  <label className="text-black mb-1 font-medium">
                    Buy GST Type<span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="buytgsttype"
                      className="appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
                      defaultValue=""
                      onChange={filterInputchange}
                      value={filters.buytgsttype}
                    >
                      <option value="" disabled className="text-gray-700">
                        --Select--
                      </option>
                      {gstTypeData.map((type) => (
                        <option key={type._id} value={type.id}>
                          {type.name}
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

              <div className="space-y-2">
                <div className="flex flex-col">
                  <label className="text-black mb-1 font-medium">
                    Benefit Wastage<span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="wastagebenefit"
                      className="appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
                      defaultValue=""
                      onChange={filterInputchange}
                      value={filters.wastagebenefit}
                    >
                      <option value="" disabled className="text-gray-700">
                        --Select--
                      </option>
                      {wastageType.map((data) => (
                        <option className="text-gray-700" key={data._id} value={data.id}>{data.name}</option>
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

              <div className="space-y-2">
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-1 font-medium">
                    Saving Type<span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="saving_type"
                      className="appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
                      defaultValue=""
                      onChange={filterInputchange}
                      value={filters.saving_type}
                    >
                      <option value="" disabled className="text-gray-700">
                        --Select--
                      </option>
                      {fundtype.map((type) => (
                        <option key={type._id} value={type.id}>
                          {type.name}
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
          </form>
        </div>
      </div>
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsFilterOpen(false)}
        />
      )}


      <div className="mt-4">

        <Table data={schemeData} columns={columns} isLoading={isLoading} />
      </div>

      {
        (schemeData.length > 0) &&
        <div className="flex justify-between mt-4 p-2">
        <div className={`flex flex-row items-center justify-center gap-2  `}>
          <div className="flex items-center gap-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
             
              className={`p-2 text-gray-500 rounded-md ${currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"} `}
            >
              Previous
            </button>
          </div>

          <div className="flex flex-row items-center justify-center gap-2">
            {paginationButtons}
          </div>

          <div className="flex items-center">
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              
              className={`p-2 text-gray-500 rounded-md  ${currentPage === totalPages ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              Next
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-2 justify-center items-center">
          <span className="text-gray-500">Show</span>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="p-2 h-10 border-gray-500 rounded-md text-black bg-gray-300"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={250}>250</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
          </select>
          <span className="text-gray-500">entries</span>
        </div>
      </div>
      }
      <Modal />
    </div>

  )
}

export default Scheme