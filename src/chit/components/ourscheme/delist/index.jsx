import React, { useState, useEffect,useCallback} from "react";
import Table from "../../common/Table";
import { useNavigate,useLocation} from "react-router-dom";

import {
  getDelistedSchemes,
  deleteScheme,
  changeschemestatus
} from "../../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { openModal } from "../../../../redux/modalSlice";
import { eventEmitter } from "../../../../utils/EventEmitter";
import { useSelector, useDispatch } from "react-redux";
import ModelOne from "../../common/Modelone";
import Modal from "../../common/Modal";
import { useDebounce } from "../../../hooks/useDebounce";
import { setid } from "../../../../redux/clientFormSlice";
import usePagination from "../../../hooks/usePagination";
import Action from "../../common/action";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";

const Delist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation()

  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [isLoading, setisLoading] = useState(true);
  const [totalDocuments,setTotalDocuments]=useState()
  const [isviewOpen, setIsviewOpen] = useState(false);
  const [schemes, schemesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [menus, setMenus] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [bred,setBred]= useState('')
  const [id,setId]=useState('')

  function closeIncommingModal() {
    setIsviewOpen(false);
  }

  const { mutate: getList, isLoading: isFetching } = useMutation({
    mutationFn: getDelistedSchemes,
    onSuccess: (response) => {
      if (response) {
        schemesData(response.data);
        setTotalDocuments(response.totalDocument);
        setTotalPages(Math.ceil(response.totalDocument / itemsPerPage));
        setisLoading(isFetching);
      }
    },
    onError: (error) => {
      toast.error("Failed to fetch delisted schemes");
      setisLoading(isFetching);
    },
  });

  useEffect(() => {
    getList({ search: debouncedSearch, page: currentPage, limit: itemsPerPage });
  }, [currentPage, itemsPerPage, debouncedSearch, isviewOpen]);

  const handleStatusToggle = async (id) => {
    try {
      let response = await changeschemestatus(id);
      if(response){
        getList({ search: debouncedSearch, page: currentPage, limit: itemsPerPage });
      }
      toast.success(response.message);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleEdit = useCallback(
    (id) => navigate(`/scheme/addscheme/${id}`),
    [navigate]
  );

  const clearId =()=>{
    setId('')
  }

  const handleDelete = (id) => {
    dispatch(
      openModal({
        modalType: "CONFIRMATION",
        header: "Delete Scheme",
        formData: {
          message: "Are you sure you want to delete this scheme?",
          subid: id,
        },
        buttons: {
          cancel: {
            text: "Cancel",
          },
          submit: {
            text: "Delete",
          },
        },
      })
    );

    eventEmitter.on("CONFIRMATION_SUBMIT", async (data) => {
      try {
        let response = await deleteScheme(data.subid);
        toast.success(response.message);
        getList({ search: debouncedSearch, page: currentPage, limit: itemsPerPage });
      } catch (error) {
        console.error("Error deleting submenu:", error);
      }
    });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      getallsubmenusMutate({ search: debouncedSearch, page, limit: itemsPerPage });
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const paginationData = {
    totalItems: totalPages,
    currentPage: currentPage,
    itemsPerPage: itemsPerPage,
    handlePageChange: handlePageChange,
  };
  const paginationButtons = usePagination(paginationData);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest(".dropdown-container")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeDropdown]);

  const handleDigiGold = useCallback(
    (id) => navigate(`/scheme/editdigigold/${id}`),
    [navigate]
  );

  const columns = [

    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Scheme Name",
      accessor: "scheme_name",
    },
    {
      header: "Metal type",
      accessor: "metal_name",
    },
    {
      header: "Classification",
      accessor: "classification_name",
    },
    {
        header: "Installment type",
        accessor: "installment_type",
      },
    {
      header: "Maturiyt Period",
      accessor: "maturity_period",
    },
    {
        header: "Scheme Type",
        accessor: "schemetype_name",
      },
    {
      header: "Status",
      accessor: "active",
      cell: (row) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={row?.active === true}
            onChange={() => handleStatusToggle(row?._id, row?.active)}
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
        <Action row={row} data={schemes} rowIndex={rowIndex} activeDropdown={activeDropdown} setActive={hanldeActiveDropDown}  
        handleEdit={ ![10, 14].includes(row.scheme_type) ? handleEdit : handleDigiGold}
         handleDelete={handleDelete}
         showEdit={row.is_accounts !== true}
         showDelete= {row.is_accounts !== true}
         cancel={row.is_accounts}
         />
      ),
      sticky: "right",
    },
  ];

  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest(".dropdown-container")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeDropdown]);

useEffect(() => {
    if (location.pathname) {
      const formatPath = (path) => {
        return path
          .replace(/^\//, "") 
          .replace(/^(\w)/, (match) => match.toUpperCase()) 
          .replace(/\/(\w)/g, (match, p1) => "/" + p1.toUpperCase());
      };

      const formattedPath = formatPath(location.pathname);
      setBred(formattedPath)
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col relative">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* <h6 className="text-gray-900 font-normal mb-4">{bred}</h6> */}
          {/* <div className="flex flex-col gap-4 lg:flex-row lg:justify-end lg:items-center mt-4">
            <div className="flex flex-row items-center justify-end gap-2">
              <button
                className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
                onClick={navigateToSchemes}
                style={{ backgroundColor: layout_color }}
              >
                Go To schemes
              </button>
            </div>
          </div>  */}
          <Breadcrumb
                          items={[
                            { label: "Settings" },
                            { label: "Menu", active: true },
                          ]}
                        />
                    <div className="w-full flex flex-col bg-white border-[1px] rounded-[16px] p-4">
          <div className="mt-4">
            <Table
              data={schemes}
              columns={columns}
              currentPage={currentPage}
              handleItemsPerPageChange={handleItemsPerPageChange}
              handlePageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={totalDocuments}
              loading={isLoading}
            />
          </div>
        </div>
        </>
      )}
      {/* <Modal /> */}

      <ModelOne
        title={id?"Edit Sub Menu":"Add Sub Menu"}
        extraClassName="w-1/3"
        setIsOpen={setIsviewOpen}
        isOpen={isviewOpen}
        closeModal={closeIncommingModal}
      >
        {/* <SubmenuForm
          menus={menus}
          setIsOpen={setIsviewOpen}
          getallsubmenusMutate={getallsubmenusMutate}
          id={id}
          clearId={clearId}
        /> */}
      </ModelOne>
      <Modal />
      
    </div>
    
  );
};

export default Delist;