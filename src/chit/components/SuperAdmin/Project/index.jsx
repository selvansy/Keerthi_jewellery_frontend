import React, { useState, useEffect } from 'react';
import Table from '../../common/Table';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getallprojecttable, changeprojectstatus, deleteproject, getprojectbyid, updateproject, addproject } from '../../../api/Endpoints';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { openModal } from '../../../../redux/modalSlice';
import { eventEmitter } from '../../../../utils/EventEmitter';
import { useSelector, useDispatch } from 'react-redux';
import Modal from '../../common/Modal';
import { useDebounce } from '../../../hooks/useDebounce';
import { setid } from "../../../../redux/clientFormSlice"
import { Formik } from 'formik';
import * as Yup from 'yup';
import ModelOne from '../../common/Modelone';
import Action from "../../common/action";


const ProjectMaster = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [projectData, setProjectData] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isviewOpen, setIsviewOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 500)
  const [isLoading, setisLoading] = useState(true)


  const limit = 10;
  function closeIncommingModal() {
    setIsviewOpen(false);
  }
  const { mutate: getallprojecttableMutate } = useMutation({
    mutationFn: (data) =>
      getallprojecttable(data),
    onSuccess: (response) => {
      if (response) {
        setProjectData(response.data);
        // setTotalPages(response?.totalPages)
        // setCurrentPage(response?.currentPage)
        // Setentries(response?.totalDocument)
      }
      setisLoading(false)
    },
    onError: () => {
      setisLoading(false)
    }
  });

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      let response = await changeprojectstatus(id);
      toast.success(response.message);

      setProjectData((prevData) =>
        prevData.map((project) =>
          project._id === id
            ? { ...project, active: currentStatus === true ? false : true }
            : project
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    getallprojecttableMutate({ page: currentPage, limit });
  }, [currentPage, itemsPerPage, debouncedSearch, isviewOpen]);


  const handlePageChange = (page) => {

    const pageNumber = Number(page);
    if (!pageNumber || isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
      return;
    }

    setCurrentPage(pageNumber);

  };

  const handleEdit = (id) => {
    setIsviewOpen(true);
    dispatch(setid(id))
  };

  const handleaddproject = () => {
    setIsviewOpen(true);
  };




  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };




  const { mutate: handleDelete } = useMutation({
    mutationFn: (id) => deleteproject(id),
    onSuccess: (response) => {
      if (response) {
        toast.success(response.message)
        getallprojecttable({
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
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
  };

  const columns = [

    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: 'Project Name',
      accessor: 'project_name',
    },
    {
      header: 'Status',
      accessor: 'active',
      cell: (row) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={row?.active === true}
            onChange={() => handleStatusToggle(row?._id, row?.active)}
          />
          <div
            className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-black p-[2px] after:duration-300 after:bg-black ${row.active === true
              ? 'peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]'
              : 'peer-checked:bg-gray-400 peer-checked:ring-gray-400'
              } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-white peer-hover:after:scale-95`}
          ></div>
        </label>
      )
    },
    {
      header: "Actions",
      cell: (row, rowIndex) => (
        <Action
          row={row}
          data={projectData}
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

  return (
    <div className="flex flex-col p-4 relative">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h2 className="text-2xl text-gray-900 font-bold">Project Master</h2>
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
            <div className="relative w-full lg:w-1/3 min-w-[200px]">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="text-gray-500" />
              </div>
              <input
                placeholder="Search..."
                className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
              />
            </div>
            <div className="flex flex-row items-center justify-end gap-2">
              <button
                className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
                onClick={handleaddproject}
                style={{ backgroundColor: layout_color }} >
                + Add Project
              </button>
            </div>
          </div>

          <div className="mt-4">
            {/* <Table
              data={projectData}
              columns={columns}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              pageSize={limit}
              isLoading={isLoading}
            /> */}
              <Table
          data={projectData}
          columns={columns}
          isLoading={isLoading}
          currentPage={currentPage}
          handleItemsPerPageChange={handleItemsPerPageChange}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={projectData.length}
        />
          </div>
          {/* {projectData.length > 0 && (
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
        </>
      )}
      <ModelOne
        title={"Add Project"}
        setIsOpen={setIsviewOpen}
        isOpen={isviewOpen}
        closeModal={closeIncommingModal}
        extraClassName="w-1/3"
      >
        <ProjectForm
          setIsOpen={setIsviewOpen}
          isLoading={isLoading}
        />
      </ModelOne>
      <Modal />
    </div>
  );
};

export default ProjectMaster;



export const ProjectForm = ({ isLoading, setIsOpen }) => {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [formData, setFormData] = useState({
    project_name: ''
  })

  let dispatch = useDispatch();
  const id = useSelector((state) => state.clientForm.id);

  const ProjectSchema = Yup.object().shape({
    project_name: Yup.string().required('Project Name is required'),
  });

  const handleSubmit = (formData) => {

    try {
      const updateData = {
        project_name: formData.project_name,
      };
      setIsOpen(false)
      if (id) {
        updateprojectmutate(id, updateData);
      } else {
        addprojectMutate(updateData);
      }


    } catch (error) {
      console.error('Error updating schemetype:', error);
    }
  }

  const { mutate: addprojectMutate } = useMutation({
    mutationFn: addproject,
    onSuccess: (response) => {
      toast.success(response.message)
      setFormData({
        id_branch: "",
        id_client: "",
        id_project: []
      });

      dispatch(setid(null))
      setIsOpen(false)
      navigate('/superadmin/project')
    },
    onError: (error) => {
      toast.error(error.response.message)
    }
  });
  const { mutate: updateprojectmutate } = useMutation({
    mutationFn: updateproject,
    onSuccess: (response) => {
      toast.success(response.message);
      dispatch(setid(null))
      setIsOpen(false)
      navigate('/superadmin/project')
    },
    onError: (error) => {
      toast.error(error.response.message);
    },
  });


  const handleCancel = (resetForm) => {
    resetForm();
    dispatch(setid(null))
    setIsOpen(false)
  }

  const { mutate: getProjectId } = useMutation({
    mutationFn: getprojectbyid,
    onSuccess: (response) => {
      if (response) {
        setFormData({
          project_name: response.data.project_name
        });
      }
    },
  });


  useEffect(() => {
    if (id) {
      getProjectId(id)
    }
  }, [id])


  return <>

    <Formik
      initialValues={formData}
      validationSchema={ProjectSchema}
      enableReinitialize={true}
      onSubmit={(values) => {
        handleSubmit(values)
      }}
    >
      {({ values, errors, handleBlur, handleSubmit, resetForm, handleChange }) => (
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700">
              Project Name<span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="project_name"
              value={values.project_name}
              onChange={handleChange}
              placeholder="Enter Project Name"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.project_name && <div className="text-red-500 text-sm">{errors.project_name}</div>}

          </div>
          <div className="bg-white p-2 border-t-2 border-gray-300 mt-4">
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
                onClick={() => handleCancel(resetForm)}
              >
                Cancel
              </button>
              {!id ? (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  readOnly={isLoading}
                  className=" text-white rounded-md p-2 w-full lg:w-20"
                  style={{ backgroundColor: layout_color }} >
                  Submit
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  readOnly={isLoading}
                  className=" text-white rounded-md p-2 w-full lg:w-20"
                  style={{ backgroundColor: layout_color }} >
                  Update
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Formik>

  </>
}