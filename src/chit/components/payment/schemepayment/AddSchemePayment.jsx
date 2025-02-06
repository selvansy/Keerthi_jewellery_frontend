import React, { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { CalendarDays, Search, ChevronDown, ChevronUp } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';
import { addschemeaccount, schemepaymenttodayrate, searchmobileschemeaccount, getschemeaccountbyid, getschemeById, updateschemepayment, extendinstallment, addcloseSchemeAccount, revertschemeAccount, schemeaccountbyid, getallbranchscheme, getallbranchclassification, getemployeebybranch,getallbranch, getallpaymentmode } from '../../../api/Endpoints'

const AddSchemePayment = () => {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const navigate = useNavigate();
  const location = useLocation();
  const todaydate = new Date();
  const formattedDate = todaydate;
  const { id } = useParams(); 
  const [date_payment, setStartDate] = useState(formattedDate);
  const [maturity_date, setMaturityDate] = useState('');
  const [searchmobile, setSearchMobile] = useState('');
  const [mobile, setMobile] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [branchfilter, setBranch] = useState([]);
  const [paymentmode, setPaymentmode] = useState([]);
  const [errors, setErrors] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [schemedata, setSchemeData] = useState([]);
  const [customerdata, setCustomerData] = useState({});
  const [selectedId, setSelectedId] = useState("");
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [ispayamtDisabled, setIspayamtDisabled] = useState(true);
  const [paymentamount, setPaymentAmount] = useState(0);
  const [metal_rate, setMetalRate] = useState(0);
  const [fine_amount, setFineAmount] = useState(0);
  useEffect(() => {
    if (id) {
      handlepaymentbyid({ id: id });
    }
  }, [id])


  const handlepaymentbyid = async (data) => {
    if (!data) return;
    const response = await getpaymentbyid(data);
    if (response) {

      if (response.data.scheme_type === 6) {
        setIspayable(true);
      } else {
        setIspayable(false);
      }

      handleClassifyChange(response.data.id_branch._id);
      handleemployeebyBranch(response.data.id_branch._id);
      getemployeebyBranch(response.data.id_branch._id);
      handlebranchscheme(response.data.id_branch._id);

      setFormData({
        id: response.data._id,
        payment_amount: response.data._id,
        payment_mode: response.data._id,
        itr_utr: response.data._id,
        remark: response.data._id,
        total_amt: response.data._id,
        fine_amount: response.data._id,
        buy_gst: response.data._id,
        id_scheme_account: response.data._id
      });
      setMobile(response.data.id_customer.mobile);
      handleStartDateChange(response.data.date_payment);

    } else {
      toast.error('Customer not created!');
    }
  };

  const [formData, setFormData] = React.useState({
    id_customer: '',
    mobile: '',
    date_payment: date_payment,
    payment_mode: '',
    itr_utr: '',
    remark: '',
    scheme_acc_number: '',
    id_scheme: '',
    id_branch: '',
    id_scheme_account: '',
    scheme_type: 0,
    buy_gst: 0,
    fine_amount: 0,
    total_amt: 0,
    payment_amount: 0,
    metal_rate: 0,
    metal_weight: 0,
    accountschemeid:'',
    total_installments: 1,
    maturity_date: maturity_date,
    id_classification:'',
  });

  const handleSearchmobile = () => {
    setSearchError('');
    if (mobile === "") { toast.error('Mobile Number is required!'); }
  
    handlesearchschemeaccount({ search_mobile: mobile });
  };


  const { mutate: handlesearchschemeaccount } = useMutation({
    mutationFn: searchmobileschemeaccount,
    onSuccess: (response) => {
      if (response) {
        setSelectedScheme(null);
        setFormData({
          id_customer: '',
          date_payment: date_payment,
          payment_mode: '',
          itr_utr: '',
          remark: '',
          scheme_acc_number: '',
          id_scheme: '',
          id_scheme_account: '',
          scheme_type: 0,
          buy_gst: 0,
          fine_amount: 0,
          total_amt: 0,
          payment_amount: 0,
          metal_rate: 0,
          metal_weight: 0,
          accountschemeid:'',
        
          total_installments: 1,
          maturity_date: maturity_date,
          id_classification:'',
        });
        var customerlist = response.data.customerlist;
        var schemelist = response.data.schemelist;
        setCustomerData({
          id_customer: customerlist._id,
          mobile: customerlist.mobile,
          address: customerlist.address,
          customer_name: customerlist.firstname + ' ' + customerlist.lastname
        });
        setSchemeData(schemelist);
console.log({ ...prev, id_customer: customerlist._id,mobile:customerlist.mobile });
        setFormData(prev => ({ ...prev, id_customer: customerlist._id,mobile:customerlist.mobile }));


        toast.success(response.message)
      }

    },
  });

  const handleautocompletemobile = (e) => {
    const value = e.target.value;
    setMobile(value);
    setSearchMobile(value);
    if (formData.id_branch === "") {
      toast.error("Branch Id is required!")
    }
    if (value.length > 0) {
      handleautosearchmobile({ searchTerm: value });
    } else {
      setSuggestions([]);
    }


  };


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

  const { mutate: getallbranchMutate } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      if (response) {
        setBranch(response.data);
      }
    },
  });


  const { mutate: getallpaymentmodeMutate } = useMutation({
    mutationFn: getallpaymentmode,
    onSuccess: (response) => {
      if (response) {
        setPaymentmode(response.data);
      }
    },
  });


  const { mutate: schemepaymenttodayrateMutate } = useMutation({
    mutationFn: schemepaymenttodayrate,
    onSuccess: (response) => {
      if(response.data) {
        console.log("scheme",selectedScheme);
        console.log(response.data);

console.log("Purity--",selectedScheme.id_purity)
let metalRate = 0;
        if (parseInt(selectedScheme.id_metal) === 1) { // Gold
          switch (parseInt(selectedScheme.id_purity)) {

            case 1:
              metalRate = response.data.goldrate_24ct;
              break;
            case 2:
              metalRate = response.data.goldrate_22ct;
              break;
            case 3:
              metalRate = response.data.goldrate_20ct;
              break;
            case 4:
              metalRate = response.data.goldrate_18ct;
              break;
          }
        } else if (parseInt(selectedScheme.id_metal) === 2) { // Silver
          metalRate = response.data.silverrate_1gm;
        } else if (parseInt(selectedScheme.id_metal) === 3) { // Diamond
          metalRate = response.data.diamond_1gm;
        } else if (parseInt(selectedScheme.id_metal) === 4) { // Platinum
          metalRate = response.data.platinum_1gm;
        } else if (parseInt(selectedScheme.id_metal) === 5) { // Coin
          metalRate = response.data.goldcoin_1gm;
        }
   
        setMetalRate(metalRate)
        setFormData(prev => ({ ...prev, metal_rate: metalRate }));

        calculatepayment();
      }
    },
  });

  useEffect(() => {
    getallbranchMutate();
    getallpaymentmodeMutate();
    //schemepaymenttodayrateMutate({date_payment:date_payment});
  }, []);



  const handleDatePaymentChange = (date) => {
    console.log("------", date);
    if (!date) { return }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so add 1)
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day

    // Format to YYYY-MM-DD
    const formattedDate = `${year}-${month}-${day}`;

    setDatePayment(formattedDate);
    setFormData(prev => ({ ...prev, date_payment: formattedDate }));
    schemepaymenttodayrateMutate({ date_payment: formattedDate});

  };




  const filterInputchange = (e) => {
    let total = 0;
    const { name, value } = e.target;
    if (name === "payment_amount") {
      setPaymentAmount(value);
      calculatepayment(metal_rate);
    } else if (name === "metal_rate") {
      setMetalRate(value);
    } else if (name === "fine_amount") {
      setFineAmount(value);
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));


    isValidForm();
  };

  const calculatepayment = () => {
    let total_amt = 0;
    let gstAmount = 0;
    let metalweight = 0;
    if (parseInt(selectedScheme.buy_gst) > 0) {
      gstAmount = (parseFloat(paymentamount) * parseFloat(selectedScheme.buy_gst)) / 100;
    }

    if (selectedScheme.scheme_type === 3) {
      total_amt = parseFloat(paymentamount) + parseFloat(gstAmount) + parseFloat(fine_amount);
      let calc1 = paymentamount * 1000;
      let calc2 = metal_rate / 1000;
      total_amt = calc1 * calc2;

    } else {
      metalweight = parseFloat(metal_rate) / parseFloat(paymentamount);
      total_amt = parseFloat(paymentamount) + parseFloat(gstAmount) + parseFloat(fine_amount);

    }



    let metal_weight = metalweight.toFixed(3);
    setFormData(prev => ({
      ...prev, metal_weight: metal_weight, total_amt: total_amt, buy_gst: gstAmount
    }));

  };

  const handleschemebyid = async (data) => {
    if (!data) return;
    const response = await getschemeById(data);
    if (response) {
      if (response.data.scheme_type === 6) {
        setIspayable(true);
      } else {
        setIspayable(false);
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

  const handleDropdownChange = (event) => {
    const id = event.target.value;
    setSelectedId(id);
    const scheme = schemedata.find(
      (scheme) => scheme.id_scheme_account === id
    );  
    setErrors(null);
    if (scheme) {
      setSelectedScheme(scheme);
      setFormData(prev => ({ ...prev, 
        scheme_acc_number: scheme.scheme_acc_number,
        accountschemeid:scheme.accountschemeid,
        id_scheme:scheme.id_scheme,
        id_classification:scheme.id_classification,
        id_scheme_account:scheme.id_scheme_account,
        code:scheme.code}));
      setIdschemeaccount(scheme.id_scheme_account);
      setPaymentAmount(scheme.amount);

      if (scheme.scheme_type === 3) {
        setFormData(prev => ({ ...prev, payment_amount: scheme.min_weight }));
        setIspayamtDisabled(false)
      } else if (scheme.scheme_type === 4 || scheme.scheme_type === 5 || scheme.scheme_type === 7 || scheme.scheme_type === 8 || scheme.scheme_type === 9 || scheme.scheme_type === 10) {
        setFormData(prev => ({ ...prev, payment_amount: scheme.min_amount }));
        setIspayamtDisabled(false)
      } else {
        setFormData(prev => ({ ...prev, payment_amount: scheme.amount }));
        setIspayamtDisabled(true)
      }
 
    } else {
      const todaydate = new Date();
      const formattedDate = new Intl.DateTimeFormat('en-CA').format(todaydate);
      setFormData({
        date_payment:formattedDate,
        payment_mode: '',
        itr_utr: '',
        remark: '',
        scheme_acc_number: '',
        id_scheme: '',
        id_scheme_account: '',
        scheme_type: '',
        buy_gst: 0,
        fine_amount: 0,
        total_amt: 0,
        payment_amount: 0,
        metal_weight: 0,
        accountschemeid:'',
      
        total_installments: 1,
        maturity_date: maturity_date,
        id_classification:'',
      });
      console.log(formattedDate);
      setStartDate(formattedDate);
    }

    
  
    schemepaymenttodayrateMutate({ date_payment: date_payment});
    
    handleStartDateChange(date_payment);
    isValidForm()

  };

  const handleemployeebyBranch = async (id_branch) => {
    if (!id_branch) return;
    const response = await getemployeebyBranch({ "id_branch": id_branch });
    if (response) {
      setEmployee(response.data);
    }
  };

  const handlebranchscheme = async (id_branch) => {
    if (!id_branch) return;
    const response = await getallbranchscheme({ "id_branch": id_branch });
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
    if (location.pathname === '/customer/schemeaccount/add') {
      setHeader('Add Scheme Account')
      setReturnRoute('/customer/schemeaccount')
    } else if (location.pathname === '/customer/digigold/add') {
      setHeader('Add Digi Gold Account')
      setReturnRoute('/customer/digigold')
    }
  }, [location.pathname])

  const handleCancel = () => {
    navigate('/schemeaccount')
  }

  const handleAddCustomer = () => {
    navigate('/customer/add')
  }

  const handleStartDateChange = (date) => {
    const start = new Date(date);
    start.setMonth(start.getMonth() + formData.maturity_month);
    const day = String(start.getDate()).padStart(2, '0');
    const month = String(start.getMonth() + 1).padStart(2, '0');
    const year = start.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    setMaturityDate(formattedDate);
    setFormData(prev => ({ ...prev, maturity_date: formattedDate }));
  }



  const isValidForm = () => {
    const err = {};



    if (formData.total_amt === '') {
      err['total_amt'] = 'Total Amount is required';
    } else {
      err['total_amt'] = '';
    }

    if (formData.payment_mode === '') {
      err['payment_mode'] = 'Payment Mode is required';
    } else {
      err['payment_mode'] = '';
    }

    if (formData.accountschemeid === '') {
      err['scheme_acc_number'] = 'Scheme Account Number is required';
    } else {
      err['scheme_acc_number'] = '';
    }


    if (formData.payment_receipt === '') {
      err['payment_receipt'] = 'Payment Receipt is required';
    } else {
      err['payment_receipt'] = '';
    }



    if (formData.id_scheme_account === '') {
      err['id_scheme_account'] = 'Scheme Account is required';
    } else {
      err['id_scheme_account'] = '';
    }

    if (formData.date_payment === '') {
      err['date_payment'] = 'Start Date is required';
    } else {
      err['date_payment'] = '';
    }
    if (formData.metal_rate === '') {
      err['metal_rate'] = 'Metal Rate is required';
    } else {
      err['metal_rate'] = '';
    }

    if (selectedScheme.scheme_type === 4 || selectedScheme.scheme_type === 5 || selectedScheme.scheme_type === 7 || selectedScheme.scheme_type === 8 || selectedScheme.scheme_type === 9 || selectedScheme.scheme_type === 10) {
      if (formData.payment_amount < selectedScheme.min_amount) {
        err['payment_amount'] = 'Allowed Limit Minimum Amount Rs.', selectedScheme.min_amount;
      } else if (formData.payment_amount > selectedScheme.max_amount) {
        err['payment_amount'] = 'Allowed Limit Maximum Amount Rs.', selectedScheme.max_amount;
      } else if (formData.payment_amount === '') {
        err['payment_amount'] = 'Payment Aount is required';
      } else {
        err['payment_amount'] = '';
      }
      if (selectedScheme.scheme_type === 2 || selectedScheme.scheme_type === 5 || selectedScheme.scheme_type === 6 || selectedScheme.scheme_type === 10) {
        if (formData.metal_weight === '') {
          err['metal_weight'] = 'Metal Weight is required';
        } else {
          err['metal_weight'] = '';
        }
      }
    } else if (selectedScheme.scheme_type === 3) {
      if (formData.payment_amount < selectedScheme.min_weight) {
        err['payment_amount'] = 'Allowed Limit Minimum Weight Rs.', selectedScheme.min_weight;
      } else if (formData.payment_amount > selectedScheme.max_weight) {
        err['payment_amount'] = 'Allowed Limit Maximum Weight Rs.', selectedScheme.max_weight;
      } else if (formData.payment_amount === '') {
        err['payment_amount'] = 'Payment Weight is required';
      } else {
        err['payment_amount'] = '';
      }
    } else {
      if (formData.payment_amount === '') {
        err['payment_amount'] = 'Payment Amount is required';
      } else {
        err['payment_amount'] = '';
      }
    }

    if (formData.maturity_date === '') {
      err['maturity_date'] = 'Maturity Date is required';
    } else {
      err['maturity_date'] = '';
    }
console.log(err);
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
     

      if (formData.id_customer === "") {
        toast.error('Customer Id is Required!');
        return
      } else if (formData.id_branch === "") {
        toast.error('Branch Id is Required!');
        return
      } else if (formData.mobile === "") {
        toast.error('Mobile is Required!');
        return
      } else if (selectedScheme.id_scheme === "") {
        toast.error('Scheme Id is Required!');
        return
      } else if (selectedScheme.scheme_type === "") {
        toast.error('Scheme Id is Required!');
        return
      } else if (selectedScheme.maturity_date === "") {
        toast.error('Scheme Id is Required!');
        return
      } else if (selectedScheme.id_classification === "") {
        toast.error('Classification Id is Required!');
        return
      } else if (selectedScheme.id_scheme === "") {
        toast.error('Scheme Id is Required!');
        return
      }
      setErrors({id_scheme:'',});
      console.log("hi",id);
      if (!id) {
        createschemepaymentmutate(formData);
      } else {
        updateschemepaymentmutate(formData);
      }

    } else {
      console.log("Form has validation errors. Please correct them.");
    }
  };
  const { mutate: createschemepaymentmutate } = useMutation({
    mutationFn: addschemeaccount,
    onSuccess: (response) => {
      toast.success(response.message)
      navigate('/schemepayment')
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    }
  });

  const { mutate: updateschemepaymentmutate } = useMutation({
    mutationFn: updateschemepayment,
    onSuccess: (response) => {
      toast.success(response.message);
      navigate('/schemepayment');
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    }
  });

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };



  return (
    <>
      <div className='flex flex-row justify-between'>
        <h2 className='text-2xl text-[#023453] font-bold justify-between'>Scheme Payment</h2>
      </div>
      <form onSubmit={onSubmit}>
        <div className='w-full flex flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]'>


          <div className='flex flex-col p-8 bg-white'>
            <div className='space-y-6'>
              <h2 className='text-xl font-medium mb-4'>Customer Details</h2>
              <div className='flex flex-col lg:flex-row w-full justify-between'>
                <div className='lg:w-1/2 w-full'>
                  <div className='grid grid-cols-1 gap-4 lg:pr-2'>
                    <div className='flex flex-col'>
                      <label className='text-black mb-2 font-normal'>Branch<span className='text-red-400'> *</span></label>
                      <div className="relative">
                        <select
                          name='id_branch'
                          value={formData.id_branch}
                          onChange={(e) => { filterInputchange(e); }}
                          className='appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                          defaultValue=''
                        >
                          <option value=''>--Select--</option>
                          {branchfilter.map((branch) => (
                            <option key={branch._id} value={branch._id}>
                              {branch.branch_name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                            <path d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col relative'>
                      <label className='text-black mb-2 font-normal'>Search Mobile Number<span className='text-red-400'>*</span></label>
                      <input
                        type='text'
                        value={mobile}
                        onChange={handleautocompletemobile}
                        className='border-2 border-gray-300 rounded-md p-2 lg:w-[87%] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                        placeholder='Search Mobile Number'
                      />


                      {/* Suggestions dropdown */}
                      {suggestions.length > 0 && (
                        <ul className="absolute bg-white border-2 border-gray-300 rounded-md p-2 lg:w-[87%] mt-[74px] max-h-40 overflow-auto z-10 automargin">
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


                      <div onClick={handleSearchmobile} className="absolute flex items-center justify-center 
                        right-[0%] rounded-r-lg top-[70%] -translate-y-1/2
                        w-10 h-[60%]
                       
                        sm:right-0
                        sm:top-[68%]
                        sm:rounded-r-lg
                        md:right-[0%]
                        md:rounded-r-lg
                        md:top-[71%]
                        lg:rounded-lg
                        cursor-pointer
                        lg:right-[-1%]">
                        <Search size={20} className="text-white" />
                      </div>
                    </div>
                    <div className='lg:hidden'>
                      <div
                        className='flex justify-between items-center cursor-pointer'
                        onClick={toggleAccordion}
                      >
                        <label className='text-black mb-2 font-normal'>Scheme Details<span className='text-red-400'>*</span></label>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      {isExpanded && (
                        <div className='lg:w-1/2 w-full items-center justify-center lg:pl-10 lg:pr-10'>
                          <div className='bg-[#F8F9FA] lg:w-full rounded-lg flex flex-col p-4 lg:h-full'>
                            <h2 class="text-xl font-bold text-[#023453] mb-4 text-center">Scheme Details</h2>
                            <div>
                              <div class="flex justify-between py-1">
                                <span class="text-gray-600">Joined On</span>
                                <span class="text-gray-900">2024-12-12 15:52:55</span>
                              </div>

                              <div class="flex justify-between py-1">
                                <span class="text-gray-600">A/C Name</span>
                                <span class="text-gray-900">Arun</span>
                              </div>

                              <div class="flex justify-between py-1">
                                <span class="text-gray-600">Last Paid Date</span>
                                <span class="text-gray-900">12-12-2024</span>
                              </div>

                              <div class="flex justify-between py-1">
                                <span class="text-gray-600">Last Paid Installment</span>
                                <span class="text-gray-900">1</span>
                              </div>

                              <div class="flex justify-between py-1">
                                <span class="text-gray-600">Last Paid Amount</span>
                                <span class="text-green-500">₹200.00</span>
                              </div>

                              <div class="flex justify-between py-1">
                                <span class="text-gray-600">No of Gift Issues</span>
                                <span class="text-gray-900">0</span>
                              </div>

                              <div class="flex justify-between py-1">
                                <span class="text-gray-600">Scheme Type</span>
                                <span class="text-gray-900">2024-12-12 15:52:55</span>
                              </div>

                              <div class="flex justify-between py-1">
                                <span class="text-gray-600">Scheme A/C No</span>
                                <span class="text-gray-900">Arun</span>
                              </div>

                              <div class="flex justify-between py-1">
                                <span class="text-gray-600">Total Paid Installment</span>
                                <span class="text-gray-900">12-12-2024</span>
                              </div>

                              <div class="flex justify-between py-1">
                                <span class="text-gray-600">Total Paid Amount</span>
                                <span class="text-green-500">₹200.00</span>
                              </div>

                              <div class="flex justify-between py-1">
                                <span class="text-gray-600">Total Metal Weight</span>
                                <span class="text-gray-900">0.541Grm</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className='flex flex-col'>
                      <label className='text-black mb-2 font-normal'>Scheme Account<span className='text-red-400'> *</span></label>
                      <div className="relative">
                        <select
                          name='id_scheme_account'
                          value={selectedId}
                          onChange={handleDropdownChange}
                          className='appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                          defaultValue=''
                        >
                          <option value=''>--Select--</option>
                          {schemedata.map((account) => (
                            <option key={account._id} value={account.id_scheme_account}>
                              {account.scheme_name}
                            </option>
                          ))}
                        </select>
                        <p style={{ color: "red" }}>{errors?.id_scheme_account}</p>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                            <path d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col w-full'>
                      <label className='text-black mb-2 font-normal'>Payment Date<span className='text-red-400'>*</span></label>
                      <div className="relative">
                        <DatePicker
                          name='date_payment'
                          selected={formData.date_payment}
                          onChange={handleDatePaymentChange}
                          dateFormat="dd-MM-yyyy"
                          placeholderText="Select Date"
                          className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          wrapperClassName="w-full"
                        />
                        <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center pointer-events-none">
                          <CalendarDays size={20} />
                        </span>
                      </div>
                    </div>
                    <div className='flex flex-col'>
                      <label className='text-black mb-2 font-normal'>Today Rate<span className='text-red-400'>*</span></label>
                      <input
                        name='metal_rate'
                        value={formData.metal_rate}
                        onChange={(e) => { filterInputchange(e); }}
                        type='text'
                        className='border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                        placeholder=''
                      />
                      <p style={{ color: "red" }}>{errors?.metal_rate}</p>
                    </div>
                    <div className='flex flex-col'>
                      <label className='text-black mb-2 font-normal'>Receipt<span className='text-red-400'>*</span></label>
                      <input
                        name='payment_receipt'
                        value={formData.payment_receipt}
                        onChange={(e) => { filterInputchange(e); }}
                        type='text'
                        className='border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                        placeholder=''
                      />
                      <p style={{ color: "red" }}>{errors?.payment_receipt}</p>
                    </div>
                    <div className='flex flex-col'>
                      <label className='text-black mb-2 font-normal'>Account Number<span className='text-red-400'>*</span></label>
                      <div className="relative">
                      <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md" 
                      style={{ backgroundColor: layout_color }} >{formData.accountschemeid ? formData.code : "N/A"}</span>
                      <input
                        name='accountschemeid'
                        value={formData.accountschemeid}
                        onChange={(e) => { filterInputchange(e); }}
                        type='text'
                        className='border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                        placeholder=''
                      />
                    </div>

                    <p style={{ color: "red" }}>{errors?.accountschemeid}</p>
                  </div>
                </div>
              </div>
              <div className='lg:w-1/2 w-full items-center justify-center lg:pl-10 lg:pr-10'>
                <div className='bg-[#F8F9FA] lg:w-full rounded-lg flex-col p-4 lg:h-full hidden lg:block shadow-md'>
                  <h2 class="text-xl font-bold text-[#023453] mb-4 text-center">Scheme Details</h2>
                  <div>
                    <div class="flex justify-between py-1">
                      <span class="text-gray-600">Customer Name</span>
                      <span class="text-gray-900">{customerdata.customer_name || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between py-1">
                      <span class="text-gray-600">Address</span>
                      <span class="text-gray-900">{customerdata.address || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between py-1">
                      <span class="text-gray-600">Joined On</span>
                      <span class="text-gray-900">{selectedScheme?.start_date || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between py-1">
                      <span class="text-gray-600">Joined On</span>
                      <span class="text-gray-900">{selectedScheme?.start_date || 'N/A'}</span>
                    </div>

                    <div class="flex justify-between py-1">
                      <span class="text-gray-600">A/C Name</span>
                      <span class="text-gray-900">{selectedScheme?.account_name || 'N/A'}</span>
                    </div>

                    <div class="flex justify-between py-1">
                      <span class="text-gray-600">Scheme A/C No</span>
                      <span class="text-gray-900">{selectedScheme?.scheme_acc_number || 'N/A'}</span>
                    </div>

                    <div class="flex justify-between py-1">
                      <span class="text-gray-600">No of Gift Issues</span>
                      <span class="text-gray-900">{selectedScheme?.gift_issues || '0'}</span>
                    </div>

                    <div class="flex justify-between py-1">
                      <span class="text-gray-600">Scheme Type</span>
                      <span class="text-gray-900">{selectedScheme?.scheme_typename || 'N/A'}</span>
                    </div>


                    <div class="flex justify-between py-1">
                      <span class="text-gray-600">Last Paid Date</span>
                      <span class="text-gray-900">{selectedScheme?.last_paid_date || '0000-00-00'}</span>
                    </div>

                    <div class="flex justify-between py-1">
                      <span class="text-gray-600">Last Paid Installment</span>
                      <span class="text-gray-900">{selectedScheme?.last_paid_installment || '0'}</span>
                    </div>

                    <div class="flex justify-between py-1">
                      <span class="text-gray-600">Last Paid Amount</span>
                      <span class="text-green-500">{selectedScheme?.last_paid_amount || '0.00'}</span>
                    </div>
                    <div class="flex justify-between py-1">
                      <span class="text-gray-600">Last Paid Weight</span>
                      <span class="text-green-500">{selectedScheme?.last_paid_weight || '0.00'}</span>
                    </div>
                    <div class="flex justify-between py-1">
                      <span class="text-gray-600">Total Paid Installment</span>
                      <span class="text-gray-900">{selectedScheme?.total_paidinstallments || '0'}</span>
                    </div>

                    <div class="flex justify-between py-1">
                      <span class="text-gray-600">Total Paid Amount</span>
                      <span class="text-green-500">{selectedScheme?.total_paidamount || '0.00'}</span>
                    </div>

                    <div class="flex justify-between py-1">
                      <span class="text-gray-600">Total Metal Weight</span>
                      <span class="text-gray-900">{selectedScheme?.total_weight || '0.00'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className='text-xl font-medium mb-4'>Scheme Account Details</h2>
              <div className='grid md:grid-cols-2 gap-6'>

                <div className='flex flex-col'>
                  <label className='text-black mb-2 font-normal'>Payment Amount<span className='text-red-400'>*</span></label>
                  <div className="relative">
                    <input
                      type='number'
                      disabled={ispayamtDisabled}
                      name='payment_amount'
                      value={formData.payment_amount}
                      min='0'
                      onChange={(e) => { filterInputchange(e); }}
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                          e.preventDefault();
                        }
                      }}
                      className='border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                      placeholder='Enter here'
                    />

                    <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                    style={{ backgroundColor: layout_color }}>INR</span>
                  </div>
                  <p style={{ color: "red" }}>{errors?.payment_amount}</p>
                </div>
                <div className='flex flex-col'>
                  <label className='text-black mb-2 font-normal'>GST<span className='text-red-400'> *</span></label>
                  <div className="relative">
                    <input
                      disabled
                      type='number'
                      name='gst'
                      value={formData.gst}
                      min='0'
                      onChange={(e) => { filterInputchange(e); }}
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                          e.preventDefault();
                        }
                      }}
                      className='border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                      placeholder='Enter here'
                    />
                    <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                    style={{ backgroundColor: layout_color }}>INR</span>
                  </div>
                </div>
                <div className='flex flex-col'>
                  <label className='text-black mb-2 font-normal'>Fine Amount<span className='text-red-400'>*</span></label>
                  <div className="relative">
                    <input
                      type='number'
                      disabled
                      name='fine_amount'
                      value={formData.fine_amount}
                      onChange={(e) => { filterInputchange(e); }}
                      min='0'
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                          e.preventDefault();
                        }
                      }}
                      className='border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                      placeholder='Enter here'
                    />
                    <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                    style={{ backgroundColor: layout_color }}>INR</span>
                  </div>
                </div>
                <div className='flex flex-col'>
                  <label className='text-black mb-2 font-normal'>Total Amount<span className='text-red-400'>*</span></label>
                  <div className="relative">
                    <input
                      type='number'
                      name='total_amt'
                      value={formData.total_amt}
                      min='0'
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                          e.preventDefault();
                        }
                      }}
                      className='border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                      placeholder='Enter here'
                    />

                    <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                    style={{ backgroundColor: layout_color }}>INR</span>
                  </div>
                  <p style={{ color: "red" }}>{errors?.total_amt}</p>
                </div>
                <div className='flex flex-col'>
                  <label className='text-black mb-2 font-normal'>Saved Weight<span className='text-red-400'>*</span></label>
                  <div className="relative">
                    <input
                      type='number'
                      disabled
                      name='metal_weight'
                      value={formData.metal_weight}

                      min='0'
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                          e.preventDefault();
                        }
                      }}
                      className='border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                      placeholder='Enter here'
                    />
                    <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                    style={{ backgroundColor: layout_color }}>INR</span>
                  </div>
                </div>
                <div className='flex flex-col'>
                  <label className='text-black mb-2 font-normal'>Payment Mode<span className='text-red-400'> *</span></label>
                  <div className="relative">
                    <select name='payment_mode' onChange={(e) => { filterInputchange(e); }} value={formData.payment_mode} className='appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                      <option value='' >--Select--</option>
                      {paymentmode.map((mode) => (
                        <option key={mode._id} value={mode._id}>{mode.mode_name}</option>
                      )
                      )}
                    </select>
                    <p style={{ color: "red" }}>{errors?.payment_mode}</p>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col'>
                  <label className='text-black mb-2 font-normal'>ITR/UTR ID</label>
                  <input
                    type='text'
                    name='itr_utr'
                    value={formData.itr_utr}
                    onChange={(e) => { filterInputchange(e); }}
                    className='border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    placeholder='Enter ITR/UTR ID'
                  />
                </div>
              </div>
            </div>

            <div className='grid md:grid-cols-2 gap-4'>
              <div className='flex flex-col'>
                <label className='text-black mb-2 font-normal'>Remarks</label>
                <textarea
                  name='remark'
                  value={formData.remark}
                  onChange={(e) => { filterInputchange(e); }}
                  className='border-2 border-gray-300 rounded-md p-2 min-h-32 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder='Enter Here'
                />
              </div>
            </div>
          </div>

          <div className='border-t-2 border-gray-300 mt-6 pt-4'>
            <div className='flex justify-end gap-4'>
              <button
                className='bg-[#E2E8F0] text-black rounded-md px-6 py-2'
                type='button'
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className='bg-[#61A375] text-white rounded-md px-6 py-2'
                type='submit'
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </form >

    </>
  )
}

export default AddSchemePayment;