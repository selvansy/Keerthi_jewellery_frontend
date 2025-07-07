import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getallSchemes,
  getallbranch,
  getallCampaign,
  getSchemeCustomers,
  addPromotions,
} from "../../../api/Endpoints";
import ReactSelect, { components } from "react-select";
import { FixedSizeList as List } from "react-window";
import { toast } from "sonner";
import SpinLoading from "../../common/spinLoading";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";
import { debounce } from "lodash";
import Select from "react-select";

// Constants
const MAX_FILE_SIZE = 500 * 1024;
const NOTIFICATION_OPTIONS = [
  { label: "Push Notification", field: "pushNotification" },
  // { label: "SMS", field: "sms" },
  // { label: "WhatsApp", field: "whatsapp" },
];
const ARRAY_FIELDS = ['id_branch', 'id_scheme', 'customer_id'];
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

// Custom styles for React Select
const customStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "44px",
    backgroundColor: "white",
    color: "#232323",
    border: state.isFocused ? "1px solid #f2f2f9" : "1px solid #f2f2f9",
    boxShadow: state.isFocused ? "0 0 0 1px #004181" : "none",
    borderRadius: "0.5rem",
    "&:hover": {
      color: "#e2e8f0",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#6C7086",
    fontSize: "14px",
  }),
  dropdownIndicator: (provided) => ({
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
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#F0F7FE"
      : state.isFocused
      ? "#F0F7FE"
      : "white",
    color: "#232323",
    fontWeight: "500",
    fontSize: "14px",
  }),
  valueContainer: (base) => ({
    ...base,
    maxHeight: "40px",
    overflowY: "auto",
    flexWrap: "nowrap",
  }),
  multiValue: (base) => ({
    ...base,
    whiteSpace: "nowrap",
  }),
};

const OptimizedOption = (props) => {
  const { innerProps, ...rest } = props;
  const { onMouseMove, onMouseOver, ...filteredInnerProps } = innerProps;
  return <components.Option {...rest} innerProps={filteredInnerProps}>{rest.children}</components.Option>;
};

const MenuList = ({ options, children, maxHeight, getValue }) => {
  const [value] = getValue();
  const initialOffset = options.indexOf(value) * 35;
  const height = Math.min(maxHeight, options.length * 35);

  return (
    <List
      height={height}
      itemCount={children.length}
      itemSize={35}
      initialScrollOffset={initialOffset}
    >
      {({ index, style }) => <div style={style}>{children[index]}</div>}
    </List>
  );
};

const ensureArrayFields = (data) => {
  const processedData = { ...data };
  
  ARRAY_FIELDS.forEach(field => {
    if (!Array.isArray(processedData[field])) {
      processedData[field] = processedData[field] ? [processedData[field]] : [];
    }
  });
  
  return processedData;
};

