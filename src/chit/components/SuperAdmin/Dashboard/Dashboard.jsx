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
    <div className="px-4">
      {/* branch selection */}
      <div className="flex justify-end">
        {accessBranch == "0" && branch.length > 0 ? (
          <div>
            <Select
              className="mt-2 min-w-[190px]"
              styles={customSelectStyles(true)}
              options={branch || []}
              placeholder="Over All"
              value={branch.find((option) => option.value === selectedBranch)}
              onChange={(option) => {
                setSelectedBranch(option.value);
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
      <div>
        <HeaderDashborder id_branch={selectedBranch} />
      </div>

      {/* Account Review and account status */}
      <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">
        <div className="md:col-span-4">
          <AccountReview id_branch={selectedBranch} />
        </div>
        <div className=" md:col-span-3">
          <AccountStatus id_branch={selectedBranch} />
        </div>
      </div>

      <div className="flex w-full">
        {/* Left side: Notification + PaymentHistory */}
        <div className="w-4/5 p-2">
          <div className="bg-white p-4 mb-4 border-2 border-[#F5F5F5] rounded-[20px]">
            <h2 className="font-semibold text-xl p-4">Notification Limits</h2>
            <NotificationCard />
          </div>
          <div className="bg-white p-4 border-2 border-[#F5F5F5] rounded-[16px]">
            <PaymentHistory />
          </div>
        </div>

        {/* Right side: ModeOfPayment */}
        <div className="w-2/3 p-2 ">
          <div className="bg-white p-4 h-full border-2 border-[#F5F5F5] rounded-[16px]">
            <ModeOfPayment />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
