import React, { useEffect, useState } from "react";
import customer from "../../../../../assets/Total_Customer.svg";
import Total_Account from "../../../../../assets/Total_Account.svg";
import overDue from "../../../../../assets/dashboard/overDue.svg";
import payment from "../../../../../assets/dashboard/payment.svg";
import { getOverAllDashboard } from "../../../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import { formatNumber } from "../../../../utils/commonFunction";
import { formatDecimal } from "../../../../utils/commonFunction";

function HeaderDashborder({ id_branch }) {
  const initialState = {
    totalAccounts: 0,
    totalCustomers: 0,
    totalGoldSave: 0,
    totalAmount: 0,
    overDues: 0,
  };
  const [cardData, setCardData] = useState(initialState);

  useEffect(() => {
    getOverAll(id_branch ?? "");
  }, [id_branch]);

  const { mutate: getOverAll } = useMutation({
    mutationFn: (id_branch) => getOverAllDashboard(id_branch),
    onSuccess: (response) => {
      setCardData(response.data);
    },
    onError: (error) => {
        setCardData(initialState)
    },
  });

  const cards = [
    {
      title: "Total Customers",
      subTitle: "Total Accounts",
      value: cardData.totalCustomers || 0,
      sub_Value: cardData.totalAccounts || 0,
      image: customer,
    },
    {
      title: "Total Gold Savings",
      value: `${formatDecimal(cardData.totalGoldSave)} g` || 0,
      image: Total_Account,
    },
    {
      title: "Total Overdue",
      value: cardData.overDues || 0,
      image: overDue,
    },
    {
      title: "Total Payment",
      value: cardData.totalAmount || 0,
      image: payment,
    },
  ];

  return (
    <div className="flex flex-col gap-5 py-3 overflow-y-auto scrollbar-hide">
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 text-[#232323]">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[20px] p-4 border-[1px] border-[#F5F5F5] flex flex-col gap-4"
          >
            <img src={card.image} alt={card.title} className="h-10 w-10" />
            <div className="flex flex-col gap-1">
              {card.subTitle && card.sub_Value !== undefined ? (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col items-start">
                      <p className="text-xl font-bold">{card.sub_Value}</p>
                      <p className="text-[#6C7086] text-sm font-medium">
                        {card.subTitle}
                      </p>
                    </div>
                    <div className="text-[#F5F5F5] text-xl font-semibold border-s-2 border-[#F5F5F5] h-[50px]"></div>
                    <div className="flex flex-col items-start">
                      <p className="text-xl font-semibold"> {card.value} </p>
                      <p className="text-[#6C7086] text-sm font-medium">
                        {card.title}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xl font-bold">
                    {card.title == "Total Payment"
                      ? formatNumber({ value: card.value, decimalPlaces: 0 })
                      : card.value}
                  </p>
                  <p className="text-[#6C7086] text-sm font-medium">
                    {card.title}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HeaderDashborder;
