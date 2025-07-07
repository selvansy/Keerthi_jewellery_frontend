import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query'
import { useSelector, useDispatch } from 'react-redux';
import { printtype, accountnotype,referralcalculation,classifytype,displaytype,receipttype,closeprinttype,addgeneralsetting,generalsettingprojectbranchbyid } from "../../../../api/Endpoints"
import { pagehandler } from '../../../../../redux/clientFormSlice';


const GeneralDetails = ({setIsAddClient, onPageChange, isLoading = false }) => {
  const navigate = useNavigate();
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const currentStep = useSelector((state) => state.clientForm.currentStep);  
  const id = useSelector((state)=>state.clientForm.id_client);
 const aupay_url = useSelector((state) => state.clientForm.aupay_url);
  
  const totalPages = useSelector((state) => state.clientForm.totalSteps);
  const pawn_active=1;
  let dispatch = useDispatch()

  const [errors, setErrors] = useState({});

 
  const [branchData,setBranchData] = useState([]);  
  const [selectedBranch, setSelectedBranch] = useState('');

  const [PrinttypeData, setPrinttypeData] = useState([]);  
  const [selectedPrinttype, setSelectedPrinttype] = useState('');

  const [AccountNoData, setAccountNoData] = useState([]);  
  const [selectedAccountNo, setSelectedAccountNo] = useState('');

  const [ReferralCalcData, setReferralCalcData] = useState([]);  
  const [selectedReferralCalc, setSelectedReferralCalc] = useState('');

  const [ClassifiyTypeData, setClassifiyTypeData] = useState([]);  
  const [selectedClassifiyType, setSelectedClassifiyType] = useState('');

  const [DisplayTypeData, setDisplayTypeData] = useState([]);  
  const [selectedDisplayAgent, setSelectedDisplayAgent] = useState('');

  const [ClosePrintData, setClosePrintData] = useState([]);  
  const [selectedClosePrint, setSelectedClosePrint] = useState('');
  
 
  const [ReceiptTypeData, setReceiptTypeData] = useState([]);  
  const [selectedReceiptType, setSelectedReceiptType] = useState('');
  const id_client = useSelector((state) => state.clientForm.id_client);
  const id_branch = useSelector((state) => state.clientForm.id_branch);
  const id_project = useSelector((state) => state.clientForm.id_project);
 
  const [formData, setFormData] = useState(
    {
      id:'',
      id_branch:id_branch,
      id_client:id_client,
      id_project:id_project,
      print_type: "",
      account_number: "",
      scheme_amount: '',
      display_receiptno: '',
      display_agent: '',
      close_print:1,
      collection_percentage:1,
      referral_calc: "",

    }
);


  useEffect(() => {
    getgeneralprojectbranch();
  }, []);

  const getgeneralprojectbranch = async () => { 
      const response = await generalsettingprojectbranchbyid({id_branch:id_branch,id_project:id_project});
      if(response){
        
        setFormData((prevData) =>({...prevData,
          id:response._id,
          id_branch:response.data.id_branch,
          id_client:response.data.id_client,
          id_project:response.data.id_project,
          print_type: response.data.print_type,
          account_number: response.data.account_number,
          scheme_amount: response.data.scheme_amount,
          display_receiptno: response.data.display_receiptno,
          display_agent: response.data.display_agent,
          close_print: response.data.close_print,
          collection_percentage: response.data.collection_percentage,
          referral_calc: response.data.referral_calc
        }));

        
      }

  }



  const validate = (data) => {
    const errors = {};
    if (!data.id_branch) errors.id_branch = 'Branch Id is required';
    if (!data.print_type) errors.print_type = 'Print Type is  Number';
    if (!data.display_receiptno) errors.display_receiptno = 'Display Receipt Number is required';
    if (!data.close_print) errors.close_print = 'Close print is required';
    if (!data.account_number) errors.account_number = 'Account Number Id is required';
    if (!data.scheme_amount) errors.scheme_amount = 'Display Scheme amount is required';
    if (!data.referral_calc) errors.referral_calc = 'Referral calculation is required';
    if (!data.account_number) errors.account_number = 'Display weight is required';
    if (!data.display_agent) errors.display_agent = 'Display Agent is required';
    if (!data.collection_percentage) errors.collection_percentage = 'Agent Collection Percentage is required';
   
    ;
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const parsedValue = 
    !isNaN(value) && name !== 'id_branch' && name !== 'id_client' && name !== 'id_project'
      ? Number(value) 
      : value;  
  
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", 
    }));
  
  
    setFormData((prevState) => ({
      ...prevState,
      [name]: parsedValue,
    }));
  };
  

  
  useEffect(() => {
    getAllPrinttype();
    getallaccountnotype();
    getreferralcalculation();
    getallclassifytype();
    getdisplaytype();
    getallreceipttype();
    getallcloseprinttype();
  }, []);


    //Get all Printtype
    const getAllPrinttype = async () => {
      try {
        const res = await printtype();
        setPrinttypeData(res.data);
        
      } catch (error) {
        
      }
    }


    //Get all Account No
    const getallaccountnotype = async () => {
    try {
      const res = await accountnotype();
     
      setAccountNoData(res.data);
      
    } catch (error) {
      
    }
  }
   //Get all Classification Type
   const getallclassifytype = async () => {
    try {
      const res = await classifytype();
      
      setClassifiyTypeData(res.data);
      
    } catch (error) {
      
    }
  }


   //Get all Referral Calculation
   const getreferralcalculation = async () => {
    try {
      const res = await referralcalculation();
     
      setReferralCalcData(res.data);
      
    } catch (error) {
      
    }
  }

  
   //Get all Display Type
   const getdisplaytype = async () => {
    try {
      const res = await displaytype();
     
      setDisplayTypeData(res.data);
      
    } catch (error) {
      
    }
  }
  
   //Get all Display Type
   const getallreceipttype = async () => {
    try {
      const res = await receipttype();
      
      setReceiptTypeData(res.data);
      
    } catch (error) {
      
    }
  }

    //Get all close print type
    const getallcloseprinttype = async () => {
      try {
        const res = await closeprinttype();
     
        setClosePrintData(res.data);
        
      } catch (error) {
        
      }
    }



    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const validationErrors = validate(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    
      try { 
        
        addgeneralsettingmutate(formData);           
         // Call another API using fetch
          fetch(`${aupay_url}/api/admin/generalsetting`, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          }) .then((response) => response.json())
          .then((data) => {
            ;
          })
          .catch((error) => {
            console.error('Error with another API call:', error);
            toast.error('Error with another API call');
          });
          
      } catch (error) {
        // Extract error message from the response or use a default
        const errorMessage = error.response?.data?.message || 'An error occurred while adding general details.';
        toast.error(errorMessage);
        console.error('Error adding general setting details:', error);
      }
    };
    const {mutate: addgeneralsettingmutate } = useMutation({
      mutationFn: addgeneralsetting,
      onSuccess: (response) => {
        ;
        toast.success(response.message)
        setFormData(formData);
        dispatch(pagehandler(currentStep + 1));  
      },
      onError: (error) => {
        toast.error(error.response.data.message)
      }
    });
    const handleCancel = (type) => {
      if(type === "back"){
        dispatch(pagehandler(currentStep - 1))    
        setIsAddClient(false);
      } else {    
       setIsAddClient(false);
       navigate("/superadmin/aupayconfigure");  
      }  
  };
  
  return (
    <>
      <div className="flex  w-full  flex-col  bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide">
        <div>
        
          <form  className='flex w-full  flex-col pl-8 pr-8 pb-4 bg-white' onSubmit={handleSubmit}>
            <div className="mb-8">
              <h2 className="text-1xl font-bold mb-4 mt-4">General Details</h2>
              <div className="grid grid-rows-2 md:grid-cols-2 gap-4">
                <div className='flex flex-col gap-2'>
                  <label className='text-gray-700 font-medium'>Print Type<span className='text-red-400'>*</span></label>
                  <div className="relative">
                    <select
                      name='print_type'
                      value={formData.print_type}
                      onChange={handleChange}
                      className='appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    >
                      <option value='' readOnly>--Select--</option>
                      {PrinttypeData.map((printtype) => (
                        <option key={printtype.id} value={printtype.id}>
                          {printtype.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  { errors.print_type && <span className="text-red-500 text-sm mt-1">{errors.print_type}</span>}
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='text-gray-700 font-medium'>Receipt Type  <span className='text-red-400'>*</span></label>
                  <div className="relative">
                    <select
                      name='display_receiptno'
                      value={formData.display_receiptno}
                      onChange={handleChange}
                      className='appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    >
                      <option value="" readOnly>--Select--</option>
                      {ReceiptTypeData.map((receipt) => (
                        <option key={receipt.id} value={receipt.id}>
                          {receipt.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.display_receiptno && <span className="text-red-500 text-sm mt-1">{errors.display_receiptno}</span>}
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='text-gray-700 font-medium'>Close Print <span className='text-red-400'>*</span></label>
                  <div className="relative">
                    <select
                      name='close_print'
                      value={formData.close_print}
                      onChange={handleChange}
                      className='appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    >
                      <option value='' readOnly>--Select--</option>
                      {ClosePrintData.map((close) => (
                        <option key={close.id} value={close.id}>
                          {close.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.close_print && <span className="text-red-500 text-sm mt-1">{errors.close_print}</span>}
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='text-gray-700 font-medium'>Scheme Account Number<span className='text-red-400'>*</span></label>
                  <div className="relative">
                    <select
                      name='scheme_amount'
                      value={formData.scheme_amount}
                      onChange={handleChange}
                      className='appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    >
                      <option value='' readOnly>--Select--</option>
                      {AccountNoData.map((accountno) => (
                        <option key={accountno.id} value={accountno.id}>
                          {accountno.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.scheme_amount && <span className="text-red-500 text-sm mt-1">{errors.scheme_amount}</span>}
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-gray-700 font-medium'>Referral Calculation<span className='text-red-400'>*</span></label>
                  <div className="relative">
                    <select
                      name='referral_calc'
                      value={formData.referral_calc}
                      onChange={handleChange}
                      className='appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    >
                      <option value='' readOnly>--Select--</option>
                      {ReferralCalcData.map((referralcalc) => (
                        <option key={referralcalc.id} value={referralcalc.id}>
                          {referralcalc.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.referral_calc && <span className="text-red-500 text-sm mt-1">{errors.referral_calc}</span>}
                </div>
              
                <div className='flex flex-col gap-2'>
                  <label className='text-gray-700 font-medium'>Display Weight for Amount Scheme in Ledger <span className='text-red-400'>*</span></label>
                  <div className="relative">
                    <select
                      name='account_number'
                      value={formData.account_number}
                      onChange={handleChange}
                      className='appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    >
                      <option value='' readOnly>--Select--</option>
                      {DisplayTypeData.map((display) => (
                        <option key={display.id} value={display.id}>
                          {display.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.account_number && <span className="text-red-500 text-sm mt-1">{errors.account_number}</span>}
                </div>
                <div className='flex flex-col gap-2  mt-2'>
                  <label className='text-gray-700 font-medium'>Display Agent Collection in Account  <span className='text-red-400'>*</span></label>
                  <div className="relative">
                    <select
                      name='display_agent'
                      value={formData.display_agent}
                      onChange={handleChange}
                      className='appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    >
                      <option value='' readOnly>--Select--</option>
                      {DisplayTypeData.map((display) => (
                        <option key={display.id} value={display.id}>
                          {display.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.display_agent && <span className="text-red-500 text-sm mt-1">{errors.display_agent}</span>}
                </div>
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-1 font-medium whitespace-nowrap">
                    Agent Collection Percentage<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="number"
                    name="collection_percentage"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Agent Collection Percentage"
                    onChange={handleChange}
                    value={formData.collection_percentage}
                  />
                  {errors.collection_percentage && <div className="text-red-500 text-sm">{errors.collection_percentage}</div>}
                </div>
                
              </div>
            </div>

           
            <div className="bg-white p-2 border-t-2 border-gray-300 mt-4">
              <div className="flex justify-end gap-2 mt-3">
                <button
                  className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
                  type="button"
                  onClick={() => handleCancel('cancel')}
                >
                  Cancel
                </button>
                <button
                  readOnly={currentStep === totalPages || isLoading}
                  className=" text-white rounded-md p-2 w-full lg:w-20"
                  type="submit"
                  style={{ backgroundColor: layout_color }} >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>

      </div >
    </>
  );
};

export default GeneralDetails;
