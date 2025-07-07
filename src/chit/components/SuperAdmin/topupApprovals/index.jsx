import React, { useState, useEffect } from "react";
import Table from "../../common/Table";
import { Search } from "lucide-react";
import { data, useNavigate } from "react-router-dom";
import {
  topupTable,
  updateStatus,
} from "../../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { openModal } from "../../../../redux/modalSlice";
import { eventEmitter } from "../../../../utils/EventEmitter";
import { useSelector, useDispatch } from "react-redux";
import Modal from "../../common/Modal";
import ModelOne from "../../common/Modelone";
import { useDebounce } from "../../../hooks/useDebounce";
import usePagination from "../../../hooks/usePagination";
import SpinLoading from "../../common/spinLoading";
import Loading from "../../common/Loading";
import DateRangeSelector from "../../common/calender";
import ExportDropdown from "../../common/Dropdown/Export";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";
import { formatNumber } from "../../../utils/commonFunction"

const topupApprovals = () => {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);
  
  const superadmin = Number(roledata?.id_role?.id_role);

  const dispatch = useDispatch();
  const [topupData, settopupData] = useState([]);
  const [isviewOpen, setIsviewOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalDocuments, setTotalDocuments] = useState(0);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [searchLoading, setSearchLoading] = useState(false);
  const [from_date, setfrom_date] = useState();
  const [to_date, setto_date] = useState();

  const limit = 10;

  function closeIncommingModal() {
    setIsviewOpen(false);
  }


  const clearstatus = () => {
    setStatus("");
  };

  const handleEdit = (status) => {
    setIsviewOpen(true);
    setStatus(status);
  };

  const handleaddTopUp = () => {
    setIsviewOpen(true);
  };


  const { mutate: getallTopuptableMutate } = useMutation({
    mutationFn: (payload) => topupTable(payload),
    onSuccess: (response) => {
      if (response) {

        settopupData(response.data);
        setTotalPages(response.totalPages);
        setTotalDocuments(response.totalDocument);
        setCurrentPage(response.currentPage)
      }
      setSearchLoading(false);
      setisLoading(false);
    },
    onError: (error) => {

      settopupData([]);
      setSearchLoading(false);
    },
  });


  useEffect(() => {
    getallTopuptableMutate({
      search: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage,
      currentPage,
      from_date,
      to_date
    });
  }, [currentPage, itemsPerPage, debouncedSearch, isviewOpen, from_date, to_date]);


  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "sent":
        return { bg: "bg-[#12B76A38]", text: "text-[#12B76A]" };
      case "pending":
        return { bg: "bg-[#FEC84B38]", text: "text-[#FDA700]" };
      case "failed":
        return { bg: "bg-[#FF000038]", text: "text-[#F04438]" };
      default:
        return { bg: "bg-gray-200", text: "text-gray-800" };
    }
  };
  
  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * limit,
    },
    {
      header: "Type",
      cell: ({ SMS, WhatsApp, Email }) =>
        ["SMS", "WhatsApp", "Email"].filter((type, i) => [SMS, WhatsApp, Email][i]).join(", ") || "-",
    },
    {
      header: "Topup Date",
      cell: (row) => {
        const date = new Date(row?.updatedAt);
        return date.toLocaleDateString("en-GB") || "-";
      },
    },
    {
      header: "Requested Credit",
      cell: (row) => formatNumber({ value: row?.requestedAmount, decimalPlaces: 0 }),
    },
    {
      header: "Actual Amount",
      cell: (row) =>
        formatNumber({ value: row?.actualAmount, decimalPlaces: 0 }),
    },
    {
      header: "Date",
      cell: (row) => {
        const date = new Date(row?.createdAt);
        return date.toLocaleDateString("en-GB") || "-";
      },
    },
    {
      header: "Actions",
      cell: (row) => {
        const statusLabel = row?.status === 0 ? "Pending" : "Sent";
        const { bg, text } = getStatusStyle(statusLabel);
        const isDisabled = superadmin !== 1;
  
        return (
          <button
            disabled={isDisabled || row?.status !== 0} 
            className={` 
              w-20 h-8 z-auto rounded-md py-1 px-2 flex justify-center items-center font-bold 
              ${bg} ${text}
              ${(isDisabled || row?.status !== 0) ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}
            `}
            onClick={handleaddTopUp}
          >
            {statusLabel || ""}
          </button>
        );
      },
    }
    
    
  
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
          { label: "Account Reports" },
          { label: "Topup Summary", active: true },
        ]}
      />
      <div className="flex flex-col p-4 bg-white border-[1px] border-[#F2F2F9] rounded-[16px] ">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-start">

            </div>
            <div className="flex z-50 justify-end items-center gap-4">
              <DateRangeSelector
                onChange={(range) => {
                  setfrom_date(range.startDate);
                  setto_date(range.endDate);
                }}
              />
              <ExportDropdown
                apiData={topupData}
                fileName={`Overall report ${new Date().toLocaleDateString(
                  "en-GB"
                )}`}
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Table
            data={topupData}
            columns={columns}
            loading={isLoading}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalDocuments}
            handleItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
        <ModelOne
          title="Approve Topup"
          extraClassName="w-1/3 "
          setIsOpen={setIsviewOpen}
          isOpen={isviewOpen}
          closeModal={closeIncommingModal}
        >
          <TopupForm closeIncommingModal={closeIncommingModal} status={status} clearstatus={clearstatus} />
        </ModelOne>
        <Modal />

      </div>
    </>
  );
};

export default topupApprovals;


export const TopupForm = ({ closeIncommingModal, clearstatus, status }) => {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [formData, setFormData] = useState({});

  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {

    setFormData(status)

    return () => {
      clearstatus();
    };
  }, []);



  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);

    try {
      const updatedFormData = { ...formData, status: 1 };

      updateTopupStatus({ id: status._id, data: updatedFormData });

    } catch (error) {
      console.error("Error submitting form:", error);
      setIsLoading(false);
    }
  };

  const { mutate: updateTopupStatus } = useMutation({
    mutationFn: (payload) => updateStatus(payload),
    onSuccess: (response) => {
      if (response) {
        closeIncommingModal()
        toast.success(response.message)
      }
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Mutation Error:", error);
      settopupData([]);
      setIsLoading(false);
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

    if (!formData.requestedAmount) {
      errors.requestedAmount = "Amount is required";
    }
    if (!formData.remarks) {
      errors.remarks = "Remarks is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700">
          Amount<span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="requestedAmount"
          value={formData.requestedAmount}
          onChange={handleChange}
          minLength={"2"}
          placeholder="Enter Topup Amount"
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {formErrors.requestedAmount && (
          <div className="text-red-500 text-sm">{formErrors.requestedAmount}</div>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700">
          Remarks<span className="text-red-400">*</span>
        </label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          minLength={2}
          placeholder="Enter remarks"
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        ></textarea>

        {formErrors.remarks && (
          <div className="text-red-500 text-sm">{formErrors.remarks}</div>
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
            {isLoading ? <SpinLoading /> : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};




