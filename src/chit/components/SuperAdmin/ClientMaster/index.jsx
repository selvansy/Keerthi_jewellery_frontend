import React, { useState, useEffect } from 'react'
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

const ClientMaster = () => {

  const navigate = useNavigate()

  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const [userroleData, setuserroleData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('')

  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([])
  const [selectedCity, setSelectedCity] = useState('')
  const [clientData, setClientData] = useState([])
  const [countryData, setCountryData] = useState([])

  let [client, setClient] = useState({});
  const [filters, setFilters] = React.useState({
    metalType: '',
    branch: ''
  });


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

  const currentStep = useSelector((state) => state.clientForm.currentStep);
  const id = useSelector((state) => state.clientForm.id_client);
  const selectedProject = useSelector((state) => state.clientForm.selectedProject);
  let dispatch = useDispatch();

  const [clientTable, setClientTable] = useState([]);

  const { mutate: getClients } = useMutation({
    mutationFn: getallclienttable,
    onSuccess: (response) => {
      setClientTable(response.data);
    }
  });


  useEffect(() => {

    dispatch(setTotalPage(steps.length))
    getClients();

  }, [])

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
    dispatch(openModal({
      modalType: 'CONFIRMATION',
      header: 'Delete Clients',
      formData: {
        message: 'Are you sure you want to delete this client?',
        clientId: id,
      },
      buttons: {
        cancel: { text: 'Cancel' },
        submit: { text: 'Delete' },
      },
    }));

    eventEmitter.on('CONFIRMATION_SUBMIT', async (data) => {
      try {
        let response = await deleteclient(data.clientId);
        toast.success(response.message);
        getallclienttable();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    });
  }


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };
  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        className={`p-2 w-10 h-10 rounded-md ${currentPage === i ? 'bg-[#023453] text-white' : 'bg-gray-300 text-[#023453]'}`}
      >
        {i}
      </button>
    );
  }


  useEffect(() => {
    return () => {
      eventEmitter.off('CONFIRMATION_SUBMIT');
    };
  }, [eventEmitter]);


  const columns = [
    {
      header: 'S.No',
      cell: (_, index) => index + 1,
    },
    {
      header: 'Company name',
      cell: (row) => `${row.company_name}`,
    },
    {
      header: 'Shop Contactno.',
      cell: (row) => `${row.shop_contact}`,
    },
    {
      header: 'M.D Full Name ',
      cell: (row) => `${row.md_name}`,
    },
    {
      header: 'M.D Mobile Number',
      cell: (row) => `${row.md_mobile}`,
    },
    {
      header: 'Organization Spoc Name',
      cell: (row) => `${row.organiz_spocname}`,
    },
    {
      header: 'Organization Spoc mobile',
      cell: (row) => `${row.organiz_spoccontact}`,
    },
    {
      header: 'Sign Date',
      cell: (row) => `${row.sign_date || '0000-00-00'}`,
    },

    {
      header: 'Launch Date',
      cell: (row) => `${row.launch_date || '0000-00-00' }`,
    },

    {
      header: 'Actions',
      cell: (row, rowIndex) => (
        <div className="dropdown-container relative">
          <button
            className="p-1 hover:bg-gray-100 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRow(row._id);
              setActiveDropdown(activeDropdown === row._id ? null : row._id);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>

          {activeDropdown === row._id && (
            <div
              className="absolute right-[47px] lg:right-[235px] md:right-[150px] sm:right-[100px] transform -translate-x-8"
              style={{
                top: 'auto',
                bottom: '-440%',
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
                      handleEdit(row._id);
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
                      handleDelete(row._id);
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
      sticky: 'right'
    }
  ]

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
            className="text-white bg-[#023453] w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors"
          >
            <SlidersHorizontal size={20} />
          </button>
          <button
            className="bg-[#023453] text-sm font-montserrat rounded-md px-4 py-3 text-white whitespace-nowrap hover:bg-[#034571] transition-colors"
            onClick={handleAddClientClick}
          >
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
          selectedRow={selectedRow}
        />

      </div>
      {clientTable.length > 0 && (
        <div className="flex justify-between mt-4 p-2">
          <div className="flex flex-row items-center justify-center gap-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
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
                disabled={currentPage === totalPages}
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
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
            <span className="text-gray-500">entries</span>
          </div>
        </div>
      )}
      <Modal />
    </div>

  )
}

export default ClientMaster