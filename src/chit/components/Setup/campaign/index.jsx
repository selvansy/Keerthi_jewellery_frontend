
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
import { toast } from "react-toastify";
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
            console.log(error.response.data);
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
                                top: rowIndex >= campaignData.length - 2 ? "auto" : "72%",
                                bottom: rowIndex >= campaignData.length - 2 ? "-74%" : "auto",

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
                                        Clear
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
            header: "Campaign Name",
            accessor: "name",
        },
        {
            header: "Description",
            accessor: "description",
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
            console.log("prevPage:", prevPage, "totalPages:", totalPages);
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
        <div className="flex flex-col p-4 relative">
            <>
                <h2 className="text-2xl text-gray-900 font-bold">Campaign Type</h2>
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
                            + Add campaign
                        </button>
                    </div>
                </div>

                <div className="mt-4">
                    <Table
                        data={campaignData}
                        columns={columns}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handleItemsPerPageChange={handleItemsPerPageChange}
                        handlePageChange={handlePageChange}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalDocuments}
                        loading={isLoading}
                    />
                </div>


            </>

            <ModelOne
                title={id ? "Edit campaign" : "Add campaign"}
                extraClassName="max-w-lg"
                setIsOpen={setIsviewOpen}
                isOpen={isviewOpen}
                closeModal={closeIncommingModal}
            >
                <CampaingForm closeIncommingModal={closeIncommingModal} id={id} clearId={clearId} />
            </ModelOne>
            <Modal />
        </div>
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

            setIsLoading(false)
            toast.error(error.response.message);
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