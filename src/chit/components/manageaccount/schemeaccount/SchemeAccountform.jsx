import React, { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { CalendarDays, Search } from "lucide-react";
import { SetaccExp } from "../../../../redux/clientFormSlice";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
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
  getMetalRateByMetalId
} from "../../../api/Endpoints";
import { useSelector, useDispatch } from "react-redux";
import { customSelectStyles } from "../../Setup/purity/index";
import SpinLoading from "../../common/spinLoading";

export function ExistingCustomer({ setCusData,handleCusData }) {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_branch = roledata?.branch;

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
      id_customer: data._id,
      referral_id: data.referral_id,
    });
  };

  return (
    <div className="grid grid-rows-2 md:grid-cols-2 gap-2">
      <div className="flex flex-col">
        <label className="text-black mb-1 font-normal">
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
          customSelectStyles={customSelectStyles}
          isLoading={branchloading}
          placeholder="Select Branch"
        />
      </div>

      <div className="flex flex-col relative">
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
          className="absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[70%] -translate-y-1/2 w-10 md:h-[42px] md:top-[50px] h-[20%] sm:right-0 sm:top-[68%] lg:right-[0%]"
          style={{ backgroundColor: layout_color }}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <Search size={15} className="text-white" />
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-black mb-1 font-normal">
          Customer Name<span className="text-red-400">*</span>
        </label>
        <input
          readOnly
          type="text"
          name="customer_name"
          value={formData.customer_name}
          className="border-2 w-full bg-[#e8f0fe] border-gray-300 cursor-not-allowed rounded-md p-2 pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="Enter name"
        />
      </div>
    </div>
  );
}

