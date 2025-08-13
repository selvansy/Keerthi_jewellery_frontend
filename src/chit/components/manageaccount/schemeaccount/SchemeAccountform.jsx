import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { CalendarDays, CloudFog, Search } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { toast } from "sonner";
import Select from "react-select";
import {
  addschemeaccount,
  searchcustomermobile,
  geallschemebyclassification,
  getschemeaccountbyid,
  updateschemeaccount,
  getallbranchclassification,
  getemployeebybranch,
  getallbranch,
  getSchemeAccountCount,
  getCustomerByMobile,
  getEmployeeByMobile,
  getMetalRateByMetalId,
} from "../../../api/Endpoints";
import { useSelector, useDispatch } from "react-redux";
import { customSelectStyles } from "../../Setup/purity/index";
import SpinLoading from "../../common/spinLoading";
import { openModal } from "../../../../redux/modalSlice";
import { closeModal } from "../../../../redux/modalSlice";
import { eventEmitter } from "../../../../utils/EventEmitter";
import Modal from "../../common/Modal";
import { emptyToZero } from "../../../utils/commonFunction";
import { customStyles } from "../../ourscheme/scheme/AddScheme";

export function ExistingCustomer({
  setCusData,
  handleCusData,
  openJoinScheme,
}) {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_branch = roledata?.branch;

  const inputHeight = "42px";

  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [branch, setBranch] = useState(id_branch);
  const [branchData, setBranchData] = useState([]);

  const { data: branchresponse, isLoading: branchloading } = useQuery({
    queryKey: ["branch"],
    queryFn: getallbranch,
  });

  useEffect(() => {
    if (branchresponse) {
      const data = branchresponse.data;
      const branch = data.map((branch) => ({
        value: branch._id,
        label: branch.branch_name,
      }));
      setBranchData(branch);
    }
  }, [branchresponse]);

  const handleSearchmobile = () => {
    if (!formData.mobile) {
      return toast.error("Enter a mobile number to search");
    }
    setLoading(true);
    handlesearchcustomer({
      id_branch: formData.id_branch,
      search: formData.mobile,
    });
  };

  const { mutate: handlesearchcustomer } = useMutation({
    mutationFn: (data) => searchcustomermobile(data),
    onSuccess: (response) => {
      handleCusData(response.data);
      handleResData(response.data);
      setLoading(false);
      openJoinScheme();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      setLoading(false);
    },
  });

  const handleResData = (data) => {
    setFormData((prev) => ({
      ...prev,
      customer_name: data.firstname + " " + data.lastname,
    }));

    setCusData({
      customer_name: data.firstname + " " + data.lastname,
      address: data.address,
      id_branch: data.id_branch,
      mobile: data.mobile,
      customerId: data._id,
      referral_id: data.referral_id,
    });
  };

  const customStyles = (isReadOnly) => ({
    control: (base, state) => ({
      ...base,
      minHeight: "44px", //42px
      backgroundColor: "white",
      color: "#232323",
      // fontWeight:600,
      border: state.isFocused ? "1px solid #f2f2f9" : "1px solid #f2f2f9",
      boxShadow: state.isFocused ? "0 0 0 1px #004181" : "none",
      borderRadius: "0.5rem",
      "&:hover": {
        color: "#e2e8f0",
      },
      pointerEvents: !isReadOnly ? "none" : "auto",
      opacity: !isReadOnly ? 1 : 1,
      cursor: isReadOnly ? "pointer" : "default",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6C7086",
      // fontWeight: "thin",
      fontSize: "14px",
      // fontStyle: "bold",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: "#232323",
      "&:hover": {
        color: "#232323",
      },
    }),
    input: (base) => ({
      ...base,
      "input[type='text']:focus": { boxShadow: "none" },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#F0F7FE"
        : state.isFocused
        ? "#F0F7FE"
        : "white",
      color: "#232323",
      fontWeight: "500",
      fontSize: "14px",
    }),
  });

  return (
    <div className="grid md:grid-cols-3 gap-2">
      <div className="flex flex-col">
        <label className="text-[#232323] text-sm mb-1 font-semibold">
          Branch<span className="text-red-400">*</span>
        </label>
        <Select
          name="id_branch"
          options={branchData}
          value={
            branchData.find((branch) => branch.value === formData.id_branch) ||
            ""
          }
          onChange={(branch) => {
            setFormData((prev) => ({
              ...prev,
              id_branch: branch.value,
            }));
            setBranch(branch.value);
          }}
          styles={{
            ...customStyles(true),
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          isLoading={branchloading}
          placeholder="Select Branch"
          menuPortalTarget={document.body}
        />
      </div>

      <div className="flex flex-col relative">
        <label className="text-sm text-[#232323] mb-1 font-semibold">
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              console.log(e.key);
              handleSearchmobile();
            }
          }}
          style={{ height: inputHeight }}
          name="mobile"
          onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
          pattern="\d{10}"
          maxLength={"10"}
          className="border-[1px] border-[#f2f3f8] rounded-md p-2  focus:border-transparent"
          placeholder="Enter Here"
          // onKeyDown={(e) => {
          //   if (e.key === "Enter") {
          //     e.preventDefault();
          //     handlesearchcustomer({
          //       id_branch: formData.id_branch,
          //       search_mobile: formData.mobile,
          //     });
          //   }
          // }}
        />

        {/* Search Icon */}
        <div
          onClick={handleSearchmobile}
          className="absolute flex items-center justify-center cursor-pointer rounded-r-lg right-2 translate-y-9"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <Search size={15} className="text-gray" />
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-[#232323] text-sm mb-1 font-semibold">
          Customer Name<span className="text-red-400">*</span>
        </label>
        <input
          readOnly
          type="text"
          name="customer_name"
          value={formData.customer_name}
          className="border-[1px] border-[#f2f3f8] w-full bg-[#F4F4F4]  cursor-not-allowed rounded-md p-2 pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="Enter name"
        />
      </div>
    </div>
  );
}

