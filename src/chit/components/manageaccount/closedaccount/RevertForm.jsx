import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getallbranch,schemeAccByCusIdSchmeId,revertschemeAccount,customSearchScheme} from "../../../api/Endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Select from "react-select";
import customSelectStyles from "../../common/customSelectStyles";
import SpinLoading from "../../common/spinLoading";
import { CalendarDays, CalendarSearch, Search, Send } from "lucide-react";

function RevertForm({ setIsOpen, isviewOpen }) {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);
  const [branchData, setBranchData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customerName, setName] = useState("");
  const [schemedata, setSchemeData] = useState([]);
  const [fullData, setFullData] = useState([]);

  // Customisations for react-select
 const customStyles = (isReadOnly) => ({
    control: (base, state) => ({
      ...base,
      minHeight: "44px", //42px
      backgroundColor: "white",
      color:"#232323",
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
      "input[type='text']:focus": { boxShadow: 'none' },
      }),
      option:(base,state)=>({
        ...base,
        backgroundColor: state.isSelected ? "#F0F7FE" : state.isFocused ? "#F0F7FE" : "white",
        color:"#232323",
        fontWeight:"500",
        fontSize:"14px"
      })
    });


  // Form validation schema
  const validationSchema = Yup.object({
    id_branch: Yup.string().required("Branch is required"),
    mobile: Yup.string()
      .matches(/^\d{10}$/, "Mobile number should be exactly 10 digits")
      .required("Mobile number is required"),
    scheme_account: Yup.string()
      .required("Scheme account number is required"),
    bill_no: Yup.string().required("Bill number is required"),
    bill_date: Yup.string().required("Bill date is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      id_branch: "",
      id_customer:'',
      mobile: "",
      scheme_account: "",
      bill_no: "",
      bill_date: "",
      close_acc_id:''
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        revertAccount({id:values.close_acc_id});
      } catch (error) {
        toast.error(error.response?.data?.message || "Error submitting form");
      }
    },
  });

  //api calls
  const { data: branchResponse, isLoading: loadingBranch } = useQuery({
    queryKey: ["branch"],
    queryFn: getallbranch,
  });

  const { mutate: revertAccount } = useMutation({
    mutationFn: ({id})=>revertschemeAccount(id),
    onSuccess: (response) => {
      setIsLoading(false);
      toast.success(response.message);
      setIsOpen(!isviewOpen)
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.response.message);
    },
  });

  //useEffects
  useEffect(() => {
    if (branchResponse) {
      const branchOptions = branchResponse.data.map((branch) => ({
        value: branch._id,
        label: branch.branch_name,
      }));
      setBranchData(branchOptions);
    }
  }, [branchResponse]);

  //handler function
  const handleSearchMobile = async () => {
    if (!formik.values.mobile) {
      toast.error("Mobile Number is required!");
      return;
    }
    setName("");
    const data = {
      search_mobile: formik.values.mobile,
      id_branch:formik.values.id_branch,
      status:[3,1,4]
    }

    const status = ['','Closed','',"Pre-closed","Refund"]
    const customerData = await customSearchScheme(data);

    if(customerData.data && customerData.data.length == 0){
      return toast.error("No account found to revert")
    }

    if (customerData.data && customerData.data.length > 0) {
      formik.setFieldValue('id_customer',customerData?.data[0]?.id_customer?._id)
      setName(
        `${customerData?.data[0]?.id_customer?.firstname} ${customerData?.data[0]?.id_customer?.lastname}`
      );
      const output = customerData.data
      const data = output
      .filter(item => [3, 1, 4].includes(item.status))
      .map(item => ({
        value: item.scheme_acc_number,
        label: item.scheme_name,
        status: status[item.status]
      }));

      if(data.length <=0 ){
        return toast.error('No closed accounts found')
      }    
      setSchemeData(data);
      setFullData(output);
    } 
    
  };

  useEffect(()=>{
    if(formik.values.scheme_account !== ""){
      handleClosedSchemeAcc()
    }
  },[formik.values.scheme_account])

  const handleClosedSchemeAcc = async () => {
      if(formik.values.id_customer && formik.values.scheme_account){
        const cusId= formik.values.id_customer
        const schemeAccNumber = formik.values.scheme_account
         const closeAccData = await schemeAccByCusIdSchmeId(cusId,schemeAccNumber)
         if(closeAccData && closeAccData.data){
            formik.setFieldValue('bill_no',closeAccData.data.bill_no)
            formik.setFieldValue('bill_date',closeAccData.data.bill_date)
            formik.setFieldValue('close_acc_id',closeAccData?.data?._id)
         }
      }
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Branch Select Field */}
        <div className="flex flex-col">
          <label className="text-black mb-1 font-medium">
            Branch<span className="text-red-400"> *</span>
          </label>
          <Select
            options={branchData}
            value={branchData.find(
              (branch) => branch.value === formik.values.id_branch
            )}
            onChange={(option) =>
              formik.setFieldValue("id_branch", option.value)
            }
            styles={customStyles(true)}
            isLoading={loadingBranch}
            placeholder="Select Branch"
          />
          {formik.touched.id_branch && formik.errors.id_branch && (
            <div className="text-red-500">{formik.errors.id_branch}</div>
          )}
        </div>

        {/* Mobile Number Field */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">
            Mobile Number<span className="text-red-400"> *</span>
          </label>
          <div className="relative w-full">
            <input
              type="tel"
              name="mobile"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Mobile Number"
              className=" px-4 py-2  border-2 border-[#f2f3f8] rounded-md focus:ring-1 focus:ring-[#004181] outline-none w-full h-[44px]"
              maxLength="10"
            />
            <div
              onClick={handleSearchMobile}
              className="absolute inset-y-0 right-0 flex items-center justify-center cursor-pointer w-10 rounded-r-md"
            >
              <Search size={22} className="text-[#6C7086] h-5 w-5" />
            </div>
          </div>
          {customerName !== "" && <span className="mt-2">Customer name: <span className="text-green-500">{customerName}</span></span>}
          {formik.touched.mobile && formik.errors.mobile && (
            <span className="text-red-500 text-sm mt-1">
              {formik.errors.mobile}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-black mb-1 font-medium">
          Scheme Account Number
          </label>
          <Select
            options={schemedata}
            value={schemedata.find(
              (branch) => branch.value === formik.values.scheme_account
            )}
            onChange={(option) =>
              formik.setFieldValue("scheme_account", option.value)
            }
            styles={customStyles(true)}
            isLoading={loadingBranch}
            placeholder="Select Scheme Account Number"
            getOptionLabel={(e) => (
              <div className="flex justify-between items-center">
                <span>{e.label}</span>
                <div
                  className={`text-xs px-2 py-0.5 rounded ${
                    e.status ? "bg-red-100 text-[#FF0000]" : "bg-green-100 text-green-700"
                  }`}
                >
                  {e.status}
                </div>
              </div>
            )}
          />
          {formik.touched.scheme_account && formik.errors.scheme_account && (
            <div className="text-red-500">{formik.errors.scheme_account}</div>
          )}
        </div>

        {/* Bill Number Field */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">
            Bill Number<span className="text-red-400"> *</span>
          </label>
          <input
            type="text"
            name="bill_no"
            value={formik.values.bill_no}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Bill Number"
            className="px-4 py-2 h-[44px] border-2 border-[#f2f3f8] rounded-md focus:ring-1 focus:ring-[#004181] outline-none"
          />
          {formik.touched.bill_no && formik.errors.bill_no && (
            <span className="text-red-500 text-sm mt-1">
              {formik.errors.bill_no}
            </span>
          )}
        </div>

        {/* Bill Date Field */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">
            Bill Date<span className="text-red-400"> *</span>
          </label>
          <input
            type="date"
            name="bill_date"
            value={formik.values.bill_date ? formik.values.bill_date.split("T")[0] : ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="px-3 py-2 border-2 border-[#f2f3f8] rounded-md focus:ring-1 focus:ring-[#004181] outline-none h-[44px]"
          />
         
          {formik.touched.bill_date && formik.errors.bill_date && (
            <span className="text-red-500 text-sm mt-1">
              {formik.errors.bill_date}
            </span>
          )}
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="bg-white p-2 mt-4">
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
              onClick={() => setIsOpen(!isviewOpen)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="text-white rounded-md p-2 w-full lg:w-20 bg-[#004181]"
              // style={{ backgroundColor: layout_color }}
            >
              {isLoading ? <SpinLoading /> : "Revert"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RevertForm;
