import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getallSchemes, getallbranch, getcustomerByBranchId, addPromotions, getallCampaign  } from "../../../api/Endpoints";
import Select from "react-select";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";
import SpinLoading from "../../common/spinLoading";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";

const customStyles = (isReadOnly) => ({
    control: (base, state) => ({
      ...base,
      minHeight: "42px",
      backgroundColor: "white",
      border: state.isFocused ? "1px solid black" : "2px solid #f2f3f8",
      boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
      borderRadius: "0.375rem",
      "&:hover": {
        color: "#e2e8f0",
      },
      pointerEvents: !isReadOnly ? "none" : "auto",
      opacity: !isReadOnly ? 1 : 1,
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#858293",
      fontWeight: "thin",
      // fontStyle: "bold",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: "#232323",
      "&:hover": {
        color: "#232323",
      },
    }),
  });

function AddPromotion() {

    const [formData, setFormData] = useState({
        title: "",
        body: "",
        id_branch: [],
        id_scheme: [],
        customer_id: [],
        noti_image: "",
        pushNotification: true,
        sms: false,
        whatsapp: false,
        email: false,
        isHtml: false
    });

    const navigate = useNavigate();

    const fileInputRef = useRef(null);
    const [branchData, setBranchData] = useState([]);
    const [schemeData, setSchemeData] = useState([]);
    const [cusData, setCusData] = useState([]);
    const [campaignData, setCampaignData] = useState([])
    const [image,setImage] = useState("")
     const [imagePreviews, setImagePreviews] = useState({
            image: null,
        });
    

    const [pathurl, setPathurl] = useState(null);
    const [isLoading, setisLoading] = useState("")


    const layout_color = useSelector((state) => state.clientForm.layoutColor);
    const roledata = useSelector((state) => state.clientForm.roledata);
    const id_branch = roledata?.branch;
    const branch = roledata?.id_branch;


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

    const branchId = branch || formData.id_branch;
    const { data: customerResponse, isLoading: loadingCustomer } = useQuery({
        queryKey: ["customer", branchId],
        queryFn: () => getcustomerByBranchId(branchId),
        enabled: !!branchId,
    });


    useEffect(() => {
        if (branchResponse) {
            setBranchData(branchResponse.data.map((branch) => ({
                value: branch._id,
                label: branch.branch_name,
            })));
        }


        if (schemeResponse) {
            setSchemeData(schemeResponse.data.map((scheme) => ({
                value: scheme._id,
                label: scheme.scheme_name,
            })));
        }

        if (customerResponse) {
            setCusData(customerResponse.customers.map((cus) => ({
                value: cus._id,
                label: `${cus.firstname} ${cus.lastname} (${cus.mobile})`,
            })));
        }

        if (campaignResponse) {
            setCampaignData(campaignResponse.data.map((campaign) => ({
                value: campaign._id,
                label: campaign.name,
            })));
        }

        

    }, [branchResponse, schemeResponse, customerResponse, campaignResponse]);



    const handleChange = (e) => {

        const { name, value } = e.target;

        if (name === "noti_image") {

            setFormData(prev => ({
                ...prev,
                noti_image: value
            }))

            setPathurl(value);

        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }


    const handleSelectChange = (selectedOptions, allOptions, setFormData, fieldName) => {
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
            [field]: null,
        }));
        setImage("")

        // setFormData((prev) => ({ ...prev, noti_image: "" }));
        // setPathurl(null);
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
                            
                            setImage(file.name)
                            setPathurl(previewUrl);
    
                // setFormData((prev) => ({ ...prev, noti_image: file.name }));
               
    
            } else {
                toast.error(`File size exceeded, upload max-size(500KB) or file not found`);
    
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

    
        // Object.entries(formData).forEach(([key, value]) => {
        //     if (value) formPayload.append(key, value);
        // });

        if (image) formPayload.append("image", image);

        addcustomerMutate(formPayload);
    };


    const handleClear = () => {

        handleClearImage()
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
            noti_image: ""
        });

    }



    const { mutate: addcustomerMutate } = useMutation({
        mutationFn: (data) => addPromotions(data),
        onSuccess: (response) => {

            if (response) {
                toast.success(response.message);
            }
            setisLoading(false)
            navigate("/schemereport/promosummary/")
        },
        onError: (error) => {
            setisLoading(false)
            toast.error(error.response.data.message)
            console.error('Error:', error);
        }
    });

 
    const handleCheckboxChange = (field) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: !prevData[field],
        }));
    }


    return (
        <>
        <div className="flex flex-row justify-start items-center w-full sm:order-1 sm:w-auto sm:mr-auto md:order-1 md:w-auto md:mr-auto ">
                <div className="w-1/2 sm:w-auto mt-2">
                    <Breadcrumb items={[{ label: "Promotions " }, { label: "Promotions Creation", active: true }]} />
                </div>
            </div>
        <div className="bg-[#FFFFFF] rounded-lg p-6 shadow-sm border">
        <h2 className="text-lg font-semibold mb-4 border-b pb-4">Add Promotions</h2>

        {/* Notification Options */}
        <div className="flex gap-4 mb-4">
                    {[
                        { label: "Push Notification", field: "pushNotification" },
                        { label: "SMS", field: "sms" },
                        { label: "WhatsApp", field: "whatsapp" },
                        // { label: "Email", field: "email" },
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

                    <MultiSelect
                        name="id_branch"
                        options={[{ value: "select_all", label: "Select All" }, ...branchData]}
                        value={branchData.filter((s) => formData.id_branch.includes(s.value))}
                        onChange={(selectedOptions) => {
                            handleSelectChange(selectedOptions, branchData, setFormData, "id_branch")
                        }}
                        isLoading={loadingBranch}
                        labelledBy="Select Branch"
                        hasSelectAll={false}
                    />

                </div>

                {/* Scheme Selection */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">
                        Scheme <span className="text-red-400">*</span>
                    </label>

                    <MultiSelect
                        name="id_scheme"
                        options={[{ value: "select_all", label: "Select All" }, ...schemeData]}
                        value={schemeData.filter((s) => formData.id_scheme.includes(s.value))}
                        onChange={(selectedOptions) => {
                            handleSelectChange(selectedOptions, schemeData, setFormData, "id_scheme")
                        }}
                        isLoading={loadingSchemes}
                        labelledBy="Select Scheme"
                        hasSelectAll={false}
                    />

                </div>


                <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">
                        Customer <span className="text-red-400">*</span>
                    </label>
                    <MultiSelect
                        name="customer_id"
                        options={[{ value: "select_all", label: "Select All" }, ...cusData]}
                        value={cusData.filter((s) => formData.customer_id.includes(s.value))}
                        onChange={(selectedOptions) => {
                            handleSelectChange(selectedOptions, cusData, setFormData, "customer_id")
                        }}
                        isLoading={loadingCustomer}
                        labelledBy="Select Customers"
                        hasSelectAll={false}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="font-medium text-gray-700">
                        Title <span className="text-red-400">*</span>
                    </label>
                    <Select
                        styles={customStyles(true)}
                        isClearable={true}
                        options={campaignData}
                        className=" py-2 rounded-md "
                        placeholder="Select title"
                        value={campaignData.find(
                            (option) => option.label === formData.title
                        ) || null}
                        isLoading={loadingCampaign}
                        onChange={(option) => {
                            setFormData((prev) => ({
                                ...prev,
                                title: option.label,
                            }));
                        }}
                    />

                </div> 


                {/* Content */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">Content <span className="text-red-400">*</span></label>
                    <textarea name="body" className="w-full h-10 border-2 border-[#f2f3f8] rounded-md px-3 text-gray-500" placeholder="Enter content" onChange={handleChange}></textarea>
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
                            className={`cursor-pointer border p-2 pr-24 rounded-md text-gray-400 w-full `}
                            placeholder="No file chosen"
                            value={imagePreviews ? image : ""}
                            readOnly
                            onClick={() => {
                                if (!(imagePreviews && pathurl)) {
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
                            className={` cursor-pointer border p-2 pr-24 rounded-md text-gray-400 w-full hidden`}
                        />
                        <div
                            className={`cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-white px-3 py-2 rounded-md  text-sm`}
                            onClick={() => {
                                if (!(imagePreviews && pathurl)) {
                                    fileInputRef.current.value = null;
                                    fileInputRef.current.click();
                                }
                            }}
                            style={{backgroundColor:layout_color}}
                        >
                            Choose File
                        </div>
                    </div>
                </div>
        </div>

         {/* Buttons */}
         <div className="flex justify-end mt-12 space-x-4">
                <button type="button" className="bg-gray-300 px-4 py-2 rounded-md" onClick={handleClear}>Clear</button>
                <button
                    className=" text-white rounded-md p-2  lg:w-20"
                    type='submit'
                    onClick={handleSubmit}
                    style={{ backgroundColor: layout_color }}
                    disabled={isLoading}
                >
                    {isLoading ? <SpinLoading /> : 'Save'}
                </button>
            </div>
      </div>
        </>
    );
}

export default AddPromotion;
