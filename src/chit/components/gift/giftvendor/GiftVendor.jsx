import React, { useState, useEffect } from 'react';
import Table from '../../common/Table';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getallgiftvendor,getallbranch, getAllgiftvendors, changegiftvendorStatus, deletegiftvendor, getgiftvendorById, updategiftvendor, addgiftvendor } from '../../../api/Endpoints';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { openModal } from '../../../../redux/modalSlice';
import { eventEmitter } from '../../../../utils/EventEmitter';
import { useDispatch } from 'react-redux';
import Modal from '../../../components/common/Modal';
import { useDebounce } from '../../../hooks/useDebounce';

const Giftvendor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [giftvendorData, setgiftvendorData] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null)
  const [totalPages, setTotalPages] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [branch, setBranch] = useState([]);
  const [searchInput,setSearchInput]=useState('')
  const [isLoading,setisLoading] = useState(true)

  const debouncedSearch = useDebounce(searchInput, 500)
  const limit = 10;

  const { mutate: getAllgiftvendorsMutate } = useMutation({
    mutationFn:(payload)=> getAllgiftvendors(payload),
    onSuccess: (response) => {
      if (response) {
        setgiftvendorData(response.data);
        setTotalPages(Math.ceil(response.data.total / limit));
       
      }
      setisLoading(false)
    },
    onError:()=>{
      setisLoading(false)
    }
  });

  const { mutate: getallbranchMutate } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
    
      if (response) {
        setBranch(response.data);
      }
    },
  });



  const handleStatusToggle = async (id, currentStatus) => {
    try {
      let response = await changegiftvendorStatus(id);
      toast.success(response.message);

      setgiftvendorData((prevData) =>
        prevData.map((giftvendor) =>
          giftvendor._id === id
            ? { ...giftvendor, active: currentStatus === true ? false : true }
            : giftvendor
        )
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    getAllgiftvendorsMutate({ search:debouncedSearch,page: currentPage, limit:limit });
  }, [currentPage,debouncedSearch]);


  useEffect(() => {
  
    getAllgiftvendorsMutate({ search:debouncedSearch,page: currentPage, limit:limit })
    getallbranchMutate();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = async (id) => {
    const dataToSend = { id: id };
    let response = await getgiftvendorById(dataToSend);

    dispatch(openModal({
      modalType: 'EDIT_GIFTVENDOR',
      header: 'Edit Gift Vendor',
      formData: {
        giftvendorId: id,
        vendor_name: response.data.vendor_name,
        mobile: response.data.mobile,
        gst: response.data.gst,
        address: response.data.address,
        id_branch:response.data.id_branch,
        branchfilter: branch
      },
      buttons: {
        cancel: {
          text: 'Cancel'
        },
        submit: {
          text: 'Update'
        }
      }
    }));

    eventEmitter.on('EDIT_GIFTVENDOR_SUBMIT', async (formData) => {
  
      try {
        const updateData = {
          id: formData.giftvendorId,
          vendor_name: formData.vendor_name,
          mobile: formData.mobile,
          gst: formData.gst,
          address: formData.address,
          id_branch:formData.id_branch,
          branchfilter: branch
        };
    
        const response = await updategiftvendor(formData.giftvendorId, updateData);
        if (response.status === 200) {
          toast.success(response.data.message);
          getAllgiftvendorsMutate({ page: currentPage, limit });
        }
        
      } catch (error) {
        console.error('Error updating giftvendor:', error);
      }
    });
  };

  const handleAddgiftvendor = async () => {

    dispatch(openModal({
      modalType: 'ADD_GIFTVENDOR',
      header: 'Add Gift Vendor',
      formData: {
        vendor_name: '',
        mobile: '',
        gstNo: '',
        address: '',
        id_branch:'',
        branchfilter: branch
      },
      buttons: {
        cancel: {
          text: 'Cancel'
        },
        submit: {
          text: 'Add'
        }
      }
    }));

    eventEmitter.on('ADD_GIFTVENDOR_SUBMIT', async (formData) => {

      try {

        const updateData = {
          vendor_name: formData.vendor_name,
          mobile: formData.mobile,
          gst: formData.gst,
          address: formData.address,
          id_branch: formData.id_branch
        };
   
          const response = await addgiftvendor(updateData);
          if (response.status === 200) {
            toast.success(response.data.message);
            getAllgiftvendorsMutate({ page: currentPage, limit });
            navigate('/giftvendor');
          }
        
      } catch (error) {
        console.error('Error updating giftvendor:', error);
      }
    });
  };

  const handleDelete = (id) => {
    dispatch(openModal({
      modalType: 'CONFIRMATION',
      header: 'Delete giftvendor',
      formData: {
        message: 'Are you sure you want to delete this giftvendor?',
        giftvendorId: id
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
        console.log(data);
        let response = await deletegiftvendor(data.giftvendorId);
        toast.success(response.message);
        getAllgiftvendorsMutate({ page: currentPage, limit });
      } catch (error) {
        console.error('Error deleting gift vendor:', error);
      }
    });
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
        className={`p-2 w-10 h-10 rounded-md ${currentPage === i ? ' text-white' : 'bg-gray-300 text-gray-900'}`}
        style={{ backgroundColor: layout_color }} >
        {i}
      </button>
    );
  }



  useEffect(() => {
    return () => {
      eventEmitter.off('EDIT_GIFTVENDOR_SUBMIT');
      eventEmitter.off('CONFIRMATION_SUBMIT');
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  const columns = [
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
                top: rowIndex >= giftvendorData.length - 2 ? 'auto' : '72%',
                bottom: rowIndex >= giftvendorData.length - 2 ? '-74%' : 'auto',
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
      header: 'S.No',
      cell: (_, index) => index + 1 + (currentPage - 1) * limit,
    },
    {
      header: 'Vendor Name',
      accessor: 'vendor_name',
    },
    {
      header: 'Mobile',
      accessor: 'mobile',
    },
    {
      header: 'Address',
      accessor: 'address',
    },
    {
      header: 'Gst',
      accessor: 'gst',
    },
    {
      header: "Create Date",
      cell: (row) => {
        const date = new Date(row?.createdAt);
        return date.toLocaleDateString('en-GB'); // 'en-GB' gives the d-m-Y format
      }
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
    }
  
  ];

  const handleSearch=(e)=>{
    setSearchInput(e.target.value)
  }

  return (
    <div className="flex flex-col p-4 relative">
     
        <>
          <h2 className="text-2xl text-gray-900 font-bold">Gift Vendor</h2>
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
            <div className="relative w-full lg:w-1/3 min-w-[200px]">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="text-gray-500" />
              </div>
              <input
              onChange={handleSearch}
                placeholder="Search..."
                className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
              />
            </div>
            <div className="flex flex-row items-center justify-end gap-2">
              <button
                className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
                onClick={handleAddgiftvendor}
                style={{ backgroundColor: layout_color }} >
                + Add Gift Vendor
              </button>
            </div>
          </div>

          <div className="mt-4">
            <Table
              data={giftvendorData}
              columns={columns}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              pageSize={limit}
              isLoading={isLoading}
            />
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
        </>
    
      <Modal />
    </div>
  );
};

export default Giftvendor;