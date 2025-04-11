import React, { useEffect, useState } from 'react'
import { Breadcrumb } from '../../common/breadCumbs/breadCumbs';
import ActiveDropdown from '../../common/ActiveDropdown';
import { Search } from "lucide-react";
import { useDebounce } from '../../../hooks/useDebounce';
import { useSelector, useDispatch } from "react-redux";

import Table from '../../common/Table';
import { addedtype, allschemestatus, getallschemetypes, getallbranchscheme, getallbranchclassification, getemployeebybranch, getallbranch, schemeaccounttable, changeschemeaccountStatus, deleteschemeaccount } from '../../../api/Endpoints'
import { useMutation } from '@tanstack/react-query';
import { openModal } from '../../../../redux/modalSlice';
import { eventEmitter } from '../../../../utils/EventEmitter';
import Modal from '../../common/Modal';
import ModelOne from '../../common/Modelone';
import Action from '../../common/action';
import { setScemeAccountId } from "../../../../redux/clientFormSlice"
import ExportDropdown from "../../../components/common/Dropdown/Export";
import Ledgerdetails from './ledgerdetails';


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
    const [activeFilter, setActiveFilter] = useState(null)
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [isLoading, setisLoading] = useState(true)
    const layout_color = useSelector((state) => state.clientForm.layoutColor);
    const roledata = useSelector((state) => state.clientForm.roledata);
    let id_client = roledata?.id_client;
    const branch = roledata?.branch;
    const id_branch = roledata?.id_branch

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
            setisLoading(false)

        },
        onError: (error) => {
            console.error('Error fetching countries:', error);
            setisLoading(false)
        }
    });

    useEffect(() => {

        const filterTosend = {
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch,
        };

        getschemeaccountMutate(filterTosend)
    }, [currentPage, itemsPerPage, debouncedSearch])

    const hanldeActiveDropDown = (data) => {
        setActiveDropdown(data);
    };


    const handleDelete = (id) => {
        setActiveDropdown(null);
        dispatch(openModal({
            modalType: 'CONFIRMATION',
            header: 'Delete Scheme',
            formData: {
                message: 'Are you sure you want to delete?',
                schAccId: id
            },
            buttons: {
                cancel: {
                    text: 'Cancel'
                },
                submit: {
                    text: 'Delete'
                }
            }
        }));


    };

    //mutation to get purity type
    const { mutate: deleteSchAcc } = useMutation({
        mutationFn: (payload) => deleteschemeaccount(payload),
        onSuccess: (response) => {
            toast.success(response.message);
            getschemeaccountMutate({ page: currentPage, limit: itemsPerPage, search: debouncedSearch })
            eventEmitter.off('CONFIRMATION_SUBMIT');
        },
        onError: (error) => {
            console.error("Error:", error);
        },
    });


    useEffect(() => {
        eventEmitter.on('CONFIRMATION_SUBMIT', async (data) => {
            try {
                deleteSchAcc(data.schAccId);

            } catch (error) {
                console.error('Error:', error);
            }
        });
        return () => {
            eventEmitter.off('CONFIRMATION_SUBMIT');
        };
    }, [eventEmitter]);


    const columns = [
        {
            header: 'S.No',
            cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
        },

        {
            header: "Account Name",
            cell: (row) => (
                <div className="flex flex-col gap-2">
                    <h6 className='text-nowrap'>{row?.account_name}</h6>
                    <span>{row?.mobile}</span>
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
        {
            header: "A/c No",
            cell: (row) => row?.scheme_acc_number === "" ? 'Not Allocated' : row?.scheme_acc_number
        },
        {
            header: "Paid Installments",
            cell: (row) => (
                <div className="bg-green-500 rounded-full p-1 text-white flex justify-center">
                    {row?.total_paidinstallments}/{row?.total_installments}
                </div>
            ),
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
            header: 'Scheme Type',
            cell: (row) => row?.scheme_typename
        },
        {
            header: "Classification",
            cell: (row) => row?.id_classification.name
        },
        branch === '0' && {
            header: "Branch Name",
            cell: (row) => row?.branch_name
        },
        {
            header: "Actions",
            cell: (row, rowIndex) => (
                <Action row={row} data={schemeaccount} rowIndex={rowIndex} activeDropdown={activeDropdown} setActive={hanldeActiveDropDown} handleEdit={handleEdit} handleDelete={handleDelete} handleView={handleOpenLedger} />
            ),
            sticky: "right",
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
                                <ActiveDropdown setActiveFilter={setActiveFilter} />
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
                            extraClassName='w-1/2 max-h-[90vh] overflow-y-auto'
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