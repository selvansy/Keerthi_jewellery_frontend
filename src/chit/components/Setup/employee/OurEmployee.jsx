import React, { useState, useEffect } from "react";
import Table from "../../common/Table";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  getallemployeetable,
  changeEmployeeStatus,
  deleteemployee,
} from "../../../api/Endpoints";
import { toast } from "react-toastify";
import { openModal } from "../../../../redux/modalSlice";
import { eventEmitter } from "../../../../utils/EventEmitter";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../common/Modal";
import { useDebounce } from "../../../hooks/useDebounce";
import usePagination from "../../../hooks/usePagination";
import Action from "../../common/action";

const OurEmployee = () => {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const roledata = useSelector((state) => state.clientForm.roledata);

  const id_branch = roledata?.branch;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [totalDocuments,setTotalDocuments]=useState(0)
  const [isLoading, setisLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);

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

 

  const { mutate: getAllEmployees } = useMutation({
    mutationFn: getallemployeetable,
    onSuccess: (response) => {
      if (response.data) {
        setEmployeeData(response.data);
        setTotalPages(response.totalPages)
      }
      setisLoading(false);
    },
    onError: () => {
      setEmployeeData([])
      setisLoading(false)
    }
  });

  useEffect(() => {
    setisLoading(true);
    getAllEmployees({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
    });
  }, [currentPage, itemsPerPage, debouncedSearch]);

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleAddEmployeeClick = () => {
    navigate("/employee/edit/");
  };

  const { mutate: getallemployeetableMutate } = useMutation({
    mutationFn: () => getallemployeetable(payload),
    onSuccess: (response) => {
      if (response?.data) {
        setEmployeeData(response.data);
        setTotalPages(response.totalPages);
        setTotalDocuments(response.totalDocument);
      }
      setisLoading(false);
    },
    onError: () => {
      setisLoading(false);
    },
  });

  const { mutate: deleteEmployeeMutate } = useMutation({
    mutationFn: deleteemployee,
    onSuccess: (response) => {
      toast.success(response.message);
      const isLastItemOnPage = employeeData.length === 1;
      const isNotFirstPage = currentPage > 1;
      if (isLastItemOnPage && isNotFirstPage) {
        setCurrentPage(prev => prev - 1);
      } else {

        getallemployeetableMutate({ page: currentPage, limit: itemsPerPage });

      }
    },
  });

  useEffect(() => {
    getallemployeetableMutate({
      search: debouncedSearch,
    });
  }, [debouncedSearch]);

  useEffect(() => {
    getallemployeetableMutate({
      page: currentPage,
      limit: itemsPerPage,
      from_date: "",
      to_date: "",
      search: debouncedSearch,
    });
  }, [currentPage, itemsPerPage]);



  const handleEdit = (id) => {
    navigate(`/employee/edit/${id}`);
  };

  const handleDelete = (id) => {
    dispatch(
      openModal({
        modalType: "CONFIRMATION",
        header: "Delete Employee",
        formData: {
          message: "Are you sure you want to delete this employee?",
          employeeId: id,
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

  useEffect(() => {
    const handleDelete = (data) => {
      deleteEmployeeMutate(data.employeeId);
    };

    eventEmitter.on("CONFIRMATION_SUBMIT", handleDelete);

    return () => {
      eventEmitter.off("CONFIRMATION_SUBMIT", handleDelete);
    };
  }, []);

  const handleStatusToggle = async (id) => {
    let response = await changeEmployeeStatus(id);
    if (response) {
      toast.success(response.message);
      setEmployeeData((prevData) =>
        prevData.map((employee) =>
          employee._id === id
            ? { ...employee, active: employee.active === true ? false : true }
            : employee
        )
      );
      getallemployeetableMutate({ page: currentPage, limit: itemsPerPage });
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Employee Name",
      cell: (row) => `${row?.firstname} ${row?.lastname}`,
    },
    {
      header: "Date of Joining",
      cell: (row) => formatDate(row?.date_of_join),
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
            className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-black p-[2px] after:duration-300 after:bg-black ${row.active === true
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
        <Action row={row} data={employeeData} rowIndex={rowIndex} activeDropdown={activeDropdown} setActive={hanldeActiveDropDown}  handleEdit={handleEdit} handleDelete={handleDelete}/>
      ),
      sticky: "right",
    },
  ];

  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
  };

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">Our Employee</h2>
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
            onClick={handleAddEmployeeClick}
            style={{ backgroundColor: layout_color }}
          >
            + Add Employee
          </button>
        </div>
      </div>

      <div className="mt-4">
      <Table data={employeeData} currentPage={currentPage} handleItemsPerPageChange={handleItemsPerPageChange} handlePageChange={handlePageChange} itemsPerPage={itemsPerPage} totalItems={totalDocuments} columns={columns} loading={isLoading} />
      </div>
      <Modal />
    </div>
  );
};

export default OurEmployee;
