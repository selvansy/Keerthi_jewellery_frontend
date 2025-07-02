import React, { useEffect, useState } from "react";
import Table from "../../common/Table";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  deletebranch,
  getallbranchtable,
  activatebranch,
} from "../../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import { useDebounce } from '../../../hooks/useDebounce';
import { toast } from "sonner";

import { useDispatch, useSelector } from 'react-redux';  
import Action from "../../common/action";
import { eventEmitter } from '../../../../utils/EventEmitter';
import { openModal } from '../../../../redux/modalSlice';
import Modal from '../../common/Modal';

const Branch = () => {

  const layout_color = useSelector((state) => state.clientForm.layoutColor); 
  const navigate = useNavigate();
  const [branchData, setBranchData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
   const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
   const [entries,Setentries] = useState(0)
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isLoading,setisLoading] = useState(true)
  let dispatch = useDispatch();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const { mutate: getallbranchtableMutate } = useMutation({
    mutationFn: (payload)=>  getallbranchtable(payload),
    onSuccess: (response) => {
      if (response) {
        setBranchData(response.data);
        setTotalPages(response.totalPages)
        setCurrentPage(response.currentPage)
        Setentries(response.totalDocuments)
      }
      setisLoading(false)
    },
    onError:()=>{
        setisLoading(false)
    }
  });

  useEffect(() => {
    getallbranchtableMutate({
      page: currentPage,
      limit: itemsPerPage,
      from_date: "",
      to_date: "",
      id_client: '',
      search: debouncedSearch,
    });
  }, [currentPage, itemsPerPage, debouncedSearch]);

  
  const handleCreateBranchClick = () => {
    navigate("/setup/branch/add");
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };


  const handleStatusToggle = async (id) => {
    let response = await activatebranch(id);
    if (response) {
      toast.success(response.message);
      setBranchData((prevData) =>
        prevData.map((branch) =>
          branch._id === id
            ? { ...branch, active: branch.active === true ? false : true }
            : branch
        )
      );
      getallbranchtableMutate();
    }
  };

  
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

  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
  };


  const handleEdit = (id) => {
    if (id) {
      navigate(`/setup/branch/edit/${id}`);
    }
  };

  // const { mutate: deletebranchMutate } = useMutation({
  //   mutationFn: deletebranch,
  //   onSuccess: (response) => {
  //     if (response) {
  //       toast.success(response.message);
  //       getallbranchtableMutate();
  //     }
  //   },
  // });


   const handleDelete = (id) => {
      
      setActiveDropdown(null);
      dispatch(openModal({
        modalType: 'CONFIRMATION',
        header: 'Delete Branch',
        formData: {
          message: 'Are you sure you want to delete?',
          branchId: id
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
  
     const { mutate: deleteMutate } = useMutation({
        mutationFn:(id)=> deletebranch(id),
        onSuccess: (response) => {
            const isLastItemOnPage = branchData.length === 1;
            const isNotFirstPage = currentPage > 1;
            if (isLastItemOnPage && isNotFirstPage) {
              setCurrentPage(prev => prev - 1);
            } 
            getallbranchtableMutate({
              page: currentPage,
              limit: itemsPerPage,
              from_date: "",
              to_date: "",
              id_client: '',
              search: debouncedSearch,
            });
            toast.success(response.message);
            eventEmitter.off("CONFIRMATION_SUBMIT");
          },
        onError: (error) => {
          console.error("Error:", error);
          toast.error(error.message);
        },
      });
    
      useEffect(() => {
        const handleDelete = (data) => {
          deleteMutate(data.branchId);
        };
    
        eventEmitter.on("CONFIRMATION_SUBMIT", handleDelete);
    
        return () => {
          eventEmitter.off("CONFIRMATION_SUBMIT", handleDelete);
        };
      }, []);


  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Branch Name",
      cell: (row) => row?.branch_name,
    },
    {
      header: "Phone Number",
      cell: (row) => row?.mobile,
    },
    {
      header: "Create Date",
      cell: (row) => formatDate(row?.createdAt),
    },
    {
      header: "Active",
      accessor: "active",
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
                ? "peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]"
                : "peer-checked:bg-gray-400 peer-checked:ring-gray-400"
            } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-white peer-hover:after:scale-95`}
          ></div>
        </label>
      ),
    },
    {
      header: "Actions",
      cell: (row, rowIndex) => (
        <Action
          row={row}
          data={branchData}
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
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">Branch</h2>
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
            onClick={handleCreateBranchClick}
            style={{ backgroundColor: layout_color }} >
            + Create Branch
          </button>
        </div>
      </div>

      <div className="mt-4">
      <Table
          data={branchData}
          columns={columns}
          isLoading={isLoading}
          currentPage={currentPage}
          handleItemsPerPageChange={handleItemsPerPageChange}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={entries}
          debounceSearch={handleSearch}
        />
       
      </div>
      <Modal />
    </div>
  );
};

export default Branch;
