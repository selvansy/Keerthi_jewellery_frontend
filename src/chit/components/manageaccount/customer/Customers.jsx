
import React, { useState, useEffect, useRef } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../../../../../components/ui/accordion";
import CustomerForm from './CustomerForm';
import AddSchemeAccount from '../schemeaccount/SchemeAccountform';
import { searchcustomermobile, getallbranch } from '../../../api/Endpoints'
import { Search } from 'lucide-react'
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import Select from "react-select";
import { customSelectStyles } from "../../Setup/purity/index"
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

function Customers() {

    const [isCustomer, setIsCustomer] = useState(false);
    const [openAcc, setOpenAcc] = useState("customer");
    const [joinScheme, setJoinScheme] = useState("add-customer")

    const { id } = useParams()

    useEffect(() => {

        setOpenAcc(isCustomer ? "existingCus" : "customer");
    }, [isCustomer]);

    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    return (

        <div className='flex flex-col'>
            <div className="flex items-center bg-gray-200 my-6 border border-black rounded-xxl w-fit mt-3">
                <button
                    onClick={() => setIsCustomer(false)}
                    className={`px-4 py-1 transition-all ${!isCustomer ? `bg-[${layout_color}] text-white` : "rounded-l-lg bg-gray-300 text-gray-700 dark:bg-white dark:text-black"
                        }`}
                >
                    Customer
                </button>
                <button
                    onClick={() => setIsCustomer(true)}
                    className={`px-4 py-1 transition-all ${isCustomer ? `bg-[${layout_color}] text-white` : "rounded-r-lg  bg-gray-300 text-gray-700 dark:bg-white dark:text-black"
                        }`}
                >
                    Existing Customer
                </button>

            </div>

            <Accordion
                type="single"
                collapsible
                className="space-y-4"
                value={openAcc}
                onValueChange={(value) => setOpenAcc(value || (isCustomer ? "existingCus" : "customer"))}
            >
                {!isCustomer ? (
                    <>
                        <Accordion type="single" collapsible
                            value={joinScheme}
                            onValueChange={(value) => setJoinScheme(value)}>
                            <AccordionItem value="add-customer" className="border rounded-lg bg-white">
                                <AccordionTrigger className="px-6 py-4 text-[18px]">
                                    Add Customer
                                </AccordionTrigger>
                                <AccordionContent className="px-6 py-4 text-[16px]">
                                    <CustomerForm />
                                </AccordionContent>
                            </AccordionItem>

                            {
                                !id && (
                                    <AccordionItem value="join-scheme" className="border rounded-lg bg-white my-3">
                                        <AccordionTrigger className="px-6 py-4 text-[18px]">
                                            Join Scheme
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6 py-4 text-[16px]">
                                            <AddSchemeAccount />
                                        </AccordionContent>
                                    </AccordionItem>


                                )
                            }
                        </Accordion>
                    </>
                ) : (
                    <>
                        <AccordionItem value="existingCus" className="border rounded-lg bg-white">
                            <AccordionTrigger className="px-6 py-4">
                                Existing Customer
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 text-[16px]">
                                <ExistingCustomer />
                            </AccordionContent>
                        </AccordionItem>

                        
                                <AccordionItem value="join-scheme" className="border rounded-lg bg-white my-3">
                                    <AccordionTrigger className="px-6 py-4 text-[18px]">
                                        Join Scheme
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 py-4 text-[16px]">
                                        <AddSchemeAccount />
                                    </AccordionContent>
                                </AccordionItem>
                    </>
                )}
            </Accordion>
        </div>
    )
}

export default Customers



export function ExistingCustomer() {

    const layout_color = useSelector((state) => state.clientForm.layoutColor);
    const roledata = useSelector((state) => state.clientForm.roledata);
    const id_branch = roledata?.branch;

    const [isLoading, setLoading] = useState(false)
    const [formData, setFormData] = useState({})
    const [branch, setBranch] = useState(id_branch)
    const [branchData, setBranchData] = useState([])



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
            setBranchData(branch);
        }

    }, [branchresponse])

    const handleSearchmobile = () => {
        setLoading(true)
        handlesearchcustomer({ id_branch: formData.id_branch, search_mobile: formData.mobile });

    };


    const { mutate: handlesearchcustomer } = useMutation({
        mutationFn: searchcustomermobile,
        onSuccess: (response) => {
            if (response) {
                setFormData(prev => ({
                    ...prev,
                    customer_name: response.data.firstname + ' ' + response.data.lastname
                }));
            }
            toast.success(response.message)
            setLoading(false)
        },
        onError: (error) => {

            toast.error(error?.response?.data?.message)
            setLoading(false)
        }
    });

    return (

        <div className='grid grid-rows-2 md:grid-cols-2 gap-2'>
            <div className='flex flex-col'>
                <label className='text-black mb-1 font-normal'>Branch<span className='text-red-400'>*</span></label>
                <Select
                    name='id_branch'
                    options={branchData}
                    value={branchData.find(branch => branch.value === formData.id_branch) || ""}
                    onChange={(branch) => {

                        setFormData(prev => ({
                            ...prev,
                            id_branch: branch.value
                        }))
                        setBranch(branch.value)
                    }}
                    customSelectStyles={customSelectStyles}
                    isLoading={loadingbranch}
                    placeholder="Select Branch"
                />

            </div>

            <div className='flex flex-col relative'>
                <label className='text-black mb-1 font-normal'>Search Mobile Number<span className='text-red-400'>*</span></label>
                <input
                    type='text'
                    value={formData.mobile}
                    onChange={(e) => {
                        const value = e.target.value;
                        setFormData(prev => ({
                            ...prev,
                            mobile: value
                        }))
                    }}
                    name='mobile'
                    onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                    pattern="\d{10}"
                    maxLength={"10"}
                    className='border-2 border-gray-300 rounded-md p-2  focus:border-transparent'
                    placeholder='Enter Here'
                />

                {/* Search Icon */}
                <div onClick={handleSearchmobile} className="absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[70%] -translate-y-1/2 w-10 md:h-[42px] md:top-[50px] h-[20%] sm:right-0 sm:top-[68%] lg:right-[0%]"
                    style={{ backgroundColor: layout_color }}>
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                        <Search size={15} className="text-white" />
                    )}
                </div>
            </div>

            <div className='flex flex-col'>
                <label className='text-black mb-1 font-normal'>Customer Name<span className='text-red-400'>*</span></label>
                <input
                    readOnly
                    type='text'
                    name='customer_name'
                    value={formData.customer_name}
                    className='border-2 w-full bg-[#e8f0fe] border-gray-300 cursor-not-allowed rounded-md p-2 pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    placeholder='Enter name'
                />
            </div>
        </div>
    )
}



