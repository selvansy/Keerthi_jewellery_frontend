import React, { useState, useEffect } from "react";
import Table from "../../common/Table";
import { Search } from "lucide-react";
import { data, useNavigate } from "react-router-dom";
import {
    NotifcationsHistory,
 
} from "../../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { openModal } from "../../../../redux/modalSlice";
import { eventEmitter } from "../../../../utils/EventEmitter";
import { useSelector, useDispatch } from "react-redux";
import Modal from "../../common/Modal";
import ModelOne from "../../common/Modelone";
import { useDebounce } from "../../../hooks/useDebounce";
import usePagination from "../../../hooks/usePagination";
import SpinLoading from "../../common/spinLoading";
import Loading from "../../common/Loading";


function NotificationHistory() {

    const layout_color = useSelector((state) => state.clientForm.layoutColor);
      const roledata = useSelector((state) => state.clientForm.roledata);
        const branch = roledata?.branch;
    
        const branchAccess = Number(branch);
  
    const dispatch = useDispatch();
    const [notiData, setnotiData] = useState([]);
    
    const [isLoading, setisLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [doc, setDocument] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 500);
    const [searchLoading, setSearchLoading] = useState(false);
  
    const limit = 10;


    const { mutate: getallNotificationsTable } = useMutation({
      mutationFn: (payload) => NotifcationsHistory(payload),
      onSuccess: (response) => {
        if (response) {
          setnotiData(response.data);
          setTotalPages(response.totalPages);
          setDocument(response.totalDocument)
        }
        setSearchLoading(false);
        setisLoading(false);
      },
      onError: (error) => {
      
        setnotiData([]);
        setSearchLoading(false);
      },
    });
  
    // const handleStatusToggle = async (id, currentStatus) => {
    //   try {
    //     let response = await changenotistatus(id);
    //     toast.success(response.message);
  
    //     setnotiData((prevData) =>
    //       prevData.map((noti) =>
    //         noti._id === id
    //           ? { ...noti, active: currentStatus === true ? false : true }
    //           : noti
    //       )
    //     );
    //   } catch (error) {
    //     console.error("Error updating status:", error);
    //   }
    // };
  
    useEffect(() => {
      getallNotificationsTable({
        search: debouncedSearch,
        page: currentPage,
        limit: itemsPerPage,
        currentPage,
      });
    }, [currentPage, itemsPerPage, debouncedSearch]);
  
  
    // const handleDelete = (id) => {
    //   setId(id);
    //   dispatch(
    //     openModal({
    //       modalType: "CONFIRMATION",
    //       header: "Delete Notifications",
    //       formData: {
    //         message: "Are you sure you want to delete this Notifications?",
    //         notiId: id,
    //       },
    //       buttons: {
    //         cancel: {
    //           text: "Clear",
    //         },
    //         submit: {
    //           text: "Delete",
    //         },
    //       },
    //     })
    //   );
    // };
  
    // const { mutate: deleteDepartment } = useMutation({
    //   mutationFn: (id)=> deletenoti(id),
    //   onSuccess: (response) => {
        
    //       const isLastItemOnPage = notiData.length === 1;
    //       const isNotFirstPage = currentPage > 1;
    //       if (isLastItemOnPage && isNotFirstPage) {
    //         setCurrentPage(prev => prev - 1);
    //       } else {
           
    //         getallNotificationsTable({
    //           search: debouncedSearch,
    //           page: currentPage,
    //           limit: itemsPerPage,
    //         });
          
    //       toast.success(response.message);
    //       eventEmitter.off("CONFIRMATION_SUBMIT");
    //       setId("");
    //     }
    //   },
    //   onError: (error) => {
    //     console.error("Error:", error);
    //     toast.error("Failed to delete noti");
    //   },
    // });
  
    // useEffect(() => {
    //   const handleDelete = (notiId) => {
    //     deleteDepartment(notiId.notiId);
    //   };
  
    //   eventEmitter.on("CONFIRMATION_SUBMIT", handleDelete);
  
    //   return () => {
    //     eventEmitter.off("CONFIRMATION_SUBMIT", handleDelete);
    //   };
    // }, []);
  
    // useEffect(() => {
    //   const handleClickOutside = (event) => {
    //     if (activeDropdown && !event.target.closest(".dropdown-container")) {
    //       setActiveDropdown(null);
    //     }
    //   };
  
    //   document.addEventListener("click", handleClickOutside);
    //   return () => document.removeEventListener("click", handleClickOutside);
    // }, [activeDropdown]);
  
    const columns = [
      {
        header: "S.No",
        cell: (_, index) => index + 1 + (currentPage - 1) * limit,
      },
      {
        header: "Notification ID",
        cell: (row) => row?.pushCount,
      },
      {
        header: "Notification Title",
        cell: (row) => row?.pushCount,
      },
      {
        header: "Push Count",
        cell: (row) => row?.pushCount,
      },
      {
        header: "Push FailCount",
        cell: (row) => row?.pushFailCount,
      },
      {
        header: "Notification Content",
        cell: (row) => row?.pushFailCount,
      },
      {
        header: "Target Audience (All Users/Specific Group) ",
        cell: (row) => row?.pushFailCount,
      },
      {
        header: "Sent Date",
        cell: (row) =>{
          const date = new Date(row?.createdAt);
          return date.toLocaleDateString("en-GB") || "-"; 
        },
      },
      {
        header: "Approved Date",
        cell: (row) =>{
          const date = new Date(row?.updatedAt);
          return date.toLocaleDateString("en-GB") || "-"; 
        },
      },
      {
        header: "Delivery Status",
        cell: (row, rowIndex) => (
          (row.status === "pending") ? 
          <div className="dropdown-container relative">
                <div className={`${branchAccess !== 0 ? "cursor-not-allowed" : "cursor-pointer"} lg:w-20  rounded-md shadow-lg bg-[#d7b56d] ring-1 ring-black ring-opacity-5`}>
                  <div>
                    <button
                      className={`${branchAccess !== 0 ? "cursor-not-allowed" : "cursor-pointer"} lg:w-20  text-center p-2 text-sm text-gray-700 font-semibold flex items-center gap-2`}
                      disabled={branchAccess !== 0}
                      onClick={() => {
                        handleEdit(row);
                      }}
                    >
                      Pending
                    </button>
                  
                  </div>
                </div>
          </div>
          :
          <div className="dropdown-container relative">
          <div className={`${branchAccess !== 0 ? "cursor-not-allowed" : "cursor-pointer"} lg:w-20 rounded-md shadow-lg bg-[#61a375] ring-1 ring-black ring-opacity-5`}>
            <div>
              <button
                className={`lg:w-20 text-center p-2 text-sm text-gray-700 font-semibold flex items-center gap-2`}
                disabled={branchAccess !== 0}
              >
                Sent
              </button>
            
            </div>
          </div>
    </div>
        ),
        sticky: "right",
    
      }
    ];
  
    const handleSearch = (e) => {
      setSearchLoading(true);
      setSearchInput(e.target.value);
    };
  
    const handleItemsPerPageChange = (value) => {
      setItemsPerPage(value);
      setCurrentPage(1);
    };
  
    const handlePageChange = (page) => {
      const pageNumber = Number(page);
      if (
        !pageNumber ||
        isNaN(pageNumber) ||
        pageNumber < 1 ||
        pageNumber > totalPages
      ) {
        return;
      }
  
      setCurrentPage(pageNumber);
    };
  
    const nextPage = () => {
      setCurrentPage((prevPage) => {
        console.log("prevPage:", prevPage, "totalPages:", totalPages);
        return prevPage < totalPages ? prevPage + 1 : prevPage;
      });
    };
  
    const prevPage = () => {
      setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
    };
    
    const paginationData = {
      totalItems: totalPages,
      currentPage: currentPage,
      itemsPerPage: itemsPerPage,
      handlePageChange: handlePageChange,
    };
    const paginationButtons = usePagination(paginationData);
  return (

     <div className="flex flex-col p-4 relative">
        <>
          <h2 className="text-2xl text-gray-900 font-bold">Notifications Summary</h2>
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
            <div className="relative w-full lg:w-1/3 min-w-[200px]">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                {searchLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
                ) : (
                  <Search className="text-gray-500" />
                )}
              </div>
              <input
                onChange={handleSearch}
                placeholder="Search..."
                className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
              />
            </div>
            {/* <div className="flex flex-row items-center justify-end gap-2">
              <button
                className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
                onClick={handleaddnoti}
                style={{ backgroundColor: layout_color }}
              >
                + Add Notifications
              </button>
            </div> */}
          </div>
  
          <div className="mt-4">
            <Table
              data={notiData}
              columns={columns}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              pageSize={limit}
              isLoading={isLoading}
            />
          </div>
  
        {
            notiData.length > 0 &&(
                <div className="flex justify-between mt-4 p-2">
                <div className={`flex flex-row items-center justify-center gap-2  `}>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={prevPage}
                      readOnly={currentPage === 1}
                     
                      className={`p-2 text-gray-500 rounded-md ${currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"} `}
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
                      
                      className={`p-2 text-gray-500 rounded-md  ${currentPage === totalPages ? "cursor-not-allowed" : "cursor-pointer"}`}
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
                  <span className="text-gray-500">{doc} entries </span>
                </div>
              </div>
            )
        }
        </>
        <Modal />
      </div>
  )
}

export default NotificationHistory