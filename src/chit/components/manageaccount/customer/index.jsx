import React, { useState, useEffect } from 'react'
import Table from '../../common/Table'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { getcustomertable, getallbranch, changecustomerStatus, deletecustomer } from '../../../api/Endpoints'
import { ExportToExcel } from '../../common/Dropdown/Excelexport';
import { ExportToPDF } from '../../common/Dropdown/ExportPdf';
import { toast } from 'react-toastify';

import { eventEmitter } from '../../../../utils/EventEmitter';
import { openModal } from '../../../../redux/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../common/Modal';
import { useDebounce } from '../../../hooks/useDebounce'
import DatePicker from "react-datepicker";
import { SlidersHorizontal, Search, X } from 'lucide-react'
import { CalendarDays, RefreshCcw } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import usePagination from '../../../hooks/usePagination'
import ExportDropdown from '../../common/Dropdown/Export'
import Action from '../../common/action'
import { Breadcrumb } from '../../common/breadCumbs/breadCumbs'
import ActiveDropdown from '../../common/ActiveDropdown'


const ExistingCusTable = () => {

 
  const [isLoading, setisLoading] = useState(true)
 
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalDocument,setTotalDoc] = useState(0)
    const [searchLoading, setSearchLoading] = useState(false);
  

  const [filtered, SetFiltered] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [customerData, setcustomerData] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
   const [activeFilter, setActiveFilter] = useState(null)

  const [search, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const roledata = useSelector((state) => state.clientForm.roledata);
 
  const id_branch = roledata?.branch;
  const [branchList, setBranchList] = useState([]);

  const [from_date, setFromdate] = useState("");
  const [to_date, setTodate] = useState("");
  const [filters, setFilters] = React.useState({
    from_date: "",
    to_date: "",
    search: debouncedSearch,
    limit: itemsPerPage,
    id_branch: id_branch,
    type: "",
  });


  const handlePageChange = (page) => {

    const pageNumber = Number(page);
      if (!pageNumber || isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
        return;
      }
   
      setCurrentPage(pageNumber);
    
  };

  useEffect(() => {
    const payload={
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
      from_date: "",
      to_date: "",
      id_branch: filters.id_branch,
      active:activeFilter
    }
    getcustomertableMutate(payload);
  }, [currentPage, itemsPerPage, debouncedSearch,activeFilter]);




  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleAddcustomerClick = () => {
    navigate('/managecustomers/addcustomer')
  }

  const { mutate: getcustomertableMutate } = useMutation({
    mutationFn: (payload) => getcustomertable(payload),
    onSuccess: (response) => {
  
      if (response?.data) {
        setcustomerData(response.data);
        setTotalPages(response.totalPages);
        setTotalDoc(response.totalDocument)
      }
      setSearchLoading(false)
      setisLoading(false)
    },
    onError: () => {
      setSearchLoading(false)
      setisLoading(false)
    }
  });

 


  const handleReset = () => {
    setFromdate("");
    setTodate("");
    setFilters(prev => ({ ...prev, id_branch: id_branch }));
    SetFiltered(false)
    toast.success("Filter is cleared");
    getcustomertableMutate({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
      from_date: "",
      to_date: "",
      id_branch: filters.id_branch,
      active:activeFilter
    });
  }
  const handleClickfilter = (e) => {
    getallbranchmutate();
    setIsFilterOpen(true);
  }

  const { mutate: getallbranchmutate } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      setBranchList(response.data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

 

  const handleEdit = (id) => {
  
    navigate(`/managecustomers/editcustomer/${id}`);
  }


    const handleDelete = (id) => {

      setActiveDropdown(null);
      dispatch(openModal({
        modalType: 'CONFIRMATION',
        header: 'Delete Scheme',
        formData: {
          message: 'Are you sure you want to delete?',
          customerId: id
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
  
  
    };

     const { mutate: deletecustomerMutate } = useMutation({
        mutationFn:(id)=> deletecustomer(id),
        onSuccess: (response) => {
        
            const isLastItemOnPage = customerData.length === 1;
            const isNotFirstPage = currentPage > 1;
            if (isLastItemOnPage && isNotFirstPage) {
              setCurrentPage(prev => prev - 1);
            } else {
              const payload = {
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch,
                from_date: from_date,
                to_date: to_date,
                id_branch: filters.id_branch,
                active:activeFilter
            }
              getcustomertableMutate(payload);
            
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
          deletecustomerMutate(data.customerId);
        };
    
        eventEmitter.on("CONFIRMATION_SUBMIT", handleDelete);
    
        return () => {
          eventEmitter.off("CONFIRMATION_SUBMIT", handleDelete);
        };
      }, []);


  const handleStatusToggle = async (id) => {
    let response = await changecustomerStatus(id);
    if (response) {
      toast.success(response.message);
      setcustomerData((prevData) =>
        prevData.map((customer) =>
          customer._id === id
            ? { ...customer, active: customer.active === true ? false : true }
            : customer
        )
      );
      getcustomertableMutate({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
        from_date: from_date,
        to_date: to_date,
        id_branch: filters.id_branch,
        active:activeFilter
      });
    }
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };
  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
  };
 
  const columns = [
    {
      header: 'S.No',
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: 'Customer Name',
      cell: (row) => `${row?.firstname} ${row?.lastname || ""}`,
    },
    {
      header: "Mobile",
      cell: (row) => `${row?.mobile}`,
    },
    {
      header: "Referral No",
      cell: (row) => `${row?.referral_code?.toUpperCase()}`,
    },
    {
      header: "Joined schemes",
      cell: (row) => `${row?.schemesCount}`,
    },
    {
      header: "Create Date",
      cell: (row) => formatDate(row?.date_add)
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
 className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-[#E7EEF5] p-[2px] after:duration-300 after:bg-[#004181] ${
              row?.active === true
                ? "peer-checked:bg-[#E7EEF5] peer-checked:ring-[#E7EEF5]"
                : "peer-checked:bg-[#E7EEF5] peer-checked:ring-gray-400"
            } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-[${layout_color}] peer-hover:after:scale-95`}          ></div>
        </label>
      )
    },
    {
      header: "Actions",
      cell: (row, rowIndex) => (
        <Action row={row} data={customerData} rowIndex={rowIndex} activeDropdown={activeDropdown} setActive={hanldeActiveDropDown}  handleEdit={handleEdit} handleDelete={handleDelete}/>
      ),
      sticky: "right",
    },

  ];

  return (
    <>
          <Breadcrumb
            items={[{ label: "Manage Customers" }, { label: "Existing Customer", active: true }]}
          />
    
          <div className="flex flex-col p-4  bg-white border border-[#F2F2F9]  rounded-[16px]">
    
            <div className="flex flex-col gap-4 mt-4 sm:flex-row sm:justify-between sm:items-center">
              {/* Search Input - Full width on mobile, moves to right side on desktop */}
              <div className="relative w-full  sm:mb-0 sm:order-2 sm:w-auto">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {searchLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
                  ) : (
                    <Search className="text-black" />
                  )}
                </div>
                <input
                  onChange={(e) => {
                    setSearchLoading(true);
                    setSearchInput(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search"
                  className="px-4 py-2 ps-9 border-2 border-[#F2F2F9] rounded-[8px] w-full sm:w-[228px]"
                />
              </div>
    
              {/* Container for ActiveDropdown and Add Category button */}
              <div className="flex flex-row w-full sm:order-1 sm:w-auto sm:mr-auto">
                {/* ActiveDropdown - half width on mobile */}
                <div className="w-1/2 sm:w-auto me-1">
                  <ActiveDropdown setActiveFilter={setActiveFilter} />
                </div>
    
                {/* Button - half width on mobile, moves to right on desktop */}
                <div className="w-1/2 sm:hidden">
                  <button
                    type="button"
                    className="rounded-md px-4 py-2 text-white whitespace-nowrap hover:bg-[#034571] transition-colors w-full"
    
                    style={{ backgroundColor: layout_color }}
                    onClick={handleAddcustomerClick}
                  >
                     + Add Customer
                  </button>
                </div>
              </div>
    
              {/* Desktop-only button - appears on the right side */}
              <div className="hidden sm:block sm:order-3">
                <button
                  type="button"
                  className="rounded-md px-4 py-2 text-white whitespace-nowrap hover:bg-[#034571] transition-colors w-full" style={{ backgroundColor: layout_color }}
                  onClick={handleAddcustomerClick}
                >
                    + Add Customer
                </button>
              </div>
            </div>
    
            <div className="mt-4">
              <Table
                data={customerData}
                columns={columns}
                isLoading={isLoading}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={totalDocument}
                handleItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
            
            <Modal />
          </div>
        </>
  )
}

export default ExistingCusTable