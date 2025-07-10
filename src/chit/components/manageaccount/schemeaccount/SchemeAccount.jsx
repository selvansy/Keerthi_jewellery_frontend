import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { createPortal } from "react-dom";

import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";
import Table from "../../common/Table";
import Modal from "../../common/Modal";
import ModelOne from "../../common/Modelone";
import { useDebounce } from "../../../hooks/useDebounce";
import { setScemeAccountId } from "../../../../redux/clientFormSlice";
import ExportDropdown from "../../../components/common/Dropdown/Export";
import Ledgerdetails from "./ledgerdetails";
import { allschemestatus, schemeaccounttable } from "../../../api/Endpoints";

import eyeIcon from "../../../../assets/icons/eye.svg";
import More from "../../../../assets/icons/more.svg";
import gift from "../../../../assets/icons/gift.svg";
import { formatDate } from "../../../../utils/FormatDate";
import plus from "../../../../assets/plus.svg";
import Select from "react-select";
import { customSelectStyles } from "../../Setup/purity";

const statusStyles = {
  Open: {
    bg: "bg-[#12B76A38]",
    text: "text-green-500",
  },
  Completed: {
    bg: "bg-[#FDA70038]",
    text: "text-[#FDA700]",
  },
  Closed: {
    bg: "bg-[#FF000038]",
    text: "text-red-500",
  },
  Preclose: {
    bg: "bg-[#FF000038]",
    text: "text-red-500",
  },
  Refund: {
    bg: "bg-[#FF000038]",
    text: "text-red-500",
  },
};

const SchemeAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocument, setTotalDocument] = useState(0);
  const [schemeaccount, setSchemeaccount] = useState([]);
  const [schaccExp, setSchaccExp] = useState([]);
  const [status, setStatus] = useState([]);
  const [searchInput, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isviewOpen, setIsviewOpen] = useState(false);
  const [popuptitle, setPopuptitle] = useState("");
  const [displaysetting, setDiplaySetting] = useState(0);
  const [activeFilter, setActiveFilter] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [activeDropdown, setActiveDropdown] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const debouncedSearch = useDebounce(searchInput, 500);
  const dropdownRef = useRef(null);

  // API Queries
  const { data: scheme_status } = useQuery({
    queryKey: ["schemestatus"],
    queryFn: () => allschemestatus(),
  });

  // API Mutation for fetching scheme accounts
  const { mutate: getschemeaccountMutate } = useMutation({
    mutationFn: (payload) => schemeaccounttable(payload),
    onSuccess: (response) => {
      setSchemeaccount(response.data);
      setTotalPages(response.totalPages);
      setTotalDocument(response.totalDocument);

      const exportData = response.data.map((item) => ({
        scheme_acc_number: item.scheme_acc_number,
        account_name: item.account_name,
        mobile: item.mobile,
        total_paidinstallments: item.total_paidinstallments,
        total_paidamount: item.total_paidamount,
        total_weight: item.total_weight,
        start_date: item.start_date,
        maturity_date: item.maturity_date,
        branch_name: item.branch_name,
      }));

      setSchaccExp(exportData);
      setSearchLoading(false);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Error fetching scheme accounts:", error);
      setSearchLoading(false);
      setIsLoading(false);
    },
  });

  // Effects
  useEffect(() => {
    if (scheme_status) {
      const formattedStatus = scheme_status.data.map((status) => ({
        value: Number(status.id_status),
        label: status.status_name,
      }));
      formattedStatus.push({value:"",label:"All"})
      setStatus(formattedStatus);
    }
  }, [scheme_status]);

  useEffect(() => {
    const filterTosend = {
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
      type: activeFilter,
    };
    getschemeaccountMutate(filterTosend);
  }, [currentPage, itemsPerPage, debouncedSearch, activeFilter]);

  // Event handlers
  const closeIncommingModal = () => {
    setIsviewOpen(false);
  };

  const handleClick = () => {
    navigate("/managecustomers/addcustomer");
  };

  const handleOpenLedger = (data) => {
    if (!data) return;
    setPopuptitle("View Details");
    setDiplaySetting(1);
    setIsviewOpen(true);
    dispatch(setScemeAccountId(data));
  };

  const handleSelect = (value) => {
    const num = parseInt(value);
    setSelectedValue(value);
    setActiveFilter(value !== "" ? num : "");
  };

  const hanldeActiveDropDown = (id, event) => {
    if (id) {
      const rect = event.currentTarget.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right - 130,
      });
    }
    setActiveDropdown(id);
  };

  const handleGift = (data) => {
    navigate(`/gift/giftissues/creategiftissue`, { state: { data } });
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    const pageNumber = Number(page);
    if (!pageNumber || isNaN(pageNumber)) return;
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
  };

  // Table columns configuration
  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Accounter Name",
      cell: (row) => row?.customer_name,
    },
    {
      header: "Mobile",
      cell: (row) => row?.mobile,
    },
    {
      header: "Scheme Name",
      cell: (row) => {
        const {
          scheme_name,
          amount,
          min_amount,
          max_amount,
          min_weight,
          max_weight,
          scheme_type,
        } = row;

        // Priority 1: Fixed amount
        if (scheme_type === 10) {
          return `${scheme_name} ( ₹ ${min_amount} - ₹ ${max_amount})`;
        }

        if (scheme_type === 14) {
          return `${scheme_name} ( ₹ ${min_amount} - ₹ ${max_amount})`;
        }

        // Weight-based schemes (type 12, 3, 4)
        const isWeightBased = [12, 3, 4].includes(Number(scheme_type));

        if (isWeightBased && min_weight !== null && max_weight !== null) {
          return `${scheme_name} ( ${min_weight} g - ${max_weight} g)`;
        }

        // Amount-based schemes (default)
        if (!isWeightBased && min_amount !== null && max_amount !== null) {
          return `${scheme_name} ( ₹ ${min_amount} - ₹ ${max_amount})`;
        }

        // Amount-based schemes (default)
        const digi = [11, 12].includes(Number(scheme_type));
        if (digi) {
        }
        if (!digi && min_amount !== null && max_amount !== null) {
          return `${scheme_name} ( ₹ ${min_amount} - ₹ ${max_amount})`;
        }

        // Fallback
        return `${scheme_name} (Details Unavailable)`;
      },
    },
    {
      header: "Scheme Acc No",
      cell: (row) => row?.scheme_acc_number || "Not Allocated",
    },
    {
      header: "Paid Installments",
      cell: (row) => (
        <div
          className={`w-16 h-8 rounded-md py-1 flex justify-center items-center ${
            row?.total_paidinstallments > 0
              ? "bg-[#12B76A38] text-green-500 font-medium"
              : "bg-[#FF000038] text-red-500 font-medium"
          }`}
        >
          {row.scheme_type == 10 || row.scheme_type == 14
            ? `${row?.paid_installments}`
            : `${row?.paid_installments}/${row?.total_installments}`}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) => {
        const status = row?.status_name;
        const styles = statusStyles[status] || {
          bg: "bg-gray-200",
          text: "text-gray-700",
        };

        return (
          <div
            className={`w-24 h-8 rounded-md py-1 px-2 flex justify-center items-center font-medium ${styles.bg} ${styles.text}`}
          >
            {status}
          </div>
        );
      },
    },
    {
      header: "Start Date",
      cell: (row) => formatDate(row?.start_date),
    },
    {
      header: "Maturity Date",
      cell: (row) => row?.maturity_date,
    },
    {
      header: "Last Paid Date",
      cell: (row) => formatDate(row.last_paid_date),
    },
    {
      header: "Scheme Type",
      cell: (row) => row?.scheme_typename,
    },
    {
      header: "Classification",
      cell: (row) => row?.classification?.name || "-",
    },
    {
      header: "Created Through",
      cell: (row) => row?.created_through,
    },
    {
      header: "Action",
      cell: (row) => (
        <div
          ref={dropdownRef}
          className="dropdown-container relative flex items-center"
        >
          <button
            className="p-2 border hover:bg-gray-100 rounded-full flex justify-center"
            onClick={(e) => {
              e.stopPropagation();
              hanldeActiveDropDown(
                activeDropdown === row?._id ? null : row?._id,
                e
              );
            }}
          >
            <img src={More} alt="More options" className="w-[20px] h-[20px]" />
          </button>

          {activeDropdown === row?._id &&
            createPortal(
              <div
                className="absolute"
                style={{
                  top: position.top,
                  left: position.left,
                  zIndex: 9999,
                  filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.15))",
                }}
              >
                <div className="w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      className="w-full text-left text-nowrap px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => {
                        handleOpenLedger(row._id);
                        hanldeActiveDropDown(null);
                      }}
                    >
                      <img
                        src={eyeIcon}
                        alt="View"
                        className="text-black w-4 h-4 mr-1"
                      />
                      View
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => {
                        setActiveDropdown(null);
                        handleGift(row);
                      }}
                    >
                      <img
                        src={gift}
                        alt="Gift"
                        className="w-[16px] h-[16px]"
                      />
                      Gift Handover
                    </button>
                    {/* Add Cancel button here */}
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 border-t border-gray-100"
                      onClick={() => hanldeActiveDropDown(null)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
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
              </div>,
              document.body
            )}
        </div>
      ),
    },
  ];
  console.log(activeFilter)

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Managecustomers" },
          { label: "Customer Schemes", active: true },
        ]}
      />

      <div className="flex flex-col p-4 bg-white border border-[#F2F2F9] rounded-[16px]">
        <div className="flex flex-col gap-4 mt-4 sm:flex-row sm:justify-between sm:items-center">
          {/* Filters and Search */}
          <div className="flex flex-col gap-2 sm:items-center sm:gap-4 w-full sm:w-auto">
            <div className="w-full">
              <div className="relative w-full">
                {/* <select
                  className="appearance-none border-2 focus:ring-1  focus:ring-[#004181] outline-none  border-[#F2F2F9] rounded-[8px] p-1 w-full h-[36px] bg-white text-gray-700"
                  value={selectedValue}
                  
                  onChange={(e) => handleSelect(e.target.value)}
                >
                  <option value="">All Status</option>
                  {status.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select> */}
                <Select
                  options={status}
                  isClearable={true}
                  value={
                    status.find((status) => status.value === activeFilter) ||
                    ""
                  }
                  onChange={(selectedOption) =>
                    handleSelect(selectedOption?.value)
                  }
                  styles={customSelectStyles}
                  placeholder="Scheme Filter"
                />
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="black"
                  >
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="relative w-full sm:w-[228px]">
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
                  setSearch(e.target.value);
                }}
                placeholder="Search"
                className="px-4 py-2 ps-9 border-2 border-[#F2F2F9] rounded-[8px] w-full h-[36px]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto lg:pt-10">
            <div className="w-full sm:w-auto">
              <ExportDropdown
                apiData={schaccExp}
                fileName={`Customer Schemes ${new Date().toLocaleDateString(
                  "en-GB"
                )}`}
              />
            </div>

            <div className="w-full sm:w-auto">
              <button
                type="button"
                className="flex rounded-lg px-[20px] py-[8px] text-sm font-semibold text-white items-center whitespace-nowrap hover:bg-[#034571] transition-colors sm:w-auto"
                style={{ backgroundColor: layout_color }}
                onClick={handleClick}
              >
                <img src={plus} alt="plus" className="w-4 h-4 me-[10px]" />
                Add Customer
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="mt-4">
          <Table
            data={schemeaccount}
            columns={columns}
            loading={isLoading}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalDocument}
            handleItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>

        <Modal />

        {displaysetting === 1 && (
          <ModelOne
            title={popuptitle}
            extraClassName="w-[700px] max-h-[90vh] overflow-y-auto"
            setIsOpen={setIsviewOpen}
            isOpen={isviewOpen}
            closeModal={closeIncommingModal}
          >
            <Ledgerdetails setIsOpen={setIsviewOpen} />
          </ModelOne>
        )}
      </div>
    </>
  );
};

export default SchemeAccount;