const referralRoles = [
  { value: 1, label: "Employee", endpoint: getEmployeeByMobile },
  { value: 2, label: "Customer", endpoint: getCustomerByMobile },
];

const AddSchemeAccount = ({ cusData, handleClear }) => {
  const dispatch = useDispatch();
  const id_branch = cusData?.id_branch;
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const todaydate = new Date();

  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  // Refs for persistent data
  const formDataRef = useRef({});
  const prevFormDataRef = useRef({});

  const [isLoading, setLoading] = useState(false);
  const [start_date, setStartDate] = useState(todaydate);
  const [maturity_date, setMaturityDate] = useState("");
  const [fixedamt, setFixedAmt] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [classifyfilter, setClassify] = useState([]);
  const [schemefilter, setScheme] = useState([]);
  const [errors, setErrors] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState("");
  const [acNumber, setAcNumber] = useState(1);
  const [referralName, setReferralName] = useState("");
  const [searchmobile, setSearchMobile] = useState("");
  const [selectedRole, setRole] = useState("");
  const [selectedClassification, setClassification] = useState("");
  const [id_metal, setMetal] = useState("");
  const [id_purity, setPurity] = useState("");
  const [metalRate, setMetalRate] = useState(0);
  const [referralId, setReferralid] = useState(null);
  const [showReferral, setShowReferral] = useState(false);

  const [formData, setFormData] = useState({
    id_customer: cusData.customerId || "",
    mobile: cusData.mobile,
    start_date: start_date,
    id_classification: "",
    scheme_acc_number: "",
    id_scheme: "",
    id_branch: cusData.id_branch,
    account_name: "",
    address: cusData.address,
    customer_name: cusData.customer_name,
    fixedamount: "",
    amount: null,
    weight: null,
    scheme_type: 0,
    min_amount: 0,
    max_amount: 0,
    min_weight: 0,
    max_weight: 0,
    total_installments: 0,
    maturity_period: 0,
    maturity_date: "",
    referral_id: "",
    referral_type: "",
    installment_type: "",
    code: 0,
    scheme_count_number: "",
    noOfDays: "",
    flexFixed: 0,
    fixed: 0,
  });

  // Update ref on formData change
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Restore form data on error
  const restoreFormData = () => {
    if (prevFormDataRef.current) {
      setFormData(prevFormDataRef.current);
    }
  };

  const { data: branchresponse, isLoading: branchloading } = useQuery({
    queryKey: ["branch"],
    queryFn: getallbranch,
  });

  useEffect(() => {
    if (branchresponse) {
      const data = branchresponse.data;
      const branch = data.map((branch) => ({
        value: branch._id,
        label: branch.branch_name,
      }));
      setBranchData(branch);
    }
  }, [branchresponse]);

  useEffect(() => {
    if (cusData) {
      handlesearchcustomer({
        id_branch: cusData.id_branch,
        search: cusData.mobile,
      });
    }
    handleClassifyChange();
  }, [cusData.mobile]);

  const handleSearchmobile = async () => {
    try {
      if (Number(searchmobile) === Number(cusData.mobile)) {
        return toast.error("Self referral is not allowed");
      }

      const matchingRole = referralRoles.find(
        (element) => Number(selectedRole) === element.value
      );

      if (matchingRole) {
        const data = await matchingRole.endpoint(
          searchmobile,
          cusData.customerId
        );

        if (data && !data.data) {
          return toast.error("No customer found or deleted customer");
        }

        setReferralName(
          `${data?.data?.firstname || ""}${
            data?.data?.lastname ? " " + data.data.lastname : ""
          }`
        );

        setReferralid(data?.data?._id);
        setFormData((prev) => ({
          ...prev,
          referral_type: matchingRole.label,
        }));
      }
    } catch (error) {
      console.error("Error fetching search mobile data:", error);
      toast.error("Failed to search referral");
    }
  };

  const { mutate: handlesearchcustomer } = useMutation({
    mutationFn: searchcustomermobile,
    onSuccess: (response) => {
      if (response) {
        setFormData({
          id_customer: response.data._id,
          mobile: response.data.mobile,
          start_date: start_date,
          id_classification: "",
          scheme_acc_number: "",
          id_scheme: "",
          id_branch: id_branch,
          account_name: `${response.data.firstname} ${response.data.lastname}`,
          address: response.data.address,
          customer_name: response.data.firstname + " " + response.data.lastname,
          total_installments: 0,
          amount: "",
          weight: "",
          scheme_type: 0,
          min_amount: 0,
          max_amount: 0,
          min_weight: 0,
          max_weight: 0,
          maturity_period: 0,
          maturity_date: "",
          referral_id: response?.data?.referral_id,
          code: 0,
          scheme_count_number: "",
          noOfDays: "",
          flexFixed: 0,
          fixed: 0,
        });
      }
    },
  });

  const filterInputchange = (e) => {
    const { name, value } = e.target;
    const newValue = value === "" ? "" : isNaN(value) ? value : +value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === "referral_type") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "account_name") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "weight") {
      setErrors((prevState) => {
        const newErrors = { ...prevState };

        let wtValue = emptyToZero(value);
        formData.min_weight = emptyToZero(formData.min_weight);
        formData.max_weight = emptyToZero(formData.max_weight);

        setTimeout(() => {
          if (wtValue === "") {
            delete newErrors.weight;
          } else if (wtValue < formData.min_weight) {
            newErrors.weight = "Weight can't be less than min weight";
          } else if (wtValue > formData.max_weight) {
            newErrors.weight = "Weight can't be more than max weight";
          } else {
            delete newErrors.weight;
          }
        }, 500);

        return newErrors;
      });
    }

    if (name === "amount" && selectedClassification === 3) {
      let amtValue = emptyToZero(value);
      formData.min_amount = emptyToZero(formData.min_amount);
      formData.max_amount = emptyToZero(formData.max_amount);

      setErrors((prevState) => {
        const newErrors = { ...prevState };
        if (amtValue === "") {
          delete newErrors.amount;
        } else if (amtValue < formData.min_amount) {
          newErrors.amount = "Amount can't be less than min amount";
        } else if (amtValue > formData.max_amount) {
          newErrors.amount = "Amount can't be more than max amount";
        } else {
          delete newErrors.amount;
        }
        return newErrors;
      });
    }
  };

  const handleschemebyid = async (id) => {
    try {
      const countData = await getSchemeAccountCount(formData.mobile, id);
      const newAcNumber = countData.data !== 0 ? Number(countData.data) : 1;
      setAcNumber(newAcNumber);

      const schemeData = schemefilter.find(
        (item) => String(item._id) === String(id)
      );

      if (schemeData) {
        setMetal(schemeData?.id_metal);
        setPurity(schemeData?.id_purity);

        if (selectedScheme === "Fixed" && schemeData.fixed_amounts) {
          const fixedAmounts = schemeData.fixed_amounts.map((amount) => ({
            value: amount,
            label: amount.toString(),
          }));
          setFixedAmt(fixedAmounts);
        }

        setFormData((prevState) => ({
          ...prevState,
          scheme_type: schemeData?.scheme_type,
          total_installments: schemeData?.total_installments,
          maturity_period:
            schemeData?.scheme_type == 10 || schemeData?.scheme_type == 14
              ? schemeData?.noOfDays
              : schemeData?.maturity_period,
          installment_type: schemeData?.installment_type,
          code: schemeData?.code,
          min_weight: schemeData?.min_weight || 0,
          max_weight: schemeData?.max_weight || 0,
          min_amount: schemeData?.min_amount || 0,
          max_amount: schemeData?.max_amount || 0,
          noOfDays: schemeData?.noOfDays || "",
        }));
      }
    } catch (error) {
      console.error("Error handling scheme by ID:", error);
    }
  };

  useEffect(() => {
    if (selectedScheme === "Fixed") {
      const filteredData = schemefilter.filter(
        (item) => String(item._id) === String(formData.id_scheme)
      );

      const finalData = filteredData[0]?.fixed_amounts.map((item) => ({
        value: item,
        label: item,
      }));

      setFixedAmt(finalData);
    }
  }, [formData.id_scheme, schemefilter]);

  function digigoldandsilverMaturity(startDateStr, noOfDays) {
    const startDate = new Date(startDateStr);
    const maturityDate = new Date(startDate);
    maturityDate.setDate(maturityDate.getDate() + noOfDays - 1);

    const day = String(maturityDate.getDate()).padStart(2, "0");
    const month = String(maturityDate.getMonth() + 1).padStart(2, "0");
    const year = maturityDate.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    setFormData((prev) => ({ ...prev, maturity_date: formattedDate }));
  }

  useEffect(() => {
    if (
      formData.start_date &&
      formData.maturity_period &&
      formData.installment_type
    ) {
      if (formData.scheme_type != 10 && formData.scheme_type != 14) {
        calculateMaturityDate(
          formData.start_date,
          formData.maturity_period,
          formData.installment_type
        );
      } else {
        digigoldandsilverMaturity(
          formData.start_date,
          formData.maturity_period
        );
      }
    }
  }, [
    formData.id_scheme,
    formData.start_date,
    formData.maturity_period,
    formData.installment_type,
  ]);

  function calculateMaturityDate(startDate, maturityPeriod, installmentType) {
    let date = new Date(startDate);

    switch (installmentType) {
      case 3:
        date.setDate(date.getDate() + maturityPeriod);
        break;
      case 2:
        date.setDate(date.getDate() + maturityPeriod * 7);
        break;
      case 1:
        date.setMonth(date.getMonth() + maturityPeriod);
        break;
      case 4:
        date.setFullYear(date.getFullYear() + maturityPeriod);
        break;
      default:
        throw new Error("Invalid installment type");
    }

    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;

    setMaturityDate(formattedDate);
    setFormData((prev) => ({ ...prev, maturity_date: formattedDate }));
  }

  const { mutate: handleschemebyclassification } = useMutation({
    mutationFn: (id) => geallschemebyclassification(id),
    onSuccess: (response) => {
      if (response) {
        setScheme(response.data);
      }
    },
    onError: (error) => {
      setScheme([]);
    },
  });

  const { mutate: handleClassifyChange } = useMutation({
    mutationFn: getallbranchclassification,
    onSuccess: (response) => {
      if (response) {
        const formatedClassification = response.data.map((item) => ({
          value: item._id,
          label: item.name,
          order: item.order,
        }));
        setClassify(formatedClassification);
      }
    },
  });

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setFormData((prev) => ({ ...prev, start_date: date }));

    if (formData.scheme_type === 10 || formData.scheme_type === 14) {
      const currentDate = new Date(date);
      const maturityDate = new Date(currentDate);
      maturityDate.setDate(currentDate.getDate() + formData.noOfDays);

      const day = String(maturityDate.getDate()).padStart(2, "0");
      const month = String(maturityDate.getMonth() + 1).padStart(2, "0");
      const year = maturityDate.getFullYear();

      const formattedDate = `${day}-${month}-${year}`;
      setFormData((prev) => ({ ...prev, maturity_date: formattedDate }));
    } else {
      const start = new Date(date);
      start.setMonth(start.getMonth() + formData.maturity_period);

      const day = String(start.getDate()).padStart(2, "0");
      const month = String(start.getMonth() + 1).padStart(2, "0");
      const year = start.getFullYear();

      const formattedDate = `${day}-${month}-${year}`;
      setFormData((prev) => ({ ...prev, maturity_date: formattedDate }));
    }
  };

  const isValidForm = () => {
    const err = {};

    if (!formData.id_branch) {
      err["id_branch"] = "Branch is required";
    }

    if (!formData.id_classification) {
      err["id_classification"] = "Classification is required";
    }

    if (!formData.id_scheme) {
      err["id_scheme"] = "Scheme is required";
    }

    if (!formData.start_date) {
      err["start_date"] = "Start Date is required";
    }

    if (!formData.account_name) {
      err["account_name"] = "Account Name is required";
    }

    if (!formData.customer_name) {
      err["customer_name"] = "Customer Name is required";
    }

    if (!formData.total_installments && formData.total_installments !== 0) {
      err["total_installments"] = "Total Installment is required";
    }

    if (!formData.maturity_period && formData.maturity_period !== 0) {
      err["maturity_period"] = "Maturity month is required";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const inputHeight = "42px";

  const updateAmtWtValue = (payload) => {
    const { weight, amount } = payload;

    if (selectedClassification === 2 || selectedClassification === 3) {
      if (weight !== 0) {
        payload.flexFixed = weight;
        payload.weight = 0;
        payload.amount = 0;
      } else if (amount !== 0) {
        payload.flexFixed = amount;
        payload.weight = 0;
        payload.amount = 0;
      }
    }
    return payload;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (isValidForm()) {
      prevFormDataRef.current = { ...formData };
      
      let payload = updateAmtWtValue(formData);

      const updatedFormData = {
        ...payload,
        referral_id: referralId,
        referral_type: selectedRole ? referralRoles.find(r => r.value === selectedRole)?.label : "",
        scheme_count_number: acNumber,
      };

      setLoading(true);

      if (id) {
        updateSchemeaccount(updatedFormData);
      } else {
        createSchemeaccount(updatedFormData);
      }
    }
  };

  const { mutate: createSchemeaccount } = useMutation({
    mutationFn: addschemeaccount,
    onSuccess: (response) => {
      toast.success(response.message);
      setLoading(false);
      handlePayment(response.id);
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.response?.data?.message || "An error occurred");
      restoreFormData();
    },
  });

  const { mutate: updateSchemeaccount } = useMutation({
    mutationFn: updateschemeaccount,
    onSuccess: (response) => {
      toast.success(response.message);
      setLoading(false);
      navigate("/managecustomers/customer/");
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.response?.data?.message || "An error occurred");
      restoreFormData();
    },
  });

  useEffect(() => {
    if (
      selectedClassification === 3 &&
      [12, 3, 4].includes(formData.scheme_type)
    ) {
      const fetchMetalRate = async () => {
        const branchId = formData.id_branch || id_branch;

        try {
          const metalRate = await getMetalRateByMetalId(
            id_metal || "",
            id_purity || "",
            todaydate,
            branchId
          );

          if (metalRate) {
            const rate = metalRate.data.rate;
            setMetalRate(rate);
          }
        } catch (error) {
          console.error("Error fetching metal rate:", error);
        }
      };
      fetchMetalRate();
    }
  }, [selectedClassification, formData.scheme_type]);

  useEffect(() => {
    if (
      formData.weight &&
      [12, 3, 4].includes(formData.scheme_type) &&
      !errors?.weight
    ) {
      const outputAmount = metalRate * formData.weight;
      setFormData((prev) => ({
        ...prev,
        amount: outputAmount > 0 ? outputAmount : 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        amount: 0,
      }));
    }
  }, [formData.weight]);

  const handlePayment = (id) => {
    dispatch(
      openModal({
        modalType: "CONFIRMATION",
        header: "Proceed to payment",
        formData: {
          message:
            "You're all set! Continue to the Payment Module to complete the process.",
          redirectTo: `/payment/addschemepayment/${id}`,
          onCancelRedirect: "/managecustomers/customerschemes",
        },
        buttons: {
          cancel: {
            text: "No",
          },
          submit: {
            text: "Yes",
          },
        },
      })
    );
  };

  const handleCancel = () => {
    navigate("/managecustomers/customer/");
  };

  console.log(formData)

  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Branch */}
        <div>
          <label className="text-sm text-[#232323] mb-1 font-semibold">
            Branch<span className="text-red-400">*</span>
          </label>
          <Select
            options={branchData}
            value={branchData.find((option) => option.value === cusData.id_branch)}
            onChange={(option) => 
              setFormData(prev => ({...prev, id_branch: option?.value || ""}))
            }
            styles={customSelectStyles}
            isLoading={branchloading}
            isDisabled={id_branch !== "0"}
            placeholder="Select Branch"
          />
          {errors?.id_branch && (
            <div className="text-red-500 text-sm">{errors.id_branch}</div>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="text-sm text-[#232323] mb-1 font-semibold">
            Mobile Number<span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={cusData.mobile || formData.mobile}
            name="mobile"
            className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
            placeholder="Customer Mobile"
            disabled
          />
        </div>

        {/* Customer Name */}
        <div>
          <label className="text-sm text-[#232323] mb-1 font-semibold">
            Customer Name<span className="text-red-400">*</span>
          </label>
          <input
            disabled
            type="text"
            name="customer_name"
            value={cusData.customer_name || formData.customer_name}
            className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
            placeholder="Customer Name"
          />
          {errors?.customer_name && (
            <div className="text-red-500 text-sm">{errors.customer_name}</div>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="text-sm text-[#232323] mb-1 font-semibold">
            Address
          </label>
          <input
            disabled
            type="text"
            name="address"
            value={cusData.address || formData.address}
            className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
            placeholder="Customer Address"
          />
        </div>

        {/* Scheme Classification */}
        <div>
          <label className="text-sm text-[#232323] mb-1 font-semibold">
            Scheme Classification<span className="text-red-400">*</span>
          </label>
          <Select
            styles={customStyles(true)}
            isClearable={true}
            options={classifyfilter}
            name="id_classification"
            value={classifyfilter.find(
              (item) => item.value === formData.id_classification
            )}
            onChange={(selectedOption) => {
              if (selectedOption) {
                setClassification(selectedOption.order);
                setSelectedScheme(selectedOption.label);
                setFormData(prev => ({
                  ...prev,
                  id_classification: selectedOption.value,
                  id_scheme: "",
                }));
                handleschemebyclassification(selectedOption.value);
              } else {
                setClassification("");
                setSelectedScheme("");
                setFormData(prev => ({
                  ...prev,
                  id_classification: "",
                  id_scheme: "",
                }));
                setScheme([]);
              }
            }}
            placeholder="Select Classification"
          />
          {errors?.id_classification && (
            <div className="text-red-500 text-sm">{errors.id_classification}</div>
          )}
        </div>

        {/* Scheme */}
        <div>
          <label className="text-sm text-[#232323] mb-1 font-semibold">
            Scheme<span className="text-red-400">*</span>
          </label>
          <Select
            styles={customStyles(true)}
            isClearable={true}
            options={schemefilter.map((scheme) => {
              let label = scheme.scheme_name;

              if (
                [3, 4, 12].includes(scheme.scheme_type) &&
                scheme.min_weight !== 0 &&
                scheme.max_weight !== 0
              ) {
                label += ` (${scheme.min_weight} - ${scheme.max_weight} GRM)`;
              } else if (scheme.min_amount !== 0 && scheme.max_amount !== 0) {
                label += ` (Rs. ${scheme.min_amount} - Rs. ${scheme.max_amount})`;
              } else if (scheme.amount !== null) {
                label += ` (Rs. ${scheme.amount})`;
              }

              return {
                value: scheme._id,
                label: label,
                ...scheme,
              };
            })}
            name="id_scheme"
            value={
              schemefilter.find((scheme) => scheme._id === formData.id_scheme)
                ? {
                    value: formData.id_scheme,
                    label:
                      schemefilter.find(
                        (scheme) => scheme._id === formData.id_scheme
                      )?.scheme_name || "",
                  }
                : null
            }
            onChange={(selectedOption) => {
              if (selectedOption) {
                setFormData(prev => ({
                  ...prev,
                  id_scheme: selectedOption.value,
                  scheme_type: selectedOption.scheme_type,
                  total_installments: selectedOption.total_installments,
                  maturity_period: selectedOption.maturity_period,
                  installment_type: selectedOption.installment_type,
                  min_amount: selectedOption.min_amount,
                  max_amount: selectedOption.max_amount,
                  min_weight: selectedOption.min_weight,
                  max_weight: selectedOption.max_weight,
                  code: selectedOption.code,
                  noOfDays: selectedOption.noOfDays,
                }));
                setShowReferral(selectedOption.display_referral);
                if (selectedOption.id_metal) {
                  setMetal(selectedOption.id_metal);
                }
                if (selectedOption.id_purity) {
                  setPurity(selectedOption.id_purity);
                }
                if (
                  selectedScheme === "Fixed" &&
                  selectedOption.fixed_amounts
                ) {
                  setFixedAmt(selectedOption.fixed_amounts);
                }
              } else {
                setFormData(prev => ({
                  ...prev,
                  id_scheme: "",
                  scheme_type: 0,
                  total_installments: 0,
                  maturity_period: 0,
                  installment_type: "",
                  min_amount: 0,
                  max_amount: 0,
                  min_weight: 0,
                  max_weight: 0,
                  code: 0,
                  noOfDays: "",
                }));
              }
            }}
            isDisabled={!formData.id_classification}
            placeholder={
              formData.id_classification
                ? "Select Scheme"
                : "Select Classification First"
            }
          />
          {errors?.id_scheme && (
            <div className="text-red-500 text-sm">{errors.id_scheme}</div>
          )}
        </div>

        {/* Fixed Amount/Weight */}
        {selectedScheme === "Fixed" ? (
          <div>
            <label className="text-sm text-[#232323] mb-1 font-semibold">
              {[12, 3, 4].includes(formData.scheme_type) ? "Weight" : "Amount"}
              <span className="text-red-400">*</span>
            </label>

            {fixedamt && fixedamt.length > 0 ? (
              <Select
                styles={customSelectStyles(true)}
                isClearable={true}
                options={fixedamt}
                name={
                  [12, 3, 4].includes(formData.scheme_type)
                    ? "weight"
                    : "amount"
                }
                value={fixedamt.find((option) =>
                  [12, 3, 4].includes(formData.scheme_type)
                    ? option.value === formData.weight
                    : option.value === formData.amount
                )}
                // onChange={(selectedOption) => {
                //   const newValue = selectedOption?.value || null;
                //   console.log(selectedOption.value)
                //   setFormData(prev => ({
                //     ...prev,
                //     ...([12, 3, 4].includes(prev.scheme_type)
                //       ? {
                //           weight: newValue,
                //           amount: newValue ? newValue * metalRate : 0,
                //         }
                //       : {
                //           amount: newValue,
                //           weight: 0,
                //         }),
                //   }));
                // }}
                onChange={(selectedOption) => {
                  const newValue = selectedOption?.value || null;
                  setFormData(prev => ({
                    ...prev,
                    ...([12, 3, 4].includes(prev.scheme_type))
                      ? {
                          weight: newValue,
                          amount: newValue ? newValue * metalRate : 0,
                          flexFixed: newValue // Add this line
                        }
                      : {
                          amount: newValue,
                          weight: 0,
                          flexFixed: newValue // Add this line
                        },
                  }));
                }}
                placeholder={`Select ${
                  [12, 3, 4].includes(formData.scheme_type)
                    ? "Weight"
                    : "Amount"
                }`}
              />
            ) : (
              <div className="border-[1px] border-[#f2f3f8] rounded-md p-2 bg-gray-100 text-gray-500">
                No fixed{" "}
                {[12, 3, 4].includes(formData.scheme_type)
                  ? "weights"
                  : "amounts"}{" "}
                available
              </div>
            )}

            {(errors?.weight || errors?.amount) && (
              <div className="text-red-500 text-sm">
                {errors.weight || errors.amount}
              </div>
            )}
          </div>
        ) : (
          <>
            {selectedClassification === 3 && schemefilter.length > 0 && (
              <>
                {[12, 3, 4].includes(formData.scheme_type) ? (
                  <div className="flex flex-col">
                    <label className="text-sm text-[#232323] mb-1 font-semibold">
                      Weight<span className="text-red-400"> * </span>
                      <span className="text-gray-400 text-sm">{`(min: ${formData.min_weight} - max: ${formData.max_weight})`}</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="weight"
                      value={formData.weight || ""}
                      onChange={filterInputchange}
                      onWheel={(e) => e.target.blur()}
                      className="border-[1px] border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter weight"
                    />
                    {errors?.weight && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.weight}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <label className="text-sm text-[#232323] mb-1 font-semibold">
                      Amount<span className="text-red-400"> * </span>
                      <span className="text-gray-400 text-sm">{`(min: ${formData.min_amount} - max: ${formData.max_amount})`}</span>
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount || ""}
                      onWheel={(e) => e.target.blur()}
                      onChange={filterInputchange}
                      className="border-[1px] border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter amount"
                    />
                    {errors?.amount && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.amount}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Payable Amount (for weight-based schemes) */}
        {selectedClassification === 3 &&
          schemefilter.length > 0 &&
          [12, 3, 4].includes(formData.scheme_type) && (
            <div className="flex flex-col">
              <label className="text-sm text-[#232323] mb-1 font-semibold">
                Payable Amount
              </label>
              <input
                type="text"
                name="amount"
                value={formData.amount || 0}
                disabled
                className="border-[1px] cursor-not-allowed border-gray-300 rounded-md p-2 w-full pr-16 bg-gray-100 focus:outline-none"
                placeholder="Payable Amount"
              />
            </div>
          )}

        {/* Account Name */}
        <div className="flex flex-col relative group">
          <label className="text-sm text-[#232323] mb-1 font-semibold">
            Account Name<span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="account_name"
              value={formData.account_name || ""}
              onChange={filterInputchange}
              onWheel={(e) => e.target.blur()}
              maxLength={15}
              className="border-[1px] border-[#f2f3f8] rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter Account Name"
              style={{ height: inputHeight }}
            />
            <span className="absolute right-0 top-0 w-9 h-full px-3 flex items-center justify-center text-sm text-[#232323] border-l">
              AC{acNumber}
            </span>
          </div>
          {errors?.account_name && (
            <div className="text-red-500 text-sm">{errors.account_name}</div>
          )}
        </div>

        {/* Total Installment */}
        {formData.scheme_type !== 10 && formData.scheme_type !== 14 && (
          <div className="flex flex-col">
            <label className="text-sm text-[#232323] mb-1 font-semibold">
              Total Installment<span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="total_installments"
              value={formData.total_installments || 0}
              className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
              placeholder="Enter Total Installment"
              disabled
            />
            {errors?.total_installments && (
              <div className="text-red-500 text-sm">{errors.total_installments}</div>
            )}
          </div>
        )}

        {/* Maturity Period */}
        <div className="flex flex-col">
          <label className="text-sm text-[#232323] mb-1 font-semibold">
            Maturity Period<span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="maturity_period"
            value={formData.maturity_period || 0}
            className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
            placeholder="Enter Maturity Month"
            disabled
          />
          {errors?.maturity_period && (
            <div className="text-red-500 text-sm">{errors.maturity_period}</div>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label className="text-sm text-[#232323] mb-1 font-semibold">
            Start Date<span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <DatePicker
              selected={formData.start_date ? new Date(formData.start_date) : null}
              onChange={handleStartDateChange}
              dateFormat="dd-MM-yyyy"
              placeholderText="Select Date"
              className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              wrapperClassName="w-full"
            />
            <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-14 h-[43px] justify-center items-center flex rounded-r-md pointer-events-none">
              <CalendarDays size={20} />
            </span>
          </div>
          {errors?.start_date && (
            <div className="text-red-500 text-sm">{errors.start_date}</div>
          )}
        </div>

        {/* Maturity Date */}
        {formData.id_scheme && (
          <div>
            <label className="text-sm text-[#232323] mb-1 font-semibold">
              Maturity Date<span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                disabled
                name="maturity_date"
                value={formData.maturity_date || ""}
                className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
                placeholder="Enter Maturity Date"
              />
            </div>
          </div>
        )}

        {/* Referral Section */}
        {!id && formData.referral_id === null && showReferral && (
          <>
            <div>
              <label className="text-sm text-[#232323] mb-1 font-semibold">
                Referral By{" "}
                {referralName && (
                  <span className="text-green-700">{referralName}</span>
                )}
              </label>
              <Select
                name="referral_type"
                options={referralRoles}
                value={referralRoles.find(
                  (role) => role.value === selectedRole
                )}
                onChange={(selectedOption) => {
                  setRole(selectedOption?.value || "");
                  setReferralName("");
                  setReferralid(null);
                }}
                styles={customStyles(true)}
                placeholder="Select Referral Type"
              />
            </div>
            <div className="relative">
              <label className="text-sm text-[#232323] mb-1 font-semibold">
                Search Referral Number
              </label>
              <div className="flex">
                <input
                  type="text"
                  maxLength={10}
                  value={searchmobile}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d+$/.test(value)) {
                      setSearchMobile(value);
                    }
                  }}
                  className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
                  placeholder="Enter mobile number or referral code"
                  disabled={!selectedRole}
                />
                <button
                  type="button"
                  disabled={!searchmobile || !selectedRole}
                  onClick={handleSearchmobile}
                  className="absolute flex items-center justify-center right-[0%] rounded-r-lg top-[68%] -translate-y-1/2 w-10 md:h-[43px] md:top-[44px] h-[62%] sm:right-0 sm:top-[68%] lg:right-[0%] bg-gray-100 hover:bg-gray-200"
                >
                  <Search size={20} className="text-[#6C7086]" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Form Actions */}
      <div className="bg-white p-2 mt-4">
        <div className="flex justify-end gap-5 mt-3">
          <button
            className={`text-white rounded-md text-sm font-semibold h-[36px] w-full md:w-24 bg-[#1e3b8b] disabled:bg-blue-400`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <SpinLoading /> : id ? "Update" : "Save"}
          </button>
          <button
            className="bg-[#E2E8F0] text-sm text-[#6C7086] font-semibold rounded-md h-[36px] w-full md:w-24 hover:bg-gray-200"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
      <Modal />
    </form>
  );
};

export default AddSchemeAccount;