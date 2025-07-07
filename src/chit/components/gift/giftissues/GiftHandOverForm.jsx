import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addgiftissues,
  searchGiftCodenumber,
  giftissuetype,
  searchcustomermobile,
  getallgiftInwardByBranch,
  searchSchAccByMobile,
  getallbranch,
  giftIssueBySchId,
} from "../../../api/Endpoints";
import SpinLoading from "../../common/spinLoading";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Search, Trash2 } from "lucide-react";
import Select from "react-select";
import Table from "../../common/Table";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { form } from "framer-motion/client";
import { customStyles } from "../../ourscheme/scheme/AddScheme";
//import customSelectStyles from '../../common/customSelectStyles';//

const customComponents = {
  DropdownIndicator: () => null,
  IndicatorSeparator: () => null,
};

const customSelectStyles = (isReadOnly) => ({
  control: (base, state) => ({
    ...base,
    minHeight: "42px",
    backgroundColor: "white",
    border: state.isFocused ? "1px solid black" : "2px solid #f2f3f8",
    boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
    borderRadius: "0.375rem",
    "&:hover": {
      color: "#e2e8f0",
    },
    pointerEvents: !isReadOnly ? "none" : "auto",
    opacity: !isReadOnly ? 1 : 1,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#858293",
    fontWeight: "thin",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: "#232323",
    "&:hover": {
      color: "#232323",
    },
  }),
});

function GiftHandOverForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location?.state?.data;

  const roledata = useSelector((state) => state.clientForm.roledata);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const id_branch = roledata?.branch;
  const branchaccess = roledata?.id_branch;

  // State declarations
  const [isLoading, setLoading] = useState(false);
  const [AddLoading, setAddLoading] = useState(false);
  const [visibleaccount, setVisibleaccount] = useState(false);
  const [searchGiftCode, setSearchGiftCode] = useState("");
  const [branchId, setIdbranch] = useState("");
  const [GiftCodeData, setGiftCodeData] = useState([]);
  const [giftHis, setGiftHis] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [issuetype, setIssuetype] = useState([]);
  const [GiftCodeNums, setGiftCodeNums] = useState([]);
  const [schemeaccount, setSchemeaccount] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [entries, setEntries] = useState(0); // Fixed typo
  const [customer_name, setCustomername] = useState("");
  const [address, setAddress] = useState("");
  const [noOfgifts, setNoGifts] = useState("");
  const [alloted_gifts, setAllotedGifts] = useState(0);
  const [schId, setSchId] = useState("");
  const [giftStock, setGiftStock] = useState("");
  const [addGift, setAddGift] = useState([]);
  const [totalDocuments, setTotalDocuments] = useState(0); // Added missing state

  const [formData, setFormData] = useState({
    id_customer: "",
    mobile: null,
    id_branch: "",
    issue_type: null,
    gift_issues: [],
    qty: "",
  });
  ;

  const scheme_gift = formData.issue_type;

  // Fixed useEffect for handling passed data
  useEffect(() => {
    ;

    if (!data) return;

    // Set form data immediately when data is available
    setFormData((prev) => ({
      ...prev,
      id_customer: data.id_customer || "",
      mobile: data.mobile || data.id_customer?.mobile || "",
      issue_type: 1, // Set to scheme type
    }));

    // Set customer details
    if (data.id_customer) {
      const firstName = data.id_customer.firstname || "";
      const lastName = data.id_customer.lastname || "";
      setCustomername(`${firstName} ${lastName}`.trim());
      setAddress(data.id_customer.address || "");
    }

    // Set scheme account details
    if (data._id) {
      setSchId(data._id);
      setAllotedGifts(data.allottedgifts || data.Allottedgifts || 0);

      // Create scheme account option
      const schemeOption = {
        value: data._id,
        label: data.scheme_name,
        Allottedgifts: data.allottedgifts || data.Allottedgifts || 0,
      };
      setSchemeaccount([schemeOption]);
    }

    // Show account selection for scheme type
    setVisibleaccount(true);
  }, [data]);

  // Branch setup effect
  useEffect(() => {
    if (!roledata) return;

    const branchToSet = branchaccess || id_branch;
    if (branchToSet && branchToSet !== "0" && branchToSet !== 0) {
      setFormData((prev) => ({
        ...prev,
        id_branch: branchToSet,
      }));
      setIdbranch(branchToSet);
    }
  }, [branchaccess, roledata, id_branch]);

  // Gift issues history effect
  useEffect(() => {
    if (!schId) return;
    const payload = {
      page: currentPage,
      limit: itemsPerPage,
      search: "",
      id: schId,
    };
    handleGiftIssuesBySchId(payload);
  }, [currentPage, itemsPerPage, schId, visibleaccount]);

  // API calls and mutations
  const { mutate: handleGiftIssuesBySchId } = useMutation({
    mutationFn: (value) => giftIssueBySchId(value),
    onSuccess: (response) => {
      if (response) {
        setGiftHis(response.giftsList || []);
        setTotalPages(response.totalPages || 0);
        setCurrentPage(response.currentPage || 1);
        setTotalDocuments(response.totalDocument || 0);
        setEntries(response.totalDocument || 0); // Fixed
      }
    },
  });

  // Fixed scheme search mutation
  const { mutate: handlesearchScheme } = useMutation({
    mutationFn: (data) => searchSchAccByMobile(data),
    onSuccess: (response) => {
      const accounts = response?.data;

      if (!Array.isArray(accounts) || accounts.length === 0) {
        toast.error("No accounts found");
        return;
      }

      // Filter eligible accounts
      const eligibleAccounts = accounts.filter((account) => {
        const minPaidInstallments =
          account.id_scheme?.gift_minimum_paid_installment || 0;
        return account.paidInstallments >= minPaidInstallments;
      });

      if (eligibleAccounts.length === 0) {
        toast.error("No eligible accounts (insufficient paid installments)");
        return;
      }

      const account = eligibleAccounts[0];

      // Set customer details
      const firstName = account.id_customer?.firstname || "";
      const lastName = account.id_customer?.lastname || "";
      setCustomername(`${firstName} ${lastName}`.trim());
      setAddress(account.id_customer?.address || "");

      // Set form data
      setFormData((prev) => ({
        ...prev,
        id_customer: account.id_customer?._id,
        mobile: account.id_customer?.mobile,
      }));

      // Handle scheme accounts
      handleschemeaccountbyBranch(eligibleAccounts);
      toast.success(response.message || "Accounts fetched successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to fetch scheme accounts"
      );
    },
  });

  // Fixed scheme account handler
  const handleschemeaccountbyBranch = (accounts) => {
    const schemeSummary = accounts.map((account) => ({
      value: account._id || account.id_scheme_account,
      label: account.scheme_name,
      Allottedgifts: account.id_scheme?.no_of_gifts || 0,
    }));
    setSchemeaccount(schemeSummary);
  };

  const { mutate: handlesearchcustomer } = useMutation({
    mutationFn: (payload) => searchcustomermobile(payload),
    onSuccess: (response) => {
      if (response) {
        const firstName = response.data.firstname || "";
        const lastName = response.data.lastname || "";
        setCustomername(`${firstName} ${lastName}`.trim());
        setAddress(response.data.address || "");
        setFormData((prev) => ({
          ...prev,
          id_customer: response.data._id,
          mobile: response.data.mobile,
        }));
      }
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      setLoading(false);
    },
  });

  const { mutate: createGiftissuesMutate } = useMutation({
    mutationFn: (payload) => addgiftissues(payload),
    onSuccess: (response) => {
      setLoading(false);
      toast.success(response.message);
      navigate("/gift/gifthandover");
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.response.data.message);
    },
  });

  const { mutate: handlegiftGiftCodeno } = useMutation({
    mutationFn: (payload) => searchGiftCodenumber(payload),
    onSuccess: (response) => {
      if (response && response.data) {
        setGiftStock(response.data.qty);
        setAddGift(response.data);
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch GiftCode data");
    },
  });

  // Queries
  const { data: branchresponse, isLoading: loadingbranch } = useQuery({
    queryKey: ["branch"],
    queryFn: getallbranch,
  });

  const { data: giftResponse, isLoading: loadingGifts } = useQuery({
    queryKey: ["GiftCode", branchId],
    queryFn: () => getallgiftInwardByBranch(branchId),
    enabled: !!branchId,
  });

  const { data: giftIssueResponse, isLoading: loadingGiftItems } = useQuery({
    queryKey: ["giftissues", branchId],
    queryFn: giftissuetype,
    enabled: !!branchId,
  });

  // Process query responses
  useEffect(() => {
    if (giftResponse?.data) {
      const GiftCodes = giftResponse.data.map((item) => ({
        value: item?.id_gift?.gift_code,
        label: `${item?.id_gift?.gift_code} - ${item.id_gift?.gift_name}`,
      }));
      setGiftCodeNums(GiftCodes);
    }

    if (branchresponse) {
      const branch = branchresponse.data.map((branch) => ({
        value: branch._id,
        label: branch.branch_name,
      }));
      setBranchList(branch);
    }

    if (giftIssueResponse) {
      const giftitem = giftIssueResponse.data.map((giftitem) => ({
        value: giftitem.id,
        label: giftitem.name,
      }));
      setIssuetype(giftitem);
    }
  }, [giftResponse, branchresponse, giftIssueResponse]);

  // Validation
  const validateForm = () => {
    const errors = {};

    if (formData.issue_type === "1" || formData.issue_type === 1) {
      if (!schId) errors.id_scheme_account = "Scheme Account is required";
    }

    if (!formData.id_branch) errors.id_branch = "Branch is required";
    if (!formData.mobile) errors.mobile = "Mobile Number is required";
    if (!formData.issue_type) errors.issue_type = "Issue Type is required";

    if (!formData.gift_issues || formData.gift_issues.length === 0) {
      errors.gift_issues = "No gifts selected";
      toast.error("To Handover Gift is required!");
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Event handlers
  const handleSubmit = () => {
    try {
      setLoading(true);

      let updatedFormData = { ...formData };

      if (formData.issue_type === "1" || formData.issue_type === 1) {
        updatedFormData.id_scheme_account = schId;
      } else {
        updatedFormData.id_scheme_account = "";
      }

      if (!validateForm()) {
        setLoading(false);
        return;
      }

      createGiftissuesMutate(updatedFormData);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSearchmobile = () => {
    if (formData.mobile === "" || !formData.mobile) {
      toast.error("Mobile Number is required!");
      return;
    }

    if (formData.issue_type === "1" || formData.issue_type === 1) {
      handlesearchScheme({
        value: formData.mobile,
        branchId: formData.id_branch,
      });
    } else {
      handlesearchcustomer({
        search: formData.mobile,
        id_branch: formData.id_branch,
      });
    }
  };

  const handleSchemeAcc = (value) => {
    if (value === "1" || value === 1) {
      setVisibleaccount(true);
    } else {
      setVisibleaccount(false);
      setSchemeaccount([]);
      setSchId("");
      setCustomername("");
      setAddress("");
      setAllotedGifts(0);
    }

    // Clear customer data when changing issue type
    if (!data) {
      // Only clear if not coming from navigation
      setCustomername("");
      setAddress("");
    }
  };

  const handleChangeSchemeAccount = (item) => {
    setSchId(item.value);
    setFormData((prev) => ({
      ...prev,
      id_scheme_account: item.value,
    }));
    setAllotedGifts(item.Allottedgifts);
    setGiftHis([]);
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "id_branch") {
      setIdbranch(value);
    }
  };

  const handleSearchGiftCode = () => {
    if (!searchGiftCode) {
      toast.error("GiftCode Number is required!");
      return;
    }

    const totalGifts = GiftCodeData.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );
    if (
      totalGifts >= alloted_gifts &&
      (formData.issue_type === "1" || formData.issue_type === 1)
    ) {
      toast.error("Gift limit reached");
    } else {
      handlegiftGiftCodeno({
        GiftCode: { search: searchGiftCode },
        id_branch: formData.id_branch,
      });
    }
  };

  const updateGiftCodeData = (GiftCodeData, giftQty = 1) => {
    if (giftQty <= 0) {
      toast.error("Gift quantity should be greater than zero");
      setAddLoading(false);
      return;
    }

    setAddLoading(false);

    // Update giftCodeData state
    setGiftCodeData((prevData = []) => {
      const existingIndex = prevData.findIndex(
        (item) => item.id_gift === GiftCodeData.id_gift
      );

      if (existingIndex !== -1) {
        const item = prevData[existingIndex];
        const newQty = item.quantity + giftQty;

        if (newQty <= item.qty) {
          const updated = [...prevData];
          updated[existingIndex] = { ...item, quantity: newQty };
          return updated;
        } else {
          toast.error("Gift Stock limit reached");
          return prevData;
        }
      } else {
        if (giftQty <= GiftCodeData.qty) {
          return [...prevData, { ...GiftCodeData, quantity: giftQty }];
        } else {
          toast.error("Gift Stock limit reached");
          return prevData;
        }
      }
    });

    // Update formData.gift_issues
    setFormData((prevFormData) => {
      const existingIssueIndex = prevFormData.gift_issues?.findIndex(
        (issue) => issue.gift_id === GiftCodeData.id_gift
      );

      let updatedGiftIssues = prevFormData.gift_issues || [];

      if (existingIssueIndex !== -1) {
        const issue = updatedGiftIssues[existingIssueIndex];
        const newQty = issue.qty + giftQty;

        if (newQty <= GiftCodeData.qty) {
          updatedGiftIssues[existingIssueIndex] = {
            ...issue,
            qty: newQty,
          };
        } else {
          return prevFormData;
        }
      } else {
        if (giftQty <= GiftCodeData.qty) {
          updatedGiftIssues = [
            ...updatedGiftIssues,
            {
              gift_id: GiftCodeData.id_gift,
              qty: giftQty,
              price: GiftCodeData.price,
              gift_code: GiftCodeData.gift?.gift_code || "",
            },
          ];
        } else {
          toast.error("Gift Stock limit reached");
          return prevFormData;
        }
      }

      return {
        ...prevFormData,
        gift_issues: updatedGiftIssues,
        qty: "",
      };
    });

    setAddGift([]);
    setGiftStock("");
    setSearchGiftCode("");
  };

  const removeRowById = (idToRemove) => {
    setGiftCodeData((prevData) =>
      prevData.filter((_, index) => index !== idToRemove)
    );
    setFormData((prevFormData) => {
      const updatedGiftIssues = prevFormData.gift_issues.filter(
        (_, index) => index !== idToRemove
      );
      return { ...prevFormData, gift_issues: updatedGiftIssues };
    });
  };

  const handleAdd = () => {
    setAddLoading(true);
    if (!addGift) {
      toast.error("No giftCode data found");
      setAddLoading(false);
      return;
    }
    const giftQty = Number(formData.qty);
    updateGiftCodeData(addGift, giftQty);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    const pageNumber = Number(page);
    if (
      !pageNumber ||
      isNaN(pageNumber) ||
      pageNumber < 1 ||
      pageNumber > totalPages
    ) {
      return;
    }
    setCurrentPage(pageNumber);
  };

  const handleAddCustomer = () => {
    navigate("/managecustomers/addcustomer");
  };

  const handleCancle = () => {
    navigate("/gift/gifthandover");
  };

  // Utility functions
  const format = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Table columns
  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Gift Name",
      cell: (row) => row?.id_gift?.gift_name,
    },
    {
      header: "No.Of Gifts(Qty)",
      cell: (row) => row?.qty,
    },
    {
      header: "Issues Date",
      cell: (row) => format(row?.giftIssueDate),
    },
  ];

  const GiftCodecolumns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1,
    },
    {
      header: "Gift Name",
      cell: (row) => row?.gift?.gift_name,
    },
    {
      header: "No.Of Gifts",
      cell: (row) => row?.quantity,
    },
    {
      header: "Issue Date",
      cell: (row) => formatDate(new Date()),
    },
    {
      header: "Actions",
      cell: (_, index) => (
        <div className="flex items-start justify-start py-2">
          <button
            onClick={() => removeRowById(index)}
            className="p-2 rounded hover:bg-gray-100 text-red-600 flex items-start justify-start"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-row justify-between items-center w-full sm:order-1 sm:w-auto sm:mr-auto md:order-1 md:w-auto md:mr-auto ">
        <div className="w-1/2 sm:w-auto me-1 mt-2">
          <Breadcrumb
            items={[{ label: "Gift" }, { label: "GiftHandover", active: true }]}
          />
        </div>

        <div className="w-1/2 sm:hidden ">
          <button
            className="rounded-md px-4 py-2 text-white whitespace-nowrap hover:bg-[#034571] transition-colors w-full"
            onClick={handleAddCustomer}
            style={{ backgroundColor: layout_color }}
          >
            + Add Customer
          </button>
        </div>

        <div className="hidden sm:block sm:order-3 mt-2">
          <button
            className="rounded-md px-4 py-2 text-white text-nowrap hover:bg-[#034571] transition-colors "
            onClick={handleAddCustomer}
            style={{ backgroundColor: layout_color }}
          >
            + Add Customer
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col bg-white border-2 border-[#f2f3f8] rounded-md p-6  mt-3 overflow-y-auto scrollbar-hide gap-8">
        <div className="mb-2">
          <h2 className="text-xl font-medium mb-4">Customer Details</h2>
          <div className="grid grid-rows-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3  gap-2">
            <div className="flex flex-col mt-2">
              <label className="text-black mb-1 font-normal">
                Branch<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Select
                  options={branchList}
                  value={
                    branchList.find(
                      (branch) => branch.value === formData.id_branch
                    ) || ""
                  }
                  onChange={(branch) => {
                    setFormData((prev) => ({
                      ...prev,
                      id_branch: branch.value,
                    }));
                    setIdbranch(branch.value);
                  }}
                  isDisabled={id_branch !== "0"}
                  styles={customStyles(true)}
                  isLoading={loadingbranch}
                  placeholder="Select Branch"
                />
                {formErrors.id_branch && (
                  <span className="text-red-500 text-sm mt-1">
                    {formErrors.id_branch}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-black mb-1 font-normal">
                Gift HandOver Type<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Select
                  options={issuetype}
                  value={
                    issuetype.find(
                      (item) => item.value === formData.issue_type
                    ) || ""
                  }
                  onChange={(item) => {
                    setFormData((prev) => ({
                      ...prev,
                      issue_type: item.value,
                    }));
                    handleSchemeAcc(item.value);
                  }}
                  styles={customStyles(true)}
                  isLoading={loadingGiftItems}
                  placeholder="Select scheme customer"
                />
              </div>
              {formErrors.issue_type && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.issue_type}
                </span>
              )}
            </div>

            <div className="flex flex-col relative mt-2">
              <label className="text-black mb-1 font-normal">
                Search Mobile Number<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.mobile || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    mobile: value,
                  }));
                }}
                name="mobile"
                onInput={(e) =>
                  (e.target.value = e.target.value.replace(/\D/g, ""))
                }
                pattern="\d{10}"
                maxLength={"10"}
                className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                placeholder="Enter Here"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearchmobile();
                  }
                }}
              />
              <div
                onClick={handleSearchmobile}
                className="absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[70%] -translate-y-1/2 w-10 md:h-[40px] md:top-[48px] h-[18%] sm:right-0 sm:top-[68%] lg:right-[0%]"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <Search size={15} className="text-black" />
                )}
              </div>
              {formErrors.mobile && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.mobile}
                </span>
              )}
            </div>

            {visibleaccount === true && (
              <div className="flex flex-col mt-2">
                <label className="text-black mb-1 font-normal">
                  Scheme Account<span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Select
                    options={schemeaccount}
                    value={
                      schemeaccount.find((item) => item.value === schId) || ""
                    }
                    onChange={(item) => handleChangeSchemeAccount(item)}
                    styles={customStyles(true)}
                    // isLoading={loadingSchAcc}
                    placeholder="Select SchemeAccount Type"
                  />
                  {formErrors.id_scheme_account && (
                    <span className="text-red-500 text-sm mt-1">
                      {formErrors.id_scheme_account}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col mt-2">
              <label className="text-black mb-1 font-normal">
                Customer Name<span className="text-red-400">*</span>
              </label>
              <input
                readOnly
                type="text"
                name="customer_name"
                value={customer_name}
                className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                placeholder="Customer name"
              />
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-black mb-1 font-normal">
                Address<span className="text-red-400">*</span>
              </label>
              <input
                value={address}
                readOnly
                type="text"
                className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                placeholder="Customer address"
              />
            </div>

            {visibleaccount === true && (
              <div className="flex flex-col mt-2">
                <label className="text-black mb-1 font-normal">
                  Alloted Gifts<span className="text-red-400">*</span>
                </label>
                <input
                  readOnly
                  type="text"
                  name="alloted_gifts"
                  value={alloted_gifts}
                  className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                  placeholder="Customer Alloted Gifts"
                />
              </div>
            )}

            <div className="flex flex-col relative mt-2">
              <label className="text-black mb-1 font-normal">
                Search Gift Code/Name<span className="text-red-400">*</span>
              </label>

              <Select
                name="searchGiftCode"
                options={GiftCodeNums}
                value={
                  GiftCodeNums.find(
                    (option) => option.value === searchGiftCode
                  ) || ""
                }
                onChange={(selectedOption) => {
                  setSearchGiftCode(selectedOption.value);
                  // handleSearchGiftCode()
                }}
                components={customComponents}
                styles={{
                  ...customStyles(true),
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                isLoading={loadingGifts}
                menuPortalTarget={document.body}
                placeholder="Search/Select GiftCode"
              />
              {/* Search Icon */}
              <div
                onClick={handleSearchGiftCode}
                className="absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[70%] -translate-y-1/2 w-10 md:h-[40px] md:top-[48px] h-[18%] sm:right-0 sm:top-[68%] lg:right-[0%]"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <Search size={15} className="text-black" />
                )}
              </div>
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-black mb-1 font-normal">
                Gift Stock<span className="text-red-400">*</span>
              </label>
              <input
                readOnly
                type="text"
                name="giftStock"
                value={giftStock}
                className="w-full border-2 border-[#F2F2F9] rounded-md px-3 py-2"
                placeholder="Gifts Stock"
              />
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-black mb-1 font-normal">
                No of Gifts(Qty)<span className="text-red-400">*</span>
              </label>
              <div>
                <input
                  type="text"
                  name="qty"
                  maxLength="5"
                  onInput={(e) => {
                    if (formData.issue_type === 1) {
                      if (Number(e.target.value) > alloted_gifts) {
                        return toast.error(
                          "Not allowed to add gift more than allocated quantity"
                        );
                      }
                    }
                    e.target.value = e.target.value.replace(/\D/g, "");
                  }}
                  value={formData.qty}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      formData.issue_type === 1 &&
                      Number(value) > alloted_gifts
                    ) {
                      return;
                    }
                    setFormData((prev) => ({
                      ...prev,
                      qty: value,
                    }));
                  }}
                  className="w-full border-2 border-[#f2f3f8] rounded-md px-3 py-2"
                  placeholder="Enter Here"
                  required
                />
              </div>

              {formErrors.qty && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.qty}
                </span>
              )}
            </div>

            <div className="flex flex-col mt-3">
              <button
                className="w-20 h-[42px] mx-3 my-[25px] px-16 bg-blue-900 text-white rounded-md hover:bg-blue-800 flex justify-center items-center"
                type="button"
                onClick={handleAdd}
              >
                {AddLoading ? <SpinLoading /> : "Add"}
              </button>
            </div>
          </div>
          {GiftCodeData?.length > 0 && (
            <div className="mt-6 p-3">
              <div className="mb-2">
                <Table
                  data={GiftCodeData}
                  columns={GiftCodecolumns}
                  isLoading={isLoading}
                  showPagination={false}
                />
              </div>
            </div>
          )}
        </div>
        <div className="bg-white border-gray-300">
          <div className="flex justify-end gap-5">
            <button
              className="w-20 h-9 bg-blue-900 text-white rounded-md hover:bg-blue-800 flex justify-center items-center"
              type="button"
              onClick={handleSubmit}
            >
              {isLoading ? <SpinLoading /> : "Submit"}
            </button>
            <button
              className="w-20 h-9 border-2 bg-[#F6F7F9] border-[#f2f3f8] rounded-md hover:bg-gray-50 flex justify-center items-center text-[#6C7086]"
              type="button"
              onClick={handleCancle}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {giftHis?.length > 0 && visibleaccount === true && (
        <div className="w-full flex flex-col bg-white border-2 border-[#f2f3f8] rounded-md p-6  mt-3 overflow-y-auto scrollbar-hide gap-8">
          <div className="mt-6 p-3">
            <div className="mb-2">
              <h2 className="text-xl font-medium mb-4">
                Gift HandOver History
              </h2>
              <Table
                data={giftHis}
                columns={columns}
                isLoading={isLoading}
                currentPage={currentPage}
                handleItemsPerPageChange={handleItemsPerPageChange}
                handlePageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={entries}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GiftHandOverForm;
