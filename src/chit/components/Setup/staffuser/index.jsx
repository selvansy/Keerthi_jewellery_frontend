import React, { useEffect, useState } from "react";
import Table from "../../common/Table";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ModelOne from "../../common/Modelone";
import { useMutation } from "@tanstack/react-query";
import {
  getstaffusertable,
  changeStaffUserStatus,
  deleteStaffUser,
} from "../../../api/Endpoints";
import { toast } from "sonner";
import { useDebounce } from "../../../hooks/useDebounce";
import { setid } from "../../../../redux/clientFormSlice";
import StaffuserForm from "./StaffuserForm";
import Action from "../../common/action";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";
import ActiveDropdown from "../../common/ActiveDropdown";
import plus from "../../../../assets/plus.svg";

const StaffUser = () => {
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [staffData, setStaffData] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [isviewOpen, setIsviewOpen] = useState(false);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // Default to "all"

  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const handleEdit = (id) => {
    dispatch(setid(id));
    setIsviewOpen(true);
  };

  function closeIncommingModal() {
    setIsviewOpen(false);
  }

  const { mutate: getAllgetstaffusertable } = useMutation({
    mutationFn: (formdata) => getstaffusertable(formdata),
    onSuccess: (response) => {
      if (response) {
        setStaffData(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalDocuments(response.data.totalCount);
      }
      setisLoading(false);
      setSearchLoading(false);
    },
    onError: (error) => {
      setisLoading(false);
      setSearchLoading(false);
      console.error("Error:", error);
    },
  });

  const { mutate: changeStaffStatus } = useMutation({
    mutationFn: (id) => changeStaffUserStatus(id),
    onSuccess: (response) => {
      if (response) {
        toast.success(response.message);
        fetchStaffData();
      }
    },
    onError: (error) => {
      console.error("Error fetching roles:", error);
    },
  });

  const { mutate: deleteStaff } = useMutation({
    mutationFn: (id) => deleteStaffUser(id),
    onSuccess: (response) => {
      if (response) {
        toast.success(response.message);
        fetchStaffData();
      }
    },
    onError: (error) => {
      console.error("Error fetching roles:", error);
    },
  });

  const fetchStaffData = () => {
    let activeStatus;
    if (activeFilter === true) activeStatus = true;
    else if (activeFilter === false) activeStatus = false;
    
    getAllgetstaffusertable({
      page: currentPage,
      limit: itemsPerPage,
      from_date: "",
      to_date: "",
      search: debouncedSearch,
      active: activeFilter !== "all" ? activeStatus : undefined,
    });
  };

  useEffect(() => {
    fetchStaffData();
  }, [currentPage, itemsPerPage, debouncedSearch, isviewOpen, activeFilter]);

  const handleAddEmployeeClick = () => {
    setIsviewOpen(true);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleStatusToggle = (id) => {
    changeStaffStatus(id);
  };

  const handleDelete = (id) => {
    deleteStaff(id);
  };

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    // {
    //   header: "Name",
    //   cell: (row) => {
    //     if (row?.id_employee) {
    //       return `${row?.id_employee.firstname || ""} ${
    //         row?.id_employee.lastname || ""
    //       }`.trim();
    //     }
    //     return "-";
    //   },
    // },
    {
      header: "Username",
      cell: (row) => row?.username,
    },
    {
      header: "Employee ID",
      cell: (row) => {
        if (row?.id_role) {
          return `${row?.id_employee?.employeeId || ""}`;
        } else {
          return "-";
        }
      },
    },
    {
      header: "Branch",
      cell: (row) => {
        if (row?.id_branch) {
          return `${row?.access_branch[0]?.branch_name || row?.id_branch?.branch_name || ""}`;
        } else {
          return "-";
        }
      },
    },
    {
      header: "User Role",
      cell: (row) => {
        if (row?.id_role) {
          return `${row?.id_role.role_name || ""}`;
        } else {
          return "-";
        }
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
    
    // {
    //   header: "Access Branch",
    //   cell: (row) => {
    //     if (typeof row?.access_branch === "string") {
    //       return "All branch";
    //     }
    //     if (
    //       typeof row?.access_branch === "object" &&
    //       row?.access_branch !== null
    //     ) {
    //       return row?.access_branch.branch_name || "-";
    //     }
    //     return "-";
    //   },
    // },
    {
      header: "Actions",
      cell: (row, rowIndex) => (
        <Action
          row={row}
          data={staffData}
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

  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
  };

  const handleActiveFilterChange = (filter) => {
    
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <Breadcrumb
        items={[{ label: "Settings" }, { label: "Staff User", active: true }]}
      />

      <div className="flex flex-col p-4  bg-white border border-[#F2F2F9]  rounded-[16px]">
        <div className="flex flex-col gap-4 mt-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="relative w-full  sm:mb-0 sm:order-2 sm:w-auto">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {searchLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
              ) : (
                <Search className="text-[#6C7086] h-5 w-5" />
              )}
            </div>
            <input
              onChange={(e) => {
                setSearchLoading(true);
                setSearchInput(e.target.value);
              }}
              placeholder="Search"
              className="px-4 py-2 ps-9 border-2 border-[#F2F2F9] rounded-lg w-full h-[36px] text-md sm:w-[228px]"
            />
          </div>

          <div className="flex flex-row w-full sm:order-1 sm:w-auto sm:mr-auto">
            <div className="w-1/2 sm:w-auto me-1">
              <ActiveDropdown 
                setActiveFilter={handleActiveFilterChange} 
                activeFilter={activeFilter}
              />
            </div>

            <div className="w-1/2 sm:hidden">
              <button
                type="button"
                className="rounded-md px-4 py-2 text-white whitespace-nowrap hover:bg-[#034571] transition-colors w-full"
                style={{ backgroundColor: layout_color }}
                onClick={handleAddEmployeeClick}
              >
                 
                + Add User
              </button>
            </div>
          </div>

          <div className="hidden sm:block sm:order-3">
            <button
              type="button"
              className="flex rounded-lg px-[20px] py-[8px] text-sm font-semibold text-white items-center whitespace-nowrap hover:bg-[#034571] transition-colors sm:w-auto" 
              style={{ backgroundColor: layout_color }}
              onClick={handleAddEmployeeClick}
            >
              <img src={plus} alt="plus" className="w-4 h-4 me-[10px]" />
              Add User
            </button>
          </div>
        </div>
        <div className="mt-4">
          <Table 
            data={staffData} 
            columns={columns} 
            loading={isLoading} 
            currentPage={currentPage} 
            handleItemsPerPageChange={handleItemsPerPageChange} 
            handlePageChange={handlePageChange} 
            itemsPerPage={itemsPerPage} 
            totalItems={totalDocuments} 
          />

          <ModelOne
            title={'Add New User'}
            extraClassName="w-1/3"
            setIsOpen={setIsviewOpen}
            isOpen={isviewOpen}
            closeModal={closeIncommingModal}
          >
            <StaffuserForm setIsOpen={setIsviewOpen} />
          </ModelOne>
        </div>
      </div>
    </>
  );
};

export default StaffUser;