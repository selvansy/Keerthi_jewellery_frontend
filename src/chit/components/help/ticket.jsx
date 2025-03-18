import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import { useSelector, useDispatch } from "react-redux";
import { Search, X, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getAllTicket } from "../../api/Endpoints";
import "react-datepicker/dist/react-datepicker.css";
import usePagination from "../../hooks/usePagination";
import { useDebounce } from "../../hooks/useDebounce";
import TicketSubmissionForm from "./Addticket";
import { Button } from "@headlessui/react";
import DescriptionModal from "./discriptionModal";

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
      console.log(error.response.data);
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
      <div className="flex flex-col p-4">
        <h2 className="text-2xl text-gray-900 font-bold">Tickets</h2>
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
              placeholder="Search..."
              className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
              onChange={(e) => {
                setSearchLoading(true);
                setSearchInput(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-row items-center justify-end gap-2">
            <button
              type="button"
              className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 transition-colors"
              onClick={() => setModalOpen(true)}
              style={{ backgroundColor: layout_color }}
            >
              + Create a Ticket
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
    </>
  );
};

export default Ticket;
