import React, { useState, useEffect } from "react";
import Table from "../../common/Table";
import { Search } from "lucide-react";
import { data, useNavigate } from "react-router-dom";
import {
  NotifcationsHistory,

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
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";
import DateRangeSelector from "../../common/calender";
import ExportDropdown from "../../common/Dropdown/Export";


function NotificationHistory() {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);
  const branch = roledata?.branch;

  const branchAccess = Number(branch);

  const dispatch = useDispatch();
  const [notiData, setnotiData] = useState([]);

  const [isLoading, setisLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [doc, setDocument] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [searchLoading, setSearchLoading] = useState(false);
  const [from_date, setfrom_date] = useState();
  const [to_date, setto_date] = useState();

  const limit = 10;

  const { mutate: getallNotificationsTable } = useMutation({
    mutationFn: (payload) => NotifcationsHistory(payload),
    onSuccess: (response) => {
      if (response) {
        setnotiData(response.data);
        setTotalPages(response.totalPages);
        setDocument(response.totalDocument)
      }
      setSearchLoading(false);
      setisLoading(false);
    },
    onError: (error) => {

      setnotiData([]);
      setSearchLoading(false);
    },
  });



  useEffect(() => {
    getallNotificationsTable({
      search: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage,
      currentPage,
      from_date,
      to_date,
    });
  }, [currentPage, itemsPerPage, debouncedSearch, from_date, to_date]);



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
      header: "Notification ID",
      cell: (row) => row?._id,
    },
    {
      header: "Notification Title",
      cell: (row) => row?.title,
    },
    {
      header: "Sent Date",
      cell: (row) => {
        const date = new Date(row?.createdAt);
        return date.toLocaleDateString("en-GB") || "-";
      },
    },
    {
      header: "Delivery Status",
      cell: (row) => {
        const { bg, text } = getStatusStyle(row?.status);
        return (
          <div
            className={`w-20 h-8 rounded-md py-1 px-2 flex justify-center items-center font-bold ${bg} ${text}`}
          >
            {row?.status || ""}
          </div>
        );
      },
    },
    // {
    //   header: "Target Audience (All Users/Specific Group) ",
    //   cell: (row) => row?.pushFailCount,
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
        items={[
          { label: "Scheme Reports" },
          { label: "Notifications Summary", active: true },
        ]}
      />
      <div className="flex flex-col p-4 bg-white border-[1px] border-[#F2F2F9] rounded-[16px] ">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-start">

            </div>
            <div className="flex justify-end items-center gap-4">
              <DateRangeSelector
                onChange={(range) => {
                  setfrom_date(range.startDate);
                  setto_date(range.endDate);
                }}
              />
              <ExportDropdown
                apiData={notiData}
                fileName={`Overall report ${new Date().toLocaleDateString(
                  "en-GB"
                )}`}
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Table
            data={notiData}
            columns={columns}
            loading={isLoading}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={doc}
            handleItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>


      </div>
    </>
  )
}

export default NotificationHistory