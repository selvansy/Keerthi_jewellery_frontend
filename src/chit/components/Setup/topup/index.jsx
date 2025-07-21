import React, { useDebugValue, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import SpinLoading from "../../common/spinLoading";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { addTopup, getTopupByClient } from "../../../api/Endpoints";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";

function Topup() {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_client = roledata?.id_client;

  const { id } = useParams();

  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [topData, setTopData] = useState({});

  const [formData, setFormData] = useState({
    SMS: true,
    WhatsApp: false,
    Email: false,
    limitRequest: 0,
    limitRate: 0,
    requestedAmount: 0,
    actualAmount: 0,
  });

  //api calls
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
      setFormData((prev) => ({
        ...prev,
        limitRate: topUpFileds?.data?.limitRate,
      }));
    }
  }, [topUpFileds]);

  useEffect(() => {
    if (formData?.SMS) {
      setFormData((prev) => ({
        ...prev,
        limitRequest: 0,
        requestedAmount: 0,
        actualAmount: topData?.SMS || 0,
        limitRate: topData?.limitRate,
      }));
    } else if (formData?.WhatsApp) {
      setFormData((prev) => ({
        ...prev,
        limitRequest: 0,
        requestedAmount: 0,
        actualAmount: topData?.WhatsApp || 0,
        limitRate: topData?.limitRate,
      }));
    } else if (formData?.Email) {
      setFormData((prev) => ({
        ...prev,
        limitRequest: 0,
        requestedAmount: 0,
        actualAmount: topData?.Email || 0,
        limitRate: topData?.limitRate,
      }));
    }
  }, [topData, formData.SMS, formData.WhatsApp, formData.Email]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const numericValue = value.replace(/\D/g, "");

    setFormData((prev) => {
      const updatedLimitRequest =
        name === "limitRequest" ? numericValue : prev.limitRequest;

      return {
        ...prev,
        [name]: numericValue,
        ...(name === "limitRequest" && {
          requestedAmount: updatedLimitRequest * prev.limitRate || 0,
        }),
      };
    });

    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleCancel = () => {
    setFormData({
      SMS: false,
      WhatsApp: false,
      Email: false,
      limitRequest: 0,
    });
  };

  const { mutate: addTopupMutate } = useMutation({
    mutationFn: (payload) => addTopup(payload),
    onSuccess: (response) => {
      if (response) {
        toast.success(response.message);
      }
      setIsLoading(false);
      setFormData({
        SMS: false,
        WhatsApp: false,
        Email: false,
        limitRequest: 0,
      });
    },
    onError: () => {
      setIsLoading(false);
      toast.error("Failed to add top-up");
    },
  });

  const validateForm = () => {
    const errors = {};

    if (!formData.limitRequest) {
      errors.limitRequest = "purchase limit is required";
    }

    if (!formData.limitRequest) {
      errors.limitRequest = "purchase limit is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);

    try {
      addTopupMutate(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      {/* <div className="flex flex-col p-4"> */}
      <>
        {/* <div className="flex flex-row justify-between items-center mb-4">
          <p className="text-sm text-gray-400 mt-4 mb-3">
            Settings / <span className="text-black">Top-Up</span>
          </p>
        </div> */}
        <Breadcrumb
        items={[
          { label: "Settings" },
          { label: "Topup", active: true },
        ]}
      />
        <div className="w-full flex flex-col bg-white border-[1px] rounded-[16px] p-4">
          <div className="flex flex-col p-4">
            <h2 className="text-lg font-semibold text-[#232323] ">Add Top-Up</h2>
            <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300 mb-10 mt-4">
              <div className="flex flex-col space-y-2 my-2">
                <label className="text-[#232323] mb-1 text-sm font-semibold">
                  Notifications Type<span className="text-red-400">*</span>
                </label>
                <div className="flex flex-row gap-6 justify-start">
                  {[
                    { label: "SMS", key: "SMS" },
                    // { label: "WhatsApp", key: "WhatsApp" },
                    // { label: "Email", key: "Email" },
                  ].map((notify_type) => (
                    <label
                      key={notify_type.key}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="notificationType"
                        checked={formData[notify_type.key]}
                        onChange={() => {
                          setFormData({
                            SMS: false,
                            WhatsApp: false,
                            // Email: false,
                            [notify_type.key]: true,
                          });
                        }}
                        className="hidden"
                      />

                      {/* <div
                        className={`w-5 h-5 border rounded-full flex items-center justify-center transition-colors duration-200 ${
                          formData[notify_type.key]
                            ? "bg-white border-[#023453]"
                            : "border-gray-400"
                        }`}
                      >
                        {formData[notify_type.key] ? (
                          <div className="w-[10px] h-[10px] bg-[#1e5d9a] border-[#F2F2F9] rounded-full"></div>
                        ):
                        (
                          <div className="w-[10px] h-[10px] border border-gray-400 rounded-full"></div>
                        )}
                      </div> */}
                      <div
                        className={`w-5 h-5 border rounded-full flex items-center justify-center transition-colors duration-200 ${
                          formData[notify_type.key]
                            ? "bg-white border-[#023453]"
                            : "border-gray-400"
                        }`}
                      >
                        <div
                          className={`w-[10px] h-[10px] rounded-full ${
                            formData[notify_type.key]
                              ? "bg-[#1e5d9a] border border-[#F2F2F9]"
                              : "border border-gray-400"
                          }`}
                        ></div>
                      </div>
                      <span className="text-gray-700">{notify_type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-[#232323] mb-1 text-sm font-semibold">
                  Purchase Limit<span className="text-red-400"> *</span>
                </label>
                <input
                  type="text"
                  name="limitRequest"
                  value={formData.limitRequest}
                  onChange={handleChange}
                  placeholder="Enter purchase limit"
                  maxLength={10}
                  className="w-full border-2 border-[#f2f3f8] rounded-md px-3 py-2"
                />

                {formErrors.limitRequest && (
                  <div className="text-red-500 text-sm">
                    {formErrors.limitRequest}
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-black mb-1 text-sm font-medium">
                  Availabe Limit
                  <span className="text-red-400"> *</span>
                </label>
                <input
                  type="text"
                  name="actualAmount"
                  value={formData.actualAmount}
                  onChange={handleChange}
                  minLength={"2"}
                  readOnly
                  placeholder="Enter available limit"
                  className="w-full border-2 border-[#f2f3f8] rounded-md px-3 py-2"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-black mb-1 text-sm font-medium">
                  Limit Rate<span className="text-red-400"> *</span>
                </label>
                <input
                  type="text"
                  name="limit_rate"
                  value={formData.limitRate}
                  onChange={handleChange}
                  minLength={"2"}
                  readOnly
                  placeholder="Enter limit rate"
                  className="w-full border-2 border-[#f2f3f8] rounded-md px-3 py-2"
                />
              </div>

              {/* <div className="flex flex-col space-y-2">
                  <label className="font-medium text-gray-700">
                    Payable Amount<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="number"
                    name="requestedAmount"
                    value={formData.requestedAmount}
                    onChange={handleChange}
                    readOnly
                    placeholder="Enter PayableAmount"
                    className="p-3 border bg-[#e5e7eb] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formErrors.requestedAmount && (
                    <div className="text-red-500 text-sm">
                      {formErrors.requestedAmount}
                    </div>
                  )}
                </div> */}
            </div>
            <div className="bg-white">
              <div className="flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className=" text-white rounded-md p-2 w-full lg:w-20"
                  style={{ backgroundColor: layout_color }}
                >
                  {isLoading ? <SpinLoading /> : id ? "Update" : "Save"}
                </button>
                 <button
                  type="button"
                  className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
                  onClick={handleCancel}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
      {/* </div> */}
    </>
  );
}

export default Topup;
