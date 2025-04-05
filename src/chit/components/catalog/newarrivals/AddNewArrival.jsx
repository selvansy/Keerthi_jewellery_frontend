import React, { useEffect, useState } from "react";
import { customSelectStyles } from "../../Setup/purity";
import { useSelector } from "react-redux";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  createnewarrivals,
  getAllBranch,
  getbranchbyid,
  getNewArrivalsById,
  getProductByBranch,
  updatenewarrivals,
} from "../../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Loading from "../../common/Loading";
import SpinLoading from "../../common/spinLoading";
import { useNavigate, useParams } from "react-router-dom";

function AddNewArrival() {
  const { id } = useParams();
  const roleData = useSelector((state) => state.clientForm.roledata);
  const accessBranch = roleData?.branch;

  // State for date pickers
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [branch, setBranch] = useState(() => (accessBranch === "0" ? [] : {}));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    id_product: "",
    id_branch: "",
    start_date: new Date(),
    end_date: null,
    description: "",
  });
  useEffect(() => {
    if (!roleData) return;
    if (id) {
      setLoading(true);
      getNewArrivalById(id);
      // If there's an existing image, set it for preview
    }
    if (accessBranch !== "0") {
      getBranchData({ id: accessBranch });
      getAllProduct(accessBranch);
    } else if (accessBranch == "0") {
      getAllBranches();
    }
  }, [roleData]);

  // Add another useEffect to handle setting the image preview when formData changes
  useEffect(() => {
    if (formData && formData.new_arrivals_img) {
      setPreviewUrl(formData.new_arrivals_img);
    }
  }, [formData]);

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

  // get product by BranchId
  const { mutate: getAllProduct } = useMutation({
    mutationFn: (id) => getProductByBranch(id),
    onSuccess: (response) => {
      setProducts(
        response.data.map((product) => ({
          value: product._id,
          label: product.product_name,
        }))
      );
    },
    onError: (error) => {
      console.error("Error fetching Product:", error);
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

  //mutation to addNewArrivals
  const { mutate: addNewArrivals } = useMutation({
    mutationFn: (data) => createnewarrivals(data),
    onSuccess: (response) => {
      setButtonLoading(false);
      toast.success(response.message);
      navigate("/catalog/newarrivals");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
      toast.error(error.response.data);
      setButtonLoading(false);
      console.error("Error fetching branches:", error);
    },
  });
  //mutation to get editNewArrivals
  const { mutate: editNewArrivals } = useMutation({
    mutationFn: ({ id, data }) => updatenewarrivals(id, data),
    onSuccess: (response) => {
      setButtonLoading(false);
      toast.success(response.message);
      navigate("/catalog/newarrivals");
    },
    onError: (error) => {
      setButtonLoading(false);
      toast.error(error.response.data.message);
      console.error("Error fetching branches:", error);
    },
  });

  const { mutate: getNewArrivalById } = useMutation({
    mutationFn: (id) => getNewArrivalsById(id),
    onSuccess: (response) => {
      setLoading(false);
      const data = response.data;
      setFormData(data);
      // Handle the image preview for existing record
      if (data.images_Url && data.images_Url.length > 0 && data.pathurl) {
        const fullImageUrl = `${data.pathurl}${data.images_Url[0]}`;
        setSelectedImage(data.images_Url[0]);
        setPreviewUrl(fullImageUrl);
      }

      // Handle branch selection
      if (accessBranch === "0") {
        setBranch((prevBranches) => {
          const exists = prevBranches.some((b) => b.value === data.id_branch);
          if (!exists) {
            return [
              ...prevBranches,
              {
                value: data.id_branch,
                label: data.branch_name,
              },
            ];
          }
          return prevBranches;
        });
      }

      // Get products for the selected branch
      getAllProduct(data.id_branch);

      // Handle product selection
      setProducts((prevProducts) => {
        const exists = prevProducts.some((p) => p.value === data.id_product);
        if (!exists) {
          return [
            ...prevProducts,
            {
              value: data.id_product,
              label: data.product_name,
            },
          ];
        }
        return prevProducts;
      });
    },
    onError: (error) => {
      setLoading(false);
      console.error("Error fetching new arrivals:", error);
    },
  });

  // Image selection handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, JPEG, PNG, or WEBP files are allowed.");
        return;
      }

      if (file.size > 500 * 1024) {
        toast.error("Image size should be less than 500 KB.");
        return;
      }

      setSelectedImage(file);

      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleBranchChange = (selectedOption) => {
    setProducts([]);
    setFormData((prev) => ({
      ...prev,
      id_branch: selectedOption.value,
    }));
    getAllProduct(selectedOption.value);
  };

  const validator = () => {};

  const hanldeSubmit = () => {
    setButtonLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("title",formData.title)
    formDataToSend.append("id_product", formData.id_product);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("id_branch", formData.id_branch);
    formDataToSend.append("start_date", formData.start_date);
    formDataToSend.append("end_date", formData.end_date);
    if (selectedImage) {
      if (selectedImage instanceof File) {
        formDataToSend.append("new_arrivals_img", selectedImage);
      } else if (typeof selectedImage === "string") {
        formDataToSend.append("new_arrivals_img", selectedImage);
      }
    }

    if (id) {
      editNewArrivals({ id, data: formDataToSend });
    } else {
      addNewArrivals(formDataToSend);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex flex-row justify-between">
            {id ? (
              <h2 className="text-2xl text-[#023453] font-bold justify-between">
                Edit newarrivals
              </h2>
            ) : (
              <h2 className="text-2xl text-[#023453] font-bold justify-between">
                Create newarrivals
              </h2>
            )}
          </div>

          <div className="w-full flex flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]">
            <div className="flex flex-col p-4 bg-white relative">
              <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300 mb-5">
                {accessBranch == "0" ? (
                  <div>
                    <label className="block text-sm font-medium mb-1 mt-5">
                      Branches <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={Array.isArray(branch) ? branch : [branch]} // Ensures 'branch' is treated as an array
                      styles={customSelectStyles}
                      placeholder="Select Branch"
                      onChange={handleBranchChange}
                      value={
                        Array.isArray(branch)
                          ? branch.find((b) => b.value === formData.id_branch)
                          : { value: branch._id, label: branch.branch_name } // Handle single branch object case
                      }
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm text-gray-500 font-medium mb-1 mt-5">
                      Branch <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={branch.branch_name}
                      disabled
                      className="w-full border rounded-md px-3 py-2 text-gray-500"
                    />
                  </div>
                )}
                <div className="flex flex-col mt-2">
                  <label className="text-gray-700 mb-2 font-medium">
                    Title<span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    className="border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Title"
                    onChange={(e)=>{
                      setFormData((prev)=>({
                        ...prev,
                        title:e.target.value
                      }))
                    }}
                  />
                  <span className="text-red-500 text-sm mt-1">
                    {/* {errors.product_name} */}
                  </span>
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-700 mb-2 mt-2 font-medium">
                    Product<span className="text-red-400">*</span>
                  </label>
                  <Select
                    options={products}
                    styles={customSelectStyles}
                    placeholder="Select Product"
                    onChange={(data) => {
                      setFormData((prev) => ({
                        ...prev,
                        id_product: data.value,
                      }));
                    }}
                    value={products.find(
                      (p) => p.value === formData.id_product
                    )} // Show existing product
                  />
                </div>

                {/* Date Range Section */}
                <div className="flex flex-col">
                  <label className="text-gray-700 mb-2 mt-2 font-medium">
                    Start Date<span className="text-red-400">*</span>
                  </label>
                  <DatePicker
                    minDate={new Date()}
                    selected={formData.start_date}
                    onChange={(date) => {
                      setFormData((prev) => ({
                        ...prev,
                        start_date: date,
                      }));
                    }}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholderText="Select start date"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-700 mb-2 mt-2 font-medium">
                    End Date<span className="text-red-400">*</span>
                  </label>
                  <DatePicker
                    selected={formData.end_date}
                    onChange={(date) => {
                      setFormData((prev) => ({
                        ...prev,
                        end_date: date,
                      }));
                    }}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholderText="Select end date"
                    dateFormat="yyyy-MM-dd"
                    minDate={formData.start_date}
                  />
                </div>

                <div className="flex flex-col mt-2">
                  <label className="text-gray-700 mb-2 font-medium">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    name="description"
                    value={formData.description}
                    className="border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent h-[70px] min-h-[70px] max-h-[120px]"
                    placeholder="Description"
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }));
                    }}
                  ></textarea>
                </div>

                {/* Image Upload Section */}
                {!selectedImage && (
                  <div className="flex flex-col mt-2">
                    <label className="text-gray-700 mb-2 font-medium">
                      Image <span className="text-red-400">*</span>
                    </label>

                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                      <input
                        type="file"
                        id="productImage"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <label
                        htmlFor="productImage"
                        className="cursor-pointer flex flex-col items-center justify-center"
                      >
                        <>
                          <p className="text-sm text-gray-500">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            PNG, JPG, GIF up to 500 KB
                          </p>
                        </>
                      </label>
                    </div>
                  </div>
                )}
                {/* Image Preview Section */}
                {previewUrl && (
                  <div className="mt-2 border rounded-md p-3">
                    <h3 className="text-gray-700 font-medium mb-2">
                      Image Preview
                    </h3>
                    <div className="relative w-full">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedImage(null);
                          setPreviewUrl(null);
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-48 max-w-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white mt-8">
                <div className="flex justify-end gap-4">
                  <button
                    className="bg-[#E2E8F0] text-black rounded-md p-3 w-full lg:w-20"
                    type="button"
                    disabled={loading}
                    onClick={()=>navigate('/catalog/newarrivals')}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-[#61A375] text-white rounded-md p-2 w-full lg:w-20"
                    type="button"
                    disabled={buttonLoading}
                    onClick={hanldeSubmit}
                  >
                    {buttonLoading ? <SpinLoading /> : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AddNewArrival;
