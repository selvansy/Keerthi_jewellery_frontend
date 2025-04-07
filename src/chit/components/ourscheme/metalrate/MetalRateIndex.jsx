import React, { useEffect, useState } from "react";
import {
  createmetalrate,
  todaymetalrate,
  getallbranch,
  getallpuritytable,
} from "../../../api/Endpoints";
import gold24 from "../../../../assets/Gold 24.svg";
import gold22 from "../../../../assets/Gold 22.svg";
import gold18 from "../../../../assets/Gold 18.svg";
import silver from "../../../../assets/silver.svg";
import { CookingPot, IndianRupee, Triangle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { customSelectStyles } from "../../../components/Setup/purity/index";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatNumber } from "../../../utils/commonFunction";
import SpinLoading from "../../common/spinLoading";
import { closeModal } from "../../../../redux/modalSlice";
import Modal from "../../common/Modal";
import ModelOne from "../../common/Modelone";
import { openModal } from "../../../../redux/modalSlice";
import Down from "../../../../assets/down.svg";
import UP from "../../../../assets/up.svg";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";

function MetalRateIndex() {
  const [purityData, setPurityData] = useState([]);
  const [metalValue, setMetalValue] = useState([]);
  const [formData, setFormData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [succNot, setSuccNot] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [branchId, setIdbranch] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [updateData, setUpdate] = useState(false);
  const roledata = useSelector((state) => state.clientForm.roledata);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

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
  
  useEffect(()=>{
    getallpuritytableMutate();
  },[])

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
      purity_id: e.purity_id._id,
      material_type_id: e.material_type_id._id,
      rate: e.rate,
    }));

    if (Object.keys(errors).length === 0) {
      setLoading(true);

      addMetalRate(formValues);
    }

    // if (Object.keys(errors).length === 0) {
    //     const filteredData = formData.map(({ _id, active, is_deleted, createdAt, updatedAt, ...rest }) => rest);
    //     addMetalRate(filteredData)
    // }
  };

  const handleSuccess = () => {
    setLoading(false);
    setSuccNot(true);

    dispatch(
      openModal({
        modalType: "SUCCESS",
        header: "",
        formData: {
          message: "The metalRate was added Successfully",
        },
      })
    );
    setTimeout(() => {
      setSuccNot(false);
      dispatch(closeModal());
    }, 2500);
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
      console.log(error.response.data);
    },
  });

  //mutationn for submit metalRate
  const { mutate: addMetalRate } = useMutation({
    mutationFn: (data) => createmetalrate(data),
    onSuccess: (response) => {
      // toast.success(response.message)
      handleSuccess();
      setIsOpen(false);
      setFormData(response.data);
      handleMetalRate(response.data);
    },

    onError: (error) => {
      setLoading(false);
      toast.error(error.response.data.message);
      console.log(error.response.data);
    },
  });

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
      console.log(error.response.data);
    },
  });

  useEffect(() => {
    if (formData) {
      const data = formData;
      const metalRate = data?.map((e) => ({
        name: e.material_type_id.metal_name,
        purity: e.purity_id.purity_name,
        value: e.rate,
      }));

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
        console.log( {
          id_branch: id_branch === "0" ? branchId : branch,
          purity_id: name,
          material_type_id: purityItem.id_metal,
          rate:  Number(value),
        },)
        return [
          ...prevData,
          {
            id_branch: id_branch === "0" ? branchId : branch,
            purity_id: purityItem,
            material_type_id: purityItem.id_metal,
            rate:  Number(value),
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
        <Breadcrumb items={[
            { label: "Masters" },
            { label: "Metal Rate",active:true },
            
        ]}/>
    </div>
      <div className="flex flex-col p-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metalValue?.slice(0,4).map((e) => (
            <div className="bg-white rounded-[16px] py-2 px-[10px] border border-[#F2F2F9]">
              {/* <div className="flex justify-end">
                <span className="min-w-[54px] bg-[#DCFDEC] me-2 px-2.5 py-2 font-semibold rounded-[40px] text-[#159B5A] flex items-center">
                  + ₹12{" "}
                  <img src={UP} alt="" className="h-[10px] w-[10px] ml-1" />
                </span>
              </div> */}

              <div className="rounded-md">
                {e.name !== "Silver" ? (
                  <img
                    src={gold24}
                    alt="gold24"
                    className="h-[100px] w-[100px]"
                  />
                ) : (
                  <img
                    src={silver}
                    alt="silver"
                    className="h-[90px] w-[90px]"
                  />
                )}
              </div>
              <div className="flex flex-col py-[6px] ms-1">
                <h3 className="text-xl font-semibold">
                  {e.purity} {e.name}/g
                </h3>
                <h5 className="text-[#6C7086] text-md"></h5>
                <h5 className="text-[#282829] text-md font-medium">
                  {formatNumber({ value: e.value, decimalPlaces: 0 })}
                </h5>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full flex flex-col bg-white mt-8 overflow-y-auto scrollbar-hide  border border-[#F2F2F9] rounded-[16px]">
          <div className="flex flex-col p-4  relative  ">
            <div className="flex flex-row justify-between py-7">
              <h5 className="text-lg text-[#282829] font-bold justify-between">
                Update Metal Rate
              </h5>
            </div>

            <div className="grid grid-rows-2 md:grid-cols-3 gap-5  border-gray-300 mb-10 ">
              {id_branch === "0" && (
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-1 font-medium">
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
                      styles={customSelectStyles(true)}
                      isLoading={loadingbranch}
                      placeholder="Select Branch"
                      className="border-1 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent border-[#F2F2F9]"
                    />

                    {/* <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                            <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                                                <path d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div> */}
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
                  <label className="text-black mb-2 font-semibold">
                    {`${item.id_metal.metal_name} ( ${item.purity_name} )`}/g
                    <span className="text-[#F04438]"> *</span>
                  </label>
                  <div className="relative w-full">
                    <span className="absolute left-0 top-0 h-full w-10 flex items-center justify-center text-black border-r-2 border-[#F2F2F9]">
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
                      className="border-2 border-[#F2F2F9] rounded-md p-2 w-full pl-12 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
                  className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-24"
                  type="button"
                  onClick={handleClear}
                >
                  Clear
                </button>
                <button
                  className=" text-white rounded-md p-2 w-full lg:w-24"
                  type="button"
                  disabled={isLoading}
                  onClick={handleSubmit}
                  style={{ backgroundColor: layout_color }}
                >
                  {isLoading ? <SpinLoading /> : "Update"}
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
