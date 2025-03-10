import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getallSchemes, getallbranch, getcustomerByBranchId, addPromotions } from "../../../api/Endpoints";
import Select from "react-select";
import { customSelectStyles } from "../../Setup/purity";
import { MultiSelect } from "react-multi-select-component";
import { X } from 'lucide-react'
import { layoutGridMoveHorizontal } from "@lucide/lab";
import { toast } from "react-toastify";
import SpinLoading from "../../common/spinLoading";
import { useNavigate } from "react-router-dom";



export const customMultiSelectStyles = {
    multiselectContainer: (provided) => ({
        ...provided,
        minHeight: "50px",
        height: "50px",
        borderWidth: "2px",
        border: "1px solid #D1D5DB",
        borderRadius: "6px",
        backgroundColor: "#F3F4F6",
        padding: "4px",
        display: "flex",
        alignItems: "center",
        "&:hover": {
            borderColor: "#9CA3AF",
        },
    }),

    searchBox: {
        border: "none",
        minHeight: "50px",
        padding: "0 12px",
        fontSize: "16px",
        color: "#374151",
        backgroundColor: "#F3F4F6",
        outline: "none",
    },

    option: (provided, { isSelected }) => ({
        ...provided,
        backgroundColor: isSelected ? "#6366F1" : "#fff",
        color: isSelected ? "#fff" : "#111827",
        padding: "10px",
        cursor: "pointer",
    }),

    optionContainer: (provided) => ({
        ...provided,
        maxHeight: "200px",
        overflowY: "auto",
        borderRadius: "6px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    }),

    valueContainer: (provided) => ({
        ...provided,
        minHeight: "50px",
        padding: "0 12px",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
    }),

    indicatorsContainer: (provided) => ({
        ...provided,
        height: "50px",
        display: "flex",
        alignItems: "center",
        paddingRight: "8px",
    }),
};



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

    const [pathurl, setPathurl] = useState(null);
    const [isLoading, setisLoading] = useState()


    const layout_color = useSelector((state) => state.clientForm.layoutColor);
    const roledata = useSelector((state) => state.clientForm.roledata);
    const id_branch = roledata?.branch;
    const branch = roledata?.id_branch;


    // Fetch branches
    const { data: branchResponse, isLoading: loadingBranch } = useQuery({
        queryKey: ["branch"],
        queryFn: getallbranch,
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

    }, [branchResponse, schemeResponse, customerResponse]);



    const handleChange = (e) => {

        const { name, value } = e.target;

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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file size (500KB limit)
            if (file.size > 500 * 1024) {
                toast.error("File size exceeds 500KB.");
                return;
            }

            setFormData((prev) => ({ ...prev, noti_image: file.name }));

            const imageUrl = URL.createObjectURL(file);
            setPathurl(imageUrl);
        }
    };

    const handleClearImage = () => {
        setFormData((prev) => ({ ...prev, noti_image: "" }));
        setPathurl(null);
        fileInputRef.current.value = "";
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
    
        addcustomerMutate(formPayload);
    };
    

    const handleClear = () => {
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
            isHtml: false
        });

        setPathurl(null);
        fileInputRef.current.value = "";
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


    return (
        <div className="p-6 bg-white rounded-md shadow-md w-full mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Promotions</h2>

            {/* Notification Options */}
            <div className="flex gap-4 mb-4">
                {["Push Notification", "Sms", "WhatsApp", "Email"].map((type) => (
                    <label key={type} className="flex items-center space-x-2 gap-2">
                        <input type="checkbox" name={type} />
                        <span>{type}</span>
                    </label>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">
                        Title <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        onChange={handleChange}
                        placeholder="Enter title"
                        className="border p-2 rounded-md text-gray-700"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">Image URL</label>
                    <input type="text" className="border p-2 rounded-md text-gray-400" placeholder="Enter image URL" />
                    <div className="mt-4 flex items-end gap-2">
                        <input type="text" name="imageUrl" onChange={handleChange} className="hidden" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">Content <span className="text-red-400">*</span></label>
                    <textarea name="body" className="border p-2 rounded-md text-gray-400" placeholder="Enter content" onChange={handleChange}></textarea>
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
                            className="border p-2 pr-24 rounded-md text-gray-400 w-full cursor-pointer"
                            placeholder="No file chosen"
                            value={formData.noti_image}
                            readOnly
                            onClick={() => fileInputRef.current.click()}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <div
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 px-3 py-1 rounded-md cursor-pointer text-sm"
                            onClick={() => fileInputRef.current.click()}
                        >
                            Choose File
                        </div>
                    </div>

                    {/* Image Preview */}
                    {pathurl && (
                        <div className="flex items-start justify-center">
                            <div className="relative rounded-md overflow-hidden">
                                <img
                                    src={pathurl}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded-md"
                                />
                                <button
                                    onClick={handleClearImage}
                                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>



            {/* Buttons */}
            <div className="flex justify-end mt-6 space-x-4">
                <button className="bg-gray-300 px-4 py-2 rounded-md" onChange={handleClear}>Clear</button>
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
    );
}

export default AddPromotion;
