import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteContent,getContentTable } from "../../api/Endpoints"
import Loading from '../common/Loading';
import { useMutation } from '@tanstack/react-query';
import { useDebounce } from '../../hooks/useDebounce';
import { Search } from 'lucide-react';
import Table from "../../components/common/Table"
import usePagination from '../../../chit/hooks/usePagination'
import Modal from '../common/Modal';
import { eventEmitter } from '../../../../src/utils/EventEmitter';
import { useNavigate } from 'react-router-dom';
import { openModal } from "../../../redux/modalSlice";
import { toast } from 'react-toastify';

function ContentManagement() {

    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    const [isLoading, setIsLoading] = useState(false)
    const [contentData, setcontentData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [entries, Setentries] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [id, setId] = useState("")
    const dispatch = useDispatch()
    const [searchInput, setSearchInput] = useState('')

    const debouncedSearch = useDebounce(searchInput, 500)
    const limit = 10;

    const navigate = useNavigate()

    
  const { mutate: getalltableMutate } = useMutation({
    mutationFn: (payload) => getContentTable(payload),
    onSuccess: (response) => {

      if (response) {
        setcontentData(response.data);
        setTotalPages(response.totalPages)
        setCurrentPage(response.currentPage)
        Setentries(response.totalDocument)
     
      }
      setIsLoading(false)
    },
    onError: () => {
        setIsLoading(false)
      setcontentData([])
    }
  });

   useEffect(() => {
      getalltableMutate({ search: debouncedSearch, page: currentPage, limit: itemsPerPage });
    }, [currentPage, debouncedSearch, itemsPerPage]);
  

    const handleSearch = (e) => {
        setSearchInput(e.target.value)
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
    
    
      const handleView = (id) => {
        navigate(`/help/policy/view/${id}`)
      };
    
      const handleAddcontentitem = () => {
        navigate("/help/policy/add")
      };
    
    
      const handleDelete = (id) => {
        setId(id)
        dispatch(openModal({
          modalType: 'CONFIRMATION',
          header: 'Delete Policy',
          formData: {
            message: 'Are you sure you want to delete?',
            contentId: id
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


      const { mutate: deleteContentId } = useMutation({
        mutationFn: (id) => deleteContent(id),
        onSuccess: (response) => {
          if (response.message === "Content deleted successfully") {

            const deletedData = contentData.filter(e => e._id !== id)
            setcontentData(deletedData)

            const isLastItemOnPage = contentData.length === 1;
            const isNotFirstPage = currentPage > 1;

            if (isLastItemOnPage && isNotFirstPage) {
              setCurrentPage(prev => prev - 1);
            } else {
                getalltableMutate({ search: debouncedSearch, page: currentPage, limit: itemsPerPage });
            }
          }
          toast.success(response.message);
          eventEmitter.off("CONFIRMATION_SUBMIT");
       
        },
        onError: (error) => {
          console.error("Error:", error);
          toast.error("Failed to delete");
        },
      });
    
      useEffect(() => {
        const handleDelete = (data) => {
            deleteContentId(data.contentId);
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
 
    const type = [ 
        { id: "1", name: "Terms & Conditions" },
        { id: "2", name: "Privacy Policy" },
        { id: "3", name: "Return Policy" },
        { id: "4", name: "Refund Policy" } ]

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
                    top: rowIndex >= contentData.length - 2 ? 'auto' : '80%',
                    bottom: rowIndex >= contentData.length - 2 ? '-74%' : 'auto',
                    zIndex: 9999,
                    marginBottom: '0px',
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))'
                  }}
                >
                  <div className="w-32 rounded-md bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => {
                          handleView(row?._id);
                          setActiveDropdown(null);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        View
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
          header: 'Title',
          cell: (row) => row?.title || 'N/A',
        },
        {
            header: "Type",
            cell: (row) => {
              const contentType = row.type; 
              return type[contentType - 1]?.name || "N/A"; 
            },
        },
        {
          header: "Create Date",
          cell: (row) => formatDate(row?.createdAt) || "-"
        },
     
      ];
    

    return (

        <>
         <div className="flex flex-col p-4 relative">
      {isLoading ? (
        <div className='flex justify-center items-center mt-[150px]'><Loading /></div>
      ) : (
        <>
          <h2 className="text-2xl text-gray-900 font-bold">Legal Policies</h2>
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
                onClick={handleAddcontentitem}
                style={{ backgroundColor: layout_color }} >
                + Add Policy
              </button>
            </div>
          </div>

          <div className="mt-4">
            <Table
              data={contentData}
              columns={columns}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              pageSize={limit}
              isLoading={isLoading}
            />
          </div>

          {contentData.length > 0 && (
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
   
   
    </div>
        </>  
    );
}

export default ContentManagement