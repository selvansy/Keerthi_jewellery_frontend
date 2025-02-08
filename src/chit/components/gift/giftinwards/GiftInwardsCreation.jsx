
import React, { useState, useEffect } from 'react'
import { useNavigate,useParams } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import { openModal } from '../../../../redux/modalSlice'
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query'
import Modal from '../../common/Modal'
import { getgiftvendorbranchById, getgiftitemvendorById,addgiftinward,getgiftinwardById, updategiftinward, getallbranch } from '../../../api/Endpoints';
const GiftInwardsCreation = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_role = roledata?.id_role?.id_role;
  const id_client = roledata?.id_client;
  const id_branch = roledata?.branch;

  const [vendorfilter, setVendor] = useState([]);
  const [branchfilter, setBranch] = useState([]);
  const [giftitemfilter, setGiftitem] = useState([]);
  const [total, setTotal] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const {id}=useParams()
  const [formData, setFormData] = React.useState({
    invoice_no: '',
    id_gift: '',
    price: '',
    buyingPrice: '',
    vendor: '',
    qty: '',
    gst_percenty: '',
    cus_sellprice: ''
  })
  useEffect(() => {
    console.log('work')
    getallbranchMutate();
  }, []);

  const handleVendorChange = async (selectedBranchId) => {

    if (!selectedBranchId) return;
    const response = await getgiftvendorbranchById({ "id_branch": selectedBranchId });
    if (response) {
      setVendor(response.data);
    }
  };

  const handleGiftChange = async (gift_vendorid) => {

    if (!gift_vendorid) return;
    const response = await getgiftitemvendorById({ "gift_vendorid": gift_vendorid });
    if (response) {
      setGiftitem(response.data);
    }
  };


  const { mutate: getallbranchMutate } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      if (response) {
        setBranch(response.data);
      }
    },
  });

    
  useEffect(()=>{
    console.log(id);
    if(id){
      fetchgiftinwardById({id:id});
    }
  },[id])
  const { mutate: fetchgiftinwardById } = useMutation({
    mutationFn: getgiftinwardById,
    onSuccess: (response) => {

      const resdata = response.data;
    
      handleVendorChange(resdata.id_branch);
      handleGiftChange(resdata.gift_vendorid);
  
     
      const formDataToSend = {
        id: resdata._id,
        gift_vendorid: resdata.gift_vendorid,
        invoice_no: resdata.invoice_no,
        id_gift: resdata.id_gift,
        id_branch: resdata.id_branch,
        qty: resdata.qty,
        price: resdata.price,
        gst_percenty: resdata.gst_percenty,
        cus_sellprice: resdata.cus_sellprice,
      };
      setFormData(formDataToSend);
  
      // Calculate total considering quantity, price, and GST
      const gst = parseInt(formData.gst_percenty) || 0;
      const price = parseInt(formData.price) || 0;
      const qty = parseInt(formData.qty) || 0;
      const total = (price * qty) + (gst * qty);
      setTotal(total);
    },
    onError: (error) => {
      console.error('Error fetching gift inward data:', error);
      toast.error("Failed to fetch gift inward data. Please try again.");
    }
  });
  const handleInputChange = (e) => {
    let total = 0;

    const { name, value } = e.target;

    if(name==="id_branch"){
      if(value !==""){
        handleVendorChange(value); 
      }
    } else if(name==="gift_vendorid"){
      if(value !==""){
         handleGiftChange(value);
      }
    }

    // Update form data state
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    let gst = parseInt(formData.gst_percenty) || 0;
    let price = parseInt(formData.price) || 0;
    // Handle GST value change
    if (name === 'gst_percenty' && value !== '') {
      gst = parseInt(value) || 0;
    }
    if (name === 'price' && value !== '') {
      price = parseInt(value) || 0;
    }
    total = gst + price;
    setTotal(total);
  }


  // Generate barcode data
  const generateBarcodeData = () => {
    return `INV${formData.invoice_no}-GFT${formData.id_gift}-QTY${formData.qty}`
  }

  // Handler fn to navigate
  const handleCancel = () => {
    navigate('/gift/giftinwards')
  }
  

  
  const validateForm = () => {
    const errors = {};
    if (!formData.gift_vendorid) errors.gift_vendorid = 'Gift Vendor Id is required';
    if (!formData.invoice_no) errors.invoice_no = 'Invoice Number is required';
    if (!formData.id_gift) errors.id_gift = 'Gift Id is required';
    if (!formData.qty) errors.qty = 'Qty is required';
    if (!formData.id_branch) errors.id_branch = 'Branch is required';
    if (!formData.gst_percenty) errors.gst_percenty = 'Gst Percentage is required';
    if (!formData.price) errors.price = 'Price is required';
    if (!formData.cus_sellprice) errors.cus_sellprice = 'Customer Sell Price is required';
  
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    let formDataToSend = new FormData();
     formDataToSend = {
      gift_vendorid: formData.gift_vendorid,
      invoice_no: formData.invoice_no,
      id_gift: formData.id_gift,
      id_branch: formData.id_branch,
      qty: formData.qty,
      price: formData.price,
      gst_percenty: formData.gst_percenty,
      cus_sellprice: formData.cus_sellprice,
    };
    createGiftinwardsMutate(formDataToSend);
  };


  //mutation to create scheme classification
  const {mutate: createGiftinwardsMutate } = useMutation({
    mutationFn: addgiftinward,
    onSuccess: (response) => {
      if(response.status == 201){
      toast.success(response.data.message)
      navigate('/gift/giftinwards')
      }
    },
    onError: (error) => {
      toast.error(error.response.message)
    }
  });

  
  const handleUpdate = () => {
    if (!validateForm()) return;
    let formDataToSend = new FormData();
  
    // Now assigning the form data object
    formDataToSend = {
      id: id,
      gift_vendorid: formData.gift_vendorid,
      invoice_no: formData.invoice_no,
      id_gift: formData.id_gift,
      id_branch: formData.id_branch,
      qty: formData.qty,
      price: formData.price,
      gst_percenty: formData.gst_percenty,
      cus_sellprice: formData.cus_sellprice,
    };
    
    console.log("id",formDataToSend);
    
    // Call your mutation function to update the gift inward data
    updategiftinwardMutate({id:id,data:formDataToSend});
  };


    //update GiftinwardsMutate
    const {mutate: updategiftinwardMutate } = useMutation({
      mutationFn:({id,data})=>updategiftinward(id,data),
      onSuccess: (response) => {
        console.log(response);
        toast.success(response.message);
        navigate('/gift/giftinwards');
       
      },
      onError: (error) => {
        toast.error(error.response.message)
      }
    });

  
    
  
  return (
    <>
      <div className='flex flex-row justify-between'>
        <h2 className='text-2xl text-[#023453] font-bold justify-between'>Gift Inwards Creations</h2>
      </div>
      <div className='w-full flex flex-col bg-white border-t-2 border-[#023453] mt-3 p-4'>
          <div className='mb-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='flex flex-col gap-6'>
              {id_branch === "0" && (
                 
                <div className='flex flex-col gap-2'>
                  <label className='text-gray-700 font-medium'>Branch<span className='text-red-400'>*</span></label>
                  <select
                    name="id_branch"
                    value={formData.id_branch || ''}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Branch</option>
                    {branchfilter.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.branch_name}
                      </option>
                    ))}
                  </select>
                  {formErrors.id_branch && <span className="text-red-500 text-sm mt-1">{formErrors.id_branch}</span>}
                </div>
                )}
                <div className='flex flex-col gap-2'>
                  <label className='text-gray-700 font-medium'>Invoice Bill No<span className='text-red-400'>*</span></label>
                  <input
                    type='text'
                    name='invoice_no'
                    value={formData.invoice_no}
                    onChange={handleInputChange}
                    className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    placeholder='Enter Here'
                    required
                  />
                   {formErrors.invoice_no && <span className="text-red-500 text-sm mt-1">{formErrors.invoice_no}</span>}
               
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='text-gray-700 font-medium'>Choose Gift Name<span className='text-red-400'>*</span></label>
                  <select
                    name='id_gift'
                    value={formData.id_gift}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    required
                  >
                    <option value="">Select Gift Item</option>
                    {giftitemfilter.map((giftitem) => (
                      <option key={giftitem._id} value={giftitem._id}>
                        {giftitem.gift_name}
                      </option>
                    )
                    )}
                  </select>
                  {formErrors.id_gift && <span className="text-red-500 text-sm mt-1">{formErrors.id_gift}</span>}
                </div>
                

                <div className='flex flex-col gap-2'>
                  <label className='text-gray-700 font-medium'>GST<span className='text-red-400'>*</span></label>
                  <input
                    type='number'
                    name='gst_percenty'
                    value={formData.gst_percenty}
                    onChange={
                      handleInputChange
                    }
                    className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    placeholder='Enter Here'
                    required
                  />
                     {formErrors.gst_percenty && <span className="text-red-500 text-sm mt-1">{formErrors.gst_percenty}</span>}
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='text-gray-700 font-medium'>Cus Sell Price<span className='text-red-400'>*</span></label>
                  <input
                    type='number'
                    name='cus_sellprice'
                    value={formData.cus_sellprice}
                    onChange={handleInputChange}
                    className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    placeholder='Enter Here'
                    required
                  />
                       {formErrors.cus_sellprice && <span className="text-red-500 text-sm mt-1">{formErrors.cus_sellprice}</span>}
                </div>


              </div>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-col gap-2'>
                  <label className='text-gray-700 font-medium'>Choose Gift Vendor<span className='text-red-400'>*</span></label>
                  <select
                    name="gift_vendorid"
                    value={formData.gift_vendorid || ''}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Gift Vendor</option>
                    {vendorfilter.map((vendor) => (
                      <option key={vendor._id} value={vendor._id}>
                        {vendor.vendor_name}
                      </option>
                    ))}
                  </select>
                  {formErrors.gift_vendorid && <span className="text-red-500 text-sm mt-1">{formErrors.gift_vendorid}</span>}
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='text-gray-700 font-medium'>qty<span className='text-red-400'>*</span></label>
                  <input
                    type='number'
                    name='qty'
                    value={formData.qty}
                    onChange={handleInputChange}
                    className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    placeholder='Enter Here'
                    required
                  />
                    {formErrors.qty && <span className="text-red-500 text-sm mt-1">{formErrors.qty}</span>}
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-gray-700 font-medium'>Price<span className='text-red-400'>*</span></label>
                  <input
                    type='number'
                    name='price'
                    value={formData.price}
                    onChange={
                      handleInputChange
                    }
                    className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    placeholder='Enter Here'
                    required
                  />
                   {formErrors.price && <span className="text-red-500 text-sm mt-1">{formErrors.price}</span>}
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-gray-700 font-medium'>Total Price <span className='text-red-400'>*</span></label>
                  <input
                    type='number'
                    name='total'
                    value={total}
                    onChange={handleInputChange}
                    disabled
                    className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    placeholder='Enter Here'
                    required
                  />
            
                </div>

              </div>
            </div>
          </div>
          <div className='flex flex-row justify-end border-t-2 p-3 mt-8'>
            <div className='flex flex-row gap-6 justify-center'>
              <button
                type='button'
                className='bg-[#E2E8F0] rounded-md p-2 text-black'
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type='submit'
                className='text-white bg-[#61A375] w-16 h-10 text-center p-2 rounded-md'
                onClick={id ? handleUpdate : handleSubmit}
                >
                  {id ? 'Update' : 'Submit'}
              </button>
            </div>
          </div>
      </div>
      <Modal />
    </>
  )
}

export default GiftInwardsCreation