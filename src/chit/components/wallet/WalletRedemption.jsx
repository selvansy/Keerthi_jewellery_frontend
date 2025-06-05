import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react'
import { DatabaseBackupIcon, Search } from 'lucide-react'
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { mobilesearch, redeemType, getallwallet, walletRedeem, getallpaymentmode, RefferalByUser } from '../../../chit/api/Endpoints'
import { formatNumber } from "../../utils/commonFunction"
import SpinLoading from '../common/spinLoading';
import Select from "react-select";
import { useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb } from '../common/breadCumbs/breadCumbs';
import Table from '../common/Table';
import ModelOne from '../common/Modelone';
import { RefferalCusCard } from './RedeemHisCard';
import { useLocation } from 'react-router-dom';
import More from "../../../assets/more.svg"
import { createPortal } from 'react-dom';
import eyeIcon from "../../../assets/icons/eye.svg"
import { customStyles } from '../ourscheme/scheme/AddScheme';


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
        menu: (base) => ({
            ...base,
            zIndex: 9999,
            position: 'absolute',
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
        }),

    }),
});

const inputHeight = "42px";

function WalletRedemption() {

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalDocuments, setTotalDocuments] = useState(0)
    const [formErrors, setFormErrors] = useState({})
    const [isLoading, setLoading] = useState(false)
    const [mobile, setMobile] = useState("")
    const [walletData, setWalletData] = useState({})
    const [walletUser, setWalletUser] = useState({})
    const [refData, setRefData] = useState([]);
    const dropdownRef = useRef(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [cusdata,setcusData] = useState(null);

    const [redeem_type, setRedeemType] = useState([])
    const [paymentData, setPaymentData] = useState([])
    const [isCustomer, setCustomer] = useState(true);
    const [formData, setFormData] = useState({
        bill_no: "",
        redeem_amt: "",
        wallet_id: "",
        // wallet_type: "Customer",
        redeem_type: "",
        payment_mode: ""
    });

    const { id } = useParams();
    const [isviewOpen, setIsviewOpen] = useState(false);
    const location = useLocation();

    const data  = id ? location.state.data : null;

    function closeIncommingModal() {
        setIsviewOpen(false);
        setId("");
    }

    const clearId = () => {
        setId("");
    };

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

    useEffect(() => {

        if (!id) return;

        const payload = { page: currentPage, limit: itemsPerPage, mobile: "" };

        if (data?.id_customer) {
            payload.mobile = data?.id_customer.mobile;
        }

        if (data?.id_employee) {
            payload.mobile = data?.id_employee.mobile;
        }

        handleRefferal(payload)


    }, [currentPage, itemsPerPage, id, data])

    useEffect(() => {
        return () => {
            setWalletUser({})
        }
    }, [])

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


    const { mutate: handleRefferal } = useMutation({
        mutationFn: (payload) => RefferalByUser(payload),
        onSuccess: (response) => {
            if (response) {

                // toast.success(response.message)
                setRefData(response.data)
                const res = response.walletData[0];
                const user = res?.id_customer ? res?.id_customer : res?.id_employee;
                setWalletUser({
                    name: user?.firstname + "" + user.lastname,
                    mobile: user?.mobile,
                    walletAmount: res?.balance_amt,
                    redeem_amt: res?.redeem_amt,
                    bal_amt: res?.balance_amt,
                    total_reff: response?.totalDocuments
                })
                setTotalPages(response.totalPages)
                setCurrentPage(response.currentPage)
                setTotalDocuments(response.totalDocuments)

            }
            setLoading(false)
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message)
            setLoading(false)
        }
    });

    
    const layout_color = useSelector((state) => state.clientForm.layoutColor);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "bill_no") {
            setFormData(prev => ({
                ...prev,
                bill_no: value.toUpperCase()
            }));
        } else {
            const numericValue = value.trim() === "" ? 0 : Number(value);

            if (name === "redeem_amt" && numericValue > walletData.balance_amt) {
                setFormErrors(prev => ({
                    ...prev,
                    redeem_amt: "Redeem amount cannot exceed wallet balance!"
                }))

            } else {
                setFormErrors("");
            }

            setFormData(prev => ({
                ...prev,
                [name]: numericValue
            }));
        }
    };


    const validateForm = () => {
        let errors = {}
        if (!formData.redeem_amt) errors.redeem_amt = "RedeemAmount is required"
        if (formData.redeem_type == "2") {
            if (!formData.bill_no) errors.bill_no = "Billno is required"
        }
        if (formData.redeem_type == "1") {
            if (!formData.payment_mode) errors.payment_mode = "Payment mode is required"
        }
        if (!formData.redeem_type && !isCustomer) errors.redeem_type = "ReedeemType is required"

        setFormErrors(errors)
        return Object.keys(errors).length === 0;
    }



    const handleCancel = () => {
        setFormData({
            bill_no: "",
            redeem_amt: "",
            wallet_id: "",
            wallet_type: "Customer",
            redeem_type: "",
            payment_mode: ""
        })
        setWalletData({})
        setMobile("")

    }

    const handleSave = () => {

        if (!validateForm()) {
            return
        }
        if (!formData.wallet_id) {
            toast.error("Wallet Redeemer not identified")
            return;
        }

        setLoading(true)

        handleRedeem(formData)
    }


    const handleSearchmobile = () => {
        setLoading(true)
        handlesearchcustomer(mobile);

    };

    const handleWalletData = (data) => {

        const isCustomer = !!data.customer;
        setCustomer(isCustomer);

        const person = isCustomer ? data.customer : data.employee;

        setWalletData({
            name: person?.firstname + ' ' + person?.lastname,
            phone: person?.mobile,
            redeem_amt: data?.redeem_amt,
            balance_amt: data?.balance_amt,
            active_scheme: data?.activeScheme,
        });


        setFormData((prevData) => ({
            ...prevData,
            wallet_type: isCustomer ? "Customer" : "Employee",
            wallet_id: data._id,
            redeem_amt: data?.balance_amt
        }));
    };


    const { mutate: handleRedeem } = useMutation({
        mutationFn: walletRedeem,
        onSuccess: (response) => {
            if (response) {
                toast.success(response.message)
                navigate("/wallet/redeemhistory/")
            }
            setLoading(false)
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message)
            setLoading(false)
        }
    });



    const { mutate: handlesearchcustomer } = useMutation({
        mutationFn: mobilesearch,
        onSuccess: (response) => {
            if (response) {
                if(response?.data?.walletData === null){
                    return toast.error('No wallet data')
                }
                handleWalletData(response.data.walletData)
            }
            setLoading(false)
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message)
            setLoading(false)
        }
    });

    const { data: walletPointsRate } = useQuery({
        queryKey: ["walletpoints"],
        queryFn: getallwallet,
    });


    const { data: redeemTypeData } = useQuery({
        queryKey: ["redeem"],
        queryFn: redeemType,
    });

    const { data: paymentModeData } = useQuery({
        queryKey: ["payment"],
        queryFn: getallpaymentmode,
    });

    useEffect(() => {
        if (redeemTypeData) {
            const data = redeemTypeData.data.map(item => ({
                label: item.name,
                value: item.id
            }));

            setRedeemType(data);
        }


        if (paymentModeData) {
            const data = paymentModeData.data.map(item => ({
                label: item.mode_name,
                value: item.id_mode
            }));

            setPaymentData(data);
        }



    }, [redeemTypeData, walletPointsRate, paymentModeData])


    const handleRefferalistory = (data)=>{
            setActiveDropdown(data);
            setIsviewOpen(true);
            setcusData(data)
    }
  

    const columns = [
        {
            header: "S.No",
            cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
        },
        {
            header: "Description",
            cell: (row) => {
             const user = row
            return (
                
                <div className="flex flex-col">
                  <span>{row?.id_scheme?.scheme_name} 
                    {/* {row?.id_scheme?.code} */}
                    </span>
                  <span>
                    
                    {user?.id_scheme_account?.firstname && user?.id_scheme_account?.lastname
                     &&  `${user?.id_scheme_account?.firstname || ''} ${user?.id_scheme_account?.lastname || ''}`}
                  </span>
                </div>
              );
              

            },
        },
        {
            header: "Mobile",
            cell: (row) => {
                const user = row;
                return <span>
                  {user?.id_scheme_account?.mobile
                     &&  `${user?.id_scheme_account?.mobile || ''}`}
              </span>
            }
        },
        {
            header: "Refferral Reward",
            cell: (row) => `₹ ${row?.credited_amount || "-"}`,
        },
        {
            header: "Join Date",
            cell: (row) => {
              const dateStr = row?.id_scheme_account?.start_date;
              if (!dateStr) return "-";
          
              const date = new Date(dateStr);
              return date.toISOString().split("T")[0];
            },
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
                                            className="w-full text-left text-nowrap px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                            onClick={() => {
                                                handleRefferalistory(row);
                                                hanldeActiveDropDown(null);
                                            }}
                                        >
                                            <img src={eyeIcon} alt="" srcSet="" className='text-black w-4 h-4 mr-1' />
                                            View
                                        </button>

                                    </div>
                                </div>
                            </div>,
                            document.body
                        )}
                </>
            ),
        }


    ];


    return (
        <>

            <div className="flex flex-row justify-between items-center w-full sm:order-1 sm:w-auto sm:mr-auto md:order-1 md:w-auto md:mr-auto ">
                <div className="w-1/2 sm:w-auto me-1 mt-2">
                    <Breadcrumb items={[{ label: "Wallet" }, { label: "Wallet Redeemption", active: true }]} />
                </div>
            </div>

            <div className='w-full flex flex-col bg-white border-[1px] border-[#f2f3f8] rounded-md px-6 overflow-y-auto scrollbar-hide gap-x-8 p-5'>
                <h2 className='text-md font-bold text-[#232323] mb-4'>{id ? "Refferal History" : "Add Wallet Redemption"}</h2>
                {
                    !id && (
                        <>

                            <div className='flex flex-col mt-5 relative '>
                                <label className='text-[#232323] mb-1 font-semibold text-sm '>Phone Number<span className='text-red-400'> *</span></label>
                                <input
                                    type='text'
                                    value={mobile}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        setMobile(value)
                                    }}
                                    name='mobile'
                                    onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                    pattern="\d{10}"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handlesearchcustomer(mobile)
                                        }
                                    }}
                                    maxLength={"10"}
                                    className="max-w-[300px] border-2 border-[#F2F2F9] rounded-lg px-4 py-2 ps-9"
                                    placeholder='Enter Here'
                                />

                                {/* Search Icon */}
                                <div
                                    onClick={handleSearchmobile}
                                    className="absolute flex items-center justify-center cursor-pointer left-[0%] rounded-l-lg top-[70%] -translate-y-1/2 w-10 md:h-[40px] md:top-[48px] h-[18%] sm:left-0 sm:top-[68%] lg:left-[0%]"
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                    ) : (
                                        <Search className="text-[#6C7086] h-5 mb-1 w-5" />
                                    )}
                                </div>

                            </div>
                        </>
                    )
                }
                {
                    id ?
                        <>
                            <div className="w-full overflow-x-auto ">
                                <div className="py-3 my-5 rounded-lg min-w-full">
                                    <table className="min-w-[600px] table-auto my-3 w-full">
                                        <thead>
                                            <tr className="text-[#232323] font-semibold text-sm md:text-base">
                                                <th className="text-start px-4 py-2">Name</th>
                                                <th className="text-start px-4 py-2">Mobile</th>
                                                <th className="text-start px-4 py-2">Wallet Amount</th>
                                                <th className="text-start px-4 py-2">Wallet Redeemeption</th>
                                                <th className="text-start px-4 py-2">Total Reffered</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="text-sm md:text-base">
                                                <td className="text-start px-4 py-2">{walletUser.name || "-"}</td>
                                                <td className="text-start px-4 py-2">{walletUser.mobile || "-"}</td>
                                                <td className="text-start px-4 py-2">
                                                    {formatNumber({ value: walletUser.walletAmount ?? "-", decimalPlaces: 0 })}
                                                </td>
                                                <td className="text-start px-4 py-2">
                                                    {formatNumber({ value: walletUser.redeem_amt ?? "-", decimalPlaces: 0 })}
                                                </td>
                                                <td className="text-start px-4 py-2">{walletUser.total_reff ?? "-"}</td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </>
                        :
                        <>
                            <div className="w-full overflow-x-auto ">
                                <div className="py-3 my-5 rounded-lg min-w-full">
                                    <table className="min-w-[600px] table-auto my-3 w-full">
                                        <thead>
                                            <tr className="text-sm text-[#232323] font-semibold md:text-base">
                                                <th className="text-start px-4 py-2">Name</th>
                                                <th className="text-start px-4 py-2">Phone Number</th>
                                                <th className="text-start px-4 py-2">Active Scheme</th>
                                                <th className="text-start px-4 py-2">Available Amount</th>
                                                <th className="text-start px-4 py-2">Redeemed Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="text-sm md:text-base">
                                                <td className="text-start px-4 py-2">{walletData.name || "-"}</td>
                                                <td className="text-start px-4 py-2">{walletData.phone || "-"}</td>
                                                <td className="text-start px-4 py-2">{walletData.active_scheme ?? "-"}</td>
                                                <td className="text-start px-4 py-2">{walletData.balance_amt ?? "-"}</td>
                                                <td className="text-start px-4 py-2">{walletData.redeem_amt ?? "-"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                }

                {
                    !id && (
                        <>
                            <div className='grid grid-col-2 md:grid-cols-3 gap-6 mt-8 md:mt-0'>

                                <div className='flex flex-col gap-2'>
                                    <label className='text-[#232323] text-sm font-semibold'>Redeem Amount<span className='text-red-400'> *</span></label>
                                    <input
                                        type='text'
                                        name='redeem_amt'
                                        maxLength={"5"}
                                        value={formData.redeem_amt}
                                        onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                        pattern="\d{5}"
                                        onChange={handleInputChange}
                                        className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                                        placeholder='Enter amount value'
                                    />
                                    {formErrors.redeem_amt && <span className="text-red-500 text-sm mt-1">{formErrors.redeem_amt}</span>}
                                </div>
                                {
                                    ((!isCustomer || (formData.redeem_type === "1" || formData.redeem_type === 1)) &&
                                        <>
                                            <div className='flex flex-col gap-2'>
                                                <label className='text-[#232323] font-semibold text-sm'>
                                                    Payment Mode<span className='text-red-400'> *</span>
                                                </label>

                                                <Select
                                                    name="redeem_type"
                                                    value={redeem_type.find(option => option.value === formData.redeem_type)}
                                                    onChange={(selectedOption) =>
                                                        handleInputChange({ target: { name: 'redeem_type', value: selectedOption?.value } })
                                                    }
                                                    options={redeem_type}
                                                    styles={customStyles(true)}
                                                    menuPlacement="top"
                                                    placeholder="-- Select --"
                                                />

                                                {formErrors.redeem_type && (
                                                    <span className="text-red-500 text-sm mt-1">{formErrors.redeem_type}</span>
                                                )}
                                            </div>

                                        </>)
                                }

                                {(!isCustomer && (formData.redeem_type === "1" || formData.redeem_type === 1)) && (
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-[#232323] font-semibold text-sm'>
                                            Payment Mode<span className='text-red-400'>*</span>
                                        </label>

                                        <Select
                                            name="paymentData"
                                            value={paymentData.find(option => option.value === formData.payment_mode)}
                                            onChange={(selectedOption) =>
                                                // handleInputChange({ target: { name: 'payment_mode', value: selectedOption?.value } })
                                                setFormData(prev => ({
                                                    ...prev,
                                                    payment_mode: selectedOption?.value
                                                }))
                                            }
                                            options={paymentData}
                                            styles={customStyles(true)}
                                            menuPlacement="top"
                                            placeholder="-- Select --"
                                        />

                                        {formErrors.payment_mode && (
                                            <span className="text-red-500 text-sm mt-1">{formErrors.payment_mode}</span>
                                        )}
                                    </div>
                                )}

                                {
                                    (isCustomer || (formData.redeem_type.toString() == '2')) && (
                                        <>

                                            <div className='flex flex-col gap-2'>
                                                <label className='text-[#232323] font-semibold text-sm'>Bill no<span className='text-red-400'></span></label>
                                                <input
                                                    type='text'
                                                    name='bill_no'
                                                    value={formData.bill_no}
                                                    onInput={(e) => {
                                                        const regex = /^[a-zA-Z0-9-]*$/;
                                                        if (regex.test(e.target.value)) {
                                                            handleInputChange(e);
                                                        }
                                                    }}
                                                    maxLength={20}
                                                    className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                                                    placeholder='Enter bill number'
                                                />
                                                {formErrors.bill_no && <span className="text-red-500 text-sm mt-1">{formErrors.bill_no}</span>}
                                            </div>
                                        </>
                                    )
                                }
                            </div>


                            <div className='bg-white border-gray-300 mt-4'>
                                <div className='flex justify-end gap-x-2'>
                                    <button
                                        className=" bg-blue-900 text-white h-[36px] w-full md:w-24 rounded-lg text-sm font-semibold hover:bg-blue-800 flex justify-center items-center"
                                        type='button'
                                        onClick={handleSave}
                                    >
                                        {isLoading ? <SpinLoading /> : 'Submit'}
                                    </button>
                                    <button
                                        className="w-full h-[36px] border-2 bg-[#F6F7F9] border-[#f2f3f8] rounded-lg text-sm font-semibold hover:bg-gray-50 flex justify-center items-center text-[#6C7086] md:w-24 "
                                        type='button'
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>
                                    
                                </div>
                            </div>

                        </>
                    )

                }

                {
                    id && (
                        <>

                            {/* Table */}
                            <div className="mt-4">
                                <Table
                                    data={refData.data}
                                    columns={columns}
                                    isLoading={isLoading}
                                    currentPage={currentPage}
                                    handlePageChange={handlePageChange}
                                    itemsPerPage={itemsPerPage}
                                    totalItems={totalDocuments}
                                    handleItemsPerPageChange={handleItemsPerPageChange}
                                />
                            </div>
                            <ModelOne
                                title={"Reffered Customer History"}
                                extraClassName="w-[650px]"
                                setIsOpen={setIsviewOpen}
                                isOpen={isviewOpen}
                                isLoading={isLoading}
                                closeModal={closeIncommingModal}
                            >
                                <RefferalCusCard

                                    refData={cusdata}

                                />
                            </ModelOne>
                        </>
                    )

                }


            </div>



        </>
    )
}

export default WalletRedemption