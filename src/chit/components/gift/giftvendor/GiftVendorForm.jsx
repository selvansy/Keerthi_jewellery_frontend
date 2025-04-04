import React, { useState, useEffect } from 'react';
import { getgiftvendorById, getallbranch, addgiftvendor, updategiftvendor } from '../../../api/Endpoints';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';

import { toast } from 'react-toastify';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import SpinLoading from '../../common/spinLoading';
import Select from "react-select";
import customSelectStyles from "../../common/customSelectStyles"


function GiftVendorForm({ setIsOpen, isviewOpen, id, refetchTable, setId }) {


    const layout_color = useSelector((state) => state.clientForm.layoutColor);
    let navigate = useNavigate();

    const roledata = useSelector((state) => state.clientForm.roledata);

    const id_branch = roledata?.branch;

    const [branchData, setBranch] = useState([]);
    const [branch, setbranch] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        vendor_name: '',
        mobile: '',
        gst: '',
        address: '',
        id_branch: id_branch,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {

        if (id && (isviewOpen === true)) {
            getgiftvendorId(id)
        } else {
            setId("")
        }

    }, [id, isviewOpen]);

    useEffect(() => {
        return () => {
            setId("")
        }
    }, [])

    const { data: branchresponse, isLoading: loadingbranch } = useQuery({
        queryKey: ["branch", branch],
        queryFn: getallbranch,
    });

    useEffect(() => {
        if (branchresponse) {
            const data = branchresponse.data

            const branch = data.map((branch) => ({
                value: branch._id,
                label: branch.branch_name,
            }));
            setBranch(branch);
        }

    }, [branchresponse])



    // Fetch gift vendor details by ID if editing
    const { mutate: getgiftvendorId } = useMutation({
        mutationFn: getgiftvendorById,
        onSuccess: (response) => {
            if (response) {
                setFormData({
                    vendor_name: response.data.vendor_name,
                    mobile: response.data.mobile,
                    gst: response.data.gst,
                    address: response.data.address,
                    id_branch: response.data.id_branch._id,
                });

                setbranch(response.data.id_branch._id)
            }
        },
    });


    const { mutate: createGiftVendorMutate } = useMutation({
        mutationFn: (formData) => addgiftvendor(formData),
        onSuccess: (response) => {
            refetchTable()
            toast.success(response.data.message);
            setIsOpen(false);
            setIsLoading(false)

        },
        onError: (error) => {
            setIsLoading(false)
            toast.error(error.response.data.message);
        },
    });

    const { mutate: updateGiftVendorMutate } = useMutation({
        mutationFn: (formData) => updategiftvendor(id, formData),
        onSuccess: (response) => {
            toast.success(response.data.message);
            refetchTable()

            setId("")
            setIsOpen(false);
            setIsLoading(false)

        },
        onError: (error) => {
            toast.error(error.response.data.message);
            setIsLoading(false)
            // setIsOpen(false);

        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (formData[name] === value) return;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "mobile" ? value.replace(/\D/g, "").slice(0, 10) : value,
        }));

        if (name === "gst") {
            const formattedValue = value.toUpperCase().slice(0, 15);

            const gstRegex = /^(?=.*[0-9])(?=.*[A-Z])[0-9A-Z]{15}$/;
            const gstError =
                !formattedValue ? "GST number is required" :
                    formattedValue.length < 15 ? "GST number must be exactly 15 characters" :
                        !gstRegex.test(formattedValue) ? "GST number must contain both numbers and uppercase letters" : "";

            setErrors(prev => ({ ...prev, gst: gstError }));

            if (!/^[0-9A-Z]*$/.test(formattedValue)) return;

            setFormData(prev => ({ ...prev, gst: formattedValue }));
        }

    };


    // Handle validation
    const validateForm = () => {
        const newErrors = {};
        if (!formData.vendor_name) newErrors.vendor_name = 'Vendor name is required';
        if (!formData.id_branch) newErrors.id_branch = 'Branch is required';
        if (!formData.mobile) {
            newErrors.mobile = "Mobile number is required";
        } else if (!/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = "Mobile number should be exactly 10 digits";
        }

        if (name === "gst") {
            if (name === "gst" && value < 0) { toast.error("Enter valid gst") }
            if (!formData.gst) {

                setErrors(prev => ({
                    ...prev,
                    gst: "GST number is required"
                }));

            } else if (!/^[0-9A-Z]{15}$/.test(formData.gst)) {

                setErrors(prev => ({
                    ...prev,
                    gst: "GST number should be exactly 15 alphanumeric characters"
                }));
            }

            setFormData(prev => ({
                ...prev,
                gst: value
            }));

        }


        return newErrors;
    };

    // Handle form submit
    const handleSubmit = (e) => {

        e.preventDefault();

        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        try {
            setIsLoading(true);
            if (id) {
                updateGiftVendorMutate(formData);
            } else {
                createGiftVendorMutate(formData);
            }

        } catch (error) {
            console.error("Error submitting form:", error);
        }

    };

    const handleCancel = () => {
        setId("")
        setFormData({
            vendor_name: '',
            mobile: '',
            gst: '',
            address: '',
            id_branch: '',
        });
        setIsOpen(false);
    };

    return (
        <div>
            <form className="space-y-4">
                {/* Branch field */}

                <div className='flex flex-col'>
                    <label className='text-gray-900 mb-1 font-medium'>Branch<span className='text-red-400'> *</span></label>

                    <Select
                        options={branchData}
                        value={branchData.find(branch => branch.value === formData.id_branch) || branch}
                        onChange={(branch) => {
                            setFormData((prev) => ({
                                ...prev,
                                id_branch: branch.value,
                            }));

                            setbranch(branch.value)
                        }}
                        customSelectStyles={customSelectStyles}
                        isLoading={loadingbranch}
                        placeholder="Select Branch"
                    />

                    {errors.id_branch ? <div style={{ color: "red" }}>{errors.id_branch}</div> : null}

                </div>

                {/* Gift Vendor Name field */}
                <div className="flex flex-col ">
                    <label className="font-medium text-gray-900">
                        Vendor Name<span className="text-red-400"> *</span>
                    </label>
                    <input
                        type="text"
                        name="vendor_name"
                        value={formData.vendor_name}
                        onChange={handleChange}
                        placeholder="Enter Gift Vendor Name"
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                    />
                    {errors.vendor_name && <div className="text-red-500 text-sm">{errors.vendor_name}</div>}
                </div>


                <div className="flex flex-col">
                    <label className="font-medium text-gray-900">
                        Mobile Number<span className='text-red-400'> *</span></label>
                    <input
                        type='tel'
                        name='mobile'
                        value={formData.mobile}
                        onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                        onChange={handleChange}
                        pattern="\d{10}"
                        placeholder="Enter mobile number"
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                        maxLength="10"
                    />
                    {errors.mobile && <span className="text-red-500 text-sm mt-1">{errors.mobile}</span>}
                </div>

                {/* Address field */}
                <div className="flex flex-col">
                    <label className="font-medium text-gray-900">
                        Address
                    </label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter Address"
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                    />
                </div>

                {/* GST Number field */}
                <div className="flex flex-col">
                    <label className="font-medium text-gray-900">GST Number</label>
                    <input
                        type="text"
                        name="gst"
                        value={formData.gst}
                        pattern="[0-9A-Z]*"
                        onChange={(e) => {
                            const value = e.target.value.toUpperCase();
                            if (/^[0-9A-Z]*$/.test(value)) {
                                handleChange(e);
                            }
                        }}
                        placeholder="Enter GST Number"
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                        maxLength="15"
                    />

                    {errors.gst && <span className="text-red-500 text-sm mt-1">{errors.gst}</span>}
                </div>


                {/* Submit/Cancel buttons */}
                <div className="bg-white p-2 border-t-2 border-gray-300 mt-4">
                    <div className="flex justify-end gap-2 mt-3">
                        <button
                            type="button"
                            className="bg-[#E2E8F0] text-gray-900 rounded-md p-2 w-full lg:w-20"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e)}
                            readOnly={isLoading == true}
                            className=" text-white rounded-md p-2 w-full lg:w-20"
                            style={{ backgroundColor: layout_color }} >
                            {isLoading ? <SpinLoading /> : id ? 'Update' : 'Save'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default GiftVendorForm;
