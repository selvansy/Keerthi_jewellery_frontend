import React, { useEffect, useState, useCallback, useMemo } from "react";
import Table from "../../common/Table";
import { useDebounce } from "../../../hooks/useDebounce";
import { Search} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getSchemeTable,
  getallbranch,
  changeschemestatus,
  allbranchclassification,
  getallmetal,
  getallschemetypes,
  allinstallmenttype,
  allFundtype,
  puritybymetal,
  wastagetype,
  deleteScheme,
} from "../../../api/Endpoints";
import { useDispatch, useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import { eventEmitter } from "../../../../utils/EventEmitter";
import { openModal } from "../../../../redux/modalSlice";
import Modal from "../../../components/common/Modal";
import FilterForm from "./FilterForm";
import Action from "../../common/action";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";

const Scheme = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_branch = roledata?.branch;

  const [isLoading, setisLoading] = useState(true);
  const [schemeData, setSchemeData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocument, setTotalDocument] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [from_date, setFromdate] = useState("");
  const [to_date, setTodate] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
    page: currentPage,
    limit: itemsPerPage,
    id_classification: "",
    id_metal: "",
    id_branch: id_branch,
    id_purity: "",
    weekmonth: "",
    scheme_type: "",
  });

  const handlePageChange = (page) => {
    const pageNumber = Number(page);
    if (
      !pageNumber ||
      isNaN(pageNumber) ||
      pageNumber < 1 ||
      pageNumber > totalPages
    ) {
      // return;
    }

    setCurrentPage(pageNumber);
  };

  const handleReset = useCallback(() => {
    setFromdate("");
    setTodate("");
    setFilters((prev) => ({
      ...prev,
      id_classification: "",
      id_metal: "",
      id_branch: id_branch,
      id_purity: "",
      weekmonth: "",
      scheme_type: "",
    }));
    // SetFiltered(false);
    toast.success("Filter is cleared");
    getSchemeTable({
      from_date: "",
      to_date: "",
      page: currentPage,
      limit: itemsPerPage,
      id_classification: "",
      id_metal: "",
      id_branch: id_branch,
      id_purity: "",
      weekmonth: "",
      scheme_type: "",
    });
  }, [currentPage, itemsPerPage, id_branch]);

  const handleallbranch = useCallback(async () => {
    const response = await getallbranch();
    if (response) setBranchList(response.data);
  }, []);

  // useEffect(() => {
  //   if (metalid) getPurity(metalid);
  // }, [metalid]);

  const { mutate: allbranchclassificationmuate } = useMutation({
    mutationFn: allbranchclassification,
    onSuccess: (response) => setClassification(response.data),
    onError: (error) => console.error("Error:", error),
  });

  const { mutate: getAllMetals } = useMutation({
    mutationFn: getallmetal,
    onSuccess: (response) => setMetalData(response.data),
    onError: (error) => console.error("Error:", error),
  });

  const { mutate: getAllInstallmentTypes } = useMutation({
    mutationFn: allinstallmenttype,
    onSuccess: (response) => setInstallmentTypeData(response.data),
    onError: (error) =>
      console.error("Error fetching installment types:", error),
  });

  const { mutate: getPurity } = useMutation({
    mutationFn: puritybymetal,
    onSuccess: (response) => setPurityData(response.data),
    onError: (error) => {
      console.error("Error fetching purity types:", error);
      setPurityData([]);
    },
  });

  const { mutate: getAllSchemeTypes } = useMutation({
    mutationFn: getallschemetypes,
    onSuccess: (response) => setSchemeTypeData(response.data),
    onError: (error) => console.error("Error fetching scheme types:", error),
  });

  const { mutate: getAllWastage } = useMutation({
    mutationFn: wastagetype,
    onSuccess: (response) => setWastage(response.data),
    onError: (error) => console.error("Error fetching scheme types:", error),
  });

  const { mutate: getSavingType } = useMutation({
    mutationFn: allFundtype,
    onSuccess: (response) => setFundType(response.data),
    onError: (error) => console.error("Error:", error),
  });

  const filterInputchange = useCallback(
    (e) => {
      const { name, value } = e.target;
      if (
        name === "id_purity" ||
        name === "weekmonth" ||
        name === "scheme_type" ||
        name === "wastagebenefit"
      ) {
        setFilters((prev) => ({ ...prev, [name]: Number(value) }));
        return;
      }
      if (name === "id_branch") allbranchclassificationmuate(value);
      if (name === "id_metal") {
        setMetalid(value);
        setFilters((prev) => ({ ...prev, [name]: value, id_purity: "" }));
      }
      setFilters((prev) => ({ ...prev, [name]: value }));
    },
    [allbranchclassificationmuate]
  );

  const applyfilterdatatable = useCallback(
    (e) => {
      e.preventDefault();
      const filterTosend = {
        from_date: from_date,
        to_date: to_date,
        search: debouncedSearch,
        page: currentPage,
        limit: itemsPerPage,
        id_branch: filters.id_branch,
        id_classification: filters.id_classification,
        metalid: filters.metalid,
        id_purity: filters.id_purity,
        weekmonth: filters.weekmonth,
        wastagebenefit: filters.wastagebenefit,
        scheme_type: filters.scheme_type,
      };
      SetFiltered(true);
      getSchemeDataTable(filterTosend);
    },
    [from_date, to_date, debouncedSearch, currentPage, itemsPerPage, filters]
  );

  useEffect(() => {
    getSchemeDataTable({
      from_date: "",
      to_date: "",
      search: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage,
      id_branch: filters.id_branch,
      id_classification: "",
      metalid: "",
      id_purity: "",
      weekmonth: "",
      wastagebenefit: "",
      scheme_type: "",
      buytgsttype: "",
    });
  }, [currentPage, itemsPerPage, debouncedSearch, filters.id_branch]);

  useEffect(() => {
    const handleConfirmationSubmit = async (data) => {
      try {
        deleteSchemeId(data.schemeId);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    eventEmitter.on("CONFIRMATION_SUBMIT", handleConfirmationSubmit);
    return () =>
      eventEmitter.off("CONFIRMATION_SUBMIT", handleConfirmationSubmit);
  }, []);

  const { mutate: getSchemeDataTable } = useMutation({
    mutationFn: (payload) => getSchemeTable(payload),
    onSuccess: (response) => {
      if (response) {
        setSchemeData(response.data);
        setTotalDocument(response.totalDocument);
        setisLoading(false);
        setSearchLoading(false)
      }
    },
    onError: (error) => {
      setisLoading(false);
      console.error("Error:", error);
    },
  });

  const handleCreateSchemeClick = useCallback(
    () => navigate("/scheme/addscheme"),
    [navigate]
  );

  const handleSearch = useCallback((e) => setSearch(e.target.value), []);

  const handleStatusToggle = useCallback(
    async (id) => {
      try {
        const response = await changeschemestatus(id);
        if (response) {
          toast.success(response.message);
          setSchemeData((prevData) =>
            prevData.map((scheme) =>
              scheme._id === id ? { ...scheme, active: !scheme.active } : scheme
            )
          );

          getSchemeDataTable({
            from_date: from_date,
            to_date: to_date,
            search: debouncedSearch,
            page: currentPage,
            limit: itemsPerPage,
            id_branch: filters.id_branch,
            id_classification: filters.id_classification,
            metalid: filters.metalid,
            id_purity: filters.id_purity,
            scheme_type: filters.scheme_type,
          });
        }
      } catch (error) {
        toast.error("Failed to toggle scheme status");
        console.error("Error:", error);
      }
    },
    [from_date, to_date, debouncedSearch, currentPage, itemsPerPage, filters]
  );

  const handleEdit = useCallback(
    (id) => navigate(`/scheme/addscheme/${id}`),
    [navigate]
  );

  const handleView = useCallback(
    (id) => navigate(`/scheme/view/${id}`),
    [navigate]
  );

  const handleDigiGold = useCallback(
    (id) => navigate(`/scheme/editdigigold/${id}`),
    [navigate]
  );

  const handleItemsPerPageChange = useCallback((value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  }, []);

  const handleClickfilter = useCallback(() => {
    handleallbranch();
    getAllMetals();
    getAllInstallmentTypes();
    getAllSchemeTypes();
    getAllWastage();
    gstTypeDataTable();
    getSavingType();
    setIsFilterOpen(true);
  }, [
    handleallbranch,
    getAllMetals,
    getAllInstallmentTypes,
    getAllSchemeTypes,
    getAllWastage,
    getSavingType,
  ]);

  const handleDelete = useCallback(
    (id) => {
      setActiveDropdown(null);
      dispatch(
        openModal({
          modalType: "CONFIRMATION",
          header: "Delete Scheme",
          formData: {
            message: "Are you sure you want to delete?",
            schemeId: id,
          },
          buttons: { cancel: { text: "Cancel" }, submit: { text: "Delete" } },
        })
      );
    },
    [dispatch]
  );

  const { mutate: deleteSchemeId } = useMutation({
    mutationFn: deleteScheme,
    onSuccess: (response) => {
      toast.success(response.message);
      getSchemeDataTable({
        from_date: "",
        to_date: "",
        search: debouncedSearch,
        page: currentPage,
        limit: itemsPerPage,
        id_branch: filters.id_branch,
        id_classification: "",
        metalid: "",
        id_purity: "",
        weekmonth: "",
        wastagebenefit: "",
        scheme_type: "",
        buytgsttype: "",
      });
      eventEmitter.off("CONFIRMATION_SUBMIT");
    },
    onError: (error) => {
      eventEmitter.off("CONFIRMATION_SUBMIT");
      console.error("Error:", error);
    },
  });

  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
  };

  const columns = useMemo(
    () => [
      {
        header: "S.No",
        cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
      },
      {
        header: "Scheme",
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

          if (amount !== null && amount !== undefined) {
            return `${scheme_name} (₹ ${amount})`;
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
            ;
          }
          if (!digi && min_amount !== null && max_amount !== null) {
            return `${scheme_name} ( ₹ ${min_amount} - ₹ ${max_amount})`;
          }

          // Fallback
          return `${scheme_name} (Details Unavailable)`;
        },
      },
      { header: "Code", cell: (row) => row?.code },
      {
        header: "Metal Name",
        cell: (row) => row.metal_name,
      },
      { header: "Installments", cell: (row) => {
        if (row.scheme_type !== 10 && row.scheme_type !== 14 || row.scheme_type !== "10" && row.scheme_type !== "14") {
          return row?.total_installments;
        } else{
          return `-`;
        }
      }, },
      {
        header: "Maturity Month",
        cell: (row) => {
          if (row.scheme_type !== 10 && row.scheme_type !== 14) {
            return row?.maturity_period
          } else {
            return `${row?.noOfDays} (Days)`
          }
        },
      },
      {
        header: "Display Order",
        cell: (row) => row?.classification_order || "-"
      },
      {
        header: "Scheme Type",
        cell: (row) => row.schemetype_name,
      },
      {
        header: "Classification",
        cell: (row) => row?.classification_name || "N/A",
      },
      {
        header: "Create Date",
        cell: (row) => {
          const date = new Date(row?.createdAt);
          return date.toLocaleDateString("en-GB");
        },
      },
      {
        header: "Active",
        accessor: "active",
        cell: (row) => (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={row?.active === true}
              onChange={() => handleStatusToggle(row?._id, row?.is_accounts)}
            />
            <div
              className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-[#E7EEF5] p-[2px] after:duration-300 after:bg-[#004181] ${
                row?.active === true
                  ? "peer-checked:bg-[#E7EEF5] peer-checked:ring-[#E7EEF5]"
                  : "peer-checked:bg-[#E7EEF5] peer-checked:ring-gray-400"
              } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-[${layout_color}] peer-hover:after:scale-95`}
            ></div>
          </label>
        ),
      },
      {
        header: "Actions",
        cell: (row, rowIndex) => (
          <Action
            row={row}
            // data={purityData}
            rowIndex={rowIndex}
            activeDropdown={activeDropdown}
            setActive={hanldeActiveDropDown}
            // handleEdit={row.scheme_type !== 10 ? handleEdit : handleDigiGold}
            handleView={handleView}
            cancel={true}
            showEdit={false}
            showDelete={false}
          />
        ),
        sticky: "right",
      },
    ],
    [
      currentPage,
      itemsPerPage,
      activeDropdown,
      schemeData,
      handleEdit,
      handleDelete,
      handleStatusToggle,
    ]
  );
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Scheme" },
          { label: "Existing Scheme", active: true },
        ]}
      />

      <div className="flex flex-col p-4 -ml-1 bg-white border border-[#F2F2F9] rounded-[16px]">
        <div className="flex flex-col gap-4 mt-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex flex-row w-full items-center justify-end gap-2">
            {/* Search Box Second */}
            <div className="relative w-full sm:mb-0 sm:order-2 sm:w-auto">
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
                placeholder="Search"
                className="px-4 py-2 ps-9 border-2 border-[#F2F2F9] rounded-[8px] w-full h-[36px] sm:w-[228px]"
              />
            </div>
            {/* Button First */}
           
          </div>
           <button
              className="rounded-md px-5 py-1 text-sm font-semibold text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] w-[158px] h-[36px] transition-colors"
              onClick={handleCreateSchemeClick}
              style={{ backgroundColor: layout_color }}
            >
              <span className="text-lg mr-2">+</span> 
               Add Scheme
            </button>
        </div>

        <div className="mt-4">
          <Table
            data={schemeData}
            columns={columns}
            isLoading={isLoading}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalDocument}
            handleItemsPerPageChange={handleItemsPerPageChange}
            debounceSearch={handleSearch}
          />
        </div>
      </div>

      <Modal />
    </>
  );
};

export default Scheme;
