import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import { useSelector, useDispatch } from "react-redux";
import { Search, X, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAllTicket } from "../../api/Endpoints";
import "react-datepicker/dist/react-datepicker.css";
import usePagination from "../../hooks/usePagination";
import { useDebounce } from "../../hooks/useDebounce";
import TicketSubmissionForm from "./Addticket";
import { Button } from "@headlessui/react";
import DescriptionModal from "./discriptionModal";
import plus from "../../../assets/plus.svg";
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";

const Ticket = () => {

  const roledata = useSelector((state) => state.clientForm.roledata);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const branchAccess = roledata?.branch;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [ticketData, setTicketData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);


  useEffect(() => {
    getTickets({
      search: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage,
    });
  }, [currentPage, itemsPerPage, debouncedSearch, modalOpen]);

  const { mutate: getTickets } = useMutation({
    mutationFn: (payload) => getAllTicket(payload),
    onSuccess: (response) => {
      if (response) {
        setTicketData(response.data);
        setTotalPages(response.totalPages);
        setTotalDocuments(response.totalDocuments)
      }
      setSearchLoading(false);
      setIsLoading(false);
    },
    onError: (error) => {
      ;
      setTicketData([]);
      setIsLoading(false);
      setSearchLoading(false);
    },
  });

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "# Ticket No",
      cell: (row) => row?.id_ticketNo,
    },
    {
      header: "Type",
      cell: (row) => row.option,
    },
    {
      header: "Create Date",
      cell: (row) => {
        const date = new Date(row?.createdAt);
        return date.toLocaleDateString("en-GB");
      },
    },
    {
      header: "Actions",
      cell: (row) => (
        <button
          onClick={() => {
            setSelectedTicket(row);
            setIsDescriptionModalOpen(true);
          }}
          className="p-2 text-blue-600 hover:text-blue-800"
          title="View Description"
        >
          <Eye size={18} />
        </button>
      ),
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

  const paginationData = {
    totalItems: totalPages,
    currentPage: currentPage,
    itemsPerPage: itemsPerPage,
    handlePageChange: handlePageChange,
  };
  const paginationButtons = usePagination(paginationData);

  return (
    <>
    <Breadcrumb items={[
            {label:"Help"},
            {label:"Ticket Raise",active:true}
          ]}/>
    <div className="flex flex-col p-4 bg-white border-[1px] border-[#F2F2F9] rounded-[16px]">
      <div className="flex flex-col p-4">
        {/* <h2 className="text-2xl text-gray-900 font-bold">Tickets</h2> */}
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
          <div className="relative w-full lg:w-1/3 min-w-[200px]">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {searchLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2" />
              ) : (
                <Search className="text-gray-500 w-5 h-5" />
              )}
            </div>
            <input
              placeholder="Search..."
              className="px-4 py-2 ps-9 border-2 border-[#F2F2F9] rounded-lg w-full h-[36px] text-md sm:w-[228px]"
              onChange={(e) => {
                setSearchLoading(true);
                setSearchInput(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-row items-center justify-end gap-2">
            <button
              type="button"
              className=" flex rounded-lg px-[20px] py-[8px] text-sm font-semibold text-white items-center whitespace-nowrap hover:bg-[#034571] transition-colors sm:w-auto"
              onClick={() => setModalOpen(true)}
              style={{ backgroundColor: layout_color }}
            >
              <img src={plus} alt="plus" className="w-4 h-4 me-[10px]" />
              Create a Ticket
            </button>
          </div>
        </div>

        <div className="mt-4">
          <Table data={ticketData} columns={columns} loading={isLoading} currentPage={currentPage} handleItemsPerPageChange={handleItemsPerPageChange} handlePageChange={handlePageChange} itemsPerPage={itemsPerPage} totalItems={totalDocuments}/>
        </div>




        {/* Using the internal modal component */}
        <DescriptionModal
          isOpen={isDescriptionModalOpen}
          onClose={() => setIsDescriptionModalOpen(false)}
          ticket={selectedTicket}
        />
        <div>
          <TicketSubmissionForm
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        </div>
      </div>
      </div>
    </>
  );
};

export default Ticket;
