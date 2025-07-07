import React, { useEffect, useState } from 'react'
import Table from '../../common/Table'
import { SlidersHorizontal, Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import { toast } from 'react-toastify'
import { CalendarDays, RefreshCcw } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Modal from '../../common/Modal';
import { eventEmitter } from '../../../../utils/EventEmitter';
import { openModal } from '../../../../redux/modalSlice';
import { setid } from "../../../../redux/clientFormSlice"
import ModelOne from '../../common/Modelone';
import Imagedetails from "./Imagedetails"
import {
  getoffersTable, sendwhatsappmessage,getOfferById,getBranchById, allofferstype, activateoffers, deleteoffers, allmetal, getallbranch
} from "../../../api/Endpoints";

import { useDispatch, useSelector } from 'react-redux'
import { setWhatsappData, setSettingtype } from "../../../../redux/clientFormSlice"

const ProductWhatsapp = () => {


  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);
  let id_client = roledata?.id_client;

  const id_branch = roledata?.branch;


  let dispatch = useDispatch();
  const navigate = useNavigate()

  const [isLoading,setisLoading] = useState(true)

  const [offerData, setofferData] = useState([])
  const [search, setSearch] = useState('')
  const [isviewOpen, setIsviewOpen] = useState(false);
  const [issettingOpen, setIsSettingOpen] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null)
  const [activeDropdown, setActiveDropdown] = useState(null)
   const [sendDropdown, setSendDropdown] = useState(null)
  const [popuptitle, setPopuptitle] = useState(0);
  const [displaysetting, setDiplaySetting] = useState(0);

  const [branchList, setBranchList] = useState([]);
  let [branch, setbranch] = useState("")


  const [filtermetaltype, setMetaltype] = useState([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [from_date, setFromdate] = useState("");

  const [to_date, setTodate] = useState("");

  const [filters, setFilters] = React.useState({
    from_date: null,
    to_date: null,
    limit: itemsPerPage,
    id_branch: id_branch,
    type: 1,
  });

 const handleReset = (e) => {
    setFromdate("");
    setTodate("");
    setFilters(prev => ({
      ...prev, 
      id_branch: id_branch,
      type: 1
    }));
    toast.success("Filter is cleared");

    getnewarrivalsData({ from_date: '', to_date: '', page: currentPage, limit: itemsPerPage, id_branch: id_branch, type: 1 });
  }
  function closeIncommingModal() {
    setIsviewOpen(false);
    setIsSettingOpen(false);
  }

  const handleImagedetails = (id) => {
    setActiveDropdown(null);
    fetchById(id)
    setPopuptitle('View Details');
    setDiplaySetting(1);
    setIsviewOpen(true)
  };


   const { mutate: fetchById } = useMutation({
         mutationFn: getOfferById,
         onSuccess: (response) => {
    
          if(response){  
           dispatch(setWhatsappData({
            name:response.data.name,
            desc:response.data.description,
            img:response.data.offer_image,
            imgPath:response.data.pathurl
           }))   
          } else {
            toast.error("No record data!");
          }
         
         },
         onError: (error) => {
           console.error("Error fetching countries:", error);
         },
       });

  const handleSettingnotification = async () => {
    setPopuptitle('Setting Wedding Anniversery');
    setDiplaySetting(2);
    dispatch(setSettingtype(1))
    setIsSettingOpen(true)
  };

  useEffect(() => {
    if (id_branch === '0') {
      getallbranches()
    }

    if (id_branch !== "0") {
      setFilters({ ...filters, id_branch: id_branch })
    }

  }, [id_branch]);



  const filterInputchange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));

  };

  const applyfilterdatatable = (e) => {
    e.preventDefault();
    const filterTosend = {
      from_date: from_date,
      to_date: to_date,
      limit: itemsPerPage,
      id_branch: filters.id_branch,
      type: filters.type

    };
      getofferData(filterTosend);
      setIsFilterOpen(false)
      setFromdate("")
      setTodate("")
      setFilters({
        from_date: null,
        to_date: null,
        limit: itemsPerPage,
        id_branch: id_branch,
        type: 1,
      })
    
  };



  //mutation to get category type
  const { mutate: getallmetal } = useMutation({
    mutationFn: allmetal,
    onSuccess: (response) => {
      setMetaltype(response.data);
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });

  const { mutate: getallbranches } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      
      setBranchList(response.data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const { mutate: branchbyId } = useMutation({
    mutationFn: getBranchById,
    onSuccess: (response) => {
      setbranch(response.data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });


  //mutation to get scheme type
  const { mutate: getofferData } = useMutation({
    mutationFn: (data)=>
       getoffersTable(data),
    onSuccess: (response) => {
     
      setofferData(response.data)
      setTotalPages(response.data.totalPages)
      setisLoading(false)
    },
    onError: (error) => {
      console.error('Error:', error);
      setisLoading(false)
    }
  });

  useEffect(() => {
    getofferData({ page: currentPage, limit: itemsPerPage, search: search })
  }, [currentPage, itemsPerPage, search])

  useEffect(() => {
    getofferData({ page: currentPage, limit: itemsPerPage, search: search })
  }, [])


  useEffect(() => {
    if (search !== "") {
      getofferData({ page: currentPage, limit: itemsPerPage, search: search })
    }
  }, [search])


  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const handleClick = (e) => {
    e.preventDefault();
    navigate('/catalog/addoffers');
  }




  const handleDelete = (id) => {

    setActiveDropdown(null);
    dispatch(openModal({
      modalType: 'CONFIRMATION',
      header: 'Delete Scheme',
      formData: {
        message: 'Are you sure you want to delete?',
        OfferId: id
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
  const { mutate: deleteOffer } = useMutation({
    mutationFn: deleteoffers,
    onSuccess: (response) => {
      
      toast.success(response.message);
      getofferData({ page: currentPage, limit: itemsPerPage, search: search })
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });


  useEffect(() => {
    eventEmitter.on('CONFIRMATION_SUBMIT', async (data) => {
      try {
        
        deleteOffer(data.OfferId);

      } catch (error) {
        console.error('Error:', error);
      }
    });
    return () => {
      eventEmitter.off('CONFIRMATION_SUBMIT');
    };
  }, [eventEmitter]);

  const handleSend = (id,id_branch) => {
    setSendDropdown(null);
    dispatch(openModal({
      modalType: 'SENDCONFIRMATION',
      header: 'Send Offers Notification',
      formData: {
        message: 'Are you sure you want to send?',
        id: id,
        id_branch:id_branch
      },
      buttons: {
        cancel: {
          text: 'Cancel'
        },
        submit: {
          text: 'Send'
        }
      }
    }));
  };
  
  useEffect(() => {
    const handleSubmit = async (data) => {
      try {
        sendwhatsapp({ id: data.id,id_branch:data.id_branch, senttype: 1 });
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    // Listen for SENDCONFIRMATION_SUBMIT only once when component mounts
    eventEmitter.on('SENDCONFIRMATION_SUBMIT', handleSubmit);
  
    return () => {
      // Clean up listener on unmount
      eventEmitter.off('SENDCONFIRMATION_SUBMIT', handleSubmit);
    };
  }, [eventEmitter]); // Only depend on eventEmitter to avoid unnecessary re-renders
  
  // Mutation to get purity type
  const { mutate: sendwhatsapp } = useMutation({
    mutationFn: sendwhatsappmessage,
    onSuccess: (response) => {
      ;
      toast.success(response.message);
      getofferData({ page: currentPage, limit: itemsPerPage, search: search });
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });
  

  const columns = [
    {
      header: 'S.No',
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: 'Name',
      cell: (row) => row?.name,
    },
    {
      header: "Description",
      cell: (row) => row?.description
    },
    {
      header: 'Image',
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
              className="absolute right-[47px] lg:right-[163px] md:right-[150px] sm:right-[100px] transform -translate-x-8"
              style={{
                top: rowIndex >= offerData.length - 2 ? 'auto' : '72%',
                bottom: rowIndex >= offerData.length - 2 ? '-74%' : 'auto',
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
                      handleImagedetails(row?._id);
                    }}


                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    View
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

                </div>
              </div>
            </div>
          )}
        </div>
      ),

    },
    {
      header: 'Status',
      cell: (row, rowIndex) => (
        <div className="dropdown-container relative">
          <button
            onClick={() => {
              if (row?.whatsapp_sent === 0) {
                handleSend(row?._id,row?.id_branch._id);
                setSendDropdown(null);
              }
            }}
            className={`px-4 py-2 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 
            ${row?.whatsapp_sent > 0 ? "bg-gray-900 focus:ring-gray-600 cursor-not-allowed opacity-50" : "bg-[#61A375] hover:bg-[#4F8A5D] focus:ring-green-400 cursor-pointer"}`}
            readOnly={row?.whatsapp_sent > 0}
          >
            {row?.whatsapp_sent > 0 ? "Sent" : "Send"}
          </button>
        </div>
      ),
    },
    {
      header: "Total Sent",
      cell: (row) => row?.whatsapp_sent
    },
    {
      header: "Branch Name",
      cell: (row) => row?.id_branch.branch_name
    },

  ];

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

  const handleItemsPerPageChange = (value) => {

    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">Offers Notification</h2>
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
        <div className="flex flex-row items-center justify-start gap-2">
        <button
            id="filter"
            className="text-white bg-[#023453] w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
            onClick={() => handleReset()}
          >
            <RefreshCcw size={20} />
          </button>
          <button
            id="filter"
            className="text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
            onClick={() => setIsFilterOpen(true)}
            style={{ backgroundColor: layout_color }}>
            <SlidersHorizontal size={20} />
          </button>
        </div>
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

          <form>
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
                {
                  id_branch === "0" &&

                  <>
                    <div className="flex flex-col lg:mt-2">
                      <label className="text-black mb-1 font-medium">
                        Branch<span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="id_branch"
                          className={`appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700 ${!id_branch !== "0" ? "cursor-not-allowed bg-gray-100" : ""
                            }`}
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
                  </>
                }
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
        <Table
          data={offerData}
          columns={columns}
          isLoading={isLoading}
        />
      </div>
      {offerData.length > 0 && (
        <div className="flex justify-between mt-4 p-2">
          <div className="flex flex-row items-center justify-center gap-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                readOnly={currentPage === 1}
                className="p-2 text-gray-500 rounded-md"
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
      )}

      {displaysetting === 1 && (
        <ModelOne
          title={popuptitle}
          extraClassName='max-w-[75%] '
          setIsOpen={setIsviewOpen}
          isOpen={isviewOpen}
          closeModal={closeIncommingModal}
        >

          <Imagedetails
          
            setIsOpen={setIsviewOpen}
          />

        </ModelOne>
      )}
      {displaysetting === 2 && (
        <ModelOne
          title={popuptitle}
          extraClassName='max-w-[75%] '
          setIsOpen={setIsSettingOpen}
          isOpen={issettingOpen}
          closeModal={closeIncommingModal}
        >
         
        </ModelOne>
      )}

      <Modal />
    </div>
  )
}

export default ProductWhatsapp