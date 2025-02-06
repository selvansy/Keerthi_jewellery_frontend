import React, { useState, useEffect } from 'react';
import { getgiftvendorById, getallbranch, addgiftvendor, updategiftvendor } from '../../../api/Endpoints'; 
import { useMutation } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { setid } from "../../../../redux/clientFormSlice";
import { toast } from 'react-toastify';

function GiftVendorForm({ setIsOpen }) {
    
    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    const roledata = useSelector((state) => state.clientForm.roledata);
    const [branch, setBranch] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        vendor_name: '',
        mobile: '',
        gst: '',
        address: '',
        id_branch: '',
    });
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const id = useSelector((state) => state.clientForm.id);

    // Fetch all branches
    const { mutate: getallbranchMutate } = useMutation({
        mutationFn: getallbranch,
        onSuccess: (response) => {
            if (response) {
                setBranch(response.data);
            }
        },
    });

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
            }
        },
    });

    // Create or update gift vendor
    const { mutate: createOrupdategiftvendor } = useMutation({
        mutationFn: (formData) => {
            if (id) {
                return updategiftvendor(id, formData); // Update vendor
            } else {
                return addgiftvendor(formData); // Add new vendor
            }
        },
        onSuccess: () => {
            toast.success(id ? 'Gift Vendor updated successfully!' : 'Gift Vendor created successfully!');
            setIsOpen(false);
            dispatch(setid(null)); // Reset form ID in Redux
        },
        onError: (error) => {
            toast.error('An error occurred: ' + error.message);
        },
    });

    useEffect(() => {
        getallbranchMutate();
        if (id) {
            getgiftvendorId(id);
        }
    }, [id]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle validation
    const validateForm = () => {
        const newErrors = {};
        if (!formData.vendor_name) newErrors.vendor_name = 'Vendor name is required';  
        if (!formData.id_branch) newErrors.id_branch = 'Branch is required';
        return newErrors;
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            // Submit form if no validation errors
            createOrupdategiftvendor(formData);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        setFormData({
            vendor_name: '',
            mobile: '',
            gst: '',
            address: '',
            id_branch: '',
        });
        setIsOpen(false);
        dispatch(setid(null)); // Reset form ID in Redux
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Branch field */}
                <div className="flex flex-col space-y-2">
                    <label className="font-medium text-gray-700">
                        Branch<span className="text-red-400">*</span>
                    </label>
                    <select
                        name="id_branch"
                        value={formData.id_branch}
                        onChange={handleChange}
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Branch</option>
                        {branch.map((branch) => (
                            <option key={branch._id} value={branch._id}>
                                {branch.branch_name}
                            </option>
                        ))}
                    </select>
                    {errors.id_branch && <div className="text-red-500 text-sm">{errors.id_branch}</div>}
                </div>

                {/* Gift Vendor Name field */}
                <div className="flex flex-col space-y-2">
                    <label className="font-medium text-gray-700">
                        Gift Vendor Name<span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        name="vendor_name"
                        value={formData.vendor_name}
                        onChange={handleChange}
                        placeholder="Enter Gift Vendor Name"
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.vendor_name && <div className="text-red-500 text-sm">{errors.vendor_name}</div>}
                </div>

                {/* Address field */}
                <div className="flex flex-col space-y-2">
                    <label className="font-medium text-gray-700">
                        Address
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter Address"
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
               
                </div>

                {/* Mobile field */}
                <div className="flex flex-col space-y-2">
                    <label className="font-medium text-gray-700">
                        Mobile
                    </label>
                    <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="Enter Mobile"
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
          
                </div>

                {/* GST Number field */}
                <div className="flex flex-col space-y-2">
                    <label className="font-medium text-gray-700">
                        GST Number
                    </label>
                    <input
                        type="text"
                        name="gst"
                        value={formData.gst}
                        onChange={handleChange}
                        placeholder="Enter GST Number"
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
               
                </div>

                {/* Submit/Cancel buttons */}
                <div className="bg-white p-2 border-t-2 border-gray-300 mt-4">
                    <div className="flex justify-end gap-2 mt-3">
                        <button
                            type="button"
                            className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className=" text-white rounded-md p-2 w-full lg:w-20"
                            style={{ backgroundColor: layout_color }} >
                            {id ? 'Update' : 'Submit'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default GiftVendorForm;