function AddPromotion() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    id_branch: [],
    id_scheme: [],
    customer_id: [],
    image: null,
    pushNotification: true,
    sms: false,
    whatsapp: false,
    email: false,
    isHtml: false,
  });

  const [imagePreviews, setImagePreviews] = useState({ image: null });
  const [isLoading, setIsLoading] = useState(false);
  const [customerOptions, setCustomerOptions] = useState([]);

  // Fetch data
  const { data: branchResponse, isLoading: loadingBranch } = useQuery({
    queryKey: ["branch"],
    queryFn: getallbranch,
  });

  const { data: campaignResponse, isLoading: loadingCampaign } = useQuery({
    queryKey: ["campaign"],
    queryFn: getallCampaign,
  });

  const { data: schemeResponse, isLoading: loadingSchemes } = useQuery({
    queryKey: ["scheme"],
    queryFn: getallSchemes,
  });

  // Memoized options
  const branchOptions = useMemo(() => 
    branchResponse?.data?.map((branch) => ({
      value: branch._id,
      label: branch.branch_name,
    })) || []
  , [branchResponse]);

  const schemeOptions = useMemo(() => 
    schemeResponse?.data?.map((scheme) => ({
      value: scheme._id,
      label: scheme.scheme_name,
    })) || []
  , [schemeResponse]);

  const campaignOptions = useMemo(() => 
    campaignResponse?.data?.map((campaign) => ({
      value: campaign._id,
      label: campaign.name,
      description: campaign.description,
    })) || []
  , [campaignResponse]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      // Currently just sets search term, could be used for filtering
      ;
    }, 500),
    []
  );

  const handleSelectChange = (selectedOptions, allOptions, fieldName) => {
    let values = [];
    
    if (!selectedOptions || (Array.isArray(selectedOptions) && selectedOptions.length === 0)) {
      values = [];
    } else {
      const optionsArray = Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions];
      const isSelectAll = optionsArray.some(opt => opt.value === "select_all");
      
      values = isSelectAll
        ? allOptions.map(opt => opt.value).filter(v => v !== "select_all")
        : optionsArray.map(opt => opt.value);
    }

    setFormData(prev => ({
      ...prev,
      [fieldName]: values
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleClearImage = () => {
    // Clean up previous preview URL to avoid memory leaks
    if (imagePreviews.image?.previewUrl) {
      URL.revokeObjectURL(imagePreviews.image.previewUrl);
    }
    
    setImagePreviews({ image: null });
    setFormData(prev => ({ ...prev, image: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, WebP).");
      event.target.value = ""; // Clear the input
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 500KB. Please select a smaller image.");
      event.target.value = ""; // Clear the input
      return;
    }

    // Clean up previous preview URL to avoid memory leaks
    if (imagePreviews.image?.previewUrl) {
      URL.revokeObjectURL(imagePreviews.image.previewUrl);
    }

    // Create new preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreviews({
      image: {
        file,
        previewUrl,
        name: file.name,
      },
    });
    
    // Update formData with the file object
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear previous value to ensure onChange fires
      fileInputRef.current.click();
    }
  };

  const { mutate: getSchemeCustomerList } = useMutation({
    mutationFn: getSchemeCustomers,
    onSuccess: (response) => {
      const fetchedOptions = response?.data?.map((item) => ({
        value: item._id,
        label: `${item.firstname} ${item.lastname || ""} (${item.mobile})`,
        mobile: item.mobile,
      }));
      setCustomerOptions(fetchedOptions);
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Error fetching customers");
    },
  });

  const { mutate: addcustomerMutate } = useMutation({
    mutationFn: addPromotions,
    onSuccess: (response) => {
      toast.success(response.message);
      setIsLoading(false);
      navigate("/schemereport/promosummary/");
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const handleSubmit = () => {
    // Basic validation
    if (!formData.title.trim()) {
      toast.error("Please select a title");
      return;
    }
    
    if (!formData.body.trim()) {
      toast.error("Please enter content");
      return;
    }
    
    if (formData.id_branch.length === 0) {
      toast.error("Please select at least one branch");
      return;
    }
    
    if (formData.id_scheme.length === 0) {
      toast.error("Please select at least one scheme");
      return;
    }
    
    if (formData.customer_id.length === 0) {
      toast.error("Please select at least one customer");
      return;
    }

    setIsLoading(true);
    const validatedFormData = ensureArrayFields(formData);
    
    const formDataToSend = new FormData();
    
    // Append all form data to FormData object
    Object.keys(validatedFormData).forEach(key => {
      if (key === 'image') {
        if (validatedFormData[key] && validatedFormData[key] instanceof File) {
          formDataToSend.append(key, validatedFormData[key]);
        }
      } else if (Array.isArray(validatedFormData[key])) {
        validatedFormData[key].forEach(value => {
          formDataToSend.append(`${key}[]`, value);
        });
      } else {
        formDataToSend.append(key, validatedFormData[key]);
      }
    });

    addcustomerMutate(formDataToSend);
  };

  const handleClear = () => {
    handleClearImage();
    setFormData({
      title: "",
      body: "",
      id_branch: [],
      id_scheme: [],
      customer_id: [],
      pushNotification: true,
      sms: false,
      whatsapp: false,
      email: false,
      isHtml: false,
      image: null,
    });
    setCustomerOptions([]);
  };

  // Update body when title changes
  useEffect(() => {
    const data = campaignOptions?.find(
      (option) => option?.label === formData.title
    );
    if (data?.description) {
      setFormData(prev => ({ ...prev, body: data.description }));
    }
  }, [formData.title, campaignOptions]);

  // Fetch customers when scheme changes
  useEffect(() => {
    if (formData.id_scheme.length > 0) {
      getSchemeCustomerList({ id_scheme: formData.id_scheme });
    } else {
      setCustomerOptions([]);
      setFormData(prev => ({ ...prev, customer_id: [] }));
    }
  }, [formData.id_scheme, getSchemeCustomerList]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreviews.image?.previewUrl) {
        URL.revokeObjectURL(imagePreviews.image.previewUrl);
      }
    };
  }, []);

  return (
    <>
      <div className="flex flex-row justify-start items-center w-full sm:order-1 sm:w-auto sm:mr-auto md:order-1 md:w-auto md:mr-auto">
        <div className="w-1/2 sm:w-auto mt-2">
          <Breadcrumb
            items={[
              { label: "Promotions " },
              { label: "Promotions Creation", active: true },
            ]}
          />
        </div>
      </div>
      
      <div className="bg-[#FFFFFF] rounded-[16px] p-6 border-[1px]">
        <h2 className="text-lg font-semibold mb-4 border-b pb-4">
          Add Promotions
        </h2>

        {/* Notification Options */}
        <div className="flex gap-4 mb-4">
          {NOTIFICATION_OPTIONS.map(({ label, field }) => (
            <label key={field} className="flex items-center space-x-2 gap-2">
              <input
                type="checkbox"
                checked={formData[field]}
                className="w-[16px] h-[16px]"
                onChange={() => handleCheckboxChange(field)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Branch Selection */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">
              Branch <span className="text-red-400">*</span>
            </label>
            <ReactSelect
              isMulti
              components={{ Option: OptimizedOption, MenuList }}
              options={[
                { value: "select_all", label: "Select All" },
                ...branchOptions,
              ]}
              value={branchOptions.filter(opt => formData.id_branch.includes(opt.value))}
              onChange={(selected) => handleSelectChange(selected, branchOptions, "id_branch")}
              isLoading={loadingBranch}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              menuShouldScrollIntoView={false}
              maxMenuHeight={500}
              placeholder="Select Branch"
              onInputChange={debouncedSearch}
              filterOption={(option, input) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              styles={customStyles}
            />
          </div>

          {/* Scheme Selection */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">
              Scheme <span className="text-red-400">*</span>
            </label>
            <Select
              isMulti
              options={[
                { value: "select_all", label: "Select All" },
                ...schemeOptions,
              ]}
              components={{ Option: OptimizedOption, MenuList }}
              value={schemeOptions.filter((s) =>
                formData.id_scheme.includes(s.value)
              )}
              onChange={(selectedOptions) => {
                handleSelectChange(selectedOptions, schemeOptions, "id_scheme");
              }}
              isLoading={loadingSchemes}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              menuShouldScrollIntoView={false}
              maxMenuHeight={500}
              placeholder="Select Scheme"
              onInputChange={debouncedSearch}
              filterOption={(option, input) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              styles={customStyles}
            />
          </div>

          {/* Customer Selection */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">
              Customer <span className="text-red-400">*</span>
            </label>
            <ReactSelect
              isMulti
              components={{ Option: OptimizedOption, MenuList }}
              options={[
                { value: "select_all", label: "Select All" },
                ...customerOptions,
              ]}
              value={customerOptions.filter((s) =>
                formData.customer_id.includes(s.value)
              )}
              onChange={(selectedOptions) => {
                handleSelectChange(
                  selectedOptions,
                  customerOptions,
                  "customer_id"
                );
              }}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              menuShouldScrollIntoView={false}
              maxMenuHeight={500}
              placeholder="Select Customers"
              onInputChange={debouncedSearch}
              filterOption={(option, input) =>
                option.label.toLowerCase().includes(input.toLowerCase()) ||
                option.mobile?.includes(input)
              }
              styles={customStyles}
            />
          </div>

          {/* Title Selection */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">
              Title <span className="text-red-400">*</span>
            </label>
            <ReactSelect
              styles={customStyles}
              isClearable
              options={campaignOptions}
              className="py-2 px-2 rounded-md"
              placeholder="Select title"
              value={
                campaignOptions.find(
                  (option) => option.label === formData.title
                ) || null
              }
              isLoading={loadingCampaign}
              onChange={(option) => {
                setFormData(prev => ({
                  ...prev,
                  title: option?.label || "",
                }));
              }}
              components={{ Option: OptimizedOption, MenuList }}
              menuShouldScrollIntoView={false}
              maxMenuHeight={500}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">
              Content <span className="text-red-400">*</span>
            </label>
            <textarea
              name="body"
              className="w-full h-20 border-2 border-[#f2f3f8] rounded-md px-3 py-2 text-gray-700 resize-vertical"
              placeholder="Enter content"
              onChange={handleChange}
              value={formData.body}
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-row">
              <label className="font-medium text-gray-700">
                Image Upload
              </label>
              <p className="text-gray-900 text-[12px] truncate text-start mx-2 mt-1">
                (Maximum file size: 500KB)
              </p>
            </div>

            <div className="relative w-full">
              <input
                type="text"
                className="cursor-pointer border-2 border-[#f2f3f8] p-2 pr-24 rounded-md text-gray-500 w-full bg-white"
                placeholder="No file chosen"
                value={imagePreviews?.image?.name || ""}
                readOnly
                onClick={handleFileInputClick}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="absolute right-0 top-0 h-full flex items-center">
                {imagePreviews?.image && (
                  <button
                    type="button"
                    className="mr-2 text-red-500 hover:text-red-700 px-2 py-1 text-sm"
                    onClick={handleClearImage}
                    title="Remove image"
                  >
                    ×
                  </button>
                )}
                <button
                  type="button"
                  className="text-white px-3 py-2 rounded-md text-sm font-medium h-full"
                  onClick={handleFileInputClick}
                  style={{ backgroundColor: layout_color }}
                >
                  Choose File
                </button>
              </div>
            </div>

            {/* Image Preview */}
            {imagePreviews?.image && (
              <div className="mt-2">
                <img
                  src={imagePreviews.image.previewUrl}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-md border"
                />
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-12 space-x-4">
          <button
            className="text-white rounded-lg p-2 text-sm font-semibold lg:w-24 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            style={{ backgroundColor: layout_color }}
            disabled={isLoading}
          >
            {isLoading ? <SpinLoading /> : "Save"}
          </button>
          <button
            type="button"
            className="bg-gray-300 px-4 py-2 rounded-lg lg:w-24 font-semibold text-sm text-gray-600 hover:bg-gray-400 disabled:opacity-50"
            onClick={handleClear}
            disabled={isLoading}
          >
            Clear
          </button>
        </div>
      </div>
    </>
  );
}

export default AddPromotion;