import { useMutation, useQuery } from '@tanstack/react-query';
import { addgiftissues, searchGiftCodenumber, giftissuetype, searchcustomermobile, getallgiftInwardByBranch, searchSchAccByMobile, getallbranch, giftIssueBySchId } from '../../../api/Endpoints'
import SpinLoading from '../../common/spinLoading';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Search, Trash2 } from 'lucide-react'
import Select from "react-select";
import Table from '../../common/Table';
import { Breadcrumb } from '../../common/breadCumbs/breadCumbs';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { form } from 'framer-motion/client';
//import customSelectStyles from '../../common/customSelectStyles';//


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

  const inputHeight = "42px";



function GiftHandOverForm() {

    const [isLoading, setLoading] = useState(false);

    const [AddLoading, setAddLoading] = useState(false);
    const [visibleaccount, setVisibleaccount] = useState(false);
    const [searchGiftCode, setSearchGiftCode] = useState("");
    const [branchId, setIdbranch] = useState("");
    const [GiftCodeData, setGiftCodeData] = useState([]);
    const [giftHis, setGiftHis] = useState([]);
    const [branchList, setBranchList] = useState([]);
    const [issuetype, setIssuetype] = useState([]);
    const [GiftCodeNums, setGiftCodeNums] = useState([]);
    const [schemeaccount, setSchemeaccount] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [entries, Setentries] = useState(0);
    const [customer_name, setCustomername] = useState('');
    const [address, setAddress] = useState('');
    const [noOfgifts, setNoGifts] = useState("")
    const [alloted_gifts, setAllotedGifts] = useState("")
    const [schId, setSchId] = useState("");
    const [giftStock, setGiftStock] = useState("")
    const [addGift, setAddGift] = useState([])



    const navigate = useNavigate();
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
        qty: "",
    });

    const validateForm = () => {
        const errors = {};

        if (formData.issue_type === "1") {
            if (!formData.id_scheme_account) errors.id_scheme_account = 'Scheme Account is required';
        }

        if (!id_branch) errors.id_branch = 'Branch is required';
        if (!formData.mobile) errors.mobile = 'Mobile Number is required';
        if (!formData.issue_type) errors.issue_type = 'Issue Type is required';
        // if (!formData.qty) errors.qty = "Gift Quantity is required"

        if (!formData.gift_issues || formData.gift_issues.length === 0) {
            errors.gift_issues = 'No gifts selected';
            toast.error('To Handover Gift is required!');
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };




    const handleSubmit = () => {
        try {
            setLoading(true);

            let updatedFormData = { ...formData };

            if (formData.issue_type === "1" || formData.issue_type === 1) {
                updatedFormData.id_scheme_account = schId;
            } else {
                updatedFormData.id_scheme_account = "";
            }

            if (!validateForm()) {
                setLoading(false);
                return;
            }

            createGiftissuesMutate(updatedFormData);

        } catch (error) {
            setLoading(false);
        }
    };



    const { data: branchresponse, isLoading: loadingbranch } = useQuery({
        queryKey: ["branch"],
        queryFn: getallbranch,
    });

    const { data: giftResponse, isLoading: loadingGifts } = useQuery({
        queryKey: ["GiftCode", branchId],
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
            const GiftCodes = giftResponse.data.map((item) => ({
                value: (item?.id_gift?.gift_code),
                label: `${item?.id_gift?.gift_code} - ${item.id_gift?.gift_name}`,
            }));

            setGiftCodeNums(GiftCodes);
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

    useEffect(() => {
        if (!schId) return;
        const payload = {
            page: currentPage,
            limit: itemsPerPage,
            search: "",
            id: schId
        }
        handleGiftIssuesBySchId(payload)
    }, [currentPage, itemsPerPage, schId, visibleaccount])


    const handleSearchmobile = () => {

        if (formData.mobile === "") {
            toast.error('Mobile Number is required!');
        }

        if (formData.issue_type === "1" || formData.issue_type === 1) {
            handlesearchScheme({ value: formData.mobile, branchId: formData.id_branch })
        } else {
            handlesearchcustomer({ search: formData.mobile, id_branch: formData.id_branch });
        }
    };

    const handleSchemeAccount = (data) => {
        const SchemeSummary = data.map((item) => ({
            value: item.scheme_acc_id,
            label: item.scheme_name,
            Allottedgifts: item.Allottedgifts,
        }));
        setSchemeaccount(SchemeSummary)
    }


    const { mutate: handlesearchScheme } = useMutation({
        mutationFn: (data) => searchSchAccByMobile(data),
        onSuccess: (response) => {

            if (response) {
                setCustomername(response.data[0].id_customer?.firstname + ' ' + response.data[0]?.id_customer?.lastname);
                setAddress(response.data[0]?.id_customer?.address);
                handleSchemeAccount(response.schemeSummary)
                setFormData(prev => ({
                    ...prev,
                    id_customer: response.data[0].id_customer?._id,
                    mobile: response.data[0].id_customer?.mobile,
                }));

                toast.success(response.data.message)
            }
        },
        onError: (error) => {
            toast.error(error.response.data.message)
        }
    });


    const { mutate: handleGiftIssuesBySchId } = useMutation({
        mutationFn: (value) => giftIssueBySchId(value),
        onSuccess: (response) => {
            if (response) {
                setGiftHis(response.giftsList)
                setTotalPages(response.totalPages)
                setCurrentPage(response.currentPage)
                Setentries(response.totalDocument)
            }
        },
        // onError: (error) => {
        //     console.log("eror")
        //     // toast.error(error.response.data.message)
        // }
    });

    const { mutate: handlesearchcustomer } = useMutation({
        mutationFn: (payload) => searchcustomermobile(payload),
        onSuccess: (response) => {
            if (response) {
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

    const handleSearchGiftCode = () => {

        if (!searchGiftCode) {
            toast.error('GiftCode Number is required!');
            return;
        }

        if (totalGifts >= alloted_gifts && (formData.issue_type === "1" || formData.issue_type === 1)) {
            toast.error("Gift limit reached");
        } else {
            handlegiftGiftCodeno(
                {
                    GiftCode:
                    {
                        search: searchGiftCode
                    }, id_branch: formData.id_branch
                });
        }
    }


    const totalGifts = GiftCodeData.reduce((acc, curr) => acc + curr.quantity, 0);


    const { mutate: handlegiftGiftCodeno } = useMutation({
        mutationFn: (payload) => searchGiftCodenumber(payload),
        onSuccess: (response) => {
            if (response && response.data) {
                setGiftStock(response.data.qty)
                setAddGift(response.data)
            }
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to fetch GiftCode data");
        },
    });

    const updateGiftCodeData = (GiftCodeData, giftQty = 1) => {
        if (giftQty <= 0) {
            toast.error("Gift quantity should be greater than zero");
            setAddLoading(false);
            return;
        }

        setAddLoading(false);

        // Update giftCodeData state
        setGiftCodeData((prevData = []) => {
            const existingIndex = prevData.findIndex(
                (item) => item.id_gift === GiftCodeData.id_gift
            );

            if (existingIndex !== -1) {
                const item = prevData[existingIndex];
                const newQty = item.quantity + giftQty;

                if (newQty <= item.qty) {
                    const updated = [...prevData];
                    updated[existingIndex] = { ...item, quantity: newQty };
                    return updated;
                } else {
                    toast.error("Gift Stock limit reached");
                    return prevData;
                }
            } else {
                if (giftQty <= GiftCodeData.qty) {
                    return [...prevData, { ...GiftCodeData, quantity: giftQty }];
                } else {
                    toast.error("Gift Stock limit reached");
                    return prevData;
                }
            }
        });

        // Update formData.gift_issues
        setFormData((prevFormData) => {
            const existingIssueIndex = prevFormData.gift_issues?.findIndex(
                (issue) => issue.gift_id === GiftCodeData.id_gift
            );

            let updatedGiftIssues = prevFormData.gift_issues || [];

            if (existingIssueIndex !== -1) {
                const issue = updatedGiftIssues[existingIssueIndex];
                const newQty = issue.qty + giftQty;

                if (newQty <= GiftCodeData.qty) {
                    updatedGiftIssues[existingIssueIndex] = {
                        ...issue,
                        qty: newQty,
                    };
                } else {
                    // toast.error("Gift Stock limit reached");
                    return prevFormData;
                }
            } else {
                if (giftQty <= GiftCodeData.qty) {
                    updatedGiftIssues = [
                        ...updatedGiftIssues,
                        {
                            gift_id: GiftCodeData.id_gift,
                            qty: giftQty,
                            price: GiftCodeData.price,
                            gift_code: GiftCodeData.gift?.gift_code || "",
                        },
                    ];
                } else {
                    toast.error("Gift Stock limit reached");
                    return prevFormData;
                }
            }

            return {
                ...prevFormData,
                gift_issues: updatedGiftIssues,
                qty: "",
            };
        });

        setAddGift([]);
        setGiftStock("");
        setSearchGiftCode("");
    };



    const removeRowById = (idToRemove) => {
        setGiftCodeData((prevData) => prevData.filter((_, index) => index !== idToRemove));

        setFormData((prevFormData) => {
            const updatedGiftIssues = prevFormData.gift_issues.filter((_, index) => index !== idToRemove);
            return { ...prevFormData, gift_issues: updatedGiftIssues };
        });
    };


    const handleSchemeAcc = (value) => {

        if (value === "1" || value === 1) {
            setVisibleaccount(true);
            setCustomername("");
            setAddress("")

        } else {
            setVisibleaccount(false);
            setSchemeaccount([])
            setSchId("")
            setCustomername("");
            setAddress("");
            setNoGifts(null)

        }
    }


    const handleChangeSchemeAccount = (item) => {
        setSchId(item.value)
        setFormData(prev => ({
            ...prev,
            id_scheme_account: item.value
        }))
        setAllotedGifts(item.Allottedgifts)
        setGiftHis([]);
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

    const handleAdd = () => {

        setAddLoading(true);
        if (!addGift) {
            toast.error("No giftCode data found")
            setAddLoading(false);
        }
        const giftQty = Number(formData.qty);
        updateGiftCodeData(addGift, giftQty);
        // updateFormData(addGift);

    }


    const handleAddCustomer = () => {
        navigate('/managecustomers/addcustomer')
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
            header: "Issues Date",
            cell: (row) => format(row?.giftIssueDate),
        },

    ];


    const GiftCodecolumns = [
        {
            header: 'S.No',
            cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
        },
        {
            header: "Gift Name",
            cell: (row) => row?.gift?.gift_name,
        },
        {
            header: "No.Of Gifts",
            cell: (row) => row?.quantity,
        },
        {
            header: "Actions",
            cell: (_, index) => (
                <div className="flex items-start justify-start py-2">
                    <button
                        onClick={() => removeRowById(index)}
                        className="p-2 rounded hover:bg-gray-100 text-red-600 flex items-start justify-start"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            ),
        }


    ]

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

                                    isDisabled={id_branch !== "0"}
                                    styles={customSelectStyles(true)}
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
                                
                                    styles={customSelectStyles(true)}
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
                                className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
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
                                className="absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[70%] -translate-y-1/2 w-10 md:h-[40px] md:top-[48px] h-[18%] sm:right-0 sm:top-[68%] lg:right-[0%]"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                ) : (
                                    <Search size={15} className="text-black" />
                                )}
                            </div>
                          

                            {/* <div
                                onClick={handleSearchmobile}
                                className="absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[70%] -translate-y-1/2 w-10 md:h-[42px] md:top-[50px] h-[20%] sm:right-0 sm:top-[68%] lg:right-[0%]"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                ) : (
                                    <Search size={15} className="text-black" />
                                )}
                            </div> */}
                        </div>

                        {visibleaccount === true && (
                            <div className='flex flex-col mt-2'>
                                <label className='text-black mb-1 font-normal'>Scheme Account<span className='text-red-400'>*</span></label>
                                <div className="relative">
                                    <Select
                                        options={schemeaccount}
                                        value={schemeaccount.find(item => item.value === schId) || ""}
                                        onChange={(item) => handleChangeSchemeAccount(item)}
                                        styles={customSelectStyles(true)}
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
                                className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                                placeholder="Customer name"
                            />
                        </div>

                        <div className="flex flex-col mt-2">
                            <label className="text-black mb-1 font-normal">
                                Address<span className="text-red-400">*</span>
                            </label>
                            <input
                                value={address}
                                readOnly
                                type='text'
                                className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                                placeholder='Customer address'
                            />
                        </div>

                        {visibleaccount === true && (

                            <div className="flex flex-col mt-2">
                                <label className="text-black mb-1 font-normal">
                                    Alloted Gifts<span className="text-red-400">*</span>
                                </label>
                                <input
                                    readOnly
                                    type="text"
                                    name="alloted_gifts"
                                    value={alloted_gifts}
                                    className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                                    placeholder="Customer Alloted Gifts"
                                />
                            </div>
                        )}

                        <div className='flex flex-col relative mt-2'>
                            <label className='text-black mb-1 font-normal'>Search Gift Code/Name<span className='text-red-400'>*</span></label>

                            <Select
                                name='searchGiftCode'
                                options={GiftCodeNums}
                                value={GiftCodeNums.find(option => option.value === searchGiftCode) || ""}
                                onChange={(selectedOption) => {
                                    setSearchGiftCode(selectedOption.value);
                                }}
                             
                                components={customComponents}
                                styles={customSelectStyles(true)}
                                isLoading={loadingGifts}
                                placeholder="Search/Select GiftCode"
                            />
                            {/* Search Icon */}
                            <div
                                onClick={handleSearchGiftCode}
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
                                value={giftStock}
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
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/\D/g, "");
                                    }}
                                    value={formData.qty}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData((prev) => ({
                                            ...prev,
                                            qty: value,
                                        }));
                                    }}

                                    className="w-full border-2 border-[#f2f3f8] rounded-md px-3 py-2"
                                    placeholder="Enter Here"
                                    required
                                />

                            </div>
                            {formErrors.qty && <span className="text-red-500 text-sm mt-1">{formErrors.qty}</span>}


                        </div>

                        <div className="flex flex-col mt-3">

                            <button
                                className="w-20 h-[42px] mx-3 my-[25px] px-16 bg-blue-900 text-white rounded-md hover:bg-blue-800 flex justify-center items-center"
                                type='button'
                                onClick={handleAdd}
                            >
                                {AddLoading ? <SpinLoading /> : 'Add'}
                            </button>

                        </div>
                    </div>
                    {(GiftCodeData?.length > 0) && (

                        <div className="mt-6 p-3">
                            <div className="mb-2">
                                <Table
                                    data={GiftCodeData}
                                    columns={GiftCodecolumns}
                                    isLoading={isLoading}
                                    showPagination={false}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className='bg-white border-gray-300'>
                    <div className='flex justify-end gap-2'>
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


            {((giftHis?.length > 0) && (visibleaccount === true)) && (
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
                                totalItems={entries}
                            />
                        </div>
                    </div>
            </div>
               )}



        </>
    )
}

export default GiftHandOverForm