import React, { useEffect, useState } from 'react'
import { Breadcrumb } from '../../common/breadCumbs/breadCumbs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addgiftissues, searchGiftCodenumber, giftissuetype, searchcustomermobile, getallgiftInwardByBranch, searchSchAccByMobile, getallbranch, giftIssueBySchId } from '../../../api/Endpoints'
import Select from "react-select";
import { useSelector } from 'react-redux';
import { Search, Trash2 } from 'lucide-react'
import { useLocation } from 'react-router-dom';
import Table from '../../common/Table';
import { customStyles } from '../../ourscheme/scheme/AddScheme';

const customComponents = {
    DropdownIndicator: () => null,
    IndicatorSeparator: () => null,
};


const customSelectStyles = (isReadOnly) => ({
    control: (base, state) => ({
        ...base,
        minHeight: "42px",
        backgroundColor: "white",
        border: state.isFocused ? "1px solid black" : "2px solid #f2f3f8",
        boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
        borderRadius: "0.375rem",
        "&:hover": {
            color: "#e2e8f0",
        },
        pointerEvents: !isReadOnly ? "none" : "auto",
        opacity: !isReadOnly ? 1 : 1,
    }),
    indicatorSeparator: () => ({
        display: "none",
    }),
    placeholder: (base) => ({
        ...base,
        color: "#858293",
        fontWeight: "thin",
        // fontStyle: "bold",
    }),
    dropdownIndicator: (provided, state) => ({
        ...provided,
        color: "#232323",
        "&:hover": {
            color: "#232323",
        },
    }),
});

