import React, { useEffect, useState } from 'react';
import Table from '../../common/Table';
import { Search } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ModelOne from '../../common/Modelone';
import { useMutation } from '@tanstack/react-query';
import {
  // getallclient,
  getstaffusertable,
  changeStaffUserStatus,
  deleteStaffUser,
} from '../../../api/Endpoints';
// import { eventEmitter } from '../../../../utils/EventEmitter';
import { toast } from 'react-toastify';
import { useDebounce } from '../../../hooks/useDebounce';
import { setid } from '../../../../redux/clientFormSlice';
import StaffuserForm from './StaffuserForm';
import Action from '../../common/action';

const StaffUser = () => {
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [staffData, setStaffData] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  // const modal = useSelector((state) => state.modal);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);
  const [isviewOpen, setIsviewOpen] = useState(false);
  const [totalDocuments,setTotalDocuments]=useState(0)
  const roledata = useSelector((state) => state.clientForm.roledata);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  // const id_role = roledata?.id_role?.id_role;
  // const id_client = roledata?.id_client;
  // const id_branch = roledata?.branch;
  // const id_project = roledata?.id_project;

  function closeIncommingModal() {
    setIsviewOpen(false);
  }

  const handleEdit = (id) => {
    dispatch(setid(id));
    setIsviewOpen(true);
  };

  const { mutate: getAllgetstaffusertable } = useMutation({
    mutationFn: (formdata) => getstaffusertable(formdata),
    onSuccess: (response) => {
      if (response) {
        setStaffData(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalDocuments(response.data.totalCount)
      }
      setisLoading(false);
    },
    onError: (error) => {
      setisLoading(false);
      console.error('Error:', error);
    },
  });

  const { mutate: changeStaffStatus } = useMutation({
    mutationFn: (id) => changeStaffUserStatus(id),
    onSuccess: (response) => {
      if (response) {
        toast.success(response.message);
        getAllgetstaffusertable({
          page: currentPage,
          limit: itemsPerPage,
          from_date: '',
          to_date: '',
          search: debouncedSearch,
        });
      }
    },
    onError: (error) => {
      console.error('Error fetching roles:', error);
    },
  });

  const { mutate: deleteStaff } = useMutation({
    mutationFn: (id) => deleteStaffUser(id),
    onSuccess: (response) => {
      if (response) {
        toast.success(response.message);
        getAllgetstaffusertable({
          page: currentPage,
          limit: itemsPerPage,
          from_date: '',
          to_date: '',
          search: debouncedSearch,
        });
      }
    },
    onError: (error) => {
      console.error('Error fetching roles:', error);
    },
  });

  useEffect(() => {
    getAllgetstaffusertable({
      page: currentPage,
      limit: itemsPerPage,
      from_date: '',
      to_date: '',
      search: debouncedSearch,
    });
  }, [currentPage, itemsPerPage, debouncedSearch, isviewOpen]);

  const handleAddEmployeeClick = () => {
    setIsviewOpen(true);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleStatusToggle = (id) => {
    changeStaffStatus(id);
  };

  const handleDelete = (id) => {
    deleteStaff(id);
  };




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
      },
    },
    {
      header: 'Username',
      cell: (row) => row?.username,
    },
    {
      header: 'Roles',
      cell: (row) => {
        if (row?.id_role) {
          return `${row?.id_role.role_name || ''}`;
        } else {
          return '-';
        }
      },
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
      ),
    },

    {
      header: 'Branch',
      cell: (row) => {
        if (row?.id_branch) {
          return `${row?.id_branch.branch_name || ''}`;
        } else {
          return '-';
        }
      },
    },
    {
      header: 'Access Branch',
      cell: (row) => {
        if (typeof row?.access_branch === 'string') {
          return 'All branch';
        }
        if (typeof row?.access_branch === 'object' && row?.access_branch !== null) {
          return row?.access_branch.branch_name || '-';
        }
        return '-';
      },
    },
    {
      header: "Actions",
      cell: (row, rowIndex) => (
        <Action row={row} data={staffData} rowIndex={rowIndex} activeDropdown={activeDropdown} setActive={hanldeActiveDropDown}  handleEdit={handleEdit} handleDelete={handleDelete}/>
      ),
      sticky: "right",
    },
  ];

  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
  };
  
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
            className="rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
            onClick={handleAddEmployeeClick}
            style={{ backgroundColor: layout_color }}
          >
            + Add User
          </button>
        </div>
      </div>

      <div className="mt-4">
        <Table data={staffData} columns={columns} loading={isLoading} currentPage={currentPage} handleItemsPerPageChange={handleItemsPerPageChange} handlePageChange={handlePageChange} itemsPerPage={itemsPerPage} totalItems={totalDocuments} />
     

        <ModelOne
          title={'Create new user'}
          extraClassName="max-w-[60%]"
          setIsOpen={setIsviewOpen}
          isOpen={isviewOpen}
          closeModal={closeIncommingModal}
        >
          <StaffuserForm setIsOpen={setIsviewOpen} />
        </ModelOne>
      </div>
    </div>
  );
};

export default StaffUser;