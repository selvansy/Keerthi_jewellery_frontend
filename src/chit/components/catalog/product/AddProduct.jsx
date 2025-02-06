import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { CalendarDays, Search } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { getallmetal,productbyId,puritybymetal,getBranchById, getallbranch,createproduct, updateproduct,displayselltype,categorybymetalid,  showtype,
  schemepaymenttodayrate,
} from "../../../api/Endpoints"
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

const AddProduct = () => {
  const navigate = useNavigate();
  
  let dispatch = useDispatch();

  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_branch = roledata?.branch;
  
  const id = useSelector((state) => state.clientForm.id);
  

  const todaydate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-CA').format(todaydate);
  const [filtermetaltype, setMetaltype] = useState([]);
  const [filtercategory, setCategory] = useState([]);
  const [filterpurity, setPuritytype] = useState([]);
  const [filterdisptype, setDisptype] = useState([]);
  const [filterselltype, setSelltype] = useState([]);
  const [selectedmetal, setSelectedmetal] = useState(null);
  const [selectedpurity, setSelectedpurity] = useState(null);
  let [purityId, setPurityId] = useState("");
  const [current_rate, setCurrentrate] = useState(0);
  const [weight, setWeight] = useState(0);
  const [gst, seGst] = useState(0);
  const [metalcost, setMetalcost] = useState(0);
  const [branchList, setBranchList] = useState([]);
  const [metalid, setMetalid] = useState('')
  let [branch,setbranch] = useState("")

  const [proimage, setproductImgPath] = useState([]);
  const [formData, setFormData] = useState({
    product_name: '',
    code: '',
    weight: '',
    id_metal: '',
    id_category: '',
    id_purity : '',
    gst: '',
    metalcost: '',
    sell: '', 
    id_branch: branch,
    description: '',
    proimage: '',
    showprice: ''
  });

  const [formErrors, setFormErrors] = useState({});
  console.log("FormErrors",formErrors)

   useEffect(() => {
  
      if (metalid) {
        categoryByMetalId(metalid);
        getallpurity(metalid)
      }
    }, [metalid]);
  

    useEffect(() => {
      if (id_branch === '0') {
        getallbranchmuate()
      }

      if(id_branch !== 0){
        setFormData({ ...formData, id_branch: id_branch })
      }
      
    }, [id_branch]);


  useEffect(()=>{
    calculateproduct();
  },[current_rate,metalcost,gst,weight])



  const { mutate: getallbranchmuate } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      setBranchList(response.data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (name === "id_metal") {     
        setMetalid(value);
        setFormData({
          ...formData,
          [name]: id_metal.value,
          id_purity: ''
        });
        handlecategorybymetal(value);
        return;
    }

    if(name === "weight"){
      setWeight(value || 0);
    }
    if(name === "gst"){
      seGst(value || 0);
    }
    if(name === "metalcost"){
      setMetalcost(value || 0);
    }


    if (name === "purity") {
      const purity = filterpurity.find(
        (purity) => purity._id === value
      );
      if (purity) {
        setSelectedpurity(purity.id_purity);
      } else {
        setSelectedpurity(0);
      }
      todayrateMutate({ date_payment: formattedDate });
    }

  
   
  };

  const calculateproduct = () => {
  
   console.log("curent - ",current_rate);
   console.log("weight - ",weight);

    if(current_rate >0 && weight>0){
        let calc1 = parseFloat(current_rate) * parseFloat(weight);
     
        let calc2 = 0;
        if(parseInt(gst) >0){
          calc2 = parseInt(calc1)*parseInt(gst)/100;
          console.log(parseInt(gst));
          console.log(calc1);
          console.log(calc2);
        } 

        let subtotal = calc1+calc2;
        let totalprice =  Math.round(subtotal+parseInt(metalcost));   

        setFormData(prev => ({
          ...prev, totalprice: totalprice
        }));
      }

  };

  const { mutate: todayrateMutate } = useMutation({
    mutationFn: schemepaymenttodayrate,
    onSuccess: (response) => {
      if (response.data) {
        console.log("metal -", parseInt(selectedmetal));
        console.log("purity -", parseInt(selectedpurity));

        let metalRate = 0;
        if (parseInt(selectedmetal) === 1) { // Gold
          switch (parseInt(selectedpurity)) {
            case 1:
              metalRate = response.data.goldrate_24ct;
              break;
            case 2:
              metalRate = response.data.goldrate_22ct;
              break;
            case 3:
              metalRate = response.data.goldrate_20ct;
              break;
            case 4:
              metalRate = response.data.goldrate_18ct;
              break;
          }
        } else if (parseInt(selectedmetal) === 2) { // Silver
          metalRate = response.data.silverrate_1gm;
        } else if (parseInt(selectedmetal) === 3) { // Diamond
          metalRate = response.data.diamond_1gm;
        } else if (parseInt(selectedmetal) === 4) { // Platinum
          metalRate = response.data.platinum_1gm;
        } else if (parseInt(selectedmetal) === 5) { // Coin
          metalRate = response.data.goldcoin_1gm;
        }
        setCurrentrate(metalRate);
        setFormData(prev => ({ ...prev, current_rate: metalRate }));

      }
    },
  });


  const handlecategorybymetal = async (id_metal) => {
   
    if (!id_metal) return;
    const response = await categorybymetalid(id_metal);

    if (response) {
      setCategory(response.data);
    }
  };

  const { mutate: categoryByMetalId } = useMutation({
    mutationFn: categorybymetalid,
    onSuccess: (response) => {
      setCategory(response.data);
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });

  //mutation to get purity type
  const { mutate: getMetalData } = useMutation({
    mutationFn: getallmetal,
    onSuccess: (response) => {
      setMetaltype(response.data);
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });

   const { mutate: getPurity } = useMutation({
      mutationFn: puritybymetal,
      onSuccess: (response) => {
        console.log("filterpurity",response.data)
        setPuritytype(response.data);
      },
      onError: (error) => {
        console.error("Error fetching purity types:", error);
        setPuritytype([]);
      },
    });
  


  //mutation to get purity type
  const { mutate: getallpurity } = useMutation({
    mutationFn: puritybymetal,
    onSuccess: (response) => {
      setPuritytype(response.data);
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });

  //mutation to get sell type
  const { mutate: getdisplayselltype } = useMutation({
    mutationFn: displayselltype,
    onSuccess: (response) => {
      setSelltype(response.data);
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });
  //mutation to get display type
  const { mutate: getallshowtype } = useMutation({
    mutationFn: showtype,
    onSuccess: (response) => {
      setDisptype(response.data);
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });

  //get branches
    const { mutate: branchbyId } = useMutation({
      mutationFn: getBranchById,
      onSuccess: (response) => {
        setbranch(response.data);
      },
      onError: (error) => {
        console.error("Error:", error);
      },
    });

  //handle description image change
  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      // Add the new files to the state
      setproductImgPath((prevState) => [...prevState, ...Array.from(files)]);
    }

  };

  //handle wheel
  const handleWheel = (e) => {
    e.target.blur();
  };

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!formData.product_name) errors.product_name = "Product Name is required";
    if (!formData.id_branch) errors.id_branch = "Branch is required";
    if (!formData.code) errors.code = "Product Code is required";
    if (!formData.weight) errors.weight = "Weight is required";
    if (!formData.id_metal) errors.id_metal = "Metal is required";
    if (!formData.id_category) errors.id_category = "Category is required";
    if (!formData.id_purity) errors.id_purity = "Purity is required";
    if (!formData.current_rate) errors.current_rate = "Current Rate is required";
    if (!formData.gst) errors.gst = "Gst is required";
    if (!formData.metalcost) errors.metalcost = "Metal Cost is required";
    if (formData.sell==="") errors.sell = "Sell is required";
    if (!formData.totalprice) errors.totalprice = "Total Price is required";
    if (!formData.description) errors.description = "Description is required";
    if (!formData.showprice) errors.showprice = "Display Price is required";

    
    if (proimage.length === 0) errors.proimage = "Product Image is required";

    console.log(errors);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  //mutation to create product
  const { mutate: createproductMutate } = useMutation({
    mutationFn: createproduct,
    onSuccess: (response) => {
      toast.success(response.message)
      navigate('/catalog/product')
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    }
  });

  //handle submit
  const handleSubmit = () => {
    if (!validateForm(formData)) {
      return;
    }

    const formDataToSend = new FormData();
    console.log("FormData",formData)
    formDataToSend.append("id_branch", formData.id_branch);
    formDataToSend.append("product_name", formData.product_name);
    formDataToSend.append("code", formData.code);
    formDataToSend.append("weight", formData.weight);
    formDataToSend.append("id_metal", formData.id_metal);
    formDataToSend.append("id_category", formData.id_category);
    formDataToSend.append("id_purity", formData.id_purity);
    formDataToSend.append("gst", formData.gst);
    formDataToSend.append("metalcost", formData.metalcost);
    formDataToSend.append("sell", formData.sell);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("showprice", formData.showprice);
    if (proimage) formDataToSend.append("proimage", proimage);

   createproductMutate(formDataToSend);
  };

  useEffect(() => {
    getMetalData();
    getdisplayselltype();
    getallshowtype();
    getdisplayselltype();

    if (id) {
      
      fetchproductById(id)
      getPurity(purityId);
    }
   
  }, []);

  const handleCancle = () => {
    navigate("/catalog/product");
  };

  //Edit form --------------------------

  //get product by id
  const { mutate: fetchproductById } = useMutation({
    mutationFn: productbyId,
    onSuccess: (response) => {  

      setFormData(response.data);  
      handlecategorybymetal(response.data.id_metal);
      
      setWeight(response.data.weight  || 0);
      seGst(response.data.gst  || 0);
      setCurrentrate(response.data.current_rate || 0);
      setMetalcost(response.data.metalcost || 0);
      setSelectedmetal(response.data.id_metal);
      setSelectedpurity(response.data.id_purity); 
      setPurityId(response?.data?.id_purity)
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });

  //update product
  const { mutate: updateproductmutate } = useMutation({
    mutationFn: updateproduct,
    onSuccess: (response) => {
      toast.success(response.message);
      navigate("/catalog/product");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });



  const handleUpdate = () => {
    if (!validateForm()) return;



    const formDataToSend = new FormData();
    formDataToSend.append("id_branch", formData.id_branch);
    formDataToSend.append("product_name", formData.product_name);
    formDataToSend.append("code", formData.code);
    formDataToSend.append("weight", formData.weight);
    formDataToSend.append("id_metal", formData.id_metal);
    formDataToSend.append("id_category", formData.id_category);
    formDataToSend.append("id_purity", formData.id_purity);
    formDataToSend.append("gst", formData.gst);
    formDataToSend.append("metalcost", formData.metalcost);
    formDataToSend.append("sell", formData.sell);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("showprice", formData.showprice);
    if (proimage) formDataToSend.append("proimage", proimage);
    updateproductmutate({ id: formData._id, data: formDataToSend });
  };


  const handleRemoveImage = (index) => {
    setproductImgPath((prevState) => prevState.filter((_, i) => i !== index));
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
          {
                id_branch === 0 && (
               
                  <div className="flex flex-col lg:mt-2">
                <label className="text-black mb-1 font-medium">
                  Branch<span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="id_branch"
                    className={`appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700 ${!id_branch !== 0 ? "cursor-not-allowed bg-gray-100" : ""
                    }`}
                    defaultValue=""
                    onChange={handleInputChange}
                    value={formData.id_branch}
                  >
                    <option value=""  className="text-gray-700">
                      --Select--
                    </option>
                    {branchList.map((branch) => (
                      <option
                        className="text-gray-700"
                        key={branch._id}
                        value={branch._id}
                      >
                        {branch.branch_name}
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
                {formErrors.branch && (
                  <span className="text-red-500 text-sm mt-1">
                    {formErrors.branch}
                  </span>
                )}
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
              <option value=""  className="text-gray-700">
                    --Select--
                  </option>
                  {filtermetaltype.map((metal) => (
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
              {formErrors.id_metal && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.id_metal}
                </span>
              )}
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
           
                  className={`appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700 cursor-not-allowed bg-gray-100`}

                >
                  <option value="">--Select---</option>
                  {filtercategory?.map((category) => (
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
              {formErrors.id_category && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.id_category}
                </span>
              )}
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
                  className={`appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700 ${filterpurity.length === 0 ? "cursor-not-allowed bg-gray-100" : ""
                  }`}

                >
                 <option value=""  className="text-gray-700">
                    --Select--
                  </option>
                  {filterpurity?.map((purity) => (
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
              {formErrors.product_name && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.product_name}
                </span>
              )}
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
              {formErrors.code && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.code}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Sell Type<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  name="sell"
                  value={formData.sell}
                  onChange={handleInputChange}
                  className="appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"

                >
                  <option value="">--Select---</option>
                  {filterselltype.map((type) => (
                    <option
                      name="sell"
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
              {formErrors.sell && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.sell}
                </span>
              )}
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
                  {filterdisptype.map((type) => (
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
              {formErrors.showprice && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.showprice}
                </span>
              )}
            </div>



            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Current Rate<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  name="current_rate"
                  type="text"
                  value={formData.current_rate}
                  className='border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder="Enter Here"
                  onChange={handleInputChange}
                />
                <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center bg-[#023453] text-white rounded-r-md">INR</span>
              </div>
              {formErrors.current_rate && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.current_rate}
                </span>
              )}
            </div>
            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Weight<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  name="weight"
                  type="text"
                  value={formData.weight}
                  className='border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder="Enter Here"
                  onChange={handleInputChange}
                />
                <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center bg-[#023453] text-white rounded-r-md">INR</span>
              </div>
              {formErrors.weight && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.weight}
                </span>
              )}
            </div>
            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Gst %<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  name="gst"
                  type="text"
                  value={formData.gst}
                  className='border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder="Enter Here"
                  onChange={handleInputChange}
                />
                <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center bg-[#023453] text-white rounded-r-md">INR</span>
              </div>
              {formErrors.gst && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.gst}
                </span>
              )}
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Metal Cost(Making Charge)<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  name="metalcost"
                  type="text"
                  value={formData.metalcost}
                  className='border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder="Enter Here"
                  onChange={handleInputChange}
                />
                <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center bg-[#023453] text-white rounded-r-md">% </span>
              </div>
              {formErrors.metalcost && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.metalcost}
                </span>
              )}
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Total Price<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  name="totalprice"
                  type="text"
                  value={formData.totalprice}
                  className='border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder="Enter Here"
                  onChange={handleInputChange}
                />
                <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center bg-[#023453] text-white rounded-r-md">INR</span>
              </div>
              {formErrors.totalprice && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.totalprice}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Description<span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                type="text"
                onChange={handleInputChange}
                className="border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter Here"
              />
              {formErrors.description && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.description}
                </span>
              )}
            </div>


            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Upload Image<span className="text-red-400">*</span>
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="proimage"
                    className="flex flex-col justify-center items-center w-full h-20 border-2 border-dashed border-gray-300 text-gray-700 cursor-pointer p-5 text-center"
                  >
                    {proimage.length > 0
                      ? `${proimage.length} file(s) selected`
                      : "Browse to find or drag image(s) here"}
                  </label>
                  <input
                    onChange={handleImageChange}
                    className="hidden max-w-[190px]"
                    name="proimage"
                    id="proimage"
                    type="file"
                    accept="image/*"
                    multiple // Allow multiple files
                  />
                </div>

                {/* Display the selected images */}
                {proimage.length > 0 && (
                  <div className="flex gap-4 flex-wrap">
                    {proimage.map((file, index) => (
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
                              ? file
                              : URL.createObjectURL(file) // Use URL.createObjectURL to preview image
                          }
                          alt="Description image preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {formErrors.proimage && (
                <span className="text-red-500 text-sm mt-1">{formErrors.proimage}</span>
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
                className="bg-[#61A375] text-white rounded-md p-2 w-full lg:w-20"
                type="button"
                onClick={id ? handleUpdate : handleSubmit}
              >
                {id ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;