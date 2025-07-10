
import React, { useState, useEffect } from "react";
import Table from "../../common/Table";
import { Search } from "lucide-react";
import { data, useNavigate } from "react-router-dom";
import {
    getallCampaigntable,
    changedeptstatus,
    deleteCampaign,
    getCampaignById,
    updateCampaign,
    addCampaign,
} from "../../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { openModal } from "../../../../redux/modalSlice";
import { eventEmitter } from "../../../../utils/EventEmitter";
import { useSelector, useDispatch } from "react-redux";
import { setid } from "../../../../redux/clientFormSlice";
import Modal from "../../common/Modal";
import ModelOne from "../../common/Modelone";
import { useDebounce } from "../../../hooks/useDebounce";
import usePagination from "../../../hooks/usePagination";
import SpinLoading from "../../common/spinLoading";
import Loading from "../../common/Loading";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";
import Action from "../../common/action";
import plus from "../../../../assets/plus.svg";


function Campaign() {
    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    const dispatch = useDispatch();
    const [campaignData, setcampaignData] = useState([]);
    const [isviewOpen, setIsviewOpen] = useState(false);
    const [id, setId] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 500);
    const [searchLoading, setSearchLoading] = useState(false);
    const [totalDocuments,setTotalDocuments]=useState(0)
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


    const { mutate: getallCampaign } = useMutation({
        mutationFn: (payload) => getallCampaigntable(payload),
        onSuccess: (response) => {
            if (response) {
                setcampaignData(response.data);
                setTotalPages(response.totalPages);
                setTotalDocuments(response.totalDocuments)
            }
            setSearchLoading(false);
            setisLoading(false);
        },
        onError: (error) => {
            ;
            setcampaignData([]);
            setSearchLoading(false);
        },
    });

   

    useEffect(() => {
        getallCampaign({
            search: debouncedSearch,
            page: currentPage,
            limit: itemsPerPage,
            currentPage,
        });
    }, [currentPage, itemsPerPage, debouncedSearch, isviewOpen]);


    const handleDelete = (id) => {
        setId(id);
        dispatch(
            openModal({
                modalType: "CONFIRMATION",
                header: "Delete Campaign",
                formData: {
                    message: "Are you sure you want to delete this Campaign?",
                    campId: id,
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

    const { mutate: deleteCampaignType } = useMutation({
        mutationFn: (id) => deleteCampaign(id),
        onSuccess: (response) => {

            const isLastItemOnPage = campaignData.length === 1;
            const isNotFirstPage = currentPage > 1;
            if (isLastItemOnPage && isNotFirstPage) {
                setCurrentPage(prev => prev - 1);
            } else {

                getallCampaign({
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
        const handleDelete = (campId) => {
            deleteCampaignType(campId.campId);
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
            header: "Campaign Name",
            accessor: "name",
        },
        {
            header: "Description",
            accessor: "description",
        },
        {
            header: "Actions",
            cell: (row, rowIndex) => (
                <Action row={row} data={campaignData} rowIndex={rowIndex} activeDropdown={activeDropdown} setActive={hanldeActiveDropDown}  handleEdit={handleEdit} handleDelete={handleDelete}/>
            ),
            sticky: "right",
          },

    ];

 

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
            ;
            return prevPage < totalPages ? prevPage + 1 : prevPage;
        });
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
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
        items={[{ label: "Promotions" }, { label: "Campaign Type", active: true }]}
      />

      <div className="flex flex-col p-4  bg-white border-[1px] border-[#F2F2F9]  rounded-[16px]">
        <div className="flex flex-col sm:flex-row w-full justify-between gap-2 sm:gap-4">
          {/* Search Input */}
          <div className="w-full sm:w-[308px]  relative">
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
              placeholder="Search Customer/ Mobile No"
              className="px-4 py-2 ps-9 border-2 border-[#F2F2F9] rounded-lg w-full h-[36px] text-md sm:w-[228px]"
            />
          </div>

          {/* Add Button */}
          <div className="w-full sm:w-auto">
            <button
              className="flex rounded-lg px-[20px] py-[8px] text-sm font-semibold text-white items-center whitespace-nowrap hover:bg-[#034571] transition-colors sm:w-auto"
              onClick={handleaddDept}
              style={{ backgroundColor: layout_color }}
            >
              <img src={plus} alt="plus" className="w-4 h-4 me-[10px]" />
               Add campaign
            </button>
          </div>
        </div>



        <div className="mt-4">
          <Table
            data={campaignData}
            columns={columns}
            isLoading={isLoading}
            currentPage={currentPage}
            handleItemsPerPageChange={handleItemsPerPageChange}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalDocuments}
          />
        </div>

        <ModelOne
                title={id ? "Edit campaign" : "Add campaign"}
                extraClassName="w-1/3"
                setIsOpen={setIsviewOpen}
                isOpen={isviewOpen}
                closeModal={closeIncommingModal}
            >
                <CampaingForm closeIncommingModal={closeIncommingModal} id={id} clearId={clearId} />
            </ModelOne>
            <Modal />


      </div>
    </>
    );

}

export default Campaign



export const CampaingForm = ({ closeIncommingModal, id, clearId }) => {

    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });

    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false)

    const { mutate: getcampId } = useMutation({
        mutationFn: getCampaignById,
        onSuccess: (response) => {
            if (response) {
                setFormData(response.data)
            }
        },
    });

    useEffect(() => {
        if (id) {
            getcampId(id);
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
                name: formData.name,
                description: formData.description
            };
            if (id) {
                updateCampMutate({ id: id, data: updateData });
            } else {
                addCampaignMutate(updateData);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const { mutate: addCampaignMutate } = useMutation({
        mutationFn: (data) => addCampaign(data),
        onSuccess: (response) => {
            toast.success(response.message);
            closeIncommingModal();
            setIsLoading(false)
        },
        onError: (error) => {
            console.log(error)
            setIsLoading(false)
            toast.error(error?.response?.data?.message);
        },
    });

    const { mutate: updateCampMutate } = useMutation({
        mutationFn: (data) => updateCampaign(data),
        onSuccess: (response) => {
            toast.success(response.message);
            clearId();
            closeIncommingModal();
            setIsLoading(false)
        },

        onError: (error) => {
            setIsLoading(false)
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
        if (!formData.description) {
            errors.name = "Description is required";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    return (
        <div className="space-y-4">

            <div className="flex flex-col space-y-2">
                <label className="font-medium text-gray-700">
                    CampaignType<span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    minLength={"2"}
                    placeholder="Enter Campaign Type"
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.name && (
                    <div className="text-red-500 text-sm">{formErrors.name}</div>
                )}
            </div>

            <div className="flex flex-col space-y-2">
                <label className="font-medium text-gray-700">
                    Description<span className="text-red-400">*</span>
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    minLength={2}
                    placeholder="Enter Description"
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4} 
                ></textarea>

                {formErrors.description && (
                    <div className="text-red-500 text-sm">{formErrors.description}</div>
                )}
            </div>

            <div className="bg-white p-2 mt-6">
                <div className="flex justify-end gap-2 mt-3">
                    <button
                        type="button"
                        className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
                        onClick={closeIncommingModal}
                    >
                        Clear
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