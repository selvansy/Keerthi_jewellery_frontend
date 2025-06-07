import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getfaqCat, getAllfaq } from "../../api/Endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../../../../components/ui/accordion";
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";

function FaqTable() {
    const [activeCategory, setActiveCategory] = useState("");
    const [faqItems, setFaqItems] = useState([]);
    const [openQuestion, setOpenQuestion] = useState("");
    
    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    // Fetch categories
    const { data: categoryresponse } = useQuery({
        queryKey: ["categories"],
        queryFn: getfaqCat,
    });

    // Set initial category only once
    useEffect(() => {
        if (categoryresponse?.data?.length > 0 && !activeCategory) {
            setActiveCategory(categoryresponse.data[0].id);
        }
    }, [categoryresponse]);

    // Fetch FAQ items
    const { mutate: getAllfaqItems } = useMutation({
        mutationFn: (payload) => getAllfaq(payload),
        onSuccess: (response) => {
            setFaqItems(response.data);
        },
        onError: () => {
            setFaqItems([]);
        },
    });

    useEffect(() => {
        if (activeCategory) {
            getAllfaqItems({
                page: 1,
                from_date: "",
                to_date: "",
                limit: 10,
                search: "",
                category: activeCategory,
            });
        }
    }, [activeCategory]);

    return (
        <>
        <Breadcrumb
                  items={[{ label: "Help" }, { label: "FAQ", active: true }]}
                />
        <div className="bg-white text-black min-h-screen">
            <div className="w-full mx-auto p-6 border-[1px] rounded-[16px]">
            <h1 className="text-xl font-bold  text-center mb-6">Frequently asked questions?</h1>

            <div className="max-w-3xl mx-auto">
                <h2 className="text-md font-bold text-center mb-4">
                    {categoryresponse?.data?.find((cat) => cat.id === activeCategory)?.name || "FAQs"}
                </h2>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {categoryresponse?.data?.map((category) => (
                        <button
                            key={category.id}
                            style={activeCategory === category.id ? { backgroundColor: layout_color, color: "white" } : {}}
                            className={`px-4 py-2 border rounded-lg transition ${
                                activeCategory === category.id ? "font-semibold" : "text-[#232323] text-sm font-semibold hover:bg-gray-200"
                            }`}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* FAQ Accordion */}
                <Accordion type="single" value={openQuestion} onValueChange={setOpenQuestion}>
                    {faqItems.length > 0 ? (
                        faqItems.map((item) => (
                            <AccordionItem key={item._id} value={String(item._id)} className="border rounded-lg bg-white">
                                <AccordionTrigger className="px-6 py-4 text-[18px]">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="px-6 py-4 text-[16px]">
                                    <ReactQuill value={item.answer} readOnly={true} theme="bubble" />
                                </AccordionContent>
                            </AccordionItem>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No FAQs available for this category.</p>
                    )}
                </Accordion>
            </div>
            </div>
        </div>
        </>
    );
}

export default FaqTable;
