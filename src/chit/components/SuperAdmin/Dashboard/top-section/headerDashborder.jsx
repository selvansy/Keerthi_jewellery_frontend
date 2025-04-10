import React from "react";
import customer from "../../../../../assets/Total_Customer.svg";
import Total_Account from "../../../../../assets/Total_Account.svg";
import overDue from "../../../../../assets/dashboard/overDue.svg";
import payment from "../../../../../assets/dashboard/payment.svg";

function HeaderDashborder() {
  const cardData = {
    total_account: 120,
    total_complete: 80,
    total_closed: 40,
    total_Customers: 30,
  };

  const cards = [
    {
      title: "Total Customer",
      subTitle: "Total Accounts",
      value: cardData.total_account || 0,
      sub_Value: cardData.total_Customers || 0,
      image: customer,
    },
    {
      title: "Total Gold Savings",
      value: cardData.total_account || 0,
      image: Total_Account,
    },
    {
      title: "Total Overdue",
      value: cardData.total_complete || 0,
      image: overDue,
    },
    {
      title: "Total Payment",
      value: cardData.total_closed || 0,
      image: payment,
    },
  ];

  return (
    <div className="flex flex-col gap-5 py-3 overflow-y-auto scrollbar-hide">
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 border-2 border-[#F5F5F5] flex flex-col gap-4"
          >
            <img src={card.image} alt={card.title} className="h-10 w-10" />
            <div className="flex flex-col gap-1">
              {card.subTitle && card.sub_Value !== undefined ? (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col items-start">
                      <p className="text-2xl font-semibold">{card.sub_Value}</p>
                      <p className="text-[#6C7086] text-sm font-medium">
                        {card.subTitle}
                      </p>
                    </div>
                    <div className="text-[#F5F5F5] text-xl font-semibold border-s-2 boder-[#F5F5F5] h-[50px]"></div>
                    <div className="flex flex-col items-start">
                      <p className="text-2xl font-semibold">{card.value}</p>
                      <p className="text-[#6C7086] text-sm font-medium">
                        {card.title}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-2xl font-semibold">{card.value}</p>
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
