import React, { useEffect, useState } from "react";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";
import Select from "react-select";
import Table from "../../common/Table";
import {
  getallbranch,
  customerOverview,
  activeSchemes,
  redeemedSchemes,
} from "../../../api/Endpoints";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { formatDate } from "../../../../utils/FormatDate";
import { formatDecimal } from "../../../utils/commonFunction";
import { useDispatch, useSelector } from "react-redux";
import { setid } from "../../../../redux/clientFormSlice";
import SpinLoading from "../../common/spinLoading";
import { formatNumber } from "../../../utils/commonFunction";

const Existcusomer = () => {
  const navigate = useNavigate();
  const { cusid } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [totalPage, setTotalPages] = useState(0);
  const [totalDocument, setTotalDocument] = useState(0);
  const [activeSchemesTable, setActiveSchemesTable] = useState([]);
  const [loading,setLoading]=useState(false)
  const [currentPage1, setCurrentPage1] = useState(1);
  const [itemsPerPage1, setItemsPerPage1] = useState(4);
  const [totalPage1, setTotalPages1] = useState(0);
  const [totalDocument1, setTotalDocument1] = useState(0);
  const [redeemedSchemesTable, setRedeemedSchemesTable] = useState([]);

  // Reset state when customer changes
  const resetState = () => {
    setData({
      customerDetails: {},
      schemes: [],
      totalOpenSchemes: 0,
      totalClosedSchemes: 0,
      totalPrecloseSchemes: 0,
      refundSchemes: 0,
      referralData: {},
      chitrecievedGift: 0,
      nonChit: 0,
      pendingGift: 0,
      schemeCount: 0,
      accountCount: 0,
      schemeAmount: 0,
    });
    setActiveSchemesTable([]);
    setRedeemedSchemesTable([]);
    formik.setFieldValue("mobile", "");
    setCurrentPage(1);
    setCurrentPage1(1);
  };

  const customStyles = (isReadOnly) => ({
    control: (base, state) => ({
      ...base,
      minHeight: "42px",
      backgroundColor: "white",
      color: "#232323",
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
  });

  const roleData = useSelector((state) => state.clientForm.roledata);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const id_branch = roleData?.id_branch;
  const accessBranch = roleData?.branch;
  const userId = useSelector((state) => state.clientForm.id);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      branch: id_branch ? id_branch : "",
      mobile: "",
      idCustomer: "",
    },
  });

  const [data, setData] = useState({
    customerDetails: {},
    schemes: [],
    totalOpenSchemes: 0,
    totalClosedSchemes: 0,
    totalPrecloseSchemes: 0,
    refundSchemes: 0,
    referralData: {},
    chitrecievedGift: 0,
    nonChit: 0,
    pendingGift: 0,
    schemeCount: 0,
    accountCount: 0,
    schemeAmount: 0,
    overduedata:{}
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
      formik.setFieldValue("branch", branchData.data._id);
    }
  }, [branchData, accessBranch]);

  const handleSubmit = () => {
    setLoading(true)
    if (!formik.values.mobile) {
      toast.error("Please enter mobile number");
      return;
    }
    customerData({
      data: formik.values,
    });
  };

  useEffect(() => {
    if (cusid) {
      resetState();
      const inputdata = {
        idCustomer: cusid,
      };
      customerData({ data: inputdata });
    } else if (userId) {
      resetState();
      const inputdata = {
        idCustomer: userId,
      };
      customerData({ data: inputdata });
    }
  }, [cusid, userId]);

  useEffect(() => {
    const customerId = data.customerDetails?._id;
    if (customerId) {
      const inputData = { id_customer: customerId };
      activeSchemesData({ data: inputData });
      redeemedSchemeData({ data: inputData });
    }
  }, [data.customerDetails]);

  const { mutate: activeSchemesData, isPending: isLoading1 } = useMutation({
    mutationFn: ({ data }) => activeSchemes(data),
    onSuccess: (response) => {
      setActiveSchemesTable(response?.data || []);
      setTotalPages(response?.totalPages || 0);
      setTotalDocument(response?.totalCount || 0);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: redeemedSchemeData, isPending: isLoading2 } = useMutation({
    mutationFn: ({ data }) => redeemedSchemes(data),
    onSuccess: (response) => {
      setRedeemedSchemesTable(response?.data || []);
      setTotalPages1(response?.totalPages || 0);
      setTotalDocument1(response?.totalCount || 0);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: customerData, isPending: isLoading } = useMutation({
    mutationFn: ({ data }) => customerOverview(data),
    onSuccess: (response) => {
      if (response?.data?.customerDetails?.mobile) {
        formik.setFieldValue("mobile", response.data.customerDetails.mobile);
      }

      setData({
        customerDetails: response?.data?.customerDetails || {},
        schemes: response?.data?.schemes || [],
        totalOpenSchemes: response?.data?.totalOpenSchemes || 0,
        totalClosedSchemes: response?.data?.totalClosedSchemes || 0,
        totalWeightPayable: response?.data?.totalWeightPayable || 0,
        totalAmountPayable: response?.data?.totalAmountPayable || 0,
        totalPrecloseSchemes: response?.data?.precloseAccounts || 0,
        refundSchemes: response?.data?.refundSchemes || 0,
        referralData: response?.data?.referralDetails || {},
        chitrecievedGift: response?.data?.totalSchemeGifts || 0,
        nonChit: response?.data?.totalNonSchemeGifts || 0,
        pendingGift: response?.data?.totalGiftsLeftToReceive || 0,
        schemeCount: response?.data?.uniqueSchemesCount || 0,
        accountCount: response?.data?.totalSchemeAccounts || 0,
        schemeAmount: response?.data?.schemeAmount || 0,
        overduedata:response?.data?.overDueData
      });
      toast.success(response?.message);
      setLoading(false)
      dispatch(setid(response?.data?.customerDetails?._id || ""));
    },
    onError: (error) => {
      setLoading(false)
     setData({
      customerDetails: {},
      schemes: [],
      totalOpenSchemes: 0,
      totalClosedSchemes: 0,
      totalWeightPayable: 0,
      totalAmountPayable: 0,
      totalPrecloseSchemes: 0,
      refundSchemes: 0,
      referralData: {},
      chitrecievedGift: 0,
      nonChit: 0,
      pendingGift: 0,
      schemeCount: 0,
      accountCount: 0,
      schemeAmount: 0,
      overduedata: {}
    });
    setActiveSchemesTable(prev => []);
    setRedeemedSchemesTable(prev => []);
      toast.error(error.response?.data?.message);
    },
  });

  useEffect(() => {
  if (!data.customerDetails?._id) {
    setActiveSchemesTable([]);
    setRedeemedSchemesTable([]);
  }
}, [data.customerDetails]);

  const columns1 = [
    {
      header: "S.no",
      cell: (row, index) => index + 1,
    },
    {
      header: "Scheme Name",
      cell: (row) => row.scheme_name,
    },
    {
      header: "Account Name",
      cell: (row) => row.account_name || row.customerName,
    },
    {
      header: "Scheme Acc No",
      cell: (row) => row.scheme_acc_number,
    },
    {
      header: "Paid Installments",
      cell: (row) => {
        const showInstallment = `${row?.paid_installments}/${row?.total_installments}`;
        const digi = `${row?.paid_installments}`
        return (
          <div
            className={`w-16 h-8 rounded-md py-1 flex justify-center items-center ${
              row?.paid_installments > 0
                ? "bg-[#12B76A38] text-green-500 font-medium"
                : "bg-[#FF000038] text-red-500 font-medium"
            }`}
          >
            {(row.schemeType == 10 || row?.schemeType == 14) ? digi : showInstallment}
          </div>
        );
      },
    },
    {
      header: "Start Date",
      cell: (row) => formatDate(row.startDate) || formatDate(row.createdAt),
    },
    {
      header: "Maturity date",
      cell: (row) => row.maturityDate,
    },
    {
      header: "Amount Paid",
      cell: (row) => `₹${row.amountPaid || row.totalAmountPaid || 0}`,
    },
    {
      header: "Weight",
      cell: (row) => `${formatDecimal(row.weightPaid )|| 0} g`,
    },
    {
      header: "Over Dues",
      cell: (row) =>
        `${row.installmentDue || 0} ${
          row.flexFixed != null
            ? `(₹${row.flexFixed * row.installmentDue})`
            : `(-)`
        }`,
    },
  ];

  const columns2 = [
    {
      header: "S.no",
      cell: (row, index) => index + 1,
    },
    {
      header: "Scheme Name",
      cell: (row) => row.scheme_name,
    },
    {
      header: "Account Name",
      cell: (row) => row.account_name,
    },
    {
      header: "Scheme Acc No",
      cell: (row) => row.scheme_acc_number,
    },
    {
      header: "Start Date",
      cell: (row) => formatDate(row.startDate) || formatDate(row.createdAt),
    },
    {
      header: "Redeemed date",
      cell: (row) => formatDate(row.closedDate),
    },
    {
      header: "Amount Paid",
      cell: (row) => `₹${row.amountPaid || row.totalAmountPaid || 0}`,
    },
  ];

  const referdata = [
    {
      label: "Refered Persons",
      value: data?.referralData?.referralCount || "-",
    },
    {
      label: "Wallet Amount",
      value: data?.referralData?.walletAmount || "-",
    },
    {
      label: "Redeemed Amount",
      value: data?.referralData?.redeemedAmount || "-",
    },
    {
      label: "Pending Amount",
      value: formatDecimal(data?.referralData?.pendingAmount,2) || "-",
    },
  ];

  const walletdata = [
    {
      label: "Chit recieved gifts",
      value: data?.chitrecievedGift || "-",
    },
    { label: "Non-Chit Received Gifts", value: data?.nonChit || "-" },
    { label: "Pending Gifts", value: data?.pendingGift || "-" },
  ];

  const overduedata = [
    { label: "Over Dues scheme", value: data?.overduedata?.overdueSchemes || 0 },
    { label: "Over Dues Count", value: data?.overduedata?.overdueCount || 0 },
    { label: "Over Dues Amount", value: formatNumber({value:data?.overduedata?.overdueAmount,decimalPlaces:0}) || 0 },
  ];

  const completedata = [
    { label: "Scheme Count", value: data.schemeCount || "-" },
    { label: "Account Count", value: data.accountCount || "-" },
    { label: "Scheme Amount", value: formatNumber({value:data?.totalAmountPayable,decimalPlaces:0}) || "-" },
  ];

  const profileData = [
    { label: "Branch", value: data.customerDetails?.branch || "-" },
    { label: "Mobile No", value: data.customerDetails?.mobile || "-" },
    { label: "Whatsapp No", value: data.customerDetails?.whatsapp || "-" },
    { label: "Gender", value: data.customerDetails?.gender || "-" },
    {
      label: "Address",
      value: data.customerDetails?.address || "-",
    },
    { label: "Pan Card", value: data.customerDetails?.pan || "-" },
    { label: "Aadhar No", value: data.customerDetails?.aadharNumber || "-" },
    {
      label: "Date of Birth",
      value: formatDate(data.customerDetails?.dateOfBirth) || "-",
    },
    {
      label: "Referral No",
      value: data.customerDetails?.referralCode?.replace(/^Cus-/, "") || "-",
    },
    {
      label: "Wedding Anniversary",
      value: formatDate(data.customerDetails?.weddingAnniversary) || "-",
    },
  ];

  useEffect(()=>{
    if(data.customerDetails?._id){
       const customerId = data.customerDetails?._id;
     const inputData = { id_customer: customerId,page:currentPage,limit:4};
      activeSchemesData({ data: inputData});
    }
  },[currentPage])

  useEffect(()=>{
    if(data.customerDetails?._id){
      const customerId = data.customerDetails?._id;
     const inputData = { id_customer: customerId,page:currentPage1,limit:4};
      redeemedSchemeData({ data: inputData});
    }
  },[currentPage1])

  const handlePageChange = (page) => {
    const pageNumber = Number(page);
    if (!pageNumber || isNaN(pageNumber)) return;
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPage)));
  };

  const handlePageChange1 = (page) => {
    const pageNumber = Number(page);
    if (!pageNumber || isNaN(pageNumber)) return;
    setCurrentPage1(Math.max(1, Math.min(pageNumber, totalPage1)));
  };

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
              <label className="text-sm font-medium text-[#232323]">
                Branch <span className="text-red-600">*</span>
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
                value={formik.values.mobile}
                onChange={formik.handleChange}
                className="w-full border rounded-md px-3 py-2 text-gray-500"
                placeholder="Enter Mobile Number"
              />
              <button
                onClick={handleSubmit}
                disabled={loading || formik.values.mobile.length==0}
                className="absolute right-0 bg-[#004181] top-0 h-full w-1/3 flex items-center justify-center text-sm text-white rounded-r-md"
              >
                 {loading ? (
                <div className="flex justify-center">
                  <SpinLoading />
                </div>
              ) : (
                "Search"
              )}
                
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
              className="w-24 h-24 border rounded-md object-cover items-center"
            />

            <p className="text-bold">{data.customerDetails?.customerName}</p>
          </div>
          <div className="p-6">
            {profileData.slice(0, 5).map((item, index) => (
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
            {profileData.slice(5, 10).map((item, index) => (
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
                  ₹{data?.totalAmountPayable}
                </p>
                <p className="text-sm font-bold text-gray-600">
                  Amount Payable
                </p>
              </div>
              <div className="justify-between">
                <p className="text-lg font-medium text-[#232323]">
                  {`${formatDecimal(data?.totalWeightPayable)} g`}
                </p>
                <p className="text-sm font-bold text-gray-600">Weight payble</p>
              </div>
              <div className="justify-end">
                <p className="text-lg font-medium text-[#232323]">
                  {data?.totalOpenSchemes || "-"}
                </p>
                <p className="text-sm font-bold text-gray-600">
                  Active Accounts
                </p>
              </div>
              <div className="justify-start">
                <p className="text-lg font-medium text-[#232323]">
                  {data?.totalClosedSchemes || "-"}
                </p>
                <p className="text-sm font-bold text-gray-600">
                  Closed Schemes
                </p>
              </div>
              <div className="justify-between">
                <p className="text-lg font-medium text-[#232323]">
                  {data?.totalPrecloseSchemes || "-"}
                </p>
                <p className="text-sm font-bold text-gray-600">Pre closed</p>
              </div>
              <div className="justify-end">
                <p className="text-lg font-medium text-[#232323]">
                  {data?.refundSchemes || "-"}
                </p>
                <p className="text-sm font-bold text-gray-600">Refund</p>
              </div>
            </div>
          </div>
          <div className="border rounded-lg bg-white my-3 p-4">
            <h1 className="text-md font-bold text-[#232323]">Referral</h1>
            <hr className="w-full mt-5 mb-3" />
            {referdata.map((item, index) => (
              <div key={index} className="flex items-center gap-5 py-2">
                <p className="text-sm font-semibold text-[#232323] w-3/12">
                  {item.label}
                </p>
                <div className="flex justify-start">
                  <p className="text-sm font-semibold text-gray-400">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5">
          <div className="border rounded-lg bg-white my-3 p-4">
            <h1 className="text-md font-bold text-[#232323]">Gift</h1>
            <hr className="w-full mt-5 mb-2" />
            {walletdata.map((item, index) => (
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
            {overduedata.map((item, index) => (
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
            <h1 className="text-md font-bold text-[#232323]">
              Completed Schemes
            </h1>
            <hr className="w-full mt-5 mb-2" />
            {completedata.map((item, index) => (
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
          <h1 className="text-md font-bold text-[#232323] mb-2">
            Active schemes
          </h1>
          <Table
            data={activeSchemesTable || []}
            columns={columns1}
            isLoading={isLoading1}
            currentPage={currentPage}
            handleItemsPerPageChange={(value) => setItemsPerPage(value)}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalDocument}
          />
        </div>
        <div className="border rounded-lg bg-white my-3 p-4">
          <h1 className="text-md font-bold text-[#232323] mb-2">
            Redeemed Schemes
          </h1>
          <Table
            data={redeemedSchemesTable}
            columns={columns2}
            isLoading={isLoading2}
            currentPage={currentPage1}
            handleItemsPerPageChange={(value) => setItemsPerPage1(value)}
            handlePageChange={handlePageChange1}
            itemsPerPage={itemsPerPage1}
            totalItems={totalDocument1}
          />
        </div>
      </div>
    </div>
  );
};

export default Existcusomer;
