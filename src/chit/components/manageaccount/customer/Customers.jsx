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

    const { id } = useParams();
    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    useEffect(() => {
        setOpenAcc(isCustomer ? ["existingCus"] : ["customer"]);
    }, [isCustomer]);

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
                                    Add Customer
                                </AccordionTrigger>
                                <AccordionContent className="px-6 py-4 text-[16px]">
                                    <CustomerForm />
                                </AccordionContent>
                            </AccordionItem>

                            {!id && (
                                <AccordionItem value="join-scheme" className="border rounded-lg bg-white my-3">
                                    <AccordionTrigger className="px-6 py-4 text-[18px]">
                                        Join Scheme
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 py-4 text-[16px]">
                                        <AddSchemeAccount />
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

export default Customers;
