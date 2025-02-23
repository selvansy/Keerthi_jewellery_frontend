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

export const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "50px",
    height: "50px",
    borderWidth: "2px",
    borderColor: "#D1D5DB",
    "&:hover": {
      borderColor: "#D1D5DB",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "50px",
    padding: "0 12px",
  }),
  input: (provided) => ({
    ...provided,
    margin: "0px",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: "50px",
  }),
};


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
  const [selectMetal,setSelectMetal]=useState([])
  const [isLoading, setisLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(true);
  const [totalDocuments,setTotalDocuments]=useState(0)

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
        setTotalDocuments(response.totalDocument)
      }
      setisLoading(false);
      setSearchLoading(false);
    },
    onError: (error) => {
      console.log(error.response.data);
      setpurityData([]);
      setSearchLoading(false);
    },
  });
  const { mutate: getallmetalMutate } = useMutation({
    mutationFn: getallmetal,
    onSuccess: (response) => {
      if (response) {
        setMetals(response.data); 

        setSelectMetal(
          response.data.map(metal => ({
            value: metal.id_metal, 
            label: metal.metal_name
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
          purity._id === id
            ? { ...purity, active: !currentStatus } 
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

  useEffect(() => {
    getallpuritytableMutate({
      search: debouncedSearch,
      page: currentPage,
      limit,
    });
  }, [currentPage, itemsPerPage, debouncedSearch, , isviewOpen]);

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
    setId(id)
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

  }
   const { mutate: deletePurity } = useMutation({
      mutationFn:(id)=> deletepurity(id),
      onSuccess: (response) => {
        if (response.message === "Purity deleted successfully") {
          const isLastItemOnPage = purityData.length === 1;
          const isNotFirstPage = currentPage > 1;
          if (isLastItemOnPage && isNotFirstPage) {
            setCurrentPage(prev => prev - 1);
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
      header: "Actions",
      cell: (row, rowIndex) => (
        <div className="dropdown-container relative">
          <button
            className="p-1 hover:bg-gray-100 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setActiveDropdown(activeDropdown === row?._id ? null : row?._id);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>

          {activeDropdown === row?._id && (
            <div
              className="absolute"
              style={{
                top: rowIndex >= purityData.length - 2 ? "auto" : "72%",
                bottom: rowIndex >= purityData.length - 2 ? "-74%" : "auto",
                // top: 'auto',
                // bottom: '-440%',
                zIndex: 9999,
                marginBottom: "8px",
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.15))",
              }}
            >
              <div className="w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => {
                      handleEdit(row?._id);
                      setActiveDropdown(null);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => {
                      handleDelete(row?._id);
                      setActiveDropdown(null);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
      sticky: "right",
    },
    {
      header: "Purity Name",
      cell: (row) => `${row?.purity_name}`,
    },
    {
      header: "Metal Name",
      cell: (row) => {
        return row?.id_metal === 1
          ? "Gold"
          : row?.id_metal === 2
          ? "Silver"
          : row?.id_metal === 3
          ? "Diamond"
          : row?.id_metal === 4
          ? "Platinum"
          : "Gold Coins";
      },
    },

    {
      header: "Display App",
      accessor: "display_app",
      cell: (row) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={row?.display_app === true}
            onChange={() => handleDisplayappToggle(row?._id, row?.display_app)}
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

  const nextPage = () => {
    setCurrentPage((prevPage) => {
      return prevPage < totalPages ? prevPage + 1 : prevPage;
    });
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  console.log(currentPage);

  const paginationData = {
    totalItems: totalPages,
    currentPage: currentPage,
    itemsPerPage: itemsPerPage,
    handlePageChange: handlePageChange,
  };
  const paginationButtons = usePagination(paginationData);

  return (
    <div className="flex flex-col p-4 relative">
      <>
        <h2 className="text-2xl text-gray-900 font-bold">Purity</h2>
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
              onClick={handleAddpurity}
              style={{ backgroundColor: layout_color }}
            >
              + Add purity
            </button>
          </div>
        </div>

        <div className="mt-4">
          <Table
            data={purityData}
            columns={columns}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={limit}
            isLoading={isLoading}
          />
        </div>

        <div className="flex  justify-between mt-4 p-2">
          <div className="mt-4 flex gap-2 justify-center items-center">
            <span className="text-gray-500">Show</span>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="p-2 h-10 border-gray-500 rounded-md text-black bg-gray-300"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={250}>250</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
            </select>
            <span className="text-gray-500">entries {totalDocuments} </span>
          </div>
          <div className="flex flex-row items-center justify-center gap-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}x
                className="p-2 text-gray-500 rounded-md"
              >
                Previous
              </button>
            </div>

            <div className="flex flex-row items-center justify-center gap-2">
              {paginationButtons}
            </div>

            <div className="flex items-center">
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 rounded-md"
              >
                Next
              </button>
            </div>
          </div>
        </div>


      </>
      <ModelOne
        title={id ? "Edit Purity" : "Add Purity"}
        extraClassName="max-w-[75%] "
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
  );
};

export default Purity;

export const PurityForm = ({ setIsOpen, metals, clearId, id }) => {
  const dispatch = useDispatch();
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [formData, setFormData] = useState({
    purity_name: "",
    id_metal: "",
  });  
  const [isLoading,setIsLoading]=useState(false)
  const [formErrors, setFormErrors] = useState({});

  // getmetalById
  const { mutate: getPurityId } = useMutation({
    mutationFn: getpurityById,
    onSuccess: (response) => {
      if (response) {
        setFormData({
          purity_name: response.data.purity_name,
          id_metal: response.data.id_metal,
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
    setIsLoading(true)

    try {
      const updateData = {
        purity_name: formData.purity_name,
        id_metal: formData.id_metal,
      };

      if (id) {
        updatepurityMutate({id,data:updateData});
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
      setIsLoading(false)
    },
    onError: (error) => {
      setIsLoading(false)
      toast.error(error.response.data.message)
    },
  });
  const { mutate: updatepurityMutate } = useMutation({
    mutationFn: (data) => updatepurity(data),
    onSuccess: (response) => {
      setIsLoading(false)
      toast.success(response.data.message);
      clearId();
      setIsOpen(false);
    },
    onError: (error) => {
      setIsLoading(false)
      console.error("Error updating purity:", error); 
    },
  });

  const handleCancel = () => {
    setFormData({
      purity_name: "",
      id_metal: "",
      metals: metals,
    });
    dispatch(setid(null));
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

  const handleSelect=(selectedOption)=>{
    setFormData((prev) => ({
      ...prev,
      id_metal: selectedOption ? selectedOption.value : "",
    }));
  
    setFormErrors((prev) => ({
      ...prev,
      id_metal: "",
    }));  
  }

  const validateForm = () => {
    const errors = {};

    if (!formData.purity_name) errors.purity_name = "Purity Name is required";
    if (!formData.id_metal) errors.id_metal = "Metal Id is required";
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
          value={metals.find((option) => option.value === formData.id_metal)}
          onChange={handleSelect}
          placeholder="Select State"
          styles={customSelectStyles}
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
            className=" text-white rounded-md p-2 w-full lg:w-20"
            style={{ backgroundColor: layout_color }}
          >
            {isLoading?<SpinLoading/>:id ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};
