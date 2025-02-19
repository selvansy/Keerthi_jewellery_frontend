import React, { useState, useEffect } from 'react'
import Table from '../../common/Table'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMutation} from '@tanstack/react-query'
import { getallemployeetable,changeEmployeeStatus, deleteemployee } from '../../../api/Endpoints'
import { toast } from 'react-toastify';
import { openModal } from '../../../../redux/modalSlice';
import { eventEmitter } from '../../../../utils/EventEmitter';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../common/Modal';
import { useDebounce } from '../../../hooks/useDebounce';
import { useQuery } from '@tanstack/react-query'


const EmployeeReferral = () => {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading,setisLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [employeeData, setEmployeeData] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 500)
  

  useEffect(() => {
    getallemployeetableMutate({
      
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch
      
    });
  }, [currentPage, itemsPerPage, debouncedSearch]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleAddEmployeeClick = () => {
    navigate('/setup/employee/add')
  }

  const { mutate: getallemployeetableMutate } = useMutation({
    mutationFn: ()=>
       getallemployeetable(payload),
    onSuccess: (response) => {
    
      if (response?.data) {
        setEmployeeData(response.data);
        setTotalPages(response.totalPages);
      }
      setisLoading(false)
    },
    onError:()=>{
        setisLoading(false)
    }
  });
  

  const { mutate: deleteEmployeeMutate } = useMutation({
    mutationFn: deleteemployee,
    onSuccess: (response) => {
      toast.success(response.message);
      getallemployeetableMutate({ page: currentPage, limit: itemsPerPage });  
    }
  });

  useEffect(()=>{
    getallemployeetableMutate({
      search: debouncedSearch
    });
  },[debouncedSearch])

  useEffect(() => {
    getallemployeetableMutate({
      page: currentPage,
      limit: itemsPerPage,
      from_date: "",
      to_date: "",
      search: debouncedSearch
    });
  }, [currentPage, itemsPerPage]);

  
  useEffect(() => {
    getallemployeetableMutate({
      page: currentPage,
      limit: itemsPerPage,
      from_date: "",
      to_date: "",
      search: debouncedSearch
    });
  }, []);



  const handleEdit = (id) => {
    navigate(`/setup/employee/edit/${id}`)
  }

  const handleDelete = (id) => {
    dispatch(openModal({
      modalType: 'CONFIRMATION',
      header: 'Delete Employee',
      formData: {
        message: 'Are you sure you want to delete this employee?',
        employeeId: id
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

    eventEmitter.on('CONFIRMATION_SUBMIT', async (data) => {
      try {
        let response = deleteEmployeeMutate(data.employeeId);
        toast.success(response.message);
        getallemployeetableMutate({ page: currentPage, limit });
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    });
  }

  useEffect(() => {
    return () => {
      eventEmitter.off('CONFIRMATION_SUBMIT');
    };
  }, []);

  const handleStatusToggle = async (id) => {
    let response = await changeEmployeeStatus(id);
    if(response){
      toast.success(response.message);
      setEmployeeData((prevData) =>
        prevData.map((employee) =>
          employee._id === id 
            ? { ...employee, active: employee.active === true ? false : true }
            : employee
        )
      );
      getallemployeetableMutate({ page: currentPage, limit: itemsPerPage });  
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const columns = [
    {
      header: 'Actions',
      cell: (row, rowIndex) => (
          <div className="dropdown-container relative"
          style={{
              top: rowIndex >= employeeData.length - 2 ? "auto" : "72%",
              bottom: rowIndex >= employeeData.length - 2 ? "-74%" : "auto", 
              // top: 'auto',
              // bottom: '-440%',
     
              marginBottom: "-15px",
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.15))",
            }}
          >
              <button
                  className="p-1 hover:bg-gray-100 rounded-full"
                  onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(activeDropdown === row?._id ? null : row?._id);
                  }}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
              </button>

              {activeDropdown === row?._id && (
                  <div
                      className="relative"
                    
                  >
                      <div className="w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
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
      sticky: 'right'
  },
    {
      header: 'S.No',
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: 'Employee Name',
      cell: (row) => `${row?.firstname} ${row?.lastname}`,
    },
    {
      header: "Date of Joining", 
      cell: (row) => formatDate(row?.date_of_join)
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
            className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-black p-[2px] after:duration-300 after:bg-black ${
              row.active === true
                ? 'peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]'   
                : 'peer-checked:bg-gray-400 peer-checked:ring-gray-400'
            } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-white peer-hover:after:scale-95`}
          ></div>
        </label>
      )
    }
   
  ];


  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">Our Employee</h2> 
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
        <div className="relative w-full lg:w-1/3 min-w-[200px]">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
            ) : (
              <Search className="text-gray-500" />
            )}
          </div>
          <input 
            placeholder="Search..."
            className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
            value={searchInput}
            onChange={handleSearch}
          />
        </div>
        <div className="flex flex-row items-center justify-end gap-2">
          <button
            className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
            onClick={handleAddEmployeeClick}
            style={{ backgroundColor: layout_color }} >
            + Add Employee
          </button>
        </div>
      </div>

      <div className="mt-4">
      <Table data={employeeData || [] } columns={columns} selectedRow={selectedRow} activeDropdown={activeDropdown} isLoading={isLoading}/>
      </div>
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
      <Modal />
    </div>
  )
}

export default EmployeeReferral;