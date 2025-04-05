import React, { useState, useEffect, useCallback } from 'react'
import Table from '../../common/Table'
import { toast } from 'react-toastify';
import { SlidersHorizontal, Search, X } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux';
import { pagehandler, setTotalPage, setClientId } from '../../../../redux/clientFormSlice';
import { useParams } from 'react-router-dom';
import { eventEmitter } from '../../../../utils/EventEmitter';
import { openModal } from '../../../../redux/modalSlice';
import Modal from '../../common/Modal';
import { getallclienttable, deleteclient } from "../../../api/Endpoints"
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom'
import ProgressSteps from '../../common/ProgressSteps';
import Action from '../../common/action';
import { useDebounce } from '../../../hooks/useDebounce';

const ClientMaster = () => {

  const navigate = useNavigate()
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isLoading,setisLoading] = useState(true)
 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [entries,Setentries] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  let dispatch = useDispatch();

  const [clientTable, setClientTable] = useState([]);

  const [filters, setFilters] = React.useState({
    metalType: '',
    branch: ''
  });
   const [search, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(search, 500)

    const handleSearch = useCallback((e) => setSearchInput(e.target.value), []);

  const steps = [
    {
      title: "Client Details",
      icon: (<svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 19.5V17.5C15 16.4391 14.5786 15.4217 13.8284 14.6716C13.0783 13.9214 12.0609 13.5 11 13.5H5C3.93913 13.5 2.92172 13.9214 2.17157 14.6716C1.42143 15.4217 1 16.4391 1 17.5V19.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 9.5C10.2091 9.5 12 7.70914 12 5.5C12 3.29086 10.2091 1.5 8 1.5C5.79086 1.5 4 3.29086 4 5.5C4 7.70914 5.79086 9.5 8 9.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      )
    },
    {
      title: "Branch",
      icon: (<svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 15.5C8.63183 14.71 7.07983 14.2942 5.5 14.2942C3.92017 14.2942 2.36817 14.71 1 15.5V2.49996C2.36817 1.71005 3.92017 1.29419 5.5 1.29419C7.07983 1.29419 8.63183 1.71005 10 2.49996M10 15.5C11.3682 14.71 12.9202 14.2942 14.5 14.2942C16.0798 14.2942 17.6318 14.71 19 15.5V2.49996C17.6318 1.71005 16.0798 1.29419 14.5 1.29419C12.9202 1.29419 11.3682 1.71005 10 2.49996M10 15.5V2.49996" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      )
    },
    {
      title: "Review",
      icon: (<svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 19.5V17.5C15 16.4391 14.5786 15.4217 13.8284 14.6716C13.0783 13.9214 12.0609 13.5 11 13.5H5C3.93913 13.5 2.92172 13.9214 2.17157 14.6716C1.42143 15.4217 1 16.4391 1 17.5V19.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 9.5C10.2091 9.5 12 7.70914 12 5.5C12 3.29086 10.2091 1.5 8 1.5C5.79086 1.5 4 3.29086 4 5.5C4 7.70914 5.79086 9.5 8 9.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      )
    },
  ];

 


  const { mutate: getClients } = useMutation({
    mutationFn: (payload)=>
       getallclienttable(payload),
    onSuccess: (response) => {
      setClientTable(response.data);
      setTotalPages(response.totalPages)
      setCurrentPage(response.currentPage)
      Setentries(response.totalDocuments)
      setisLoading(false)
    },
    onError:()=>{
      setisLoading(false)
    }
  });


  useEffect(() => {

    // dispatch(setTotalPage(steps.length))
    getClients({page: currentPage, limit: itemsPerPage, search: debouncedSearch});

  }, [currentPage, itemsPerPage,debouncedSearch])

  const handleEdit = (clientId) => {
    navigate(`/superadmin/addclient/${clientId}`);
  }


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleAddClientClick = () => {
    navigate('/superadmin/addclient');
  }


  const handleDelete = (id) => {

    setActiveDropdown(null);
    dispatch(openModal({
      modalType: 'CONFIRMATION',
      header: 'Delete Clients',
      formData: {
        message: 'Are you sure you want to delete?',
        clientId: id
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

   const { mutate: deleteclientMutate } = useMutation({
      mutationFn:(id)=> deleteclient(id),
      onSuccess: (response) => {
          const isLastItemOnPage = clientTable.length === 1;
          const isNotFirstPage = currentPage > 1;
          if (isLastItemOnPage && isNotFirstPage) {
            setCurrentPage(prev => prev - 1);
          } 
           
          getClients({
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch,
      })
          toast.success(response.message);
          eventEmitter.off("CONFIRMATION_SUBMIT");

        },
      onError: (error) => {
        console.error("Error:", error);
        toast.error(error.message);
      },
    });
  
    useEffect(() => {
      const handleDelete = (data) => {
        deleteclientMutate(data.clientId);
      };
  
      eventEmitter.on("CONFIRMATION_SUBMIT", handleDelete);
  
      return () => {
        eventEmitter.off("CONFIRMATION_SUBMIT", handleDelete);
      };
    }, []);
  

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {

    const pageNumber = Number(page);
    if (!pageNumber || isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
      return;
    }

    setCurrentPage(pageNumber);

  };


  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: 'Company name',
      cell: (row) => `${row?.company_name}`,
    },
    {
      header: 'Shop Contactno.',
      cell: (row) => `${row?.shop_contact}`,
    },
    {
      header: 'M.D Full Name ',
      cell: (row) => `${row?.md_name}`,
    },
    {
      header: 'M.D Mobile Number',
      cell: (row) => `${row?.md_mobile}`,
    },
    {
      header: 'Organization Spoc Name',
      cell: (row) => `${row?.organiz_spocname}`,
    },
    {
      header: 'Organization Spoc mobile',
      cell: (row) => `${row?.organiz_spoccontact}`,
    },
    {
      header: 'Sign Date',

       cell: (row) => formatDate(new Date(row?.sign_date), 'dd/MM/yyyy')
    },

    {
      header: 'Launch Date',
      
       cell: (row) => formatDate(new Date(row?.launch_date), 'dd/MM/yyyy')
    },
    {
      header: "Actions",
      cell: (row, rowIndex) => (
        <Action
          row={row}
          data={clientTable}
          rowIndex={rowIndex}
          activeDropdown={activeDropdown}
          setActive={hanldeActiveDropDown}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ),
      sticky: "right",
    },]

  return (
    <div className="flex flex-col p-4 relative">
      {/* Header */}

      <h2 className="text-3xl text-[#023453] font-bold">Client's Master</h2>



      {/* Search and Add Client Section */}

      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
        <div className="relative w-full lg:w-1/3 min-w-[200px]">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="text-gray-500" />
          </div>
          <input
            placeholder="Search..."
            className="p-3 font-montserrat pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
          />
        </div>
        <div className="flex flex-row items-center justify-end gap-2">
          <button
            id="filter"
            className="text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors"
            style={{ backgroundColor: layout_color }}>
            <SlidersHorizontal size={20} />
          </button>
          <button
            className=" text-sm font-montserrat rounded-md px-4 py-3 text-white whitespace-nowrap hover:bg-[#034571] transition-colors"
            onClick={handleAddClientClick}
            style={{ backgroundColor: layout_color }}  >
            + Add Client
          </button>
        </div>
      </div>


      {/* Filters Section */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isFilterOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-3">
            <h3 className="text-lg font-semibold text-[#023453]">Filters</h3>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-3 space-y-4 flex-1 overflow-y-auto">

            {/* Branch Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Branch
              </label>
              <select
                name="branch"
                value={filters.branch}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Branches</option>
                <option value="branch1">Branch 1</option>
                <option value="branch2">Branch 2</option>
                <option value="branch3">Branch 3</option>
              </select>
            </div>
            <div className="p-4">
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsFilterOpen(false)}
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

      {/* Main Content */}
      <div className="mt-4">

        <Table
          data={clientTable}
          columns={columns}
          isLoading={isLoading}
          currentPage={currentPage}
          handleItemsPerPageChange={handleItemsPerPageChange}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={entries}
          debounceSearch={handleSearch}
        />

      </div>
      {/* {clientTable.length > 0 && (
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
      )} */}
      <Modal />
    </div>

  )
}

export default ClientMaster