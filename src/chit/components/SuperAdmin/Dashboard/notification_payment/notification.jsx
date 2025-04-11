import React, { useState } from "react";
import whatsapp from "../../../../../assets/whatsapp.svg";
import sms from "../../../../../assets/sms.svg";
import email from "../../../../../assets/email.svg";

function NotificationCard() {
  const [cardData, setCardData] = useState(null);
  return (
    <div className="grid grid-cols-2  gap-4  ">
      <div className="bg-white rounded-[16px] pt-[20px] pb-[25px] px-[12px] border-2 border-[#F5F5F5] ">
        <div className="rounded-md">
          <img src={whatsapp} alt="whatsapp" className="h-[40px] w-[40px]" />
        </div>
        <div className="flex flex-col py-[12px] ms-1">
          <h5 className="text-2xl font-semibold">
            {cardData?.total_whatsapp || 0}
          </h5>
          <h5 className="text-[#6C7086] text-md mt-2">WhatsApp Limit</h5>
        </div>
      </div>

      <div className="bg-white rounded-[16px] pt-[20px] pb-[25px] px-[12px] border-2 border-[#F5F5F5]">
        <div className="rounded-md">
          <img src={sms} alt="sms" className="h-[40px] w-[40px]" />
        </div>
        <div className="flex flex-col py-[12px] ms-1">
          <h5 className="text-2xl font-semibold">{cardData?.total_sms || 0}</h5>
          <h5 className="text-[#6C7086] text-md mt-2">SMS Limit</h5>
        </div>
      </div>

     
    </div>
  );
}

export default NotificationCard;