const AddSchemeAccount = ({ cusData, handleClear }) => {
  let dispatch = useDispatch();
  console.log("cusData---",cusData)
  const id_branch = cusData?.id_branch;

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const todaydate = new Date();

  const [isLoading, setLoading] = useState(false);
  const [start_date, setStartDate] = useState(todaydate);
  const [maturity_date, setMaturityDate] = useState("");
  const [maturity_period, setMaturityPeriod] = useState(0);
  const [total_installments, setTotalinstallments] = useState(0);
  const [fixedamt, setFixedAmt] = useState([]);
  const [mobile, setMobile] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [header, setHeader] = useState("");
  const [classifyfilter, setClassify] = useState([]);
  const [schemefilter, setScheme] = useState([]);
  const [errors, setErrors] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState("");
  const [acNumber, setAcNumber] = useState(1);
  const [referralName, setReferralName] = useState("");
  const referralRoles = [
    { id: 1, role: "Employee", endpoint: getEmployeeByMobile },
    { id: 2, role: "Customer", endpoint: getCustomerByMobile },
  ]; // keep this role format
  const [searchmobile, setSearchMobile] = useState("");
  const [selectedRole, setRole] = useState("");
  const [selectedClassification, setClassification] = useState("");
  const [id_metal,setMetal]=useState('')
  const [id_purity,setPurity]= useState('')
  const [metalRate,setMetalRate]= useState(0)
console.log(cusData)
  //* TODO use formik insted of formData
  const [formData, setFormData] = React.useState({
    id_customer: cusData.id_customer || "",
    mobile: cusData.mobile,
    start_date: start_date,
    id_classification: "",
    collectionuserid: "",
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
    total_installments: total_installments,
    maturity_period: maturity_period,
    maturity_date: maturity_date,
    referral_id: "",
    referral_type: "",
    installment_type: "",
    code: 0,
    scheme_count_number: "",
  });

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
    const scheme = async () => {
      const schemeData = await getschemeaccountbyid(id);
      if (schemeData) {
        handleschemebyclassification(schemeData.data.id_classification._id);
        if (schemeData.data.id_classification.order === 2) {
          setSelectedScheme("Fixed");
          handleschemebyclassification(
            schemeData?.data?.id_classification?._id
          );
        }
        console.log(schemeData)
        setFormData({
          id: schemeData.data._id,
          id_scheme: schemeData.data.id_scheme._id,
          scheme_type: schemeData.data.id_scheme.scheme_type,
          total_installments: schemeData.data.id_scheme.total_installments,
          min_amount: schemeData.data.id_scheme.min_amount,
          max_amount: schemeData.data.id_scheme.max_amount,
          min_weight: schemeData.data.id_scheme.min_weight,
          max_weight: schemeData.data.id_scheme.max_weight,
          id_customer: schemeData.data.id_customer._id,
          scheme_acc_number: schemeData.data.scheme_acc_number,
          start_date: schemeData.data.start_date,
          id_classification: schemeData.data.id_classification._id,
          collectionuserid: schemeData.data.collectionuserid,
          id_branch: schemeData.data.id_branch._id,
          account_name: schemeData.data.account_name,
          // customer_name:
          //   schemeData.data.id_customer.firstname +
          //   " " +
          //   schemeData.data.id_customer.lastname,
          mobile: schemeData.data.id_customer.mobile,
          address: schemeData.data.id_customer.address,
          amount: schemeData.data.amount,
          maturity_period: schemeData.data.id_scheme.maturity_period,
          maturity_date: schemeData.data.maturity_date,
          referral_id: schemeData.data.referral_id,
          customer_name: schemeData.data.id_customer
            ? `${schemeData.data.id_customer.firstname} ${schemeData.data.id_customer.lastname}`
            : "",
        });
        setAcNumber(schemeData.data.scheme_count_number);
      }
    };
    scheme();
  }, [id]);

  // const handleschemeaccountbyid = async (data) => {
  //   if (!data) return;
  //   const response = await getschemeaccountbyid(data);
  //   if (response) {
  //     if (response.data.scheme_type === 6) {
  //       setIspayable(true);
  //     } else {
  //       setIspayable(false);
  //     }

  //     handleClassifyChange(response.data.id_branch._id);
  //     handleemployeebyBranch(response.data.id_branch._id);
  //     getemployeebybranch(response.data.id_branch._id);
  //     handleschemebyclassification(response.data.id_scheme.id_classification);

  //     setFormData({
  //       id: response.data._id,
  //       id_scheme: response.data.id_scheme._id,
  //       scheme_type: response.data.id_scheme.scheme_type,
  //       total_installments: response.data.id_scheme.total_installments,
  //       min_amount: response.data.id_scheme.min_amount,
  //       max_amount: response.data.id_scheme.max_amount,
  //       min_weight: response.data.id_scheme.min_weight,
  //       max_weight: response.data.id_scheme.max_weight,
  //       id_customer: response.data.id_customer._id,
  //       scheme_acc_number: response.data.scheme_acc_number,
  //       start_date: response.data.start_date,
  //       id_classification: response.data.id_classification._id,

  //       collectionuserid: response.data.collectionuserid,
  //       id_branch: response.data.id_branch._id,
  //       account_name: response.data.account_name,
  //       customer_name:
  //         response.data.id_customer.firstname +
  //         " " +
  //         response.data.id_customer.lastname,
  //       mobile: response.data.id_customer.mobile,
  //       address: response.data.id_customer.address,
  //       amount: response.data.amount,
  //       maturity_period: response.data.id_scheme.maturity_period,
  //       maturity_date: response.data.maturity_date,
  //       referral_id: response.data.referral_id,
  //     });
  //     setTotalinstallments(response.data.id_scheme.total_installments);
  //     setMaturityPeriod(response.data.id_scheme.maturity_period);
  //     setMaturityDate(response.data.id_scheme.maturity_date);
  //     setMobile(response.data.id_customer.mobile);

  //     handleStartDateChange(response.data.start_date);
  //   } else {
  //     toast.error("Customer not created!");
  //   }
  // };

  useEffect(() => {
    if (cusData) {
      handlesearchcustomer({
        id_branch: cusData.id_branch,
        search_mobile: cusData.mobile,
      });
    }

    handleClassifyChange();
  }, [cusData.mobile]);

  // const handleSearchmobile = async() => {
  //   referralRoles.forEach(element => {
  //       if(formData.referral_type === element.role){
  //           const data = await element.endpoint(searchmobile)
  //       }
  //   });
  //   // setSearchError("");
  //   // if (mobile === "") {
  //   //   toast.error("Mobile Number is required!");
  //   // }
  //   // handlesearchcustomer({
  //   //   id_branch: cusData.id_branch,
  //   //   search_mobile: cusData.mobile,
  //   // });
  // };

  const handleSearchmobile = async () => {
    try {
      if (Number(searchmobile) === Number(cusData.mobile)) {
        return toast.error("Self referral is not allowed");
      }
      const matchingRole = referralRoles.find(
        (element) => Number(selectedRole) === element.id
      );

      if (matchingRole) {
        const data = await matchingRole.endpoint(searchmobile);
        setReferralName(`${data.data.firstname} ${data.data.lastname}`);
        setFormData((prev) => ({
          ...prev,
          referral_type: matchingRole.role,
          referral_id: data?.data?._id,
        }));
      } else {
        console.warn("No matching referral role found!");
      }
    } catch (error) {
      console.error("Error fetching search mobile data:", error);
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
          collectionuserid: "",
          scheme_acc_number: "",
          id_scheme: "",
          id_branch: id_branch,
          account_name:
            response.data.firstname +
            " " +
            response.data.lastname -
            AC +
            acNumber,
          address: response.data.address,
          customer_name: response.data.firstname + " " + response.data.lastname,
          total_installments: total_installments,
          amount: "",
          weight: "",
          scheme_type: 0,
          min_amount: 0,
          max_amount: 0,
          min_weight: 0,
          max_weight: 0,
          maturity_period: maturity_period,
          maturity_date: maturity_date,
          referral_id: "",
          code: 0,
          scheme_count_number: "",
        });
      }
    },
  });

  // const handleautocompletemobile = (e) => {
  //   const value = e.target.value;
  //   setMobile(value);
  // };

  const filterInputchange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "referral_type") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "account_name") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "id_branch") {
      if (value !== "") {
        handleClassifyChange(value);
        handleemployeebyBranch(value);
        getemployeebybranch({ id_branch: value });
      }
    }

    if (name === "id_classification") {
      handleschemebyclassification(value);
    }

    if (name === "id_scheme") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      handleschemebyid(value);
    }

    if (name === "weight") {
      setErrors((prevState) => {
        const newErrors = { ...prevState };
    
        if (value === "") {
          delete newErrors.weight;
        } else if (value < formData.min_weight) {
          newErrors.weight = "Weight can't be less than min weight";
        } else if (value > formData.max_weight) {
          newErrors.weight = "Weight can't be more than max weight";
        } else {
          delete newErrors.weight;
        }
    
        return newErrors;
      });
    }

    if (name === "amount" && selectedClassification === 3) {
      setErrors((prevState) => {
        const newErrors = { ...prevState };
    
        if (value === "") {
          delete newErrors.amount;
        } else if (value < formData.min_amount) {
          newErrors.amount = "Amount can't be less than min amount";
        } else if (value > formData.max_amount) {
          newErrors.amount = "Amount can't be more than max amount";
        } else {
          delete newErrors.amount;
        }
    
        return newErrors;
      });
    }
    
  };

  // const handleschemebyid = async (id) => {
  //   try {
  //     const countData = await getSchemeAccountCount(formData.mobile, id);
  //     const newAcNumber = countData.data !== 0 ? Number(countData.data) + 1 : 1;

  //     setAcNumber(newAcNumber);
  //     const schemeData = schemefilter.find(
  //       (item) => String(item._id) === String(id)
  //     );

  //     if (schemeData) {
  //       setFormData((prevState) => ({
  //         ...prevState,
  //         scheme_type: schemeData?.scheme_type,
  //         total_installments: schemeData?.total_installments,
  //         maturity_period: schemeData?.maturity_period,
  //         installment_type: schemeData?.installment_type,
  //         code: schemeData?.code,
  //       }));
  //       if ([12, 3, 4, 2, 5, 6].includes(schemeData.scheme_type)) {
  //         setFormData((prevData) => ({
  //           ...prevData,
  //           max_weight: schemeData?.max_weight,
  //           min_weight: schemeData?.min_weight,
  //         }));
  //       } else {
  //         setFormData((prevData) => ({
  //           ...prevData,
  //           max_amount: schemeData?.max_amount,
  //           min_amount: schemeData?.min_amount,
  //         }));
  //       }
  //     } else {
  //       console.warn("No matching scheme found for ID:", id);
  //     }
  //   } catch (error) {
  //     console.error("Error handling scheme by ID:", error);
  //   }
  // };
  const handleschemebyid = async (id) => {
    try {
      const countData = await getSchemeAccountCount(formData.mobile, id);
      const newAcNumber = countData.data !== 0 ? Number(countData.data) + 1 : 1;

      setAcNumber(newAcNumber);
      const schemeData = schemefilter.find(
        (item) => String(item._id) === String(id)
      );

      if (schemeData) {
        setMetal(schemeData?.id_metal)
        setPurity(schemeData?.id_purity)
        setFormData((prevState) => ({
          ...prevState,
          scheme_type: schemeData?.scheme_type,
          total_installments: schemeData?.total_installments,
          maturity_period: schemeData?.maturity_period,
          installment_type: schemeData?.installment_type,
          code: schemeData?.code,
        }));

        if ([12, 3, 4].includes(schemeData.scheme_type)) {
          setFormData((prevData) => ({
            ...prevData,
            min_weight: schemeData?.min_weight,
            max_weight: schemeData?.max_weight,
            min_amount: 0,
            max_amount: 0,
          }));
        } else {
          setFormData((prevData) => ({
            ...prevData,
            min_amount: schemeData?.min_amount,
            max_amount: schemeData?.max_amount,
            min_weight: 0,
            max_weight: 0,
          }));
        }
      } else {
        console.warn("No matching scheme found for ID:", id);
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

      setFixedAmt(filteredData[0]?.fixed_amounts);
    }
  }, [formData.id_scheme, schemefilter]);

  useEffect(() => {
    if (
      formData.start_date &&
      formData.maturity_period &&
      formData.installment_type
    ) {
      calculateMaturityDate(
        formData.start_date,
        formData.maturity_period,
        formData.installment_type
      );
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

    const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;

    setMaturityDate(formattedDate);

    setFormData((prev) => ({ ...prev, maturity_date: formattedDate }));
  }

  const handleemployeebyBranch = async (id_branch) => {
    if (!id_branch) return;
    const response = await getemployeebybranch({ id_branch: id_branch });
    if (response) {
      setEmployee(response.data);
    }
  };

  const { mutate: handleschemebyclassification } = useMutation({
    mutationFn: (id) => geallschemebyclassification(id),
    onSuccess: (response) => {
      if (response) {
        setScheme(response.data);
      }
    },
  });

  const { mutate: handleClassifyChange } = useMutation({
    mutationFn: getallbranchclassification,
    onSuccess: (response) => {
      if (response) {
        setClassify(response.data);
      }
    },
  });

  const handleSelectNumber = (number) => {
    setMobile(number);
    setSuggestions([]);
  };

  useEffect(() => {
    // if (location.pathname === "/managecustomers/addschemeaccount/") {
    //   setHeader("Add Scheme Account");
    //   setReturnRoute("/managecustomers/customer/");
    // }
    // else if (location.pathname === "/manageaccount/digigold/add") {
    //   setHeader("Add Digi Gold Account");
    //   setReturnRoute("/manageaccount/digigold");
    // }
    if (id) {
      setHeader("Edit Scheme Account");
    } else {
      setHeader("Add Scheme Account");
    }
  }, [location.pathname, id]);

  const handleCancel = () => {
    navigate("/managecustomers/customer/");
  };

  const handleAddCustomer = () => {
    navigate("/manageaccount/addcustomer");
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setFormData((prev) => ({ ...prev, start_date: date }));

    const start = new Date(date);
    start.setMonth(start.getMonth() + formData.maturity_period);

    const day = String(start.getDate()).padStart(2, "0");
    const month = String(start.getMonth() + 1).padStart(2, "0");
    const year = start.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    // setMaturityDate(formattedDate);
    // setFormData((prev) => ({ ...prev, maturity_date: formattedDate }));
  };

  const isValidForm = () => {
    const err = {};

    if (formData.id_branch === "id_branch") {
      err["id_branch"] = "Branch is required";
    } else {
      err["id_branch"] = "";
    }

    if (formData.id_classification === "") {
      err["id_classification"] = "Classification is required";
    } else {
      err["id_classification"] = "";
    }

    if (formData.id_scheme === "") {
      err["id_scheme"] = "Scheme is required";
    } else {
      err["id_scheme"] = "";
    }

    if (formData.start_date === "") {
      err["start_date"] = "Start Date is required";
    } else {
      err["start_date"] = "";
    }
    if (formData.account_name === "") {
      err["account_name"] = "Account Name is required";
    } else {
      err["account_name"] = "";
    }
    if (formData.customer_name === "") {
      err["customer_name"] = "Customer Name is required";
    } else {
      err["id_branch"] = "";
    }

    if (formData.total_installments === "") {
      err["total_installments"] = "Total Installment is required";
    } else {
      err["total_installments"] = "";
    }

    if (formData.maturity_period === "") {
      err["maturity_period"] = "Maturity month is required";
    } else {
      err["maturity_period"] = "";
    }

    if (!formData.maturity_period && formData.maturity_period !== 0) {
      err["maturity_period"] = "Maturity month is required";
    } else {
      err["maturity_period"] = "";
    }

    setErrors((prevState) => ({
      ...prevState,
      ...err,
    }));
    const hasErrors = Object.values(err).some((error) => error.length > 0);

    return !hasErrors;
  };

  const inputHeight = "42px";

  const onSubmit = (e) => {
    e.preventDefault();

    if (isValidForm()) {
      if (id) {
        setLoading(true);
        updateSchemeaccount(formData);
      } else {
        setFormData((prev) => ({
          ...prev,
          scheme_count_number: acNumber,
        }));
        setLoading(true);
        createSchemeaccount(formData);
      }
    } else {
      console.log("Form has validation errors");
    }
  };

  const { mutate: createSchemeaccount } = useMutation({
    mutationFn: addschemeaccount,
    onSuccess: (response) => {
      toast.success(response.message);
      setLoading(false);
      handleClear();
      navigate("/managecustomers/customer/");
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.response.data.message);
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
      toast.error(error.response.data.message);
    },
  });

  useEffect(()=>{
    if(selectedClassification === 3 && [12,3,4].includes(formData.scheme_type)){
      const fetchMetalRate = async () => {
        const branchId = formData.id_branch || id_branch;
  
        try {
          const metalRate = await getMetalRateByMetalId(
            id_metal|| "",
            id_purity || "",
            todaydate,
            branchId
          );
  
          if (metalRate) {
            const rate = metalRate.data.rate;
            setMetalRate(rate);
            // formik.setFieldValue("metal_rate", rate);
          }
        } catch (error) {
          console.error("Error fetching metal rate:", error);
        }
      };
      fetchMetalRate();
    }
  },[selectedClassification,formData.scheme_type])

  useEffect(()=>{
    if(formData.weight && [12,3,4].includes(formData.scheme_type) && !errors.weight){
      const outputAmount = metalRate * formData.weight
       if(outputAmount > 0){
        setFormData((prev) => ({
          ...prev,
           amount:outputAmount,
        }));
       }else{
        setFormData((prev) => ({
          ...prev,
           amount:0,
        }));
       }
    }else{
      setFormData((prev) => ({
        ...prev,
         amount:0,
      }));
    }
  },[formData.weight])

  return (
    <>
      <div className="flex flex-row justify-between">
        {!cusData && (
          <h2 className="text-2xl text-gray-900 font-bold justify-between">
            {header}
          </h2>
        )}
      </div>
      <div
        className={`w-full flex flex-col bg-white pl-8 pr-8 pb-4  ${
          !cusData && "border-[#023453] border-t-2 h-[calc(100vh-200px)]"
        } mt-3 overflow-y-auto scrollbar-hide `}
      >
        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <div className="flex flex-col">
            <label className="text-black mb-1 font-medium">
              Branch<span className="text-red-400">*</span>
            </label>

            <Select
              options={branchData}
              value={
                branchData.find(
                  (option) => option.value === cusData.id_branch
                ) || formData.id_branch
              }
              onChange={(option) =>
                formik.setFieldValue("id_branch", option?.value || "")
              }
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
              styles={customSelectStyles}
              isLoading={branchloading}
              isDisabled={id_branch !== "0"}
              placeholder="Select Branch"
            />

            {errors?.id_branch && (
              <div style={{ color: "red" }}>{errors?.id_branch}</div>
            )}
          </div>

          <div className="flex flex-col relative">
            <label className="text-black mb-1 font-normal">
              Mobile Number<span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={cusData.mobile || formData.mobile}
              name="mobile"
              className="border-2 bg-[#e5e7eb] cursor-not-allowed border-gray-300 rounded-md p-2  focus:border-transparent"
              placeholder="Enter Here"
              readOnly
            />
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-5">
          <div className="grid grid-rows md:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-black mb-1 font-normal">
                Customer Name<span className="text-red-400">*</span>
              </label>
              <input
                readOnly
                type="text"
                name="customer_name"
                value={cusData.customer_name || formData.customer_name}
                className="border-2 bg-[#e5e7eb] w-full order-gray-300 cursor-not-allowed rounded-md p-2 pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter name"
              />
              <p style={{ color: "red" }}>{errors?.customer_name}</p>
            </div>

            <div className="flex flex-col">
              <label className="text-black mb-1 font-normal">Address</label>
              <input
                readOnly
                type="text"
                name="address"
                value={cusData.address || formData.address}
                className="border-2 bg-[#e5e7eb] border-gray-300 cursor-not-allowed rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter address"
              />
            </div>
          </div>

          <div className="flex flex-col mt-5">
            <div className="grid grid-rows-2 md:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="text-black mb-1 font-normal">
                  Scheme Classification<span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="id_classification"
                    value={formData.id_classification}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selectedOption = classifyfilter.find(
                        (classify) => classify._id === selectedId
                      );

                      if (selectedOption) {
                        setClassification(selectedOption.order);
                        setSelectedScheme(selectedOption.name);
                      }

                      filterInputchange(e);
                    }}
                    className="appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    defaultValue=""
                  >
                    <option value="">--Select--</option>
                    {classifyfilter.map((classify) => (
                      <option key={classify._id} value={classify._id}>
                        {classify.name}
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
                <p style={{ color: "red" }}>{errors?.id_classification}</p>
              </div>
              <div className="flex flex-col">
                <label className="text-black mb-1 font-normal">
                  Scheme<span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="id_scheme"
                    value={formData.id_scheme}
                    onChange={filterInputchange}
                    className="appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    defaultValue=""
                  >
                    <option value="">--Select--</option>
                    {schemefilter.map((scheme) => {
                      let displayValue = scheme.scheme_name;

                      if (
                        [3, 4, 12].includes(scheme.scheme_type) &&
                        scheme.min_weight !== 0 &&
                        scheme.max_weight !== 0
                      ) {
                        displayValue += ` (${scheme.min_weight} - ${scheme.max_weight} GRM)`;
                      } else if (
                        scheme.min_amount !== 0 &&
                        scheme.max_amount !== 0
                      ) {
                        displayValue += ` (Rs. ${scheme.min_amount} - Rs. ${scheme.max_amount})`;
                      } else if (scheme.amount !== null) {
                        displayValue += ` (Rs. ${scheme.amount})`;
                      }

                      return (
                        <option key={scheme._id} value={scheme._id}>
                          {displayValue}
                        </option>
                      );
                    })}
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
                <p style={{ color: "red" }}>{errors?.id_scheme}</p>
              </div>
              {selectedScheme === "Fixed" ? (
                <div className="flex flex-col">
                  <label className="text-black mb-1 font-normal">
                    Scheme{" "}
                    {[12, 3, 4].includes(formData.scheme_type)
                      ? "Weights"
                      : "Amounts"}
                    <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name={
                        [12, 3, 4].includes(formData.scheme_type)
                          ? "weight"
                          : "amount"
                      }
                      value={(() => {
                        if ([12, 3, 4].includes(formData.scheme_type)) {
                          return formData.weight || "";
                        }
                        return formData.amount || "";
                      })()}
                      onChange={(e) => filterInputchange(e)}
                      className="appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      defaultValue=""
                    >
                      <option value="">--Select--</option>
                      {fixedamt?.map((amount) => (
                        <option key={amount} value={amount}>
                          {amount}
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
                  <p style={{ color: "red" }}>{errors?.id_classification}</p>
                </div>
              ) : (
                <>
                  {selectedClassification === 3 ? (
                    <>
                      {[12, 3, 4].includes(formData.scheme_type) ? (
                        <div className="flex flex-col">
                          <label className="text-black mb-1 font-normal">
                            Weight<span className="text-red-400"> * </span>
                            <span className="text-gray-400 text-sm">{`(min: ${formData.min_weight} - max: ${formData.max_weight})`}</span>
                          </label>
                          <input
                            type="number"
                            name="weight"
                            defaultValue={""}
                            value={formData.weight}
                            onChange={(e) => filterInputchange(e)}
                            onWheel={(e) => e.target.blur()}
                            className="border-2 cursor-not-allowed border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="Enter weight"
                          />
                          <p className='text-sm mt-2' style={{ color: "red" }}>{errors?.weight}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <label className="text-black mb-1 font-normal">
                            Amount<span className="text-red-400"> * </span>
                            <span className="text-gray-400 text-sm">{`(min: ${formData.min_amount} - max: ${formData.max_amount})`}</span>
                          </label>
                          <input
                            type="number"
                            name="amount"
                            defaultValue={""}
                            value={formData.amount}
                            onWheel={(e) => e.target.blur()}
                            onChange={(e) => filterInputchange(e)}
                            className="border-2 cursor-not-allowed border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="Enter amount"
                          />
                          <p className='text-sm mt-2' style={{ color: "red" }}>{errors?.amount}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col">
                        <label className="text-black mb-1 font-normal">
                          {[12, 3, 4].includes(formData.scheme_type)
                            ? "Min weight"
                            : "Min amount"}{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="total_installments"
                          value={formData.min_amount || formData.min_weight}
                          className="border-2 cursor-not-allowed border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="Enter Total Installment"
                        />
                        <p style={{ color: "red" }}>
                          {errors?.total_installments}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-black mb-1 font-normal">
                          {[12, 3, 4].includes(formData.scheme_type)
                            ? "Max weight"
                            : "Max amount"}
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="total_installments"
                          value={formData.max_amount || formData.max_weight}
                          className="border-2 cursor-not-allowed border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="Enter Total Installment"
                          disabled
                        />
                        <p style={{ color: "red" }}>
                          {errors?.total_installments}
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}
              <>
                {selectedClassification === 3 &&
                  [12, 3, 4].includes(formData.scheme_type) && (
                    <div className="flex flex-col">
                      <label className="text-black mb-1 font-normal">
                        Payable Amount
                      </label>
                      <input
                        type="text"
                        name="amount"
                        value={formData.amount}
                        disabled
                        className="border-2 cursor-not-allowed border-gray-300 rounded-md p-2 w-full pr-16 bg-gray-100 focus:outline-none"
                        placeholder="Payable Amount"
                      />
                      {errors?.amount && (
                        <p style={{ color: "red" }}>
                          {errors.amount}
                        </p>
                      )}
                    </div>
                  )}
              </>
              <div className="flex flex-col relative group">
                <label className="text-black mb-1 font-normal">
                  Account Name<span className="text-red-400">*</span>
                </label>
                {/* <div className="relative w-full">
                  <input
                    type="text"
                    name="account_name"
                    onChange={(e) => filterInputchange(e)}
                    value={formData.account_name}
                    className="border-2 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border focus:border-gray-500"
                    placeholder="Enter Account Name"
                  />
                  <div
                    className="text-black bg-white absolute flex items-center border-2 justify-center cursor-pointer inset-y-1/2 -translate-y-[22px] translate-x-[0px] right-0 rounded-r-lg w-10  
      border-gray-300 group-focus-within:border group-focus-within:border-gray-500 group-focus-within:ring-1 group-focus-within:ring-gray-500"
                  >
                    AC{acNumber}
                  </div>
                </div> */}
                <div className="relative">
                  <input
                    type="text"
                    name="account_name"
                    value={formData.account_name}
                    onChange={(e) => filterInputchange(e)}
                    onWheel={(e) => e.target.blur()}
                    // onBlur={formik.handleBlur}
                    className="border-2 border-[#f2f3f8] rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Account Name"
                    style={{ height: inputHeight }}
                  />
                  <span className="absolute right-0 top-0 w-9 h-full px-3 flex items-center justify-center text-black border-l">
                    AC{acNumber}
                  </span>
                </div>
                <p style={{ color: "red" }}>{errors?.account_name}</p>
              </div>
              {/* {parseInt(isaccountno) === 1 && (
                <div className="flex flex-col">
                  <label className="text-black mb-1 font-normal">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="scheme_acc_number"
                    onChange={(e) => {
                      filterInputchange(e);
                    }}
                    value={formData.scheme_acc_number}
                    className="border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Account Number"
                  />
                </div>
              )} */}

              <div className="flex flex-col">
                <label className="text-black mb-1 font-normal">
                  Total Installment<span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="total_installments"
                  value={formData.total_installments}
                  className="border-2 cursor-not-allowed border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter Total Installment"
                  disabled
                />
                <p style={{ color: "red" }}>{errors?.total_installments}</p>
              </div>

              <div className="flex flex-col">
                <label className="text-black mb-1 font-normal">
                  Maturity Period<span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="maturity_period"
                  value={formData.maturity_period}
                  className="border-2 cursor-not-allowed border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter Maturity Month"
                  disabled
                />
                <p style={{ color: "red" }}>{errors?.maturity_period}</p>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 mb-1 font-normal">
                  Start Date<span className="text-red-400">*</span>
                </label>
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
              <div className="flex flex-col">
                <label className="text-black mb-1 font-normal">
                  Maturity Date<span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    name="maturity_date"
                    value={formData.maturity_date}
                    className="border-2 cursor-not-allowed border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Maturity Date"
                  />
                </div>
                <p style={{ color: "red" }}>{errors?.maturity_date}</p>
              </div>

              {!id && cusData.referral_id === null && (
                <>
                  <div className="flex flex-col">
                    <label className="text-black mb-1 font-normal">
                      Referral By{" "}
                      {referralName && (
                        <span className="text-green-700">{referralName}</span>
                      )}
                    </label>
                    <div className="relative">
                      <select
                        name="referral_type"
                        value={selectedRole}
                        onChange={(e) => setRole(e.target.value)}
                        className="appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        defaultValue=""
                      >
                        <option value="">--Select--</option>
                        {referralRoles.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.role}
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
                  </div>
                  <div className="flex flex-col relative">
                    <label className="text-black mb-1 font-normal">
                      Search Refferral Number
                      {/* <span className="text-red-400">*</span> */}
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={searchmobile}
                      onChange={(e) => {
                        if (Number(e.target.value) || e.target.value == "") {
                          setSearchMobile(e.target.value);
                        }
                      }}
                      className="border-2 border-gray-300 rounded-md p-2  focus:border-transparent"
                      placeholder="Enter mobile number or referral code"
                    />

                    {/* Search Icon */}
                    <div
                      disabled={searchmobile === ""}
                      onClick={handleSearchmobile}
                      onKeyDown={(e) => {
                        e.preventDefault();
                        if (e) {
                          console.log(e.key);
                        }
                      }}
                      className="absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[68%] -translate-y-1/2 w-10 md:h-[43px] md:top-[50px] h-[62%] sm:right-0 sm:top-[68%] lg:right-[0%]"
                      style={{ backgroundColor: layout_color }}
                    >
                      <Search size={20} className="text-white" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white p-2  mt-4">
            {/* border-t-2 border-gray-300 */}
            <div className="flex justify-end gap-2 mt-3">
              <button
                className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className=" text-white rounded-md p-2 w-full lg:w-20"
                type="submit"
                disabled={isLoading}
                style={{ backgroundColor: layout_color }}
              >
                {isLoading ? <SpinLoading /> : id ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddSchemeAccount;
