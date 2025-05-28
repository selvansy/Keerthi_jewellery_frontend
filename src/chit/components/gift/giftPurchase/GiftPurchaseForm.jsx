import React, { useEffect, useMemo, useState } from 'react'
import Select from "react-select";
import { getallbranch, getgiftvendorbranchById, getgiftitemvendorById,addgiftinward,updategiftinward,getgiftinwardById } from '../../../api/Endpoints';
import { CookingPot, IndianRupee, Percent } from "lucide-react";
// import customSelectStyles from "../../common/customSelectStyles"
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import SpinLoading from '../../common/spinLoading';
import { toast } from 'react-toastify';
import { customStyles } from '../../ourscheme/scheme/AddScheme';

const customSelectStyles = (isReadOnly) => ({
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

function GiftPurchaseForm({ setIsviewOpen, isviewOpen, id, setId,refetchTable }) {

    const inputHeight = "42px";

    const roledata = useSelector((state) => state.clientForm.roledata);
    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    const id_branch = roledata?.branch;
    const branchAccess = roledata?.id_branch

    const [branchData, setBranch] = useState([]);
    const [total, setTotal] = useState("")
    const [vendorfilter, setVendor] = useState([]);
    const [isLoading, setisLoading] = useState(false)
    const [giftitemfilter, setGiftitem] = useState([]);
    const [formData, setFormData] = React.useState({
        invoice_no: '',
        id_gift: '',
        price: "",
        buyingPrice: '',
        gift_vendorid: '',
        inward_qty: "",
        qty:"",
        gst_percenty: "",
        total: total,
        cus_sellprice: "",
        id_branch: "",

    })
    const [errors, setErrors] = useState({});


       useEffect(() => {
    
            if (id && (isviewOpen === true)) {
                fetchgiftinwardById({ id: id });
            } else {
               setId("")
            }
    
        }, [id, isviewOpen]);
    
        useEffect(() => {
            return () => {
                setId("")
            }
        }, [])


    useEffect(() => {
        if (!roledata) return
        if (id_branch !== "0") {
            setFormData(prev => ({
                ...prev,
                id_branch: branchAccess
            }))
        }
    }, [roledata]);


    const { data: branchresponse, isLoading: loadingbranch } = useQuery({
        queryKey: ["branch"],
        queryFn: getallbranch,
    });

    const branchRe = formData.id_branch || branchAccess;



    const { data: giftVendorRes, isLoading: loadingGiftVendor } = useQuery({
        queryKey: ["vendor", branchRe],
        queryFn: () => getgiftvendorbranchById(branchRe),
        enabled: !!branchRe,
    });

    const vendorId = formData.gift_vendorid;

    const { data: giftItems, isLoading: loadingGiftItems } = useQuery({
        queryKey: ["giftitem", vendorId],
        queryFn: () => getgiftitemvendorById(vendorId),
        enabled: !!vendorId,

    });


    const { mutate: fetchgiftinwardById } = useMutation({
        mutationFn: getgiftinwardById,
        onSuccess: (response) => {
    
          const resdata = response.data;

          const formDataToSend = {
            id: resdata._id,
            gift_vendorid: resdata.gift_vendorid,
            invoice_no: resdata.invoice_no,
            id_gift: resdata.id_gift,
            id_branch: resdata.id_branch,
            inward_qty: resdata.inward_qty,
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
    


    useEffect(() => {
        if (branchresponse) {
            const data = branchresponse.data
            const branch = data.map((branch) => ({
                value: branch._id,
                label: branch.branch_name,
            }));
            setBranch(branch);
        }

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


    }, [branchresponse, giftVendorRes, giftItems])

    const handleChange = (e) => {
        const { name, value } = e.target;
         const newvalue = Number(value)

        if (name === "gift_vendorid") {
            if (value !== "") {
                giftItems(value)
                // GiftItems(value);
            }
        }

        if (name === "gst_percenty") {
          const gstPercentRegex = /^\d{1,2}(\.\d)?$/;

          if ((newvalue < 0) || (!gstPercentRegex.test(newvalue))) {
            setErrors(prev => ({
              ...prev,
              gst_percenty: "Gst percent not valid"
            }));
          }

          setFormData(prev => ({ ...prev, gst_percenty: newvalue }));

          // GST Number Validation
          const gstRegex = /^(?=.*[0-9])(?=.*[A-Z])[0-9A-Z]{15}$/;
          setErrors(prev => ({
            ...prev,
            gst: !formData.gst
              ? "GST number is required"
              : !gstRegex.test(formData.gst)
                ? "GST number must be exactly 15 alphanumeric characters (A-Z, 0-9)"
                : ""
          }));
        }


        if (name === "cus_sellprice") {
            if (name === "cus_sellprice" && newvalue < 0) {
                setErrors(prev => ({
                    ...prev,
                    cus_sellprice: "customer price is required"
                }));
            }

            setFormData(prev => ({
                ...prev,
                cus_sellprice: newvalue
            }));

        }


        if (name === "price") {
            let newValue = value.replace(/^0+/, ""); 
            if (newValue === "") newValue = "0"; 

            if (name === "price" && newvalue < 0) {
                setErrors(prev => ({
                    ...prev,
                    price: "price is required"
                }));
            }

        
            if (/^\d+$/.test(newValue)) {
              
            setFormData(prev => ({
                ...prev,
                price: newvalue
            }));

            }
            return;
          }
        
        

        if (name === "inward_qty") {
            if (name === "inward_qty" && newvalue < 0) {
                setErrors(prev => ({
                    ...prev,
                    inward_qty: "Quantity is required"
                }));
            }
           
            setFormData(prev => ({
                ...prev,
                inward_qty: newvalue,
                qty:newvalue
            }));

        }

        // setFormData(prev => ({
        //     ...prev,
        //     [name]: value
        // }));
    }


    const handleSubmit = () => {
        setisLoading(true)
        if (!validateForm()) {
            setisLoading(false)
            return;
        }
      const formDataToSend = {
            gift_vendorid: formData.gift_vendorid,
            invoice_no: formData.invoice_no,
            id_gift: formData.id_gift,
            id_branch: formData.id_branch,
            inward_qty: formData.inward_qty,
            qty:formData.qty,
            price: formData.price,
            total:formData.total,
            gst_percenty: formData.gst_percenty,
            cus_sellprice: formData.cus_sellprice,
        };

        return id ? updategiftinwardMutate({ id: id, data: formDataToSend }) : createGiftinwardsMutate(formDataToSend);

    };

    const handleCancel = () => {
        setId("")
        setFormData({
            invoice_no: '',
            id_gift: '',
            price: "",
            buyingPrice: '',
            gift_vendorid: '',
            inward_qty: "",
            qty:"",
            gst_percenty: "",
            total: "",
            cus_sellprice: "",
            id_branch: "",
        });
        setIsviewOpen(false);
    };

    const calculateGst = useMemo(() => {
        return () => {
          const quan = Number(formData.inward_qty);
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
      }, [formData.inward_qty, formData.price, formData.gst_percenty]);
    
      useEffect(() => {
        setFormData(prev => ({ ...prev, total: calculateGst() }));
      }, [calculateGst]);

      const validateForm = () => {
        const errors = {};
        if (!formData.gift_vendorid) errors.gift_vendorid = 'Gift Vendor Id is required';
        if (!formData.invoice_no) errors.invoice_no = 'Invoice Number is required';
        if (!formData.id_gift) errors.id_gift = 'Gift Id is required';
        if (!formData.inward_qty) errors.inward_qty = 'inward_qty is required';
        if (!formData.id_branch) errors.id_branch = 'Branch is required';
        if (!formData.gst_percenty) errors.gst_percenty = 'Gst Percentage is required';
        if (!formData.price) errors.price = 'Price is required';
        if (!formData.cus_sellprice) errors.cus_sellprice = 'Customer Sell Price is required';
    
        setErrors(errors);
        setisLoading(false)
        return Object.keys(errors).length === 0;
      };
    
      
  //update GiftinwardsMutate
  const { mutate: updategiftinwardMutate } = useMutation({
    mutationFn: ({ id, data }) => updategiftinward(id, data),
    onSuccess: (response) => {
      setisLoading(false)
      toast.success(response.message);
      setIsviewOpen(false);
      refetchTable()
     
    },
    onError: (error) => {
      toast.error(error.response.message)
      setisLoading(false)
    }
  });

  
  //mutation to create scheme classification
  const { mutate: createGiftinwardsMutate } = useMutation({
    mutationFn: addgiftinward,
    onSuccess: (response) => {
      toast.success(response.message);
      setIsviewOpen(false);
      refetchTable()
      setisLoading(false)
    },
    onError: (error) => {
      toast.error(error.response.message)
      setisLoading(false)
    }
  });



    return (
        <>
            <div className="w-full flex flex-col bg-white">
                <div className="flex flex-col pb-4 pt-2 relative space-y-2 ">
                        <div className="p-2 grid grid-rows-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 border-gray-300 overflow-y-scroll scrollbar-hide">
                            <div className="flex flex-col gap-2">
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
                                     className='border-2  border-[#F2F2F9] rounded-lg'
                                    styles={customStyles(true)}
                                    isLoading={loadingbranch}
                                    isDisabled={id_branch !== "0"}
                                    placeholder="Select"
                                />

                                {errors.id_branch && (
                                    <span className="text-red-500 text-sm">{errors.id_branch}</span>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
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
                                    styles={customStyles(true)}
                                     className='border-2  border-[#F2F2F9] rounded-lg'
                                    isLoading={loadingGiftVendor}
                                    isDisabled={vendorfilter.length === 0}
                                    placeholder={vendorfilter.length === 0 ? "No Records Found" : "Select"}
                                />

                                {errors.gift_vendorid && (
                                    <span className="text-red-500 text-sm">{errors.gift_vendorid}</span>
                                )}
                            </div>

                            {/* Invoice Number */}
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-700 font-medium">
                                    Invoice No<span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="invoice_no"
                                    value={formData.invoice_no}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^a-zA-Z0-9-]/g, ""); 
                                        setFormData((prev) => ({
                                            ...prev,
                                            invoice_no: value,
                                        }));
                                    }}
                                    className="border-2 border-[#F2F2F9] rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="Enter Here"
                                    required
                                />
                                {errors.invoice_no && (
                                    <span className="text-red-500 text-sm">{errors.invoice_no}</span>
                                )}
                            </div>


                            {/* Quantity */}
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-700 font-medium">
                                    Quantity<span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="inward_qty"
                                    minLength={""}
                                    maxLength={"5"}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/\D/g, ""); 
                                    }}
                                    value={formData.inward_qty}
                                    onChange={handleChange}
                                    
                                    className="border-2 border-[#F2F2F9] rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="Enter Here"
                                    required
                                />
                                {
                                    errors.inward_qty && <span className="text-red-500 text-sm">{errors.inward_qty}</span>
                                }
                            </div>

                            {/* Choose Gift */}
                            <div className="flex flex-col gap-2">
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
                                    className='border-2 border-[#F2F2F9] rounded-lg'
                                    styles={customStyles(true)}
                                    isLoading={loadingGiftItems}
                                    isDisabled={giftitemfilter.length === 0}
                                    placeholder={giftitemfilter.length === 0 ? "No Records Found" : "Select GiftItems"}
                                />

                                {errors.id_gift && (
                                    <span className="text-red-500 text-sm">{errors.id_gift}</span>
                                )}
                            </div>


                            <div className="flex flex-col gap-2 ">
                                <label className="text-gray-700 font-medium">
                                    Amount <span className='text-sm'>(Per Pcs)</span> <span className="text-red-400">*</span>
                                </label>

                                <div className="relative">
                                    <input
                                        type="text"
                                        name="price"
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/\D/g, ""); 
                                        }}
                                        value={formData.price}
                                        onChange={handleChange}
                                        onWheel={(e) => e.target.blur()}
                                        onKeyDown={(e) => {
                                            if (
                                                ["ArrowUp", "ArrowDown", "e", "E", "-"].includes(
                                                    e.key
                                                )
                                            ) {
                                                e.preventDefault();
                                            }
                                        }}
                                        className="border-2  border-[#F2F2F9]  rounded-md p-2 pl-12 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        placeholder="Enter Here"
                                        required
                                        style={{ height: inputHeight }}
                                    />
                                    <span className="absolute left-0 top-0 w-11 h-full px-3 flex items-center justify-center text-black border-r ">
                                        <IndianRupee size={16} />
                                    </span>
                                    {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
                                </div>

                            </div>

                            {/* GST Percentage */}
                            <div className="flex flex-col gap-2 ">
                                <label className="text-gray-700 font-medium">
                                    GST<span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
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
                                        onChange={handleChange}
                                        className="border-2  border-[#F2F2F9]  rounded-md p-2 pr-9 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        placeholder="Enter Here"
                                        required
                                    />
                                    <span className="absolute right-0 top-0 w-11 h-full px-3 flex items-center justify-center text-black ">
                                        <Percent size={16} />
                                    </span>
                                    {errors.gst_percenty && (
                                        <span className="text-red-500 text-sm">{errors.gst_percenty}</span>
                                    )}
                                </div>

                            </div>

                            {/* Total Price */}
                            {/* <div className="flex flex-col gap-2">
                                <label className="text-gray-700 font-medium">
                                    Total Price <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="total"
                                    value={formData.total}
                                    readOnly
                                    className="border-2  border-[#F2F2F9] rounded-md p-2 bg-[#f4f4f4] cursor-not-allowed w-full"
                                />
                            </div> */}

                            <div className="flex flex-col gap-2 ">
                                <label className="text-gray-700 font-medium">
                                    Total Price <span className="text-red-400">*</span>
                                </label>

                                <div className="relative">
                                <input
                                    type="number"
                                    name="total"
                                    value={formData.total}
                                    readOnly
                                      className="border-2  border-[#F2F2F9]  rounded-md p-2 pl-12 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                                    <span className="absolute left-0 top-0 w-11 h-full px-3 flex items-center justify-center text-black border-r ">
                                        <IndianRupee size={16} />
                                    </span>
                                </div>

                            </div>


                            {/* Customer Sell Price */}
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-700 font-medium ">
                                    Customer Sell Price<span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="cus_sellprice"
                                    value={formData.cus_sellprice}
                                    onChange={(e) => {
                                        if (e.target.value.length === 0) {
                                            setFormData(prev => ({ ...prev, cus_sellprice: "" }));
                                        } else {
                                            handleChange(e);
                                        }
                                    }}                                    
                                    className="border-2 border-[#F2F2F9] rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="Enter Here"
                                    required
                                />
                                {errors.cus_sellprice && (
                                    <span className="text-red-500 text-sm">{errors.cus_sellprice}</span>
                                )}
                            </div>


                        </div>

                        <div className='flex flex-row bg-white justify-end my-4'>
                            <div className='flex flex-row gap-4 justify-center'>
                                <button
                                    type='button'
                                    className='bg-[#E2E8F0] rounded-md px-[28px] py-2 text-black'
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    className='text-white text-center px-[28px] py-2 rounded-md'
                                    onClick={handleSubmit}
                                    style={{ backgroundColor: layout_color }}
                                >
                                    {isLoading ? <SpinLoading /> : id ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </div>
                </div >
                
            </div >
        </>
    )
}

export default GiftPurchaseForm