import React, { useEffect, useState } from "react";
import {
  createmetalrate,
  todaymetalrate,
  getallbranch,
  getallpuritytable,
} from "../../../api/Endpoints";
import gold24 from "../../../../assets/Gold 24.svg";
import silver from "../../../../assets/silver.svg";
import diamond from "../../../../assets/diamond.png";
import platinum from "../../../../assets/platinum.png";
import { IndianRupee } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatNumber } from "../../../utils/commonFunction";
import SpinLoading from "../../common/spinLoading";
import { closeModal } from "../../../../redux/modalSlice";
import Modal from "../../common/Modal";
import { openModal } from "../../../../redux/modalSlice";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";
import { customStyles } from "../scheme/AddScheme";

function MetalRateIndex({ refresh }) {
  const [purityData, setPurityData] = useState([]);
  const [metalValue, setMetalValue] = useState([]);
  const [formData, setFormData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [succNot, setSuccNot] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [branchId, setIdbranch] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [updateData, setUpdate] = useState(false);
  const [respnseData, setResponseData] = useState([]);
  const [key, setKey] = useState(0);
  const roledata = useSelector((state) => state.clientForm.roledata);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const metalImages = {
  1: gold24,    // Gold
  2: silver,    // Silver
  3: diamond,   // Diamond
  4: platinum,  // Platinum
  // default: defaultMetal // Default image for other metals
};

  const id_branch = roledata?.branch;
  const dispatch = useDispatch();

  const branch = roledata?.id_branch;

  useEffect(() => {
    if (!roledata) return;

    if (branchId === "") {
      setIdbranch(branch);
    }

    const data = {
      id_branch: id_branch === "0" ? branchId : branch,
    };

    getMetalRate(data);
  }, [roledata, branchId]);

  useEffect(() => {
    getallpuritytableMutate();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    let errors = {};
    purityData.forEach((item) => {
      const existingEntry = formData.find(
        (data) => data.purity_id._id === item._id
      );
      if (!existingEntry || existingEntry.rate === "") {
        errors[item._id] = "This field is required";
      }
    });

    setFormErrors(errors);
    const formValues = formData.map((e) => ({
      id_branch: branchId,
      purity_id: e.purity_id?._id,
      material_type_id: e.material_type_id?._id,
      metal_name: e.material_type_id?.metal_name,
      purity_name: e.purity_id?.purity_name,
      rate: e.rate,
    }));

    if (Object.keys(errors).length === 0) {
      setLoading(true);

      addMetalRate(formValues);
    }
  };

  const handleSuccess = () => {
    setLoading(false);
    setSuccNot(true);

    dispatch(
      openModal({
        modalType: "SUCCESS",
        header: "",
        formData: {
          message: "Metal Rate was added Successfully",
        },
      })
    );
    setTimeout(() => {
      setSuccNot(false);
      dispatch(closeModal());
    }, 1000);
  };

  const { data: branchresponse, isLoading: loadingbranch } = useQuery({
    queryKey: ["branch"],
    queryFn: getallbranch,
    enabled: id_branch === "0" || id_branch === 0,
  });

  useEffect(() => {
    if (branchresponse) {
      const data = branchresponse.data;
      const branch = data.map((branch) => ({
        value: branch._id,
        label: branch.branch_name,
      }));
      setBranchList(branch);
    }
  }, [branchresponse]);

  // mutation for gettig all purity
  const { mutate: getallpuritytableMutate } = useMutation({
    mutationFn: getallpuritytable,
    onSuccess: (response) => {
      if (response.data) {
        setPurityData(response.data);
      }
    },
    onError: (error) => {
      ;
    },
  });

  //mutationn for submit metalRate
  const { mutate: addMetalRate } = useMutation({
    mutationFn: (data) => createmetalrate(data),
    onSuccess: (response) => {
      refresh();
      // toast.success(response.message)
      setResponseData(response?.data?.data);
      handleSuccess();
      setIsOpen(false);
      setFormData(response.data);
      handleMetalRate(response.data);
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.response.data.message);
      ;
    },
  });

  useEffect(() => {
    const updatedArray = metalValue.map((metal) => {
      const match = respnseData.find((item) => item.purity_id === metal._id);

      return {
        ...metal,
        value: match ? match.rate : metal.value,
      };
    });

    
    setMetalValue(updatedArray);
  }, [respnseData]);

  const { mutate: getMetalRate } = useMutation({
    mutationFn: (data) => todaymetalrate(data),
    onSuccess: (response) => {
      if (response.data) {
        setFormData(response.data);
        handleMetalRate(response.data);
        setUpdate(true);
      }
    },
    onError: (error) => {
      ;
    },
  });

  useEffect(() => {
    if (formData) {
      const data = formData;
      const metalRate = data?.map((e) => ({
        name: e.material_type_id.metal_name,
        purity: e.purity_id.purity_name,
        value: e.rate,
        _id: e?.purity_id?._id,
      }));
      // 
      setMetalValue(metalRate);

      setUpdate(false);
    }
  }, [updateData]);

  const handleClear = () => {
    const data = {
      id_branch: id_branch === "0" ? branchId : branch,
    };

    getMetalRate(data);
  };

  const handleMetalRate = (data) => {
    const metalRate = data?.map((e) => ({
      name: e.material_type_id.metal_name,
      purity: e.purity_id.purity_name,
      value: e.rate,
    }));

    setMetalValue(metalRate);
  };

  const handleChange = (branch) => {
    setIdbranch(branch.value);
    getMetalRate({ id_branch: branch.value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const purityItem = purityData.find((item) => item._id === name);
      if (!purityItem) return prevData;

      const existingIndex = prevData.findIndex(
        (item) => item.purity_id._id === name
      );
      if (existingIndex !== -1) {
        const updatedData = [...prevData];
        updatedData[existingIndex].rate = Number(value);
        return updatedData;
      } else {
        return [
          ...prevData,
          {
            id_branch: id_branch === "0" ? branchId : branch,
            purity_id: purityItem,
            material_type_id: purityItem.id_metal,
            rate: Number(value),
          },
        ];
      }
    });

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() === "" ? "This field is required" : "",
    }));
  };

  return (
    <>
      <div>
        <Breadcrumb
          items={[{ label: "Masters" }, { label: "Metal Rate", active: true }]}
        />
      </div>
      <div className="flex flex-col p-1 -ml-1">
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {metalValue?.slice(0, 4).map((e) => {
    // Find the metal data to get the id_metal
    const metalData = formData.find(item => 
      item.purity_id?.purity_name === e.purity && 
      item.material_type_id?.metal_name === e.name
    );
    
    // Get the metal number (default to 5 if not found)
    const metalNumber = metalData?.material_type_id?.id_metal || 5;
    
    // Select the appropriate image
    const metalImage = metalImages[metalNumber] || metalImages.default;
    
    return (
      <div className="bg-white rounded-[16px] py-2 px-[10px] border border-[#F2F2F9]" key={e._id}>
        <div className="rounded-md">
          <img 
            src={metalImage} 
            alt={`${e.name} icon`} 
            className="h-[100px] w-[100px]"
          />
        </div>
        <div className="flex flex-col py-[6px] ms-1">
          <h3 className="text-lg text-[#232323] font-semibold">
            {e.purity} {e.name}/g
          </h3>
          <h5 className="text-[#6C7086] text-md"></h5>
          <h5 className="text-[#232323] text-sm font-semibold">
            {formatNumber({ value: e.value, decimalPlaces: 0 })}
          </h5>
        </div>
      </div>
    );
  })}
</div>

        <div className="w-full flex flex-col bg-white mt-7 overflow-y-auto scrollbar-hide  border border-[#F2F2F9] rounded-[16px]">
          <div className="flex flex-col p-6 relative ">
            <div className="flex flex-row justify-between py-2">
              <h5 className="text-lg text-[#232323] font-bold justify-between">
                Update Metal Rate
              </h5>
            </div>

            <div className="grid grid-rows-2 md:grid-cols-3 gap-5  border-gray-300 mb-10 mt-3 ">
              {id_branch === "0" && (
                <div className="flex flex-col mt-2">
                  <label className="text-[#232323] text-sm font-semibold mb-1">
                    Branch<span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Select
                      options={branchList}
                      value={
                        branchList.find(
                          (branch) => branch.value === branchId
                        ) || branch
                      }
                      onChange={handleChange}
                      styles={customStyles(true)}
                      isLoading={loadingbranch}
                      placeholder="Select Branch"
                      className="mt-1"
                      // className="border-2 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent border-[#F2F2F9]"
                    />
                    {formErrors.id_branch && (
                      <span className="text-red-500 text-sm mt-1">
                        {formErrors.id_branch}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {purityData.map((item, index) => (
                <div className="flex flex-col mt-2" key={index}>
                  <label className="text-[#232323] mb-2 text-sm font-semibold">
                    {`${item.id_metal?.metal_name} ( ${item?.purity_name} )`}/g
                    <span className="text-[#F04438]"> *</span>
                  </label>
                  <div className="relative w-full">
                    <span className="absolute left-0 top-0 h-full w-10 flex items-center justify-center text-black border-r-2 border-[#F2F2F9] ">
                      <IndianRupee size={16} />
                    </span>
                    <input
                      type="number"
                      name={item._id}
                      onChange={handleInputChange}
                      value={
                        formData.find((data) => data.purity_id._id === item._id)
                          ?.rate || ""
                      }
                      onWheel={(e) => e.target.blur()}
                      onKeyDown={(e) => {
                        if (
                          ["ArrowUp", "ArrowDown", "e", "E", "-"].includes(
                            e.key
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className="border-2 border-[#F2F2F9] rounded-lg p-2 w-full pl-12 focus:ring-1 focus:ring-[#004181] outline-none"
                      placeholder={`Enter ${item.purity_name} Rate`}
                    />
                  </div>

                  {formErrors[item._id] && (
                    <span className="text-red-500 text-sm mt-1">
                      {formErrors[item._id]}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div>
              <div className="flex justify-end gap-4">
                <button
                  className=" text-white text-sm rounded-lg h-[36px] w-full hover:bg-blue-800 md:w-24"
                  type="button"
                  disabled={isLoading}
                  onClick={handleSubmit}
                  style={{ backgroundColor: layout_color }}
                >
                  {isLoading ? <SpinLoading /> : "Update"}
                </button>
                <button
                  className="bg-[#E2E8F0] text-black text-sm rounded-lg h-[36px] w-full md:w-24"
                  type="button"
                  onClick={handleClear}
                >
                  Clear
                </button>
              </div>
            </div>
            <Modal />
          </div>
        </div>
      </div>
    </>
  );
}

export default MetalRateIndex;
