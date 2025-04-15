import React, { useEffect, useReducer, useRef, useState } from 'react'
import { Breadcrumb } from '../../common/breadCumbs/breadCumbs';
import ActiveDropdown from '../../common/ActiveDropdown';
import { Search } from "lucide-react";
import { useDebounce } from '../../../hooks/useDebounce';
import { useSelector, useDispatch } from "react-redux";

import Table from '../../common/Table';
import { addedtype, allschemestatus, getallschemetypes, getallbranchscheme, getallbranchclassification, getemployeebybranch, getallbranch, schemeaccounttable, changeschemeaccountStatus, deleteschemeaccount } from '../../../api/Endpoints'
import { useMutation, useQuery } from '@tanstack/react-query';
import { openModal } from '../../../../redux/modalSlice';
import { eventEmitter } from '../../../../utils/EventEmitter';
import Modal from '../../common/Modal';
import ModelOne from '../../common/Modelone';
import Action from '../../common/action';
import { setScemeAccountId } from "../../../../redux/clientFormSlice"
import ExportDropdown from "../../../components/common/Dropdown/Export";
import Ledgerdetails from './ledgerdetails';
import eyeIcon from "../../../../assets/icons/eye.svg"
import { createPortal } from 'react-dom';
import More from "../../../../assets/icons/more.svg"
import gift from "../../../../assets/icons/gift.svg"
import { useNavigate } from 'react-router-dom';



function SchemeAccount() {

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalDocument, setTotalDocument] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [schemeaccount, setschemeaccount] = useState([])
    const [schaccExp, setschaccExp] = useState([]);
    const [popuptitle, setPopuptitle] = useState(0);
    const [searchLoading, setSearchLoading] = useState(false);
    const [isviewOpen, setIsviewOpen] = useState(false);
    const [searchInput, setSearch] = useState("");
    const dispatch = useDispatch();
    const debouncedSearch = useDebounce(searchInput, 500);
    const [displaysetting, setDiplaySetting] = useState(0);
    const [activeFilter, setActiveFilter] = useState("")
    const [status,setStatus] = useState([])
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [isLoading, setisLoading] = useState(true)
    const [selectedValue, setSelectedValue] = useState("")
    const layout_color = useSelector((state) => state.clientForm.layoutColor);
    const roledata = useSelector((state) => state.clientForm.roledata);
    let id_client = roledata?.id_client;
    const branch = roledata?.branch;
    const id_branch = roledata?.id_branch

    const navigate = useNavigate();

    const dropdownRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    function closeIncommingModal() {
        setIsviewOpen(false);
        setIsSettingOpen(false);
    }

    const handleClick = (e) => {
        e.preventDefault();
        navigate('/managecustomers/addcustomer');
    }

    const handleEdit = (id) => {
        navigate(`/managecustomers/addcustomer${id}`);
    };

    const handleOpenLedger = async (data) => {
        if (!data) return;
        setPopuptitle('View Details');
        setDiplaySetting(1);
        setIsviewOpen(true);
        dispatch(setScemeAccountId(data))
    };
        
      const handleSelect = (value) => {
        const num = parseInt(value)
        setSelectedValue(value)

        if(value !== ""){
          setActiveFilter(num)
        }else {
          setActiveFilter(null)
        }
      }

    const { data: scheme_status, isLoading: loadingSchemeStatus } = useQuery({
        queryKey: ["schemestatus"],
        queryFn: allschemestatus,
    });

    useEffect(() => {
        if (scheme_status) {
            const data = scheme_status.data;
            const schemeStatus = data.map((status) => ({
                value: Number(status.id_status),
                label: status.status_name,
            }));
            setStatus(schemeStatus);
        }
    }, [scheme_status]);

    //mutation to get scheme type
    const { mutate: getschemeaccountMutate } = useMutation({
        mutationFn: (payload) =>
            schemeaccounttable(payload),
        onSuccess: (response) => {
            setschemeaccount(response.data)
            setTotalPages(response.totalPages);
            setTotalDocument(response.totalDocument)

            let arrayData = [];
            if (response.data.length !== 0) {
                for (var i = 0; i < response.data.length; i++) {
                    arrayData.push({
                        scheme_acc_number: response.data[i].scheme_acc_number,
                        account_name: response.data[i].account_name,
                        mobile: response.data[i].mobile,
                        total_paidinstallments: response.data[i].total_paidinstallments,
                        total_paidamount: response.data[i].total_paidamount,
                        total_weight: response.data[i].total_weight,
                        start_date: response.data[i].start_date,
                        maturity_date: response.data[i].maturity_date,
                        branch_name: response.data[i].branch_name

                    });
                }
            }

            setschaccExp(arrayData)
            setSearchLoading(false);
            setisLoading(false)

        },
        onError: (error) => {
            console.error('Error fetching countries:', error);
            setSearchLoading(false)
            setisLoading(false)
        }
    });

    useEffect(() => {

        const filterTosend = {
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch,
            type: activeFilter,
        };

        getschemeaccountMutate(filterTosend)
    }, [currentPage, itemsPerPage, debouncedSearch, activeFilter])

    

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
        navigate(`/gift/giftissues/creategiftissue`, {
            state: {
                data
            }
        })
    }




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




    const columns = [
        {
            header: 'S.No',
            cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
        },
        {
            header: "Accounter Name",
            cell: (row) => row?.customer_name
        },
        {
            header: "Mobile",
            cell: (row) => row?.mobile,

        },
        {
            header: 'Scheme Name',
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
        {
            header: "Scheme Acc No",
            cell: (row) => row?.scheme_acc_number === "" ? 'Not Allocated' : row?.scheme_acc_number
        },
        {
            header: "Paid Installments",
            cell: (row) => (
                <div
                    className={`w-16 h-8 rounded-md py-1 flex justify-center items-center ${row?.total_paidinstallments > 0 ? "bg-[#12B76A38] text-green-500 font-medium" : "bg-[#FF000038] text-red-500 font-medium"
                        }`}
                >
                    {row?.total_paidinstallments}/{row?.total_installments}
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
                        {row?.status_name}
                    </div>
                );
            },
        },
        {
            header: "Start Date",
            cell: (row) => {
                const date = new Date(row?.start_date);
                return date.toLocaleDateString('en-GB');
            }
        },
        {
            header: "Maturity Date",
            cell: (row) => row?.maturity_date
        },
        {
            header: "Last Paid Date",
            cell: (row) => {
                const date = new Date(row?.last_paid_date);
                return date.toLocaleDateString('en-GB');
            }
        },
        {
            header: 'Scheme Type',
            cell: (row) => row?.scheme_typename
        },
        {
            header: "Classification",
            cell: (row) => row?.id_classification.name
        },
        {
            header: "Created Through",
            cell: (row) => row?.created_through
        },
        {
            header: "Action",
            cell: (row) => (
                <>
                    <div ref={dropdownRef} className="dropdown-container relative flex items-center">
                        <button
                            className="p-2 border hover:bg-gray-100 rounded-full flex justify-center"
                            onClick={(e) => {
                                e.stopPropagation();
                                hanldeActiveDropDown(activeDropdown === row?._id ? null : row?._id, e);
                            }}
                        >
                            <img src={More} alt="" className="w-[20px] h-[20px]" />
                        </button>
                    </div>

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
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                            onClick={() => {
                                                handleEdit(row?._id);
                                                setActiveDropdown(null);
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </button>
                                        <button
                                            className="w-full text-left text-nowrap px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                            onClick={() => {
                                                handleOpenLedger(row._id);
                                                hanldeActiveDropDown(null);
                                            }}
                                        >
                                            <img src={eyeIcon} alt="" srcSet="" className='text-black w-4 h-4 mr-1' />
                                            View
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                            onClick={() => {
                                                setActiveDropdown(null)
                                                handleGift(row)
                                            }
                                            }
                                        >
                                            {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg> */}
                                            <img src={gift} alt="" className="w-[16px] h-[16px]" />
                                            Gift Handover
                                        </button>
                                       
                                    </div>
                                </div>
                            </div>,
                            document.body
                        )}
                </>
            ),
        }

    ]



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
            <>
                <Breadcrumb
                    items={[{ label: "Manage Customers" }, { label: "Customer Schemes", active: true }]}
                />

                <div className="flex flex-col p-4 bg-white border border-[#F2F2F9] rounded-[16px]">
                    <div className="flex flex-col gap-4 mt-4 sm:flex-row sm:justify-between sm:items-center">

                        {/* Left Side: ActiveDropdown + Search */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
                            <div className="w-full sm:w-auto">
                                <div className="relative sm:w-[175px]">
                                    <select
                                        className="appearance-none border-2 border-[#F2F2F9] rounded-[8px] p-2 w-full bg-white pr-8 text-gray-700"
                                        value={selectedValue}
                                        onChange={(e) => handleSelect(e.target.value)}
                                    >
                                        {status.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
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
                                        <Search className="text-black" />
                                    )}
                                </div>
                                <input
                                    onChange={(e) => {
                                        setSearchLoading(true);
                                        setSearch(e.target.value);
                                    }}
                                    placeholder="Search"
                                    className="px-4 py-2 ps-9 border-2 border-[#F2F2F9] rounded-[8px] w-full"
                                />
                            </div>
                        </div>

                        {/* Right Side: Export + Add Customer */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
                            <div className="w-full sm:w-auto">
                                <ExportDropdown
                                    apiData={schaccExp}
                                    fileName={`Customer Schemes ${new Date().toLocaleDateString('en-GB')}`}
                                />
                            </div>

                            <div className="w-full sm:w-auto">
                                <button
                                    type="button"
                                    className="rounded-md px-4 py-2 text-white whitespace-nowrap hover:bg-[#034571] transition-colors w-full"
                                    style={{ backgroundColor: layout_color }}
                                    onClick={handleClick}
                                >
                                    + Add Customer
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="mt-4">
                        <Table
                            data={schemeaccount}
                            columns={columns}
                            isLoading={isLoading}
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
                            extraClassName='w-[700px] max-h-[90vh] overflow-y-auto'
                            setIsOpen={setIsviewOpen}
                            isOpen={isviewOpen}
                            closeModal={closeIncommingModal}
                        >

                            <Ledgerdetails
                                setIsOpen={setIsviewOpen}
                            />

                        </ModelOne>
                    )}
                </div>

            </>
        </>
    )
}

export default SchemeAccount