import React, { useEffect, useState, Suspense, lazy } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import {
  getBranchById,
  getallbranch,
  addscheme,
  digiGoldStaticData,
  getschemeById,
  updateScheme,
} from "../../../api/Endpoints";
import {
  bonusTypeOptions,
  entryTypeOptions,
} from "../../../../utils/Constants";
import SpinLoading from "../../common/spinLoading";
import ToggleSwitch from "../../common/ToggleSwitch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../../components/ui/accordion";
import Classification from "./Classification";
import { customStyles } from "../scheme/AddScheme";

const CreateDigiGoldScheme = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const roleData = useSelector((state) => state.clientForm.roledata);
  const id_branch = roleData?.id_branch;
  const accessBranch = roleData?.branch;

  // All states declared together
  const [branch, setBranch] = useState(() => (accessBranch === "0" ? [] : {}));
  const [layout_color, setLayoutColor] = useState("#015173");
  const [staticData, setStaticData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isBonus, setBonus] = useState(false);
  const [silver, setSilver] = useState(false);
  const [header, setHeader] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [descriptionImage, setDescriptionImage] = useState(null);
  const [pathUrl, setPathUrl] = useState("");
  const [purity, setPurity] = useState([]);
  const [selectedPurity, setSelectedPurity] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const inputHeight = "42px";

  // Improved cleanup function
  const destroyAllStates = () => {
    console.log("Cleaning up all states...");
    
    // Reset all state variables to their initial values
    setBranch(accessBranch === "0" ? [] : {});
    setLayoutColor("#015173");
    setStaticData({});
    setIsLoading(false);
    setIsDataLoaded(false);
    setBonus(false);
    setSilver(false);
    setHeader("");
    setMainImage(null);
    setDescriptionImage(null);
    setPathUrl("");
    setPurity([]);
    setSelectedPurity(null);
    setInitialDataLoaded(false);
  };

  // Reset function for form and states
  const resetFormAndStates = () => {
    destroyAllStates();
    
    // Reset formik to initial values
    if (formik) {
      formik.resetForm();
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      destroyAllStates();
    };
  }, []);

  // Reset when navigating to different routes
  useEffect(() => {
    // Reset when the path changes significantly (not just ID changes)
    const currentPath = location.pathname.split('/').slice(0, 4).join('/'); // Get base path
    
    return () => {
      // Only reset if we're actually navigating away from the form
      if (!location.pathname.includes('/scheme/digi')) {
        resetFormAndStates();
      }
    };
  }, [location.pathname]);

  useEffect(() => {
    const path = location.pathname;
    const isSilver = path.startsWith("/scheme/digisilver");
    const id = path.split("/")[3]; 
  
    if (isSilver && !id) {
      setSilver(true);
      setHeader("Create Digi Silver Scheme");
    } else if (isSilver && id) {
      setSilver(true);
      setHeader("Edit Digi Silver");
    } else if (!isSilver && !id) {
      setSilver(false);
      setHeader("Create Digi Gold Scheme");
    } else {
      setSilver(false);
      setHeader("Edit Digi Gold");
    }
  }, [location.pathname]);
  
  // Formik initialization
  const formik = useFormik({
    initialValues: {
      scheme_name: "",
      description: "",
      term_desc: "",
      id_branch: accessBranch !== "0" ? accessBranch : id_branch || "",
      id_metal: "",
      id_purity: "",
      id_classification: "",
      bonus_type: 2,
      count: "",
      entry_type: 0,
      values: [],
      bonuses: [],
      max_amount: "",
      min_amount: "",
      scheme_type: silver ? 14 : 10,
      noOfDays: null,
      maxLimit: null
    },
    validationSchema: Yup.object({
      scheme_name: Yup.string().required("Scheme name is required"),
      description: Yup.string()
        .required("Description is required")
        .max(850, "Description cannot exceed 850 characters"),
      term_desc: Yup.string()
        .required("Terms & conditions is required")
        .max(850, "Terms & conditions cannot exceed 850 characters"),
      id_purity: Yup.string().required("Purity is required"),
      id_branch: Yup.string()
        .required("Branch is required")
        .nullable(),
      bonus_type: Yup.number().when("$isBonus", {
        is: true,
        then: (schema) => schema.required("Bonus type is required"),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      count: Yup.number().when("$isBonus", {
        is: true,
        then: (schema) =>
          schema
            .min(1, "Count must be at least 1")
            .required("Count is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      values: Yup.array().of(
        Yup.object().shape({
          min: Yup.number().when(["$entry_type", "$isBonus"], {
            is: (entry_type, isBonus) => entry_type === 2 && isBonus === true,
            then: () => Yup.number().required("Min value is required"),
            otherwise: () => Yup.number().notRequired(),
          }),

          max: Yup.number().when(["$entry_type", "$isBonus"], {
            is: (entry_type, isBonus) => entry_type === 2 && isBonus === true,
            then: () => Yup.number().required("Max value is required"),
            otherwise: () => Yup.number().notRequired(),
          }),

          value: Yup.number().when(["$entry_type", "$isBonus"], {
            is: (entry_type, isBonus) => entry_type === 1 && isBonus === true,
            then: () => Yup.number().required("Value is required"),
            otherwise: () => Yup.number().notRequired(),
          }),
        })
      ),
      bonuses: Yup.array().of(
        Yup.number()
          .min(0, "Bonus must be at least 0")
          .max(100, "Bonus must be at most 100")
          .when("$isBonus", {
            is: true,
            then: (schema) => schema.required("Bonus is required"),
            otherwise: (schema) => schema.notRequired(),
          })
      ),
      max_amount: Yup.number().required("Max Amount is required"),
      min_amount: Yup.number().required("Min Amount is required"),
      scheme_type: Yup.number().required("Scheme type is required"),
      noOfDays: Yup.number().required("Maturity days required"),
      logo: Yup.mixed()
        .test('required', 'Main image is required', (value) => {
          return mainImage !== null && mainImage !== false;
        })
    }),
    context: { isBonus }, 
    enableReinitialize: true,

    onSubmit: async (values) => {
      setIsLoading(true);
      
      if (!mainImage) {
        formik.setFieldError('logo', 'Main image is required');
        setIsLoading(false);
        return;
      }
      
      try {
        const formData = new FormData();

        Object.keys(values).forEach(key => {
          if (key !== 'values' && key !== 'bonuses' && 
              key !== 'logo' && key !== 'desc_img' &&  key !== 'main_image' &&
              values[key] !== undefined && values[key] !== null) {
            formData.append(key, values[key]);
          }
        });

        if (values.values && values.values.length > 0) {
          values.values.forEach((item, index) => {
            if (item.min !== undefined) formData.append(`values[${index}][min]`, item.min);
            if (item.max !== undefined) formData.append(`values[${index}][max]`, item.max);
            if (item.value !== undefined) formData.append(`values[${index}][value]`, item.value);
          });
        }

        if (values.bonuses && values.bonuses.length > 0) {
          values.bonuses.forEach((bonus, index) => {
            formData.append(`bonuses[${index}]`, bonus);
          });
        }

        if (mainImage instanceof File) {
          formData.append("logo", mainImage);
        } else if (typeof mainImage === 'string') {
          formData.append("logo", mainImage);
        }

        if (descriptionImage) {
          if (descriptionImage instanceof File) {
            formData.append("desc_img", descriptionImage);
          } else if (typeof descriptionImage === 'string') {
            formData.append("desc_img", descriptionImage);
          }
        }

        if (id) {
          updateSchemeData({ id, formData });
        } else {
          addNewScheme(formData);
        }
      } catch (error) {
        console.error("Submission error:", error);
        toast.error("Failed to submit form");
        setIsLoading(false);
      }
    }
  });
 
  // API calls
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

  const { data: digigoldData } = useQuery({
    queryFn: digiGoldStaticData,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const { data: schemeData } = useQuery({
    queryKey: ["scheme", id],
    queryFn: async () => await getschemeById(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const { mutate: addNewScheme } = useMutation({
    mutationFn: addscheme,
    onSuccess: (response) => {
      setIsLoading(false);
      toast.success(response.message);
      resetFormAndStates(); // Clear form after successful submission
      navigate("/scheme/scheme/");
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: updateSchemeData } = useMutation({
    mutationFn: ({ id, formData }) => updateScheme(id, formData),
    onSuccess: (response) => {
      if (response.status === 200) {
        setIsLoading(false);
        toast.success(response?.data?.message);
        resetFormAndStates(); // Clear form after successful update
        if(schemeData?.data?.active){
          navigate("/scheme/scheme/");
        }else{
          navigate("/scheme/delisted");
        }
      }
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Failed to update scheme");
    },
  });

  // useEffect for setting branch
  useEffect(() => {
    formik.setFieldValue("id_branch", id_branch || accessBranch);
  }, [id_branch, accessBranch]);

  // useEffect for branch data
  useEffect(() => {
    if (!branchData) return;

    if (accessBranch === "0" && branchData.data) {
      const formattedBranches = branchData.data.map((item) => ({
        value: item._id,
        label: item.branch_name,
      }));
      setBranch(formattedBranches);

      if (!id) {
        formik.setFieldValue("id_branch", "");
      }
    } else if (branchData.data) {
      setBranch(branchData.data);
      formik.setFieldValue("id_branch", branchData.data._id);
    }
  }, [branchData, accessBranch]);


  useEffect(() => {
    if (digigoldData && (!id || (id && schemeData))) {
      setIsDataLoaded(true);
      setInitialDataLoaded(true);
    }
  }, [digigoldData, schemeData, id]);


  useEffect(() => {
    if (digigoldData) {
      let purityData = [];
      
      if (!silver) {
        setStaticData(digigoldData.data);
        formik.setFieldValue("id_metal", digigoldData?.data?.id_gold?._id);
      
        purityData = digigoldData.data.gold.map((item) => ({
          value: item._id,
          label: item.purity_name,
        }));
        
        formik.setFieldValue("scheme_type", 10);
        formik.setFieldValue('code',"Digigold");
      } else {
        setStaticData(digigoldData.data);
        formik.setFieldValue("id_metal", digigoldData?.data?.id_silver?._id);
        
        purityData = digigoldData.data.silver.map((item) => ({
          value: item._id,
          label: item.purity_name,
        }));
        
        formik.setFieldValue("scheme_type", 14);
        formik.setFieldValue('code',"Digisilver");
      }
      
      setPurity(purityData);
      
      if(!id){
        formik.setFieldValue(
          "id_classification",
          digigoldData.data.classification
        );
      }
    }
  }, [digigoldData, silver]);

  // Fixed: Only populate form data when ALL required data is available
  useEffect(() => {
    if (initialDataLoaded && schemeData?.data && digigoldData) {
      const formValues = {
        scheme_name: schemeData.data.scheme_name || "",
        description: schemeData.data.description || "",
        term_desc: schemeData.data.term_desc || "",
        id_branch: schemeData.data.id_branch || "",
        id_metal: schemeData.data.id_metal?._id || "",
        id_purity: schemeData.data.id_purity?._id || "",
        id_classification: schemeData.data.id_classification._id || digigoldData.data.classification,
        bonus_type: schemeData.data.bonus_type || 2,
        count: schemeData.data.count || "",
        entry_type: schemeData.data.entry_type || 0,
        values: schemeData.data.values || [],
        bonuses: schemeData.data.bonuses || [],
        buy_gst: schemeData.data.buy_gst || "",
        sell_gst: schemeData.data.sell_gst || "",
        max_amount: schemeData.data.max_amount || "",
        min_amount: schemeData.data.min_amount || "",
        scheme_type: schemeData.data.scheme_type ?? (silver ? 14 : 10),
        noOfDays: schemeData.data.noOfDays || "",
        maxLimit: schemeData.data.maxLimit || 0
      };
      
      formik.setValues(formValues);
      
      if (schemeData.data.bonus_type) {
        setBonus(true);
      }
      if (schemeData.data.logo) {
        setMainImage(schemeData.data.logo);
      }
      if (schemeData.data.desc_img) {
        setDescriptionImage(schemeData.data.desc_img);
      }
      if (schemeData.data.pathUrl) {
        setPathUrl(schemeData.data.pathUrl);
      }

      if (schemeData.data.id_purity?._id && purity.length > 0) {
        const selected = purity.find(item => item.value === schemeData.data.id_purity._id);
        setSelectedPurity(selected || null);
      }
    }
  }, [initialDataLoaded, schemeData, digigoldData, purity.length]);


  useEffect(() => {
    if (id && schemeData?.data?.id_purity?._id && purity.length > 0 && initialDataLoaded) {
      const selected = purity.find(item => item.value === schemeData.data.id_purity._id);
      setSelectedPurity(selected || null);
    }
  }, [id, schemeData, purity, initialDataLoaded]);

  const handleCancle = () => {
    resetFormAndStates();
    if (!id) {
      navigate("/ourscheme/digigold");
    } else {
      navigate("/scheme/scheme");
    }
  };

  const getLabel = (id) => {
    const data = bonusTypeOptions.filter((e) => e.id == id);
    if (data.length > 0) {
      return data[0]; 
    }
    return null;
  };

  const generateFields = () => {
    const count = formik.values.count;

    if (count >= 11) {
      toast.warn("Maximum allowed value and bonus upto 10");
      return null;
    }

    const entryType = formik.values.entry_type;
    const fields = [];

    for (let i = 0; i < count; i++) {
      if (entryType === 2) {
        fields.push(
          <div key={`value-min-${i}`}>
            <label className="block text-sm font-medium mb-1">
              Min {getLabel(formik.values.bonus_type)?.code} {i + 1} <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name={`values[${i}].min`}
              value={formik.values.values[i]?.min || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onWheel={(e) => e.target.blur()}
              placeholder="Min Value"
              className="w-full border rounded-md px-3 py-2"
            />
            {formik.touched.values?.[i]?.min && formik.errors.values?.[i]?.min ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.values[i].min}
              </div>
            ) : null}
          </div>
        );

        fields.push(
          <div key={`value-max-${i}`}>
            <label className="block text-sm font-medium mb-1">
              Max {getLabel(formik.values.bonus_type)?.code} {i + 1} <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name={`values[${i}].max`}
              value={formik.values.values[i]?.max || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Max Value"
              onWheel={(e) => e.target.blur()}
              className="w-full border rounded-md px-3 py-2"
            />
            {formik.touched.values?.[i]?.max && formik.errors.values?.[i]?.max ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.values[i].max}
              </div>
            ) : null}
          </div>
        );
      } else {
        fields.push(
          <div key={`value-${i}`}>
            <label className="block text-sm font-medium mb-1">
              {getLabel(formik.values.bonus_type)?.code} {i + 1} <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name={`values[${i}].value`}
              value={formik.values.values[i]?.value || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onWheel={(e) => e.target.blur()}
              placeholder="Enter value"
              className="w-full border rounded-md px-3 py-2"
            />
            {formik.touched.values?.[i]?.value && formik.errors.values?.[i]?.value ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.values[i].value}
              </div>
            ) : null}
          </div>
        );
      }

      fields.push(
        <div key={`bonus-${i}`}>
          <label className="block text-sm font-medium mb-1">
            Bonus {i + 1} (%) <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute right-0 top-0 w-9 h-full px-3 flex items-center justify-center text-black border-l">
              %
            </span>
            <input
              type="number"
              name={`bonuses[${i}]`}
              value={formik.values.bonuses[i] || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onWheel={(e) => e.target.blur()}
              placeholder="Enter bonus"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          {formik.touched.bonuses?.[i] && formik.errors.bonuses?.[i] ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.bonuses[i]}
            </div>
          ) : null}
        </div>
      );
    }

    return fields;
  };

  const handleToggle = () => {
    setBonus(!isBonus);
    formik.validateForm();
  };

  // Show loading until all data is ready
  if (id && !initialDataLoaded) {
    return (
      <div className="flex justify-center items-center h-64">
        <SpinLoading />
        <span className="ml-2">Loading scheme data...</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full mx-auto mt-3 space-y-6"
    >
      <div className="bg-[#FFFFFF] rounded-[16px] p-6 border-[1px]">
        <h2 className="text-lg font-semibold mb-4 border-b pb-4">{header}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Scheme Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={30}
              className="w-full border-2 border-[#f2f3f8] rounded-md px-3 py-2"
              placeholder="Enter scheme name"
              {...formik.getFieldProps("scheme_name")}
            />

            {formik.values.scheme_name.length >= 30 && (
              <div className="text-red-500 text-sm mt-1">
                Max 30 characters allowed
              </div>
            )}

            {formik.touched.scheme_name && formik.errors.scheme_name && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.scheme_name}
              </div>
            )}
          </div>

          {accessBranch === "0" && branch.length > 0 && !isLoading ? (
            <div>
              <label className="block text-sm font-medium mb-1">
                Branch <span className="text-red-500">*</span>
              </label>
              <Select
                styles={customStyles(true)}
                isClearable={true}
                options={branch}
                placeholder="Select Branch"
                value={
                  branch.find(
                    (option) => option.value === formik.values.id_branch
                  ) || null
                }
                onChange={(option) => {
                  formik.setFieldValue("id_branch", option ? option.value : "");
                  formik.setFieldTouched("id_branch", true);
                }}
                onBlur={() => formik.setFieldTouched("id_branch", true)}
              />
              {formik.touched.id_branch && formik.errors.id_branch && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.id_branch}
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
              {formik.errors.id_branch && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.id_branch}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Metal<span className="text-red-400"> *</span>
            </label>
            <input
              disabled
              value={
                !silver
                  ? staticData?.id_gold?.metal_name
                  : staticData?.id_silver?.metal_name
              }
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Purity <span className="text-red-500"> *</span>
            </label>
            <Select
              styles={customStyles(true)}
              options={purity}
              isClearable={true}
              placeholder="Select purity type"
              value={selectedPurity}
              onChange={(option) => {
                setSelectedPurity(option);
                formik.setFieldValue("id_purity", option ? option.value : "");
              }}
              onBlur={() => formik.setFieldTouched("id_purity", true)}
            />
            {formik.touched.id_purity && formik.errors.id_purity && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.id_purity}
              </div>
            )}
          </div>

          <div className="flex flex-col ">
            <label className="block text-sm font-medium mb-1">
              Min Amount <span className="text-red-400"> *</span>
            </label>
            <div className="relative">
              <span className="absolute left-0 top-0 w-9 h-full px-3 flex items-center justify-center text-black border-r">
                ₹
              </span>
              <input
                type="number"
                name="min_amount"
                value={formik.values.min_amount}
                onChange={(e) => {
                  if (e.target.value.length <= 11) {
                    formik.handleChange(e);
                  }
                }}
                onWheel={(e) => e.target.blur()}
                onBlur={formik.handleBlur}
                className="border-2 border-[#f2f3f8] rounded-md p-2 w-full text-start pl-10 focus:outline-none focus:ring-1 focus:ring-[#004181] focus:border-transparent"
                placeholder="Enter min amount"
                style={{ height: inputHeight }}
              />
            </div>
            {formik.touched.min_amount && formik.errors.min_amount && (
              <span className="text-red-500 text-sm mt-1">
                {formik.errors.min_amount}
              </span>
            )}
          </div>

          <div className="flex flex-col ">
            <label className="block text-sm font-medium mb-1">
              Max Amount <span className="text-red-400"> *</span>
            </label>
            <div className="relative">
              <span className="absolute left-0 top-0 w-9 h-full px-3 flex items-center justify-center text-black border-r">
                ₹
              </span>
              <input
                type="number"
                name="max_amount"
                value={formik.values.max_amount}
                onChange={(e) => {
                  if (e.target.value.length <= 11) {
                    formik.handleChange(e);
                  }
                }}
                onWheel={(e) => e.target.blur()}
                onBlur={formik.handleBlur}
                className="border-2 border-[#f2f3f8] rounded-md p-2 w-full text-start pl-10 focus:outline-none  focus:ring-1 focus:ring-[#004181] focus:border-transparent"
                placeholder="Enter max amount"
                style={{ height: inputHeight }}
              />
            </div>
            {formik.touched.max_amount && formik.errors.max_amount && (
              <span className="text-red-500 text-sm mt-1">
                {formik.errors.max_amount}
              </span>
            )}
          </div>

          <div className="flex flex-col ">
            <label className="block text-sm font-medium mb-1">
              Maturity <span className="text-red-400"> *</span>
            </label>
            <div className="relative">
              <span className="absolute right-0 top-0 w-14 h-full bg-[#004181] px-3 flex items-center justify-center text-white border-l rounded-r-md">
                Days
              </span>
              <input
                type="number"
                name="noOfDays"
                value={formik.values.noOfDays}
                onChange={(e) => {
                  if (e.target.value.length <= 11) {
                    formik.handleChange(e);
                  }
                }}
                onWheel={(e) => e.target.blur()}
                onBlur={formik.handleBlur}
                className="border-2 border-[#f2f3f8] rounded-md p-2 w-full text-start focus:outline-none focus:ring-1 focus:ring-[#004181] focus:border-transparent"
                placeholder="Enter no of days"
                style={{ height: inputHeight }}
              />
            </div>
            {formik.touched.noOfDays && formik.errors.noOfDays && (
              <span className="text-red-500 text-sm mt-1">
                {formik.errors.noOfDays}
              </span>
            )}
          </div>

          <div className="flex flex-col ">
            <label className="block text-sm font-medium mb-1">
              Max Limit
            </label>
            <div className="relative">
              <span className="absolute left-0 top-0 w-9 h-full px-3 flex items-center justify-center text-black border-r">
                ₹
              </span>
              <input
                type="number"
                name="maxLimit"
                value={formik.values.maxLimit}
                onChange={(e) => {
                  if (e.target.value.length <= 8) {
                    formik.handleChange(e);
                  }
                }}
                onWheel={(e) => e.target.blur()}
                onBlur={formik.handleBlur}
                className="border-2 border-[#f2f3f8] rounded-md p-2 w-full text-start pl-10 focus:outline-none focus:ring-1 focus:ring-[#004181] focus:border-transparent"
                placeholder="Enter max limit"
                style={{ height: inputHeight }}
              />
            </div>
            {formik.touched.maxLimit && formik.errors.maxLimit && (
              <span className="text-red-500 text-sm mt-1">
                {formik.errors.maxLimit}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Bonus Type 
            </label>
            <Select
              styles={customStyles(true)}
              name="bonus_type"
              options={bonusTypeOptions}
              value={bonusTypeOptions.find(
                (option) => option.id === formik.values.bonus_type
              )}
              placeholder="Select bonus type"
              onChange={(selectedOption) =>
                formik.setFieldValue(
                  "bonus_type",
                  selectedOption ? selectedOption.id : ""
                )
              }
              onBlur={formik.handleBlur}
              className="basic-single w-full"
              classNamePrefix="select"
              isClearable={true}
            />
            {formik.touched.bonus_type && formik.errors.bonus_type && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.bonus_type}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Entry Type 
            </label>
            <Select
              name="entry_type"
              styles={customStyles(true)}
              options={entryTypeOptions}
              value={
                entryTypeOptions.find(
                  (option) => option.id === formik.values.entry_type
                ) || null
              }
              placeholder="Select entry type"
              onChange={(selectedOption) => {
                formik.setFieldValue(
                  "entry_type",
                  selectedOption ? selectedOption.id : ""
                );
                formik.setFieldValue(
                  "values",
                  Array(formik.values.count).fill({})
                );
              }}
              onBlur={formik.handleBlur}
              className="basic-single w-full"
              classNamePrefix="select"
              isClearable={true}
            />
            {formik.touched.entry_type && formik.errors.entry_type && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.entry_type}
              </div>
            )}
          </div>

            {/* referral implimentation */}
          <div>
            <label className="block text-sm font-semibold text-[#232323] mb-1">
              Referral Percentage
            </label>
            <input
              type="number"
              min={0}
              name="referralPercentage"
              value={formik.values.referralPercentage}
              // onChange={(e) => {
              //   let value = parseInt(e.target.value, 10);

              //   formik.setFieldValue("referralPercentage", value);
              // }}
              onChange={(e) => {
                let value = e.target.value;

                // Allow empty value or valid numbers
                if (value === '') {
                  formik.setFieldValue("referralPercentage", '');
                } else {
                  const numValue = parseInt(value, 10);
                  if (!isNaN(numValue)) {
                    formik.setFieldValue("referralPercentage", numValue);
                  }
                }
              }}
              onBlur={formik.handleBlur}
              onWheel={(e) => e.target.blur()}
               disabled={!formik.values.display_referral}
              className={`border border-[#f2f3f8] rounded-lg p-2 w-full h-[44px] focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent ${!formik.values.display_referral ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              // className="w-full h-11 border rounded-lg px-3 py-2"
            />
            {formik.touched.referralPercentage &&
              formik.errors.referralPercentage && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.referralPercentage}
                </div>
              )}
          </div>

          <div className="flex flex-col mt-2">
            <label className="block text-sm font-medium mb-1">
              Display Referral
            </label>
            <div className="flex items-center ml-4">
              <label className="relative inline-block cursor-pointer mt-1 w-[75px] h-8">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formik.values.display_referral}
                  onChange={(e) =>{
                    formik.setFieldValue("display_referral", e.target.checked);
                    formik.setFieldValue("referralPercentage","")
                  }
                  }
                />
                <div
                  className="w-[70px] h-full rounded-[20px] transition-colors duration-300
                 flex items-center justify-between px-3 text-[12px] font-semibold
                 peer-checked:bg-gradient-to-r peer-checked:from-[#ccc] peer-checked:to-[#ccc] text-black"
                  style={{ backgroundColor: "#ccc" }}
                >
                  <span className="text-[#091B1B]">Yes</span>
                  <span style={{ color: "black" }}>No</span>
                </div>
                <div className="absolute top-1 left-2 w-7 h-6 bg-[#004181] rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-[30px]"></div>
              </label>
            </div>

            {formik.touched.display_referral &&
              formik.errors.display_referral && (
                <span className="text-red-500 text-sm mt-1">
                  {formik.errors.display_referral}
                </span>
              )}
          </div>
          {/* end */}



          <div>
            <label className="block text-sm font-medium mb-1">
              Count 
            </label>
            <input
              type="number"
              name="count"
              min={1}
              max={10}
              value={formik.values.count}
              onChange={(e) => {
                let value = parseInt(e.target.value, 10);

                if (isNaN(value)) value = "";
                if (value > 10) value = 10;
                if (value < 1) value = "";

                formik.setFieldValue("count", value);
                formik.setFieldValue("values", Array(value).fill({}));
                formik.setFieldValue("bonuses", Array(value).fill(0));
              }}
              onBlur={formik.handleBlur}
              onWheel={(e) => e.target.blur()}
              className="w-full border rounded-md px-3 py-2"
            />
            {formik.touched.count && formik.errors.count && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.count}
              </div>
            )}
          </div>

          {generateFields()}
        </div>
      </div>

      <Accordion type="multiple" collapsible className="space-y-4">
        <AccordionItem
          value="classification"
          className="border-[1px] rounded-[16px] bg-white"
        >
          <AccordionTrigger className="px-6">
            Classification Details
          </AccordionTrigger>
          <AccordionContent value="classification" className="px-6">
            <div className="border-t pt-4">
              <Suspense fallback={<SpinLoading />}>
                <Classification
                  formik={formik}
                  layout_color={layout_color}
                  setMainImg={setMainImage}
                  setDescImg={setDescriptionImage}
                  pathurl={pathUrl}
                  logo={mainImage}
                  desc_img={descriptionImage}
                />
              </Suspense>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-9 h-[36px] text-sm font-semibold bg-[#004181] text-white rounded-md flex justify-center items-center"
        >
          {isLoading ? <SpinLoading /> : id ? "Update" : "Save"}
        </button>

        {id ? (
          <button
            type="button"
            className="w-20 h-9 border-2 bg-[#F6F7F9] border-[#f2f3f8] rounded-md hover:bg-gray-50 flex justify-center items-center text-[#6C7086]"
            onClick={handleCancle}
          >
            Back
          </button>
        ) : (
          <button
            type="button"
            className="px-9 h-[36px] border-2 text-sm font-semibold bg-[#F6F7F9] border-[#f2f3f8] rounded-md hover:bg-gray-50 flex justify-center items-center text-[#6C7086]"
            onClick={resetFormAndStates}
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
};

export default CreateDigiGoldScheme;