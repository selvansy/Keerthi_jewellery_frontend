import React, { useEffect, useState } from 'react'
import Table from '../../common/Table'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// import { openModal} from '../../../../redux/modalSlice';
import { useDispatch, useSelector } from 'react-redux'
import ModelOne from '../../common/Modelone';
import { useMutation } from '@tanstack/react-query'
import {
  getallclient,  getstaffusertable, changeStaffUserStatus, deleteStaffUser
} from '../../../api/Endpoints'
import { eventEmitter } from '../../../../utils/EventEmitter';
import { toast } from 'react-toastify'
import { useDebounce } from '../../../hooks/useDebounce';
import { setid } from "../../../../redux/clientFormSlice"
import StaffuserForm from './StaffuserForm'

const StaffUser = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [clientData, setClientData] = useState([])
  const [projectData, setProjecData] = useState([])
  const [roleData, setRoleData] = useState([])
  const [staffData, setStaffData] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const modal = useSelector((state) => state.modal);
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 500)

  const roledata = useSelector((state) => state.clientForm.roledata);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
 
  const id_role = roledata?.id_role?.id_role;
  const id_client = roledata?.id_client;
  const id_branch = roledata?.branch;
  const id_project = roledata?.id_project;

  const [isviewOpen, setIsviewOpen] = useState(false);

  function closeIncommingModal() {
    setIsviewOpen(false);
  }

  
      const handleEdit = (id) => {
          dispatch(setid(id))
          setIsviewOpen(true)
      };

 
   // get all clients
  // const { mutate: getallclientMutate } = useMutation({
  //   mutationFn: getallclient,
  //   onSuccess: (response) => {
  //     if (response?.data) {
  //       setClientData(response.data);
  //     }
  //   },
  //   onError: (error) => {
  //     console.error('Error fetching states:', error);
  //   }
  // })

  // //get projects by client
  // const { mutate: getAllProjects } = useMutation({
  //   mutationFn: (clientid)=> getprojectbyclient({id_client:clientid}),
  //   onSuccess: (response) => {
  //     if (response) {
  //       setProjecData(response.data)
  //       dispatch(openModal({
  //           ...modal,
  //           extraData: {
  //               ...modal.extraData,
  //               projectData: response.data
  //           }
  //       }));
  //   }
  //   },
  //   onError: (error) => {
  //     console.error('Error fetching states:', error);
  //   }
  // })

  // //get branch by client
  //  const { mutate: getBrancheByClient } = useMutation({
  //   mutationFn: (clientId) => getbranchbyclient({id_client:clientId}),
  //   onSuccess: (response) => {
  //     if (response?.data) {
  //       dispatch(openModal({
  //         ...modal,
  //         extraData: {
  //           ...modal.extraData,
  //           branchData: response.data
  //         }
  //       }));
  //     }
  //   },
  //   onError: (error) => {
  //     console.error('Error fetching branches:', error);
  //   }
  // });

  // //get employee by branch
  // const { mutate: getEmployeeByBranch } = useMutation({
  //   mutationFn: (branch_id) => employeeByBranch({id_branch:branch_id}),
  //   onSuccess: (response) => {
  //       if (response?.data) {
  //           dispatch(openModal({
  //               ...modal,
  //               extraData: {
  //                   ...modal.extraData,
  //                   employeeData: response.data
  //               }
  //           }));
  //       }
  //   },
  //   onError: (error) => {
  //       console.error('Error fetching employees:', error);
  //   }
  // });

  // //get role
  // const { mutate: getAllRoles } = useMutation({
  //   mutationFn: getalluserrole,
  //   onSuccess: (response) => {
  //     if (response) {
  //       setRoleData(response.data)
  //       dispatch(openModal({
  //           ...modal,
  //           extraData: {
  //               ...modal.extraData,
  //               roles: response.data
  //           }
  //       }));
  //   }
  //   },
  //   onError: (error) => {
  //       console.error('Error fetching roles:', error);
  //   }
  // });


  //get staff user data with pagination 
  const { mutate: getAllgetstaffusertable, isLoading } = useMutation({
    mutationFn: (formdata) => getstaffusertable(formdata),
    onSuccess: (response) => {
      if (response) {
        setStaffData(response.data)
        setTotalPages(response.totalPages)
      }
    },
    onError: (error) => {
      console.error('Error fetching staff data:', error);
    }
  });

  //submit staff user data 
  const { mutate: addStaffUser } = useMutation({
    mutationFn: (formdata) => addStaffUserData(formdata),
    onSuccess: (response) => {
      if (response) {
        dispatch(closeModal());
        toast.success(response.message)
        getAllgetstaffusertable()
      }
    },
    onError: (error) => {
      console.error('Error fetching roles:', error);
    }
  });

  //mutation to change staff active or decative status
  const { mutate: changeStaffStatus } = useMutation({
    mutationFn: (id) => changeStaffUserStatus(id),
    onSuccess: (response) => {
      if (response) {
        toast.success(response.message)
        getAllgetstaffusertable()
      }
    },
    onError: (error) => {
      console.error('Error fetching roles:', error);
    }
  });

  //mutation to change staff active or decative status
  const { mutate: deleteStaff } = useMutation({
    mutationFn: (id) => deleteStaffUser(id),
    onSuccess: (response) => {
      if (response) {
        toast.success(response.message)
        getAllgetstaffusertable()
      }
    },
    onError: (error) => {
      console.error('Error fetching roles:', error);
    }
  });

  // Separate useEffect for initial data loading
  // useEffect(() => {
  //     getallclientMutate();
    
  // }, []);

  // Separate useEffect for staff data with search/pagination
  useEffect(() => {
    getAllgetstaffusertable({
      page: currentPage,
      limit: itemsPerPage,
      from_date: "",
      to_date: "",
      search: debouncedSearch
    });
  }, [currentPage,itemsPerPage, debouncedSearch,isviewOpen]);

  // Update event emitter cleanup
  // useEffect(() => {
  //   const handleClientSelected = (clientId) => {
  //     getBrancheByClient(clientId);
  //     getAllProjects(clientId);
  //   };

  //   const handleBranchSelected = (branch_id) => {
  //     getEmployeeByBranch(branch_id);
  //   };

  //   const handleGetRoles = () => {
  //     getAllRoles();
  //   };

  //   const handleSubmit = (formData) => {
  //     addStaffUser(formData);
  //   };

  //   // Add event listeners
  //   eventEmitter.on('CLIENT_SELECTED', handleClientSelected);
  //   eventEmitter.on('BRANCH_SELECTED', handleBranchSelected);
  //   eventEmitter.on('NEXT', handleGetRoles);
  //   eventEmitter.on('USER_ACCESS_SUBMIT', handleSubmit);

  //   // Cleanup function
  //   return () => {
  //     eventEmitter.off('CLIENT_SELECTED', handleClientSelected);
  //     eventEmitter.off('BRANCH_SELECTED', handleBranchSelected);
  //     eventEmitter.off('NEXT', handleGetRoles);
  //     eventEmitter.off('USER_ACCESS_SUBMIT', handleSubmit);
  //   };
  // }, []);

  const handleAddEmployeeClick = async () => {
    setIsviewOpen(true)
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  // handler to active or deactive staff user
  const handleStatusToggle = (id) => {
    changeStaffStatus(id)
  }

  const handleDelete = (id) => {
    deleteStaff(id)
  }

  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        className={`p-2 w-10 h-10 rounded-md ${currentPage === i ? ' text-white' : 'bg-gray-300 text-gray-900'}`}
        style={{ backgroundColor: layout_color }}  >
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
      header: 'Name',
      cell: (row) => {
        if (row?.id_employee) {
          return `${row?.id_employee.firstname || ''} ${row?.id_employee.lastname || ''}`.trim();
        }
        return '-';
      }
    },
    {
      header: 'Username',
      cell: (row) => row?.username,
    },
    {
      header: "Roles",
      cell: (row) => {
        if (row?.id_role) {
          return `${row?.id_role.role_name || ''}`
        } else {
          return '-'
        }
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
            className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-black p-[2px] after:duration-300 after:bg-black ${row?.active === 1
                ? 'peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]'
                : 'peer-checked:bg-gray-400 peer-checked:ring-gray-400'
              } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-white peer-hover:after:scale-95`}
          ></div>
        </label>
      )
    }, {
      header: 'Branch',
      cell: (row) => {
        if (row?.id_branch) {
          return `${row?.id_branch.branch_name || ''}`
        } else {
          return '-'
        }
      }
    },
    {
      header: 'Access Branch',
      cell: (row) => {
        if (typeof row?.access_branch === 'string') {
          return 'All branch';
        }
        if (typeof row?.access_branch === 'object' && row?.access_branch !== null) {
          console.log(row);
          return row?.access_branch.branch_name || '-';
        }
        return '-';
      }
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
              className="absolute right-[47px] lg:right-[163px] md:right-[150px] sm:right-[100px] transform -translate-x-8"
              style={{
                top: rowIndex >= staffData.length - 2 ? 'auto' : '72%',
                bottom: rowIndex >= staffData.length - 2 ? '-74%' : 'auto',
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
      sticky: 'right'
    }
  ];

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };

  return (

    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-[#023453] font-bold">Staff Users</h2>
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
            + Add User
          </button>
        </div>
      </div>

      <div className="mt-4">
        <Table
          data={staffData}
          columns={columns}
        />
        {staffData.length > 0 && (
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

        <ModelOne
          title={"Create new user"}
          extraClassName='max-w-[60%] '
          setIsOpen={setIsviewOpen}
          isOpen={isviewOpen}
          closeModal={closeIncommingModal}

        >
          <StaffuserForm
            setIsOpen={setIsviewOpen} />
        </ModelOne>
      </div>

    </div>

  )
}

export default StaffUser;


