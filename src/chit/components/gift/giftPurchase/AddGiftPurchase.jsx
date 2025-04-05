
import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { openModal } from '../../../../redux/modalSlice'
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query'
import Modal from '../../common/Modal'
import { CalendarDays, CornerDownLeft } from 'lucide-react'
import { getgiftvendorbranchById, getgiftitemvendorById, addgiftinward, getgiftinwardById, updategiftinward, getallbranch } from '../../../api/Endpoints';
import SpinLoading from '../../common/spinLoading';
import Select from "react-select";
import customSelectStyles from "../../common/customSelectStyles"

const AddGiftPurchase = () => {

  const navigate = useNavigate()
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const roledata = useSelector((state) => state.clientForm.roledata);

  const id_branch = roledata?.branch;
  const branchAccess = roledata?.id_branch

  const [isLoading, setisLoading] = useState(false)
  const [total, setTotal] = useState("")
  const [vendorfilter, setVendor] = useState([]);
  const [branchData, setBranch] = useState([]);
  const [giftitemfilter, setGiftitem] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const { id } = useParams()

  const [formData, setFormData] = React.useState({
    invoice_no: '',
    id_gift: '',
    price: "",
    buyingPrice: '',
    gift_vendorid: '',
    qty: "",
    gst_percenty: "",
    total: "",
    cus_sellprice: "",
    id_branch: "",

  })


  useEffect(() => {
    if(!roledata) return
    if (id_branch !== "0") {
      setFormData(prev => ({
        ...prev,
        id_branch: branchAccess
      }))
    }
  }, [roledata]);


  const branchRe = formData.id_branch || branchAccess;

  const { data: giftVendorRes, isLoading: loadingGiftVendor } = useQuery({
    queryKey: ["vendor", branchRe],
    queryFn: ()=> getgiftvendorbranchById(branchRe),
    enabled: !!branchRe,
  });

  const vendorId = formData.gift_vendorid;

  const { data: giftItems, isLoading: loadingGiftItems } = useQuery({
    queryKey: ["giftitem", vendorId],
    queryFn: ({ queryKey }) => {
      const [, vendorId] = queryKey;
      return getgiftitemvendorById(vendorId);
    },
    enabled: !!vendorId,

  });


  const { data: branchresponse, isLoading: loadingbranch } = useQuery({
    queryKey: ["branch"],
    queryFn: getallbranch,
  });

  useEffect(() => {

    if (id) {
      fetchgiftinwardById({ id: id });
    }
  }, [id])


  useEffect(() => {

    if (giftVendorRes) {
      const data = giftVendorRes.data;

      const vendor = data.map((vendor) => ({
        value: vendor._id,
        label: `${vendor.vendor_name} ${vendor.mobile}`,
      }));
      setVendor(vendor);
    }

    if (giftItems) {
      const data = giftItems.data;

      const giftItem = data.map((giftItem) => ({
        value: giftItem._id,
        label: `${giftItem.gift_name}`,
      }));
      setGiftitem(giftItem);
    }


    if (branchresponse) {
      const data = branchresponse.data

      const branch = data.map((branch) => ({
        value: branch._id,
        label: branch.branch_name,
      }));
      setBranch(branch);
    }


  }, [giftVendorRes, giftItems, branchresponse]);


  const { mutate: fetchgiftinwardById } = useMutation({
    mutationFn: getgiftinwardById,
    onSuccess: (response) => {

      const resdata = response.data;

      handleVendorChange(resdata.id_branch);
      GiftItems(resdata.gift_vendorid);


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
        total: resdata.total
      };
      setFormData(formDataToSend);

    },
    onError: (error) => {
      console.error('Error fetching gift inward data:', error);
      toast.error("Failed to fetch");

    }
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "gift_vendorid") {
      if (value !== "") {
        GiftItems(value);
      }
    }

    if (name === "gst_percenty") {
      const gstPercentRegex = /^\d{1,2}(\.\d)?$/;

      if ((value < 0) || (!gstPercentRegex.test(value))) {
        setFormErrors(prev => ({
          ...prev,
          gst_percenty: "Gst percent not valid"
        }));
      }


      setFormData(prev => ({ ...prev, gst_percenty: value }));

      // GST Number Validation
      const gstRegex = /^(?=.*[0-9])(?=.*[A-Z])[0-9A-Z]{15}$/;
      setFormErrors(prev => ({
        ...prev,
        gst: !formData.gst
          ? "GST number is required"
          : !gstRegex.test(formData.gst)
            ? "GST number must be exactly 15 alphanumeric characters (A-Z, 0-9)"
            : ""
      }));
    }


    if (name === "cus_sellprice") {
      if (name === "cus_sellprice" && value < 0) {
        setFormErrors(prev => ({
          ...prev,
          cus_sellprice: "customer price is required"
        }));
      }

      setFormData(prev => ({
        ...prev,
        cus_sellprice: value
      }));

    }

    if (name === "price") {
      if (name === "price" && value < 0) {
        setFormErrors(prev => ({
          ...prev,
          price: "price is required"
        }));
      }

      setFormData(prev => ({
        ...prev,
        price: value
      }));

    }

    if (name === "qty") {
      if (name === "qty" && value < 0) {
        setFormErrors(prev => ({
          ...prev,
          qty: "Quantity is required"
        }));
      }
      const num = Number(value)
      setFormData(prev => ({
        ...prev,
        qty: num
      }));

    }


    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }


  // Handler fn to navigate
  const handleCancel = () => {
    navigate('/gift/giftpurchase/')
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
    console.log("erro", errors)
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    setisLoading(true)
    if (!validateForm()) {

      setisLoading(false)
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
  const { mutate: createGiftinwardsMutate } = useMutation({
    mutationFn: addgiftinward,
    onSuccess: (response) => {

      if (response.status == 201) {
        toast.success(response.data.message)
        navigate('/gift/giftpurchase/')
      }
      setisLoading(false)
    },
    onError: (error) => {
      toast.error(error.response.message)
      setisLoading(false)
    }
  });


  const handleUpdate = () => {
    setisLoading(true)
    if (!validateForm()) return;
    let formDataToSend = new FormData();


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
    updategiftinwardMutate({ id: id, data: formDataToSend });
  };


  //update GiftinwardsMutate
  const { mutate: updategiftinwardMutate } = useMutation({
    mutationFn: ({ id, data }) => updategiftinward(id, data),
    onSuccess: (response) => {
      setisLoading(false)
      toast.success(response.message);
      navigate('/gift/giftpurchase/');

    },
    onError: (error) => {
      toast.error(error.response.message)
      setisLoading(false)
    }
  });



  const calculateGst = useMemo(() => {
    return () => {
      const quan = Number(formData.qty);
      const prc = Number(formData.price);
      const gst = Number(formData.gst_percenty);

      if (quan < 1 || prc < 0 || gst < 0) {
        return 0;
      }

      const totalWithoutGST = prc * quan;
      const gstAmount = (gst * totalWithoutGST) / 100;
      const totalAmt = Math.round(totalWithoutGST + gstAmount)

      setTotal(totalAmt)
      setFormData(prev => ({
        ...prev,
        cus_sellprice: totalAmt
      }));
      return totalAmt;
    };
  }, [formData.qty, formData.price, formData.gst_percenty]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, total: calculateGst() }));
  }, [calculateGst]);



  return (
    <>
      <div className='flex flex-row justify-between'>
        <h2 className='text-2xl text-[#023453] font-bold justify-between'>{id ? "Edit GiftPurchase" : "AddGift Purchase"}</h2>
      </div>
      <div className="w-full flex flex-col bg-white border-t-2 border-[#023453] mt-3 p-4">
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Section */}
            <div className="flex flex-col gap-6">

              <div className="flex flex-col gap-2 mt-2">
                <label className="text-gray-700 font-medium">
                  Branch <span className="text-red-400">*</span>
                </label>

                <Select
                  options={branchData}
                  value={
                    id_branch !== "0"
                      ? branchData.find(branch => branch.value === id_branch) || ""
                      : branchData.find(branch => branch.value === formData.id_branch) || ""
                  }
                  onChange={(branch) => {
                    setFormData((prev) => ({
                      ...prev,
                      id_branch: branch.value,
                    }));
                  }}
                  customSelectStyles={customSelectStyles}
                  isLoading={loadingbranch}
                  isDisabled={id_branch !== "0"}
                  placeholder="Select"
                />



                {formErrors.id_branch && (
                  <span className="text-red-500 text-sm">{formErrors.id_branch}</span>
                )}
              </div>


              {/* Invoice Number */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-gray-700 font-medium">
                  Invoice Bill No<span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="invoice_no"
                  value={formData.invoice_no}
                  onChange={handleInputChange}
                  className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter Here"
                  required
                />
                {formErrors.invoice_no && (
                  <span className="text-red-500 text-sm">{formErrors.invoice_no}</span>
                )}
              </div>

              {/* Choose Gift */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-gray-700 font-medium">
                  Choose Gift Name<span className="text-red-400"> *</span>
                </label>

                <Select
                  name="id_gift"
                  options={giftitemfilter.length > 0 ? giftitemfilter : []}
                  value={
                    giftitemfilter.find(e => e.value === formData.id_gift) ||
                    (giftitemfilter.length > 0 ? "" : null)
                  }
                  onChange={(ele) => {
                    setFormData((prev) => ({
                      ...prev,
                      id_gift: ele.value,
                    }));
                  }}
                  customSelectStyles={customSelectStyles}
                  isLoading={loadingGiftItems}
                  isDisabled={giftitemfilter.length === 0}
                  placeholder={giftitemfilter.length === 0 ? "No Records Found" : "Select GiftItems"}
                />

                {formErrors.id_gift && (
                  <span className="text-red-500 text-sm">{formErrors.id_gift}</span>
                )}
              </div>

              {/* GST Percentage */}
              <div className="flex flex-col mt-2 relative">
                <label className="text-gray-700 font-medium">
                  GST %<span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="gst_percenty"
                  min="0"
                  maxLength="3"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                    if ((e.target.value.match(/\./g) || []).length > 1) {
                      e.target.value = e.target.value.slice(0, -1);
                    }
                  }}
                  value={formData.gst_percenty}
                  onChange={handleInputChange}
                  className="border-2 mt-2 border-gray-300 rounded-md p-2 w-full focus:border-transparent"
                  placeholder="Enter Here"
                  required
                />
                {formErrors.gst_percenty && (
                  <span className="text-red-500 text-sm">{formErrors.gst_percenty}</span>
                )}
              </div>

              {/* Total Price */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-gray-700 font-medium">
                  Total Price <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="total"
                  value={formData.total}
                  readOnly
                  className="border-2 mt-2 border-gray-300 rounded-md p-2 bg-gray-200 cursor-not-allowed w-full"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col gap-6">
              {/* Choose Gift Vendor */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-gray-700 font-medium">
                  Choose Gift Vendor<span className="text-red-400">*</span>
                </label>
                <Select
                  name="gift_vendorid"
                  options={vendorfilter.length > 0 ? vendorfilter : []}
                  value={
                    vendorfilter.find(vendor => vendor.value === formData.gift_vendorid) ||
                    (vendorfilter.length > 0 ? "" : null)
                  }
                  onChange={(vendor) => {
                    setFormData((prev) => ({
                      ...prev,
                      gift_vendorid: vendor.value,
                    }));
                  }}
                  customSelectStyles={customSelectStyles}
                  isLoading={loadingGiftVendor}
                  isDisabled={vendorfilter.length === 0}
                  placeholder={vendorfilter.length === 0 ? "No Records Found" : "Select"}
                />


                {formErrors.gift_vendorid && (
                  <span className="text-red-500 text-sm">{formErrors.gift_vendorid}</span>
                )}
              </div>

              {/* Quantity */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-gray-700 font-medium">
                  Quantity<span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="qty"
                  min="1"
                  maxLength={"5"}
                  pattern="\d{5}"
                  value={formData.qty}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  onChange={handleInputChange}
                  className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter Here"
                  required
                />
                {
                  formErrors.qty && <span className="text-red-500 text-sm">{formErrors.qty}</span>
                }
              </div>

              {/* Price */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-gray-700 font-medium">
                  Price<span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  min="1"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter Here"
                  required
                />
                {formErrors.price && <span className="text-red-500 text-sm">{formErrors.price}</span>}
              </div>

              {/* Customer Sell Price */}
              <div className="flex flex-col gap-2 mt-3">
                <label className="text-gray-700 font-medium ">
                  Customer Sell Price<span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="cus_sellprice"
                  value={formData.cus_sellprice}
                  onChange={handleInputChange}
                  className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter Here"
                  required
                />
                {formErrors.cus_sellprice && (
                  <span className="text-red-500 text-sm">{formErrors.cus_sellprice}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-row bg-white justify-end border-t-2 p-2'>
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
            className='text-white w-16 h-10 text-center p-2 rounded-md'
            onClick={id ? handleUpdate : handleSubmit}
            style={{ backgroundColor: layout_color }}
          >
            {isLoading ? <SpinLoading /> : id ? 'Update' : 'Submit'}
          </button>
        </div>
      </div>
      <Modal />
    </>
  )
}

export default AddGiftPurchase