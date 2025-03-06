import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useFormik } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { CalendarDays, Search, ChevronDown, ChevronUp } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  addschemepayment,
  getmultipaymentmode,
  searchmobileschemeaccount,
  getschemepaymentbyid,
  getschemeById,
  updateschemepayment,
  getallbranchscheme,
  getallbranchclassification,
  getallbranch,
  getBranchById,
  getallpaymentmode,
  getMetalRateByMetalId,
} from "../../../api/Endpoints";
import { useDispatch, useSelector } from "react-redux";
const AddSchemePayment = () => {
  let dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const todaydate = new Date();

  //reduux
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roleData = useSelector((state) => state.clientForm.roledata);
  const id_branch = roleData?.id_branch;
  const accessBranch = roleData?.branch;

  const [searcherror, setSearchError] = useState("");
  const [multipaymode, setMultiPaymode] = useState([]);
  const [ispaymode, setIspaymode] = useState(false);

  const formattedDate = todaydate.toISOString();
  const [date_payment, setDatePayment] = useState(formattedDate);
  const [searchmobile, setSearchMobile] = useState("");
  const [mobile, setMobile] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [paymentmode, setPaymentmode] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [ispayamtreadOnly, setIspayamtreadOnly] = useState(true);
  const [branch, setBranch] = useState(() => (accessBranch === "0" ? [] : {}));
  const [paymentamount, setPaymentAmount] = useState(0);
  const [metal_rate, setMetalRate] = useState(0);
  const [fine_amount, setFineAmount] = useState(0);
  const [isseaccontno, setIsseAccontno] = useState(2);
  const [issetreceipt, setIssetReceipt] = useState(2);
  const [accountreadOnly, setAccountreadOnly] = useState(false);
  const [schemedata, setSchemeData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState({});
  const [weight, setWeight] = useState([12, 3, 4]);
  const [minWeight, setMinWeight] = useState(0);
  const [maxWeight, setMaxWeight] = useState(0);
  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(0);
  const [selectedMode,setSelectedMode]= useState(0)
  const [formData, setFormData] = React.useState({
    id_customer: "",
    mobile: "",
    date_payment: date_payment,
    payment_mode: "",
    itr_utr: "",
    remark: "",
    scheme_acc_number: "",
    id_scheme: "",
    id_branch: id_branch,
    id_scheme_account: "",
    scheme_type: 0,
    buy_gst: 0,
    fine_amount: 0,
    total_amt: 0,
    payment_amount: 0,
    metal_rate: 0,
    metal_weight: 0,
    accountschemeid: "",
    total_installments: 1,
    id_classification: "",
  });

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

  const formik = useFormik({
    initialValues: {
      id_customer: "",
      mobile: 0,
      date_payment: date_payment,
      payment_mode: "",
      itr_utr: "",
      remark: "",
      scheme_acc_number: "",
      id_scheme: "",
      id_branch: "",
      id_scheme_account: "",
      scheme_type: 0,
      buy_gst: 0,
      fine_amount: 0,
      total_amt: 0,
      payment_amount: 0,
      metal_rate: 0,
      metal_weight: 0,
      // accountschemeid: "",
      total_installments: 1,
      id_classification: "",
    },
    validationSchema : Yup.object({
      id_branch: Yup.string().required("Branch is required"),
      mobile: Yup.string()
        .required("Mobile number is required")
        .matches(/^(\+)?\d*$/, "Invalid mobile number")
        .min(10, "Mobile number must be at least 10 digits")
        .max(13, "Mobile number must be at most 13 digits"),
      id_scheme_account: Yup.string().required("Scheme account is required"),
      date_payment: Yup.date().required("Payment date is required"),
      metal_rate: Yup.number().optional("Metal rate is required"),
      metal_weight: Yup.number().optional("Metal weight is required"),
      payment_amount: Yup.number()
        .required("Payment amount is required")
        .min(0, "Payment amount must be greater than or equal to 0"),
      buy_gst: Yup.number().min(0, "GST must be greater than or equal to 0"),
      fine_amount: Yup.number().min(0, "Fine amount must be greater than or equal to 0"),
      total_amt: Yup.number().required("Total amount is required"),
      payment_mode: Yup.string().required("Payment mode is required"),
      itr_utr: Yup.string(),
      remark: Yup.string(),
    }),
    onSubmit: (values) => {
      if(id){
        updateschemepaymentmutate({id,values})
      }else{
        createschemepaymentmutate(values)
      }
    },
  });

  //api calls
  const { data: branchData } = useQuery({
    queryKey: ["branches", accessBranch, id_branch],
    queryFn: async () => {
      if (accessBranch === "0") {
        return getallbranch();
      }
      return getBranchById(id_branch);
    },
    enabled: Boolean(accessBranch),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const { data: paymentModes } = useQuery({
    queryKey: ["modes"],
    queryFn: getallpaymentmode,
    enabled: Boolean(accessBranch),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const { data: multiplayModes } = useQuery({
    queryKey: ["multipay", formik.values.payment_mode],
    queryFn: async () => {
      if (formik.values.payment_mode === 7) {
        return getmultipaymentmode();
      }
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });


  const { mutate: createschemepaymentmutate } = useMutation({
    mutationFn: addschemepayment,
    onSuccess: (response) => {
      toast.success(response.message);
      navigate("/payment/schemepayment");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const { mutate: updateschemepaymentmutate } = useMutation({
    mutationFn: updateschemepayment,
    onSuccess: (response) => {
      toast.success(response.message);
      navigate("/payment/schemepayment");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const { mutate: handlesearchschemeaccount } = useMutation({
    mutationFn: searchmobileschemeaccount,
    onSuccess: (response) => {
      if (response) {
        if (response.data) {
          const outputData = response.data;
          const data = outputData.map((item) => ({
            value: item._id,
            label: item.scheme_name,
          }));
          setSchemeData(data);
          setFullData(outputData);
        }

        if (response?.general) {
          setIsseAccontno(response?.general?.account_number);
          setIssetReceipt(response?.general?.display_receiptno);
        }
        toast.success(response.message);
      }
    },
  });

  // useEffects
  useEffect(() => {
    if (selectedMode === 7) {
      if (multiplayModes) {
        setIspaymode(true);
        const data = multiplayModes.data.map((item) => ({
          value: item.parameter,
          label: item.name,
        }));
        setMultiPaymode(data);
      }
    } else {
      setIspaymode(false);
    }
  }, [multiplayModes,selectedMode]);

  useEffect(() => {
    if (paymentModes) {
      const data = paymentModes.data.map((item) => ({
        mode: item.id_mode,
        value:item._id,
        label: item.mode_name,
      }));
      setPaymentmode(data);
    }
  }, [paymentModes]);

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
      formik.setFieldValue("id_branch", accessBranch);
    }
  }, [branchData, accessBranch]);

  useEffect(() => {
    const fetchMetalRate = async () => {
      if (!formik.values.id_scheme_account || !todaydate) return;

      const filteredData = fullData.find(
        (item) => item._id === formik.values.id_scheme_account
      );

      if (!filteredData) return;
      setSelectedScheme(filteredData);
      try {
        const metalRate = await getMetalRateByMetalId(
          filteredData.id_scheme?.id_metal?._id || "",
          filteredData.id_scheme?.id_purity || "",
          todaydate
        );

        if (metalRate) {
          const rate = metalRate.data.rate;
          formik.setFieldValue("metal_rate", rate);
          setMetalRate(metalRate);
        }
      } catch (error) {
        console.error("Error fetching metal rate:", error);
      }
    };

    fetchMetalRate();
  }, [formik.values.id_scheme_account, fullData]);

  useEffect(() => {
    if (selectedScheme) {
      formik.setFieldValue("id_scheme", selectedScheme?.id_scheme?._id);
      formik.setFieldValue("id_branch", selectedScheme?.id_scheme?.id_branch);
      formik.setFieldValue("buy_gst", selectedScheme?.id_scheme?.buy_gst);
      formik.setFieldValue("mobile", selectedScheme?.id_customer?.mobile);
      formik.setFieldValue('id_classification',selectedScheme?.id_classification?._id)
      formik.setFieldValue('id_customer',selectedScheme?.id_customer?._id)
      // formik.setFieldValue('fine_amount',selectedScheme?.id_scheme?.fine_amount)

      let payment_amount = 0;
      console.log(
        selectedScheme?.scheme_type,
        selectedScheme?.id_classification?.order
      );
      if (
        weight.includes(selectedScheme?.id_scheme?.scheme_type) &&
        selectedScheme?.id_classification?.order === 2
      ) {
        console.log("first");
        // setPaymentAmount(selectedScheme.amount);
        // setMinWeight(selectedScheme.id_scheme.min_weight)
        // setMaxWeight(selectedScheme.id_scheme.max_weight)
        // payment_amount = selectedScheme.id_scheme.min_weight;
        formik.setFieldValue("payment_amount", selectedScheme.amount);
        setIspayamtreadOnly(true);
      } else if (
        !weight.includes(selectedScheme?.id_scheme?.scheme_type) &&
        selectedScheme?.id_classification?.order === 2
      ) {
        console.log("second");
        // setPaymentAmount(selectedScheme?.id_scheme?.min_amount);
        payment_amount = selectedScheme.amount;
        formik.setFieldValue("payment_amount", selectedScheme.amount);
        setIspayamtreadOnly(true);
      } else {
        console.log("third");
        setPaymentAmount(selectedScheme?.id_scheme?.amount);
        payment_amount = selectedScheme?.id_scheme?.amount;
        setIspayamtreadOnly(false);
      }
    }
  }, [selectedScheme]);
  console.log(formik.values);

  useEffect(() => {
    if (id) {
      handlepaymentbyid({ id: id });
      setAccountreadOnly(true);
    }
  }, [id]);

  useEffect(() => {
    if (metal_rate !== 0) {
      calculatepayment();
    }
  }, [formik.values.metal_rate, paymentamount, formik.values.payment_amount]);

  // useEffect(() => {
  //   if (id_branch !== "0") {
  //     schemepaymenttodayrateMutate({
  //       id_branch: id_branch,
  //       date: date_payment,
  //     });
  //   }
  // }, [id_branch, date_payment, selectedScheme]);

  //handler functions
  const handlepaymentbyid = async (data) => {
    if (!data) return;
    const response = await getschemepaymentbyid(data);
    if (response) {
      if (response.data.payment_mode === 6) {
        setIspaymode(true);
      } else {
        setIspaymode(false);
      }
      setSchemeData([
        {
          _id: response.data.id_scheme_account._id,
          id_scheme: response.data.id_scheme,
          scheme_acc_number: response.data.id_scheme_account.scheme_acc_number,
        },
      ]);

      let payment_amount = 0;
      if (response.data.id_scheme.scheme_type === 3) {
        setPaymentAmount(response.data.id_scheme.min_weight);
        payment_amount = response.data.id_scheme.min_weight;
        setIspayamtreadOnly(false);
      } else if (
        response.data.id_scheme.scheme_type === 4 ||
        response.data.id_scheme.scheme_type === 5 ||
        response.data.id_scheme.scheme_type === 7 ||
        response.data.id_scheme.scheme_type === 8 ||
        response.data.id_scheme.scheme_type === 9 ||
        response.data.id_scheme.scheme_type === 10
      ) {
        setPaymentAmount(response.data.id_scheme.min_amount);
        payment_amount = response.data.id_scheme.min_amount;
        setIspayamtreadOnly(false);
      } else {
        setPaymentAmount(response.data.id_scheme.amount);
        payment_amount = response.data.id_scheme.amount;
        setIspayamtreadOnly(true);
      }
      setSelectedId(response.data.id_scheme_account._id);
      setFormData({
        id_scheme_account: response.data.id_scheme_account._id,
        id_scheme: response.data.id_scheme._id,

        // id_classification: response.data.id_classification,

        mobile: response.data.id_customer.mobile,
        id_customer: response.data.id_customer._id,
        code: response.data.id_scheme.code,
        scheme_type: response.data.id_scheme.scheme_type,
        scheme_acc_number: response.data.id_scheme_account.scheme_acc_number,

        id_branch: response.data.id_scheme.id_branch,
        id_classification: response.data.id_scheme.id_classification,
        id: response.data._id,
        metal_rate: response.data.metal_rate,
        metal_weight: response.data.metal_weight,
        payment_receipt: response.data.payment_receipt,
        accountschemeid: response.data.id_scheme_account.accountschemeid,
        payment_amount: payment_amount,
        payment_mode: response.data.payment_mode,
        payment_type: 1,
        added_by: 0,
        total_installments: 1,
        itr_utr: response.data.itr_utr,
        remark: response.data.remark,
        total_amt: response.data.total_amt,
        fine_amount: response.data.fine_amount,
        buy_gst: response.data.gst_amount,
        cash_amount: response.data.cash_amount,
        gpay_amount: response.data.gpay_amount,
        card_amount: response.data.card_amount,
        date_payment: response.data.date_payment,
      });

      setSelectedScheme({
        _id: response.data.id_scheme_account._id,
        id_scheme_account: response.data.id_scheme_account._id,
        account_name: response.data.id_scheme_account.account_name,
        address: response.data.id_customer.address,
        id_scheme: response.data.id_scheme,
        scheme_acc_number: response.data.id_scheme_account.scheme_acc_number,
        start_date: response.data.id_scheme_account.start_date,
        total_paidamount: response.data.total_paidamount,
        total_paidinstallments: response.data.total_paidinstallments,
        total_weight: response.data.total_weight,
        total_gifts_issued: response.data.total_gifts_issued,
      });

      // setIdBranch(response.data.id_branch);
      setDatePayment(response.data.date_payment);
      setMobile(response.data.id_customer.mobile);
      setMetalRate(response.data.metal_rate);
    } else {
      toast.error("Customer not created!");
    }
  };

  const handleSearchmobile = () => {
    setSearchError("");

    if (mobile === "") {
      toast.error("Mobile Number is required!");
    }
    const searchData = {
      id_branch: formik.values.id_branch,
      search_mobile: mobile,
    };

    handlesearchschemeaccount(searchData);
  };

  const handleautocompletemobile = (e) => {
    let value = e.target.value;
    if (!/^(\+)?\d*$/.test(value)) return;

    if (value.length <= 13) {
      setMobile(value);
      setSearchMobile(value);
    }

    if (formData.id_branch === "") {
      toast.error("Branch Id is required!");
    }
  };

  // const { mutate: getallpaymentmodeMutate } = useMutation({
  //   mutationFn: getallpaymentmode,
  //   onSuccess: (response) => {
  //     if (response) {
  //       setPaymentmode(response.data);
  //     }
  //   },
  // });

  // const { mutate: schemepaymenttodayrateMutate } = useMutation({
  //   mutationFn: schemepaymenttodayrate,
  //   onSuccess: (response) => {
  //     if (response.data) {
  //       let metalRate = 0;
  //       if (parseInt(selectedScheme?.id_scheme?.id_metal) === 1) {
  //         // Gold
  //         switch (parseInt(selectedScheme?.id_scheme?.id_purity)) {
  //           case 1:
  //             metalRate = response.data.goldrate_24ct.$numberDecimal;
  //             break;
  //           case 2:
  //             metalRate = response.data.goldrate_22ct.$numberDecimal;
  //             break;
  //           case 3:
  //             metalRate = response.data.goldrate_20ct.$numberDecimal;
  //             break;
  //           case 4:
  //             metalRate = response.data.goldrate_18ct.$numberDecimal;
  //             break;
  //         }
  //       } else if (parseInt(selectedScheme?.id_scheme?.id_metal) === 2) {
  //         // Silver
  //         metalRate = response.data.silverrate_1gm.$numberDecimal;
  //       } else if (
  //         parseInt(selectedScheme?.id_scheme?.id_metal.$numberDecimal) === 3
  //       ) {
  //         // Diamond
  //         metalRate = response.data.diamond_1gm.$numberDecimal;
  //       } else if (
  //         parseInt(selectedScheme?.id_scheme?.id_metal.$numberDecimal) === 4
  //       ) {
  //         // Platinum
  //         metalRate = response.data.platinum_1gm.$numberDecimal;
  //       } else if (parseInt(selectedScheme?.id_scheme?.id_metal) === 5) {
  //         // Coin
  //         metalRate = response.data.goldcoin_1gm.$numberDecimal;
  //       }

  //       setMetalRate(metalRate);
  //       setFormData((prev) => ({ ...prev, metal_rate: metalRate }));
  //     }
  //   },
  // });

  // useEffect(() => {
  //   getallbranchMutate();
  //   getallpaymentmodeMutate();
  //   getmultipaymentmodeMutate();
  // }, []);

  // const { mutate: getmultipaymentmodeMutate } = useMutation({
  //   mutationFn: getmultipaymentmode,
  //   onSuccess: (response) => {
  //     if (response) {
  //       const mutidata = multipaymode.reduce((acc, multipay) => {
  //         acc[multipay.parameter] = 0;
  //         return acc;
  //       }, {});

  //       setFormData((prevData) => ({
  //         ...prevData,
  //         ...mutidata,
  //       }));
  //       setMultiPaymode(response.data);
  //     }
  //   },
  // });

  const filterInputchange = (e) => {
    let total = 0;
    const { name, value } = e.target;

    if (name === "payment_amount") {
      setPaymentAmount(value);
    } else if (name === "metal_rate") {
      setMetalRate(value);
    } else if (name === "fine_amount") {
      setFineAmount(value);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "payment_mode") {
      if (value === "67682cf7666e32053d05e04d") {
        setIspaymode(true);
      } else {
        setIspaymode(false);
      }
    }

    if (name === "accountschemeid") {
      setFormData((prev) => ({
        ...prev,
        scheme_acc_number: selectedScheme.id_scheme.code + "" + value,
      }));
    }

    if (name === "date_payment") {
      setDatePayment(value);
    }

    if (name === "id_branch") {
      setIdBranch(value);
      if (value !== "") {
        getallbranchMutate();
      } else {
        setMobile("");
        setSchemeData([]);
        setFormData((prev) => ({
          ...prev,
          id_customer: "",
          mobile: "",
          date_payment: date_payment,
          payment_mode: "",
          itr_utr: "",
          remark: "",
          scheme_acc_number: "",
          id_scheme: "",
          id_branch: id_branch,
          id_scheme_account: "",
          scheme_type: 0,
          buy_gst: 0,
          fine_amount: 0,
          total_amt: 0,
          payment_amount: 0,
          metal_rate: 0,
          metal_weight: 0,
          accountschemeid: "",
          total_installments: 1,
          id_classification: "",
        }));
      }
    }
  };

  // const calculatepayment = () => {
  //   console.log("called")
  //   let total_amt = 0;
  //   let gstAmount = 0;
  //   let metalweight = 0;
  //   if (parseInt(selectedScheme?.id_scheme?.buy_gst) > 0) {
  //     gstAmount =
  //       (parseFloat(paymentamount) *
  //         parseFloat(selectedScheme?.id_scheme?.buy_gst)) /
  //       100;
  //   }

  //   if (!weight.includes(selectedScheme?.scheme_type)) {
  //     total_amt =
  //       parseFloat(paymentamount) +
  //       parseFloat(gstAmount) +
  //       parseFloat(fine_amount);
  //     let calc1 = paymentamount * 1000;
  //     let calc2 = metal_rate / 1000;
  //     total_amt = calc1 * calc2;
  //   } else {
  //     metalweight = parseFloat(metal_rate) / parseFloat(paymentamount);
  //     total_amt =
  //       parseFloat(paymentamount) +
  //       parseFloat(gstAmount) +
  //       parseFloat(fine_amount);
  //   }

  //   let metal_weight = metalweight.toFixed(3);
  //   console.log(metal_weight,total_amt,gstAmount)
  //   setFormData((prev) => ({
  //     ...prev,
  //     metal_weight: metal_weight,
  //     total_amt: total_amt,
  //     gst_amount: gstAmount,
  //   }));
  // };
  const calculatepayment = () => {
    let total_amt = 0;
    let gstAmount = 0;
    let metalweight = 0;
    // Calculate GST if applicable
    if (parseInt(formik.values.buy_gst) > 0) {
      gstAmount =
        parseFloat(formik.values.payment_amount) *
        (parseFloat(formik.values.buy_gst) / 100);
    }

    // Calculate total amount based on scheme type
    if (![2, 5, 6, 12, 3, 4].includes(selectedScheme?.scheme_type)) {
      // For schemes that are not weight-based
      total_amt =
        parseFloat(formik.values.payment_amount) +
        parseFloat(gstAmount) +
        parseFloat(fine_amount);
    } else {
      // For weight-based schemes
      console.log("Payment Amount:", formik.values.payment_amount); // Should be 500
      console.log("Metal Rate:", formik.values.metal_rate); // Should be 23
      metalweight =
        parseFloat(formik.values.payment_amount) /
        parseFloat(formik.values.metal_rate);
      total_amt =
        parseFloat(formik.values.payment_amount) +
        parseFloat(gstAmount) +
        parseFloat(fine_amount);
    }

    // Update form data with calculated values
    formik.setValues((prevValues) => ({
      ...prevValues,
      metal_weight: metalweight.toFixed(3),
      total_amt: Number(total_amt.toFixed(2)),
      gst_amount: Number(gstAmount.toFixed(2)),
    }));
  };

  const handleschemebyid = async (data) => {
    if (!data) return;
    const response = await getschemeById(data);
    if (response) {
      if (response.data.scheme_type === 6) {
        setIspayable(true);
      } else {
        setIspayable(false);
      }

      setFormData((prevState) => ({
        ...prevState,
        id_scheme: response.data._id,
        scheme_type: response.data.scheme_type,
        total_installments: response.data.total_installments,
        min_amount: response.data.min_amount,
        max_amount: response.data.max_amount,
        min_weight: response.data.min_weight,
        max_weight: response.data.max_weight,
      }));
    } else {
      toast.error("Customer not created!");
    }
  };

  const handleDropdownChange = (event) => {
    const { name, value } = event.target;
    const id = event.target.value;
    setSelectedId(id);
    const scheme = schemedata.find((scheme) => scheme._id === id);

    if (scheme) {
      setSelectedScheme(scheme);
      setIdBranch(scheme.id_scheme.id_branch);
      setFormData((prev) => ({
        ...prev,
        mobile: scheme.id_customer.mobile,
        id_customer: scheme.id_customer._id,
        code: scheme.id_scheme.code,
        scheme_type: scheme.id_scheme.scheme_type,
        scheme_acc_number: scheme.scheme_acc_number,
        accountschemeid: scheme.accountschemeid,
        id_scheme: scheme.id_scheme._id,
        id_branch: scheme.id_scheme.id_branch,
        id_classification: scheme.id_scheme.id_classification,
        id_scheme_account: scheme._id,
      }));

      setErrors((prev) => ({
        ...prev,
        scheme_acc_number: "",
        accountschemeid: "",
        id_scheme: "",
        id_branch: "",
        id_classification: "",
        id_scheme_account: "",
        code: scheme.code,
      }));

      if (scheme.id_scheme.scheme_type === 3) {
        setPaymentAmount(scheme.id_scheme.min_weight);
        setFormData((prev) => ({
          ...prev,
          payment_amount: scheme.id_scheme.min_weight,
        }));
        setIspayamtreadOnly(false);
      } else if (
        scheme.id_scheme.scheme_type === 4 ||
        scheme.id_scheme.scheme_type === 5 ||
        scheme.id_scheme.scheme_type === 7 ||
        scheme.id_scheme.scheme_type === 8 ||
        scheme.id_scheme.scheme_type === 9 ||
        scheme.id_scheme.scheme_type === 10
      ) {
        setPaymentAmount(scheme.id_scheme.min_amount);
        setFormData((prev) => ({
          ...prev,
          payment_amount: scheme.id_scheme.min_amount,
        }));
        setIspayamtreadOnly(false);
      } else {
        setPaymentAmount(scheme.id_scheme.amount);
        setFormData((prev) => ({
          ...prev,
          payment_amount: scheme.id_scheme.amount,
        }));
        setIspayamtreadOnly(true);
      }
    } else {
      const todaydate = new Date();
      const formattedDate = new Intl.DateTimeFormat("en-CA").format(todaydate);
      setFormData({
        date_payment: formattedDate,
        payment_mode: "",
        itr_utr: "",
        remark: "",
        scheme_acc_number: "",
        id_scheme: "",
        id_scheme_account: "",
        scheme_type: "",
        buy_gst: 0,
        gst_amount: 0,
        fine_amount: 0,
        metal_rate: 0,
        total_amt: 0,
        payment_amount: 0,
        metal_weight: 0,
        accountschemeid: "",
        total_installments: 1,
        id_classification: "",
      });

      setDatePayment(formattedDate);
    }
  };

  const handleemployeebyBranch = async (id_branch) => {
    if (!id_branch) return;
    const response = await getemployeebyBranch({ id_branch: id_branch });
    if (response) {
      setEmployee(response.data);
    }
  };

  const handlebranchscheme = async (id_branch) => {
    if (!id_branch) return;
    const response = await getallbranchscheme({ id_branch: id_branch });
    if (response) {
      setScheme(response.data);
    }
  };

  const handleClassifyChange = async (id_branch) => {
    if (!id_branch) return;
    const response = await getallbranchclassification({ id_branch: id_branch });
    if (response) {
      setClassify(response.data);
    }
  };

  const handleSelectNumber = (number) => {
    setMobile(number);
    setSuggestions([]); //
  };

  useEffect(() => {
    if (location.pathname === "/payment/schemepayment/add") {
      setHeader("Add Scheme Account");
      setReturnRoute("/payment/schemepayment");
    } else if (location.pathname === "/customer/digigold/add") {
      setHeader("Add Digi Gold Account");
      setReturnRoute("/customer/digigold");
    }
  }, [location.pathname]);

  const handleCancel = () => {
    navigate("/payment/schemepayment");
  };

  const handleAddCustomer = () => {
    navigate("/customer/add");
  };

  // const isValidForm = () => {
  //   const err = {};

  //   if (formData.total_amt === "") {
  //     err["total_amt"] = "Total Amount is required";
  //   } else {
  //     err["total_amt"] = "";
  //   }

  //   if (formData.payment_mode === "") {
  //     err["payment_mode"] = "Payment Mode is required";
  //   } else {
  //     err["payment_mode"] = "";
  //   }

  //   if (formData.accountschemeid === "") {
  //     err["scheme_acc_number"] = "Scheme Account Number is required";
  //   } else {
  //     err["scheme_acc_number"] = "";
  //   }

  //   if (formData.payment_receipt === "") {
  //     err["payment_receipt"] = "Payment Receipt is required";
  //   } else {
  //     err["payment_receipt"] = "";
  //   }

  //   if (formData.id_scheme_account === "") {
  //     err["id_scheme_account"] = "Scheme Account is required";
  //   } else {
  //     err["id_scheme_account"] = "";
  //   }

  //   if (formData.date_payment === "") {
  //     err["date_payment"] = "Payment Date is required";
  //   } else {
  //     err["date_payment"] = "";
  //   }
  //   if (formData.metal_rate === "") {
  //     err["metal_rate"] = "Metal Rate is required";
  //   } else {
  //     err["metal_rate"] = "";
  //   }

  //   if (
  //     selectedScheme.scheme_type === 4 ||
  //     selectedScheme.scheme_type === 5 ||
  //     selectedScheme.scheme_type === 7 ||
  //     selectedScheme.scheme_type === 8 ||
  //     selectedScheme.scheme_type === 9 ||
  //     selectedScheme.scheme_type === 10
  //   ) {
  //     if (formData.payment_amount < selectedScheme.min_amount) {
  //       (err["payment_amount"] = "Allowed Limit Minimum Amount Rs."),
  //         selectedScheme.min_amount;
  //     } else if (formData.payment_amount > selectedScheme.max_amount) {
  //       (err["payment_amount"] = "Allowed Limit Maximum Amount Rs."),
  //         selectedScheme.max_amount;
  //     } else if (formData.payment_amount === "") {
  //       err["payment_amount"] = "Payment Aount is required";
  //     } else {
  //       err["payment_amount"] = "";
  //     }
  //     if (
  //       selectedScheme.scheme_type === 2 ||
  //       selectedScheme.scheme_type === 5 ||
  //       selectedScheme.scheme_type === 6 ||
  //       selectedScheme.scheme_type === 10
  //     ) {
  //       if (formData.metal_weight === "") {
  //         err["metal_weight"] = "Metal Weight is required";
  //       } else {
  //         err["metal_weight"] = "";
  //       }
  //     }
  //   } else if (selectedScheme.scheme_type === 3) {
  //     if (formData.payment_amount < selectedScheme.min_weight) {
  //       (err["payment_amount"] = "Allowed Limit Minimum Weight Rs."),
  //         selectedScheme.min_weight;
  //     } else if (formData.payment_amount > selectedScheme.max_weight) {
  //       (err["payment_amount"] = "Allowed Limit Maximum Weight Rs."),
  //         selectedScheme.max_weight;
  //     } else if (formData.payment_amount === "") {
  //       err["payment_amount"] = "Payment Weight is required";
  //     } else {
  //       err["payment_amount"] = "";
  //     }
  //   } else {
  //     if (formData.payment_amount === "") {
  //       err["payment_amount"] = "Payment Amount is required";
  //     } else {
  //       err["payment_amount"] = "";
  //     }
  //   }

  //   setErrors((prevState) => ({
  //     ...prevState,
  //     ...err,
  //   }));

  //   const hasErrors = Object.values(err).some((error) => error.length > 0);

  //   return !hasErrors;
  // };
  // const onSubmit = (e) => {
  //   e.preventDefault();

  //   const formFields = new FormData(e.target);
  //   const formDataObject = Object.fromEntries(formFields.entries());

  //   if (isValidForm()) {
  //     if (formData.id_customer === "") {
  //       toast.error("Customer Id is Required!");
  //       return;
  //     } else if (formData.id_branch === "") {
  //       toast.error("Branch Id is Required!");
  //       return;
  //     } else if (formData.mobile === "") {
  //       toast.error("Mobile is Required!");
  //       return;
  //     } else if (selectedScheme?.id_scheme === "") {
  //       toast.error("Scheme Id is Required!");
  //       return;
  //     } else if (selectedScheme.scheme_type === "") {
  //       toast.error("Scheme Id is Required!");
  //       return;
  //     } else if (selectedScheme.id_classification === "") {
  //       toast.error("Classification Id is Required!");
  //       return;
  //     } else if (selectedScheme?.id_scheme === "") {
  //       toast.error("Scheme Id is Required!");
  //       return;
  //     }
  //     setErrors({ id_scheme: "" });

  //     if (!id) {
  //       createschemepaymentmutate(formData);
  //     } else {
  //       updateschemepaymentmutate(formData);
  //     }
  //   } else {
  //     console.log("Form has validation errors. Please correct them.");
  //   }
  // };

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl text-[#023453] font-bold justify-between">
          Scheme Payment
        </h2>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="w-full flex flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]">
          <div className="flex flex-col p-8 bg-white">
            <div className="space-y-6">
              <h2 className="text-xl font-medium mb-4">Customer Details</h2>
              <div className="flex flex-col lg:flex-row w-full justify-between">
                <div className="lg:w-1/2 w-full">
                  <div className="grid grid-cols-1 gap-4 lg:pr-2">
                    {accessBranch === "0" ? (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Branches <span className="text-red-500">*</span>
                        </label>
                        <Select
                          styles={customStyles}
                          isClearable={true}
                          options={branch || []}
                          placeholder="Select Branch"
                          value={branch?.find(
                            (option) => option.value === formik.values.id_branch
                          )}
                          onChange={(option) =>
                            formik.setFieldValue(
                              "id_branch",
                              option.value || ""
                            )
                          }
                        />
                        {formik.errors.id_branch && (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.id_branch}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm text-gray-500 font-medium mb-1">
                          Branch <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          disabled
                          value={branch?.branch_name || ""}
                          className="w-full border rounded-md px-3 py-2 text-gray-500"
                        />
                        {formik.errors.id_branch && (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.id_branch}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex flex-col mt-2 relative">
                      <label className="text-black mb-1 font-normal">
                        Search Mobile Number
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={mobile}
                        onChange={handleautocompletemobile}
                        className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter Here"
                      />

                      {/* Search Icon */}
                      <div
                        onClick={handleSearchmobile}
                        className="absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[68%] -translate-y-1/2 w-10 h-[62%] sm:right-0 sm:top-[68%] sm:rounded-r-lg md:right-[20%] md:rounded-lg lg:rounded-lg lg:right-[0%]"
                        style={{ backgroundColor: layout_color }}
                      >
                        <Search size={20} className="text-white" />
                      </div>
                    </div>
                    <div className="lg:hidden">
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={toggleAccordion}
                      >
                        <label className="text-black mb-2 font-normal">
                          Scheme Details<span className="text-red-400">*</span>
                        </label>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      {isExpanded && (
                        <div className="lg:w-1/2 w-full items-center justify-center lg:pl-10 lg:pr-10">
                          <div className="bg-[#F8F9FA] lg:w-full rounded-lg flex flex-col p-4 lg:h-full">
                            <h2 className="text-xl font-bold text-[#023453] mb-4 text-center">
                              Scheme Details
                            </h2>
                            <div>
                              <div className="flex justify-between py-1">
                                <span className="text-gray-600">A/C Name</span>
                                <span className="text-gray-900">
                                  {selectedScheme?.account_name || "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between py-1">
                                <span className="text-gray-600">Address</span>
                                <span className="text-gray-900">
                                  {selectedScheme?.id_customer?.address ||
                                    "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between py-1">
                                <span className="text-gray-600">Joined On</span>
                                <span className="text-gray-900">
                                  {selectedScheme?.start_date
                                    ? new Date(
                                        selectedScheme.start_date
                                      ).toLocaleDateString("en-GB")
                                    : "N/A"}
                                </span>
                              </div>

                              <div className="flex justify-between py-1">
                                <span className="text-gray-600">
                                  Scheme A/C No
                                </span>
                                <span className="text-gray-900">
                                  {selectedScheme?.scheme_acc_number || "N/A"}
                                </span>
                              </div>

                              <div className="flex justify-between py-1">
                                <span className="text-gray-600">
                                  No of Gift Issues
                                </span>
                                <span className="text-gray-900">
                                  {selectedScheme?.total_gifts_issued || "0"}
                                </span>
                              </div>

                              <div className="flex justify-between py-1">
                                <span className="text-gray-600">
                                  Scheme Type
                                </span>
                                <span className="text-gray-900">
                                  {selectedScheme?.id_scheme?.scheme_type === 0
                                    ? "Amount To Bonus"
                                    : selectedScheme?.id_scheme?.scheme_type ===
                                      1
                                    ? "Amount End Weight"
                                    : selectedScheme?.id_scheme?.scheme_type ===
                                      2
                                    ? "Amount To Weight"
                                    : selectedScheme?.id_scheme?.scheme_type ===
                                      3
                                    ? "Weight"
                                    : selectedScheme?.id_scheme?.scheme_type ===
                                      4
                                    ? "Flexible Amount Scheme"
                                    : selectedScheme?.id_scheme?.scheme_type ===
                                      5
                                    ? "Flexible Amount to Weight"
                                    : selectedScheme?.id_scheme?.scheme_type ===
                                      6
                                    ? "Fixed Amount to Weight"
                                    : selectedScheme?.id_scheme?.scheme_type ===
                                      7
                                    ? "Fixed Amount end Weight"
                                    : selectedScheme?.id_scheme?.scheme_type ===
                                      8
                                    ? "Fixed Amount to bonus"
                                    : selectedScheme?.id_scheme?.scheme_type ===
                                      9
                                    ? "Flexible Amount End Weight"
                                    : selectedScheme?.id_scheme?.scheme_type ===
                                      10
                                    ? "Digital Gold"
                                    : "N/A"}
                                </span>
                              </div>

                              <div className="flex justify-between py-1">
                                <span className="text-gray-600">
                                  Total Paid Installment
                                </span>
                                <span className="text-gray-900">
                                  {selectedScheme?.total_paidinstallments ||
                                    "0"}
                                </span>
                              </div>

                              <div className="flex justify-between py-1">
                                <span className="text-gray-600">
                                  Total Paid Amount
                                </span>
                                <span className="text-green-500">
                                  {selectedScheme?.total_paidamount || "0.00"}
                                </span>
                              </div>

                              <div className="flex justify-between py-1">
                                <span className="text-gray-600">
                                  Total Metal Weight
                                </span>
                                <span className="text-gray-900">
                                  {selectedScheme?.total_weight || "0.00"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <label className="text-black mb-2 font-normal">
                        Scheme Account<span className="text-red-400"> *</span>
                      </label>
                      <Select
                        styles={customStyles}
                        isClearable={true}
                        options={schemedata || []}
                        placeholder="Select scheme Account"
                        value={schemedata?.find(
                          (option) =>
                            option.value === formik.values.id_scheme_account
                        )}
                        onChange={(option) => {
                          if (option?.value) {
                            formik.setFieldValue(
                              "id_scheme_account",
                              option.value
                            );
                          } else {
                            formik.setFieldValue("id_scheme_account", "");
                          }
                        }}
                      />
                      {formik.errors.id_scheme_account && (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.id_scheme_account}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col w-full">
                      <label className="text-black mb-2 font-normal">
                        Payment Date<span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <DatePicker
                          name="date_payment"
                          disabled
                          selected={formData.date_payment}
                          onChange={(e) => {
                            filterInputchange(e);
                          }}
                          dateFormat="dd-MM-yyyy"
                          placeholderText="Select Date"
                          className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          wrapperClassName="w-full"
                        />
                        <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center pointer-events-none">
                          <CalendarDays size={20} />
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-black mb-2 font-normal">
                        Today Rate<span className="text-red-400">*</span>
                      </label>
                      <input
                        name="metal_rate"
                        disabled
                        value={formik.values.metal_rate}
                        onChange={(e) => {
                          filterInputchange(e);
                        }}
                        type="text"
                        className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder=""
                      />
                      <p style={{ color: "red" }}>{errors?.metal_rate}</p>
                    </div>

                    {issetreceipt === 1 && (
                      <div className="flex flex-col">
                        <label className="text-black mb-2 font-normal">
                          Receipt<span className="text-red-400">*</span>
                        </label>
                        <input
                          name="payment_receipt"
                          disabled
                          value={formData.payment_receipt}
                          onChange={(e) => {
                            filterInputchange(e);
                          }}
                          type="text"
                          className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder=""
                        />
                        <p style={{ color: "red" }}>
                          {errors?.payment_receipt}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:w-1/2 w-full items-center justify-center lg:pl-10 lg:pr-10">
                  <div className="bg-[#F8F9FA] lg:w-full rounded-lg flex-col p-4 lg:h-full hidden lg:block shadow-md">
                    <h2 className="text-xl font-bold text-[#023453] mb-4 text-center">
                      Scheme Details
                    </h2>
                    <div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">A/C Name</span>
                        <span className="text-gray-900">
                          {selectedScheme?.account_name || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Address</span>
                        <span className="text-gray-900">
                          {selectedScheme?.id_customer?.address || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Joined On</span>
                        <span className="text-gray-900">
                          {selectedScheme?.start_date
                            ? new Date(
                                selectedScheme.start_date
                              ).toLocaleDateString("en-GB")
                            : "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Scheme A/C No</span>
                        <span className="text-gray-900">
                          {selectedScheme?.scheme_acc_number || "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">No of Gift Issues</span>
                        <span className="text-gray-900">
                          {selectedScheme?.total_gifts_issued || "0"}
                        </span>
                      </div>

                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Scheme Type</span>
                        <span className="text-gray-900">
                          {selectedScheme?.id_scheme?.scheme_type === 0
                            ? "Amount To Bonus"
                            : selectedScheme?.id_scheme?.scheme_type === 1
                            ? "Amount End Weight"
                            : selectedScheme?.id_scheme?.scheme_type === 2
                            ? "Amount To Weight"
                            : selectedScheme?.id_scheme?.scheme_type === 3
                            ? "Weight"
                            : selectedScheme?.id_scheme?.scheme_type === 4
                            ? "Flexible Amount Scheme"
                            : selectedScheme?.id_scheme?.scheme_type === 5
                            ? "Flexible Amount to Weight"
                            : selectedScheme?.id_scheme?.scheme_type === 6
                            ? "Fixed Amount to Weight"
                            : selectedScheme?.id_scheme?.scheme_type === 7
                            ? "Fixed Amount end Weight"
                            : selectedScheme?.id_scheme?.scheme_type === 8
                            ? "Fixed Amount to bonus"
                            : selectedScheme?.id_scheme?.scheme_type === 9
                            ? "Flexible Amount End Weight"
                            : selectedScheme?.id_scheme?.scheme_type === 10
                            ? "Digital Gold"
                            : "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">
                          Total Paid Installment
                        </span>
                        <span className="text-gray-900">
                          {selectedScheme?.total_paidinstallments || "0"}
                        </span>
                      </div>

                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Total Paid Amount</span>
                        <span className="text-green-500">
                          {selectedScheme?.total_paidamount || "0.00"}
                        </span>
                      </div>

                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">
                          Total Metal Weight
                        </span>
                        <span className="text-gray-900">
                          {selectedScheme?.total_weight || "0.00"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-medium mb-4">
                  Scheme Account Details
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-black mb-2 font-normal">
                      Payment Amount<span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        disabled={ispayamtreadOnly}
                        name="payment_amount"
                        value={formik.values.payment_amount}
                        min="0"
                        // onChange={(e) => {
                        //   filterInputchange(e);
                        // }}
                        {...formik.getFieldProps("payment_amount")}
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "e" || e.key === "E") {
                            e.preventDefault();
                          }
                        }}
                        className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter here"
                      />

                      <span
                        className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                        style={{ backgroundColor: layout_color }}
                      >
                        INR
                      </span>
                    </div>
                    <p style={{ color: "red" }}>{errors?.payment_amount}</p>
                  </div>
                  {selectedScheme?.id_scheme?.buygsttype === 1 && (
                    <div className="flex flex-col">
                      <label className="text-black mb-2 font-normal">
                        GST<span className="text-red-400"> *</span>
                      </label>
                      <div className="relative">
                        <input
                          disabled
                          type="number"
                          name="buy_gst"
                          value={formik?.values?.buy_gst}
                          onChange={(e) => {
                            filterInputchange(e);
                          }}
                          onKeyDown={(e) => {
                            if (
                              e.key === "-" ||
                              e.key === "e" ||
                              e.key === "E"
                            ) {
                              e.preventDefault();
                            }
                          }}
                          className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="Enter here"
                        />
                        <span
                          className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                          style={{ backgroundColor: layout_color }}
                        >
                          INR
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <label className="text-black mb-2 font-normal">
                      Fine Amount<span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        readOnly
                        name="fine_amount"
                        value={formik.values.fine_amount}
                        onChange={(e) => {
                          filterInputchange(e);
                        }}
                        min="0"
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "e" || e.key === "E") {
                            e.preventDefault();
                          }
                        }}
                        className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter here"
                      />
                      <span
                        className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                        style={{ backgroundColor: layout_color }}
                      >
                        INR
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-black mb-2 font-normal">
                      Total Amount<span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="total_amt"
                        value={formik.values.total_amt}
                        min="0"
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "e" || e.key === "E") {
                            e.preventDefault();
                          }
                        }}
                        className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter here"
                      />

                      <span
                        className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                        style={{ backgroundColor: layout_color }}
                      >
                        INR
                      </span>
                    </div>
                    <p style={{ color: "red" }}>{errors?.total_amt}</p>
                  </div>
                  {[2, 5, 6, 12, 3, 4].includes(selectedScheme.scheme_type) && (
                    <div className="flex flex-col">
                      <label className="text-black mb-2 font-normal">
                        Saved Weight<span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          disabled
                          name="metal_weight"
                          value={formik.values.metal_weight}
                          min="0"
                          onKeyDown={(e) => {
                            if (
                              e.key === "-" ||
                              e.key === "e" ||
                              e.key === "E"
                            ) {
                              e.preventDefault();
                            }
                          }}
                          className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="Enter here"
                        />
                        <span
                          className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                          style={{ backgroundColor: layout_color }}
                        >
                          GM
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <label className="text-black mb-2 font-normal">
                      Payment Mode<span className="text-red-400"> *</span>
                    </label>
                    <Select
                      styles={customStyles}
                      isClearable={true}
                      options={paymentmode || []}
                      placeholder="Select payment mode"
                      value={
                        paymentmode?.find(
                          (option) =>
                            option.value === formik.values.payment_mode
                        ) || null
                      }
                      onChange={(option) =>
                      {
                        if(Number(option.mode) === 7){
                          setSelectedMode(mode)
                        }
                        formik.setFieldValue(
                          "payment_mode",
                          option ? option.value : ""
                        )
                      }
                      }
                    />

                    {formik.errors.payment_mode && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.payment_mode}
                      </div>
                    )}
                  </div>
                  {ispaymode && (
                    <>
                      {multipaymode.map((multipay) => (
                        <div key={multipay.parameter} className="flex flex-col">
                        <label className="text-black mb-2 font-normal">
                          {multipay.label}
                        </label>
                        <input
                          type="text"
                          name={multipay.value}
                          value={formik.values[multipay.value] || ""}
                          onChange={(e) => {
                            formik.setFieldValue(multipay.value, Number(e.target.value) || 0);
                            filterInputchange(e); 
                          }}
                          className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="Enter amount here"
                        />
                      </div>                      
                      ))}
                    </>
                  )}
                  <div className="flex flex-col">
                    <label className="text-black mb-2 font-normal">
                      ITR/UTR ID
                    </label>
                    <input
                      type="text"
                      name="itr_utr"
                      value={formData.itr_utr}
                      onChange={(e) => {
                        filterInputchange(e);
                      }}
                      className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter ITR/UTR ID"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-black mb-2 font-normal">Remarks</label>
                  <textarea
                    name="remark"
                    value={formik.values.remark}
                    onChange={(e) => {
                      filterInputchange(e);
                    }}
                    className="border-2 border-gray-300 rounded-md p-2 min-h-32 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Here"
                  />
                </div>
              </div>
            </div>

            <div className="border-t-2 border-gray-300 mt-6 pt-4">
              <div className="flex justify-end gap-4">
                <button
                  className="bg-[#E2E8F0] text-black rounded-md px-6 py-2"
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#61A375] text-white rounded-md px-6 py-2"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddSchemePayment;