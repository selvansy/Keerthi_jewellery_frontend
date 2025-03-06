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
  getMetalRateByMetalId,
} from "../../../api/Endpoints";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import SpinLoading from "../../common/spinLoading";
import { customSelectStyles } from "../../Setup/purity";
import Select from "react-select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../../../components/ui/accordion";
import MakingChargesForm from "./makingCharge";
const AddProduct = () => {
  const roleData = useSelector((state) => state.clientForm.roledata);
  const accessBranch = roleData?.branch;
  const [branch, setBranch] = useState(() => (accessBranch === "0" ? [] : {}));
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const [metals, setMetals] = useState([]);
  const [category, setCategory] = useState([]);
  const [currentRate,setCurrentRate]=useState('0')
  const [purity, setPurity] = useState([]);
  const [formData, setFormData] = useState({
    product_name: "",
    product_code: "",
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

  useEffect(()=>{
    if(formData.id_purity){
      getTodayMetalRate({id_metal:formData.id_metal,id_purity:formData.id_purity,date:"2025-03-05T05:24:36.465Z"})
    }
  },[formData.id_purity])


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

  const { mutate: getTodayMetalRate } = useMutation({
    mutationFn: (data) => getMetalRateByMetalId(data),
    onSuccess: (response) => {
      const {data}=response
      setCurrentRate(data.rate)

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

    if (name === "gst" && !/^\d{0,2}$/.test(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleRate = () => {
   
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
          <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300 mb-5">
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
                onChange={(option) =>{
                  setFormData((prev) => ({
                    ...prev,
                    id_metal: option.value,
                    id_category: "",
                  }))
                  setCurrentRate('0')
                }
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
                  purity.length > 0 ? "Select purity" : "No purities available"
                }
                value={
                  purity.find(
                    (option) => option.value === formData.id_purity
                  ) || null
                }
                onChange={(option) =>{
                  setFormData((prev) => ({
                    ...prev,
                    id_purity: option ? option.value : "",
                  }))
                 handleRate()
                }}
                isDisabled={purity.length <= 0}
                noOptionsMessage={() => "No purities available for this metal"}
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
                placeholder="Enter Product Name"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Product Code <span className="text-red-400">*</span>
              </label>
              <input
                name="product_code"
                type="text"
                value={formData.product_code}
                className="border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter Product Code"
                onChange={handleInputChange}
              />
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
                class="border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent h-[70px] min-h-[70px] max-h-[120px]"
                placeholder="Write your thoughts here..."
              ></textarea>
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
                  className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter Here"
                  onChange={handleInputChange}
                  onWheel={(e) => e.target.blur()}
                />
                <span
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}
                >
                  INR
                </span>
              </div>
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Current Metal Rate<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  name="metalrate"
                  type="string"
                  value={currentRate}
                  className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none  bg-[#ebebeb]"
                  placeholder="Current Metal Rate"
                  readOnly
                />
                <span
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}
                >
                  INR
                </span>
              </div>
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Weight<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  name="weight"
                  type="string"
                  value={formData.weight}
                  className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter Here"
                  onChange={handleInputChange}
                  onWheel={(e) => e.target.blur()}
                />
                <span
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}
                >
                  INR
                </span>
              </div>
            </div>
          </div>

          <Accordion type="multiple" collapsible className="space-y-4">
        <AccordionItem value="grace" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4">
          Charges
          </AccordionTrigger>
          <AccordionContent value="Charges" className="px-6 py-4">
           <MakingChargesForm/>
          </AccordionContent>
        </AccordionItem>
        </Accordion>

      
        </div>
      </div>
    </>
  );
};

export default AddProduct;
