import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  getBranchById,
  getallbranch,
  addscheme,
  digiGoldStaticData,
  getschemeById,
  updateScheme
} from "../../../api/Endpoints";
import { bonusTypeOptions,entryTypeOptions} from "../../../../utils/Constants";
import SpinLoading from "../../common/spinLoading";

const CreateDigiGoldScheme = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const roleData = useSelector((state) => state.clientForm.roledata);
  const id_branch = roleData?.id_branch;
  const accessBranch = roleData?.branch;

  const [branch, setBranch] = useState(() => (accessBranch === "0" ? [] : {}));
  const [layout_color, setLayoutColor] = useState("#015173");
  const [staticData,setStaticData] = useState({})
  const [isLoading, setIsLoading] = useState(false);

 
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

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      scheme_name: "",
      description: "",
      term_desc: "",
      id_branch: id_branch || "",
      id_metal:'',
      id_purity:"",
      id_classification:"",
      bonus_type:1,
      count: 1,
      entry_type: 1,
      values: [],
      bonuses: [],
      buy_gst: "",
      sell_gst: "",
      max_amount: "",
      min_amount: "",
      scheme_type: 10, // digigold scheme type
    },
    validationSchema:Yup.object({
      scheme_name: Yup.string().required("Scheme name is required"),
      description: Yup.string().required("Description is required"),
      term_desc: Yup.string().required("Terms & conditions is required"),
      id_branch: Yup.string().required("Branch is required"),
      bonus_type: Yup.number().required("Bonus type is required"),
      count: Yup.number().min(1, "Count must be at least 1").required("Count is required"),
      entry_type: Yup.number().required("Entry type is required"),
      values: Yup.array().of(
        Yup.object().shape({
          min: Yup.number().when("$entry_type", {
            is: 2,
            then: () => Yup.number().required("Min value is required"),
            otherwise: () => Yup.number().notRequired(),
          }),
          max: Yup.number().when("$entry_type", {
            is: 2,
            then: () => Yup.number().required("Max value is required"),
            otherwise: () => Yup.number().notRequired(),
          }),
          value: Yup.number().when("$entry_type", {
            is: 1,
            then: () => Yup.number().required("Value is required"),
            otherwise: () => Yup.number().notRequired(),
          }),
        }),
      ),
      bonuses: Yup.array().of(
        Yup.number()
          .min(0, "Bonus must be at least 0")
          .max(100, "Bonus must be at most 100")
          .required("Bonus is required"),
      ),
      buy_gst: Yup.number().required("Buy GST is required"),
      sell_gst: Yup.number().required("Sell GST is required"),
      max_amount: Yup.number().required("Max Amount is required"),
      min_amount: Yup.number().required("Min Amount is required"),
      scheme_type: Yup.number().required("Scheme type is required"),
    }),
    onSubmit: (values) => {
      if (id) {
        updateSchemeData({id,values});
      } else {
        addNewScheme(values);
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

  const {data: digigoldData} = useQuery({
    queryFn:digiGoldStaticData,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  })

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
      navigate("/scheme/digigold/");
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.response.message);
    },
  });

  const { mutate: updateSchemeData } = useMutation({
    mutationFn: ({id, values }) => updateScheme(id, values),
    onSuccess: (response) => {
      if (response.status === 200) {
        setIsLoading(false);
        toast.success(response.message);
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

  useEffect(()=>{
    if(digigoldData){
      setStaticData(digigoldData.data)
      formik.setFieldValue("id_metal",digigoldData.data.id_metal._id)
      formik.setFieldValue("id_purity",digigoldData.data._id)
      formik.setFieldValue('id_classification',digigoldData.data.id_classification)
    }
  },[digigoldData])

  useEffect(()=>{
    formik.setValues({
      ...formik.values,
      scheme_name: schemeData?.data?.scheme_name || "",
      description: schemeData?.data?.description || "",
      term_desc:schemeData?.data?.term_desc || "",
      id_branch:schemeData?.data?.id_branch || "",
      id_metal:schemeData?.data?.id_metal || "",
      id_purity:schemeData?.data?._id || "",
      id_classification:schemeData?.data?.id_classification._id,
      bonus_type:schemeData?.data?.bonus_type || 1,
      count: schemeData?.data?.count || 1,
      entry_type: schemeData?.data?.entry_type || 1,
      values: schemeData?.data?.values || [],
      bonuses: schemeData?.data?.bonuses || [],
      buy_gst:schemeData?.data?.buy_gst || "",
      sell_gst: schemeData?.data?.sell_gst || "",
      max_amount:schemeData?.data?.max_amount || "",
      min_amount:schemeData?.data?.min_amount || "",
      scheme_type:schemeData?.data?.scheme_type || 10
    })
  },[schemeData])

  const handleCancle = () => {
     if(!id){
      navigate("/ourscheme/digigold");
     }else{
      navigate("/scheme/scheme");
     }
  };

  // Function to generate dynamic fields
  const generateFields = () => {
    const count = formik.values.count;
    const entryType = formik.values.entry_type;
    const fields = [];
  
    for (let i = 0; i < count; i++) {
      fields.push(
        <div key={`value-${i}`}>
          <label className="block text-sm font-medium mb-1">
            Value {i + 1} <span className="text-red-400">*</span>
          </label>
          {entryType === 2 ? (
            <div className="flex gap-4">
              <input
                type="number"
                name={`values[${i}].min`}
                value={formik.values.values[i]?.min || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Min Value"
                className="w-full border rounded-md px-3 py-2"
              />
              <input
                type="number"
                name={`values[${i}].max`}
                value={formik.values.values[i]?.max || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Max Value"
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          ) : (
            <input
              type="number"
              name={`values[${i}].value`}
              value={formik.values.values[i]?.value || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onWheel={(e)=>e.target.blur()}
              placeholder="Enter value"
              className="w-full border rounded-md px-3 py-2"
            />
          )}
          {formik.touched.values?.[i]?.min && formik.errors.values?.[i]?.min ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.values[i].min}
            </div>
          ) : null}
          {formik.touched.values?.[i]?.max && formik.errors.values?.[i]?.max ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.values[i].max}
            </div>
          ) : null}
          {formik.touched.values?.[i]?.value &&
          formik.errors.values?.[i]?.value ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.values[i].value}
            </div>
          ) : null}
        </div>
      );
  
      // Bonus field with consistent styling
      fields.push(
        <div key={`bonus-${i}`}>
          <label className="block text-sm font-medium mb-1">
            Bonus {i + 1} (%) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            name={`bonuses[${i}]`}
            value={formik.values.bonuses[i] || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            onWheel={(e)=>e.target.blur()}
            placeholder="Enter bonus"
            className="w-full border rounded-md px-3 py-2"
          />
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

  return (
    <>
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl text-gray-900 font-bold">
          {id ? "Edit DigiGoldScheme" : "Create DigiGoldScheme"}
        </h2>
      </div>
      <div className="w-full flex flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]">
        <div className="flex flex-col p-4 bg-white relative">
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300 mb-10">
              {/* Scheme Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Scheme Name<span className="text-red-400">*</span>
                </label>
                <input
                  name="scheme_name"
                  type="text"
                  value={formik.values.scheme_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Enter Here"
                />
                {formik.touched.scheme_name && formik.errors.scheme_name && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.scheme_name}
                  </div>
                )}
              </div>

              {/* Branch Selection */}
              {accessBranch === "0" ? (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Branches <span className="text-red-500">*</span>
                  </label>
                  <Select
                    styles={customStyles}
                    isClearable={true}
                    options={branch}
                    placeholder="Select Branch"
                    value={
                      branch && branch.length > 0
                        ? branch.find(option => option.value === formik.values.id_branch) || null
                        : null
                    }
                    onChange={(option) =>
                      formik.setFieldValue("id_branch", option.value || "")
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
              <div>
                <label className="block text-sm font-medium mb-1">
                  Metal<span className="text-red-400">*</span>
                </label>
                <input
                  disabled
                  value={staticData?.id_metal?.metal_name}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Purity<span className="text-red-400">*</span>
                </label>
                <input
                  disabled
                  value={staticData?.purity_name}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              {/* Buy GST */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Buy GST <span className="text-red-400">*</span>
                </label>
               <div className="relative">
               <input
                  name="buy_gst"
                  type="number"
                  value={formik.values.buy_gst}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Enter Here"
                />
                 <span
              className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-md text-white rounded-r-md whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ backgroundColor: layout_color }}
            >
              %
            </span>
               </div>
                {formik.touched.buy_gst && formik.errors.buy_gst && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.buy_gst}
                  </div>
                )}
              </div>

              {/* Sell GST */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sell GST<span className="text-red-400">*</span>
                </label>
                <input
                  name="sell_gst"
                  type="number"
                  value={formik.values.sell_gst}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Enter Here"
                />
                {formik.touched.sell_gst && formik.errors.sell_gst && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.sell_gst}
                  </div>
                )}
              </div>

              {/* Max Amount */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Max Amount<span className="text-red-400">*</span>
                </label>
                <input
                  name="max_amount"
                  type="number"
                  value={formik.values.max_amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Enter Here"
                />
                {formik.touched.max_amount && formik.errors.max_amount && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.max_amount}
                  </div>
                )}
              </div>

              {/* Min Amount */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Min Amount<span className="text-red-400">*</span>
                </label>
                <input
                  name="min_amount"
                  type="number"
                  value={formik.values.min_amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Enter Here"
                />
                {formik.touched.min_amount && formik.errors.min_amount && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.min_amount}
                  </div>
                )}
              </div>

              {/* Bonus Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bonus Type<span className="text-red-400">*</span>
                </label>
                <Select
                  styles={customStyles}
                  name="bonus_type"
                  options={bonusTypeOptions}
                  value={
                    bonusTypeOptions.find(
                      (option) => option.id === formik.values.bonus_type
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    formik.setFieldValue(
                      "bonus_type",
                      selectedOption ? selectedOption.id : ''
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

              {/* Count */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Count<span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="count"
                  value={formik.values.count}
                  onChange={(e) => {
                    const newCount = parseInt(e.target.value) || 1;
                    formik.handleChange(e);
                    formik.setFieldValue("values", Array(newCount).fill({}));
                    formik.setFieldValue("bonuses", Array(newCount).fill(0));
                  }}
                  onBlur={formik.handleBlur}
                  min="1"
                  className="w-full border rounded-md px-3 py-2"
                />
                {formik.touched.count && formik.errors.count && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.count}
                  </div>
                )}
              </div>

              {/* Entry Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Entry Type<span className="text-red-400">*</span>
                </label>
                <Select
                  name="entry_type"
                  styles={customStyles}
                  options={entryTypeOptions}
                  value={
                    entryTypeOptions.find(
                      (option) => option.id === formik.values.entry_type
                    ) || null
                  }
                  onChange={(selectedOption) => {
                    // const newType = selectedOption
                    //   ? selectedOption.id
                    //   : 1;
                    // formik.setFieldValue("entry_type", newType);
                    formik.setFieldValue(
                          "entry_type",
                          selectedOption ? selectedOption.id : ''
                        )
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

              {/* Dynamic Fields */}
              {generateFields()}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description<span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Enter Here"
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.description}
                  </div>
                )}
              </div>

              {/* Terms & Conditions */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Terms & Conditions<span className="text-red-400">*</span>
                </label>
                <textarea
                  name="term_desc"
                  value={formik.values.term_desc}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Enter Here"
                />
                {formik.touched.term_desc && formik.errors.term_desc && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.term_desc}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white">
              <div className="flex justify-end gap-4">
                <button
                  className="bg-[#E2E8F0] text-black rounded-md p-3 w-full lg:w-20"
                  type="button"
                  onClick={handleCancle}
                >
                  Cancel
                </button>
                <button
                   className="px-4 py-2 bg-[#015173] text-white rounded-md"
                  type="submit"
                  disabled={isLoading}
                >
                  
                  {isLoading ? <SpinLoading /> : id ? "Update" : "Submit"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateDigiGoldScheme;