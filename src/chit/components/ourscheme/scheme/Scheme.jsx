import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Table from '../../common/Table';
import { useDebounce } from '../../../hooks/useDebounce';
import { SlidersHorizontal, Search, X, CalendarDays, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getSchemeTable, getallbranch, changeschemestatus, allbranchclassification, getallmetal, getallschemetypes, allinstallmenttype, allFundtype,
  puritybymetal, buygsttype, wastagetype, deleteScheme
} from "../../../api/Endpoints";
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { eventEmitter } from '../../../../utils/EventEmitter';
import { openModal } from '../../../../redux/modalSlice';
import Modal from '../../../components/common/Modal';
import usePagination from '../../../hooks/usePagination';
import FilterForm from './FilterForm'; // Assume this is a new component for the filter form

const Scheme = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_branch = roledata?.branch;

  const [isLoading, setisLoading] = useState(true);
  const [filtered, SetFiltered] = useState(false);
  const [classificationData, setClassification] = useState([]);
  const [metalData, setMetalData] = useState([]);
  const [purityData, setPurityData] = useState([]);
  const [installmentTypeData, setInstallmentTypeData] = useState([]);
  const [schemeTypeData, setSchemeTypeData] = useState([]);
  const [gstTypeData, setgstTypeData] = useState([]);
  const [wastageType, setWastage] = useState([]);
  const [fundtype, setFundType] = useState([]);
  const [metalid, setMetalid] = useState('');
  const [schemeData, setSchemeData] = useState([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 600);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [from_date, setFromdate] = useState("");
  const [to_date, setTodate] = useState("");
  const [branchList, setBranchList] = useState([]);
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
    buytgsttype: ""
  });

  const handlePageChange = useCallback((page) => {
    const pageNumber = Number(page);
    if (!pageNumber || isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  }, []);

  const paginationData = useMemo(() => ({
    totalItems: totalPages,
    currentPage,
    itemsPerPage,
    handlePageChange
  }), [totalPages, currentPage, itemsPerPage, handlePageChange]);

  const paginationButtons = usePagination(paginationData);

  const handleReset = useCallback(() => {
    setFromdate("");
    setTodate("");
    setFilters(prev => ({
      ...prev,
      id_classification: "",
      id_metal: "",
      id_branch: id_branch,
      id_purity: "",
      weekmonth: "",
      scheme_type: "",
      buytgsttype: ""
    }));
    SetFiltered(false);
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
      buytgsttype: ""
    });
  }, [currentPage, itemsPerPage, id_branch]);

  const handleallbranch = useCallback(async () => {
    const response = await getallbranch();
    if (response) setBranchList(response.data);
  }, []);

  useEffect(() => {
    if (metalid) getPurity(metalid);
  }, [metalid]);

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
    onError: (error) => console.error("Error fetching installment types:", error),
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

  const { mutate: gstTypeDataTable } = useMutation({
    mutationFn: buygsttype,
    onSuccess: (response) => setgstTypeData(response.data),
    onError: (error) => console.error("Error:", error),
  });

  const { mutate: getSavingType } = useMutation({
    mutationFn: allFundtype,
    onSuccess: (response) => setFundType(response.data),
    onError: (error) => console.error("Error:", error),
  });

  const filterInputchange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'id_purity' || name === 'weekmonth' || name === "scheme_type" || name === "buytgsttype" || name === "wastagebenefit") {
      setFilters(prev => ({ ...prev, [name]: Number(value) }));
      return;
    }
    if (name === "id_branch") allbranchclassificationmuate(value);
    if (name === "id_metal") {
      setMetalid(value);
      setFilters(prev => ({ ...prev, [name]: value, id_purity: '' }));
    }
    setFilters(prev => ({ ...prev, [name]: value }));
  }, [allbranchclassificationmuate]);

  const applyfilterdatatable = useCallback((e) => {
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
      buytgsttype: filters.buytgsttype
    };
    SetFiltered(true);
    getSchemeDataTable(filterTosend);
  }, [from_date, to_date, debouncedSearch, currentPage, itemsPerPage, filters]);

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
      buytgsttype: ""
    });
  }, [currentPage, itemsPerPage, debouncedSearch, filters.id_branch]);

  useEffect(() => {
    const handleConfirmationSubmit = async (data) => {
      try {
        await deleteSchemeId(data.schemeId);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    eventEmitter.on('CONFIRMATION_SUBMIT', handleConfirmationSubmit);
    return () => eventEmitter.off('CONFIRMATION_SUBMIT', handleConfirmationSubmit);
  }, []);

  const { mutate: getSchemeDataTable } = useMutation({
    mutationFn: (payload) => getSchemeTable(payload),
    onSuccess: (response) => {
      if (response) setSchemeData(response.data);
      setisLoading(false);
    },
    onError: (error) => {
      setisLoading(false);
      console.error("Error:", error);
    },
  });

  const handleCreateSchemeClick = useCallback(() => navigate('/scheme/addscheme'), [navigate]);

  const handleSearch = useCallback((e) => setSearch(e.target.value), []);

  const handleStatusToggle = useCallback(async (id) => {
    const response = await changeschemestatus(id);
    if (response) {
      toast.success(response.message);
      getSchemeTable({
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
        buytgsttype: filters.buytgsttype
      });
    }
  }, [from_date, to_date, debouncedSearch, currentPage, itemsPerPage, filters]);

  const handleEdit = useCallback((id) => navigate(`/scheme/addscheme/${id}`), [navigate]);

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
  }, [handleallbranch, getAllMetals, getAllInstallmentTypes, getAllSchemeTypes, getAllWastage, gstTypeDataTable, getSavingType]);

  const handleDelete = useCallback((id) => {
    setActiveDropdown(null);
    dispatch(openModal({
      modalType: 'CONFIRMATION',
      header: 'Delete Scheme',
      formData: { message: 'Are you sure you want to delete?', schemeId: id },
      buttons: { cancel: { text: 'Cancel' }, submit: { text: 'Delete' } }
    }));
  }, [dispatch]);

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
        buytgsttype: ""
      });
      eventEmitter.off('CONFIRMATION_SUBMIT');
    },
    onError: (error) => {
      eventEmitter.off('CONFIRMATION_SUBMIT');
      console.error("Error:", error);
    },
  });

  const columns = useMemo(() => [
    { header: 'S.No', cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage },
    {
      header: 'Actions',
      cell: (row, rowIndex) => (
        <div className="dropdown-container relative">
          <button
            className="p-1 hover:bg-gray-100 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRow(row?._id);
              setActiveDropdown(activeDropdown === row?._id ? null : row?._id);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>
          {activeDropdown === row?._id && (
            <div className="absolute" style={{ top: rowIndex >= schemeData.length - 2 ? 'auto' : '72%', bottom: rowIndex >= schemeData.length - 2 ? '-74%' : 'auto', zIndex: 9999, marginBottom: '8px', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))' }}>
              <div className="w-32 rounded-md bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2" onClick={() => { handleEdit(row?._id); setActiveDropdown(null); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2" onClick={() => { handleDelete(row?._id); setActiveDropdown(null); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2" onClick={() => setActiveDropdown(null)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Scheme',
      cell: (row) => {
        if (row?.scheme_type === 0 || row?.scheme_type === 1 || row?.scheme_type === 2) {
          return `${row?.scheme_name} (₹ ${row?.amount})`;
        } else if (row?.scheme_type === 3) {
          return `${row?.scheme_name} (GRM ${row?.min_weight} - ${row?.max_weight})`;
        } else {
          return `${row?.scheme_name} (₹  ${row?.min_amount} - ${row?.max_amount})`;
        }
      }
    },
    { header: "Code", cell: (row) => row?.code },
    {
      header: 'Metal Name',
      cell: (row) => {
        return row?.id_metal === 1 ? 'Gold' :
          row?.id_metal === 2 ? 'Silver' :
            row?.id_metal === 3 ? 'Diamond' :
              row?.id_metal === 4 ? 'Platinum' : 'Gold Coins';
      }
    },
    { header: "Installments", cell: (row) => row?.total_installments },
    { header: "Maturity Month", cell: (row) => row?.maturity_month },
    {
      header: 'Scheme Type',
      cell: (row) => {
        if (row?.scheme_type === 1) return `Amount End Weight`;
        else if (row?.scheme_type === 2) return `Amount To Weight`;
        else if (row?.scheme_type === 3) return `Weight`;
        else if (row?.scheme_type === 4) return `Flexible Amount To Bonus`;
        else if (row?.scheme_type === 5) return `Flexiable Amount To Weight`;
        else if (row?.scheme_type === 6) return `Fixed Amount To Weight`;
        else if (row?.scheme_type === 7) return `Fixed Amount End Weight`;
        else if (row?.scheme_type === 8) return `Fixed Amount To Bonus`;
        else if (row?.scheme_type === 9) return `Flexible Amount End Weight`;
        else if (row?.scheme_type === 10) return `Digi Gold`;
        else return `Amount To Bonus`;
      }
    },
    { header: "Classification", cell: (row) => row?.classificationDetails?.classification_name || 'N/A' },
    {
      header: "Create Date",
      cell: (row) => {
        const date = new Date(row?.createdAt);
        return date.toLocaleDateString('en-GB');
      }
    },
    {
      header: 'Active',
      accessor: 'active',
      cell: (row) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={row?.active === true} onChange={() => handleStatusToggle(row?._id)} />
          <div className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-black p-[2px] after:duration-300 after:bg-black ${row?.active === true ? 'peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]' : 'peer-checked:bg-gray-400 peer-checked:ring-gray-400'} after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-white peer-hover:after:scale-95`}></div>
        </label>
      )
    }
  ], [currentPage, itemsPerPage, activeDropdown, schemeData, handleEdit, handleDelete, handleStatusToggle]);

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">Schemes</h2>
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
        <div className="relative w-full lg:w-1/3 min-w-[200px]">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="text-gray-500" />
          </div>
          <input placeholder="Search..." className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full" onChange={handleSearch} />
        </div>
        <div className="flex flex-row items-center justify-end gap-2">
          <button className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors" onClick={handleCreateSchemeClick} style={{ backgroundColor: layout_color }}>
            + Create Scheme
          </button>
          {filtered ?
            <button id="filter" className="text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0" onClick={handleReset} style={{ backgroundColor: layout_color }}>
              <RefreshCcw size={20} />
            </button> :
            <button id="filter" className="text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0" onClick={handleClickfilter} style={{ backgroundColor: layout_color }}>
              <SlidersHorizontal size={20} />
            </button>
          }
        </div>
      </div>

      <FilterForm
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        from_date={from_date}
        setFromdate={setFromdate}
        to_date={to_date}
        setTodate={setTodate}
        branchList={branchList}
        filters={filters}
        filterInputchange={filterInputchange}
        classificationData={classificationData}
        metalData={metalData}
        purityData={purityData}
        installmentTypeData={installmentTypeData}
        schemeTypeData={schemeTypeData}
        gstTypeData={gstTypeData}
        wastageType={wastageType}
        fundtype={fundtype}
        applyfilterdatatable={applyfilterdatatable}
      />

      <div className="mt-4">
        <Table data={schemeData} columns={columns} isLoading={isLoading} />
      </div>

      {schemeData.length > 0 && (
        <div className="flex justify-between mt-4 p-2">
          <div className={`flex flex-row items-center justify-center gap-2`}>
            <div className="flex items-center gap-4">
              <button onClick={prevPage} readOnly={currentPage === 1} className={`p-2 text-gray-500 rounded-md ${currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"}`}>
                Previous
              </button>
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
              {paginationButtons}
            </div>
            <div className="flex items-center">
              <button onClick={nextPage} readOnly={currentPage === totalPages} className={`p-2 text-gray-500 rounded-md ${currentPage === totalPages ? "cursor-not-allowed" : "cursor-pointer"}`}>
                Next
              </button>
            </div>
          </div>
          <div className="mt-4 flex gap-2 justify-center items-center">
            <span className="text-gray-500">Show</span>
            <select id="itemsPerPage" value={itemsPerPage} onChange={(e) => handleItemsPerPageChange(Number(e.target.value))} className="p-2 h-10 border-gray-500 rounded-md text-black bg-gray-300">
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={250}>250</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
            </select>
            <span className="text-gray-500">entries</span>
          </div>
        </div>
      )}
      <Modal />
    </div>
  );
};

export default Scheme;