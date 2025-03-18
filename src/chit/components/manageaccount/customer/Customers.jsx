import React, { useState, useEffect } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../../../../../components/ui/accordion";
import CustomerForm from './CustomerForm';
import { ExistingCustomer } from '../schemeaccount/SchemeAccountform';
import AddSchemeAccount from '../schemeaccount/SchemeAccountform';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

function Customers() {

    const [isCustomer, setIsCustomer] = useState(false);
    const [openAcc, setOpenAcc] = useState(["customer"]);
    const [joinScheme, setJoinScheme] = useState(["add-customer"]);

    const roledata = useSelector((state) => state.clientForm.roledata);

    const id_branch = roledata?.branch;
    const [cusData, setCusData] = useState({})
    const [addCusData, setaddCusData] = useState({
        firstname: "",
        lastname: "",
        mobile: "",
        gender: "",
        address: "",
        id_branch: "",
        id_country: "",
        id_state: "",
        id_city: "",
        date_of_wed: "",
        date_of_birth: "",
        pincode: "",
        authorno: "",

    });

    useEffect(() => {
        if (!roledata) return;
        if (id_branch !== "0") {
            setaddCusData((prev) => ({
                ...prev,
                id_branch: id_branch,
            }));
     
        }
    }, [roledata, id_branch]);




    const [id_proof, setid_proof] = useState(null);
    const [cus_img, setcus_img] = useState("");
    const [pathurl, setPathurl] = useState("");

    const { id } = useParams();
    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    const handleClear = () => {
        setcus_img("")
        setPathurl("")
        setid_proof(null)
        setaddCusData({
            firstname: "",
            lastname: "",
            mobile: "",
            gender: "",
            address: "",
            whatsapp: "",
            id_branch: "",
            id_country: "",
            id_state: "",
            id_city: "",
            date_of_wed: "",
            pan: "",
            date_of_birth: "",
            pincode: "",
            authorno: "",
        })

    }

    useEffect(() => {
        setOpenAcc(isCustomer ? ["existingCus"] : ["customer"]);
    }, [isCustomer]);

    return (
        <div className='flex flex-col'>
            {
                !id && (
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
                )
            }

            <Accordion
                type="multiple"
                className="space-y-4"
                value={openAcc}
                onValueChange={(value) => setOpenAcc(value)}
            >
                {!isCustomer ? (
                    <>
                        <Accordion
                            type="multiple"
                            value={joinScheme}
                            onValueChange={(value) => setJoinScheme(value)}
                        >
                            <AccordionItem value="add-customer" className="border rounded-lg bg-white">
                                <AccordionTrigger className="px-6 py-4 text-[18px]">
                                    {id ? "Edit Customer" : " Add Customer"}
                                </AccordionTrigger>
                                <AccordionContent className="px-6 py-4 text-[16px]">
                                    <CustomerForm setCusData={setCusData} id={id} addCusData={addCusData}
                                        setaddCusData={setaddCusData} id_proof={id_proof} setid_proof={setid_proof}
                                        cus_img={cus_img} pathurl={pathurl} setcus_img={setcus_img} setPathurl={setPathurl}
                                        handleClear={handleClear} />
                                </AccordionContent>
                            </AccordionItem>

                            {!id && (
                                <AccordionItem value="join-scheme" className="border rounded-lg bg-white my-3">
                                    <AccordionTrigger className="px-6 py-4 text-[18px]">
                                        Join Scheme
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 py-4 text-[16px]">
                                        <AddSchemeAccount cusData={cusData} />
                                    </AccordionContent>
                                </AccordionItem>
                            )}
                        </Accordion>
                    </>
                ) : (
                    <>
                        <AccordionItem value="existingCus" className="border rounded-lg bg-white">
                            <AccordionTrigger className="px-6 py-4">
                                Existing Customer
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 text-[16px]">
                                <ExistingCustomer setCusData={setCusData} />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="join-scheme" className="border rounded-lg bg-white my-3">
                            <AccordionTrigger className="px-6 py-4 text-[18px]">
                                Join Scheme
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 text-[16px]">
                                <AddSchemeAccount cusData={cusData} handleClear={handleClear} />
                            </AccordionContent>
                        </AccordionItem>
                    </>
                )}
            </Accordion>
        </div>
    )
}

export default Customers;
