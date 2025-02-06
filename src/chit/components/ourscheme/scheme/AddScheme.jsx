import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getClassificationByBranch,getallbranch, getallmetal, getallschemetypes, getschemeById, allinstallmenttype, allFundtype, addscheme,
  updateScheme, puritybymetal, buygsttype, wastagetype, getBranchById
} from "../../../api/Endpoints"
import { useMutation } from "@tanstack/react-query";

import { jwtDecode } from 'jwt-decode';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AddScheme = () => {

  const navigate = useNavigate();
   const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [branchData, setBranchData] = useState([]);
  const [classificationData, setClassification] = useState([])
  const [formErrors, setFormErrors] = useState({});
  const [showPayment, setShowPayment] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showFund, setShowFund] = useState(false);
  const [showPaymentPercentage, setShowPaymentPercentage] = useState(false);
  const [displayRef, setDisplayRef] = useState(false);
  const [displayWeightRef, setWeightRef] = useState(false)
  const [metalData, setMetalData] = useState([]);
  const [purityData, setPurityData] = useState(null);
  const [installmentTypeData, setInstallmentTypeData] = useState([]);
  const [schemeTypeData, setSchemeTypeData] = useState([]);
  const [gstTypeData, setgstTypeData] = useState([]);
  const [wastageType, setWastage] = useState([])
  let [fundtype, setFundType] = useState([]);
  const [metalid, setMetalid] = useState('')
  let [purity, setPurity] = useState("");

  let [scheme_type, setSchemeType] = useState(0);
  const roledata = useSelector((state) => state.clientForm.roledata);
  let id_client = roledata?.id_client;
  const id_branch = roledata?.branch;
  const [idbranch, setIdbranch] = useState(id_branch);
  const [formData, setFormData] = useState(
    { id_branch: id_branch, saving_type: 1,reduce_fine_amount:0,min_fund:0,max_fund:0,min_weight:0,max_weight:0,min_amount:0,max_amout:0});
  const id = useSelector((state) => state.clientForm.id);


  const handleCancle = () => {
    navigate("/ourscheme/scheme");
  };


  // Add a useEffect to watch for metal type changes
  useEffect(() => {

    if (metalid) {
      getPurity(metalid);
    }
  }, [metalid]);



  useEffect(() => { 
      getallbranchmuate();
  }, []);

  useEffect(() => {
    getAllMetals();
    getAllInstallmentTypes();
    getAllSchemeTypes();
    getAllWastage()
    gstTypeDataTable()
    getSavingType();

    if (id) {
      getSchemeId(id)
      getPurity(purity);
    }

  }, []);



  //helper handlers

  //wheel prevent handler
  const handleWheel = (e) => {
    e.target.blur();
  };

  //handler for field change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "id_branch") {
      allclassification({ id_branch: value });
      setFormData({ ...formData, id_branch: value });
      setIdbranch(value);
    }

    if (name === "first_paid_belowdays") {
      const numValue = Number(value);

      if (value === '' || (numValue >= 0 && numValue <= 600 && value.length <= 3)) {
        setFormData({
          ...formData,
          first_paid_belowdays: value,
          second_paid_belowdays: value ? numValue * 2 : '',
          third_paid_belowdays: value ? numValue * 3 : '',
          fourth_paid_belowdays: value ? numValue * 4 : '',
          fifth_paid_belowdays: value ? numValue * 5 : '',
        });
      }
      return;
    }

    if (name === "maturity_month") {
      const numValue = Number(value);
      if (value === '' || (numValue >= 0 && numValue <= 99)) {
        setFormData({
          ...formData,
          total_installments: value - 1,
          [name]: value
        });
        if (numValue < 5 && value !== '') {
          setFormErrors({
            ...formErrors,
            maturity_month: "Maturity month must be greater than 5",
          });
        } else {
          setFormErrors({
            ...formErrors,
            maturity_month: "",
          });
        }
      }
      return;
    }
    if (name === "id_metal") {
      setMetalid(value);
    }

    if (name === "scheme_type") {
      setSchemeType(value);
    }
