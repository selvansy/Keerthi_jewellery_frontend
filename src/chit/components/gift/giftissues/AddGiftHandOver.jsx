import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { CalendarDays, Search } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'
import { Trash2 } from 'lucide-react';
import Select from "react-select";
import { customSelectStyles } from "../../../components/Setup/purity/index";
import { useMutation, useQuery } from '@tanstack/react-query';
import { emptyToZero, formatNumber } from "../../../utils/commonFunction"
import { addgiftissues, searchGiftCodenumber, giftissuetype, searchcustomermobile, getallgiftInwardByBranch,searchSchAccByMobile, getallbranch } from '../../../api/Endpoints'
import SpinLoading from '../../common/spinLoading';

const AddGiftIssued = () => {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const navigate = useNavigate();
  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_branch = roledata?.branch;
  const branchaccess = roledata?.id_branch;

  const [branchList, setBranchList] = useState([]);
  const [branchId, setIdbranch] = useState("");
  const [schId, setSchId] = useState("")
  const [mobile, setMobile] = useState('');
  const [noOfgifts, setNoGifts] = useState("")
 
 
  const [issuetype, setIssuetype] = useState([]);

  const [schemeaccount, setSchemeaccount] = useState([]);
  const [customer_name, setCustomername] = useState('');
  const [address, setAddress] = useState('');

  
  const [searchbarcode, setSearchbarcode] = useState('');
  const [barcodeData, setBarcodeData] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [barcodeNums, setBarcodeNums] = useState([]);
  const [excess_amount, setExcessamount] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const [visibleaccount, setVisibleaccount] = useState(false);
  const [formData, setFormData] = React.useState({
    id_customer: "",
    mobile: null,
    id_branch: "",
    issue_type: null,
    gift_issues: [],
    id_scheme_account:""
  });


  
  // const handleschemeaccountlist = async (id_scheme_account) => {

  //   if (!id_scheme_account) return;
  //   const response = await getschemeaccountbyid({ "id": id_scheme_account });
  //   if (response) {
  //     if (response.data.id_scheme.scheme_type > 3) {
  //       setSchemeammount("₹ " + response.data.id_scheme.min_amount + " " + response.data.id_scheme.max_amount);
  //     } else if (response.data.id_scheme.scheme_type === 3) {
  //       setSchemeammount("GRM " + response.data.id_scheme.min_weight + " " + response.data.id_scheme.max_weight);
  //     } else {
  //       setSchemeammount("₹ " + response.data.id_scheme.amount);
  //     }
  //     setGiftpercentage(response.data.gift_percentage);
  //     setAllocategiftamt(response.data.allocate_gift_amount);
  //     setReceivedgiftamt(response.data.received_gift_amount);
  //     setBalancegiftamt(response.data.balance_gift_amount);
  //   }
  // };

 

  const { data: giftResponse, isLoading: loadingGifts } = useQuery({
    queryKey: ["barcode", branchId],
    queryFn: () => getallgiftInwardByBranch(branchId),
  });

  
  const { data: branchresponse, isLoading: loadingbranch } = useQuery({
    queryKey: ["branch"],
    queryFn: getallbranch,
    enabled: id_branch === "0" || id_branch === 0,
  });


  const { data: giftIssueResponse, isLoading: loadingGiftItems } = useQuery({
    queryKey: ["giftissues",branchId],
    queryFn: giftissuetype,
  });

  // const { data: handleschemeaccountlist, isLoading: loadingSchAcc } = useQuery({
  //   queryKey: ["SchAcc",schId],
  //   queryFn:()=> searchmobileschemeaccount(schId),
  // });


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

  }, [giftResponse, branchresponse,giftIssueResponse]);


  useEffect(() => {

    if(!roledata) return;
    if (id_branch !== "0" || id_branch !== 0) {
      setFormData(prev => ({
        ...prev,
        id_branch: branchaccess
      }));
      setIdbranch(branchaccess)
    }

  }, [branchaccess,visibleaccount, roledata]);


  const handleSearchmobile = () => {
 
    if (mobile === "") {
      toast.error('Mobile Number is required!');
    }

    setFormData(prev => ({
      ...prev,
      mobile: mobile,
    }));

    if (formData.issue_type === "1" || formData.issue_type === 1) {
      handlesearchScheme({ value: mobile, branchId: formData.id_branch })
    }else{
      handlesearchcustomer({ search: mobile, id_branch: formData.id_branch });
    }
  };

  const { mutate: handlesearchScheme } = useMutation({
    mutationFn: (data) => searchSchAccByMobile(data),
    onSuccess: (response) => {
    
      if (response) {
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



  const handleschemeaccountbyBranch = async (data) => {
    if (!data?.length) return;
   
    const account = data.map(({ _id, id_scheme }) => {
      const { scheme_type, scheme_name, amount, min_weight, max_weight, min_amount, max_amount,no_of_gifts } = id_scheme;

      const scheme_name_formatted = [3, 4, 12].includes(scheme_type)
        ? `${min_weight} Grm - ${max_weight} Grm`
        : `₹. ${min_amount ?? amount} - ₹. ${max_amount ?? amount}`;
  
      return { value: _id, label: `${scheme_name} (${scheme_name_formatted})` ,giftCount: `${no_of_gifts}`};
    });
  
    setSchemeaccount(account);
  };

  
  const inputChange = (e) => {

    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "id_branch") {
      setIdbranch(value);
    }
  };

  const handleSchemeAcc = (value)=>{

      if (value === "1" || value === 1) {
        setVisibleaccount(true);
      } else {
        setVisibleaccount(false);
        setCustomername(null);
        setAddress(null);
        setNoGifts(null)
      }
  }



  const handleSearchbarcode = () => {
   
    if (!searchbarcode) {
      toast.error('Barcode Number is required!');
      return;
    }

    if (totalGifts >= noOfgifts && (formData.issue_type === "1" || formData.issue_type === 1) ) {
      toast.error("Gift limit reached");
    } else {
      handlegiftbarcodeno({ barcode: searchbarcode, id_branch: formData.id_branch });
    }
  }


  const totalGifts = barcodeData.reduce((acc, curr) => acc + curr.quantity, 0);


  const { mutate: handlegiftbarcodeno } = useMutation({
    mutationFn: (payload) => searchGiftCodenumber(payload),
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


  const handleautocompletemobile = (e) => {
    const value = e.target.value;
    setMobile(value);
  };


  const handleCancle = () => {
    navigate('/gift/gifthandover')
  }

  const handleAddCustomer = () => {
    navigate('/manageaccount/addcustomer')
  }


  const validateForm = () => {
    const errors = {};

    if (formData.issue_type === "1")
      if (!formData.id_scheme_account) errors.id_scheme_account = 'Scheme Account is required';

    if (!id_branch) errors.id_branch = 'Branch is required';
    if (!formData.mobile) errors.mobile = 'Mobile Number is required';
    if (!formData.issue_type) errors.issue_type = 'Issue Type is required';

    if (!formData.gift_issues.length === 0) {
      toast.error('Handover Gift is required!');
    }


    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

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


  return (
    <>
      <div className='flex flex-row justify-between'>
        <h2 className='text-2xl text-gray-900 font-bold justify-between'>Gift HandOver</h2>
        <button
          type='button'
          className=" rounded-md px-4 py-2 cursor-pointer text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
          onClick={handleAddCustomer}
          style={{ backgroundColor: layout_color }}>
          + Add Customer
        </button>
      </div>
      <div className='w-full flex flex-col bg-white pl-8 pr-8 pb-4 border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]'>
        <div className='mb-8'>
          <h2 className='text-1xl font-semibold mb-4 mt-4'>Customer Details</h2>
          <div className='grid grid-rows-2 md:grid-cols-2 gap-5'>

            {id_branch === "0" && (
              <div className='flex flex-col mt-2'>
                <label className='text-black mb-1 font-medium'>Branch<span className='text-red-400'>*</span></label>
                <div className="relative">

                  <Select
                    options={branchList}
                    value={branchList.find(branch => branch.value === formData.id_branch) || branchId}
                    onChange={(branch) => {
                      setFormData((prev) => ({
                        ...prev,
                        id_branch: branch.value,
                      }));
                      setIdbranch(branch.value)
                    }}
                    customSelectStyles={customSelectStyles}
                    isLoading={loadingbranch}
                    placeholder="Select Branch"
                  />

                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                  {formErrors.id_branch && <span className="text-red-500 text-sm mt-1">{formErrors.id_branch}</span>}
                </div>
              </div>
            )}


            <div className='flex flex-col mt-2'>
              <label className='text-black mb-1 font-medium'>Gift Issued Type<span className='text-red-400'>*</span></label>
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
                    placeholder="Select GiftIssued Type"
                  />


                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {formErrors.issue_type && <span className="text-red-500 text-sm mt-1">{formErrors.issue_type}</span>}
            </div>


            <div className='flex flex-col mt-2 relative'>
              <label className='text-black mb-1 font-normal'>Search Mobile Number<span className='text-red-400'>*</span></label>

              <input
                type='tel'
                name='mobile'
                value={mobile}
                onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                onChange={handleautocompletemobile}
                pattern="\d{10}"
                placeholder="Enter Mobile"
                className='border-2 border-gray-300 rounded-md p-3  focus:border-transparent'
                maxLength="10"
              />

              <div onClick={handleSearchmobile} className="absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[68%] -translate-y-1/2 w-10 md:h-[50px] md:top-[54px] h-[62%] sm:right-0 sm:top-[68%] lg:right-[0%]"
                style={{ backgroundColor: layout_color }}>
                <Search size={20} className="text-white" />
              </div>

            </div>

            {visibleaccount === true && (
              <div className='flex flex-col mt-2'>
                <label className='text-black mb-1 font-medium'>Scheme Account<span className='text-red-400'>*</span></label>
                <div className="relative">
                  {/* <select onChange={(e) => inputChange(e)} name="id_scheme_account" className='appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2  focus:border-transparent' defaultValue=''>
                    <option value='' readOnly>--Select--</option>
                    {schemeaccount.map((account) => (
                      <option key={account._id} value={account._id}>{account.scheme_name}</option>
                    ))}
                  </select> */}
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

            <div className='flex flex-col mt-2'>
              <label className='text-gray-700 mb-1 font-medium'>Customer Name<span className='text-red-400'>*</span></label>
              <input
                value={customer_name}
                onChange={inputChange}
                readOnly
                type='text'
                className='border-2 border-gray-300 bg-[#e5e7eb] rounded-md p-3 w-full pr-16 focus:outline-none focus:ring-2   focus:border-transparent'
                placeholder=''
              />
              {formErrors.id_customer && <span className="text-red-500 text-sm mt-1">{formErrors.id_customer}</span>}
            </div>

            <div className='flex flex-col mt-2'>
              <label className='text-gray-700 mb-1 font-medium'>Address</label>
              <input
                value={address}
                onChange={inputChange}
                readOnly
                type='text'
                className='border-2 border-gray-300 bg-[#e5e7eb] rounded-md p-3 w-full pr-16 focus:outline-none focus:ring-2   focus:border-transparent'
                placeholder=''
              />
            </div>

            {
              (visibleaccount === true) &&
              <div className='flex flex-col mt-2'>
                <label className='text-gray-700 mb-1 font-medium'>Number of Gifts</label>
                <input
                  value={noOfgifts}
                  onChange={inputChange}
                  readOnly
                  type='text'
                  className='border-2 border-gray-300 bg-[#e5e7eb] rounded-md p-3 w-full pr-16 focus:outline-none focus:ring-2   focus:border-transparent'
                  placeholder=''
                />
              </div>
            }

          </div>


          <div className='lg:flex lg:flex-col md:flex md:flex-col md:mt-2 hidden'></div>
          {/* {visibleaccount === true && (
            <>
              <h2 className='text-1xl font-semibold mb-4 mt-4'>Gift Details</h2>
              <div className="w-full shadow-md bg-gray-50">
                <div className="md:hidden">

                  <div className="p-4 border-b border-gray-300">
                    <div className="text-center font-medium mb-2">Scheme Amount</div>
                    <div className="text-center font-medium">{scheme_amount}</div>
                    <div className="text-center font-medium mb-2">Gift Percentage</div>
                    <div className="text-center font-medium">{gift_percentage}</div>
                    <div className="text-center font-medium mb-2">Allocate Gift Amount</div>
                    <div className="text-center font-medium">{allocate_gift_amount}</div>
                    <div className="text-center font-medium mb-2">Received Gift Amount</div>
                    <div className="text-center font-medium">{received_gift_amount}</div>
                    <div className="text-center font-medium mb-2">Balance Gift Amount</div>
                    <div className="text-center font-medium">{balance_gift_amount}</div>
                  </div>

                </div>
                <div className="hidden md:block">
                  <div className="grid grid-cols-5 w-full">
                    <div className="col-span-5 grid grid-cols-5 w-full p-3 border-b-2 border-gray-300">

                      <div className="text-black font-medium flex items-center justify-center text-center px-2">
                        Scheme Amount
                      </div>
                      <div className="text-black font-medium flex items-center justify-center text-center px-2">
                        Gift Percentage
                      </div>
                      <div className="text-black font-medium flex items-center justify-center text-center px-2">
                        Allocate Gift Amount
                      </div>
                      <div className="text-black font-medium flex items-center justify-center text-center px-2">
                        Received Gift Amount
                      </div>
                      <div className="text-black font-medium flex items-center justify-center text-center px-2">
                        Balance Gift Amount
                      </div>
                    </div>
                    <div className="col-span-5 grid grid-cols-5 w-full p-3 border-b-2 border-gray-300">

                      <div className="text-black font-medium flex items-center justify-center">
                        {scheme_amount}
                      </div>
                      <div className="text-black font-medium flex items-center justify-center">
                        {gift_percentage}
                      </div>
                      <div className="text-black font-medium flex items-center justify-center">
                        {allocate_gift_amount}
                      </div>
                      <div className="text-black font-medium flex items-center justify-center">
                        {received_gift_amount}
                      </div>
                      <div className="text-black font-medium flex items-center justify-center">
                        {balance_gift_amount}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </>
          )} */}
        </div>

        <div className='grid grid-rows-1 md:grid-cols-2 gap-5'>

          <div className='flex flex-col mt-2 mb-4 relative'>
            <label className='text-gray-700 mb-1 font-medium'>Barcode Number<span className='text-red-400'>*</span></label>

            <Select
              name='searchbarcode'
              options={barcodeNums}
              value={barcodeNums.find(option => option.value === searchbarcode) || ""}
              onChange={(selectedOption) => {
                setSearchbarcode(selectedOption.value);
              }}
              styles={customSelectStyles}
              isLoading={loadingGifts}
              placeholder="Select Barcode"
            />
            <div onClick={handleSearchbarcode} className="absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[68%] -translate-y-1/2 w-10 md:h-[50px] md:top-[54px] h-[62%] sm:right-0 sm:top-[68%] lg:right-[0%]"
              style={{ backgroundColor: layout_color }}>
              <Search size={20} className="text-white" />
            </div>
          </div>
        </div>
        <div className="w-full shadow-md bg-gray-50">

          <div className="w-full p-3 border-b-2 border-gray-300">
            <table id="barDatatable" className="min-w-full table-auto">
              <thead>
                <tr className=" text-white"
                  style={{ backgroundColor: layout_color }} >
                  <th className="px-2 py-2 text-center">Action</th>
                  <th className="px-2 py-2 text-center">Gift Quantity</th>
                  <th className="px-2 py-2 text-center">Barcode</th>
                  <th className="px-2 py-2 text-center">Gift Name</th>
                  <th className="px-2 py-2 text-center">Gift Price</th>

                  {/* {visibleaccount === true && (
                    <th className="px-2 py-2 text-center">Excess Amount</th>
                  )} */}
                </tr>
              </thead>
              <tbody>
                {barcodeData?.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-black font-medium">
                      No Record Data
                    </td>
                  </tr>
                ) : (
                  barcodeData?.map((bar, index) => {
                    const excessgiftprice = excess_amount[index] || 0;

                    return (
                      <tr key={index}>
                        <td className="flex flex-row items-center justify-center gap-3 text-center py-2">
                          <a onClick={() => removeRowById(index)} href="#" className="text-red-600 hover:bg-gray-100">
                            <Trash2 size={20} />
                          </a>
                        </td>
                        <td className="text-center py-2">{bar.quantity}</td>
                        <td className="text-center py-2">{bar.barcode}</td>
                        <td className="text-center py-2">{bar.id_gift ? bar.id_gift.gift_name : 'N/A'}</td>
                        <td className="text-center py-2">{bar.cus_sellprice > 0 ? formatNumber({ value: bar.cus_sellprice }) : 'N/A'}</td>
                        {/* {visibleaccount === true && (
                          <td className="text-center py-2">{excessgiftprice > 0 ? formatNumber({value:excessgiftprice}) : 'N/A'}</td>
                        )} */}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className='bg-white p-2 border-t-2 border-gray-300 mt-4'>
          <div className='flex justify-end gap-2 mt-3'>
            <button
              className='bg-[#E2E8F0] text-black rounded-md p-3 w-full lg:w-20'
              type='button'
              onClick={handleCancle}
            >
              Cancel
            </button>
            <button
              className='bg-[#61A375] text-white rounded-md p-3 w-full lg:w-20'
              type='button'
              onClick={handleSubmit}
            >
              {isLoading ? <SpinLoading /> : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddGiftIssued;