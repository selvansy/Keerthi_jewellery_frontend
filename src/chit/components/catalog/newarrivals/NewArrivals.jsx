import React, { useEffect, useState } from "react";
import Table from "../../common/Table";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getnewarrivalsTable,
  getallbranch,
  getBranchById,
  getallmetal,
  deletenewarrivals,
  activatecategory,
  allofferstype,
  activatenewarrivals,
} from "../../../api/Endpoints";
import { CalendarDays, RefreshCcw } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { setid } from "../../../../redux/clientFormSlice";
import { useSelector, useDispatch } from "react-redux";
import { eventEmitter } from "../../../../utils/EventEmitter";
import { openModal } from "../../../../redux/modalSlice";
import Modal from "../../../components/common/Modal";
import usePagination from "../../../hooks/usePagination";
import { useDebounce } from "../../../hooks/useDebounce";
import Action from "../../common/action";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";
import ActiveDropdown from "../../common/ActiveDropdown";
import plus from "../../../../assets/plus.svg";

const NewArrivals = () => {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(true);

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);
  let id_client = roledata?.id_client;
  const id_branch = roledata?.branch;
  let dispatch = useDispatch();
  const [branchList, setBranchList] = useState([]);
  let [branch, setbranch] = useState("");
  const [newarrivalsData, setnewarrivalsData] = useState([]);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filtertype, setOfferstype] = useState([]);
  const [filtermetaltype, setMetaltype] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [from_date, setFromdate] = useState("");
  const [to_date, setTodate] = useState("");
  const [filters, setFilters] = React.useState({
    from_date: "",
    to_date: "",
    limit: itemsPerPage,
    id_branch: id_branch,
    type: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const handleReset = (e) => {
    setFromdate("");
    setTodate("");
    setFilters((prev) => ({
      ...prev,
      added_by: "",
      id_branch: id_branch,
      type: "",
    }));
    toast.success("Filter is cleared");
    const filterTosend = {
      page: currentPage,
      from_date: from_date,
      to_date: to_date,
      limit: itemsPerPage,
      search: "",
      type: "",
      id_branch: id_branch,
    };

    getnewarrivalsData({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
      id_branch: id_branch,
    });
  };

  useEffect(() => {
    if (id_branch === "0") {
      branchbyClient();
    }
    if (id_branch !== "0") {
      setFilters({ ...filters, id_branch: id_branch });
    }
  }, [id_branch]);

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

  const filterInputchange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyfilterdatatable = (e) => {
    e.preventDefault();
    const filterTosend = {
      from_date: from_date,
      to_date: to_date,
      limit: itemsPerPage,
      id_branch: filters.id_branch,
      type: filters.type,
    };

    setIsFilterOpen(false);
    getnewarrivalsData(filterTosend);
  };

  //mutation to get offers type
  const { mutate: getallofferstype } = useMutation({
    mutationFn: allofferstype,
    onSuccess: (response) => {
      setOfferstype(response.data);
    },
    onError: (error) => {
      console.error("Errors:", error);
    },
  });

  //mutation to get category type
  const { mutate: getallMetals } = useMutation({
    mutationFn: getallmetal,
    onSuccess: (response) => {
      setMetaltype(response.data);
    },
    onError: (error) => {
      console.error("Errors:", error);
    },
  });

  useEffect(() => {
    if (isFilterOpen === true) {
      getallMetals();
      getallofferstype();
    }
  }, [isFilterOpen]);

  //mutation to get scheme type
  const { mutate: getnewarrivalsData } = useMutation({
    mutationFn: (data) => getnewarrivalsTable(data),
    onSuccess: (response) => {
      setnewarrivalsData(response.data);
      setSearchLoading(false);
      setTotalPages(response.totalPages);
      setTotalDocuments(response.totalDocuments);
      setisLoading(false);
    },
    onError: (err) => {
      setSearchLoading(false);
    },
  });

  useEffect(() => {
    getnewarrivalsData({
      page: currentPage,
      limit: itemsPerPage,
      search: search,
      id_branch: id_branch,
      active:activeFilter
    });
  }, [currentPage, itemsPerPage, search,activeFilter]);

  const handleSearch = (e) => {
    setSearchLoading(true);
    setSearch(e.target.value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/catalog/addnewarrivals");
  };

  const handleStatusToggle = async (id) => {
    let response = await activatenewarrivals(id);
    if (response.message) {
      toast.success(response.message);
      getnewarrivalsData({
        page: currentPage,
        limit: itemsPerPage,
        search: search,
        id_branch: id_branch,
        active:activeFilter
      });
    }
  };

  useEffect(() => {
    const handleDelete = (id) => {
      deleteNewArrivals(id);
    };

    eventEmitter.on("CONFIRMATION_SUBMIT", handleDelete);

    return () => {
      eventEmitter.off("CONFIRMATION_SUBMIT", handleDelete);
    };
  }, []);

  const handleDelete = (id) => {
    dispatch(
      openModal({
        modalType: "CONFIRMATION",
        header: "Delete New Arrivals",
        formData: {
          message: "Are you sure you want to delete?",
          newArrivalsId: id,
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
  };

  //mutation to get purity type
  const { mutate: deleteNewArrivals } = useMutation({
    mutationFn: ({ newArrivalsId }) => deletenewarrivals(newArrivalsId),
    onSuccess: (response) => {
      const isLastItemOnPage = newarrivalsData.length === 1;
      const isNotFirstPage = currentPage > 1;
      if (isLastItemOnPage && isNotFirstPage) {
        setCurrentPage((prev) => prev - 1);
      } else {
        getnewarrivalsData({
          page: currentPage,
          limit: itemsPerPage,
          search: search,
          id_branch: id_branch,
          active:activeFilter
        });
      }
      toast.success(response.message);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const handleEdit = (id) => {
    dispatch(setid(id));
    navigate(`/catalog/editnewarrivals/${id}`);
  };

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Product Name",
      cell: (row) => row?.product_name,
    },
    // {
    //   header: "Image",
    //   cell: (row) => (
    //     <div className="w-12 h-12 rounded overflow-hidden">
    //       <img
    //         src={`${row.pathurl}${row.images_Url[0]}`}
    //         alt={row?.branchName || "Preview"}
    //         className="w-full h-full object-cover"
    //       />
    //     </div>
    //   ),
    // },
    {
      header: "Start Date",
      cell: (row) => {
        const date = new Date(row?.start_date);
        return date.toLocaleDateString("en-GB");
      },
    },
    {
      header: "End Date",
      cell: (row) => {
        const date = new Date(row?.end_date);
        return date.toLocaleDateString("en-GB");
      },
    },
    {
      header: "Create Date",
      cell: (row) => {
        const date = new Date(row?.createdAt);
        return date.toLocaleDateString("en-GB"); // 'en-GB' gives the d-m-Y format
      },
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
            className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-[#E7EEF5] p-[2px] after:duration-300 after:bg-[#004181] ${
              row?.active === true
                ? "peer-checked:bg-[#E7EEF5] peer-checked:ring-[#E7EEF5]"
                : "peer-checked:bg-[#E7EEF5] peer-checked:ring-gray-400"
            } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-[${layout_color}] peer-hover:after:scale-95`}
          ></div>
        </label>
      ),
    },
    {
      header: "Actions",
      cell: (row, rowIndex) => (
        <Action
          row={row}
          data={newarrivalsData}
          rowIndex={rowIndex}
          activeDropdown={activeDropdown}
          setActive={hanldeActiveDropDown}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          showDelete={true}
        />
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

  const paginationData = {
    totalItems: totalPages,
    currentPage: currentPage,
    itemsPerPage: itemsPerPage,
    handlePageChange: handlePageChange,
  };
  const paginationButtons = usePagination(paginationData);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Catalogue" },
          { label: "New Arrivals", active: true },
        ]}
      />

      <div className="flex flex-col p-4 bg-white border border-[#F2F2F9]  rounded-[16px] ">
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
              className="px-4 py-2 ps-9 border-2 border-[#F2F2F9] rounded-lg h-[36px] text-md w-full sm:w-[228px]"
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
                + Create New Arrivals
              </button>
            </div>
          </div>

          {/* Desktop-only button - appears on the right side */}
          <div className="hidden sm:block sm:order-3">
            <button
              className="flex rounded-lg px-[20px] py-[8px] text-sm font-semibold text-white items-center whitespace-nowrap hover:bg-[#034571] transition-colors sm:w-auto min-w-[135px]"
              onClick={handleClick}
              style={{ backgroundColor: layout_color }}
            >
                <img src={plus} alt="plus" className="w-4 h-4 me-[10px]" />
               Create New Arrivals
            </button>
          </div>
        </div>

        <div className="mt-4">
          <Table
            data={newarrivalsData}
            columns={columns}
            loading={isLoading}
            currentPage={currentPage}
            handleItemsPerPageChange={handleItemsPerPageChange}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalDocuments}
          />
        </div>

        <Modal />
      </div>
    </>
  );
};

export default NewArrivals;
