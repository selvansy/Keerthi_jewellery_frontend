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
import { formatDecimal } from "../../../utils/commonFunction";
import { head, header, label } from "framer-motion/client";

const Existcusomer = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const customStyles = (isReadOnly) => ({
    control: (base, state) => ({
      ...base,
      minHeight: "42px", //42px
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
      fontWeight: "thin",
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
    totalOpenSchemes: 0,
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
      data: formik.values,
    });
  };

  const { mutate: customerData, isPending: isLoading } = useMutation({
    mutationFn: ({ data }) => customerOverview(data),
    onSuccess: (response) => {
      setData({
        customerDetails: response?.data?.customerDetails || {},
        schemes: response?.data?.schemes || [],
        totalOpenSchemes: response?.data?.totalOpenSchemes || 0,
        totalWeightPayable:response?.data?.totalWeightPayable || 0,
        totalAmountPayable:response?.data?.totalAmountPayable || 0
      });
      toast.success(response?.message);
    },
    onError: (error) => {
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


  const columns1=[
    {
      header:"S.no",
      cell:(row,index) => index+1
    },
    {
      header:"Scheme Name",
    },
    {
      header:"Account Name",
    },
    {
      header:"Scheme Acc No",
    },
    {
      header:"Paid Installement",
    },
    {
      header:"Start Date",
    },
    {
      header:"Maturity date",
    },
    {
      header:"Amount Paid",
    },
    {
      header:"Over Dues",
    },
  ]

   const columns2=[
    {
      header:"S.no",
      cell:(row,index) => index+1
    },
    {
      header:"Scheme Name",
    },
    {
      header:"Account Name",
    },
    {
      header:"Scheme Acc No",
    },
    {
      header:"Start Date",
    },
    {
      header:"Redeemed date",
    },
    {
      header:"Amount Paid",
    },
    {
      header:"Over Dues",
    },
  ]


  

  const referdata=[{
    label:"Refered Persons",value:" ₹ 7777"
  },
  {
    label:"Wallet Amount",value:"  ₹ 7777"
  },
  {
    label:"Redeemed Amount",value:" ₹ 7777"
  },
  {
    label:"Pending AMount",value:" ₹ 7777"
  },
]

const walletdata=[{
  label:"Chit recieved gifts",value:"02"
},{label:"Non-Chit Received Gifts",value:"01"},
{label:"Pending Gifts",value:"11"}]

  const overduedata=[
    {label:"Over Dues scheme",value:"04"},
    {label:"Over Dues Count",value:"₹ 7,890"},
    {label:"Over Dues Amount",value:"₹ 8,789"},
  ]

  const completedata=[
    {label:"Scheme Count",value:"04"},
    {label:"Account Count",value:"04"},
    {label:"Scheme Account",value:" ₹ 7000"},
  ]
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
    {
      label: "Date of Birth",
      value: formatDate(data.customerDetails?.dateOfBirth) || "N/A",
    },
    {
      label: "Referral No",
      value: data.customerDetails?.referralCode?.replace(/^Cus-/, "") || "N/A",
    },
    {
      label: "Wedding Anniversary",
      value: formatDate(data.customerDetails?.weddingAnniversary) || "N/A",
    },
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
        <h1 className="text-[#232323] font-bold">Customer Details</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5  mt-5">
          {accessBranch === "0" && branch.length > 0 && !isBranchLoading ? (
            <div>
                <label className='text-sm font-medium text-[#232323]' >
                    Branch <span className='text-red-600'>*</span>
                </label>
                <Select
                styles={customStyles(true)}
                isClearable={true}
                options={branch}
                placeholder="Select Branch"
                value={
                  branch?.find(
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
            <label className="text-sm font-medium text-[#232323]">
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

      <div className="border rounded-lg bg-white my-3 p-4">
        <div className="flex flex-row justify-between items-center">
         <h1 className="text-md font-bold text-[#232323]">Account Overview</h1>
          <div>
                       <button
                         type="button"
                         className="px-6 py-2 text-sm bg-[#004181] text-white rounded-md"
                         onClick={() =>
                           navigate(
                             `/managecustomers/editcustomer/${data.customerDetails?._id}`
                           )
                         }
                       >
                         Edit Profile
                       </button>
                     </div>
                     </div>
          <hr className="w-full mt-2" />
        <div className="grid grid-cols-3 ">
            <div className="flex flex-col gap-2 justify-center items-center">
              <img
                src={
                  data.customerDetails?.profileImage
                    ? `${data.customerDetails?.pathUrl}${data.customerDetails?.profileImage}`
                    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                className="w-24 h-24 border rounded-full object-cover items-center"
              />
              
              <p className="text-bold">{data.customerDetails?.customerName}</p>
            </div>
            <div className="p-6">
              {profileData.slice(0,5).map((item, index) => (
                <div key={index} className="flex justify-between gap-4 py-2">
                  <p className="text-sm font-semibold text-[#232323]">
                    {item.label}:
                  </p>
                  <p className="text-sm font-semibold text-gray-400">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

             <div className="p-6">
              {profileData.slice(5,10).map((item, index) => (
                <div key={index} className="flex justify-between gap-4 py-2">
                  <p className="text-sm font-semibold text-[#232323]">
                    {item.label}:
                  </p>
                  <p className="text-sm font-semibold text-gray-400">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
        </div>
         <div className="grid grid-cols-2 gap-5">
              <div className="border rounded-lg bg-white my-3 p-4">
                <h1 className="text-md font-bold text-[#232323]">Scheme Details</h1>
                 <hr className="w-full mt-5" />
                 <div className="grid grid-cols-3 gap-5 p-5">
              <div className="justify-start"> 
                  <p className="text-lg font-medium text-[#232323]">
                    ₹{" "}
                    {data?.totalAmountPayable}
                  </p>
                  <p className="text-sm font-bold text-gray-600">Amount Payable</p>
              </div>
              <div className="justify-between"> 
                  <p className="text-lg font-medium text-[#232323]">
                      {`${formatDecimal(data?.totalWeightPayable)} g`}
                  </p>
                  <p className="text-sm font-bold text-gray-600">Weight payble</p>
              </div>
              <div className="justify-end"> 
                  <p className="text-lg font-medium text-[#232323]">
                    {data?.totalOpenSchemes || "N/A"}
                  </p>
                  <p className="text-sm font-bold text-gray-600">Active Accounts</p>
              </div>
             <div className="justify-start"> 
                      <p className="text-lg font-medium text-[#232323]">
                        --
                  </p>
                  <p className="text-sm font-bold text-gray-600">Closed Schemes</p>
              </div>
              <div className="justify-between"> 
                        <p className="text-lg font-medium text-[#232323]">
                          --
                           </p>
                  <p className="text-sm font-bold text-gray-600">Pre closed</p>
             </div>
             <div className="justify-end"> 
                  <p className="text-lg font-medium text-[#232323]">
                    --
                  </p>
                  <p className="text-sm font-bold text-gray-600">Refund</p>
            </div>    
           </div>
              </div>
              <div className="border rounded-lg bg-white my-3 p-4">
                <h1 className="text-md font-bold text-[#232323]">Referal</h1>
                 <hr className="w-full mt-5 mb-3" />
                {referdata.map((item,index)=>(
                   <div key={index} className="flex items-center gap-5 py-2">
                  <p className="text-sm font-semibold text-[#232323] w-32">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-gray-400">
                    {item.value}
                  </p>
                </div>

                 ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-5">
              <div className="border rounded-lg bg-white my-3 p-4">
                <h1 className="text-md font-bold text-[#232323]">Gift</h1>
                 <hr className="w-full mt-5 mb-2" />
                 {walletdata.map((item,index)=>(
                   <div key={index} className="flex items-center gap-9 py-2">
                  <p className="text-sm font-semibold text-[#232323] w-32">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-gray-400">
                    {item.value}
                  </p>
                </div>

                 ))}
                
              </div>
              <div className="border rounded-lg bg-white my-3 p-4">
                <h1 className="text-md font-bold text-[#232323]">Over Dues</h1>
                 <hr className="w-full mt-5 mb-2" />
                 {overduedata.map((item,index)=>(
                   <div key={index} className="flex items-center gap-9 py-2">
                  <p className="text-sm font-semibold text-[#232323] w-32">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-gray-400">
                    {item.value}
                  </p>
                </div>

                 ))}
              </div>
              <div className="border rounded-lg bg-white my-3 p-4">
                <h1 className="text-md font-bold text-[#232323]">Completed Schemes</h1>
                 <hr className="w-full mt-5 mb-2" />
                 {overduedata.map((item,index)=>(
                   <div key={index} className="flex items-center gap-9 py-2">
                  <p className="text-sm font-semibold text-[#232323] w-32">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-gray-400">
                    {item.value}
                  </p>
                </div>

                 ))}
              </div>
            </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1">
      <div className="border-[1px] rounded-lg bg-white my-3 p-4">
         <h1 className="text-md font-bold text-[#232323] mb-2">Active schemes</h1>
        <Table
                data={data}
                columns={columns1}
                isLoading={isLoading}
                currentPage={currentPage}
                handleItemsPerPageChange={(value) => setItemsPerPage(value)}
                handlePageChange={(page) => setCurrentPage(page)}
                itemsPerPage={itemsPerPage}
                totalItems={data.length}
              />
      </div>
      <div className="border rounded-lg bg-white my-3 p-4">
        <h1 className="text-md font-bold text-[#232323] mb-2">Redeemed Schemes</h1>
        <Table
                data={data}
                columns={columns2}
                isLoading={isLoading}
                currentPage={currentPage}
                handleItemsPerPageChange={(value) => setItemsPerPage(value)}
                handlePageChange={(page) => setCurrentPage(page)}
                itemsPerPage={itemsPerPage}
                totalItems={data.length}
              />
      </div>
      </div>
    </div>
  );
};

export default Existcusomer;
