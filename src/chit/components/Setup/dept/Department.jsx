import React, { useState, useEffect } from "react";
import Table from "../../common/Table";
import { Search } from "lucide-react";
import { data, useNavigate } from "react-router-dom";
import {
  getalldepttable,
  changedeptstatus,
  deleteDept,
  getDepartmentById,
  updateDepartment,
  addDepartment,
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
import Action from "../../common/action";

const Department = () => {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const dispatch = useDispatch();
  const [deptData, setdeptData] = useState([]);
  const [isviewOpen, setIsviewOpen] = useState(false);
  const [id, setId] = useState("");
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

  function closeIncommingModal() {
    setIsviewOpen(false);
    setId("");
  }

  const clearId = () => {
    setId("");
  };

  const handleEdit = (id) => {
    setIsviewOpen(true);
    setId(id);
  };

  const handleaddDept = () => {
    setIsviewOpen(true);
  };

  const { mutate: getalldepttableMutate } = useMutation({
    mutationFn: (payload) => getalldepttable(payload),
    onSuccess: (response) => {
      if (response) {
        setdeptData(response.data);
        setTotalPages(response.totalPages);
        setDocument(response.totalDocument);
      }
      setSearchLoading(false);
      setisLoading(false);
    },
    onError: (error) => {
      setdeptData([]);
      setSearchLoading(false);
    },
  });

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      let response = await changedeptstatus(id);
      toast.success(response.message);

      setdeptData((prevData) =>
        prevData.map((dept) =>
          dept._id === id
            ? { ...dept, active: currentStatus === true ? false : true }
            : dept
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    getalldepttableMutate({
      search: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage,
      currentPage,
    });
  }, [currentPage, itemsPerPage, debouncedSearch, isviewOpen]);

  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
  };

  const handleDelete = (id) => {
    setId(id);
    dispatch(
      openModal({
        modalType: "CONFIRMATION",
        header: "Delete dept",
        formData: {
          message: "Are you sure you want to delete this dept?",
          deptId: id,
        },
        buttons: {
          cancel: {
            text: "Clear",
          },
          submit: {
            text: "Delete",
          },
        },
      })
    );
  };

  const { mutate: deleteDepartment } = useMutation({
    mutationFn: (id) => deleteDept(id),
    onSuccess: (response) => {
      const isLastItemOnPage = deptData.length === 1;
      const isNotFirstPage = currentPage > 1;
      if (isLastItemOnPage && isNotFirstPage) {
        setCurrentPage((prev) => prev - 1);
      } else {
        getalldepttableMutate({
          search: debouncedSearch,
          page: currentPage,
          limit: itemsPerPage,
        });

        toast.success(response.message);
        eventEmitter.off("CONFIRMATION_SUBMIT");
        setId("");
      }
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Failed to delete dept");
    },
  });

  useEffect(() => {
    const handleDelete = (deptId) => {
      deleteDepartment(deptId.deptId);
    };

    eventEmitter.on("CONFIRMATION_SUBMIT", handleDelete);

    return () => {
      eventEmitter.off("CONFIRMATION_SUBMIT", handleDelete);
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
      header: "dept Name",
      accessor: "name",
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
        <Action
          row={row}
          data={deptData}
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

  return (
    <div className="flex flex-col p-4 relative">
      <>
        <h2 className="text-2xl text-gray-900 font-bold">Department</h2>
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
          <div className="flex flex-row items-center justify-end gap-2">
            <button
              className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
              onClick={handleaddDept}
              style={{ backgroundColor: layout_color }}
            >
              + Add Department
            </button>
          </div>
        </div>

        <div className="mt-4">
          <Table
            data={deptData}
            columns={columns}
            isLoading={isLoading}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={doc}
            handleItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </>

      <ModelOne
        title={id ? "Edit Department" : "Add Department"}
        extraClassName="max-w-lg"
        setIsOpen={setIsviewOpen}
        isOpen={isviewOpen}
        closeModal={closeIncommingModal}
      >
        <DeptForm
          closeIncommingModal={closeIncommingModal}
          id={id}
          clearId={clearId}
        />
      </ModelOne>
      <Modal />
    </div>
  );
};

export default Department;

export const DeptForm = ({ closeIncommingModal, id, clearId }) => {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [formData, setFormData] = useState({
    name: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: getdeptId } = useMutation({
    mutationFn: getDepartmentById,
    onSuccess: (response) => {
      if (response) {
        setFormData({ name: response.data.name });
      }
    },
  });

  useEffect(() => {
    if (id) {
      getdeptId(id);
    }
  }, [id]);

  useEffect(() => {
    return () => {
      clearId();
    };
  }, []);

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);

    try {
      const updateData = {
        name: formData.name,
      };
      if (id) {
        updatedeptMutate({ id: id, data: updateData });
      } else {
        adddeptMutate(updateData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const { mutate: adddeptMutate } = useMutation({
    mutationFn: (data) => addDepartment(data),
    onSuccess: (response) => {
      toast.success(response.message);
      closeIncommingModal();
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.response.message);
    },
  });

  const { mutate: updatedeptMutate } = useMutation({
    mutationFn: (data) => updateDepartment(data),
    onSuccess: (response) => {
      toast.success(response.message);
      clearId();
      closeIncommingModal();
      setIsLoading(false);
    },

    onError: (error) => {
      setIsLoading(false);
      toast.error(error.response.data.message);
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

    if (!formData.name) {
      errors.name = "Department Name is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700">
          Department<span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          minLength={"2"}
          placeholder="Enter Department Name"
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {formErrors.name && (
          <div className="text-red-500 text-sm">{formErrors.name}</div>
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
            {isLoading ? <SpinLoading /> : id ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};
