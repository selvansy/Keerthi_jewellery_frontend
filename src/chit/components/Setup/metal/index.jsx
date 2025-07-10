import React, { useState, useEffect } from "react";
import Table from "../../common/Table";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getallmetaltable,
  changemetalstatus,
  deletemetal,
  getmetalById,
  updatemetal,
  addmetal,
} from "../../../api/Endpoints";
import { toast } from "sonner";
import Modal from "../../common/Modal";
import ModelOne from "../../common/Modelone";
import { useDebounce } from "../../../hooks/useDebounce";
import SpinLoading from "../../common/spinLoading";
import { label, metadata, tr } from "framer-motion/client";
import Action from "../../common/action";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";
import { useMutation } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { openModal } from "../../../../redux/modalSlice";
import { closeModal } from "../../../../redux/modalSlice";
import { eventEmitter } from "../../../../utils/EventEmitter";
import plus from "../../../../assets/plus.svg";

const Metal = () => {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [MetalData, setMetalData] = useState([]);
  const [isviewOpen, setIsviewOpen] = useState(false);
  const [id, setId] = useState("");
  function closeIncommingModal() {
    setIsviewOpen(false);
    setId("");
  }

  const [isLoading, setisLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocument, setTotalDocument] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [searchLoading, setSearchLoading] = useState("");
  const [enableButton, setEnableButton] = useState(false);

  const limit = 10;

  const { mutate: getallmetaltableMutate } = useMutation({
    mutationFn: (payload) => getallmetaltable(payload),
    onSuccess: (response) => {
      if (response) {
        setMetalData(response.data);
        setTotalPages(response.totalPages);
        setTotalDocument(response.totalDocument);
        setEnableButton(true);
      }
      setSearchLoading(false);
      setisLoading(false);
    },
    onError: (error) => {
      setMetalData([]);
      setisLoading(false);
      setSearchLoading(false);
    },
  });

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      let response = await changemetalstatus(id);
      toast.success(response.message);

      setMetalData((prevData) =>
        prevData.map((Metal) =>
          Metal._id === id
            ? { ...Metal, active: currentStatus === true ? false : true }
            : Metal
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    getallmetaltableMutate({
      search: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage,
    });
  }, [currentPage, itemsPerPage, debouncedSearch, isviewOpen]);

  const clearId = () => {
    setId("");
  };

  const handleEdit = (id) => {
    setIsviewOpen(true);
    setId(id);
  };

  const handleaddmetal = () => {
    setIsviewOpen(true);
  };

  const handleDelete = (id) => {
    dispatch(
      openModal({
        modalType: "CONFIRMATION",
        header: "Confirm Delete",
        formData: {
          message: "Are you sure you want to delete this metal?",
          MetalId: id,
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

  const { mutate: deleteMetal } = useMutation({
    mutationFn: deletemetal,
    onSuccess: (response) => {
      if (response.message) {
        const isLastItemOnPage = MetalData.length === 1;
        const isNotFirstPage = currentPage > 1;
        if (isLastItemOnPage && isNotFirstPage) {
          setCurrentPage((prev) => prev - 1);
        } else {
          // Otherwise, just refresh current page
          getallmetaltableMutate({
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
    },
  });

  useEffect(() => {
    const handleDelete = (metalId) => {
      deleteMetal(metalId);
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

  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
  };

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * limit,
    },
    {
      header: "Metal Name",
      accessor: "metal_name",
    },
    {
      header: "Actions",
      cell: (row, rowIndex) => {
        console.log(row.isUsed)
        return (
          <Action
            row={row}
            data={metadata}
            rowIndex={rowIndex}
            activeDropdown={activeDropdown}
            setActive={hanldeActiveDropDown}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            showDelete={!row.isUsed}
          />
        );
      },
      sticky: "right",
    },
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

  return (
    <>
      <Breadcrumb
        items={[{ label: "Masters" }, { label: "Metal", active: true }]}
      />
      <div className="flex flex-col p-4 relative bg-white border border-[#F2F2F9]  rounded-[16px]">
        <div className="flex justify-end gap-4 mt-4 lg:items-center">
          {/* Search Input */}
          <div className="relative ">
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
              className="infocus px-4 py-2 ps-9 border-2 border-[#F2F2F9] text-[#6C7086] text-md rounded-[8px] w-[219px] h-[36px]"
            />
          </div>

          {/* Add Metal Button */}
          {MetalData && MetalData.length <= 3 && enableButton && (
            <div className="flex justify-end items-center ">
              <button
                className="flex rounded-lg px-[20px] py-[8px] text-sm font-semibold text-white items-center whitespace-nowrap hover:bg-[#034571] transition-colors sm:w-auto"
                onClick={handleaddmetal}
                style={{ backgroundColor: layout_color }}
              >
                <img src={plus} alt="plus" className="w-4 h-4 me-[10px]" />
                Add Metal
              </button>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Table
            data={MetalData}
            columns={columns}
            isLoading={isLoading}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalDocument}
            handleItemsPerPageChange={handleItemsPerPageChange}
            handleSearch={handleSearch}
          />
        </div>

        <ModelOne
          title={id ? "Edit Metal Details" : "Add Metal Details"}
          extraClassName="w-[420px]"
          setIsOpen={setIsviewOpen}
          isOpen={isviewOpen}
          closeModal={closeIncommingModal}
        >
          <MetalForm setIsOpen={setIsviewOpen} id={id} clearId={clearId} />
        </ModelOne>
        <Modal />
      </div>
    </>
  );
};

export default Metal;

export const MetalForm = ({ setIsOpen, id, clearId }) => {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [formData, setFormData] = useState({
    metal_name: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [succNot, setSuccNot] = useState(false);
  let dispatch = useDispatch();

  const handleSuccess = () => {
    setSuccNot(true);
    dispatch(
      openModal({
        modalType: "SUCCESS",
        header: "",
        formData: {
          message: "Metal added Successfully",
        },
      })
    );
    setTimeout(() => {
      setSuccNot(false);
      dispatch(closeModal());
    }, 2500);
  };

  // getmetalById
  const { mutate: getmetalId } = useMutation({
    mutationFn: getmetalById,
    onSuccess: (response) => {
      if (response) {
        setFormData({ metal_name: response.data.metal_name });
      }
    },
  });

  useEffect(() => {
    if (id) {
      getmetalId(id);
    } else {
      setFormData({ metal_name: "" });
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
        metal_name: formData.metal_name,
      };
      if (id) {
        updateData.id = id;
        updatemetalMutate(updateData);
      } else {
        addmetalMutate(updateData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const { mutate: addmetalMutate } = useMutation({
    mutationFn: (data) => addmetal(data),
    onSuccess: (response) => {
      try {
        if (response) {
          // toast.success(response.data.message);
          handleSuccess();
          setIsOpen(false);
          setIsLoading(false);
        }
      } catch (error) {}
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.response.data.message);
    },
  });

  const { mutate: updatemetalMutate } = useMutation({
    mutationFn: (data) => updatemetal(data),
    onSuccess: (response) => {
      toast.success(response.data.message);
      clearId();
      setIsOpen(false);
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.response.data.message);
    },
  });

  const handleCancel = () => {
    setFormData({
      metal_name: "",
    });
    setIsOpen(false);
    clearId();
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

  const validateForm = () => {
    const errors = {};

    if (!formData.metal_name) {
      errors.metal_name = "Metal Name is required";
    } else if (formData.metal_name.length < 2) {
      errors.metal_name = "Metal name must be at least 2 characters long.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="font-semibold text-sm text-[#232323] ">
          Metal Name<span className="text-red-400"> *</span>
        </label>
        <input
          type="text"
          name="metal_name"
          value={formData.metal_name}
          onChange={handleChange}
          placeholder="Enter Metal Name"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#004181] h-[44px]"
        />
        {formErrors.metal_name && (
          <div className="text-red-500 text-sm">{formErrors.metal_name}</div>
        )}
      </div>

      <div className="bg-white p-1 ">
        <div className="flex justify-end gap-2 ">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className=" text-white rounded-lg text-sm font-semibold py-2 items-center justify-center w-full md:w-20"
            style={{ backgroundColor: layout_color }}
          >
            {isLoading ? <SpinLoading /> : id ? "Update" : "Save"}
          </button>
          <button
            type="button"
            className="bg-[#E2E8F0] text-[#6C7086] text-sm font-semibold rounded-lg  w-full md:w-20"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>

      <Modal />
    </div>
  );
};
