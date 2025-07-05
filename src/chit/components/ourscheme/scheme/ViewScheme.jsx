import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import { formatNumber } from "../../../utils/commonFunction";
import {
  getSchemeClassifications,
  allinstallmenttype,
  getallbranch,
  getallmetal,
  getallschemetypes,
  getschemeById,
  allFundtype,
  addscheme,
  updateScheme,
  puritybymetal,
  buygsttype,
  wastagetype,
  getBranchById,
} from "../../../api/Endpoints";
import { useQuery, useQueries, useMutation } from "@tanstack/react-query";
import { benefiMakingCharge, rewardType } from "../../../../utils/Constants";

import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { schemeValidationSchema } from "../../../../utils/validations/schemeValidationSchema";
import SpinLoading from "../../common/spinLoading";
import "react-datepicker/dist/react-datepicker.css";
import { Eye, EyeOff } from "lucide-react";

const ViewScheme = () => {
  const navigate = useNavigate();

  let { id } = useParams();
  const popoverRef = useRef(null);

  //reduux
  const roleData = useSelector((state) => state.clientForm.roledata);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const id_branch = roleData?.id_branch;
  const accessBranch = roleData?.branch;

  // State management
  const [classifications, setClassifications] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [descriptionImage, setDescriptionImage] = useState(null);

  const [metal, setMetal] = useState([]);
  const [purity, setPurity] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [branch, setBranch] = useState(() => (accessBranch === "0" ? [] : {}));
  const [amounts, setAmounts] = useState([]);
  const [newAmount, setNewAmount] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [installment_data, setInstallment] = useState([]);
  const [funddata, setFundType] = useState([]);
  const [wastagedata, setWastageType] = useState([]);
  const [schemeTypeData, setSchemeTypeData] = useState([]);
  const [giftType, setGiftType] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [benefitMaking, setMaking] = useState([]);
  const [reward, setReward] = useState([]);
  const [eyeOpen, setEye] = useState(false);

  const formik = useFormik({
    initialValues: {
      classType: false,
      // SchemeForm fields
      scheme_name: "",
      code: "",
      id_classification: "",
      id_metal: "",
      id_purity: "",
      installment_type: "",
      maturity_period: "", // maturityMonth
      scheme_type: null,
      totalCountAmount: "",
      incrementRate: "",
      id_branch: "",
      startingAmount: "",
      saving_type: "",
      final_join_date: "",

      // PayableDetails fields
      amount: "",
      min_amount: "",
      max_amount: "",
      min_weight: "",
      max_weight: "",
      total_installments: "",
      benefit_min_installment_wst_mkg: "",
      wastagebenefit: "",
      benefit_making: "",

      //classification
      description: "",
      term_desc: "",
      classification_order: "",

      wastagetype: "",

      // AdvancedSettings fields
      limit_installment: "",
      pending_installment: "",
      paid_installment: "",
      limit_customer: "",
      gift_minimum_paid_installment: 0,

      //gift
      gift_type: 1,
      no_of_gifts: 0,

      bonus_type: "",
      bonus_amount: 0,
      bonus_percent: "",
      not_paid_installment: "",
      convenience_fees: "",
      display_referral: false,
      display_Weight_in_ledger: false,
      wallet_redemption_onpayment: false,
      pathUrl: "",
      logo: "",
      desc_img: "",
      fixed_amounts: [],
    },
    validationSchema: schemeValidationSchema,
    onSubmit: (values) => {
      const formData = new FormData();

      if (formik.values.classType) {
        amounts.forEach((amount) => {
          if (amount !== "") {
            formData.append("fixed_amounts[]", amount);
          }
        });
      }

      Object.keys(values).forEach((key) => {
        if (
          !formik.values.classType &&
          ["startingAmount", "totalCountAmount", "incrementRate"].includes(key)
        ) {
          return;
        }

        formData.append(key, values[key]);
      });

      // Ensure that min/max weight or min/max amount are only appended once
      if (
        formik.values.classType &&
        [12, 3, 4].includes(formik.values.scheme_type)
      ) {
        formData.delete("min_amount");
        formData.delete("max_amount");
        formData.delete("min_weight");
        formData.delete("max_weight");
        formData.append("min_weight", amounts[0]);
        formData.append("max_weight", amounts[amounts.length - 1]);
      } else if (formik.values.classType) {
        formData.delete("min_weight");
        formData.delete("max_weight");
        formData.delete("min_amount");
        formData.delete("max_amount");
        formData.append("min_amount", amounts[0]);
        formData.append("max_amount", amounts[amounts.length - 1]);
      }

      if (mainImage) {
        formData.append("logo", mainImage);
      }

      if (descriptionImage) {
        formData.append("desc_img", descriptionImage);
      }

      if (id) {
        setIsLoading(true);
        updateSchemeData({ id, data: formData });
      } else {
        setIsLoading(true);
        addNewScheme(formData);
      }
    },
  });

  //query and mutations
  const { data: classificationData } = useQuery({
    queryKey: ["projects"],
    queryFn: getSchemeClassifications,
  });

  const { data: branchData } = useQuery({
    queryKey: ["branches", accessBranch, id_branch],
    queryFn: async () => {
      if (accessBranch === "0") {
        setIsLoading(true);
        return getallbranch();
      }
      setIsLoading(true);
      return getBranchById(id_branch);
    },
    enabled: Boolean(accessBranch),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const { data: schemeData } = useQuery({
    queryKey: ["scheme", id],
    queryFn: async () => await getschemeById(id),
    enabled: Boolean(id),
  });

  const { data: metalResponse } = useQuery({
    queryKey: ["branches"],
    queryFn: getallmetal,
  });

  const { data: purityResponse } = useQuery({
    queryKey: ["purity", formik.values.id_metal],
    queryFn: () => puritybymetal(formik.values.id_metal),
    enabled: !!formik.values.id_metal,
  });

  const results = useQueries({
    queries: [
      { queryKey: ["installment_type"], queryFn: allinstallmenttype },
      { queryKey: ["fund_type"], queryFn: allFundtype },
      { queryKey: ["wastagetype"], queryFn: wastagetype },
      { queryKey: ["schemeTypeApi"], queryFn: getallschemetypes },
    ],
  });

  const [
    installment_type,
    fund_type,
    wastage_type,
    scheme_typeResponse,
    giftIssueResponse,
  ] = results.map((result) => result.data);

  const { mutate: addNewScheme } = useMutation({
    mutationFn: addscheme,
    onSuccess: (response) => {
      setIsLoading(false);
      toast.success(response.message);
      navigate("/scheme/scheme/");
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.response.message);
    },
  });

  const { mutate: updateSchemeData } = useMutation({
    mutationFn: ({ id, data }) => updateScheme(id, data),
    onSuccess: (response) => {
      if (response.status === 200) {
        setIsLoading(false);
        toast.success(response.message);
        formik.resetForm();
        navigate("/scheme/scheme/");
      }
    },
    onError: () => {
      setIsLoading(false);
      toast.error(response.message);
    },
  });

  //useEffect
  useEffect(() => {
    const data = rewardType.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    setReward(data);
  }, [rewardType]);

  useEffect(() => {
    const data = benefiMakingCharge.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    setMaking(data);
  }, [benefiMakingCharge]);

 useEffect(() => {
    if (id && schemeData) {
      // Set the classification type first
      const classItem = classifications?.find(
        (c) => c?.value === schemeData?.id_classification
      );
      if (classItem) {
        handleClassChange({ value: classItem?.value, id: classItem?.id });
      }

      // Set field values
      formik.setValues({
        ...formik.values,
        scheme_name: schemeData.data?.scheme_name || "",
        code: schemeData.data?.code || "",
        id_classification: schemeData.data?.id_classification?._id || "",
        id_branch: schemeData?.data?.id_branch || "",
        id_metal: schemeData?.data?.id_metal?._id || "",
        id_purity: schemeData?.data?.id_purity?._id || "",
        installment_type: schemeData.data?.installment_type || "",
        maturity_period: schemeData.data?.maturity_period || "",
        saving_type: schemeData.data?.saving_type || "",
        totalCountAmount: schemeData?.data?.totalCountAmount || "",
        incrementRate: schemeData.data?.incrementRate || "",
        startingAmount: schemeData.data?.startingAmount || "",
        min_amount: schemeData.data?.min_amount || 0,
        max_amount: schemeData.data?.max_amount || 0,
        min_weight: schemeData.data?.min_weight || 0,
        max_weight: schemeData.data?.max_weight || 0,
        wastagebenefit: schemeData.data?.wastagebenefit || "",
        total_installments: schemeData.data?.total_installments || schemeData?.data?.noOfDays || "",
        benefit_making: schemeData.data?.makingcharge || "",
        grace_type: schemeData.data?.grace_type || "",
        grace_period: schemeData.data?.grace_period || "",
        grace_fine: schemeData.data?.grace_fine || "",
        description: schemeData.data?.description || "",
        term_desc: schemeData.data?.term_desc || "",
        customer_referral_per: schemeData.data?.customer_referral_per || "",
        customer_incentive_per: schemeData.data?.customer_incentive_per || "",
        customer_ref_remarks: schemeData.data?.customer_ref_remarks || "",
        agent_referral_percentage: schemeData.data?.agent_referral_percentage || "",
        agent_incentive: schemeData.data?.agent_incentive || "",
        agent_target_per: schemeData.data?.agent_target_per || "",
        agent_partial_per: schemeData.data?.agent_partial_per || "",
        agent_remark: schemeData.data?.agent_remark || false,
        limit_installment: schemeData.data?.limit_installment || "",
        pending_installment: schemeData.data?.pending_installment || "",
        paid_installment: schemeData.data?.allowed_minpaid || "",
        limit_customer: schemeData.data?.limit_customer || 0,
        gift_type: schemeData.data?.gift_type || 1,
        no_of_gifts: schemeData.data?.no_of_gifts || 0,
        convenience_fees: schemeData.data?.convenience_fees || 0,
        fine_amount: schemeData.data?.fine_amount || 0,
        cumulative_fine_amount: schemeData.data?.cumulative_fine_amount || "",
        display_referral: schemeData.data?.display_referral || false,
        display_Weight_in_ledger: schemeData?.data?.display_Weight_in_ledger || false,
        wallet_redemption_onpayment: schemeData.data?.wallet_redemption_onpayment || false,
        gift_minimum_paid_installment: schemeData.data?.gift_minimum_paid_installment || 0,
        bonus_type: schemeData.data?.bonus_type || "",
        bonus_amount: schemeData?.data?.bonus_amount || 0,
        bonus_percent: schemeData?.data?.bonus_percent || "",
        not_paid_installment: schemeData?.data?.not_paid_installment || "",
        benefit_min_installment_wst_mkg: schemeData?.data?.benefit_min_installment_wst_mkg || "",
        classification_order: schemeData?.data?.classification_order,
        grace_fine_amount: schemeData?.data?.grace_fine_amount || false,
        final_join_date: schemeData?.data?.final_join_date || "",
        pathUrl: schemeData?.data?.pathUrl || "",
        logo: schemeData?.data?.logo || "",
        desc_img: schemeData?.data?.desc_img || "",
        fixed_amounts: schemeData?.data?.fixed_amounts || [],
        referralPercentage: schemeData?.data?.referralPercentage || 0,
      });

      if (schemeData?.data?.logo) {
        setMainImage(schemeData?.data?.logo);
      }
      if (schemeData?.data?.desc_img) {
        setDescriptionImage(schemeData?.data?.desc_img);
      }
      if (schemeData?.data?.fixed_amounts?.length > 0) {
        formik.setFieldValue("classType", true);
      }
      if (schemeData?.data) {
        formik.setFieldValue("scheme_type", schemeData?.data?.scheme_type);
      }
    }
  }, [id, schemeData, classifications]);

  useEffect(() => {
    if (schemeData?.data && Array.isArray(schemeData.data.fixed_amounts)) {
      setAmounts(schemeData.data.fixed_amounts);
    }
  }, [schemeData?.data]);

  useEffect(() => {
    if (installment_type?.data) {
      const installment_data = installment_type.data.map((item) => ({
        value: item.installment_type,
        label: item.installment_name,
      }));
      setInstallment(installment_data);
    }

    if (fund_type?.data) {
      const fund_data = fund_type.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setFundType(fund_data);
    }

    // if (buy_gst?.data) {
    //   const buy_gst_data = buy_gst.data.map((item) => ({
    //     value: item.id,
    //     label: item.name,
    //   }));
    //   setBuyGst(buy_gst_data);
    // }

    if (wastage_type?.data) {
      const wastage_data = wastage_type.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setWastageType(wastage_data);
    }

    if (scheme_typeResponse?.data) {
      const data = scheme_typeResponse.data.map((item) => ({
        value: item.scheme_type,
        label: item.scheme_typename,
      }));
      setSchemeTypeData(data);
    }

    if (giftIssueResponse) {
      const data = giftIssueResponse.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setGiftType(data);
    }
  }, [installment_type, fund_type, wastage_type, scheme_typeResponse]);

  useEffect(() => {
    if (classificationData) {
      const data = classificationData?.data?.map((item) => ({
        value: item?._id,
        label: item?.name,
        id: item?.order,
      }));
      setClassifications(data);
    }
  }, [classificationData]);

  useEffect(() => {
    if (formik.values.incrementRate) {
      const incrementRate = formik.values.incrementRate;
      const startingAmount = formik.values.startingAmount;
      const totalCountAmount = formik.values.totalCountAmount;
      if (
        incrementRate === "" ||
        startingAmount === "" ||
        totalCountAmount === ""
      ) {
        setAmounts([]);
      } else {
        generateAmounts(totalCountAmount, startingAmount, incrementRate);
      }
    }
  }, [
    formik.values.incrementRate,
    formik.values.startingAmount,
    formik.values.totalCountAmount,
  ]);

  // useEffect for branches
  useEffect(() => {
    if (!branchData) return;

    if (accessBranch === "0" && branchData.data) {
      const formattedBranches = branchData.data.map((item) => ({
        value: item._id,
        label: item.branch_name,
      }));
      setBranch(formattedBranches);
      setIsLoading(false);
    } else if (branchData.data) {
      setBranch(branchData.data);
      formik.setFieldValue("id_branch", branchData.data._id);
      setIsLoading(false);
    }
  }, [branchData, accessBranch]);

  // useEffect for metals
  useEffect(() => {
    if (metalResponse) {
      const data = metalResponse?.data?.map((item) => ({
        value: item?._id,
        label: item?.metal_name,
      }));
      setMetal(data);
    }
  }, [metalResponse]);

  // useEffect for purity
  useEffect(() => {
    if (purityResponse) {
      const data = purityResponse.data.map((item) => ({
        value: item._id,
        label: item.purity_name,
      }));
      setPurity(data);
    }
  }, [purityResponse]);

  // Handler for adding new amount
  const handleAddAmount = () => {
    if (
      formik.values.totalCountAmount &&
      formik.values.startingAmount &&
      formik.values.incrementRate
    ) {
      if (newAmount && !amounts.includes(Number(newAmount))) {
        setAmounts([...amounts, Number(newAmount)]);
        setNewAmount("");
      }
    } else {
      toast.error("Fill the requried fields");
    }
  };

  //handler to choose the
  const handleClassChange = (selectedOption) => {
    formik.setFieldValue(
      "id_classification",
      selectedOption ? selectedOption.value : ""
    );

    if (selectedOption?.id === 2) {
      setSelectedClass(null);
      formik.setFieldValue("classType", true);
      formik.setFieldValue("scheme_type", null);
    } else if (selectedOption?.id === 1) {
      setSelectedClass(1);
      formik.setFieldValue("classType", false);
      formik.setFieldValue("scheme_type", null);
      formik.setFieldValue("totalCountAmount", "");
      formik.setFieldValue("incrementRate", "");
      formik.setFieldValue("startingAmount", "");
      setAmounts([]);
    } else {
      setSelectedClass(3);
      formik.setFieldValue("classType", false);
      formik.setFieldValue("scheme_type", null);
      formik.setFieldValue("totalCountAmount", "");
      formik.setFieldValue("incrementRate", "");
      formik.setFieldValue("startingAmount", "");
      setAmounts([]);
    }
  };

  const handleEnableEdit = () => {
    setIsEditMode(true);
  };

  const handleAmountSelect = (index) => {
    setSelectedAmount(index);
    setEditAmount(amounts[index]);
  };

  const handleAmountChange = (e) => {
    setEditAmount(e.target.value);
  };

  // Handler for saving the edited amount
  const handleSaveAmount = (index) => {
    if (editAmount !== "" && !isNaN(editAmount)) {
      const updatedAmounts = [...amounts];
      updatedAmounts[index] = Number(editAmount);
      setAmounts(updatedAmounts);
    }
    setIsEditMode(false);
    setSelectedAmount(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddAmount();
    }
  };

  //helper function
  const generateAmounts = (totalCount, start, incrementRate) => {
    const generatedAmounts = [];
    let currentAmount = start;

    for (let i = 0; i < totalCount; i++) {
      generatedAmounts.push(currentAmount);
      currentAmount += incrementRate;
    }

    setAmounts(generatedAmounts);
  };

  const filteredSchemeTypeData = React.useMemo(() => {
    if (!schemeTypeData) return [];

    if (formik.values.classType) {
      // Fixed scheme types
      return schemeTypeData.filter((option) =>
        [0, 1, 2, 3].includes(option.value)
      );
    } else if (selectedClass === 1) {
      // Flexi scheme types
      return schemeTypeData.filter((option) =>
        [5, 11, 12, 13].includes(option.value)
      );
    } else if (selectedClass === 3) {
      // Flexi-Fixed scheme types
      return schemeTypeData.filter((option) =>
        [7, 6, 8, 4].includes(option.value)
      );
    }
    return schemeTypeData;
  }, [schemeTypeData, formik.values.classType, selectedClass]);

  useEffect(() => {
    if (classificationData?.data?.length > 0) {
      const value = classificationData?.data?.find(
        (item) => item._id === formik.values.id_classification
      );
      if (value?.order === 2) {
        formik.setFieldValue("classType", true);
      }
    }
  }, [classificationData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setEye(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="flex flex-row w-full justify-between items-center mb-4">
        <p className="text-sm text-gray-400 mt-4 mb-3">
          Scheme / <span className="text-black">View</span>
        </p>
        <div className="flex justify-end space-x-4">
          {/* <button
            type="submit"
            onClick={() => navigate(`/scheme/addscheme/${id}`)}
            className="w-20 h-9 bg-blue-900 text-white rounded-md hover:bg-blue-800 flex justify-center items-center"
          >
            Edit
          </button> */}
        </div>
      </div>
      <div className="w-full flex flex-col gap-3 space-y-6">
        <div className="bg-[#FFFFFF] rounded-lg p-6 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 border-b pb-4">
            View Scheme
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Scheme Name
              </label>
              <p className="text-[#72737e] pb-2">{formik.values.scheme_name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Scheme Code
              </label>
              <p className="text-[#72737e] pb-2">{formik.values.code}</p>
            </div>
            {accessBranch === "0" && branch.length > 0 && !isLoading ? (
              <div>
                <label className="block text-sm font-medium mb-1">Branch</label>
                {branch.length > 0 ? (
                  <p className="text-[#72737e] pb-2">
                    {branch?.find(
                      (item) => item.value === formik.values.id_branch
                    )?.label || "N/A"}
                  </p>
                ) : (
                  <p className="text-[#72737e] pb-2">
                    {branch?.find(
                      (item) => item.value === formik.values.id_branch
                    )?.label || "N/A"}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-1">Branch</label>
                <p className="text-[#72737e] pb-2">{branch?.branch_name}</p>
                {/* <input
                  type="text"
                  disabled
                  value={branch?.branch_name || ""}
                  className="w-full border-2 border-[#f2f3f8] rounded-md px-3 py-2 text-gray-500"
                /> */}
                {formik.errors.id_branch && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.id_branch}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Metal Type
              </label>
              <p className="text-[#72737e] pb-2">
                {metal?.find((item) => item.value === formik.values.id_metal)
                  ?.label || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Purity</label>
              <p className="text-[#72737e] pb-2">
                {purity?.find((item) => item.value === formik.values.id_purity)
                  ?.label || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Classification
              </label>
              <p className="text-[#72737e] pb-2">
                {classifications?.find(
                  (item) => item.value === formik.values.id_classification
                )?.label || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Scheme Type
              </label>
              <p className="text-[#72737e] pb-2">
                {filteredSchemeTypeData?.find(
                  (item) => item.value === formik.values.scheme_type
                )?.label || "N/A"}
              </p>
            </div>

            {formik.values.scheme_type !== 10 && formik.values.scheme_type !== 14 && (
              <>
              <div>
              <label className="block text-sm font-medium mb-1">
                Installment Type
              </label>
              <p className="text-[#72737e] pb-2">
                {installment_data?.find(
                  (item) => item.value === formik.values.installment_type
                )?.label || "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Maturity Period
              </label>
              <p className="text-[#72737e] pb-2">
                {formik.values.maturity_period}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Saving Type
              </label>
              <p className="text-[#72737e] pb-2">
                {funddata?.find(
                  (item) => item.value === formik.values.saving_type
                )?.label || "N/A"}
              </p>
            </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Installments
              </label>
              <p className="text-[#72737e] pb-2">
                {formik.values.total_installments || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-lg p-6 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 border-b pb-4">
            Payable Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {![12, 3, 4].includes(formik.values.scheme_type) ? (
              <>
                {formik.values.classType ? (
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">
                      <span className="flex gap-2">
                        Amount{" "}
                        {eyeOpen ? (
                          <EyeOff
                            className="h-5 w-5 pt-1 cursor-pointer"
                            onClick={() => setEye(false)}
                          />
                        ) : (
                          <Eye
                            className="h-5 w-5 pt-1 cursor-pointer"
                            onClick={() => setEye(true)}
                          />
                        )}
                      </span>
                    </label>
                    <p className="text-[#72737e] pb-2">
                      {`${formatNumber({
                        value: formik.values.min_amount,
                        decimalPlaces: 0,
                      })} - ${formatNumber({
                        value: formik.values.max_amount,
                        decimalPlaces: 0,
                      })}`}
                    </p>
                    {eyeOpen && (
                      <div
                        ref={popoverRef}
                        className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 w-48"
                      >
                        <div className="grid grid-cols-3 gap-1">
                          {formik.values.fixed_amounts.map((amount, index) => (
                            <div
                              key={index}
                              className="px-3 py-1 text-sm hover:bg-gray-100 rounded cursor-default"
                            >
                              {formatNumber({
                                value: amount,
                                decimalPlaces: 0,
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Min Amount
                      </label>
                      <p className="text-[#72737e] pb-2">
                        {formatNumber({
                          value: formik.values.min_amount,
                          decimalPlaces: 0,
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Max Amount
                      </label>
                      <p className="text-[#72737e] pb-2">
                        {formatNumber({
                          value: formik.values.max_amount,
                          decimalPlaces: 0,
                        })}
                      </p>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                {formik.values.classType ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Weight
                      </label>
                      <p className="text-[#72737e] pb-2">
                        {`${formatNumber({
                          value: formik.values.min_weight,
                          decimalPlaces: 0,
                        })}-${formatNumber({
                          value: formik.values.max_weight,
                          decimalPlaces: 0,
                        })})`}
                      </p>
                      {eyeOpen && (
                        <div
                          ref={popoverRef}
                          className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 w-48"
                        >
                          <div className="grid grid-cols-1 gap-1">
                            {formik.values.fixed_amounts.map(
                              (amount, index) => (
                                <div
                                  key={index}
                                  className="px-3 py-1 text-sm hover:bg-gray-100 rounded cursor-default"
                                >
                                  {amount}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Min Weight
                      </label>
                      <p className="text-[#72737e] pb-2">
                        {formik.values.min_weight}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Max Weight
                      </label>
                      <p className="text-[#72737e] pb-2">
                        {formik.values.max_weight}
                      </p>
                    </div>
                  </>
                )}
              </>
            )}
            {formik.values.scheme_type !==10 && formik.values.scheme_type !== 14 && (
              <>
              <div>
              <label className="block text-sm font-medium mb-1">
                Benefit Wastage
              </label>
              <p className="text-[#72737e] pb-2">
                {wastagedata?.find(
                  (item) => item.value === formik.values.wastagebenefit
                )?.label || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Benefit Making Charge
              </label>
              <p className="text-[#72737e] pb-2">
                {benefitMaking?.find(
                  (item) => item.value === formik.values.benefit_making
                )?.label || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Bonus Type
              </label>
              <p className="text-[#72737e] pb-2">
                {reward?.find((item) => item.value === formik.values.bonus_type)
                  ?.label || "N/A"}
              </p>
            </div>

            {formik.values.bonus_type !== 2 ? (
              <div className="">
                <label className="block text-sm font-medium mb-1">
                  Benefit Bonus Amount
                </label>
                <div className="relative">
                  <p className="text-[#72737e] pb-2">
                    <span className="text-[#72737e]">₹</span>
                    {formik.values.bonus_amount}
                  </p>
                </div>
              </div>
            ) : (
              <div className="">
                <label className="block text-sm font-medium mb-1">
                  Benefit Bonus Percentage
                </label>
                <p className="text-[#72737e] pb-2">
                  {formik.values.bonus_percent}{" "}
                  <span className="text-[#72737e]">%</span>
                </p>
              </div>
            )}
              </>
            )}
          </div>
        </div>

        {formik.values.scheme_type !== 10 && formik.values.scheme_type !== 14 && (
          <>
          <div className="bg-[#FFFFFF] rounded-lg p-6 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 border-b pb-4">
            Installment
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Monthly Installment Limit
              </label>
              <p className="text-[#72737e] pb-2">
                {formik.values.limit_installment}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Scheme Customer Limit
              </label>
              <p className="text-[#72737e] pb-2">
                {formik.values.limit_customer}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Minimum Paid Installment (for gift)
              </label>
              <p className="text-[#72737e] pb-2">
                {formik.values.gift_minimum_paid_installment}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Number of Gifts
              </label>
              <p className="text-[#72737e] pb-2">{formik.values.no_of_gifts}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Convenience Fee
              </label>
              <p className="text-[#72737e] pb-2">
                <span className="text-[#72737e]">₹</span>
                {formik.values.convenience_fees}
              </p>
            </div>
          </div>
          <h2 className="text-lg font-semibold mb-4 border-b pb-4">Referral</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Referral Percentage (Monthly)
              </label>
              <p className="text-[#72737e] pb-2">
                {`${formik.values?.referralPercentage} %`}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Display Referral
              </label>
              <p className="text-[#72737e] pb-2">
                {formik.values?.display_referral ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
          </>
        )}

        {/* classification */}
        <div className="bg-[#FFFFFF] rounded-lg p-6 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 border-b pb-4">
            Classification
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Main Image
              </label>
              <div className="">
                <img
                  className="w-[36px] h-[40px] border rounded-md"
                  src={`${formik.values.pathUrl}${mainImage}`}
                />
              </div>
              <p className="text-[#72737e] pb-2">{formik.values?.logo}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description Image
              </label>
              <div className="">
                <img
                  className="w-[36px] h-[40px] border rounded-md"
                  src={`${formik.values.pathUrl}${descriptionImage}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <div className="text-[#72737e] overflow-auto max-h-[200px]">
                <p className="text-[#72737e] pb-2">
                  {formik.values.description}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Terms & Conditions
              </label>
              <div className="text-[#72737e] overflow-auto max-h-[200px]">
                <p className="whitespace-pre-wrap break-words">
                  {formik.values.term_desc}
                </p>
              </div>
            </div>

            {formik.values?.scheme_type !== 10 &&
              formik.values?.scheme_type !== 14 && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Display Order
                  </label>
                  <p className="text-[#72737e] pb-2">
                    {formik.values?.classification_order}
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewScheme;
