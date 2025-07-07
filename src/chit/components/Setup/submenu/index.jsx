import React, { useState, useEffect } from "react";
import Table from "../../common/Table";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getallprojects,
  getallmenu,
  getallsubmenudatatable,
  changesubmenuStatus,
  deletesubmenu,
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
import SubmenuForm from "./SubmenuForm";
import usePagination from "../../../hooks/usePagination";
import Action from "../../common/action";
import plus from "../../../../assets/plus.svg";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";

const Submenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [isLoading, setisLoading] = useState(true);
  const [totalDocuments,setTotalDocuments]=useState()
  const [isviewOpen, setIsviewOpen] = useState(false);
  const [submenuData, setsubmenuData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [projects, setProjects] = useState([]);
  const [menus, setMenus] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [id,setId]=useState('')
  const limit = 10;

  function closeIncommingModal() {
    setIsviewOpen(false);
  }

  const { mutate: getallsubmenusMutate } = useMutation({
    mutationFn: (payload) => getallsubmenudatatable(payload),
    onSuccess: (response) => {
      if (response) {
        
        setsubmenuData(response.data);
        setTotalPages(response.totalPages);
        setTotalDocuments(response.totalDocument)
      }
      setisLoading(false);
    },
    onError: () => {
      setsubmenuData([])
      setisLoading(false);
    },
  });

  const { mutate: getallmenuMutate } = useMutation({
    mutationFn: getallmenu,
    onSuccess: (response) => {
      if (response) {
        setMenus(response.data);
      }
    },
  });

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      let response = await changesubmenuStatus(id);
      toast.success(response.message);

      setsubmenuData((prevData) =>
        prevData.map((submenu) =>
          submenu._id === id
            ? { ...submenu, active: currentStatus === true ? false : true }
            : submenu
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    getallsubmenusMutate({ search: debouncedSearch, page: currentPage, limit:itemsPerPage });
  }, [currentPage, itemsPerPage, debouncedSearch, isviewOpen]);

  const handleEdit = async (id) => {
    setId(id)
    setIsviewOpen(true);
  };

  const clearId =()=>{
    setId('')
  }

  const handleAddsubmenu = () => {
    setIsviewOpen(true);
  };

  const handleDelete = (id) => {
    dispatch(
      openModal({
        modalType: "CONFIRMATION",
        header: "Delete Submenu",
        formData: {
          message: "Are you sure you want to delete this submenu?",
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
        let response = await deletesubmenu(data.subid);
        toast.success(response.message);
        getallsubmenusMutate({ page: currentPage, limit: itemsPerPage });
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

  const nextPage = () => {
    setCurrentPage((prevPage) =>
      prevPage < totalPages ? prevPage + 1 : prevPage
    );
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
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
    getallmenuMutate();
    return () => {
      eventEmitter.off("EDIT_SUBMENU_SUBMIT");
      eventEmitter.off("CONFIRMATION_SUBMIT");
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest(".dropdown-container")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeDropdown]);

  const columns = [

    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * limit,
    },
    {
      header: "Sub Menu Name",
      accessor: "submenu_name",
    },
    {
      header: "Menu Name",
      accessor: "submenu_name",
    },
    {
      header: "Display Order",
      accessor: "display_order",
    },
    {
      header: "Path Url",
      accessor: "pathurl",
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
 className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-[#E7EEF5] p-[2px] after:duration-300 after:bg-[#004181] ${
              row?.active === true
                ? "peer-checked:bg-[#E7EEF5] peer-checked:ring-[#E7EEF5]"
                : "peer-checked:bg-[#E7EEF5] peer-checked:ring-gray-400"
            } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-[${layout_color}] peer-hover:after:scale-95`}          ></div>
        </label>
      ),
    },
    {
      header: "Actions",
      cell: (row, rowIndex) => (
        <Action row={row} data={submenuData} rowIndex={rowIndex} activeDropdown={activeDropdown} setActive={hanldeActiveDropDown}  handleEdit={handleEdit} handleDelete={handleDelete}/>
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

  const { mutate: getallprojectsMutate } = useMutation({
    mutationFn: getallprojects,
    onSuccess: (response) => {
      if (response) {
        setProjects(response.data);
      }
    },
  });

  useEffect(() => {
    getallsubmenusMutate({ search: debouncedSearch, page: currentPage, limit });
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    getallprojectsMutate();
    getallmenuMutate();
  }, []);

  useEffect(() => {
    eventEmitter.on("CONFIRMATION_SUBMIT", async (data) => {
      try {
        ;
        let response = await deletesubmenu(data.subid);
        toast.success(response.message);
        getallsubmenusMutate({ page: currentPage, limit: itemsPerPage });
      } catch (error) {
        console.error("Error deleting submenu:", error);
      }
    });

    return () => {
      eventEmitter.off("EDIT_SUBMENU_SUBMIT");
      eventEmitter.off("CONFIRMATION_SUBMIT");
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest(".dropdown-container")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeDropdown]);

  return (
    <div className="flex flex-col relative">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
         <Breadcrumb
                        items={[
                          { label: "Settings" },
                          { label: "Sub Menu", active: true },
                        ]}
                      />
        <div className="w-full flex flex-col bg-white border-[1px] rounded-[16px] p-4 ">
          {/* <h2 className="text-2xl text-gray-900 font-bold">Sub Menu</h2> */}
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
            <div className="relative w-full lg:w-1/3 min-w-[200px]">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="text-[#6C7086] h-5 w-5" />
              </div>
              <input
                onChange={handleSearch}
                placeholder="Search..."
                className="px-4 py-2 ps-9 border-2 border-[#F2F2F9] rounded-lg w-full h-[36px] text-md sm:w-[228px]"
              />
            </div>
            <div className="flex flex-row items-center justify-end gap-2">
              <button
                className="flex rounded-lg px-[20px] py-[8px] text-sm font-semibold text-white items-center whitespace-nowrap hover:bg-[#034571] transition-colors sm:w-auto"
                onClick={handleAddsubmenu}
                style={{ backgroundColor: layout_color }}
              >
                 <img src={plus} alt="plus" className="w-4 h-4 me-[10px]" />
                Add submenu
              </button>
            </div>
          </div>

          <div className="mt-4">
            <Table
              data={submenuData}
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
        <SubmenuForm
          menus={menus}
          setIsOpen={setIsviewOpen}
          getallsubmenusMutate={getallsubmenusMutate}
          id={id}
          clearId={clearId}
        />
      </ModelOne>
      <Modal />
      
    </div>
    
  );
};

export default Submenu;