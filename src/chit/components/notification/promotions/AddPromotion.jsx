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
  getcustomerByBranchId,
  addPromotions,
  getallCampaign,
  getCustomersByScheme,
} from "../../../api/Endpoints";
import ReactSelect, { components } from "react-select";
import { FixedSizeList as List } from "react-window";
import { toast } from "react-toastify";
import SpinLoading from "../../common/spinLoading";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";
import { debounce } from "lodash";

const customStyles = (isReadOnly) => ({
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
    fontSize: "14px",
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
});

// Optimized components for large lists
const OptimizedOption = (props) => {
  delete props.innerProps.onMouseMove;
  delete props.innerProps.onMouseOver;
  return <components.Option {...props}>{props.children}</components.Option>;
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

function AddPromotion() {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    id_branch: [],
    id_scheme: [],

    noti_image: "",
    pushNotification: true,
    sms: false,
    whatsapp: false,
    email: false,
    isHtml: false,
  });

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [image, setImage] = useState("");
  const [imagePreviews, setImagePreviews] = useState({ image: null });
  const [pathurl, setPathurl] = useState(null);
  const [isLoading, setisLoading] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_branch = roledata?.branch;
  const branch = roledata?.id_branch;

  useEffect(() => {
    const data = campaignOptions?.find(
      (option) => option?.label == formData.title
    );
    setFormData((prev) => ({
      ...prev,
      body: data?.description || "",
    }));
  }, [formData.title]);

  // Fetch branches
  const { data: branchResponse, isLoading: loadingBranch } = useQuery({
    queryKey: ["branch"],
    queryFn: getallbranch,
  });

  const { data: campaignResponse, isLoading: loadingCampaign } = useQuery({
    queryKey: ["campaign"],
    queryFn: getallCampaign,
  });

  // Fetch schemes
  const { data: schemeResponse, isLoading: loadingSchemes } = useQuery({
    queryKey: ["scheme"],
    queryFn: getallSchemes,
  });

  const branchId =  formData.id_branch||[branch];
  const schemeId = formData.id_scheme
  const { data: customerResponse, isLoading: loadingCustomer } = useQuery({
    queryKey: ["customer", branchId],
    queryFn: () => getCustomersByScheme({branchId,schemeId}),
    enabled: !!branchId,
  });

  // Memoize options for better performance
  const branchOptions = useMemo(() => {
    return (
      branchResponse?.data?.map((branch) => ({
        value: branch._id,
        label: branch.branch_name,
      })) || []
    );
  }, [branchResponse]);

  const schemeOptions = useMemo(() => {
    return (
      schemeResponse?.data?.map((scheme) => ({
        value: scheme._id,
        label: scheme.scheme_name,
      })) || []
    );
  }, [schemeResponse]);

  const customerOptions = useMemo(() => {
    return (
      customerResponse?.customers?.map((cus) => ({
        value: cus._id,
        label: `${cus.firstname} (${cus.mobile})`,
      })) || []
    );
  }, [customerResponse]);

  const campaignOptions = useMemo(() => {
    return (
      campaignResponse?.data?.map((campaign) => ({
        value: campaign._id,
        label: campaign.name,
        description: campaign.description,
      })) || []
    );
  }, [campaignResponse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "noti_image") {
      setFormData((prev) => ({
        ...prev,
        noti_image: value,
      }));
      setPathurl(value);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      setSearchTerm(searchValue);
    }, 500),
    []
  );

  const handleSelectChange = (selectedOptions, allOptions, fieldName) => {
    if (selectedOptions.some((opt) => opt.value === "select_all")) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: allOptions.map((s) => s.value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: selectedOptions.map((s) => s.value),
      }));
    }
  };

  const handleClearImage = () => {
    setImagePreviews((prev) => ({
      ...prev,
      image: null,
    }));
    setImage("");
    fileInputRef.current.value = "";
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const name = event.target.name;

    if (file && file.size <= 500 * 1024) {
      const previewUrl = URL.createObjectURL(file);
      if (file.size > 500 * 1024) {
        toast.error("File size exceeds 500KB.");
        return;
      }

      setImagePreviews((prev) => ({
        ...prev,
        [name]: {
          file,
          previewUrl,
          name: file.name,
        },
      }));

      setImage(file.name);
      setPathurl(previewUrl);
    } else {
      toast.error(
        `File size exceeded, upload max-size(500KB) or file not found`
      );
    }
  };

  const handleSubmit = () => {
    setisLoading(true);
    const formPayload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formPayload.append(`${key}[${index}]`, item);
        });
      } else if (value) {
        formPayload.append(key, value);
      }
    });

    if (image) formPayload.append("image", image);

    addcustomerMutate(formPayload);
  };

  const handleClear = () => {
    handleClearImage();
    setFormData((prev) => ({ ...prev, noti_image: "" }));
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
      noti_image: "",
    });
  };

  const { mutate: addcustomerMutate } = useMutation({
    mutationFn: (data) => addPromotions(data),
    onSuccess: (response) => {
      if (response) {
        toast.success(response.message);
      }
      setisLoading(false);
      navigate("/schemereport/promosummary/");
    },
    onError: (error) => {
      setisLoading(false);
      toast.error(error.response?.data?.message || "An error occurred");
      console.error("Error:", error);
    },
  });

  const handleCheckboxChange = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: !prevData[field],
    }));
  };

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
          {[
            { label: "Push Notification", field: "pushNotification" },
            { label: "SMS", field: "sms" },
            { label: "WhatsApp", field: "whatsapp" },
          ].map(({ label, field }) => (
            <label key={field} className="flex items-center space-x-2 gap-2">
              <input
                type="checkbox"
                name={field}
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
              value={branchOptions.filter((s) =>
                formData.id_branch.includes(s.value)
              )}
              onChange={(selectedOptions) => {
                handleSelectChange(selectedOptions, branchOptions, "id_branch");
              }}
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
            />
          </div>

          {/* Scheme Selection */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">
              Scheme <span className="text-red-400">*</span>
            </label>
            <ReactSelect
              isMulti
              components={{ Option: OptimizedOption, MenuList }}
              options={[
                { value: "select_all", label: "Select All" },
                ...schemeOptions,
              ]}
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
              isLoading={loadingCustomer}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              menuShouldScrollIntoView={false}
              maxMenuHeight={500}
              placeholder="Select Customers"
              onInputChange={debouncedSearch}
              filterOption={(option, input) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </div>

          {/* Title Selection */}
          <div className="flex flex-col">
            <label className="font-mediaum text-gray-700">
              Title <span className="text-red-400">*</span>
            </label>
            <ReactSelect
              styles={customStyles(true)}
              isClearable={true}
              options={campaignOptions}
              className="py-2 px-2 rounded-md"
              disabled
              placeholder="Select title"
              value={
                campaignOptions.find(
                  (option) => option.label === formData.title
                ) || null
              }
              isLoading={loadingCampaign}
              onChange={(option) => {
                setFormData((prev) => ({
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
              className="w-full h-10 border-2 border-[#f2f3f8] rounded-md px-3 text-gray-500"
              placeholder="Enter content"
              onChange={handleChange}
              value={formData.body}
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-row">
              <label className="font-medium text-gray-700">
                Image Upload <span className="text-red-400">*</span>
              </label>
              <p className="text-gray-900 text-[12px] truncate text-start mx-2 mt-1">
                (Maximum file size: 500KB)
              </p>
            </div>

            {/* Input Field with Choose File Button */}
            <div className="relative w-full">
              <input
                type="text"
                className={`cursor-pointer border p-2 pr-24 rounded-md text-gray-400 w-full`}
                placeholder="No file chosen"
                value={imagePreviews?.image?.name || ""}
                readOnly
                onClick={() => {
                  if (!imagePreviews?.image) {
                    fileInputRef.current.value = null;
                    fileInputRef.current.click();
                  }
                }}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                name="noti_image"
                className={`cursor-pointer border p-2 pr-24 rounded-md text-gray-400 w-full hidden`}
              />
              <div
                className={`cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-white px-3 py-2 rounded-md text-sm`}
                onClick={() => {
                  if (!imagePreviews?.image) {
                    fileInputRef.current.value = null;
                    fileInputRef.current.click();
                  }
                }}
                style={{ backgroundColor: layout_color }}
              >
                Choose File
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-12 space-x-4">
          <button
            className="text-white rounded-lg p-2 text-sm font-semibold lg:w-24"
            type="submit"
            onClick={handleSubmit}
            style={{ backgroundColor: layout_color }}
            disabled={isLoading}
          >
            {isLoading ? <SpinLoading /> : "Save"}
          </button>
          <button
            type="button"
            className="bg-gray-300 px-4 py-2 rounded-lg lg:w-24 font-semibold text-sm text-gray-600"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>
    </>
  );
}

export default AddPromotion;
