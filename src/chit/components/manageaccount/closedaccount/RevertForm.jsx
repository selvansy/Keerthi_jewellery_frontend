import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getallbranch, getCustomerByMobile,schemeAccByCusIdSchmeId,revertschemeAccount} from "../../../api/Endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Select from "react-select";
import customSelectStyles from "../../common/customSelectStyles";
import SpinLoading from "../../common/spinLoading";
import { CalendarDays, Search, Send } from "lucide-react";

function RevertForm({ setIsOpen, isviewOpen }) {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);
  const [branchData, setBranchData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customerName, setName] = useState("");

  // Customisations for react-select
  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "42px",
      border: state.isFocused ? "1px solid black" : "1px solid #e2e8f0",
      boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
      borderRadius: "0.375rem",
    }),
  };

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
    const customerData = await getCustomerByMobile(formik.values.mobile);

    if (customerData && customerData.data) {
      formik.setFieldValue('id_customer',customerData?.data?._id)
      setName(
        `${customerData?.data?.firstname} ${customerData?.data?.lastname}`
      );
    } else {
      toast.error(customerData.message);
    }
  };

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
            Branch
          </label>
          <Select
            options={branchData}
            value={branchData.find(
              (branch) => branch.value === formik.values.id_branch
            )}
            onChange={(option) =>
              formik.setFieldValue("id_branch", option.value)
            }
            styles={customSelectStyles}
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
              className="p-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 w-full"
              maxLength="10"
            />
            <div
              onClick={handleSearchMobile}
              className="absolute inset-y-0 right-0 flex items-center justify-center cursor-pointer w-10 rounded-r-md"
              style={{ backgroundColor: layout_color }}
            >
              <Search size={22} className="text-white" />
            </div>
          </div>
          {customerName !== "" && <span className="mt-2">Customer name: <span className="text-green-500">{customerName}</span></span>}
          {formik.touched.mobile && formik.errors.mobile && (
            <span className="text-red-500 text-sm mt-1">
              {formik.errors.mobile}
            </span>
          )}
        </div>

        {/* Scheme Account Number Field */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">
            Scheme Account Number<span className="text-red-400"> *</span>
          </label>
          <div className="relative w-full">
          <input
            type="text"
            name="scheme_account"
            value={formik.values.scheme_account}
            onChange={(e) => {
              const upperCaseValue = e.target.value.toUpperCase();
              formik.setFieldValue("scheme_account", upperCaseValue);
            }}
            onBlur={formik.handleBlur}
            placeholder="Enter Scheme Account Number"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 w-full"
          />
           <div
              onClick={handleClosedSchemeAcc}
              className="absolute inset-y-0 right-0 flex items-center justify-center cursor-pointer w-10 rounded-r-md"
              style={{ backgroundColor: layout_color }}
            >
              <Search size={22} className="text-white" />
            </div>
          </div>
          {formik.touched.scheme_account && formik.errors.scheme_account && (
            <span className="text-red-500 text-sm mt-1">
              {formik.errors.scheme_account}
            </span>
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
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
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
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
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
              className="text-white rounded-md p-2 w-full lg:w-20"
              style={{ backgroundColor: layout_color }}
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
