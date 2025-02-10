import React, { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { CalendarDays, Search } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';
import { addschemeaccount, searchcustomermobile, geallschemebyclassification, getschemeaccountbyid, getschemeById, updateschemeaccount, extendinstallment, addcloseSchemeAccount, revertschemeAccount, schemeaccountbyid, getallbranchscheme, getallbranchclassification, getemployeebybranch, getallbranch } from '../../../api/Endpoints'
import { useSelector, useDispatch } from 'react-redux';

const AddSchemeAccount = () => {
  let dispatch = useDispatch();
  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_branch = roledata?.branch;

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const navigate = useNavigate();
  const location = useLocation();
  const todaydate = new Date();
  const { id } = useParams()
  const [start_date, setStartDate] = useState(todaydate);
  const [maturity_date, setMaturityDate] = useState('');
  const [maturity_month, setMaturityMonth] = useState(0);
  const [total_installments, setTotalinstallments] = useState(0);
  const [searchmobile, setSearchMobile] = useState('');
  const [mobile, setMobile] = useState('');
  const [searcherror, setSearchError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [branchfilter, setBranch] = useState([]);
  const [header, setHeader] = useState('')
  const [returnRoute, setReturnRoute] = useState('')
  const [isSubmit, setIsSubmit] = useState(false)

  const [classifyfilter, setClassify] = useState([]);
  const [employeefilter, setEmployee] = useState([]);
  const [schemefilter, setScheme] = useState([]);
  const [errors, setErrors] = useState(null);
  const [ispayable, setIspayable] = useState(false);
  const [validamount, setValidAmount] = useState(0);
  const [isaccountno, setIsAccountNo] = useState(0);
  useEffect(() => {
    console.log(id);
    if (id) {
      handleschemeaccountbyid({ id: id });


    }
  }, [id])


  const handleschemeaccountbyid = async (data) => {
    console.log(data);
    if (!data) return;
    const response = await getschemeaccountbyid(data);
    if (response) {

      if (response.data.scheme_type === 6) {
        setIspayable(true);
      } else {
        setIspayable(false);
      }

      handleClassifyChange(response.data.id_branch._id);
      handleemployeebyBranch(response.data.id_branch._id);
      getemployeebybranch(response.data.id_branch._id);
      handleschemebyclassification(response.data.id_scheme.id_classification);

      setFormData({
        id: response.data._id,
        id_scheme: response.data.id_scheme._id,
        scheme_type: response.data.id_scheme.scheme_type,
        total_installments: response.data.id_scheme.total_installments,
        min_amount: response.data.id_scheme.min_amount,
        max_amount: response.data.id_scheme.max_amount,
        min_weight: response.data.id_scheme.min_weight,
        max_weight: response.data.id_scheme.max_weight,
        id_customer: response.data.id_customer._id,
        scheme_acc_number: response.data.scheme_acc_number,
        start_date: response.data.start_date,
        id_classification: response.data.id_classification._id,

        collectionuserid: response.data.collectionuserid,
        id_branch: response.data.id_branch._id,
        account_name: response.data.account_name,
        customer_name: response.data.id_customer.firstname + ' ' + response.data.id_customer.lastname,
        mobile: response.data.id_customer.mobile,
        address: response.data.id_customer.address,
        amount: response.data.amount,
        maturity_month: response.data.id_scheme.maturity_month,
        maturity_date: response.data.maturity_date,
        referral_id: response.data.referral_id,
      });
      setTotalinstallments(response.data.id_scheme.total_installments);
      setMaturityMonth(response.data.id_scheme.maturity_month);
      setMaturityDate(response.data.id_scheme.maturity_date);
      setMobile(response.data.id_customer.mobile);
      console.log(formData);
      handleStartDateChange(response.data.start_date);

    } else {
      toast.error('Customer not created!');
    }
  };
  const [formData, setFormData] = React.useState({
    id_customer: '',
    mobile: '',
    start_date: start_date,
    id_classification: '',
    collectionuserid: '',
    scheme_acc_number: '',
    id_scheme: '',
    id_branch: id_branch,
    account_name: '',
    address: '',
    customer_name: '',
    amount: 0,
    scheme_type: 0,
    min_amount: 0,
    max_amount: 0,
    min_weight: 0,
    max_weight: 0,
    total_installments: total_installments,
    maturity_month: maturity_month,
    maturity_date: maturity_date,
    referral_id: '',
  });

  const handleSearchmobile = () => {
    console.log("hi");
    setSearchError('');
    if (mobile === "") { toast.error('Mobile Number is required!'); }
    handlesearchcustomer({ id_branch: formData.id_branch, search_mobile: mobile });
  };


  const { mutate: handlesearchcustomer } = useMutation({
    mutationFn: searchcustomermobile,
    onSuccess: (response) => {
      if (response) {
        console.log(response);


        setFormData({

          id_customer: response.data._id,
          mobile: response.data.mobile,
          start_date: start_date,
          id_classification: '',
          collectionuserid: '',
          scheme_acc_number: '',
          id_scheme: '',
          id_branch: '',
          account_name: response.data.firstname + ' ' + response.data.lastname,
          address: response.data.address,
          customer_name: response.data.firstname + ' ' + response.data.lastname,
          total_installments: total_installments,
          amount: 0,
          scheme_type: 0,
          min_amount: 0,
          max_amount: 0,
          min_weight: 0,
          max_weight: 0,
          maturity_month: maturity_month,
          maturity_date: maturity_date,
          referral_id: ''
        });

        toast.success(response.message)
      }

    },
  });

  const handleautocompletemobile = (e) => {
    const value = e.target.value;
    setMobile(value);
    // setSearchMobile(value);
    // if (value.length > 0) {
    //   handleautosearchmobile({searchTerm:value});
    // }  else {
    //   setSuggestions([]);
    // }


  };


  // const { mutate: handleautosearchmobile } = useMutation({
  //   mutationFn: searchmobilenoincustomer,
  //   onSuccess: (response) => {

  //   if (response.data > 0) {

  //     const filteredSuggestions = response.data.filter((number) =>
  //       number.includes(searchmobile)
  //     );
  //     setSuggestions(filteredSuggestions);
  //   }


  //   },
  // });

  const { mutate: getallbranchMutate } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      console.log('jut')
      if (response) {
        setBranch(response.data);
      }
    },
  });
  useEffect(() => {
    getallbranchMutate();
  }, []);

  const filterInputchange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formData.scheme_type !== 6) {
      setFormData(prev => ({ ...prev, amount: 0 }));
    }
    console.log(name)
    if (name === "id_branch") {
      if (value !== "") {
        handleClassifyChange(value);
        handleemployeebyBranch(value);
        getemployeebybranch(value);

      }
    }

    if (name === "id_classification") {
      handleschemebyclassification(value);
    }
    console.log(name);
    if (name === 'id_scheme') {
      handleschemebyid(value);
    }
    if (formData.scheme_type === 6) {
      if (name === "amount") {
        const err = {}
        if (parseInt(value) === '') {
          err['amount'] = 'Amount is required';
        } else if (parseInt(formData.min_amount) > parseInt(value)) {
          err['amount'] = 'Minimum Limit amount Rs. ' + parseInt(formData.min_amount);
        } else if (parseInt(formData.max_amount) <= parseInt(value)) {
          err['amount'] = 'Maximum Limit amount Rs. ' + parseInt(formData.max_amount);
        } else {
          err['amount'] = '';
        }
        setErrors((prevState) => ({
          ...prevState,
          ...err,
        }));
      }
    }
    if (formData.scheme_type === 3) {
      if (name === "amount") {
        const err = {}
        if (parseInt(value) === '') {
          err['amount'] = 'Amount is required';
        } else if (parseInt(formData.min_weight) > parseInt(value)) {
          err['amount'] = 'Minimum Limit weight Rs. ' + parseInt(formData.min_weight);
        } else if (parseInt(formData.max_weight) <= parseInt(value)) {
          err['amount'] = 'Maximum Limit weight Rs. ' + parseInt(formData.max_weight);
        } else {
          err['amount'] = '';
        }
        setErrors((prevState) => ({
          ...prevState,
          ...err,
        }));
      }
    }


    isValidForm();
  };


  const handleschemebyid = async (data) => {
    if (!data) return;
    const response = await getschemeById(data);
    if (response) {
      console.log(response.data.scheme_type);
      if (response.data.scheme_type === 6) {
        setIspayable(true);
      } else {
        setIspayable(false);
      }

      if (response.generalsettings) {
        setIsAccountNo(generalsettings.account_number);
      }
      setFormData((prevState) => ({
        ...prevState,
        id_scheme: response.data._id,
        scheme_type: response.data.scheme_type,
        total_installments: response.data.total_installments,
        maturity_month: response.data.maturity_month,
        min_amount: response.data.min_amount,
        max_amount: response.data.max_amount,
        min_weight: response.data.min_weight,
        max_weight: response.data.max_weight
      }));
      handleStartDateChange(todaydate);

    } else {
      toast.error('Customer not created!');
    }
  };

  const handleemployeebyBranch = async (id_branch) => {
    if (!id_branch) return;
    const response = await getemployeebybranch({ "id_branch": id_branch });
    if (response) {
      setEmployee(response.data);
    }
  };

  const handleschemebyclassification = async (id_classification) => {
    console.log("----", id_classification)
    if (!id_classification) return;
    const response = await geallschemebyclassification({ "id_classification": id_classification });
    if (response) {
      setScheme(response.data);


    }
  };

  const handleClassifyChange = async (id_branch) => {
    if (!id_branch) return;
    const response = await getallbranchclassification({ "id_branch": id_branch });
    if (response) {
      setClassify(response.data);
    }
  };

  const handleSelectNumber = (number) => {
    setMobile(number);
    setSuggestions([]); // 
  };


  useEffect(() => {
    if (location.pathname === '/manageaccount/schemeaccount/add') {
      setHeader('Add Scheme Account')
      setReturnRoute('/manageaccount/schemeaccount')
    } else if (location.pathname === '/manageaccount/digigold/add') {
      setHeader('Add Digi Gold Account')
      setReturnRoute('/manageaccount/digigold')
    }
  }, [location.pathname])

  const handleCancel = () => {
    navigate('/manageaccount/schemeaccount')
  }

  const handleAddCustomer = () => {
    navigate('/manageaccount/addcustomer')
  }

  const handleStartDateChange = (date) => {
    setStartDate(date);

    const start = new Date(date);
    start.setMonth(start.getMonth() + formData.maturity_month);


    const day = String(start.getDate()).padStart(2, '0');
    const month = String(start.getMonth() + 1).padStart(2, '0');
    const year = start.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    console.log(formattedDate);

    setMaturityDate(formattedDate);
    setFormData(prev => ({ ...prev, maturity_date: formattedDate }));
  }



  const isValidForm = () => {
    const err = {};


    if (formData.id_branch === 'id_branch') {
      err['id_branch'] = 'Branch is required';
    } else {
      err['id_branch'] = '';
    }

    if (formData.id_classification === '') {
      err['id_classification'] = 'Classification is required';
    } else {
      err['id_classification'] = '';
    }

    if (formData.id_scheme === '') {
      err['id_scheme'] = 'Scheme is required';
    } else {
      err['id_scheme'] = '';
    }

    if (formData.start_date === '') {
      err['start_date'] = 'Start Date is required';
    } else {
      err['start_date'] = '';
    }
    if (formData.account_name === '') {
      err['account_name'] = 'Account Name is required';
    } else {
      err['account_name'] = '';
    }
    if (formData.customer_name === '') {
      err['customer_name'] = 'Customer Name is required';
    } else {
      err['id_branch'] = '';
    }

    if (formData.total_installments === '') {
      err['total_installments'] = 'Total Installment is required';
    } else {
      err['total_installments'] = '';
    }

    if (formData.maturity_month === '') {
      err['maturity_month'] = 'Maturity month is required';
    } else {
      err['maturity_month'] = '';
    }

    if (formData.maturity_date === '') {
      err['maturity_date'] = 'Maturity Date is required';
    } else {
      err['maturity_date'] = '';
    }


    setErrors((prevState) => ({
      ...prevState,
      ...err,
    }));
    const hasErrors = Object.values(err).some((error) => error.length > 0);

    return !hasErrors;
  };
  const onSubmit = (e) => {
    e.preventDefault();

    const formFields = new FormData(e.target);
    const formDataObject = Object.fromEntries(formFields.entries());

    if (isValidForm()) {
      if (id) {
        updateSchemeaccount(formData);
      } else {
        createSchemeaccount(formData);
      }

    } else {
      console.log("Form has validation errors. Please correct them.");
    }
  };
  const { mutate: createSchemeaccount } = useMutation({
    mutationFn: addschemeaccount,
    onSuccess: (response) => {
      console.log(response);
      toast.success(response.message)
      navigate('/manageaccount/schemeaccount')
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    }
  });

  const { mutate: updateSchemeaccount } = useMutation({
    mutationFn: updateschemeaccount,
    onSuccess: (response) => {
      console.log(response);
      toast.success(response.message)
      navigate('/manageaccount/schemeaccount')
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    }
  });


  return (
    <>
      <div className='flex flex-row justify-between'>
        <h2 className='text-2xl text-gray-900 font-bold justify-between'>{header}</h2>
        {/* {header === 'Add Scheme Account' && ( */}
        <button
          className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
          onClick={handleAddCustomer}
          style={{ backgroundColor: layout_color }} >
          + Add Customer
        </button>
        {/* )} */}
      </div>
      <div className='w-full flex flex-col bg-white pl-8 pr-8 pb-4 border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]'>

        <h2 className='text-1xl font-bold mb-4 mt-4'>Customer Details</h2>

        <div className='grid md:grid-cols-2'>

          <div className='flex flex-col'>
            <label className='text-black mb-1 font-normal'>Branch<span className='text-red-400'>*</span></label>
            <div className="relative">
              <select name="id_branch" value={formData.id_branch} onChange={(e) => { filterInputchange(e); }} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                <option value='' >--Select--</option>
                {branchfilter.map((branch) => (
                  <option key={branch._id} value={branch._id}>{branch.branch_name}</option>
                ))
                }
              </select>
              <p style={{ color: "red" }}>{errors?.id_branch}</p>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className='grid mt-2  md:grid-cols-2 gap-5'>


          <div className='flex flex-col mt-2 relative'>
            <label className='text-black mb-1 font-normal'>Search Mobile Number<span className='text-red-400'>*</span></label>
            <input
              type='text'
              value={mobile}
              onChange={handleautocompletemobile}
              className='border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
              placeholder='Enter Here'
            />

            {/* Search Icon */}
            <div onClick={handleSearchmobile} className="absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[68%] -translate-y-1/2 w-10 h-[62%] sm:right-0 sm:top-[68%] sm:rounded-r-lg md:right-[20%] md:rounded-lg lg:rounded-lg lg:right-[0%]"
              style={{ backgroundColor: layout_color }}>
              <Search size={20} className="text-white" />
            </div>
          </div>
        </div>


        <form onSubmit={onSubmit} className='mt-5'>

          <div className='lg:flex lg:flex-col lg:mt-2 md:flex md:flex-col md:mt-2 hidden'></div>
          <div className='flex flex-col'>
            <label className='text-black mb-1 font-normal'>Customer Name<span className='text-red-400'>*</span></label>
            <input
              disabled
              type='text'
              name='customer_name'
              value={formData.customer_name}
              className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
              placeholder=''
            />
            <p style={{ color: "red" }}>{errors?.customer_name}</p>
          </div>
          <div className='flex flex-col'>
            <label className='text-black mb-1 font-normal'>Address</label>
            <input
              disabled
              type='text'
              name='address'
              value={formData.address}
              className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
              placeholder=''
            />
          </div>

          <h2 className='text-1xl font-bold mb-4 mt-4'>Scheme Account Details</h2>
          <div className='grid grid-rows-2 md:grid-cols-2 gap-5'>

            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Scheme Classification<span className='text-red-400'>*</span></label>
              <div className="relative">
                <select name="id_classification" value={formData.id_classification} onChange={(e) => { filterInputchange(e); }} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                  <option value='' >--Select--</option>
                  {classifyfilter.map((classify) => (
                    <option key={classify._id} value={classify._id}>{classify.classification_name}</option>
                  ))
                  }
                </select>
                <p style={{ color: "red" }}>{errors?.id_classification}</p>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Scheme<span className='text-red-400'>*</span></label>
              <div className="relative">
                <select name="id_scheme" value={formData.id_scheme} onChange={filterInputchange} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                  <option value=''>--Select--</option>
                  {schemefilter.map((scheme) => (
                    <option key={scheme._id} value={scheme._id}>
                      {scheme.scheme_name}
                      {scheme.scheme_type === 4 || scheme.scheme_type === 5 || scheme.scheme_type === 6 || scheme.scheme_type === 7 || scheme.scheme_type === 8 || scheme.scheme_type === 9 || scheme.scheme_type === 10 ? ` (Rs. ${scheme.min_amount} - Rs. ${scheme.max_amount})` : ''}
                      {scheme.scheme_type === 3 ? ` (${scheme.min_weight} - ${scheme.max_weight})` : ''}
                      {scheme.scheme_type === 0 || scheme.scheme_type === 1 || scheme.scheme_type === 2 ? ` (Rs. ${scheme.amount})` : ''}
                    </option>
                  ))}
                </select>

                <p style={{ color: "red" }}>{errors?.id_scheme}</p>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Maturity Month<span className='text-red-400'>*</span></label>
              <input
                type='text'
                name='maturity_month'
                value={formData.maturity_month}
                className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                placeholder='Enter Maturity Month'
                disabled
              />
              <p style={{ color: "red" }}>{errors?.maturity_month}</p>
            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Total Installment<span className='text-red-400'>*</span></label>
              <input
                type='text'
                name='total_installments'
                value={formData.total_installments}
                className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                placeholder='Enter Total Installment'
                disabled
              />
              <p style={{ color: "red" }}>{errors?.total_installments}</p>
            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Account Name<span className='text-red-400'>*</span></label>
              <input
                type='text'
                name='account_name'
                value={formData.account_name}
                className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                placeholder='Enter Account Name'
              />
              <p style={{ color: "red" }}>{errors?.account_name}</p>
            </div>
            {parseInt(isaccountno) === 1 && (
              <div className='flex flex-col'>
                <label className='text-black mb-1 font-normal'>Account Number</label>
                <input
                  type='text'
                  name='scheme_acc_number'
                  onChange={(e) => { filterInputchange(e); }}
                  value={formData.scheme_acc_number}
                  className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder='Enter Account Number'
                />

              </div>
            )}
            <div className='flex flex-col'>
              <label className='text-gray-700 mb-1 font-normal'>Start Date<span className='text-red-400'>*</span></label>
              <div className="relative">
                <DatePicker
                  selected={formData.start_date}
                  onChange={handleStartDateChange}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select Date"
                  className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  wrapperClassName="w-full"
                />
                <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-14 h-[43px] justify-center items-center flex rounded-r-md pointer-events-none">
                  <CalendarDays size={20} />
                </span>
              </div>
              <p style={{ color: "red" }}>{errors?.start_date}</p>
            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Maturity Date<span className='text-red-400'>*</span></label>
              <div className="relative">
                <input
                  type='text'
                  name="maturity_date"
                  value={formData.maturity_date}
                  className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder='Enter Maturity Date'
                  disabled
                />
              </div>
              <p style={{ color: "red" }}>{errors?.maturity_date}</p>
            </div>
            {ispayable === true && (
              <div className='flex flex-col'>
                <label className='text-black mb-1 font-normal'>Payable<span className='text-red-400'>*</span></label>
                <div className="relative">
                  <input
                    type='number'
                    name="amount"
                    value={formData.amount}
                    min='1'
                    onChange={filterInputchange}
                    className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    placeholder='Enter Amount'
                  />
                  <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white w-14 h-[43px] justify-center items-center flex rounded-r-md"
                    style={{ backgroundColor: layout_color }}>INR</span>
                </div>
                <p style={{ color: "red" }}>{errors?.amount}</p>
              </div>
            )}
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Referral By</label>
              <div className="relative">
                <select name="referral_id" value={formData.referral_id} onChange={filterInputchange} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                  <option value='' >--Select--</option>
                  {employeefilter.map((employee) => (
                    <option key={employee._id} value={employee._id}>{employee.firstname + " " + employee.lastname}</option>
                  ))
                  }
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Agent Collection By<span className='text-red-400'> *</span></label>
              <div className="relative">
                <select name="collectionuserid" value={formData.collectionuserid} onChange={filterInputchange} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                  <option value='' >--Select--</option>
                  {employeefilter.map((employee) => (
                    <option key={employee._id} value={employee._id}>{employee.firstname + " " + employee.lastname}</option>
                  ))
                  }
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white p-2 border-t-2 border-gray-300 mt-4'>
            <div className='flex justify-end gap-2 mt-3'>
              <button
                className='bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20'
                type='button'
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className='bg-[#61A375] text-white rounded-md p-2 w-full lg:w-20'
                type='submit'
              >
                Submit
              </button>
            </div>
          </div>
        </form>

      </div >

    </>
  )
}

export default AddSchemeAccount;