import React, { useState, useEffect } from "react";
import Table from "../../common/Table";
import { Search } from "lucide-react";
import { data, useNavigate } from "react-router-dom";
import {
  getallmetal,
  getallpuritytable,
  changedisplaystatus,
  changepurityStatus,
  deletepurity,
  getpurityById,
  updatepurity,
  addpurity,
} from "../../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { openModal } from "../../../../redux/modalSlice";
import { eventEmitter } from "../../../../utils/EventEmitter";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import ModelOne from "../../common/Modelone";
import Modal from "../../common/Modal";
import { useDebounce } from "../../../hooks/useDebounce";
import { setid } from "../../../../redux/clientFormSlice";
import Select from "react-select";
import usePagination from "../../../hooks/usePagination";
import SpinLoading from "../../common/spinLoading";
import Action from "../../common/action";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";

export const customSelectStyles = (isReadOnly) => ({
  control: (base, state) => ({
    ...base,
    minHeight: "42px",
    backgroundColor: "white",
    border: state.isFocused ? "1px solid black" : "2px solid #f2f3f8",
    boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
    borderRadius: "0.375rem",
    "&:hover": {
      color: "#e2e8f0",
    },
    pointerEvents: !isReadOnly ? "none" : "auto",
    opacity: !isReadOnly ? 1 : 1,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#858293",
    fontWeight: "thin",
    // fontStyle: "bold",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: "#232323",
    "&:hover": {
      color: "#232323",
    },
  }),
});

const Purity = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [metals, setMetals] = useState([]);
  const [purityData, setpurityData] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [id, setId] = useState("");
  const limit = 10;
  const [isviewOpen, setIsviewOpen] = useState(false);
  const [selectMetal, setSelectMetal] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(true);
  const [totalDocuments, setTotalDocuments] = useState(0);

  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  function closeIncommingModal() {
    setIsviewOpen(false);
  }

  const clearId = () => {
    setId("");
  };

  const { mutate: getallpuritytableMutate } = useMutation({
    mutationFn: (payload) => getallpuritytable(payload),
    onSuccess: (response) => {
      if (response) {
        setpurityData(response.data);
        setTotalPages(response.totalPages);
        setTotalDocuments(response.totalDocument);
      }
      setisLoading(false);
      setSearchLoading(false);
    },
    onError: (error) => {
      console.log(error.response.data);
      setpurityData([]);
      setSearchLoading(false);
      setisLoading(false);
    },
  });
  const { mutate: getallmetalMutate } = useMutation({
    mutationFn: getallmetal,
    onSuccess: (response) => {
      if (response) {
        setMetals(response.data);
        setSelectMetal(
          response.data.map((metal) => ({
            value: metal._id,
            label: metal.metal_name,
          }))
        );
      }
    },
  });

  const handleDisplayappToggle = async (id, currentStatus) => {
    try {
      let response = await changedisplaystatus(id);
      toast.success(response.message);
      setpurityData((prevData) =>
        prevData.map((purity) =>
          purity._id === id
            ? { ...purity, display_app: !currentStatus }
            : purity
        )
      );
      getallpuritytableMutate({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      let response = await changepurityStatus(id);
      toast.success(response.message);
      setpurityData((prevData) =>
        prevData.map((purity) =>
          purity._id === id ? { ...purity, active: !currentStatus } : purity
        )
      );
      getallpuritytableMutate({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    getallpuritytableMutate({
      search: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage,
    });
  }, [currentPage, itemsPerPage, debouncedSearch, isviewOpen]);

  useEffect(() => {
    getallmetalMutate();
  }, []);

  const handleEdit = (id) => {
    setIsviewOpen(true);
    setId(id);
  };

  const handleAddpurity = () => {
    setIsviewOpen(true);
  };

  const handleDelete = (id) => {
    dispatch(
      openModal({
        modalType: "CONFIRMATION",
        header: "Delete purity",
        formData: {
          message: "Are you sure you want to delete this purity?",
          purityId: id,
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

  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
  };

  const { mutate: deletePurity } = useMutation({
    mutationFn: (id) => deletepurity(id),
    onSuccess: (response) => {
      if (response.message === "Purity deleted successfully") {
        const isLastItemOnPage = purityData.length === 1;
        const isNotFirstPage = currentPage > 1;
        if (isLastItemOnPage && isNotFirstPage) {
          setCurrentPage((prev) => prev - 1);
        } else {
          // Otherwise, just refresh current page
          getallpuritytableMutate({
            search: debouncedSearch,
            page: currentPage,
            limit: itemsPerPage,
          });
        }

        toast.success(response.message);
        eventEmitter.off("CONFIRMATION_SUBMIT");
        setId("");
      }
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Failed to delete metal");
      eventEmitter.off("CONFIRMATION_SUBMIT");
    },
  });

  useEffect(() => {
    const handleDelete = (id) => {
      deletePurity(id);
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
      header: "Purity Name",
      cell: (row) => `${row?.purity_name}`,
    },
    {
      header: "Metal Name",
      cell: (row) => {
        return row.id_metal.metal_name;
      },
    },
    {
      header: "Actions",
      cell: (row, rowIndex) => (
        <Action
          row={row}
          data={purityData}
          rowIndex={rowIndex}
          activeDropdown={activeDropdown}
          setActive={hanldeActiveDropDown}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ),
      sticky: "right",
    },

    // {
    //   header: "Display App",
    //   accessor: "display_app",
    //   cell: (row) => (
    //     <label className="relative inline-flex items-center cursor-pointer">
    //       <input
    //         type="checkbox"
    //         className="sr-only peer"
    //         checked={row?.display_app === true}
    //         onChange={() => handleDisplayappToggle(row?._id, row?.display_app)}
    //       />
    //       <div
    //         className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-black p-[2px] after:duration-300 after:bg-black ${
    //           row.active === true
    //             ? "peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]"
    //             : "peer-checked:bg-gray-400 peer-checked:ring-gray-400"
    //         } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-white peer-hover:after:scale-95`}
    //       ></div>
    //     </label>
    //   ),
    // },
    // {
    //   header: "Status",
    //   accessor: "active",
    //   cell: (row) => (
    //     <label className="relative inline-flex items-center cursor-pointer">
    //       <input
    //         type="checkbox"
    //         className="sr-only peer"
    //         checked={row?.active === true}
    //         onChange={() => handleStatusToggle(row?._id, row?.active)}
    //       />
    //       <div
    //         className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-black p-[2px] after:duration-300 after:bg-black ${
    //           row.active === true
    //             ? "peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]"
    //             : "peer-checked:bg-gray-400 peer-checked:ring-gray-400"
    //         } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-white peer-hover:after:scale-95`}
    //       ></div>
    //     </label>
    //   ),
    // },
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
        items={[{ label: "Masters" }, { label: "Purity", active: true }]}
      />
      <div className="flex flex-col p-4 relative bg-white border border-[#F2F2F9]  rounded-[16px]">
        <div className="grid gap-4 mt-4 grid-cols-2 lg:items-center">
          {/* Search Input */}
          <div className="relative ">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {searchLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
              ) : (
                <Search className="text-black" />
              )}
            </div>
            <input
              onChange={handleSearch}
              placeholder="Search"
              className="px-4 py-2 ps-9 border-2 border-[#F2F2F9] rounded-[8px] w-[228px]"
            />
          </div>

          {/* Add Metal Button */}
          <div className="w-full flex justify-end">
            <button
              className="rounded-md px-4 py-2 text-white whitespace-nowrap hover:bg-[#034571] transition-colors w-[135px] sm:w-auto"
              onClick={handleAddpurity}
              style={{ backgroundColor: layout_color }}
            >
              + Add Purity
            </button>
          </div>
        </div>

        <div className="mt-4">
          <Table
            data={purityData}
            columns={columns}
            isLoading={isLoading}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalDocuments}
            handleItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>

        <ModelOne
          title={id ? "Edit Purity" : "Add Purity"}
          extraClassName="w-96"
          setIsOpen={setIsviewOpen}
          isOpen={isviewOpen}
          closeModal={closeIncommingModal}
        >
          <PurityForm
            metals={selectMetal}
            setIsOpen={setIsviewOpen}
            clearId={clearId}
            id={id}
          />
        </ModelOne>
        <Modal />
      </div>
    </>
  );
};

export default Purity;

export const PurityForm = ({ setIsOpen, metals, clearId, id }) => {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [formData, setFormData] = useState({
    purity_name: "",
    id_metal: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Fetch purity by ID
  const { mutate: getPurityId } = useMutation({
    mutationFn: getpurityById,
    onSuccess: (response) => {
      if (response) {
        setFormData({
          purity_name: response.data.purity_name,
          id_metal: {
            value: response.data.id_metal._id,
            label: response.data.id_metal.metal_name,
          },
        });
      }
    },
  });

  useEffect(() => {
    if (id) {
      getPurityId(id);
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
        purity_name: formData.purity_name,
        id_metal: formData.id_metal.value, // Send only the ID
      };

      if (id) {
        updatepurityMutate({ id, data: updateData });
      } else {
        addpurityMutate(updateData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const { mutate: addpurityMutate } = useMutation({
    mutationFn: (data) => addpurity(data),
    onSuccess: (response) => {
      if (response) {
        toast.success(response.data.message);
        setIsOpen(false);
      }
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.response.data.message);
    },
  });

  const { mutate: updatepurityMutate } = useMutation({
    mutationFn: (data) => updatepurity(data),
    onSuccess: (response) => {
      setIsLoading(false);
      toast.success(response.data.message);
      handleCancel();
      setIsOpen(false);
    },
    onError: (error) => {
      setIsLoading(false);
      console.error("Error updating purity:", error);
    },
  });

  const handleCancel = () => {
    setFormData({
      purity_name: "",
      id_metal: null,
    });
    clearId();
    setIsOpen(false);
  };

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

  const handleSelect = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      id_metal: selectedOption, // Store the full object
    }));

    setFormErrors((prev) => ({
      ...prev,
      id_metal: "",
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.purity_name) errors.purity_name = "Purity Name is required";
    if (!formData.id_metal) errors.id_metal = "Metal selection is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700">
          Purity Name<span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="purity_name"
          value={formData.purity_name}
          onChange={handleChange}
          placeholder="Enter Purity Name"
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {formErrors.purity_name && (
          <div className="text-red-500 text-sm">{formErrors.purity_name}</div>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700">
          Metal<span className="text-red-400">*</span>
        </label>
        <Select
          name="id_metal"
          options={metals}
          value={formData.id_metal} // Corrected to show selected metal
          onChange={handleSelect}
          placeholder="Select Metal"
          className="react-select-container"
          classNamePrefix="react-select"
        />
        {formErrors.id_metal && (
          <div className="text-red-500 text-sm">{formErrors.id_metal}</div>
        )}
      </div>

      <div className="bg-white p-2 mt-6">
        <div className="flex justify-end gap-2 mt-3">
          <button
            type="button"
            className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="text-white rounded-md p-2 w-full lg:w-20"
            style={{ backgroundColor: layout_color }}
          >
            {isLoading ? <SpinLoading /> : id ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};
