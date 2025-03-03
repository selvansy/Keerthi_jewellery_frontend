import React, { useState, useEffect } from "react";
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
  getschemeById,
  updateschemeaccount,
  extendinstallment,
  addcloseSchemeAccount,
  revertschemeAccount,
  schemeaccountbyid,
  getallbranchscheme,
  getallbranchclassification,
  getemployeebybranch,
  getallbranch,
  getSchemeAccountCount
} from "../../../api/Endpoints";
import { useSelector, useDispatch } from "react-redux";
import { customSelectStyles } from "../../Setup/purity/index";

export function ExistingCustomer() {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_branch = roledata?.branch;

  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [branch, setBranch] = useState(id_branch);
  const [branchData, setBranchData] = useState([]);

  const { data: branchresponse, isLoading: loadingbranch } = useQuery({
    queryKey: ["branch", branch],
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
      search_mobile: formData.mobile,
    });
  };

  const { mutate: handlesearchcustomer } = useMutation({
    mutationFn: searchcustomermobile,
    onSuccess: (response) => {
      if (response) {
        dispatch(
          SetaccExp({
            customer_name:
              response.data.firstname + " " + response.data.lastname,
            address: response.data.address,
            id_branch: response.data.id_branch,
            mobile: response.data.mobile,
          })
        );
        setFormData((prev) => ({
          ...prev,
          customer_name: response.data.firstname + " " + response.data.lastname,
        }));
      }

      setLoading(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      setLoading(false);
    },
  });

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
          isLoading={loadingbranch}
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handlesearchcustomer({
                id_branch: formData.id_branch,
                search_mobile: formData.mobile,
              });
            }
          }}
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

