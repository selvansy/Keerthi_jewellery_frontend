import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { CalendarDays, Search } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { setid } from "../../../../redux/clientFormSlice";
import {
  getallmetal,
  productbyId,
  puritybymetal,
  getBranchById,
  getallbranch,
  createproduct,
  updateproduct,
  categorybymetalid,
  showtype,
  todaycurrentratebybranch,
  getbranchbyid,
  getAllBranch,
} from "../../../api/Endpoints";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import SpinLoading from "../../common/spinLoading";
import { customSelectStyles } from "../../Setup/purity";
import Select from "react-select";
const AddProduct = () => {
  const roleData = useSelector((state) => state.clientForm.roledata);
  const accessBranch = roleData?.branch;
  const [branch, setBranch] = useState(() => (accessBranch === "0" ? [] : {}));
  const [metals, setMetals] = useState([]);
  const [category, setCategory] = useState([]);
  const [purity, setPurity] = useState([]);
  const [formData, setFormData] = useState({
    product_name: "",
    id_category: "",
    description: "",
    code: "",
    id_metal: "",
    weight: "",
    id_purity: "",
    metalcost: "",
    gst: "",
    showprice: "",
  });
  const id = "";

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
  }, []);

// getting category data and fetching purityBy metal
  useEffect(() => {
    if (formData.id_metal) {
      getCategory(formData.id_metal);
      getPurityByMetal(formData.id_purity)
    }
    setFormData((prev) => ({
      ...prev,
      id_category: "",
    }));
  }, [formData.id_metal]);

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
          value: metal.id_metal,
          label: metal.metal_name,
        }))
      );
    },
    onError: (error) => {
      console.error("Error fetching branches:", error);
    },
  });
  const { mutate: getPurityByMetal } = useMutation({
    mutationFn: (id) =>puritybymetal (id),
    onSuccess: (response) => {
      setPurity(
        response.data.map((purity) => ({
          value: purity._id,
          label: purity.purity_name,
        }))
      );
    },
    onError: (error) => {
      console.error("Error fetching branches:", error);
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
      console.error("Error fetching branches:", error);
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
    },
    onError: (error) => {
      console.error("Error fetching branches:", error);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const hanlde = () => {
    console.log(formData);
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        {id ? (
          <h2 className="text-2xl text-[#023453] font-bold justify-between">
            Edit product
          </h2>
        ) : (
          <h2 className="text-2xl text-[#023453] font-bold justify-between">
            Create product
          </h2>
        )}
      </div>
      <div className="w-full flex flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]">
        <div className="flex flex-col p-4 bg-white relative">
          <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300 mb-10">
            {accessBranch == "0" ? (
              <div>
                <label className="block text-sm font-medium mb-1 mt-5">
                  Branches <span className="text-red-500">*</span>
                </label>
                <Select
                  styles={customSelectStyles}
                  options={branch || []}
                  placeholder="Select Branch"
                  // value={branch || [].find(
                  //   (option) => option.value === formik.values.id_branch
                  // )}
                  // onChange={(option) => formik.setFieldValue("id_branch", option.value || "")}
                />
                {/* {formik.errors.id_branch && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.id_branch}
                </div>
              )} */}
              </div>
            ) : (
              <div>
                <label className="block text-sm text-gray-500 font-medium mb-1 mt-5">
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
                styles={customSelectStyles}
                options={metals}
                placeholder="Select Metal"
                value={metals.find(
                  (option) => option.value === formData.id_metal
                )}
                onChange={(option) =>
                  setFormData((prev) => ({
                    ...prev,
                    id_metal: option.value,
                    id_category: "",
                  }))
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Category<span className="text-red-400">*</span>
              </label>
              <Select
                styles={customSelectStyles}
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
            </div>


            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                purity<span className="text-red-400">*</span>
              </label>
              <Select
                styles={customSelectStyles}
                options={purity}
                placeholder={
                  purity.length > 0
                    ? "Select purity"
                    : "No purities available"
                }
                value={
                  purity.find(
                    (option) => option.value === formData.id_purity
                  ) || null
                }
                onChange={(option) =>
                  setFormData((prev) => ({
                    ...prev,
                    id_purity: option ? option.value : "",
                  }))
                }
                isDisabled={purity.length <= 0}
                noOptionsMessage={() =>
                  "No purities available for this metal"
                }
              />
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Product Name<span className="text-red-400">*</span>
              </label>
              <input
                name="product_name"
                type="text"
                value={formData.product_name}
                className="border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter Here"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="bg-white">
            <div className="flex justify-end gap-4">
              <button
                className="bg-[#E2E8F0] text-black rounded-md p-3 w-full lg:w-20"
                type="button"
                // onClick={isLoading?undefined:handleCancle}
              >
                Cancel
              </button>
              <button
                className="bg-[#61A375] text-white rounded-md p-2 w-full lg:w-20"
                type="button"
                onClick={hanlde}
                // onClick={isLoading?undefined:id ? handleUpdate : handleSubmit}
              >
                {/* {isLoading?
              <SpinLoading/>:
              id ? "Update" : "Submit"
              } */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
