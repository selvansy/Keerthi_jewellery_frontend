import { useMutation, useQuery } from '@tanstack/react-query';
import { addgiftissues, searchbarcodenumber, giftissuetype, searchcustomermobile, getallgiftInwardByBranch, searchSchAccByMobile, getallbranch } from '../../../api/Endpoints'
import SpinLoading from '../../common/spinLoading';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Search, Table } from 'lucide-react'
import Select from "react-select";
import { Breadcrumb } from '../../common/breadCumbs/breadCumbs';


const customComponents = {
    DropdownIndicator: () => null,
    IndicatorSeparator: () => null,
};

const customSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        minHeight: '40px',
        height: '40px',
        backgroundColor: '#ffffff',
        borderColor: '#d1d5db',
        paddingRight: '40px',
        borderRadius: '0.375rem',
        boxShadow: state.isFocused ? '0 0 0 2px black' : 'none',
        '&:hover': {
            borderColor: '#d1d5db',
        },
    }),
    valueContainer: (provided) => ({
        ...provided,
        height: '40px',
        padding: '9px',
    }),
    input: (provided) => ({
        ...provided,
        margin: '0px',
    }),
    indicatorsContainer: (provided) => ({
        ...provided,
        height: '40px',
    }),
};


function GiftHandOverForm() {

    const [isLoading, setLoading] = useState(false);
    const [visibleaccount, setVisibleaccount] = useState(false);
    const [searchbarcode, setSearchbarcode] = useState('');
    const [branchId, setIdbranch] = useState("");
    const [barcodeData, setBarcodeData] = useState([]);
    const [giftHis, setGiftHis] = useState([]);
    const [branchList, setBranchList] = useState([]);
    const [issuetype, setIssuetype] = useState([]);
    const [barcodeNums, setBarcodeNums] = useState([]);
    const [schemeaccount, setSchemeaccount] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [entries, Setentries] = useState(0);
    const [customer_name, setCustomername] = useState('');
    const [address, setAddress] = useState('');


    const roledata = useSelector((state) => state.clientForm.roledata);
    const layout_color = useSelector((state) => state.clientForm.layoutColor);
    const id_branch = roledata?.branch;
    const branchaccess = roledata?.id_branch;

    const [formData, setFormData] = useState({
        id_customer: "",
        mobile: null,
        id_branch: "",
        issue_type: null,
        gift_issues: [],
        id_scheme_account: ""
    });

    const handleSubmit = () => {
        try {

            setLoading(true)
            if (!validateForm()) {

                setLoading(false)
                return;
            }

            createGiftissuesMutate(formData);

        } catch (error) {
            setLoading(false)
        }
    };



    const { data: branchresponse, isLoading: loadingbranch } = useQuery({
        queryKey: ["branch"],
        queryFn: getallbranch,
    });

    const { data: giftResponse, isLoading: loadingGifts } = useQuery({
        queryKey: ["barcode", branchId],
        queryFn: () => getallgiftInwardByBranch(branchId),
        enabled: !!branchId
    });

    const { data: giftIssueResponse, isLoading: loadingGiftItems } = useQuery({
        queryKey: ["giftissues", branchId],
        queryFn: giftissuetype,
        enabled: !!branchId
    });


    useEffect(() => {

        if (giftResponse?.data) {
            const barCodes = giftResponse.data.map((item) => ({
                value: Number(item?.barcode),
                label: `${item?.barcode} - ${item.id_gift?.gift_name}`,
            }));

            setBarcodeNums(barCodes);
        }

        if (branchresponse) {
            const data = branchresponse.data

            const branch = data.map((branch) => ({
                value: branch._id,
                label: branch.branch_name,
            }));
            setBranchList(branch);
        }

        if (giftIssueResponse) {
            const data = giftIssueResponse.data

            const giftitem = data.map((giftitem) => ({
                value: giftitem.id,
                label: giftitem.name,
            }));
            setIssuetype(giftitem);
        }

    }, [giftResponse, branchresponse, giftIssueResponse]);


    useEffect(() => {

        if (!roledata) return;
        if (id_branch !== "0" || id_branch !== 0) {
            setFormData(prev => ({
                ...prev,
                id_branch: branchaccess
            }));
            setIdbranch(branchaccess)
        }

    }, [branchaccess, roledata]);


    const handleSearchmobile = () => {
        console.log("in seach")

        if (formData.mobile === "") {
            toast.error('Mobile Number is required!');
        }

        if (formData.issue_type === "1" || formData.issue_type === 1) {
            handlesearchScheme({ value: formData.mobile, branchId: formData.id_branch })
        } else {
            handlesearchcustomer({ search: formData.mobile, id_branch: formData.id_branch });
        }
    };

    const handleschemeaccountbyBranch = async (data) => {
        if (!data?.length) return;
        console.log("data", data)
        const account = data.map(({ _id, id_scheme }) => {
            const { scheme_type, scheme_name, amount, min_weight, max_weight, min_amount, max_amount, no_of_gifts } = id_scheme;

            const scheme_name_formatted = [3, 4, 12].includes(scheme_type)
                ? `${min_weight} Grm - ${max_weight} Grm`
                : `₹. ${min_amount ?? amount} - ₹. ${max_amount ?? amount}`;

            return { value: _id, label: `${scheme_name} (${scheme_name_formatted})`, giftCount: `${no_of_gifts}` };
        });

        setSchemeaccount(account);
    };


    const { mutate: handlesearchScheme } = useMutation({
        mutationFn: (data) => searchSchAccByMobile(data),
        onSuccess: (response) => {

            if (response) {
                console.log("res---", response.data)
                setGiftHis(response.data)
                setCustomername(response.data[0].id_customer?.firstname + ' ' + response.data[0]?.id_customer?.lastname);
                setAddress(response.data[0]?.id_customer?.address);
                setSchId(response.data[0].id_scheme_account)
                setFormData(prev => ({
                    ...prev,
                    id_customer: response.data[0].id_customer?._id,
                    mobile: response.data[0].id_customer?.mobile,
                }));

                handleschemeaccountbyBranch(response.data);
                toast.success(response.data.message)
            }
        },
        onError: (error) => {
            toast.error(error.response.data.message)
        }
    });

    const { mutate: handlesearchcustomer } = useMutation({
        mutationFn: (payload) => searchcustomermobile(payload),
        onSuccess: (response) => {
            if (response) {
                setGiftHis(response.data)
                setCustomername(response.data.firstname + ' ' + response.data.lastname);
                setAddress(response.data.address);
                setFormData(prev => ({
                    ...prev,
                    id_customer: response.data._id,
                    mobile: response.data.mobile,
                }));
            }
            setLoading(false);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
            setLoading(false);
        },
    });

    const { mutate: createGiftissuesMutate } = useMutation({
        mutationFn: (payload) => addgiftissues(payload),
        onSuccess: (response) => {
            setLoading(false)
            toast.success(response.message)
            navigate('/gift/gifthandover')
        },
        onError: (error) => {
            setLoading(false)
            toast.error(error.response.data.message)
        }
    });


    const inputChange = (e) => {

        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === "id_branch") {
            setIdbranch(value);
        }
    };

    const handleSearchbarcode = () => {

        if (!searchbarcode) {
            toast.error('Barcode Number is required!');
            return;
        }

        if (totalGifts >= noOfgifts && (formData.issue_type === "1" || formData.issue_type === 1)) {
            toast.error("Gift limit reached");
        } else {
            handlegiftbarcodeno({ barcode: searchbarcode, id_branch: formData.id_branch });
        }
    }


    const totalGifts = barcodeData.reduce((acc, curr) => acc + curr.quantity, 0);


    const { mutate: handlegiftbarcodeno } = useMutation({
        mutationFn: (payload) => searchbarcodenumber(payload),
        onSuccess: (response) => {
            if (response && response.data) {
                updateBarcodeData(response.data);
                updateFormData(response.data);
                setSearchbarcode("");
            }
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to fetch barcode data");
        },
    });



    const updateBarcodeData = (barcodeData) => {
        setBarcodeData((prevData) => {
            const existingIndex = prevData.findIndex((item) => item.barcode === barcodeData.barcode);

            if (existingIndex !== -1) {
                return prevData.map((item, index) => {
                    if (index === existingIndex) {
                        if (item.quantity < item.qty) {
                            return { ...item, quantity: item.quantity + 1 };
                        }
                        toast.error("Gift Stock limit reached");
                    }
                    return item;
                });
            } else {
                return [...prevData, { ...barcodeData, quantity: 1 }];
            }
        });
    };


    const updateFormData = (barcodeData) => {
        setFormData((prevFormData) => {
            const existingIssueIndex = prevFormData.gift_issues.findIndex(
                (issue) => issue.barcode === barcodeData.barcode
            );

            let updatedGiftIssues;
            if (existingIssueIndex !== -1) {
                updatedGiftIssues = prevFormData.gift_issues.map((issue, index) => {
                    if (index === existingIssueIndex) {
                        if (issue.qty < noOfgifts) {
                            return { ...issue, qty: issue.qty + 1 };
                        }
                        return issue;
                    }
                    return issue;
                });
            } else {
                updatedGiftIssues = [
                    ...prevFormData.gift_issues,
                    {
                        gift_id: barcodeData.id_gift?._id || "",
                        qty: 1,
                        price: barcodeData.price,
                        barcode: barcodeData.barcode,
                    },
                ];
            }

            return { ...prevFormData, gift_issues: updatedGiftIssues };
        });
    };

    const removeRowById = (idToRemove) => {
        setBarcodeData((prevData) => prevData.filter((_, index) => index !== idToRemove));

        setFormData((prevFormData) => {
            const updatedGiftIssues = prevFormData.gift_issues.filter((_, index) => index !== idToRemove);
            return { ...prevFormData, gift_issues: updatedGiftIssues };
        });
    };


    const handleSchemeAcc = (value) => {

        if (value === "1" || value === 1) {
            setVisibleaccount(true);
        } else {
            setVisibleaccount(false);
            setCustomername(null);
            setAddress(null);
            setNoGifts(null)
        }
    }

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


    const handleAddCustomer = () => {
        navigate('/manageaccount/addcustomer')
    }

    const handleCancle = () => {
        navigate('/gift/gifthandover')
    }

    const format = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    console.log("braco---",barcodeData)

    const columns = [
        {
            header: 'S.No',
            cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
        },
        {
            header: "Gift Name",
            cell: (row) => {
                const gift_names = row?.gifts?.map((val) => val.id_gift.gift_name);
                return gift_names.join(", ");
            }
        },
        {
            header: "No.Of Gifts",
            cell: (row) => {
                const gifts = row?.gifts?.reduce((acc, curr) => acc + curr.qty, 0);
                return gifts;
            }
        },
        {
            header: "Issues Date",
            cell: (row) => format(new Date(row?.create_date), 'dd/MM/yyyy')
        },

    ];



    return (
        <>
            <div className="flex flex-row justify-between items-center w-full sm:order-1 sm:w-auto sm:mr-auto md:order-1 md:w-auto md:mr-auto ">
                {/* ActiveDropdown - half width on mobile */}

                <div className="w-1/2 sm:w-auto me-1 mt-2">
                    <Breadcrumb items={[{ label: "Gift" }, { label: "GiftHandover", active: true }]} />
                </div>

                {/* Button - half width on mobile, moves to right on desktop */}
                <div className="w-1/2 sm:hidden ">
                    <button
                        className="rounded-md px-4 py-2 text-white whitespace-nowrap hover:bg-[#034571] transition-colors w-full"
                        onClick={handleAddCustomer}
                        style={{ backgroundColor: layout_color }} >
                        + Add Customer
                    </button>

                </div>

                {/* Desktop-only button - appears on the right side */}
                <div className="hidden sm:block sm:order-3 mt-2">

                    <button
                        className="rounded-md px-4 py-2 text-white text-nowrap hover:bg-[#034571] transition-colors "
                        onClick={handleAddCustomer}
                        style={{ backgroundColor: layout_color }} >
                        + Add Customer
                    </button>
                </div>

            </div>

            <div className='w-full flex flex-col bg-white border-2 border-[#f2f3f8] rounded-md p-6  mt-3 overflow-y-auto scrollbar-hide gap-8'>
                <div className='mb-2'>
                    <h2 className='text-xl font-medium mb-4'>Customer Details</h2>
                    <div className="grid grid-rows-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3  gap-2">

                        <div className="flex flex-col mt-2">
                            <label className="text-black mb-1 font-normal">
                                Branch<span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <Select
                                    options={branchList}
                                    value={
                                        id_branch !== "0"
                                            ? branchList.find(branch => branch.value === id_branch) || ""
                                            : branchList.find(branch => branch.value === formData.id_branch) || ""
                                    }
                                    // value={branchList.find(branch => branch.value === formData.id_branch) || branchId}
                                    onChange={(branch) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            id_branch: branch.value,
                                        }));
                                        setIdbranch(branch.value)
                                    }}
                                    className='border-2  border-[#F2F2F9] rounded-lg'
                                    isDisabled={id_branch !== "0"}
                                    customSelectStyles={customSelectStyles}
                                    isLoading={loadingbranch}
                                    placeholder="Select Branch"
                                />
                                {formErrors.id_branch && <span className="text-red-500 text-sm mt-1">{formErrors.id_branch}</span>}
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                                        <path d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col mt-2'>
                            <label className='text-black mb-1 font-normal'>Gift HandOver Type<span className='text-red-400'>*</span></label>
                            <div className="relative">
                                <Select
                                    options={issuetype}
                                    value={issuetype.find(item => item.value === formData.issue_type) || ""}
                                    onChange={(item) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            issue_type: item.value,
                                        }));

                                        handleSchemeAcc(item.value);
                                    }}
                                    customSelectStyles={customSelectStyles}
                                    isLoading={loadingGiftItems}
                                    placeholder="Select scheme customer"
                                />


                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                                        <path d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                            {formErrors.issue_type && <span className="text-red-500 text-sm mt-1">{formErrors.issue_type}</span>}
                        </div>

                        <div className="flex flex-col relative mt-2">
                            <label className="text-black mb-1 font-normal">
                                Search Mobile Number<span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.mobile}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData((prev) => ({
                                        ...prev,
                                        mobile: value,
                                    }));
                                }}
                                name="mobile"
                                onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
                                pattern="\d{10}"
                                maxLength={"10"}
                                className="border-2 border-gray-300 rounded-md p-2  focus:border-transparent"
                                placeholder="Enter Here"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleSearchmobile()
                                        // handlesearchcustomer({
                                        //     id_branch: formData.id_branch,
                                        //     search_mobile: formData.mobile,
                                        // });
                                    }
                                }}
                            />

                            {/* Search Icon */}
                            <div
                                onClick={handleSearchmobile}
                                className="absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[70%] -translate-y-1/2 w-10 md:h-[42px] md:top-[50px] h-[20%] sm:right-0 sm:top-[68%] lg:right-[0%]"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                ) : (
                                    <Search size={15} className="text-black" />
                                )}
                            </div>
                        </div>

                        {visibleaccount === true && (
                            <div className='flex flex-col mt-2'>
                                <label className='text-black mb-1 font-normal'>Scheme Account<span className='text-red-400'>*</span></label>
                                <div className="relative">
                                    <Select
                                        options={schemeaccount}
                                        value={schemeaccount.find(item => item.value === formData.id_scheme_account) || ""}
                                        onChange={(item) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                id_scheme_account: item.value,
                                            }));
                                            setNoGifts(item.giftCount)
                                        }}
                                        customSelectStyles={customSelectStyles}
                                        // isLoading={loadingSchAcc}
                                        placeholder="Select SchemeAccount Type"
                                    />
                                    {formErrors.id_scheme_account && <span className="text-red-500 text-sm mt-1">{formErrors.id_scheme_account}</span>}
                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                                            <path d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col mt-2">
                            <label className="text-black mb-1 font-normal">
                                Customer Name<span className="text-red-400">*</span>
                            </label>
                            <input
                                readOnly
                                type="text"
                                name="customer_name"
                                value={customer_name}
                                className="border-2 w-full bg-[#F2F2F9] border-gray-300 cursor-not-allowed rounded-md p-2 pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                placeholder="Customer name"
                            />
                        </div>

                        <div className="flex flex-col mt-2">
                            <label className="text-black mb-1 font-normal">
                                Address<span className="text-red-400">*</span>
                            </label>
                            <input
                                value={address}
                                onChange={inputChange}
                                readOnly
                                type='text'
                                className="border-2 w-full bg-[#F2F2F9] border-gray-300 cursor-not-allowed rounded-md p-2 pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                placeholder='Customer address'
                            />
                        </div>

                        <div className='flex flex-col relative mt-2'>
                            <label className='text-black mb-1 font-normal'>Search Gift Code/Name<span className='text-red-400'>*</span></label>

                            <Select
                                name='searchbarcode'
                                options={barcodeNums}
                                value={barcodeNums.find(option => option.value === searchbarcode) || ""}
                                onChange={(selectedOption) => {
                                    setSearchbarcode(selectedOption.value);
                                }}
                                components={customComponents}
                                styles={customSelectStyles}
                                isLoading={loadingGifts}
                                placeholder="Search/Select Barcode"
                            />
                            {/* Search Icon */}
                            <div
                                onClick={handleSearchbarcode}
                                className="absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[70%] -translate-y-1/2 w-10 md:h-[40px] md:top-[48px] h-[18%] sm:right-0 sm:top-[68%] lg:right-[0%]"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                ) : (
                                    <Search size={15} className="text-black" />
                                )}
                            </div>
                            {/* <div onClick={handleSearchbarcode} className="absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[68%] -translate-y-1/2 w-10 md:h-[50px] md:top-[54px] h-[62%] sm:right-0 sm:top-[68%] lg:right-[0%]"
                                style={{ backgroundColor: layout_color }}>
                                <Search size={20} className="text-white" />
                            </div> */}
                        </div>
                    </div>
                </div>

                <div className='bg-white p-2  border-gray-300 mt-4'>
                    <div className='flex justify-end gap-2 mt-3'>
                        <button
                            className="w-20 h-9 border-2 bg-[#F6F7F9] border-[#f2f3f8] rounded-md hover:bg-gray-50 flex justify-center items-center text-[#6C7086]"
                            type='button'
                            onClick={handleCancle}
                        >
                            Cancel
                        </button>
                        <button
                            className="w-20 h-9 bg-blue-900 text-white rounded-md hover:bg-blue-800 flex justify-center items-center"
                            type='button'
                            onClick={handleSubmit}
                        >
                            {isLoading ? <SpinLoading /> : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>




            <div className="flex flex-col gap-4 mt-4 bg-white">
            
                <div className="flex flex-row w-full">
                    {visibleaccount === true && (

                        <div className="mt-6">
                            <div className="mb-2">
                                <h2 className='text-xl font-medium mb-4'>Customer Details</h2>
                                <Table
                                    data={barcodeData}
                                    columns={columns}
                                    isLoading={isLoading}
                                    currentPage={currentPage}
                                    handleItemsPerPageChange={handleItemsPerPageChange}
                                    handlePageChange={handlePageChange}
                                    itemsPerPage={itemsPerPage}
                                    totalItems={entries}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>



        </>
    )
}

export default GiftHandOverForm