const AddSchemeAccount = () => {
  let dispatch = useDispatch();

  const cusData = useSelector((state) => state.clientForm.accExp);
  const id_branch = cusData?.id_branch;

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const navigate = useNavigate();
  const location = useLocation();
  const todaydate = new Date();
  const { id } = useParams();
  const [start_date, setStartDate] = useState(todaydate);
  const [maturity_date, setMaturityDate] = useState("");
  const [maturity_period, setMaturityPeriod] = useState(0);
  const [total_installments, setTotalinstallments] = useState(0);
  const [fixedamt, setFixedAmt] = useState([]);
  const [searchmobile, setSearchMobile] = useState("");
  const [mobile, setMobile] = useState("");
  const [searcherror, setSearchError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [branch, setBranch] = useState(id_branch);
  const [branchData, setBranchData] = useState([]);
  const [header, setHeader] = useState("");
  const [returnRoute, setReturnRoute] = useState("");
  const [classifyfilter, setClassify] = useState([]);
  const [employeefilter, setEmployee] = useState([]);
  const [schemefilter, setScheme] = useState([]);
  const [errors, setErrors] = useState(null);
  const [ispayable, setIspayable] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState("");
  const [acNumber,setAcNumber]=useState(1)

  const { data: branchresponse} = useQuery({
    queryKey: ["branch", branch],
    queryFn: getallbranch,
  });

  useEffect(() => {
    return () => {
      dispatch(SetaccExp({}));
    };
  }, []);

  useEffect(() => {
    if (branchresponse) {
      setBranchData(branchresponse.data);
    }
  }, [branchresponse]);

  // useEffect(() => {

  //   if (id) {
  //     handleschemeaccountbyid({ id: id });
  //   }
  // }, [id])

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

  const [formData, setFormData] = React.useState({
    id_customer: cusData.customerId,
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
    amount: 0,
    scheme_type: 0,
    min_amount: 0,
    max_amount: 0,
    min_weight: 0,
    max_weight: 0,
    total_installments: total_installments,
    maturity_period: maturity_period,
    maturity_date: maturity_date,
    referral_id: "",
    installment_type:''
  });

  useEffect(() => {
    if (cusData) {
      handlesearchcustomer({
        id_branch: cusData.id_branch,
        search_mobile: cusData.mobile,
      });
    }

    handleClassifyChange();
  }, [cusData.mobile]);

  const handleSearchmobile = () => {
    setSearchError("");
    if (mobile === "") {
      toast.error("Mobile Number is required!");
    }
    handlesearchcustomer({
      id_branch: cusData.id_branch,
      search_mobile: cusData.mobile,
    });
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
          account_name: response.data.firstname + " " + response.data.lastname-AC+acNumber,
          address: response.data.address,
          customer_name: response.data.firstname + " " + response.data.lastname,
          total_installments: total_installments,
          amount: 0,
          scheme_type: 0,
          min_amount: 0,
          max_amount: 0,
          min_weight: 0,
          max_weight: 0,
          maturity_period: maturity_period,
          maturity_date: maturity_date,
          referral_id: "",
        });
      }
    },
  });

  const handleautocompletemobile = (e) => {
    const value = e.target.value;
    setMobile(value);
  };

  const filterInputchange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formData.scheme_type !== 6) {
      setFormData((prev) => ({ ...prev, amount: 0 }));
    }

    if(name === "account_name"){
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
  };

  const handleschemebyid = async (id) => {
    try {
      const countData = await getSchemeAccountCount(9360839984, id);
      const newAcNumber = countData.data !== 0 ? Number(countData.data) + 1 : 1;
  
      setAcNumber(newAcNumber);
  
      const schemeData = schemefilter.find((item) => String(item._id) === String(id));

      if (schemeData) {
        setFormData((prevState) => ({
          ...prevState,
          scheme_type: schemeData.scheme_type,
          total_installments: schemeData.total_installments,
          maturity_period: schemeData.maturity_period,
          installment_type: schemeData.installment_type,
        }));
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

      setFixedAmt(filteredData[0].fixed_amounts);
    }
  }, [formData.id_scheme]);

  useEffect(() => {
    if (formData.start_date && formData.maturity_period && formData.installment_type) {
      calculateMaturityDate(formData.start_date, formData.maturity_period, formData.installment_type);
    }
  }, [formData.id_scheme,formData.start_date, formData.maturity_period, formData.installment_type]);



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

    const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;

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
    }
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
    if (location.pathname === "/managecustomers/customer//add") {
      setHeader("Add Scheme Account");
      setReturnRoute("/managecustomers/customer/");
    } else if (location.pathname === "/manageaccount/digigold/add") {
      setHeader("Add Digi Gold Account");
      setReturnRoute("/manageaccount/digigold");
    }
  }, [location.pathname]);

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

    if (formData.maturity_date === "") {
      err["maturity_date"] = "Maturity Date is required";
    } else {
      err["maturity_date"] = "";
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
      console.log("Form has validation errors");
    }
  };
  const { mutate: createSchemeaccount } = useMutation({
    mutationFn: addschemeaccount,
    onSuccess: (response) => {
      toast.success(response.message);
      navigate("/managecustomers/customer/");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const { mutate: updateSchemeaccount } = useMutation({
    mutationFn: updateschemeaccount,
    onSuccess: (response) => {
      toast.success(response.message);
      navigate("/managecustomers/customer/");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  return (
    <>
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl text-gray-900 font-bold justify-between">
          {header}
        </h2>
      </div>
      <div className="w-full flex flex-col bg-white pl-8 pr-8 pb-4 mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="flex flex-col">
            <label className="text-black mb-1 font-normal">
              Branch<span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                name="id_branch"
                value={cusData.id_branch}
                onChange={(e) => {
                  filterInputchange(e);
                }}
                disabled
                className="appearance-none border bg-[#e5e7eb] border-gray-300 cursor-not-allowed rounded-md p-2 w-full pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">-- Select --</option>
                {branchData.map((branch) => (
                  <>
                    <option key={branch._id} value={branch._id}>
                      {branch.branch_name}
                    </option>
                  </>
                ))}
              </select>
              <p style={{ color: "red" }}>{errors?.id_branch}</p>
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
              Mobile Number<span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={cusData.mobile}
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
                value={cusData.customer_name}
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
                value={cusData.address}
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

                      if (scheme.min_weight !== 0 && scheme.max_weight !== 0) {
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
              {formData.id_classification === "67bad07b970bf1c652590b21" && (
                <div className="flex flex-col">
                  <label className="text-black mb-1 font-normal">
                    scheme Amounts<span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="amount"
                      value={formData.amount}
                      onChange={(e) => {
                        filterInputchange(e);
                      }}
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
              )}

              <div className="flex flex-col relative">
                <label className="text-black mb-1 font-normal">
                  Account Name<span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="account_name"
                  onChange={(e)=>filterInputchange(e)}
                  value={formData.account_name}
                  className="border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter Account Name"
                />
                <div
                  className="text-white absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[68%] -translate-y-1/2 w-10 md:h-[45px] md:top-[50px] h-[62%] sm:right-0 sm:top-[68%] lg:right-[0%]"
                  style={{ backgroundColor: layout_color }}
                >
                  AC{acNumber}
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
              {ispayable === true && (
                <div className="flex flex-col">
                  <label className="text-black mb-1 font-normal">
                    Payable<span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      min="1"
                      onChange={filterInputchange}
                      className="border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter Amount"
                    />
                    <span
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white w-14 h-[43px] justify-center items-center flex rounded-r-md"
                      style={{ backgroundColor: layout_color }}
                    >
                      INR
                    </span>
                  </div>
                  <p style={{ color: "red" }}>{errors?.amount}</p>
                </div>
              )}

              <div className="flex flex-col relative">
                <label className="text-black mb-1 font-normal">
                  Search Refferral Number<span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={mobile}
                  onChange={handleautocompletemobile}
                  className="border-2 border-gray-300 rounded-md p-2  focus:border-transparent"
                  placeholder="Enter Here"
                />

                {/* Search Icon */}
                <div
                  onClick={handleSearchmobile}
                  className="absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[68%] -translate-y-1/2 w-10 md:h-[43px] md:top-[50px] h-[62%] sm:right-0 sm:top-[68%] lg:right-[0%]"
                  style={{ backgroundColor: layout_color }}
                >
                  <Search size={20} className="text-white" />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-black mb-1 font-normal">
                  Referral By
                </label>
                <div className="relative">
                  <select
                    name="referral_id"
                    value={formData.referral_id}
                    onChange={filterInputchange}
                    className="appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    defaultValue=""
                  >
                    <option value="">--Select--</option>
                    {employeefilter.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.firstname + " " + employee.lastname}
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
              <div className="flex flex-col">
                <label className="text-black mb-1 font-normal">
                  Agent Collection By<span className="text-red-400"> *</span>
                </label>
                <div className="relative">
                  <select
                    name="collectionuserid"
                    value={formData.collectionuserid}
                    onChange={filterInputchange}
                    className="appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    defaultValue=""
                  >
                    <option value="">--Select--</option>
                    {employeefilter.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.firstname + " " + employee.lastname}
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
            </div>
          </div>

          <div className="bg-white p-2 border-t-2 border-gray-300 mt-4">
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
                style={{ backgroundColor: layout_color }}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddSchemeAccount;