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

function FaqTable() {
    const [activeCategory, setActiveCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [openQuestion, setOpenQuestion] = useState("");
    const [faqItems, setFaqItems] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);

    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    // Fetch FAQ items
    const { mutate: getAllfaqItems } = useMutation({
        mutationFn: (payload) => getAllfaq(payload),
        onSuccess: (response) => {
            setFaqItems(response.data);
        },
        onError: (error) => {
            setFaqItems([]);
            console.log(error);
        },
    });



    useEffect(() => {
        getAllfaqItems({
            page: 1,
            from_date: "",
            to_date: "",
            limit: 10,
            search: "",
            category: activeCategory
        })
    }, [activeCategory]);

    // Fetch categories
    const { data: categoryresponse } = useQuery({
        queryKey: ["category"],
        queryFn: getfaqCat,
    });

    useEffect(() => {

        if (categoryresponse) {
            setCategories(categoryresponse.data);
            if (categoryresponse.data.length > 0) {
                setActiveCategory(categoryresponse.data[0].id);
            }
        } else {
            setCategories([]);
        }
    }, [categoryresponse]);



    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };


    return (
        <div className="bg-white text-black min-h-screen p-8">
            {/* FAQ Heading */}
            <h1 className="text-4xl font-bold text-center mb-6">FAQS</h1>



            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-4">
                    {categories.find((cat) => cat.id === activeCategory)?.name}
                </h2>


                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            style={activeCategory === category.id ? { backgroundColor: layout_color, color: "white" } : {}}
                            className={`px-4 py-2 border rounded-md transition ${activeCategory === category.id
                                ? "font-semibold"
                                : "border-black text-black hover:bg-gray-200"
                                }`}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                <Accordion 
            type="single" 
            value={openQuestion} 
            onValueChange={setOpenQuestion}
           
        >
            {faqItems.length > 0 ? (
                faqItems.map((item, index) => (
                    <AccordionItem 
                        key={index} 
                        value={item.question} 
                        className="border rounded-lg bg-white"
                    >
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
    );
}

export default FaqTable;
