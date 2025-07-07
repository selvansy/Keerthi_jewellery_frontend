import React, { useEffect, useState } from 'react'
import Table from '../../common/Table'
import { SlidersHorizontal, Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import { toast } from 'react-toastify'
import { CalendarDays, RefreshCcw } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Modal from '../../../components/common/Modal';
import { eventEmitter } from '../../../../utils/EventEmitter';
import { openModal } from '../../../../redux/modalSlice';
import { setid } from "../../../../redux/clientFormSlice"
import plus from "../../../../assets/plus.svg";

import {
  getoffersTable, getBranchById, allofferstype, activateoffers, deleteoffers, allmetal, getallbranch
} from "../../../api/Endpoints";

import { useDispatch, useSelector } from 'react-redux'
import Action from '../../common/action'
import { useDebounce } from '../../../hooks/useDebounce'
import ActiveDropdown from '../../common/ActiveDropdown'
import { Breadcrumb } from '../../common/breadCumbs/breadCumbs'

const Offers = () => {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);
  let id_client = roledata?.id_client;
  const [isLoading,setisLoading] = useState(true)
 
  const id_branch = roledata?.branch;


  let dispatch = useDispatch();
  const navigate = useNavigate()
  const [offerData, setofferData] = useState([])
  const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [deleteId,setDeleteId]=useState(null)
  const [branchList, setBranchList] = useState([]);
  let [branch, setbranch] = useState("")
  const [totalDocument,setTotalDocuments]=useState(0)
  const [filtertype, setOfferstype] = useState([]);
  const [filtermetaltype, setMetaltype] = useState([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [from_date, setFromdate] = useState("");
    const [activeFilter, setActiveFilter] = useState(null)

  const [to_date, setTodate] = useState("");

  const [filters, setFilters] = React.useState({
    from_date: null,
    to_date: null,
    limit: itemsPerPage,
    id_branch: id_branch,
    type: "",
  });

  const [searchLoading,setSearchLoading]=useState(false)

  const handleReset = (e) => {
    setFromdate("");
    setTodate("");
    setFilters(prev => ({
      ...prev, added_by: '',
      id_branch: id_branch,
      type: ""
    }));
    toast.success("Filter is cleared");
    const filterTosend = {
      page: currentPage,
      from_date: from_date,
      to_date: to_date,
      limit: itemsPerPage,
      search: "",
      type: "",
      id_branch: id_branch
    };

    getofferData({ page: currentPage, limit: itemsPerPage, search: debouncedSearch,id_branch:id_branch })
  }
  useEffect(() => {
    if (id_branch === '0') {
      branchbyClient()
    }
    if (id_branch !== "0" && isFilterOpen === true) {
      setFilters({ ...filters, id_branch: id_branch })
    }

  }, [id_branch]);


  useEffect(() => {
    if (isFilterOpen === true) {
      getallofferstype();
    }
  }, [isFilterOpen])





  const filterInputchange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));

  };

  const applyfilterdatatable = (e) => {
    e.preventDefault();
    const filterTosend = {
      from_date: from_date,
      to_date: to_date,
      limit: itemsPerPage,
      id_branch: filters.id_branch,
      type: filters.type

    };

    if (from_date !== "" && to_date !== "" && filters.type !== "" && filters.id_branch !== "") {
      
      //  getcategoryData(filterTosend);
      setIsFilterOpen(false)
      setFromdate("")
      setTodate("")
      setFilters({
        from_date: null,
        to_date: null,
        limit: itemsPerPage,
        id_branch: id_branch,
        type: "",
      })
    }
  };

  //mutation to get offers type
  const { mutate: getallofferstype } = useMutation({
    mutationFn: allofferstype,
    onSuccess: (response) => {
      setOfferstype(response.data);
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });


  //mutation to get category type
  const { mutate: getallmetal } = useMutation({
    mutationFn: allmetal,
    onSuccess: (response) => {
      setMetaltype(response.data);
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });

  const { mutate: branchbyClient } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      setBranchList(response.data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const { mutate: branchbyId } = useMutation({
    mutationFn: getBranchById,
    onSuccess: (response) => {
      
      setbranch(response.data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });


  //mutation to get scheme type
  const { mutate: getofferData } = useMutation({
    mutationFn: (payload)=> getoffersTable(payload),
    onSuccess: (response) => {
      setisLoading(false)
      setofferData(response.data)
      setTotalPages(response.data.totalPages)
      setTotalDocuments(response.totalDocuments)
      setSearchLoading(false)
    },
    onError: (error) => {
      setSearchLoading(false)
      console.error('Error:', error);
      setofferData([]);
      setisLoading(false)
    }
  });

  
  useEffect(() => {
    getofferData({ page: currentPage, limit: itemsPerPage, search: debouncedSearch,id_branch:id_branch,active:activeFilter })
  }, [currentPage, itemsPerPage, debouncedSearch,activeFilter])

  const handleSearch = (e) => {
    setSearchLoading(true)
    setSearch(e.target.value)
  }

  const handleClick = (e) => {
    e.preventDefault();
    navigate('/catalog/addoffers');
  }

  const handleStatusToggle = async (id) => {
    let response = await activateoffers(id);
    if (response.message){
      getofferData({ page: currentPage, limit: itemsPerPage, search: debouncedSearch,id_branch:id_branch,active:activeFilter })

      toast.success(response.message);
    }else{
      toast.success(response.message);
    }
  };



  const handleDelete = (id) => {
    setActiveDropdown(null);
    setDeleteId(id)
    dispatch(openModal({
      modalType: 'CONFIRMATION',
      header: 'Delete Scheme',
      formData: {
        message: 'Are you sure you want to delete?',
        OfferId: id
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

  //mutation to get purity type
  const { mutate: deleteOffer } = useMutation({
    mutationFn: deleteoffers,
    onSuccess: (response) => {
      getofferData({ page: currentPage, limit: itemsPerPage, search: debouncedSearch,id_branch:id_branch,active:activeFilter })
      setDeleteId(null)
      toast.success(response.message);
    },
   
    onError: (error) => {
      eventEmitter.off('CONFIRMATION_SUBMIT');
      console.error("Error fetching countries:", error);
    },
  });


  useEffect(() => {
    eventEmitter.on('CONFIRMATION_SUBMIT', async (data) => {
      try {

        deleteOffer(data.OfferId);

      } catch (error) {
        console.error('Error:', error);
      }
    });
    return () => {
      eventEmitter.off('CONFIRMATION_SUBMIT');
    };
  }, []);




  const handleEdit = (id) => {
    navigate(`/catalog/editoffers/${id}`);
  };

  const columns = [
    {
      header: 'S.No',
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: 'Display Type',
      cell: (row) => row?.type,
    },
    

    {
      header: "Image",
      cell: (row) => 
        row.offer_image?.length > 0 ? (
          <div className="w-12 h-12 rounded overflow-hidden">
            <img 
              src={`${row.pathurl}${row.offer_image[0]}`} 
              alt={row?.branchName || "Preview"}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <span className="text-sm text-gray-500">-</span>
        )
    },
    {
      header: "Create Date",
      cell: (row) => {
        const date = new Date(row?.createdAt);
        return date.toLocaleDateString('en-GB'); // 'en-GB' gives the d-m-Y format
      }
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
        <Action row={row} data={offerData} rowIndex={rowIndex} activeDropdown={activeDropdown} setActive={hanldeActiveDropDown}  handleEdit={handleEdit} handleDelete={handleDelete}/>
      ),
      sticky: "right",
    },
   
  ];

  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
  };

  const handleItemsPerPageChange = (value) => {

    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Breadcrumb items={[
        {label:"Catelogue"},
        {label:"Offers",active:true}
      ]}/>
    <div className="flex flex-col p-4  bg-white border border-[#F2F2F9]  rounded-[16px]">
      <div className="flex flex-col gap-4 mt-4 sm:flex-row sm:justify-between sm:items-center">
          {/* Search Input - Full width on mobile, moves to right side on desktop */}
          <div className="relative w-full  sm:mb-0 sm:order-2 sm:w-auto">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {searchLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
              ) : (
                <Search className="text-[#6C7086] h-5 w-5" />
              )}
            </div>
            <input
               onChange={handleSearch}
              placeholder="Search"
              className="px-4 py-2 ps-9 border-2 border-[#F2F2F9] rounded-lg w-full h-[36px] text-md sm:w-[228px]"
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
                className="rounded-md px-4 py-2 text-white whitespace-nowrap hover:bg-[#034571] transition-colors w-full"
                 onClick={handleClick}
                style={{ backgroundColor: layout_color }}
              >
                + Create offers
              </button>
            </div>
          </div>

          {/* Desktop-only button - appears on the right side */}
          <div className="hidden sm:block sm:order-3">
            <button
              className="flex rounded-lg px-[20px] py-[8px] text-sm font-semibold text-white items-center whitespace-nowrap hover:bg-[#034571] transition-colors sm:w-auto"
               onClick={handleClick}
              style={{ backgroundColor: layout_color }}
            >
              <img src={plus} alt="plus" className="w-4 h-4 me-[10px]" />
               Create Offers
            </button>
          </div>
        </div>


      


      <div className="mt-4">
        <Table
          data={offerData}
          columns={columns}
          loading={isLoading}
          currentPage={currentPage}
          handleItemsPerPageChange={handleItemsPerPageChange}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalDocument}
        />
      </div>
     
      <Modal />
    </div>
    </>
  )
}

export default Offers