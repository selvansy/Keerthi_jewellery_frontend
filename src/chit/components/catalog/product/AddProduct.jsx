import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { CalendarDays, Search } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import {
  getallmetal,
  puritybymetal,
  createproduct,
  updateproduct,
  categorybymetalid,
  getbranchbyid,
  getAllBranch,
  getMetalRateByMetalId,
  productbyid,
} from "../../../api/Endpoints";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import SpinLoading from "../../common/spinLoading";
import { customSelectStyles } from "../../Setup/purity";
import Select from "react-select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../../components/ui/accordion";
import MakingChargesForm from "./makingCharge";
import WastageChargeForm from "./wastageCharge";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";
import { customStyles } from "../../ourscheme/scheme/AddScheme";
const AddProduct = () => {
  const roleData = useSelector((state) => state.clientForm.roledata);
  const accessBranch = roleData?.id_branch || roleData?.branch;
  const naviagte = useNavigate();
  const { id } = useParams();
  const [branch, setBranch] = useState(() => (accessBranch === "0" ? [] : {}));
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const [metals, setMetals] = useState([]);
  const [category, setCategory] = useState([]);
  const [currentRate, setCurrentRate] = useState("0");
  const [purity, setPurity] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const MAX_IMAGES = 3;
  const [product_image, setproductImgPath] = useState([]);
  const [price, setPrice] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [pathUrl, setPathUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [makingCharge,setMakingCharge]=useState({})
  const [responseData,setResponseData]= useState({})
  const [formData, setFormData] = useState({
    product_name: "",
    code: "",
    id_category: "",
    id_branch: "",
    description: "",
    id_metal: "",
    weight: "0",
    id_purity: "",
    gst: "3",
    showprice: "",
    makingCharges: {
      mode: "amount",
      actualValue: "",
      discountedValue: "",
      discountedPercentage: "",
      discountView: false,
      mcView: false,
    },
    wastageCharges: {
      mode: "amount",
      actualValue: "",
      discountedValue: "",
      discountedPercentage: "",
      discountView: false,
      wastageView: false,
    },
  });

  useEffect(() => {
    if (!id) return;
    getProdcutById(id);
  }, [id]);

  useEffect(() => {
    if (!roleData) return;
    if (accessBranch !== "0") {
      getBranchData({ id: accessBranch });
    } else if (accessBranch == "0") {
      getAllBranches();
    }
  }, [roleData]);

  useEffect(() => {
    getMetals();
    formData.showprice=true
  }, []);

  useEffect(() => {
    if (formData.id_purity) {
      getTodayMetalRate({
        id_metal: formData.id_metal,
        id_purity: formData.id_purity,
        date: new Date(),
        branch: accessBranch
      });
    }
  }, [formData.id_purity]);

  useEffect(() => {
    const sum = currentRate * formData.weight;
    setPrice(sum);
  }, [formData.weight, formData.id_metal, formData.id_purity, currentRate]);

  // getting category data and fetching purityBy metal
  useEffect(() => {
    if (formData.id_metal) {
      getCategory(formData.id_metal);
      getPurityByMetal(formData.id_metal);
    }
    setFormData((prev) => ({
      ...prev,
      id_category: "",
    }));
  }, [formData.id_metal]);

  useEffect(() => {
    let makingCharge = 0;
    let wastageCharge = 0;

    if (formData.makingCharges.mode === "weight") {
      makingCharge = currentRate * formData.wastageCharges.discountedValue;
    } else {
      makingCharge = Number(formData.makingCharges.discountedValue) || 0;
    }

    if (formData.wastageCharges.mode === "weight") {
      wastageCharge = currentRate * formData.wastageCharges.discountedValue;
    } else {
      wastageCharge = Number(formData.wastageCharges.discountedValue) || 0;
    }

    let total = price + makingCharge + wastageCharge;
    let totalWithGST = total + formData.gst / 100;

    setTotalPrice(totalWithGST);
  }, [
    price,
    currentRate,
    formData.gst,
    formData.weight,
    formData.makingCharges.mode,
    formData.makingCharges.discountedValue,
    formData.wastageCharges.mode,
    formData.wastageCharges.discountedValue,
  ]);

  const { mutate: getTodayMetalRate } = useMutation({
    mutationFn: ({ id_metal, id_purity, date,branch}) =>
      getMetalRateByMetalId(id_metal, id_purity, date,branch),
    onSuccess: (response) => {
      const { data } = response;
      setCurrentRate(data.rate);
    },
    onError: (error) => {
      console.error("Error fetching metal rate:", error);
    },
  });

  //mutation to get all branches
  const { mutate: getAllBranches } = useMutation({
    mutationFn: () => getAllBranch(),
    onSuccess: (response) => {
      setBranch(
        response.data.map((branch) => ({
          value: branch._id,
          label: branch.branch_name,
        }))
      );
    },
    onError: (error) => {
      console.error("Error fetching branches:", error);
    },
  });

  //mutation to get all metals
  const { mutate: getMetals } = useMutation({
    mutationFn: () => getallmetal(),
    onSuccess: (response) => {
      setMetals(
        response.data.map((metal) => ({
          value: metal._id,
          label: metal.metal_name,
        }))
      );
    },
    onError: (error) => {
      console.error("Error fetching branches:", error);
    },
  });
  const { mutate: getProdcutById } = useMutation({
    mutationFn: (id) => productbyid(id),
    onSuccess: (response) => {
      setResponseData(response)
      setMakingCharge(response.data)
      setFormData(response.data);
      setproductImgPath(response.data.product_image);
      setPathUrl(response.data.pathurl);
    },
    onError: (error) => {
      console.error("Error fetching getProdcutById:", error);
    },
  });

  useEffect(() => {
  if (id && formData) {
    setFormData((prev) => ({
      ...prev,
      id_category: responseData.data?.id_category
    }));
  }
}, [id, formData]);


  const { mutate: getPurityByMetal } = useMutation({
    mutationFn: (id) => puritybymetal(id),
    onSuccess: (response) => {
      setPurity(
        response.data.map((purity) => ({
          value: purity._id,
          label: purity.purity_name,
        }))
      );
    },
    onError: (error) => {
      console.error("Error fetching getPurityByMetal:", error);
    },
  });

  // mutation for get all category by metal id
  const { mutate: getCategory } = useMutation({
    mutationFn: (data) => categorybymetalid(data),
    onSuccess: (response) => {
      setCategory(
        response.data.map((catgory) => ({
          value: catgory._id,
          label: catgory.category_name,
        }))
      );
    },
    onError: (error) => {
      setCategory([]);
      console.error("Error fetching category:", error);
    },
  });

  const { mutate: addProduct } = useMutation({
    mutationFn: (formData) => createproduct(formData),
    onSuccess: (response) => {
      if (response.message) {
        setIsLoading(false);
        toast.success(response.message);
        naviagte("/catalog/product/");
      }
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.response.data.message);
      console.error("Error fetching product:", error);
    },
  });
  const { mutate: editProduct } = useMutation({
    mutationFn: (formData) => updateproduct(formData),
    onSuccess: (response) => {
      if (response.message) {
        toast.success(response.message);
        naviagte("/catalog/product/");
      }
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.response.data.message);
      console.error("Error fetching product:", error);
    },
  });

  //mutation to get branch by id
  const { mutate: getBranchData } = useMutation({
    mutationFn: (data) => getbranchbyid(data),
    onSuccess: (response) => {
      const { data } = response;
      setBranch({
        _id: data._id,
        branch_name: data.branch_name,
      });
      setFormData((prev) => ({
        ...prev,
        id_branch: data._id,
      }));
    },
    onError: (error) => {
      console.error("Error fetching branches:", error);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "gst" && !/^\d{0,2}$/.test(value)) {
      return;
    }

    if (name === "weight" && !/^\d{0,4}(\.\d{0,3})?$/.test(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (product_image.length == 3) {
      return toast.error(`Maximum ${MAX_IMAGES} images allowed`);
    }
    if (files.length > 0) {
      const existingImages = product_image.filter(
        (img) => typeof img === "string"
      );
      let totalImages = existingImages.length;

      const validFiles = [];

      for (const file of files) {
        // Allowed image formats
        const allowedFormats = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedFormats.includes(file.type)) {
          toast.error(
            "Invalid image format. Only JPEG, PNG, and WEBP are allowed."
          );
          continue;
        }

        if (totalImages >= MAX_IMAGES) {
          toast.error(`Maximum ${MAX_IMAGES} images allowed`);
          e.target.value = "";
          return;
        }

        if (file.size > 500 * 1024) {
          toast.error(`${file.name} exceeds the 500 KB limit`);
        } else {
          validFiles.push(file);
          totalImages++; // Increment count only when adding a valid image
        }
      }

      if (validFiles.length > 0) {
        setproductImgPath((prevState) => [...prevState, ...validFiles]);
      }
    }

    e.target.value = "";
  };

  useEffect(() => {
    const newPreviews = product_image.map((img) =>
      typeof img === "string" ? img : URL.createObjectURL(img)
    );
    setImagePreviews(newPreviews);

    return () => {
      newPreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [product_image]);

  const handleRemoveImage = (index) => {
    const updatedImages = product_image.filter((_, i) => i !== index);
    setproductImgPath(updatedImages);
  };

  const handleMakingCharge = (data) => {
    setFormData((prev) => ({
      ...prev,
      makingCharges: {
        ...prev.makingCharges,
        ...data,
      },
    }));
  };

  const handleWastageCharge = (data) => {
    setFormData((prev) => ({
      ...prev,
      wastageCharges: {
        ...prev.wastageCharges,
        ...data,
      },
    }));
  };

  const validateFormData = () => {
    const errors = {};

    if (!formData.product_name.trim()) {
      errors.product_name = "Product name is required.";
    }

    if (!formData.code.trim()) {
      errors.code = "Product code is required.";
    }

    if (!formData.id_category) {
      errors.id_category = "Category is required.";
    }

    if (!formData.id_branch) {
      errors.id_branch = "Branch is required.";
    }

    if (!formData.id_metal) {
      errors.id_metal = "Metal type is required.";
    }

    if (!formData.id_purity) {
      errors.id_purity = "Purity is required.";
    }
    if (!formData.description) {
      errors.description = "description is required.";
    }

    if (isNaN(formData.weight) || Number(formData.weight) <= 0) {
      errors.weight = "Weight is required.";
    }

    if (isNaN(formData.gst) || Number(formData.gst) <= 0) {
      errors.gst = "GST is required.";
    }

    if (product_image.length == 0) {
      errors.product_image = "Atleast one image is required";
    }

    return errors;
  };

  const handleSubmit = () => {
    const validationErrors = validateFormData();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      ;
      return;
    }
    setIsLoading(true);
    setErrors({});
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "_id" || key === "pathurl" || key === "active") {
        ;
        return;
      }
    
      if (typeof value === "object" && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (
            subKey === "_id" &&
            (key === "wastageCharges" || key === "makingCharges")
          ) {
            ;
            return;
          }
          formDataToSend.append(`${key}[${subKey}]`, subValue);
        });
      } else {
        formDataToSend.append(key, value);
      }
    });
    

    if (product_image && product_image.length > 0) {
      product_image.forEach((image, index) => {
        if (image instanceof File) {
          formDataToSend.append("product_image", image);
        } else if (typeof image === "string") {
          formDataToSend.append("product_image", image);
        }
      });
    }
    if (id) {
      editProduct({ formDataToSend, id });
    } else {
      addProduct(formDataToSend);
    }
  };

  return (
    <>
      <Breadcrumb
        items={[{ label: "Catelogue" }, { label: "Product", active: true }]}
      />

      <div className="w-full flex flex-col bg-white mt-3 overflow-y-auto scrollbar-hide rounded-[16px] px-4 border border-[#F2F2F9]">
        <div className="flex flex-col p-4  relative">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold whitespace-nowrap">
              {id ? "Edit product" : "Create product"}
            </h2>
          </div>
          <div className="border-b-2 border-[#F2F2F9] w-full py-2"></div>

          <div className="grid grid-rows-2 md:grid-cols-3 gap-5 border-[#F2F2F9] mb-5 mt-2 ">
            {accessBranch == "0" && branch.length > 0 ? (
              <div>
                <label className="block text-sm  mt-3 font-medium ">
                  Branches <span className="text-red-500">*</span>
                </label>
                <Select
                  className="mt-2"
                  styles={customStyles(true)}
                  options={branch || []}
                  placeholder="Select Branch"
                  value={branch.find(
                    (option) => option.value === formData.id_branch
                  )}
                  onChange={(option) => {
                    setFormData((prev) => ({
                      ...prev,
                      id_branch: option.value,
                    }));
                  }}
                />
                <span className="text-red-500 text-sm mt-1">
                  {errors.id_branch}
                </span>
              </div>
            ) : (
              <div>
                <label className="block text-sm text-gray-500 font-medium mb-1 mt-3">
                  Branch <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  disabled
                  value={branch?.branch_name || ""}
                  className="w-full border rounded-md px-3 py-2 text-gray-500"
                />
              </div>
            )}

            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Metal<span className="text-red-400">*</span>
              </label>
              <Select
                styles={customStyles(true)}
                options={metals}
                placeholder="Select Metal"
                value={metals.find(
                  (option) => option.value === formData.id_metal
                )}
                onChange={(option) => {
                  setFormData((prev) => ({
                    ...prev,
                    id_metal: option.value,
                    id_category: "",
                  }));
                  setCurrentRate("0");
                }}
              />
              <span className="text-red-500 text-sm mt-1">
                {errors.id_metal}
              </span>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Category<span className="text-red-400">*</span>
              </label>
              <Select
                styles={customSelectStyles(metals)}
                options={category}
                placeholder={
                  category.length > 0
                    ? "Select Category"
                    : "No categories available"
                }
                value={
                  category.find(
                    (option) => option.value === formData.id_category
                  ) || null
                }
                onChange={(option) =>
                  setFormData((prev) => ({
                    ...prev,
                    id_category: option ? option.value : "",
                  }))
                }
                isDisabled={category.length <= 0}
                noOptionsMessage={() =>
                  "No categories available for this metal"
                }
              />
              <span className="text-red-500 text-sm mt-1">
                {errors.id_category}
              </span>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                purity<span className="text-red-400">*</span>
              </label>
              <Select
                styles={customSelectStyles(metals)}
                options={purity}
                placeholder={
                  purity.length > 0 ? "Select purity" : "No purities available"
                }
                value={
                  purity.find(
                    (option) => option.value === formData.id_purity
                  ) || null
                }
                onChange={(option) => {
                  setFormData((prev) => ({
                    ...prev,
                    id_purity: option ? option.value : "",
                  }));
                  handleRate();
                }}
                isDisabled={purity.length <= 0}
                noOptionsMessage={() => "No purities available for this metal"}
              />
              <span className="text-red-500 text-sm mt-1">
                {errors.id_purity}
              </span>
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Product Name<span className="text-red-400">*</span>
              </label>
              <input
                name="product_name"
                type="text"
                value={formData.product_name}
                className="border-2 border-[#F2F2F9] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent h-[42px]"
                placeholder="Enter Product Name"
                onChange={handleInputChange}
              />
              <span className="text-red-500 text-sm mt-1">
                {errors.product_name}
              </span>
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Product Code <span className="text-red-400">*</span>
              </label>
              <input
                name="code"
                type="text"
                value={formData.code}
                className="border-2 border-[#F2F2F9] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent h-[42px]"
                placeholder="Enter Product Code"
                onChange={handleInputChange}
              />
              <span className="text-red-500 text-sm mt-1">{errors.code}</span>
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Product Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="message"
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="border-2 border-[#F2F2F9] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent h-[42px] min-h-[42px] max-h-[120px] px-4 pt-[10px] placeholder-gray-400 text-sm"
                placeholder="Enter product description"
              ></textarea>

              <span className="text-red-500 text-sm mt-1">
                {errors.description}
              </span>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Show Price<span className="text-red-400">*</span>
              </label>
              <Select
                styles={customStyles(true)}
                options={[
                  { value: true, label: "Show" },
                  { value: false, label: "Hide" },
                ]}
                placeholder={
                  purity.length > 0 ? "Select Show Price" : "No  Show Price"
                }
                value={
                  [
                    { value: true, label: "Show" },
                    { value: false, label: "Hide" },
                  ].find((option) => option.value === formData.showprice) ||
                  null
                }
                onChange={(option) => {
                  setFormData((prev) => ({
                    ...prev,
                    showprice: option ? option.value : "",
                  }));
                  handleRate();
                }}
                isDisabled={purity.length <= 0}
              />
              <span className="text-red-500 text-sm mt-1">
                {errors.showprice}
              </span>
            </div>
            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Gst %<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  name="gst"
                  type="string"
                  value={formData.gst}
                  className="border-2 border-[#F2F2F9] rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent h-[42px]"
                  placeholder="Enter Here"
                  onChange={handleInputChange}
                  onWheel={(e) => e.target.blur()}
                />
                <span
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center border-s-2 border-[#F2F2F9] rounded-r-md"
                  // style={{ backgroundColor: layout_color }}
                >
                  %
                </span>
              </div>
              <span className="text-red-500 text-sm mt-1">{errors.gst}</span>
            </div>

            <div className="flex flex-col mt-2 ">
              <label className="text-gray-700 mb-2 font-medium">
                Current Metal Rate<span className="text-red-400">*</span>
              </label>
              <div className="flex items-center border-2 border-[#F2F2F9] rounded-[8px] h-[44px]">
                <div className="h-[44px] border-e-2 border-[#F2F2F9] flex items-center">
                  <span className="px-[14px] flex items-center justify-center h-full">
                    ₹
                  </span>
                </div>

                <input
                  name="metalrate"
                  type="string"
                  value={currentRate}
                  className="w-full focus:outline-none ml-2"
                  placeholder="Current Metal Rate"
                  readOnly
                />
              </div>
            </div>
            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Weight<span className="text-red-400">*</span>
              </label>
              <div className="flex border-2 border-[#F2F2F9] h-[44px] rounded-[8px]">
                <input
                  name="weight"
                  type="string"
                  value={formData.weight}
                  className=" rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent "
                  placeholder="Enter Here"
                  onChange={handleInputChange}
                  onWheel={(e) => e.target.blur()}
                />
                <div className="h-[43px] border-s-2 border-[#F2F2F9] flex items-center">
                  <span className="px-[14px] flex items-center justify-center h-full">
                    g
                  </span>
                </div>
              </div>
              <span className="text-red-500 text-sm mt-1">{errors.weight}</span>
            </div>

            <div className="flex flex-col mt-2 ">
              <label className="text-gray-700 mb-2 font-medium">
                Price<span className="text-red-400">*</span>
              </label>
              <div className="flex items-center border-2 border-[#F2F2F9] rounded-[8px] h-[44px] bg-[#F4F4F4]">
                <div className="h-[44px] border-e-2 border-[#DEDEDE] flex items-center">
                  <span className="px-[14px] flex items-center justify-center h-full">
                    ₹
                  </span>
                </div>

                <input
                  name="price"
                  type="string"
                  value={price}
                  className="w-full focus:outline-none ml-2  bg-[#F4F4F4]"
                  placeholder="Price"
                  readOnly
                />
              </div>
            </div>

            <div className="flex flex-col mt-2 ">
              <label className="text-gray-700 mb-2 font-medium">
                Total Price<span className="text-red-400">*</span>
              </label>
              <div className="flex items-center border-2 border-[#F2F2F9] rounded-[8px] h-[44px] bg-[#F4F4F4]">
                <div className="h-[44px] border-e-2 border-[#DEDEDE] flex items-center">
                  <span className="px-[14px] flex items-center justify-center h-full">
                    ₹
                  </span>
                </div>

                <input
                  type="string"
                  value={totalPrice}
                  className="w-full focus:outline-none ml-2  bg-[#F4F4F4]"
                  placeholder="Price"
                  readOnly
                />
              </div>
            </div>

            <div className="flex flex-col mt-2 w-full">
              <label className="text-gray-700 mb-2 font-medium">
                Upload Image<span className="text-red-400">*</span>{" "}
                <span className="text-sm font-normal">
                  (File size must be at least 500KB)
                </span>
              </label>

              <div className="flex gap-4 items-start">
                {/* File input box */}
                {product_image.length < 3 && (
                  <div className="flex items-center border border-[#F2F2F9] bg-white rounded h-[44px] overflow-hidden relative w-full max-w-xs">
                    <input
                      onChange={handleImageChange}
                      className="w-full h-full opacity-0 absolute top-0 left-0 cursor-pointer"
                      name="product_image"
                      id="product_image"
                      type="file"
                      accept="image/*"
                      disabled={product_image.length >= 3}
                      multiple
                    />

                    <div className="px-3 text-sm text-gray-500 w-full">
                      {product_image.length > 0
                        ? `${product_image.length} file(s) selected`
                        : "Browse"}
                    </div>

                    <label
                      htmlFor="product_image"
                      className="bg-[#004181] h-full px-4 rounded-[8px] text-white text-sm flex items-center justify-center cursor-pointer whitespace-nowrap"
                    >
                      Choose File
                    </label>
                  </div>
                )}

                {/* Multiple image previews */}
                {imagePreviews.length > 0 && (
                  <div className="flex gap-2  ">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="w-16 h-16 border border-[#F2F2F9] rounded-md overflow-hidden relative shrink-0"
                      >
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center bg-red-500 text-white text-xs rounded-full hover:bg-red-600 z-10"
                          type="button"
                        >
                          ×
                        </button>
                        <img
                          src={
                            preview.startsWith("blob:")
                              ? preview
                              : `${pathUrl}${preview}`
                          }
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {errors.product_image && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.product_image}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white mt-6 px-4 p-3 rounded-[16px] border border-[#F2F2F9]">
        <MakingChargesForm
          onChange={handleMakingCharge}
          initialState={formData.makingCharges}
        />
        <div className="mt-6">
          <WastageChargeForm
            onChange={handleWastageCharge}
            initialState={formData.wastageCharges}
            error={errors}
          />
        </div>

        <div className="bg-white mt-8">
          <div className="flex justify-end gap-4">
            <button
              className="bg-[#E2E8F0] text-black rounded-md p-3 w-full lg:w-20"
              type="button"
              onClick={
                isLoading ? undefined : () => naviagte("/catalog/product")
              }
            >
              Cancel
            </button>
            <button
              className="bg-[#004181] text-white rounded-md p-2 w-full lg:w-20"
              type="button"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? <SpinLoading /> : id ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