function GifthandoverDetails() {

    const [giftHis, setGiftHis] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const roledata = useSelector((state) => state.clientForm.roledata);
    const layout_color = useSelector((state) => state.clientForm.layoutColor);
    const id_branch = roledata?.branch;
    const [visibleaccount, setVisibleaccount] = useState(false);
    const [custData, setCusData] = useState({})
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalDocuments, setTotalDocuments] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const location = useLocation();

    useEffect(()=>{
        const data  = location?.state?.data;
        if(data){
            setCusData(data)
        }else{
            setCusData({})
        }
    },[])

        useEffect(() => {
            if (!custData) return;
            const payload = {
                page: currentPage,
                limit: itemsPerPage,
                search: "",
                id: custData._id
            }
            handleGiftIssuesBySchId(payload)
        }, [currentPage, itemsPerPage, custData])

    const { mutate: handleGiftIssuesBySchId } = useMutation({
        mutationFn: (value) => giftIssueBySchId(value),
        onSuccess: (response) => {
            if (response) {
                setGiftHis(response.giftsList)
                setTotalPages(response.totalPages)
                setCurrentPage(response.currentPage)
               
                setTotalDocuments(response.totalDocument)
            }
        },
        // onError: (error) => {
        //     
        //     // toast.error(error.response.data.message)
        // }
    });


    const format = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const columns = [
        {
            header: 'S.No',
            cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
        },
        {
            header: "Gift Name",
            cell: (row) => row?.id_gift?.gift_name,
        },
        {
            header: "No.Of Gifts(Qty)",
            cell: (row) => row?.qty,
        },
        {
            header: "Issue Date",
            cell: (row) => format(row?.giftIssueDate),
        },

    ];

    
    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {

        const pageNumber = Number(page);
        if (!pageNumber || isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
            return;
        }

        setCurrentPage(pageNumber);

    };

    

    return (
        <>
            <div className="flex flex-row justify-between items-center w-full sm:order-1 sm:w-auto sm:mr-auto md:order-1 md:w-auto md:mr-auto ">
                {/* ActiveDropdown - half width on mobile */}

                <div className="w-1/2 sm:w-auto me-1 mt-2">
                    <Breadcrumb items={[{ label: "Manage Customers" }, { label: "Customer Schemes", active: true }]} />
                </div>
            </div>

            <div className='w-full flex flex-col bg-white border-2 border-[#f2f3f8] rounded-md p-6  mt-3 overflow-y-auto scrollbar-hide gap-8'>
                <div className='mb-2'>
                    <h2 className='text-xl font-medium mb-4'>Gift Handover</h2>
                    <div className="grid grid-rows-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3  gap-2">

                        <div className="flex flex-col mt-2">
                            <label className="text-black mb-1 font-normal">
                                Branch<span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                            <input
                                readOnly
                                type="text"
                                name="branch_name"
                                value={custData?.branch_name}
                                className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                                placeholder="branch name"
                            />

                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                                        <path d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

    
                        <div className="flex flex-col relative mt-2">
                            <label className="text-black mb-1 font-normal">
                                Mobile Number<span className="text-red-400">*</span>
                            </label>
                            <input

                                type="text"
                                value={custData?.mobile}
                                name="mobile"
                                onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
                                pattern="\d{10}"
                                maxLength={"10"}
                                className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                                placeholder="Enter Here"
                                readOnly
                            />
                            {/* Search Icon */}
                            <div

                                className="absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[70%] -translate-y-1/2 w-10 md:h-[40px] md:top-[48px] h-[18%] sm:right-0 sm:top-[68%] lg:right-[0%]"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                ) : (
                                    <Search size={15} className="text-black" />
                                )}
                            </div>
                        </div>

                     
                            <div className='flex flex-col mt-2'>
                                <label className='text-black mb-1 font-normal'>Scheme Account<span className='text-red-400'>*</span></label>
                                <div className="relative">
                                    <Select
                                        // options={schemeaccount}
                                        // value={schemeaccount.find(item => item.value === schId) || ""}
                                        value=""

                                        styles={customStyles(true)}
                                        placeholder="Select SchemeAccount Type"
                                    />

                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                                            <path d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
    

                        <div className="flex flex-col mt-2">
                            <label className="text-black mb-1 font-normal">
                                Customer Name<span className="text-red-400">*</span>
                            </label>
                            <input
                                readOnly
                                type="text"
                                name="customer_name"
                                value={custData?.account_name}
                                className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                                placeholder="Customer name"
                            />
                        </div>

                        <div className="flex flex-col mt-2">
                            <label className="text-black mb-1 font-normal">
                                Address<span className="text-red-400">*</span>
                            </label>
                            <input
                                value={custData?.address}
                                readOnly
                                type='text'
                                className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                                placeholder='Customer address'
                            />
                        </div>



                        <div className="flex flex-col mt-2">
                            <label className="text-black mb-1 font-normal">
                                Alloted Gifts<span className="text-red-400">*</span>
                            </label>
                            <input
                                readOnly
                                type="text"
                                name="alloted_gifts"
                                value={custData?.allottedgifts}
                                className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                                placeholder="Customer Alloted Gifts"
                            />
                        </div>


                        <div className='flex flex-col relative mt-2'>
                            <label className='text-black mb-1 font-normal'>Search Gift Code/Name<span className='text-red-400'>*</span></label>

                            <Select
                                name='searchGiftCode'
                                // options={GiftCodeNums}
                                // value={GiftCodeNums.find(option => option.value === searchGiftCode) || ""}
                                value=""
                              
                             
                                components={customComponents}
                                styles={customStyles(true)}
                               
                                placeholder="Search/Select GiftCode"
                            />
                            <div
                               
                                className="absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[70%] -translate-y-1/2 w-10 md:h-[40px] md:top-[48px] h-[18%] sm:right-0 sm:top-[68%] lg:right-[0%]"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                ) : (
                                    <Search size={15} className="text-black" />
                                )}
                            </div>
                          
                        </div>

                        <div className="flex flex-col mt-2">
                            <label className="text-black mb-1 font-normal">
                                Gift Stock<span className="text-red-400">*</span>
                            </label>
                            <input
                                readOnly
                                type="text"
                                name="giftStock"
                                // value={giftStock}
                                value=""
                                className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                                placeholder="Gifts Stock"
                            />

                        </div>

                        <div className="flex flex-col mt-2">
                            <label className="text-black mb-1 font-normal">
                                No of Gifts(Qty)<span className="text-red-400">*</span>
                            </label>
                            <div>
                                <input
                                    type="text"
                                    name="qty"
                                    minLength={""}
                                    maxLength={"5"}
                                    value=""
                                    className="w-full border-2 border-[#f2f3f8] rounded-md px-3 py-2"
                                    placeholder="Enter Here"
                                    required
                                />

                            </div>
                            


                        </div>

                    </div>

                </div>


            </div>

            <div className='w-full flex flex-col bg-white border-2 border-[#f2f3f8] rounded-md p-6  mt-3 overflow-y-auto scrollbar-hide gap-8'>
                <div className='mb-2'>
                    <h2 className='text-xl font-medium mb-4'>Customer Details</h2>


                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

                        <div className="flex flex-col mt-2">
                            <label className="text-black mb-1 font-normal">
                                Accounter Name<span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={custData?.account_name}
                                readOnly
                                className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                            />
                        </div>

                        <div className="flex flex-col mt-2">
                            <label className="text-black mb-1 font-normal">
                                Mobile Number<span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={custData?.mobile}
                                readOnly
                                className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-black mb-1 font-normal"
                            >Scheme Name<span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                value={custData?.scheme_name}
                                readOnly
                                className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                            />
                        </div>


                            <div className="flex flex-col">
                                <label className="text-black mb-1 font-normal"
                                >Scheme A/c No<span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    value={custData?.scheme_acc_number}
                                    readOnly
                                    className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                                />
                            </div>
                    

                        <div className="flex flex-col">
                            <label className="text-black mb-1 font-normal"
                            >Paid Amount<span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                value={custData?.total_paidamount || ""}
                                readOnly
                                className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                            />
                        </div>

                 
                        <div className="flex flex-col">
                            <label className="text-black mb-1 font-normal"
                            >Paid Weight<span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                value={custData?.total_weight || ""}
                                readOnly
                                className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-black mb-1 font-normal"
                            >Paid Installments<span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                value={custData?.total_paidinstallments}
                                readOnly
                                className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-black mb-1 font-normal"
                            >Gift Handovered<span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                value={custData?.gift_issues}
                                readOnly
                                className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                            />
                        </div>

                      
                    </div>
                </div>
            </div>

            {(giftHis?.length > 0) && (
                <div className="w-full flex flex-col bg-white border-2 border-[#f2f3f8] rounded-md p-6  mt-3 overflow-y-auto scrollbar-hide gap-8">
                    <div className="mt-6 p-3">
                        <div className="mb-2">
                            <h2 className='text-xl font-medium mb-4'>Gift HandOver History</h2>
                            <Table
                                data={giftHis}
                                columns={columns}
                                isLoading={isLoading}
                                currentPage={currentPage}
                                handleItemsPerPageChange={handleItemsPerPageChange}
                                handlePageChange={handlePageChange}
                                itemsPerPage={itemsPerPage}
                                totalItems={totalDocuments}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default GifthandoverDetails