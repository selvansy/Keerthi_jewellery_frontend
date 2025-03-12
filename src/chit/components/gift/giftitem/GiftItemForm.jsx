import React, { useState, useEffect } from 'react';
import { getallgiftvendor, getallbranch, getgiftvendorbranchById, getgiftitemById,addgiftitem,updategiftitem } from '../../../api/Endpoints';
import { useMutation } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';

import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import SpinLoading from '../../common/spinLoading';

function GiftItemForm({ setIsOpen,isviewOpen,id,setId,refetchTable  }) {

    
    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    let navigate = useNavigate();
    const [branch, setBranch] = useState([]);
    const [vendorfilter, setVendor] = useState([]);
    const [gift_image, setGiftImage] = useState(null);
    const [pathurl, setPathurl] = useState('');
    const [formData, setFormData] = useState({
        gift_name: '',
        gift_image: '',
        gift_vendorid: '',
        id_branch: '', 
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);


    
    let dispatch = useDispatch();


    const { mutate: getallbranchMutate } = useMutation({
        mutationFn: getallbranch,
        onSuccess: (response) => {
            if (response) {
                setBranch(response.data);
            }
        },
    });

    const { mutate: getgiftvendorbranchByIdmuate } = useMutation({
        mutationFn:(payload)=> getgiftvendorbranchById(payload),
        onSuccess: (response) => {
     
            if (response) {
                setVendor(response.data);
            }
        },onError:(error)=>{
           toast.error(error)
        }
    });

    const { mutate: getGiftitemId } = useMutation({
        mutationFn: getgiftitemById,
        onSuccess: (response) => {
            if (response) {
         
                setFormData({
                    ...response.data,
                    gift_image: response.data.gift_image, 
                });
                getgiftvendorbranchByIdmuate({ id_branch: response.data.id_branch });
                setGiftImage(response.data.gift_image);
                setPathurl(response.data.pathurl);
            }
        },
    });

    

    useEffect(() => {
        
        if (id &&(isviewOpen === true)) {
            getGiftitemId(id);
        }
    }, [id,isviewOpen]);

    useEffect(()=>{
        getallbranchMutate()
      return ()=>{
        setId("")
      }
    },[])

    const validateForm = () => {
        const newErrors = {};
        if (!formData.gift_name) newErrors.gift_name = 'Gift name is required';
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
        setFormData({
            ...formData,
            [name]: value,
        });
        
       
    };

    const handleCancel = () => {
        setFormData({
            gift_name: '',
            gift_image: '',
            gift_vendorid: '',
            id_branch: '',
        });
        setIsOpen(false);
      setId("")
    };

    const handlegiftImageChange = (e) => {
        const file = e.target.files[0];
    
        if (file) {
            const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    
            if (validImageTypes.includes(file.type) && file.size <= (500 * 1024)) {
                setGiftImage(file);
            } else {
                toast.error("Invalid file type or file size exceeded (Max 500KB)");
            }
        } else {
            toast.error("No file selected");
        }
    };
    

    const handleRemovegiftImage = () => {
        setGiftImage(null);
        const input = document.getElementById('gift_image');
        if (input) input.value = '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        setErrors(validationErrors);
     
        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true)
            const formDataToSend = new FormData();
                formDataToSend.append("gift_name", formData.gift_name);
                if(gift_image  !=="" || gift_image  !==null){
                formDataToSend.append("gift_image", gift_image);
                }
                formDataToSend.append("gift_vendorid", formData.gift_vendorid);
                formDataToSend.append("id_branch", formData.id_branch);
            if(id){
                updategiftitemMutate({ id: id, data: formDataToSend });
            } else {               
                addgiftitemMutate(formDataToSend);
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
    mutationFn:({id,data}) =>updategiftitem(id,data),
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
            <form  className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <label className="font-medium text-gray-700">
                        Gift Item Name<span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        name="gift_name"
                        value={formData.gift_name}
                        onChange={handleChange}
                        placeholder="Enter Gift Item Name"
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.gift_name && <div className="text-red-500 text-sm">{errors.gift_name}</div>}
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="font-medium text-gray-700">
                        Branch<span className="text-red-400">*</span>
                    </label>
                    <select
                        name="id_branch"
                        value={formData.id_branch}
                        onChange={(e) => {
                            const branchId = e.target.value;
                            setFormData({
                                ...formData,
                                id_branch: branchId,
                            });
                            getgiftvendorbranchByIdmuate({ id_branch: branchId });
                        }}
                        className="p-3 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                <div className="flex flex-col space-y-2">
                    <label className="font-medium text-gray-700">
                        Gift Vendor<span className="text-red-400">*</span>
                    </label>
                    <select
                        name="gift_vendorid"
                        value={formData.gift_vendorid}
                        onChange={handleChange}
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Gift Vendor</option>
                        {vendorfilter.map((vendor) => (
                            <option key={vendor._id} value={vendor._id}>
                                {vendor.vendor_name}
                            </option>
                        ))}
                    </select>
                    {errors.gift_vendorid && <div className="text-red-500 text-sm">{errors.gift_vendorid}</div>}
                </div>

                <div className="flex flex-col space-y-2">
                <div className="flex flex-row " >
                <label className="text-gray-700 font-medium">Upload Gift Image<span className='text-red-400'>*</span></label>
                                                <p className='text-gray-900 text-[12px] truncate text-start mt-1 mx-2'>
                                                    (Maximum file size(500KB))
                                                </p>
                                            </div>
                   
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label
                                htmlFor="gift_image"
                                className="flex flex-col justify-center items-center w-full h-20 border-2 border-dashed border-gray-300 text-gray-700 cursor-pointer p-5 text-center"
                            >
                                <p> {
                                     (gift_image && typeof gift_image === 'string')
                                     ? gift_image
                                     : (gift_image && typeof gift_image === 'object' && gift_image)
                                         ? gift_image.name
                                         : 'Browse to find or drag image here'
                                }</p> 
                            </label>
                            <input
                                onChange={handlegiftImageChange}
                                className="hidden max-w-[190px]"
                                name="gift_image"
                                id="gift_image"
                                type="file"
                                accept="image/*"
                            />
                           
                        </div>

                        {gift_image && (
                            <div className="w-20 h-20 border border-gray-300 rounded-md overflow-hidden relative">
                                <button
                                    onClick={handleRemovegiftImage}
                                    className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
                                    type="button"
                                >
                                    ×
                                </button>
                            
                                <img
                                    src={typeof gift_image === 'string' ? `${pathurl}${gift_image}` : URL.createObjectURL(gift_image)}
                                    alt="Gift image preview"
                                    className="w-full h-full object-cover"
                                />
                               
                            </div>
                        )}
                    </div>
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
                            onClick={(e)=>handleSubmit(e)}
                            readOnly={isLoading == true}
                            className=" text-white rounded-md p-2 w-full lg:w-20"
                            style={{ backgroundColor: layout_color }} >
                                {isLoading ? <SpinLoading/> : id ? 'Update' : 'Submit'}
                        </button>
                            </div>
                        </div>
                    
                  </form>

        </div>
    );
}

export default GiftItemForm;
