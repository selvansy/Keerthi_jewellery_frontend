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
  displayselltype,
  categorybymetalid,
  showtype,
  todaycurrentratebybranch,
} from "../../../api/Endpoints";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import SpinLoading from "../../common/SpinLoading";

const AddProduct = () => {
  const id = null;
  const roledata = useSelector((state) => state.clientForm.roledata);
  const branchAccess = roledata?.branch;
  const [metalData, setMetalData] = useState([]);
  const [categoryByMetal, setcategoryByMetal] = useState([]);
  const [currentRate,setCurrentrate]=useState()
  const [purityData, setPurityData] = useState([]);
  const [priceType,setPriceType] = useState([])
  const [formData, setFormData] = useState({
    product_name: "",
    code: "",
    weight: "",
    id_metal: "",
    id_category: "",
    id_purity: "",
    gst: "",
    metalcost: "",
    id_branch: "",
    description: "",
    product_image: "",
    showprice: "",
  });

  useEffect(() => {
    getMetalData();
    getallshowtype()
  }, []);

  //mutation for get all metal
  const { mutate: getMetalData } = useMutation({
    mutationFn: getallmetal,
    onSuccess: (response) => {
      setMetalData(response.data);
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });

  // mutation get category by metal
  const { mutate: categoryByMetalId } = useMutation({
    mutationFn: categorybymetalid,
    onSuccess: (response) => {
      setcategoryByMetal(response.data);
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });

  // mutation for get purity by Metal
  const { mutate: getPurityByMetal } = useMutation({
    mutationFn: puritybymetal,
    onSuccess: (response) => {
      setPurityData(response.data);
    },
    onError: (error) => {
      console.error("Error fetching purity types:", error);
      setPurityData([]);
    },
  });

  //mutation to get display type
  const { mutate: getallshowtype } = useMutation({
    mutationFn: showtype,
    onSuccess: (response) => {
      setPriceType(response.data);
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });

  // mutation for get metalRate
  const { mutate: todayrateMutate } = useMutation({
    mutationFn: todaycurrentratebybranch,
    onSuccess: (response) => { 
      
     try{
      if (response.data) {
        let metalRate = 0;        
        const metal =  parseInt(formData.id_metal)
        const purity = parseInt(formData.id_purity);        
        if (metal === 1) {
          // Gold
          switch (purity) {
            case 1:
              metalRate = response.data.goldrate_24ct?.$numberDecimal || 0;
              break;
            case 2:
              metalRate = response.data.goldrate_22ct?.$numberDecimal || 0;
              break;
            case 3:
              metalRate = response.data.goldrate_20ct?.$numberDecimal || 0;
              break;
            case 4:
              metalRate = response.data.goldrate_18ct?.$numberDecimal || 0;
              break;
            default:
              console.warn("Unexpected gold purity value:", purity);
          }
        } else {
          // Other metals
          switch (metal) {
            case 2:
              metalRate = response.data.silverrate_1gm?.$numberDecimal || 0;
              break;
            case 3:
              metalRate = response.data.diamond_1gm?.$numberDecimal || 0;
              break;
            case 4:
              metalRate = response.data.platinum_1gm?.$numberDecimal || 0;
              break;
            case 5:
              metalRate = response.data.goldcoin_1gm?.$numberDecimal || 0;
              break;
            default:
              console.warn("Unexpected metal value:", metal);
          }
        }
        setCurrentrate(metalRate);
      }
     }catch(err){
      console.log(err);
      
     }
    },
  });
  


  // handle onChange input field
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name == "id_metal") {
      setcategoryByMetal([]);
      setPurityData([]);
      categoryByMetalId(value);
      getPurityByMetal(value);
    }

    if(name=="id_purity"){
      console.log('change')
      const branchId=branchAccess==0?formData.id_branch:branchAccess
      const todayDate=new Date()
      todayrateMutate({branchId,date:todayDate})
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
            {branchAccess === "0" && (
              <div className="flex flex-col lg:mt-2">
                <label className="text-black mb-1 font-medium">
                  Branch<span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="id_branch"
                    // className={`appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700 ${
                    //   !id_branch !== "0" ? "cursor-not-allowed bg-gray-100" : ""
                    // }`}
                    defaultValue=""
                    // onChange={handleInputChange}
                    // value={formData.id_branch}
                  >
                    <option value="" className="text-gray-700">
                      --Select--
                    </option>
                    {/* {branchList.map((branch) => ( */}
                    {/* <option
                        className="text-gray-700"
                        key={branch._id}
                        value={branch._id}
                      >
                        {branch.branch_name}
                      </option> */}
                    {/* ))} */}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="black"
                    >
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                {/* {formErrors.branch && (
                  <span className="text-red-500 text-sm mt-1">
                    {formErrors.branch}
                  </span>
                )} */}
              </div>
            )}

            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Metal Type<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  name="id_metal"
                  value={formData.id_metal}
                  onChange={handleInputChange}
                  className="appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="" className="text-gray-700">
                    --Select--
                  </option>
                  {metalData.map((metal) => (
                    <option key={metal.id_metal} value={metal.id_metal}>
                      {metal.metal_name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="black"
                  >
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {/* {formErrors.id_metal && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.id_metal}
                </span>
              )} */}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Category<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  name="id_category"
                  value={formData.id_category}
                  onChange={handleInputChange}
                  className={`appearance-none border-2 border-gray-300 rounded-md p-2 w-full pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700 cursor-not-allowed bg-gray-100`}
                >
                  <option value="">--Select---</option>
                  {categoryByMetal?.map((category) => (
                    <option
                      name="id_category"
                      className="text-gray-700"
                      key={category._id}
                      value={category._id}
                    >
                      {category.category_name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="black"
                  >
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {/* {formErrors.id_category && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.id_category}
                </span>
              )} */}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Purity<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  name="id_purity"
                  value={formData.id_purity}
                  defaultValue=""
                  onChange={handleInputChange}
                  className={`appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700 ${
                    purityData.length === 0
                      ? "cursor-not-allowed bg-gray-100"
                      : ""
                  }`}
                >
                  <option value="" className="text-gray-700">
                    --Select--
                  </option>
                  {purityData?.map((purity) => (
                    <option key={purity.id_purity} value={purity.id_purity}>
                      {purity.purity_name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="black"
                  >
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
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
              {/* {formErrors.product_name && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.product_name}
                </span>
              )} */}
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Product Code<span className="text-red-400">*</span>
              </label>
              <input
                name="code"
                type="text"
                value={formData.code}
                className="border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter Here"
                onChange={handleInputChange}
              />
              {/* {formErrors.code && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.code}
                </span>
              )} */}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Display Price<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  name="showprice"
                  value={formData.showprice}
                  onChange={handleInputChange}
                  className="appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">--Select---</option>
                  {priceType.map((type) => (
                    <option
                      name="showprice"
                      className="text-gray-700"
                      key={type.id}
                      value={type.id}
                    >
                      {type.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="black"
                  >
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {/* {formErrors.showprice && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.showprice}
                </span>
              )} */}
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Current Rate<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  readOnly
                  name="current_rate"
                  type="text"
                  value={currentRate}
                  className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter Here"
                  // onChange={handleInputChange}
                />
                <span
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  // style={{ backgroundColor: layout_color }}
                >
                  INR
                </span>
              </div>
              {/* {formErrors.current_rate && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.current_rate}
                </span>
              )} */}
            </div>
            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Weight<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  name="weight"
                  type="number"
                  // value={formData.weight}
                  className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter Here"
                  // onChange={handleInputChange}
                  onWheel={(e) => e.target.blur()}
                />
                <span
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  // style={{ backgroundColor: layout_color }}
                >
                  GRM
                </span>
              </div>
              {/* {formErrors.weight && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.weight}
                </span>
              )} */}
            </div>
            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Gst %<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  name="gst"
                  type="number"
                  // value={formData.gst}
                  className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter Here"
                  // onChange={handleInputChange}
                  onWheel={(e) => e.target.blur()}
                />
                <span
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  // style={{ backgroundColor: layout_color }}
                >
                  INR
                </span>
              </div>
              {/* {formErrors.gst && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.gst}
                </span>
              )} */}
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Metal Cost(Making Charge)<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  name="metalcost"
                  type="number"
                  // value={formData.metalcost}
                  className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter Here"
                  // onChange={handleInputChange}
                  onWheel={(e) => e.target.blur()}
                />
                <span
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  // style={{ backgroundColor: layout_color }}
                >
                  %
                </span>
              </div>
              {/* {formErrors.metalcost && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.metalcost}
                </span>
              )} */}
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Total Price<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  readOnly
                  name="totalprice"
                  type="text"
                  // value={formData.totalprice}
                  className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter Here"
                  // onChange={handleInputChange}
                  onWheel={(e) => e.target.blur()}
                />
                <span
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  // style={{ backgroundColor: layout_color }}
                >
                  INR
                </span>
              </div>
              {/* {formErrors.totalprice && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.totalprice}
                </span>
              )} */}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Description<span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                // value={formData.description}
                type="text"
                // onChange={handleInputChange}
                className="border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter Here"
              />
              {/* {formErrors.description && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.description}
                </span>
              )} */}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Upload Image<span className="text-red-400">*</span>
              </label>
              {/* <div className="flex gap-4">
                {product_image.length < 3 && (
                  <div className="flex-1">
                    <label
                      htmlFor="product_image"
                      className="flex flex-col justify-center items-center w-full h-20 border-2 border-dashed border-gray-300 text-gray-700 cursor-pointer p-5 text-center"
                    >
                      {product_image.length > 0
                        ? `${product_image.length} file(s) selected`
                        : "Browse to find or drag image(s) here"}
                    </label>
                    <input
                      onChange={handleImageChange}
                      className="hidden max-w-[190px]"
                      name="product_image"
                      id="product_image"
                      type="file"
                      accept="image/*"
                      multiple
                    />
                  </div>
                )}

                {/* Display the selected images */}
              {/* {product_image.length > 0 && (
                  <div className="flex gap-4 flex-wrap">
                    {product_image.map((file, index) => (
                      <div
                        key={index}
                        className="w-20 h-20 border border-gray-300 rounded-md overflow-hidden relative"
                      >
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
                          type="button"
                        >
                          ×
                        </button>
                        <img
                          src={
                            typeof file === "string"
                              ? `${formData.pathurl}${file}`
                              : URL.createObjectURL(file)
                          }
                          alt="Description image preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )} */}
            </div>
            {/* {formErrors.product_image && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.product_image}
                </span>
              )} */}
            {/* </div> */}
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
