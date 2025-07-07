import React, { useEffect, useState } from "react";
import whatsapp from "../../../../../assets/whatsapp.svg";
import sms from "../../../../../assets/sms.svg";
import email from "../../../../../assets/email.svg";
import { getTopupByClient } from "../../../../api/Endpoints";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

function NotificationCard() {
  const [topupData, setTopData] = useState(null);
  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_client = roledata?.id_client;

   const { data: topUpFileds } = useQuery({
      queryKey: ["branch", id_client],
      queryFn: () => {
        return getTopupByClient(id_client);
      },
      enabled: !!id_client,
    });
    useEffect(() => {
      if (topUpFileds) {
        setTopData(topUpFileds.data);
      }
    }, [topUpFileds]);

  return (
    <div className="grid grid-cols-2  gap-4 text-[#232323] text-sm">
      {/* <div className="bg-white rounded-[16px] py-[20px] pl-[10px] border-[1px] border-[#F5F5F5]  ">
        <div className="rounded-md pb-3">
          <img src={whatsapp} alt="whatsapp" className="h-[40px] w-[40px]" />
        </div>
        <div className="flex flex-col py-[8px] ms-1">
          <h5 className="text-xl font-bold">
            {topupData?.WhatsApp || 0}
          </h5>
          <h5 className="text-[#6C7086] text-md font-medium">WhatsApp Limit</h5>
        </div>
      </div> */}

      <div className="bg-white rounded-[16px] py-[20px] pl-[10px] border-[1px] border-[#F5F5F5]">
        <div className="rounded-md pb-3">
          <img src={sms} alt="sms" className="h-[40px] w-[40px]" />
        </div>
        <div className="flex flex-col py-[8px] ms-1">
          <h5 className="text-xl font-bold">{topupData?.SMS || 0}</h5>
          <h5 className="text-[#6C7086] text-md  font-medium">SMS Limit</h5>
        </div>
      </div>

     
    </div>
  );
}

export default NotificationCard;
