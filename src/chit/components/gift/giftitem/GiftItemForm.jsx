import React, { useState, useEffect } from 'react';
import { getallgiftvendor, getallbranch, getgiftvendorbranchById, getgiftitemById, addgiftitem, updategiftitem } from '../../../api/Endpoints';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';

import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import SpinLoading from '../../common/spinLoading';
import Select from "react-select";
import customSelectStyles from "../../common/customSelectStyles"

function GiftItemForm({ setIsOpen, isviewOpen, id, setId, refetchTable }) {


    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    let navigate = useNavigate();


    const [branchData, setBranch] = useState([]);
    const [branch, setbranch] = useState("")
    const [vendorfilter, setVendor] = useState([]);
   
    const [formData, setFormData] = useState({
        gift_name: '',
        gift_vendorid: '',
        id_branch: '',
        gift_code:""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        if (id && (isviewOpen === true)) {
            getGiftitemId(id);
        }
    }, [id, isviewOpen]);

    useEffect(() => {

        return () => {
            setId("")
        }
    }, [])

    const { data: branchresponse, isLoading: loadingbranch } = useQuery({
        queryKey: ["branch"],
        queryFn: getallbranch,
    });

    const { data: Vendorresponse, isLoading: loadingVendor } = useQuery({
        queryKey: ["vendor", branch],
        queryFn:()=> getgiftvendorbranchById(branch),
        enabled: !!branch
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

        if (Vendorresponse) {
            const data = Vendorresponse.data
            
            const vendor = data.map((vendor) => ({
                value: vendor._id,
                label: vendor.vendor_name,
            }));

            setVendor(vendor);
        }

    }, [branchresponse, Vendorresponse,branch])




    const { mutate: getGiftitemId } = useMutation({
        mutationFn: getgiftitemById,
        onSuccess: (response) => {
            if (response) {
                setFormData({
                    gift_name: response.data.gift_name,
                    gift_vendorid: response.data.gift_vendorid,
                    id_branch:response.data.id_branch,
                    gift_code:response.data.gift_code
                });
                setbranch(response.data.id_branch);
            }
        },
    });




    const validateForm = () => {
        const newErrors = {};
        if (!formData.gift_name) newErrors.gift_name = 'Gift name is required';
        if (!formData.gift_code) newErrors.gift_code = "Gift Code is required"
        if (!formData.gift_vendorid) newErrors.gift_vendorid = 'Gift vendor is required';
        if (!formData.id_branch) newErrors.id_branch = 'Branch is required';

         
        if (Object.keys(newErrors).length > 0) {
            setErrors((prev) => ({
                ...prev,
                ...newErrors
            }));
        }

        return newErrors;
    };



    const handleChange = (e) => {
        const { name, value } = e.target;

        const newValue = Number(value)

        if(name === "gift_code"){
            setFormData(prev=>({
                ...prev,
                gift_code:newValue
            }))
        }
    
            setFormData({
                ...formData,
                [name] : value,
              });
      
      };
      

    const handleCancel = () => {
        setFormData({
            gift_name: '',
            gift_image: '',
            gift_vendorid: '',
            id_branch: '',
            gift_code:""
        });
        setIsOpen(false);
        setId("")
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true)
            
            if (id) {
                updategiftitemMutate({ id: id, data: formData });
            } else {
                addgiftitemMutate(formData);
            };

        }
    };


    // Add Mutation
    const { mutate: addgiftitemMutate } = useMutation({
        mutationFn: addgiftitem,
        onSuccess: (response) => {
            if (response) {
                refetchTable()
                toast.success('Gift item added successfully');
                setIsOpen(false);

            }
        },
        onError: (error) => {
            setIsLoading(false)
            toast.error(error.response.data.message);
        },
    });

    // Update Mutation
    const { mutate: updategiftitemMutate } = useMutation({
        mutationFn: ({ id, data }) => updategiftitem(id, data),
        onSuccess: (response) => {
            if (response) {
                refetchTable()
                toast.success('Gift item updated successfully');
                setIsOpen(false);
                setId("")
            }
        },
        onError: (error) => {
            setIsLoading(false)
            toast.error(error.response.data.message);
        },
    });



    return (
        <div>
            <form className="space-y-4">
                <div className='flex flex-col space-y-2'>
                    <label className='text-black mb-1 font-medium'>Branch<span className='text-red-400'>*</span></label>
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
                        placeholder="Select branch"
                    />

                    {errors.id_branch && <div className="text-red-500 text-sm">{errors.id_branch}</div>}

                </div>

                <div className="flex flex-col space-y-2">
                    <label className="font-medium text-gray-700">
                        Gift Name<span className="text-red-400"> *</span>
                    </label>
                    <input
                        type="text"
                        name="gift_name"
                        value={formData.gift_name}
                        onChange={handleChange}
                        placeholder="Enter gift name"
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.gift_name && <div className="text-red-500 text-sm">{errors.gift_name}</div>}
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="font-medium text-gray-700">
                        Gift Code<span className="text-red-400"> *</span>
                    </label>
                    <input
                        type="text"
                        name="gift_code"
                        value={formData?.gift_code}
                        pattern="[0-9A-Z]*"
                        onChange={(e) => {
                            const value = e.target.value.toUpperCase();
                            if (/^[0-9A-Z]*$/.test(value)) {
                                handleChange(e);
                            }
                        }}
                      
                        placeholder="Enter gift code"
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {errors.gift_code && <div className="text-red-500 text-sm">{errors.gift_code}</div>}
                </div>
               
                <div className='flex flex-col space-y-2'>

                    <label className='text-black mb-1 font-medium'>Vendor Name<span className='text-red-400'>*</span></label>

                    <Select
                        options={vendorfilter}
                        value={vendorfilter.find(vendor => vendor.value === formData.gift_vendorid || "")}
                        onChange={(vendor) => {
                            setFormData((prev) => ({
                                ...prev,
                                gift_vendorid: vendor.value,
                            }));
                        }}
                        customSelectStyles={customSelectStyles}
                        isLoading={loadingVendor}
                        menuPlacement="top" 
                        placeholder="Select vendor"
                    />

                    {errors.gift_vendorid && <div className="text-red-500 text-sm">{errors.gift_vendorid}</div>}

                </div>

           

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

export default GiftItemForm;
