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
import Action from "../../common/action";

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
  const [isLoading,setisLoading] = useState(true)

  function closeIncommingModal() {
    setIsviewOpen(false);
  }
  const handleEdit = (id) => {
    dispatch(setid(id))
    setIsviewOpen(true)
  };


  const { mutate: getallprojectaccesstableMutate,  refetch } = useMutation({
    mutationFn: (data)=>
      getallprojectaccesstable(data),
    onSuccess: (response) => {
      if (response) {
        setProjectAccessData(response.data);
      }
      setisLoading(false)
    },
    onError:()=>{
      setisLoading(false)
    }
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

  // useEffect(() => {
  //   getallprojectaccesstableMutate({
  //     page: currentPage,
  //     limit: itemsPerPage,
  //     search: debouncedSearch
  //   });
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

  const handleStatusToggle = (id) => {
    changeStaffStatus(id)
  }



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

  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
  };

  

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
      cell: (row) => `${row?.id_branch?.branch_name || "N/A"}`
    },
    {
      header: 'Project Name',
      cell: (row) => {
        const proj_name = row?.id_project.map((project) => project.project_name).join(', ');
        return proj_name;
      }
    },
    {
      header: "Actions",
      cell: (row, rowIndex) => (
        <Action
          row={row}
          data={projectAccessData}
          rowIndex={rowIndex}
          activeDropdown={activeDropdown}
          setActive={hanldeActiveDropDown}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ),
      sticky: "right",
    },
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
          isLoading={isLoading}
        />
        {/* {projectAccessData.length > 0 && (
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


