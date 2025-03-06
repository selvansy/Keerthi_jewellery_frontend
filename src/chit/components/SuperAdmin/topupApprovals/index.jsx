import React, { useState, useEffect } from "react";
import Table from "../../common/Table";
import { Search } from "lucide-react";
import { data, useNavigate } from "react-router-dom";
import {
  topupTable,
  updateStatus,
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


const topupApprovals = () => {

    const layout_color = useSelector((state) => state.clientForm.layoutColor);
  
    const dispatch = useDispatch();
    const [topupData, settopupData] = useState([]);
    const [isviewOpen, setIsviewOpen] = useState(false);
    const [status, setStatus] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 500);
    const [searchLoading, setSearchLoading] = useState(false);
  
    const limit = 10;

    function closeIncommingModal() {
      setIsviewOpen(false);
    }


    const clearstatus = () => {
        setStatus("");
      };
    
      const handleEdit = (status) => {
        setIsviewOpen(true);
        setStatus(status);
      };
    
      const handleaddDept = () => {
        setIsviewOpen(true);
      };

  
    const { mutate: getallTopuptableMutate } = useMutation({
      mutationFn: (payload) => topupTable(payload),
      onSuccess: (response) => {
        if (response) {
         
          settopupData(response.data);
          setTotalPages(response.totalPages);
          setCurrentPage(response.currentPage)
        }
        setSearchLoading(false);
        setisLoading(false);
      },
      onError: (error) => {
      
        settopupData([]);
        setSearchLoading(false);
      },
    });

  
    useEffect(() => {
        getallTopuptableMutate({
        search: debouncedSearch,
        page: currentPage,
        limit: itemsPerPage,
        currentPage,
      });
    }, [currentPage, itemsPerPage, debouncedSearch, isviewOpen]);
  

  
    const columns = [
      {
        header: "S.No",
        cell: (_, index) => index + 1 + (currentPage - 1) * limit,
      },
      {
        header: "Type",
        cell: ({ SMS, WhatsApp, Email }) => 
          ["SMS", "WhatsApp", "Email"].filter((type, i) => [SMS, WhatsApp, Email][i]).join(", ") || "-",
      },      
      {
        header: "Limit Request",
        cell: (row) => row?.limitRequest,
      },
      {
        header: "Limit Rate",
        cell: (row) => row?.limitRate,
      },
      {
        header: "Request Date",
        cell: (row) =>{
          const date = new Date(row?.requestedDate);
          return date.toLocaleDateString("en-GB") || "-"; 
        },
      },
      {
        header: "Approved Date",
        cell: (row) =>{
          const date = new Date(row?.requestedDate);
          return date.toLocaleDateString("en-GB") || "-"; 
        },
      },
      {
        header: "Request Amount",
        cell: (row) => row?.requestedAmount,
      },
      {
        header: "Actual Amount",
        cell: (row) => row?.actualAmount,
      },
      {
        header: "Date",
        cell: (row) =>{
          const date = new Date(row?.createdAt);
          return date.toLocaleDateString("en-GB") || "-"; 
        },
      },
    
      {
      
      
        header: "Actions",
        cell: (row, rowIndex) => (
          (row.status === 0) ? 
          <div className="dropdown-container relative">
                <div className="rounded-md shadow-lg bg-[#d7b56d] ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 font-semibold flex items-center gap-2"
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
          <div className="rounded-md shadow-lg bg-[#61a375] ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              <button
                className="w-full text-left px-4 py-2 text-sm text-white font-semibold flex items-center gap-2"
              >
                Approved
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
          <h2 className="text-2xl text-gray-900 font-bold">Top History</h2>
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

          </div>
  
          <div className="mt-4">
            <Table
              data={topupData}
              columns={columns}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              pageSize={limit}
              isLoading={isLoading}
            />
          </div>
  
        {
            topupData.length > 0 &&(
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
                  <span className="text-gray-500">entries</span>
                </div>
              </div>
            )
        }
        </>
  
        <ModelOne
          title="Approve Topup"
          extraClassName="max-w-[75%] "
          setIsOpen={setIsviewOpen}
          isOpen={isviewOpen}
          closeModal={closeIncommingModal}
        >
          <TopupForm closeIncommingModal={closeIncommingModal} status={status} clearstatus={clearstatus} />
        </ModelOne>
        <Modal />
      </div>
    );
  };
  
  export default topupApprovals;


  export const TopupForm = ({closeIncommingModal,clearstatus,status }) => {
   
    const layout_color = useSelector((state) => state.clientForm.layoutColor);
  
    const [formData, setFormData] = useState({});
  
    const [formErrors, setFormErrors] = useState({});
    const [isLoading,setIsLoading]=useState(false)
   
    useEffect(() => {
      
      setFormData(status)

      return () => {
        clearstatus();
      };
    }, []);


  
    const handleSubmit = () => {
      if (!validateForm()) {
        return;
      }
      setIsLoading(true);
    
      try {
        const updatedFormData = { ...formData, status: 1 }; 
    
        console.log("Updated Form Data:", updatedFormData); 

        updateTopupStatus({ id: status._id, data: updatedFormData });
    
      } catch (error) {
        console.error("Error submitting form:", error);
        setIsLoading(false); 
      }
    };
    
    const { mutate: updateTopupStatus } = useMutation({
      mutationFn: (payload) => updateStatus(payload), 
      onSuccess: (response) => {
        if (response) {
          toast.success(response.message)
        }
        setIsLoading(false); 
      },
      onError: (error) => {
        console.error("Mutation Error:", error);
        settopupData([]);
        setIsLoading(false);
      },
    });
    



    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    };
  
    const validateForm = () => {
      const errors = {};
  
      if (!formData.requestedAmount) {
        errors.requestedAmount = "Amount is required";
      }
      if (!formData.remarks) {
        errors.remarks = "Remarks is required";
      }
  
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };
  
    return (
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">
            Amount<span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="requestedAmount"
            value={formData.requestedAmount}
            onChange={handleChange}
            minLength={"2"}
            placeholder="Enter Topup Amount"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formErrors.requestedAmount && (
            <div className="text-red-500 text-sm">{formErrors.requestedAmount}</div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">
            Remarks<span className="text-red-400">*</span>
          </label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            minLength={2}
            placeholder="Enter remarks"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>

          {formErrors.remarks && (
            <div className="text-red-500 text-sm">{formErrors.remarks}</div>
          )}
        </div>
  
        <div className="bg-white p-2 mt-6">
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
              onClick={closeIncommingModal}
            >
              Close
            </button>
  
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className=" text-white rounded-md p-2 w-full lg:w-20"
              style={{ backgroundColor: layout_color }}
            >
              {isLoading ? <SpinLoading/>: "Save"}
            </button>
          </div>
        </div>
      </div>
    );
  };
  



