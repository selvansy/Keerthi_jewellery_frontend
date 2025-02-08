import React, { useEffect, useState } from 'react'
import Table from '../../common/Table'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { eventEmitter } from '../../../../utils/EventEmitter';
import { useSelector, useDispatch } from 'react-redux';
import ModelOne from '../../common/Modelone';
import { useMutation } from '@tanstack/react-query'
import {
  addprojectaccess, getallprojectaccesstable, deleteprojectaccess
} from '../../../api/Endpoints'
import { toast } from 'react-toastify'
import { useDebounce } from '../../../hooks/useDebounce';
import { setid } from "../../../../redux/clientFormSlice"
import { openModal } from '../../../../redux/modalSlice';
import ProjectAccessForm from '../ProjectAccess/ProjectAccessForm';
import Modal from '../../common/Modal';

const ProjectAccess = () => {
  const dispatch = useDispatch();
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [projectAccessData, setProjectAccessData] = useState([]);
  const limit = 10;
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const modal = useSelector((state) => state.modal);
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 500)
  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_role = roledata?.id_role?.id_role;
  const id_client = roledata?.id_client;
  const id_branch = roledata?.branch;
  const id_project = roledata?.id_project;
  const navigate = useNavigate();
  const [isviewOpen, setIsviewOpen] = useState(false);

  function closeIncommingModal() {
    setIsviewOpen(false);
  }
  const handleEdit = (id) => {
    dispatch(setid(id))
    setIsviewOpen(true)
  };



  const { mutate: getallprojectaccesstableMutate, isLoading, refetch } = useMutation({
    mutationFn: getallprojectaccesstable,
    onSuccess: (response) => {
      if (response) {
        setProjectAccessData(response.data);
      }
    },
  });




  const { mutate: handleDelete } = useMutation({
    mutationFn: (id) => deleteprojectaccess(id),
    onSuccess: (response) => {
      if (response) {
        toast.success(response.message)
        getallprojectaccesstable({
          page: currentPage,
          limit: itemsPerPage
        })
      }
    },
    onError: (error) => {
      console.error('Error fetching roles:', error);
    }
  });



  useEffect(() => {
    getallprojectaccesstableMutate({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch
    });
  }, [currentPage, itemsPerPage, debouncedSearch, isviewOpen]);


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

  const handleStatusToggle = (id) => {
    changeStaffStatus(id)
  }



  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        className={`p-2 w-10 h-10 rounded-md ${currentPage === i ? ' text-white' : 'bg-gray-300 text-gray-900'}`}
        style={{ backgroundColor: layout_color }} >
        {i}
      </button>
    );
  }

  const columns = [
    {
      header: 'S.No',
      cell: (_, index) => index + 1 + (currentPage - 1) * limit,
    },

    {
      header: 'Client Name',
      cell: (row) => `${row?.id_client.company_name}`,
    },
    {
      header: 'Branch Name',
      cell: (row) => `${row?.id_branch.branch_name}`,
    },
    {
      header: 'Project Name',
      cell: (row) => {
        const proj_name = row?.id_project.map((project) => project.project_name).join(', ');
        return proj_name;
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
                top: rowIndex >= projectAccessData.length - 2 ? 'auto' : '72%',
                bottom: rowIndex >= projectAccessData.length - 2 ? '-74%' : 'auto',
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
      <h2 className="text-2xl text-gray-900 font-bold">Project Access</h2>
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
            + Add Project Access
          </button>
        </div>
      </div>

      <div className="mt-4">
        <Table
          data={projectAccessData}
          columns={columns}
        />
        {projectAccessData.length > 0 && (
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
          refetch={refetch}
          title={"Create new user"}
          extraClassName='max-w-[60%] '
          setIsOpen={setIsviewOpen}
          isOpen={isviewOpen}
          closeModal={closeIncommingModal}

        >
          <ProjectAccessForm
            setIsOpen={setIsviewOpen} />
        </ModelOne>

      </div>
      <Modal />
    </div>

  )
}

export default ProjectAccess;


