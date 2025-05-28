import React, { useEffect, useState } from "react";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";
import Select from "react-select";
import Table from "../../common/Table";
import { SquarePen } from "lucide-react";
import { getallbranch, customerOverview } from "../../../api/Endpoints";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { formatDate } from "../../../../utils/FormatDate";

const Exisitingcustomer = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const customStyles = (isReadOnly) => ({
    // ... (keep your existing customStyles implementation)
  });

  const roleData = useSelector((state) => state.clientForm.roledata);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const id_branch = roleData?.id_branch;
  const accessBranch = roleData?.branch;

  const formik = useFormik({
    initialValues: {
      branch: id_branch ? id_branch : "",
      mobile: "",
    },
  });

  const [data, setData] = useState({
    customerDetails: {},
    schemes: [],
    totalOpenSchemes: 0
  });
  const [branch, setBranch] = useState(() => (accessBranch === "0" ? [] : {}));

  const { data: branchData, isLoading: isBranchLoading } = useQuery({
    queryKey: ["branches", accessBranch, id_branch],
    queryFn: async () => {
      if (accessBranch === "0") {
        return getallbranch();
      }
      return getBranchById(id_branch);
    },
    enabled: Boolean(accessBranch),
  });

  useEffect(() => {
    if (!branchData) return;

    if (accessBranch === "0" && branchData.data) {
      const formattedBranches = branchData.data.map((item) => ({
        value: item._id,
        label: item.branch_name,
      }));
      setBranch(formattedBranches);
    } else if (branchData.data) {
      setBranch(branchData.data);
      formik.setFieldValue("id_branch", branchData.data._id);
    }
  }, [branchData, accessBranch]);

  const handleSubmit = () => {
    if (!formik.values.mobile) {
      toast.error("Please enter mobile number");
      return;
    }
    customerData({ 
      data: formik.values
    });
  };

  const { mutate: customerData, isPending: isLoading } = useMutation({
    mutationFn: ({ data }) => customerOverview(data),
    onSuccess: (response) => {
      setData({
        customerDetails: response?.data?.customerDetails || {},
        schemes: response?.data?.schemes || [],
        totalOpenSchemes: response?.data?.totalOpenSchemes || 0
      });
      toast.success(response?.message);
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response?.data?.message);
    },
  });

  const columns = [
    {
      header: "S.no",
      cell: (row, index) => index + 1,
    },
    {
      header: "Scheme Name",
      cell: (row) => row.schemeName,
    },
    {
      header: "Open Accounts",
      cell: (row) => row.openAccounts,
    },
    {
      header: "Amount Paid",
      cell: (row) => row.amountPaid,
    },
    {
      header: "Closed Accounts",
      cell: (row) => row.closedAccounts,
    },
  ];

  const profileData = [
    { label: "Branch", value: data.customerDetails?.branch || "N/A" },
    { label: "Mobile No", value: data.customerDetails?.mobile || "N/A" },
    { label: "Whatsapp No", value: data.customerDetails?.whatsapp || "N/A" },
    { label: "Gender", value: data.customerDetails?.gender || "N/A" },
    {
      label: "Address",
      value: data.customerDetails?.address || "N/A",
    },
    { label: "Pan Card", value: data.customerDetails?.pan || "N/A" },
    { label: "Aadhar No", value: data.customerDetails?.aadharNumber || "N/A" },
    { label: "Date of Birth", value: formatDate(data.customerDetails?.dateOfBirth) || "N/A" },
    {
      label: "Referral No",
      value: data.customerDetails?.referralCode?.replace(/^Cus-/, '') || 'N/A'
    },    
    { label: "Wedding Anniversary", value: formatDate(data.customerDetails?.weddingAnniversary) || "N/A" },
  ];

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Customer" },
          { label: "Customer Overview", active: true },
        ]}
      />
      <div className="border rounded-lg bg-white my-3 p-4">
        <h1 className="text-black font-bold">Customer Details</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5  mt-5">
          {accessBranch === "0" && branch.length > 0 && !isBranchLoading ? (
            <div>
              <label className="block text-sm font-medium mb-1">
                Branch <span className="text-red-500">*</span>
              </label>
              <Select
                styles={customStyles(true)}
                isClearable={true}
                options={branch}
                name="branch"
                placeholder="Select Branch"
                value={
                  branch.find(
                    (option) => option.value === formik.values.branch
                  ) || ""
                }
                onChange={(option) =>
                  formik.setFieldValue("branch", option ? option.value : "")
                }
              />
              {formik.errors.branch && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.branch}
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1">
                Branch <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                disabled
                value={branch?.branch_name || ""}
                className="w-full border-2 border-[#f2f3f8] rounded-md px-3 py-2 text-gray-500"
              />
              {formik.errors.branch && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.branch}
                </div>
              )}
            </div>
          )}
          <div className="relative">
            <label className="text-sm font-medium text-black">
              Mobile Number
            </label>
            <div className="relative">
              <input
                type="number"
                name="mobile"
                onChange={formik.handleChange}
                className="w-full border rounded-md px-3 py-2 text-gray-500"
                placeholder="Enter Mobile Number"
              />
              <button
                onClick={handleSubmit}
                className=" absolute right-0 bg-[#004181] top-0 h-full w-1/3 flex items-center justify-center  text-sm text-white rounded-r-md"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-cols lg:flex-cols-2 sm:flex-cols-2 gap-3 h-full">
        <div className="border w-3/4 rounded-lg bg-white my-3 p-4 h-full">
          <div className="flex flex-col h-full">
            <div className="flex flex-row gap-3 justify-end">
              <button
                type="button"
                className="p-2 bg-[#004181] text-white rounded-md"
                onClick={() => navigate(`/managecustomers/editcustomer/${data.customerDetails?._id}`)}
              >
                <SquarePen size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="flex flex-col gap-2 justify-center items-center">
              <img 
                src={`${data.customerDetails?.pathUrl}${data.customerDetails?.profileImage}`} 
                className="w-24 h-24 border rounded-full object-cover items-center" 
                alt="Profile"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150'; // Fallback image
                }}
              />
              <p className="text-bold">{data.customerDetails?.customerName}</p>
            </div>

            <hr className="w-full mt-5" />

            <div className="p-6">
              {profileData.map((item, index) => (
                <div key={index} className="flex justify-between gap-4 py-2">
                  <p className="text-sm font-semibold text-black">
                    {item.label}:
                  </p>
                  <p className="text-sm font-semibold text-gray-400">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border w-full rounded-lg bg-white my-3 p-5 h-full">
          <h1 className="text-lg font-bold text-black">Account Overview</h1>
          <div className="flex gap-5">
            <div className="justify-start p-2 right-10">
              <p className="text-lg font-medium text-black"> 
                ₹ {data.schemes.reduce((sum, scheme) => sum + (scheme.amountPaid || 0), 0)}
              </p>
              <p className="text-sm font-bold text-gray-600">Amount Payable</p>
            </div>
            <hr className="w-px h-10 bg-gray-300 border-none mt-3" />
            <div className="justify-between p-2">
              <p className="text-lg font-medium text-black">
                {data.schemes.reduce((sum, scheme) => sum + (scheme.closedAccounts || 0), 0)}
              </p>
              <p className="text-sm font-bold text-gray-600">Weight Payable</p>
            </div>
            <hr className="w-px h-10 bg-gray-300 border-none mt-3" />
            <div className="justify-end p-2">
              <p className="text-lg font-medium text-black">{data?.totalOpenSchemes || "N/A"}</p>
              <p className="text-sm font-bold text-gray-600">Active Accounts</p>
            </div>
          </div>

          <div className="mt-3">
            <h1 className="text-md font-bold text-black">Account History</h1>
            <div className="mt-5">
              <Table
                data={data.schemes}
                columns={columns}
                isLoading={isLoading}
                currentPage={currentPage}
                handleItemsPerPageChange={(value) => setItemsPerPage(value)}
                handlePageChange={(page) => setCurrentPage(page)}
                itemsPerPage={itemsPerPage}
                totalItems={data.schemes.length}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exisitingcustomer;