console.log(name)
    if (name === 'id_purity' || name === 'weekmonth' || name === "scheme_type" || name === "amount" || name === "min_amount" || name === "max_weight" || name === "max_amount" || name === "min_weight") {
      setFormData({
        ...formData,
        [name]: Number(value)
      })
      return
    }

    setFormData({ ...formData, [name]: value })

    setFormErrors(prev => ({
      ...prev,
      [name]: ""
    }));

  };

  // mutation functions
  const { mutate: getallbranchmuate } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      setBranchData(response.data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });



  const { mutate: getSavingType } = useMutation({
    mutationFn: allFundtype,
    onSuccess: (response) => {
      setFundType(response.data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  // setFundType 

  const { mutate: gstTypeDataTable } = useMutation({
    mutationFn: buygsttype,
    onSuccess: (response) => {
      setgstTypeData(response.data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });


  const { mutate: getSchemeId } = useMutation({
    mutationFn: getschemeById,
    onSuccess: (response) => {
      console.log("SchemeDataByid", response.data)
      setFormData(response.data);
      setMetalid(response.data?.id_metal)
      setPurity(response.data?.id_purity)
      allclassification({ id_branch: response.data?.id_branch });
      setSchemeType(response.data?.scheme_type);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const { mutate: allclassification } = useMutation({
    mutationFn: getClassificationByBranch,
    onSuccess: (response) => {

      setClassification(response.data);
    },
    onError: (error) => {
      console.error("Error fetching branches:", error);
    },
  });

  const { mutate: getAllMetals } = useMutation({
    mutationFn: getallmetal,
    onSuccess: (response) => {
      setMetalData(response.data);
    },
    onError: (error) => {
      console.error("Error fetching metals:", error);
    },
  });

  const { mutate: getPurity } = useMutation({
    mutationFn: puritybymetal,
    onSuccess: (response) => {
      console.log("PurityData", response.data)
      setPurityData(response.data);
    },
    onError: (error) => {
      console.error("Error fetching purity types:", error);
      setPurityData([]);
    },
  });


  const { mutate: getAllInstallmentTypes } = useMutation({
    mutationFn: allinstallmenttype,
    onSuccess: (response) => {

      setInstallmentTypeData(response.data);
    },
    onError: (error) => {
      console.error("Error fetching installment types:", error);
    },
  });

  const { mutate: getAllSchemeTypes } = useMutation({
    mutationFn: getallschemetypes,
    onSuccess: (response) => {

      setSchemeTypeData(response.data);
    },
    onError: (error) => {
      console.error("Error fetching scheme types:", error);
    },
  });

  const { mutate: getAllWastage } = useMutation({
    mutationFn: wastagetype,
    onSuccess: (response) => {
      setWastage(response.data);
    },
    onError: (error) => {
      console.error("Error fetching scheme types:", error);
    },
  });

  //add scheme mutate
  const { mutate: addNewScheme } = useMutation({
    mutationFn: addscheme,
    onSuccess: (response) => {
      toast.success(response.message)
      navigate('/ourscheme/scheme')
    },
    onError: (error) => {
      console.error("Error fetching scheme types:", error);
    },
  });

  const { mutate: updateSchemeData } = useMutation({
    mutationFn:({id,data}) => updateScheme(id,data),
    onSuccess: (response) => {

      toast.success(response.message)
      navigate('/ourscheme/scheme')
      setFormData(response.data)

      dispatch(setid(null))
    },
    onError: (error) => {
      console.error("Error fetching scheme types:", error);
    },
  });



  const validateForm = () => {
    const errors = {};

    if (!formData.scheme_name?.trim()) {
      errors.scheme_name = "Scheme name is required";
    }

    if (!formData.code?.trim()) {
      errors.code = "Scheme code is required";
    }

    if (!formData.id_metal) {
      errors.id_metal = "Metal type is required";
    }

    if (formData.scheme_type >= 4) {
      if (formData.min_amount ==="") {
        errors.min_amount = "Minimum Amount is required";
      }
      if (formData.max_amount ==="") {
        errors.min_amount = "Maximum Amount is required";
      }
    } 
     if (formData.scheme_type === "3"){   
      if (formData.min_weight ==="") {
        errors.min_weight = "Minimum Weight is required";
      }
      if (formData.max_weight ==="") {
        errors.max_weight = "Minimum Weight is required";
      }
    }
    if (formData.scheme_type < 3){  
      if (formData.amount ==="") {
        errors.amount = "Amount is required";
      }
    }

    if (!formData.id_purity) {
      errors.id_purity = "Purity is required";
    }

    if (!formData.weekmonth) {
      errors.weekmonth = "Installment type is required";
    }


    if (!formData.id_classification) {
      errors.id_classification = "Scheme classification is required";
    }

    if (formData.scheme_type ==="") {
      errors.scheme_type = "Scheme type is required";
    }

    if (!formData.total_installments) {
      errors.total_installments = "Total installments is required";
    }
    if (formData.saving_type ==="") {
      errors.saving_type = "saving_type is required";
    }

    if (!formData.maturity_month) {
      errors.maturity_month = "Maturity month is required";
    } else if (Number(formData.maturity_month) < 5) {
      errors.maturity_month = "Maturity month must be greater than 5";
    }

    console.log("Errors", errors)

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {

    if (!validateForm(formData)) {
      toast.error("Required fields missing")
      return;
    }
    if (id_branch === 0) {
      toast.error("Branch is required!")
    }

    (formData)
    addNewScheme(formData)
  };


  const handleUpdate = () => {

    if (!validateForm(formData)) {
      toast.error("Required fields missing")
      return;
    }

    updateSchemeData({ id: id, data: formData })

  }



  return (
    <>
      <div className="flex flex-row justify-between">
        {id ? (
          <h2 className="text-2xl text-[#023453] font-bold justify-between">
            Edit Scheme
          </h2>
        ) : (
          <h2 className="text-2xl text-[#023453] font-bold justify-between">
            Add Scheme
          </h2>
        )}
      </div>
      <div className="w-full flex flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]">
        <div className="flex flex-col bg-white pl-8 pr-8 pb-4 pt-2 relative">
          <h2 className="text-lg font-medium text-[#023453] mb-4">
            Scheme Information
          </h2>
          <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300">
            <div className="flex flex-col lg:mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Scheme Name<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="scheme_name"
                value={formData.scheme_name}
                onChange={handleChange}
                className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter Here"
              />
              {formErrors.scheme_name && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.scheme_name}
                </span>
              )}
            </div>

            <div className="flex flex-col lg:mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Scheme Code<span className="text-red-400"> *</span>
              </label>
              <input
                name="code"
                value={formData.code}
                onChange={handleChange}
                type="text"
                className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter scheme code"
              />
              {formErrors.code && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.code}
                </span>
              )}
            </div>
            {id_branch !== 0 && (

              <div className="flex flex-col lg:mt-2">
                <label className="text-black mb-1 font-medium">
                  Branch<span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="id_branch"
                    className={`appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700 ${!id_branch !== 0 ? "cursor-not-allowed bg-gray-100" : ""
                      }`}
                    onChange={handleChange}
                    value={formData.id_branch}
                  >
                    <option value="" className="text-gray-700">
                      --Select--
                    </option>
                    {branchData.map((branch) => (
                      <option
                        className="text-gray-700"
                        key={branch._id}
                        value={branch._id}
                      >
                        {branch.branch_name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="black"
                    >
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                {formErrors.branch && (
                  <span className="text-red-500 text-sm mt-1">
                    {formErrors.branch}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-col lg:mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Scheme Classification<span className="text-red-400"> *</span>
              </label>
              <select
                value={formData.id_classification}
                name="id_classification"
                className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                defaultValue=""
                onChange={handleChange}
              >
                <option value="">
                  --Select--
                </option>
                {classificationData.map((classification) => (
                  <option
                    className="text-gray-700"
                    key={classification._id}
                    value={classification._id}
                  >
                    {classification.classification_name}
                  </option>
                ))}
              </select>
              {formErrors.id_classification && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.id_classification}
                </span>
              )}
            </div>
            <div className="flex flex-col lg:mt-2">
              <label className="text-black mb-1 font-medium">
                Metal Type<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  name="id_metal"
                  className="appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
                  defaultValue=""
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  value={metalid || ''}
                >
                  <option value="" disabled className="text-gray-700">
                    --Select--
                  </option>
                  {metalData.map((metal) => (
                    <option key={metal.id_metal} value={metal.id_metal}>
                      {metal.metal_name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="black"
                  >
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {formErrors.id_metal && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.id_metal}
                </span>
              )}
            </div>
            <div className="flex flex-col lg:mt-2">
              <label className="text-black mb-1 font-medium">
                Purity<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  name="id_purity"
                  className={`appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700 ${!purityData || purityData.length === 0 ? "cursor-not-allowed bg-gray-100" : ""
                    }`}
                  defaultValue=""
                  onChange={handleChange}
                  value={formData.id_purity}
                >
                  <option value="" className="text-gray-700">
                    --Select--
                  </option>
                  {purityData?.map((purity) => (
                    <option key={purity.id_purity} value={purity.id_purity}>
                      {purity.purity_name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="black"
                  >
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {formErrors.id_purity && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.id_purity}
                </span>
              )}
            </div>
            <div className="flex flex-col lg:mt-2">
              <label className="text-black mb-1 font-medium">
                Installment Type<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  name="weekmonth"
                  className="appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
                  defaultValue=""
                  onChange={handleChange}
                  value={formData.weekmonth}
                >
                  <option value="" className="text-gray-700">
                    --Select--
                  </option>
                  {installmentTypeData.map((type) => (
                    <option key={type._id} value={type.installment_type}>
                      {type.installment_name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="black"
                  >
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {formErrors.weekmonth && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.weekmonth}
                </span>
              )}
            </div>
            <div className="flex flex-col lg:mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Maturity Month<span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min={5}
                max={999}
                name="maturity_month"
                value={formData.maturity_month}
                onChange={handleChange}
                onWheel={handleWheel}
                onKeyDown={(e) => {
                  if (
                    e.key === "ArrowUp" ||
                    e.key === "ArrowDown" ||
                    e.key === "e" ||
                    e.key === "E" ||
                    e.key === "-"
                  ) {
                    e.preventDefault();
                  }
                }}
                className="border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Enter Maturity Month (min 5)"
              />
              {formErrors.maturity_month && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.maturity_month}
                </span>
              )}
            </div>

            <div className="flex flex-col lg:mt-2">
              <label className="text-black mb-1 font-medium">
                Scheme Type<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  name="scheme_type"
                  value={formData.scheme_type}
                  className="appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
                  defaultValue=""
                  onChange={handleChange}
               
                >
                  <option value="" className="text-gray-700">
                    --Select--
                  </option>
                  {schemeTypeData.map((type) => (
                    <option key={type.id} value={type.scheme_type}>
                      {type.scheme_typename}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="black"
                  >
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {formErrors.scheme_type && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.scheme_type}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 mb-4 mt-4">
            <button
              onClick={() => setShowPayment(!showPayment)}
              className=" p-4 w-9 h-9 hover:bg-[#015173] text-white items-center justify-center flex"
              style={{ backgroundColor: layout_color }}>
              {showPayment ? "-" : "+"}
            </button>
            <h2 className="text-lg font-medium text-[#023453]">
              Payable Details
            </h2>
          </div>
          {showPayment && (
            <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-t-2 border-gray-300">
              {
                scheme_type < 3 && (
                  // Render Amounts field when scheme_type is less than 3
                  <div className="flex flex-col mt-2">
                    <label className="text-black mb-2 font-normal">
                      Amounts <span className="text-red-400"> *</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        onWheel={handleWheel} // Custom handler to prevent scrolling
                        onKeyDown={(e) => {
                          // Prevent certain key events for input validation
                          if (
                            e.key === "ArrowUp" ||
                            e.key === "ArrowDown" ||
                            e.key === "e" ||
                            e.key === "E" ||
                            e.key === "-"
                          ) {
                            e.preventDefault();
                          }
                        }}
                        className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter Amount"
                      />
                      <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                      style={{ backgroundColor: layout_color }}>
                        INR
                      </span>
                    </div>
                    {formErrors.amount && (
                      <span className="text-red-500 text-sm mt-1">
                        {formErrors.amount}
                      </span>
                    )}
                  </div>
                )}

              {scheme_type >= 4 && scheme_type <= 10 && (
                // Render Min Amount field when scheme_type is 3 or greater
                <div className="flex flex-col lg:mt-2">
                  <label className="text-black mb-2 font-normal">
                    Min Amount <span className="text-red-400"> *</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="min_amount"
                      value={formData.min_amount}
                      min="0"
                      onChange={handleChange}
                      onWheel={handleWheel} // Custom handler to prevent scrolling
                      onKeyDown={(e) => {
                        // Prevent certain key events for input validation
                        if (
                          e.key === "ArrowUp" ||
                          e.key === "ArrowDown" ||
                          e.key === "e" ||
                          e.key === "E" ||
                          e.key === "-"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter Max Amount"
                    />
                    <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                    style={{ backgroundColor: layout_color }}>
                      INR
                    </span>
                  </div>
                  {formErrors.min_amount && (
                    <span className="text-red-500 text-sm mt-1">
                      {formErrors.min_amount}
                    </span>
                  )}
                </div>
              )
              }

              {scheme_type === "3" && (
                // Render Min Weight field when scheme_type is 3 or greater
                <div className="flex flex-col lg:mt-2">
                  <label className="text-black mb-2 font-normal">
                    Min Weight <span className="text-red-400"> *</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="min_weight"
                      value={formData.min_weight}
                      min="0"
                      onChange={handleChange}
                      onWheel={handleWheel} // Custom handler to prevent scrolling
                      onKeyDown={(e) => {
                        // Prevent certain key events for input validation
                        if (
                          e.key === "ArrowUp" ||
                          e.key === "ArrowDown" ||
                          e.key === "e" ||
                          e.key === "E" ||
                          e.key === "-"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter Max Amount"
                    />
                    <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                    style={{ backgroundColor: layout_color }}>
                      INR
                    </span>
                  </div>
                  {formErrors.min_weight && (
                    <span className="text-red-500 text-sm mt-1">
                      {formErrors.min_weight}
                    </span>
                  )}
                </div>
              )
              }



              <div className="flex flex-col mt-2">
                <label className="text-black mb-2 font-normal">
                  Installments<span className="text-red-400"> *</span>
                </label>
                <input
                  type="number"
                  name="installments"
                  value={formData.total_installments}
                  min="0"
                  onChange={handleChange}
                  onWheel={handleWheel}
                  onKeyDown={(e) => {
                    if (
                      e.key === "ArrowUp" ||
                      e.key === "ArrowDown" ||
                      e.key === "e" ||
                      e.key === "E" ||
                      e.key === "-"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Installments"
                />
              </div>
              {
                scheme_type >= 4 && scheme_type <= 10 && (
                  <div className="flex flex-col lg:mt-2">
                    {/* Max Amount Field */}
                    <div className="flex flex-col lg:mt-2">
                      <label className="text-black mb-2 font-normal">
                        Max Amount <span className="text-red-400"> *</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="max_amount"
                          value={formData.max_amount}
                          onChange={handleChange}
                          min="0"
                          onWheel={handleWheel} // Custom handler to prevent scrolling
                          onKeyDown={(e) => {
                            // Prevent certain key events for input validation
                            if (
                              e.key === "ArrowUp" ||
                              e.key === "ArrowDown" ||
                              e.key === "e" ||
                              e.key === "E" ||
                              e.key === "-"
                            ) {
                              e.preventDefault();
                            }
                          }}
                          className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="Enter Max Amount"
                        />
                        <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                        style={{ backgroundColor: layout_color }}>
                          INR
                        </span>
                      </div>
                    </div>
                    {formErrors.max_amount && (
                      <span className="text-red-500 text-sm mt-1">
                        {formErrors.max_amount}
                      </span>
                    )}

                  </div>
                )
              }

              {
                scheme_type === "3" && (
                  // Render Max Weight field when scheme_type is 3
                  <div className="flex flex-col lg:mt-2">
                    <label className="text-black mb-2 font-normal">
                      Max Weight <span className="text-red-400"> *</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="max_weight"
                        value={formData.max_weight}
                        onChange={handleChange}
                        min="0"
                        onWheel={handleWheel} // Custom handler to prevent scrolling
                        onKeyDown={(e) => {
                          // Prevent certain key events for input validation
                          if (
                            e.key === "ArrowUp" ||
                            e.key === "ArrowDown" ||
                            e.key === "e" ||
                            e.key === "E" ||
                            e.key === "-"
                          ) {
                            e.preventDefault();
                          }
                        }}
                        className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter Max Weight"
                      />
                      <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                      style={{ backgroundColor: layout_color }}>
                        GRM
                      </span>
                    </div>
                    {formErrors.max_weight && (
                      <span className="text-red-500 text-sm mt-1">
                        {formErrors.max_weight}
                      </span>
                    )}
                  </div>
                )
              }

              <div className="flex flex-col lg:mt-2">
                <label className="text-black mb-2 font-normal">
                  Buy GST
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="buy_gst"
                    value={formData.buy_gst}
                    min="0"
                    onChange={handleChange}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Buy Gst"
                  />
                  <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}>
                    %
                  </span>
                </div>
              </div>
              <div className="flex flex-col lg:mt-2">
                <label className="text-black mb-1 font-medium">
                  Buy GST Type
                </label>
                <div className="relative">
                  <select
                    name="buytgsttype"
                    value={formData.buytgsttype}
                    className="appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
                    defaultValue=""
                    onChange={handleChange}
                  >
                    <option value="" className="text-gray-700">
                      --Select--
                    </option>
                    {gstTypeData.map((type) => (
                      <option key={type._id} value={type.id}>
                        {type.name}
                      </option>
                    ))}

                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="black"
                    >
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                {/* {formErrors.branch && <span className="text-red-500 text-sm mt-1">{formErrors.branch}</span>} */}
              </div>
              <div className="flex flex-col lg:mt-2">
                <label className="text-black mb-2 font-normal">
                  Benefit Minimum Installment
                </label>
                <input
                  type="number"
                  name="min_installments"
                  value={formData.min_installments}
                  min="0"
                  onChange={handleChange}
                  onWheel={handleWheel}
                  onKeyDown={(e) => {
                    if (
                      e.key === "ArrowUp" ||
                      e.key === "ArrowDown" ||
                      e.key === "e" ||
                      e.key === "E" ||
                      e.key === "-"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter Min Amount"
                />
              </div>
              <div className="flex flex-col lg:mt-2">
                <label className="text-black mb-1 font-medium">
                  Benefit Wastage
                </label>
                <div className="relative">
                  <select
                    name="wastagebenefit"
                    className="appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
                    defaultValue=""
                    onChange={handleChange}
                    value={formData.wastagebenefit}
                  >
                    <option value="" className="text-gray-700">
                      --Select--
                    </option>
                    {wastageType.map((data) => (
                      <option className="text-gray-700" key={data._id} value={data.id}>{data.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="black"
                    >
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                {/* {formErrors.branch && <span className="text-red-500 text-sm mt-1">{formErrors.branch}</span>} */}
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 mb-4 mt-4">
            <button
              onClick={() => setShowFund(!showFund)}
              className=" p-4 w-9 h-9 hover:bg-[#015173] text-white items-center justify-center flex"
              style={{ backgroundColor: layout_color }}>
              {showFund ? "-" : "+"}
            </button>
            <h2 className="text-lg font-medium text-[#023453]">Fund Details</h2>
          </div>
          {showFund && (
            <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-t-2 border-gray-300">
              <div className="flex flex-col mt-2">
                <label className="text-black mb-1 font-medium">
                  Saving Type<span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="saving_type"
                    className="appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
                    defaultValue=""
                    onChange={handleChange}
                    value={formData.saving_type}
                  >
                    <option value="" className="text-gray-700">
                      --Select--
                    </option>
                    {fundtype.map((type) => (
                      <option key={type._id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="black"
                    >
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                {formErrors.saving_type && <span className="text-red-500 text-sm mt-1">{formErrors.saving_type}</span>}
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-black mb-2 font-normal">
                  Min Fund<span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="min_fund"
                    value={formData.min_fund}
                    min="0"
                    onChange={handleChange}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Min Fund"
                  />
                  <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}>
                    INR
                  </span>
                </div>
              </div>
              <div className="flex flex-col lg:mt-2">
                <label className="text-black mb-2 font-normal">
                  Max Fund<span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    name="max_fund"
                    value={formData.max_fund}
                    onChange={handleChange}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Max Fund"
                  />
                  <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}>
                    INR
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 mb-4 mt-4">
            <button
              onClick={() => setShowPaymentPercentage(!showPaymentPercentage)}
              className=" p-4 w-9 h-9 hover:bg-[#015173] text-white items-center justify-center flex"
              style={{ backgroundColor: layout_color }}>
              {showPaymentPercentage ? "-" : "+"}
            </button>
            <h2 className="text-lg font-medium text-[#023453]">
              Payment (%) Details
            </h2>
          </div>
          {showPaymentPercentage && (
            <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-t-2 border-gray-300">
              <div className="flex flex-col mt-2">
                <label className="text-black mb-2 font-normal">
                  First Payment Percentage
                  <span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="first_paid_percentage"
                    min="0"
                    value={formData.first_paid_percentage}
                    onChange={handleChange}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter First Payment Percentage"
                  />
                  <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}>
                    %
                  </span>
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-black mb-2 font-normal">
                  No Of Below Days<span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="first_paid_belowdays"
                    value={formData.first_paid_belowdays}
                    onChange={handleChange}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    max="600"
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter No Of Days (max 600)"
                  />
                  {/* <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md">INR</span> */}
                </div>
              </div>
              <div className="flex flex-col lg:mt-2">
                <label className="text-black mb-2 font-normal">
                  Second Payment Percentage
                  <span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="second_paid_percentage"
                    min="0"
                    onChange={handleChange}
                    value={formData.second_paid_percentage}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Max Fund"
                  />
                  <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}>
                    %
                  </span>
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-black mb-2 font-normal">
                  No Of Below Days<span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="second_paid_belowdays"
                    onChange={handleChange}
                    value={formData.second_paid_belowdays}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter No Of Days"
                  />
                  {/* <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md">INR</span> */}
                </div>
              </div>
              <div className="flex flex-col lg:mt-2">
                <label className="text-black mb-2 font-normal">
                  Third Payment Percentage
                  <span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="third_paid_percentage"
                    onChange={handleChange}
                    value={formData.third_paid_percentage}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Third Payment Percentage"
                  />
                  <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}>
                    %
                  </span>
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-black mb-2 font-normal">
                  No Of Below Days<span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="third_paid_belowdays"
                    value={formData.third_paid_belowdays}
                    onChange={handleChange}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter No Of Days"
                  />
                  {/* <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md">INR</span> */}
                </div>
              </div>
              <div className="flex flex-col lg:mt-2">
                <label className="text-black mb-2 font-normal">
                  Fourth Payment Percentage
                  <span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="fourth_paid_percentage"
                    min="0"
                    onChange={handleChange}
                    value={formData.fourth_paid_percentage}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Fourth Payment Percentage"
                  />
                  <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}>
                    %
                  </span>
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-black mb-2 font-normal">
                  No Of Below Days<span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="fourth_paid_belowdays"
                    onChange={handleChange}
                    value={formData.fourth_paid_belowdays}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter No Of Days"
                  />
                  {/* <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md">INR</span> */}
                </div>
              </div>
              <div className="flex flex-col lg:mt-2">
                <label className="text-black mb-2 font-normal">
                  Fifth Payment Percentage
                  <span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="fifth_paid_percentage"
                    min="0"
                    onChange={handleChange}
                    value={formData.fifth_paid_percentage}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Fifth Payment Percentage"
                  />
                  <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}>
                    %
                  </span>
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-black mb-2 font-normal">
                  No Of Below Days<span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="fifth_paid_belowdays"
                    onChange={handleChange}
                    value={formData.fifth_paid_belowdays}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter No Of Days"
                  />
                  {/* <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md">INR</span> */}
                </div>
              </div>
            </div>
          )}
          {/* advanced section */}
          <div className="flex items-center gap-3 mb-4 mt-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className=" p-4 w-9 h-9 hover:bg-[#015173] text-white items-center justify-center flex"
              style={{ backgroundColor: layout_color }}>
              {showAdvanced ? "-" : "+"}
            </button>
            <h2 className="text-lg font-medium text-[#023453]">
              Advanced Settings
            </h2>
          </div>
          {showAdvanced && (
            <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-t-2 border-gray-300">
              <div className="flex flex-col mt-2">
                <label className="text-black mb-2 font-normal">
                  Monthly Limit Installment
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="limit_installment"
                    onChange={handleChange}
                    value={formData.limit_installment}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Limit Installment"
                  />
                  {/* <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md">INR</span> */}
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-black mb-2 font-normal">
                  Pending Due Limit Installment
                  <span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="pending_due_installment"
                    onChange={handleChange}
                    value={formData.pending_due_installment}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Pending Due Installment"
                  />
                  {/* <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md">INR</span> */}
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-black mb-2 font-normal">
                  Paid Installment <span>(greater or equal to)</span>
                  <span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="paid_installment"
                    onChange={handleChange}
                    value={formData.paid_installment}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Paid Installment"
                  />
                  {/* <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md">INR</span> */}
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-black mb-2 font-normal">
                  Paid Installment <span>(greater or equal to)</span>
                  <span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="paid_installment_greater"
                    onChange={handleChange}
                    value={formData.paid_installment_greater}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Pending Due Installment"
                  />
                  {/* <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md">INR</span> */}
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-black mb-2 font-normal">
                  Scheme Customer Limit<span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="scheme_customer_limit"
                    onChange={handleChange}
                    value={formData.scheme_customer_limit}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Scheme Customer Limit"
                  />
                  {/* <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md">INR</span> */}
                </div>
              </div>

      

              <div className="flex flex-col mt-2">
                <label className="text-black mb-1 font-medium">
                  Gift Type<span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="gift_type"
                    className="appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
                    defaultValue=""
                    onChange={handleChange}
                    value={formData.saving_type}
                  >
                    <option value="" className="text-gray-700">--Select--</option>
                    <option value="1" className="text-gray-700">Gift Percentage</option>
                    <option value="2" className="text-gray-700">Number of Gift</option>                    
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="black"
                    >
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                </div>
              <div className="flex flex-col mt-2">
                <label className="text-black mb-2 font-normal">
                  No.Of Gifts<span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="pending_due_installment"
                    onChange={handleChange}
                    value={formData.pending_due_installment}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Pending Due Installment"
                  />
                  {/* <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md">INR</span> */}
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-black mb-2 font-normal">
                  Gift Percentage<span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="gift_percentage"
                    onChange={handleChange}
                    value={formData.gift_percentage}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Gift Percentage"
                  />
                  <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}>
                    %
                  </span>
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-black mb-2 font-normal">
                  Referal Amount<span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="referral_amount"
                    onChange={handleChange}
                    value={formData.referral_amount}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Pending Due Installment"
                  />
                  <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}>
                    INR
                  </span>
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-black mb-2 font-normal">
                  Reward Amount<span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="reward_amount"
                    onChange={handleChange}
                    value={formData.reward_amount}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Reward Amount"
                  />
                  <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}>
                    INR
                  </span>
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-black mb-2 font-normal">
                  Not Paid Limit Installment
                  <span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="not_paid_installment"
                    onChange={handleChange}
                    value={formData.not_paid_installment}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Not Paid Installment"
                  />
                  {/* <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md">INR</span> */}
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-black mb-2 font-normal">
                  Convenience Fee<span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="convenience_fee"
                    onChange={handleChange}
                    value={formData.convenience_fee}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Convenience Fee"
                  />
                  <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}>
                    %
                  </span>
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-black mb-2 font-normal">
                  Fine Amount<span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="fine_amount"
                    onChange={handleChange}
                    value={formData.fine_amount}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Fine Amount"
                  />
                  <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}>
                    INR
                  </span>
                </div>
              </div>
              <div className="flex flex-col lg:mt-2">
                <label className="text-black mb-2 font-normal">
                  Cumulative Fine Amount<span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="cumulative_fine_amount"
                    value={formData.cumulative_fine_amount}
                    min="0"
                    onChange={handleChange}
                    onWheel={handleWheel}
                    onKeyDown={(e) => {
                      if (
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Min Amount"
                  />
                  <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}>
                    INR
                  </span>
                </div>
              </div>
              <div className="flex flex-row gap-4 lg:mt-2">
                <div className="flex flex-col">
                  <label className="text-black mb-2 font-normal">
                    Display Referral<span className="text-red-400"> *</span>
                  </label>
                  <div className="flex flex-row border border-gray-300 rounded-lg overflow-hidden w-32 h-10 items-center">
                    <div
                      onClick={() => setDisplayRef(true)}
                      className={`${displayRef
                        ? " text-white"
                        : "bg-white text-[#888888]"
                        } p-3 w-full cursor-pointer transition-colors duration-200 text-center`}
                        style={{ backgroundColor: layout_color }}>
                      Yes
                    </div>
                    <div className="w-px bg-gray-300" />
                    <div
                      onClick={() => setDisplayRef(false)}
                      className={`${!displayRef
                        ? " text-white"
                        : "bg-white text-[#888888]"
                        } p-3 w-full cursor-pointer transition-colors duration-200 text-center`}
                        style={{ backgroundColor: layout_color }}>
                      No
                    </div>
                  </div>
                </div>
                <div className="flex flex-col mx-2">
                  <label className="text-black mb-2 font-normal">
                    Display Weight In Ledger<span className="text-red-400"> *</span>
                  </label>
                  <div className="flex flex-row  border border-gray-300 rounded-lg overflow-hidden w-32 h-10 items-center">
                    <div
                      onClick={() => setWeightRef(true)}
                      className={`${displayWeightRef
                        ? " text-white"
                        : "bg-white text-[#888888]"
                        } p-3 w-full cursor-pointer transition-colors duration-200 text-center`}
                        style={{ backgroundColor: layout_color }}>
                      Yes
                    </div>
                    <div className="w-px bg-gray-300" />
                    <div
                      onClick={() => setWeightRef(false)}
                      className={`${!displayWeightRef
                        ? " text-white"
                        : "bg-white text-[#888888]"
                        } p-3 w-full cursor-pointer transition-colors duration-200 text-center`}
                        style={{ backgroundColor: layout_color }}>
                      No
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="bg-white p-2">
            <div className="flex justify-end gap-2 mt-3">
              <button
                className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
                type="button"
                onClick={handleCancle}
              >
                Cancel
              </button>
              <button
                className="bg-[#61A375] text-white rounded-md p-2 w-full lg:w-20"
                type="button"
                onClick={id ? handleUpdate : handleSubmit}
              >
                {id ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddScheme;
