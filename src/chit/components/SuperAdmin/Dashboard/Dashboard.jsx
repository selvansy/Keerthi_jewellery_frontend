import React, { useEffect, useState } from "react";
import HeaderDashborder from "./top-section/headerDashborder";
import AccountReview from "./accountReview/accountReview";
import Select from "react-select";
import { customSelectStyles } from "../../Setup/purity";
import TEST from "./test";
import AccountStatus from "./accountReview/accountStatus";
import { useSelector } from "react-redux";
import {
  accountStats,
  getAllBranch,
  getbranchbyid,
} from "../../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import NotificationCard from "./notification_payment/notification";
import PaymentHistory from "./notification_payment/payment_history";
import ModeOfPayment from "./modeOfPayment/modeOfPayment";
import { customStyles } from "../../ourscheme/scheme/AddScheme";

function Dashboard() {
  const roleData = useSelector((state) => state.clientForm.roledata);
  const accessBranch = roleData?.branch;
  const [branch, setBranch] = useState(() => (accessBranch === "0" ? [] : {}));
  const [selectedBranch, setSelectedBranch] = useState("");

  useEffect(() => {
    if (!roleData) return;
    if (accessBranch !== "0") {
      getBranchData({ id: accessBranch });
    } else if (accessBranch == "0") {
      getAllBranches();
    }

    return () => {
      setSelectedBranch("");
    };
  }, [roleData]);

  //mutation to get branch by id
  const { mutate: getBranchData } = useMutation({
    mutationFn: (data) => getbranchbyid(data),
    onSuccess: (response) => {
      const { data } = response;
      setBranch({
        _id: data._id,
        branch_name: data.branch_name,
      });
      setSelectedBranch(data._id);
    },
    onError: (error) => {
      console.error("Error fetching branches:", error);
    },
  });

  //mutation to get all branches
  const { mutate: getAllBranches } = useMutation({
    mutationFn: () => getAllBranch(),
    onSuccess: (response) => {
      setBranch(
        response.data.map((branch) => ({
          value: branch._id,
          label: branch.branch_name,
        }))
      );
    },
    onError: (error) => {
      console.error("Error fetching branches:", error);
    },
  });

  return (
    <div className="px-1 -ml-2">
      {/* branch selection */}
      <div className="flex justify-end">
        {accessBranch == "0" && branch.length > 0 ? (
          <div>
          <Select
            isClearable={true}
            className="mt-2 min-w-[190px]"
            styles={customStyles(true)}
            options={branch || []}
            placeholder="Over All"
            value={branch.find((option) => option.value === selectedBranch) || null}
            onChange={(option) => {
              // Handle both selected and cleared values
              setSelectedBranch(option ? option.value : null);
            }}
          />
        </div>        
        ) : (
          <div>
            <label className="block text-sm text-gray-500 font-medium mb-1 mt-3">
              Branch <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              disabled
              value={branch?.branch_name || ""}
              className="w-full border rounded-md px-3 py-2 text-gray-500"
            />
          </div>
        )}
      </div>

      {/* top section */}
      <div className="mb-[10px]">
        <HeaderDashborder id_branch={selectedBranch} />
      </div>

      {/* Account Review and account status */}
      <div className="grid grid-cols-1 xl:grid-cols-7 gap-2 mb-[9px] ">
        <div className="md:col-span-4 mr-3 ">
          <AccountReview id_branch={selectedBranch} />
        </div>
        <div className="md:col-span-3 ">
          <AccountStatus id_branch={selectedBranch} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full">
  {/* Left side: Notification + PaymentHistory */}
  <div className="w-full md:w-4/5 p-2 -ml-2">
    <div className="bg-white p-4 mb-4 border-[1px] border-[#F5F5F5] rounded-[20px]">
      <h2 className="font-bold text-xl p-4 text-[#232323]">Notification Limits</h2>
      <NotificationCard  />
    </div>
    <div className="bg-white p-4 border-[1px] border-[#F5F5F5] rounded-[20px] mt-[10px]">
      <PaymentHistory id_branch={selectedBranch}/>
    </div>
  </div>

  {/* Right side: ModeOfPayment */}
  <div className="md:w-3/5 p-3"> 
    <div className="bg-white p-4 h-full border-[1px] border-[#F5F5F5] -mt-1 rounded-[20px]">
      <ModeOfPayment id_branch={selectedBranch}/>
    </div>
  </div>
</div>

    </div>
  );
}

export default Dashboard;
