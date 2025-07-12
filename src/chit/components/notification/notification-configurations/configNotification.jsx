import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { notificationConfig, getConfig } from "../../../api/Endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";
import SpinLoading from "../../common/spinLoading";

const ConfigNotification = () => {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  // const avl = ["pushNotification", "sms", "whatsapp"];
    const avl = ["pushNotification"];
    const head = ["push Notification"];
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    pushNotification: { schemeWise: {}, wishes: {} },
    sms: { schemeWise: {}, wishes: {}  },
    whatsapp: { schemeWise: {}, wishes: {}},
    // email: { schemeWise: {}, wishes: {}},
  });

  const { data: configurationData, isLoading: loadingConfig } = useQuery({
    queryKey: ["config"],
    queryFn: getConfig,
  });

  const mappings = {
    schemeWise: {
      paymentProceed: "Payment Proceed",
      schemeJoining: "Scheme Joining",
      schemeCompletion: "Scheme Completion",
      schemeClose: "Scheme Close",
      schemeReferral: "Scheme Referral",
      walletAmountRedeem: "Wallet Amount Redeem",
      overdue: "Over-Due Notification",
    },
    wishes: {
      birthday: "Birthday",
      weddingAnniversary: "Wedding Anniversary",
    },
    // product: {
    //   newArrival: "New Arrival",
    // },
  };

  // Function to transform API data
  const transformData = (configData, mapping) => {
    if (!configData) return {};
    return Object.keys(mapping).reduce((acc, key) => {
      acc[mapping[key]] = configData[key] ?? false;
      return acc;
    }, {});
  };

  const handleFetch = ()=>{
    if (!configurationData?.data) return;

    setSelectedOptions(() => {
      const updatedOptions = {};

      avl.forEach((key) => {
        const configData = configurationData?.data?.[key]?.settings || {};
        updatedOptions[key] = {
          schemeWise: transformData(configData.schemeWise, mappings.schemeWise),
          wishes: transformData(configData.wishes, mappings.wishes),
          // product: transformData(configData.product, mappings.product),
        };
      });

      return updatedOptions;
    });
  }


  useEffect(() => {
    handleFetch()
  }, [configurationData]);

  const handleOptionToggle = (category, option) => {
    const key = avl[activeTab];

    setSelectedOptions((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [category]: {
          ...prev[key][category],
          [option]: !prev[key][category][option],
        },
      },
    }));
  };

  const handleSubmit = () => {
    setIsLoading(true);
  
    const buildSettings = (key, category) =>
      Object.keys(mappings[category]).reduce((acc, settingKey) => {
        acc[settingKey] = selectedOptions[key]?.[category]?.[mappings[category][settingKey]] || false;
        return acc;
      }, {});
  
    const payload = {
      active: true,
    };
  
    avl.forEach((key) => {
      payload[key] = {
        enabled: Object.values(selectedOptions[key].schemeWise).some(Boolean) ||
                  Object.values(selectedOptions[key].wishes).some(Boolean),
                  // Object.values(selectedOptions[key].product).some(Boolean),
        settings: {
          schemeWise: buildSettings(key, "schemeWise"),
          wishes: buildSettings(key, "wishes"),
          // product: buildSettings(key, "product"),
        },
      };
    });
  
    handleConfig(payload);
  };

  const { mutate: handleConfig } = useMutation({
    mutationFn: (data) => notificationConfig(data),
    onSuccess: (response) => {
      if (response?.data) {
        toast.success("Configuration Submitted Successfully!");

        setSelectedOptions(() => {
          const updatedOptions = {};

          avl.forEach((key) => {
            const configData = response?.data?.[key]?.settings || {};
            updatedOptions[key] = {
              schemeWise: transformData(configData.schemeWise, mappings.schemeWise),
              wishes: transformData(configData.wishes, mappings.wishes),
              // product: transformData(configData.product, mappings.product),
            };
          });

          return updatedOptions;
        });
      }
      setIsLoading(false);
    },
    onError: () => {
      toast.error("Failed to submit configuration!");
      setIsLoading(false);
    },
  });



  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-xl font-bold mb-4">Setup Configuration</h1>

      {loadingConfig ? (
        <SpinLoading />
      ) : (
        <>
          {/* Notification Tabs */}
          <div className="flex border-b mb-6">
            {avl.map((tab, index) => (
              <button
                key={tab}
                className={`py-2 px-4 ${activeTab === index
                    ? "text-blue-900 border-b-2 border-blue-900 font-medium"
                    : "text-black"
                  }`}
                onClick={() => setActiveTab(index)}
              >
                {head[index].toUpperCase()}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-medium mb-2">
              Scheme Wise<span className="text-red-500">*</span>
            </h2>
            <div className="grid grid-cols-5 mt-5">
              {Object.values(mappings.schemeWise).map((option) => (
                <div key={option} className="flex items-center my-5">
                  <input
                    type="checkbox"
                    id={option.replace(/\s+/g, "")}
                    checked={selectedOptions[avl[activeTab]]?.schemeWise[option] || false}
                    onChange={() => handleOptionToggle("schemeWise", option)}
                    className="w-4 h-4 cursor-pointer text-blue-900 rounded border-gray-300 focus:ring-blue-900"
                  />
                  <label htmlFor={option.replace(/\s+/g, "")} className="ml-2 text-sm text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Wishes Section */}
          <div className="mb-6">
            <h2 className="text-sm font-medium mb-2">
              Wishes<span className="text-red-500">*</span>
            </h2>
            <div className="flex gap-4">
              {Object.values(mappings.wishes).map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={option.replace(/\s+/g, "")}
                    checked={selectedOptions[avl[activeTab]]?.wishes[option] || false}
                    onChange={() => handleOptionToggle("wishes", option)}
                    className="w-4 h-4 cursor-pointer text-blue-900 rounded border-gray-300 focus:ring-blue-900"
                  />
                  <label htmlFor={option.replace(/\s+/g, "")} className="ml-2 text-sm text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Section */}
          {/* <div className="mb-6">
            <h2 className="text-sm font-medium mb-2">
              Product<span className="text-red-500">*</span>
            </h2>
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="NewArrival"
                  checked={selectedOptions[avl[activeTab]]?.product["New Arrival"] || false}
                  onChange={() => handleOptionToggle("product", "New Arrival")}
                  className="w-4 h-4 cursor-pointer text-blue-900 rounded border-gray-300 focus:ring-blue-900"
                />
                <label htmlFor="NewArrival" className="ml-2 text-sm text-gray-700">
                  New Arrival
                </label>
              </div>
            </div>
          </div> */}

          {/* Buttons */}
          <div className="flex flex-row justify-end border-t-2 p-3 mt-8">
            <div className="flex flex-row gap-4 justify-center">
              <button
                className="text-white w-24 h-[36px] text-center text-sm font-semibold rounded-lg"
                style={{ backgroundColor: layout_color || "#007BFF" }}
                disabled={isLoading}
                onClick={handleSubmit}
              >
                Save
              </button>
              <button className="bg-[#E2E8F0] rounded-lg w-24 h-[36px] text-sm text-black" onClick={handleFetch}>Cancel</button>
              
            </div>
          </div>
        </>
      )}
    </div>

  );
};

export default ConfigNotification;
