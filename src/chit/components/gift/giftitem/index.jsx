import React, { useState, useEffect } from 'react';
import Table from '../../common/Table';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getallgiftvendor, getallbranch, getallgiftitemtable, changegiftitemStatus, deletegiftitem, getgiftitemById, updategiftitem, addgiftitem } from '../../../api/Endpoints';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../../../redux/modalSlice';
import { eventEmitter } from '../../../../utils/EventEmitter';
import ModelOne from '../../common/Modelone';
import Modal from '../../../components/common/Modal';
import { useDebounce } from '../../../hooks/useDebounce';
import GiftHandOverForm from './GiftItemForm';
import Loading from '../../common/Loading';
import usePagination from '../../../hooks/usePagination'



const GiftHandOver = () => {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isviewOpen, setIsviewOpen] = useState(false);
  const [isLoading, setisLoading] = useState(true)
  const [id, setId] = useState("")


  const [giftitemData, setgiftitemData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [entries, Setentries] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [searchInput, setSearchInput] = useState('')

  const debouncedSearch = useDebounce(searchInput, 500)
  const limit = 10;

  useEffect(() => {
    getallgiftitemtableMutate({ search: debouncedSearch, page: currentPage, limit: itemsPerPage });
  }, [currentPage, debouncedSearch, itemsPerPage]);

  const refetchTable = () => {
    getallgiftitemtableMutate({ search: debouncedSearch, page: currentPage, limit: itemsPerPage });
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  function closeIncommingModal() {
    setIsviewOpen(false);
  }

  const { mutate: getallgiftitemtableMutate } = useMutation({
    mutationFn: (payload) => getallgiftitemtable(payload),
    onSuccess: (response) => {

      if (response) {
        setgiftitemData(response.data);
        setTotalPages(response.totalPages)
        setCurrentPage(response.currentPage)
        Setentries(response.totalDocument)
      }
      setisLoading(false)
    },
    onError: () => {
      setisLoading(false)
      setgiftitemData([])
    }
  });


  const handleStatusToggle = async (id, currentStatus) => {
    try {
      let response = await changegiftitemStatus(id);
      toast.success(response.message);

      setgiftitemData((prevData) =>
        prevData.map((giftitem) =>
          giftitem._id === id
            ? { ...giftitem, active: currentStatus === true ? false : true }
            : giftitem
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleEdit = (id) => {
    setId(id)
    setIsviewOpen(true)
  };



  const handleAddgiftitem = () => {
    setIsviewOpen(true)
  };


  const handleDelete = (id) => {
    setId(id)
    dispatch(openModal({
      modalType: 'CONFIRMATION',
      header: 'Delete giftitem',
      formData: {
        message: 'Are you sure you want to delete this giftitem?',
        giftitemId: id
      },
      buttons: {
        cancel: {
          text: 'Cancel'
        },
        submit: {
          text: 'Delete'
        }
      }
    }))

  }
  const { mutate: deleteGiftItem } = useMutation({
    mutationFn: (id) => deletegiftitem(id),
    onSuccess: (response) => {
      if (response.message === "Gift deleted successfully") {
        const deletedData = giftitemData.filter(e => e._id !== id)
        setgiftitemData(deletedData)
        const isLastItemOnPage = giftitemData.length === 1;
        const isNotFirstPage = currentPage > 1;
        if (isLastItemOnPage && isNotFirstPage) {
          setCurrentPage(prev => prev - 1);
        } else {
          refetchTable()
        }
      }
      toast.success(response.message);
      eventEmitter.off("CONFIRMATION_SUBMIT");
      setId("");
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Failed to delete");
    },
  });

  useEffect(() => {
    const handleDelete = (data) => {
      deleteGiftItem(data.giftitemId);
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


  const nextPage = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };


  const paginationData = { totalItems: totalPages, currentPage: currentPage, itemsPerPage: itemsPerPage, handlePageChange: handlePageChange }
  const paginationButtons = usePagination(paginationData)

  const formatDate = (date) => {
  
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

  const columns = [
    {
      header: 'S.No',
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: 'Actions',
      cell: (row, rowIndex) => (
        <div className="dropdown-container relative">
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
              className="absolute"
              style={{
                top: rowIndex >= giftitemData.length - 2 ? 'auto' : '72%',
                bottom: rowIndex >= giftitemData.length - 2 ? '-74%' : 'auto',
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
      header: 'Gift Name',
      cell: (row) => row?.gift_name || 'N/A',
    },
    {
      header: 'Vendor Name',
      cell: (row) => row?.gift_vendor?.vendor_name || 'N/A',
    },
    {
      header: "Create Date",
      cell: (row) => formatDate(row?.createdAt) || '-',
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

  const handleSearch = (e) => {
    setSearchInput(e.target.value)
  }

  return (
    <div className="flex flex-col p-4 relative">
      {isLoading ? (
        <div className='flex justify-center items-center mt-[150px]'><Loading /></div>
      ) : (
        <>
          <h2 className="text-2xl text-gray-900 font-bold">Gift Item</h2>
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
                onClick={handleAddgiftitem}
                style={{ backgroundColor: layout_color }} >
                + Add Gift Item
              </button>
            </div>
          </div>

          <div className="mt-4">
            <Table
              data={giftitemData}
              columns={columns}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              pageSize={limit}
              isLoading={isLoading}
            />
          </div>
          {giftitemData.length > 0 && (
            <div className="flex justify-between mt-4 p-2">

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
                <span className="text-gray-500">of entries {entries}</span>
              </div>

              <div className="flex flex-row items-center justify-center gap-2">
                <div className="flex items-center gap-4">
                  <button
                    onClick={prevPage}
                    readOnly={currentPage === 1}
                    className={`p-2 text-gray-500 rounded-md ${currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    Previous
                  </button>
                </div>

                <div className="flex flex-row items-center justify-center gap-2">
                  {paginationButtons}
                </div>

                <div className="flex items-center">
                  <button
                    onClick={nextPage}
                    readOnly={currentPage === totalPages}
                    className={`p-2 text-gray-500 rounded-md ${currentPage === totalPages ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    Next
                  </button>
                </div>
              </div>
              <Modal />
            </div>
          )}
        </>
      )}
      <ModelOne
        title={id ? "Edit GiftItem" : "Add GiftItem"}
        extraClassName='max-w-[75%] '
        setIsOpen={setIsviewOpen}
        isOpen={isviewOpen}
        closeModal={closeIncommingModal}

      >
        <GiftHandOverForm
          setId={setId}
          id={id}
          refetchTable={refetchTable}
          isviewOpen={isviewOpen}
          setIsOpen={setIsviewOpen}
        />
      </ModelOne>
      <Modal />
    </div>
  );
};

export default GiftHandOver;