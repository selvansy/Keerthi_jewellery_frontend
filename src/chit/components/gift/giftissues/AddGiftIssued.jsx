import React, { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { CalendarDays, Search } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';
import { useDispatch,useSelector } from 'react-redux'

import { addgiftissues, updategiftissues,giftissuesdatatable,searchbarcodenumber, giftissuetype, getcustomerschemeaccount, searchcustomermobile, getallbranch, getschemeaccountbyid } from '../../../api/Endpoints'
const AddGiftIssued = () => {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const navigate = useNavigate();
  const location = useLocation();
  const todaydate = new Date();
  const { id } = useParams()
  
  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_role = roledata?.id_role?.id_role;
  const id_client = roledata?.id_client;
  const id_branch = roledata?.branch;
  const [branchList, setBranchList] = useState([]);
  const [branchId, setIdrancbh] = useState(id_branch);
  const [profileImage, setProfileImage] = useState(null);
  const [idProof, setIdProof] = useState(null);
  const [resume, setResume] = useState(null);
  const [joiningDate, setJoiningDate] = useState(null);
  const [searchmobile, setSearchMobile] = useState('');
  const [mobile, setMobile] = useState('');
  const [searcherror, setSearchError] = useState('');
  const [barcodeerror, setBarcodeError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [issuetype, setIssuetype] = useState([]);
  const [schemeaccount, setSchemeaccount] = useState([]);
  const [customer_name, setCustomername] = useState('');
  const [address, setAddress] = useState('');
  const [scheme_amount, setSchemeammount] = useState(0);
  const [gift_percentage, setGiftpercentage] = useState(0);
  const [allocate_gift_amount, setAllocategiftamt] = useState(0);
  const [received_gift_amount, setReceivedgiftamt] = useState(0);
  const [balance_gift_amount, setBalancegiftamt] = useState(0);
  const [isgiftissue, setIsgiftissue] = useState([{ id: 1 }]);
  const [searchbarcode, setSearchbarcode] = useState('');
  const [excessgiftprice, setExcessgiftprice] = useState(0);
  const [dispexcessgiftprice, setDisplaypriceprice] = useState(0);
  const [barcodeData, setBarcodeData] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const [price, setPrice] = useState(0);
  const [id_giftinward, setIdgiftinward] = useState([]);
  const [id_gift, setIdgift] = useState([]);
  const [divsion, setDivsion] = useState([]);
  const [barcode, setBarcode] = useState([]);
  const [excess_amount, setExcessamount] = useState([]);



  useEffect(() => {
    let totalCussellprice = 0;
    let updatedExcessamount = [];
    let updatedBarcode = [];
    let updatedIdgiftinwards = [];
    let updatedIdgift = [];
    let updatedDivsion = [];
    let updatedPrice = [];

    barcodeData.forEach((bar) => {
      const balance = parseFloat(balance_gift_amount) || 0;
      let excessgiftprice = 0;

      totalCussellprice += parseFloat(bar.cus_sellprice) || 0;

      if (totalCussellprice > balance) {
        excessgiftprice = totalCussellprice - balance;
      }
      updatedIdgiftinwards.push(bar._id);
      updatedIdgift.push(bar.id_gift._id);
      updatedDivsion.push(bar.cus_sellprice);
      updatedBarcode.push(bar.barcode);
      updatedExcessamount.push(excessgiftprice);
      updatedPrice.push(bar.cus_sellprice);
    });

    setBarcode(updatedBarcode);
    setExcessamount(updatedExcessamount);
    setPrice(updatedPrice);
    setIdgiftinward(updatedIdgiftinwards);
    setIdgift(updatedIdgift);
    setDivsion(updatedDivsion);

  }, [barcodeData, balance_gift_amount]);

    const { mutate: getBranchList } = useMutation({
      mutationFn: getallbranch,
      onSuccess: (response) => {
        setBranchList(response.data);
      },
      onError: (error) => {
        console.error("Error fetching countries:", error);
      },
    });
  useEffect(() => {
    getBranchList();
  }, []);

  const [visibleaccount, setVisibleaccount] = useState(true);
  const [formData, setFormData] = React.useState({
    id_customer: '',
    mobile: '',
    id_branch: id_branch || "",
    issue_type: '',
    id_giftinward: id_giftinward,
    id_gift: id_gift,
    barcode: barcode,
    id_scheme_account: '',
    divsion: divsion,
    excess_amount: excess_amount
  });


  const { mutate: getallissuetypeMutate } = useMutation({
    mutationFn: giftissuetype,
    onSuccess: (response) => {

      if (response) {
        setIssuetype(response.data);
      }
    },
  });
  useEffect(() => {
    getallissuetypeMutate();
  }, []);

  const handleschemeaccountbyBranch = async () => {
    if (!id_branch) return;

    const response = await getcustomerschemeaccount({ "id_branch": branchId, "id_customer": formData.id_customer });

    if (response && response.data.length > 0) {
      let account = [];

      // Iterate through the response data array
      for (let i = 0; i < response.data.length; i++) {
        const data = response.data[i];  // Access each item in the array

        let scheme_name = '';

        // Conditionally assign scheme_name based on scheme_type

        if (data.id_scheme.scheme_type === 0 || data.id_scheme.scheme_type === 1 || data.id_scheme.scheme_type === 2) {
          scheme_name = "₹. " + data.id_scheme.amount;
        } else if (data.id_scheme.scheme_type === 3) {
          scheme_name = `${data.id_scheme.min_weight} Grm ${data.id_scheme.max_weight} Grm`;
        } else {
          scheme_name = `₹. ${data.id_scheme.min_amount} ₹. ${data.id_scheme.max_amount}`;
        }

        // Push the formatted scheme to the account array
        account.push({ _id: data._id, scheme_name: data.id_scheme.scheme_name + " (" + scheme_name + ")" });
      }

      // Update the state with the account data
      setSchemeaccount(account);
    }
  };


  const filterInputchange = (e) => {

    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if(name === "id_branch"){
      setIdrancbh(value);
    }

    if (name === "issue_type") {

      if (value === "1") {
        handleschemeaccountbyBranch();
        setVisibleaccount(true);
      } else {
        setVisibleaccount(false);
      }
    } else if (name === "id_scheme_account") {
      handleschemeaccountlist(value);
    } else if (name === "searchbarcode") {
      setSearchbarcode(value);

    }


    isValidForm();
  };

  const handleschemeaccountlist = async (id_scheme_account) => {
    if (!id_scheme_account) return;
    const response = await getschemeaccountbyid({ "id": id_scheme_account });
    if (response) {
      if(response.data.id_scheme.scheme_type >3 ) {
        setSchemeammount("₹ "+response.data.id_scheme.min_amount+" "+response.data.id_scheme.max_amount);
     } else if(response.data.id_scheme.scheme_type===3 ) {
       setSchemeammount("GRM "+response.data.id_scheme.min_weight+" "+response.data.id_scheme.max_weight);
      }  else {
        setSchemeammount("₹ "+response.data.id_scheme.amount);
      }


      setGiftpercentage(response.data.gift_percentage);
      setAllocategiftamt(response.data.allocate_gift_amount);
      setReceivedgiftamt(response.data.received_gift_amount);
      setBalancegiftamt(response.data.balance_gift_amount);
    }
  };


  const handleSearchbarcode = () => {
    setBarcodeError('');
    if (searchbarcode === "") { toast.error('Barcode Number is required!'); }
    handlegiftbarcodeno({ barcode: searchbarcode, id_branch: branchId });
  };

  const { mutate: handlegiftbarcodeno } = useMutation({
    mutationFn: searchbarcodenumber,
    onSuccess: (response) => {
      if (response && response.data) {




        setBarcodeData((prevData) => [...prevData, response.data]);
        toast.success(response.message); // Show success toast
      } else {
        toast.error("Unexpected response format or no data returned");
      }
    },
    onError: (error) => {
      // Handle error scenario
      console.error(error);
      toast.error("Failed to fetch barcode data");
    },
  });
  const removeRowById = (idToRemove) => {

    alert(idToRemove);
    setBarcodeData((prevData) => prevData.filter((bar, index) => index !== idToRemove));

  };
  const handleautocompletemobile = (e) => {
    const value = e.target.value;
    setMobile(value);
    setSearchMobile(value);
    if (value.length > 0) {
      handleautosearchmobile({ searchTerm: value });
    } else {
      setSuggestions([]);
    }

   
  };
  const handleSearchmobile = () => {

    setSearchError('');
    if (mobile === "") { toast.error('Mobile Number is required!'); }
    handlesearchcustomer({ search_mobile: mobile });
    validateForm();
  };
  const handleSelectNumber = (number) => {
    setMobile(number);
    setSuggestions([]); // 
  };

  const { mutate: handlesearchcustomer } = useMutation({
    mutationFn: searchcustomermobile,
    onSuccess: (response) => {
      if (response) {


        setCustomername(response.data.firstname + ' ' + response.data.lastname);
        setAddress(response.data.address);
        setFormData({
          id_customer: response.data._id,
          mobile: response.data.mobile,
          issue_type: '',
          id_giftinward: [],
          id_gift: [],
          barcode: [],
          id_scheme_account: '',
          divsion: [],
          excess_amount: []
        });

        toast.success(response.message)
      }

    },
  });

  // const { mutate: handleautosearchmobile } = useMutation({
  //   mutationFn: searchmobilenoincustomer,
  //   onSuccess: (response) => {

  //     if (response.data > 0) {

  //       const filteredSuggestions = response.data.filter((number) =>
  //         number.includes(searchmobile)
  //       );
  //       setSuggestions(filteredSuggestions);
  //     }


  //   },
  // });


  const handleCancle = () => {
    navigate('/gift/giftissues')
  }

  const handleAddCustomer = () => {
    navigate('/gift/giftissues')
  }

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (formData.issue_type ===1) if (!formData.id_scheme_account) errors.id_scheme_account = 'Scheme Account is required';
    if (!formData.id_customer) errors.id_customer = 'Customer Name is required';
    if (!id_branch) errors.id_branch = 'Branch is required';
    if (!formData.mobile) errors.mobile = 'Mobile Number is required';
    if (!formData.issue_type) errors.issue_type = 'Issue Type is required';


    console.log(errors);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }


    if (id_gift.length === 0) {
      toast.error('Gift Id is required!');
    } else if (barcode.length === 0) {
      toast.error('Barcode is required!');
    } else if (divsion.length === 0) {
      toast.error('Price is required!');
    } else if (id_giftinward.length === 0) {
      toast.error('Gift Inwards Id is required!');
    } else if (excess_amount.length === 0) {
      toast.error('Excess Amount is required!');
    } else {

      const formDataToSend = {
        id_customer: formData.id_customer,
        mobile: formData.mobile,
        id_branch: branchId,
        issue_type: formData.issue_type,
        id_giftinward: id_giftinward,
        id_gift: id_gift,
        barcode: barcode,
        id_scheme_account: formData.id_scheme_account,
        divsion: divsion,
        excess_amount: excess_amount,
      };
      createGiftissuesMutate(formDataToSend);
    }
  };

  
    const {mutate: createGiftissuesMutate } = useMutation({
      mutationFn: addgiftissues,
      onSuccess: (response) => {
        console.log(response);
        toast.success(response.message)
        navigate('/gift/giftissues')
      },
      onError: (error) => {
        toast.error(error.response.data.message)
      }
    });
  
  return (
    <>
      <div className='flex flex-row justify-between'>
        <h2 className='text-2xl text-gray-900 font-bold justify-between'>Gift Issued</h2>
        <button
          className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
          onClick={handleAddCustomer}
          style={{ backgroundColor: layout_color }}>
          + Add Customer
        </button>
      </div>
      <div className='w-full flex flex-col bg-white pl-8 pr-8 pb-4 border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]'>
        <div className='mb-8'>
          <h2 className='text-1xl font-semibold mb-4 mt-4'>Customer Details</h2>
          <div className='grid grid-rows-2 md:grid-cols-2 gap-5'>

            <div className='flex flex-col mt-2 relative'>
              <label className='text-black mb-1 font-normal'>Search Mobile Number<span className='text-red-400'>*</span></label>
              <input
                type='text'
                value={mobile}
                onChange={handleautocompletemobile}
                className='border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                placeholder='Enter Here'
              />


              {/* Suggestions dropdown */}
              {suggestions.length > 0 && (
                <ul className="absolute bg-white border-2 border-gray-300 w-full mt-1 max-h-40 overflow-auto z-10 automargin">
                  {suggestions.map((number) => (
                    <li
                      key={number}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSelectNumber(number)}
                    >
                      {number}
                    </li>
                  ))}
                </ul>
              )}


              {/* Search Icon */}
              <div onClick={handleSearchmobile} className="absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[68%] -translate-y-1/2 w-10 h-[62%] sm:right-0 sm:top-[68%] sm:rounded-r-lg md:right-[-20%] md:rounded-lg lg:rounded-lg lg:right-[-10%]"
              style={{ backgroundColor: layout_color }}>
                <Search size={20} className="text-white" />
              </div>
            </div>

            <div className='lg:flex lg:flex-col lg:mt-2 md:flex md:flex-col md:mt-2 hidden'></div>
            <div className='flex flex-col'>
              <label className='text-gray-700 mb-1 font-medium'>Customer Name<span className='text-red-400'>*</span></label>
              <input
                value={customer_name}
                onChange={filterInputchange}
                disabled
                type='text'
                className='border-2 border-gray-300 rounded-md p-3 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                placeholder=''
              />
              {formErrors.id_customer && <span className="text-red-500 text-sm mt-1">{formErrors.id_customer}</span>}
            </div>

            <div className='flex flex-col'>
              <label className='text-gray-700 mb-1 font-medium'>Address</label>
              <input
                value={address}
                onChange={filterInputchange}
                disabled
                type='text'
                className='border-2 border-gray-300 rounded-md p-3 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                placeholder=''
              />
            </div>

            {id_branch === "0" && (
              <div className='flex flex-col'>
                <label className='text-black mb-1 font-medium'>Branch<span className='text-red-400'>*</span></label>
                <div className="relative">
                  <select  value={formData.id_branch} onChange={(e) => filterInputchange(e)} name="id_branch" className='appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                    <option value='' >--Select--</option>
                   
                    {branchList.map((branch) => (
                      <option
                        className="text-gray-700"
                        key={branch._id}
                        value={branch._id}
                      >
                        {branch.branch_name}
                      </option>
                    ))}
                  </select>
                  {formErrors.id_branch && <span className="text-red-500 text-sm mt-1">{formErrors.id_branch}</span>}
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            )}

            <div className='flex flex-col'>
              <label className='text-black mb-1 font-medium'>Gift Issued Type<span className='text-red-400'>*</span></label>
              <div className="relative">
                <select value={formData.issue_type} name="issue_type" onChange={(e) => { filterInputchange(e) }} className='appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>

                  <option value=''>--Select--</option>
                  {issuetype.map((issue) => (
                    <option key={issue.id} value={issue.id}>{issue.name}</option>
                  ))}
                </select>
                {formErrors.issue_type && <span className="text-red-500 text-sm mt-1">{formErrors.issue_type}</span>}
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            {visibleaccount === true && (
              <div className='flex flex-col'>
                <label className='text-black mb-1 font-medium'>Scheme Account<span className='text-red-400'>*</span></label>
                <div className="relative">
                  <select onChange={(e) => filterInputchange(e)} name="id_scheme_account" className='appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                    <option value='' >--Select--</option>
                    {schemeaccount.map((account) => (
                      <option key={account._id} value={account._id}>{account.scheme_name}</option>

                    ))}
                  </select>
                  {formErrors.id_scheme_account && <span className="text-red-500 text-sm mt-1">{formErrors.id_scheme_account}</span>}
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
          {visibleaccount === true && (
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
          )}
        </div>
        {/* barcode with search functionality */}
        {/* <h2 className='text-1xl font-semibold mb-4'>Barcode Number<span className='text-red-400'>*</span></h2> */}
        <div className='grid grid-rows-1 md:grid-cols-2 gap-5'>
          <div className='flex flex-col mt-2 mb-4 relative'>
            <label className='text-gray-700 mb-1 font-medium'>Barcode Number<span className='text-red-400'>*</span></label>
            <input
              name='searchbarcode'
              onChange={(e) => filterInputchange(e)}
              type='text'
              className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
              placeholder='Enter Barcode Number'
            />

            <div onClick={handleSearchbarcode} className="absolute flex items-center justify-center 
                    right-[0%] rounded-r-lg top-[68%] -translate-y-1/2
                    w-10 h-[62%]
                   
                    sm:right-0
                    sm:top-[68%]
                    sm:rounded-r-lg
                    md:right-[-20%]
                    md:rounded-lg
                    lg:rounded-lg
                    lg:right-[-12%]
                    cursor-pointer
                    " 
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
                  <th className="px-2 py-2 text-center">Barcode</th>
                  <th className="px-2 py-2 text-center">Gift Name</th>
                  <th className="px-2 py-2 text-center">Gift Price</th>
                  {visibleaccount === true && (
                  <th className="px-2 py-2 text-center">Excess Amount</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {barcodeData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-black font-medium">
                      No Record Data
                    </td>
                  </tr>
                ) : (
                  barcodeData.map((bar, index) => {
                    const excessgiftprice = excess_amount[index] || 0;

                    return (
                      <tr key={index}>
                        <td className="text-center py-2">
                          <a onClick={() => removeRowById(index)} href="#" className="text-red-600 hover:bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </a>
                        </td>
                        <td className="text-center py-2">{bar.barcode}</td>
                        <td className="text-center py-2">{bar.id_gift ? bar.id_gift.gift_name : 'N/A'}</td>
                        <td className="text-center py-2">{bar.cus_sellprice > 0 ? bar.cus_sellprice : 'N/A'}</td>
                        {visibleaccount === true && (
                        <td className="text-center py-2">{excessgiftprice > 0 ? excessgiftprice : 'N/A'}</td>
                        )}
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
              onClick={id ? handleUpdate : handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddGiftIssued;