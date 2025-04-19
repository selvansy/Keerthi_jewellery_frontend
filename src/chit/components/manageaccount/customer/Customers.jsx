import React, { useState, useEffect, useMemo } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../../../../../components/ui/accordion";
import CustomerForm from "./CustomerForm";
import { ExistingCustomer } from "../schemeaccount/SchemeAccountform";
import AddSchemeAccount from "../schemeaccount/SchemeAccountform";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function Customers() {

    const [isCustomer, setIsCustomer] = useState(false);
    const [openAcc, setOpenAcc] = useState(["customer"]);
    const [joinScheme, setJoinScheme] = useState(["add-customer"]);
  
    const [id_proof, setIdProof] = useState(null);
    const [cus_img, setCusImg] = useState("");
    const [pathurl, setPathurl] = useState("");

    const roledata = useSelector((state) => state.clientForm.roledata);
    const branch = roledata?.id_branch;
    const layoutColor = useSelector((state) => state.clientForm.layoutColor);
    const { id } = useParams();
   
    const initialCustomerData = useMemo(() => ({
        firstname: "",
        lastname: "",
        mobile: "",
        gender: 1,
        pan:"",
        address: "",
        id_branch: branch || "",
        id_country: "",
        id_state: "",
        id_city: "",
        date_of_wed: "",
        date_of_birth: "",
        pincode: "",
        authorno: "",
        password:"",
        confirmpassword:""
    }), [roledata]);
     
    const [cusData, setCusData] = useState(initialCustomerData);
   console.log(cusData,'gj')

    const handleCusData = (data)=>{
        setCusData(prev => ({
            ...prev,
            customerId: data,
        }))
    }

    useEffect(() => {
        if (branch !== "0") {
            setCusData((prev) => ({ ...prev, id_branch: branch }));
        }
    }, [roledata]);

    useEffect(() => {
        setOpenAcc(isCustomer ? ["existingCus"] : ["customer"]);
    }, [isCustomer]);

    const handleClear = () => {
        setCusImg("");
        setPathurl("");
        setIdProof(null);
        setCusData(initialCustomerData);
    };

    const handleToggleCustomer = (value) => setIsCustomer(value);

    return (
        <div className="flex flex-col">
            {!id && (
                <div className="flex items-center bg-gray-200 my-6 border border-black rounded-xxl w-fit mt-3">
                    {["Customer", "Existing Customer"].map((label, index) => (
                        <button
                            key={label}
                            onClick={() => handleToggleCustomer(index === 1)}
                            className={`px-4 py-1 transition-all ${isCustomer === (index === 1) ? `bg-[${layoutColor}] text-white` : "bg-gray-300 text-gray-700 dark:bg-white dark:text-black"} ${index === 0 ? "rounded-l-lg" : "rounded-r-lg"}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}

            <Accordion type="multiple" className="space-y-4" value={openAcc} onValueChange={setOpenAcc}>
                {isCustomer ? (
                    <>
                        <AccordionItem value="existingCus" className="border rounded-lg bg-white">
                            <AccordionTrigger className="px-6 py-4">Existing Customer</AccordionTrigger>
                            <AccordionContent className="px-6 py-4 text-[16px]">
                                <ExistingCustomer setCusData={setCusData} handleCusData={handleCusData} />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="join-scheme" className="border rounded-lg bg-white my-3">
                            <AccordionTrigger className="px-6 py-4 text-[18px]">Join Scheme</AccordionTrigger>
                            <AccordionContent className="px-6 py-4 text-[16px]">
                                <AddSchemeAccount cusData={cusData} handleClear={handleClear} />
                            </AccordionContent>
                        </AccordionItem>
                    </>
                ) : (
                    <Accordion type="multiple" value={joinScheme} onValueChange={setJoinScheme}>
                        <AccordionItem value="add-customer" className="border rounded-lg bg-white">
                            <AccordionTrigger className="px-6 py-4 text-[18px]">{id ? "Edit Customer" : "Add Customer"}</AccordionTrigger>
                            <AccordionContent className="px-6 py-4 text-[16px]">
                                <CustomerForm 
                                    setCusData={setCusData} 
                                    id={id} 
                                    cusData={cusData}
                                    // setAddCusData={setAddCusData}
                                    id_proof={id_proof} 
                                    setIdProof={setIdProof}
                                    cus_img={cus_img} 
                                    pathurl={pathurl} 
                                    setCusImg={setCusImg} 
                                    setPathurl={setPathurl}
                                    handleClear={handleClear} 
                                    handleCusData={handleCusData}
                                />
                            </AccordionContent>
                        </AccordionItem>

                        {!id && (
                            <AccordionItem value="join-scheme" className="border rounded-lg bg-white my-3">
                                <AccordionTrigger className="px-6 py-4 text-[18px]">Join Scheme</AccordionTrigger>
                                <AccordionContent className="px-6 py-4 text-[16px]">
                                    <AddSchemeAccount cusData={cusData} />
                                </AccordionContent>
                            </AccordionItem>
                        )}
                    </Accordion>
                )}
            </Accordion>
        </div>
    );
}

export default Customers;
