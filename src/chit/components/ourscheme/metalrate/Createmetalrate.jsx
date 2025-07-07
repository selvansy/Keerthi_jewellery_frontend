import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { X } from "lucide-react";
import {
  createmetalrate,
  getallpurity,
  schemepaymenttodayrate,
} from "../../../api/Endpoints";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setbranchId, setid } from "../../../../redux/clientFormSlice";
import profileplaceholder from "../../../../../src/assets/profileplaceholder.png";
import { customSelectStyles } from "../../Setup/purity";
import Select from "react-select";
import { date } from "yup";

const CreateMetalRate = () => {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const { id } = useParams();

  let navigate = useNavigate();
  // const id = useSelector((state) => state.clientForm.id);
  const roledata = useSelector((state) => state.clientForm.roledata);

  const id_branch = roledata?.branch;
  const branchId = roledata?.id_branch;

  const [branchdata, setBranchData] = useState([]);
  const [purityData,setPurityData] = useState([])
  const [formData, setFormData] = useState([]);
  const [seletedBranch,setSeletedBranches]=useState('')
  const [formErrors,setFormErrors]=useState({})

  // mutation for gettig all purity
  const { mutate: getallpuritytableMutate } = useMutation({
    mutationFn: () => getallpurity(),
    onSuccess: (response) => {
      if (response.data) {
        setPurityData(response.data)
      }
    },
    onError: (error) => {
      ;
    },
  });

  // mutation for geting current metal rate
  const { mutate: getMetalRate } = useMutation({
    mutationFn: (data) => schemepaymenttodayrate(data),
    onSuccess: (response) => {
      setFormData(response.data)
    },

    onError: (error) => {
      ;
    },
  });

  //mutationn for submit metalRate
  const { mutate: addMetalRate } = useMutation({
    mutationFn: (data) => createmetalrate(data),
    onSuccess: (response) => {
      if(response){
        toast.success(response.message)
        navigate('/masters/metalrate')
      }
    },

    onError: (error) => {
      toast.error(error.response.data.message)
      ;
    },
  });

  useEffect(() => {
    if (!roledata) return; 
  
    const data = {
      date: new Date(),
      id_branch: id_branch === "0" ? seletedBranch : branchId,
    };
  
    getallpuritytableMutate();
    getMetalRate(data);
  }, [roledata]); 
  
  const handleInputChange = (e) => {
    const { name, value } = e.target; 

    setFormData((prevData) => {
      const purityItem = purityData.find((item) => item._id === name);

      if (!purityItem) return prevData; 

      const existingIndex = prevData.findIndex((item) => item.purity_id === name);

      if (existingIndex !== -1) {
        const updatedData = [...prevData];
        updatedData[existingIndex].rate =  Number(value);
        return updatedData;
      } else {
        return [
          ...prevData,
          {
            id_branch: id_branch === "0" ? seletedBranch : branchId,
            purity_id: name,
            material_type_id: purityItem.id_metal._id, 
            rate: value,
          },
        ];
      }
    });
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() === "" ? "This field is required" : "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let errors = {};
    purityData.forEach((item) => {
      const existingEntry = formData.find((data) => data.purity_id === item._id);
      if (!existingEntry || existingEntry.rate === "") {
        errors[item._id] = "This field is required";
      }
    });

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      const filteredData = formData.map(({ _id,active,is_deleted,createdAt,updatedAt, ...rest }) => rest);
      addMetalRate(filteredData)
    }
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        {id ? (
          <h2 className="text-2xl text-[#023453] font-bold justify-between">
            Edit Metal Rate
          </h2>
        ) : (
          <h2 className="text-2xl text-[#023453] font-bold justify-between">
            Create Metal Rate
          </h2>
        )}
      </div>
      <div className="w-full flex flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]">
        <div className="flex flex-col p-4 bg-white relative">
          <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300 mb-10">
            {id_branch == "0" && (
              <>
                <div className="flex flex-col">
                  <label className="text-gray-700 mb-2 mt-2 font-medium">
                    Branch<span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Select
                      name="id_branch"
                      // options={branchdata}
                      // value={branchdata.find(
                      //   (option) => option.value === formData.id_branch
                      // )}
                      // onChange={handleSelect}
                      placeholder="Select State"
                      styles={customSelectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                  {/* {formErrors.id_branch && (
                    <span className="text-red-500 text-sm mt-1">
                      {formErrors.id_branch}
                    </span>
                  )} */}
                </div>
              </>
            )} 
            
          {purityData.map((item,index)=>(
             <div className="flex flex-col mt-2" key={index}>
             <label className="text-black mb-2 font-normal">
               {`${item.id_metal.metal_name} ( ${item.purity_name} )`} Rate<span className="text-red-400"> *</span>
             </label>
             <div className="relative">
               <input
               type="number"
               name={item._id}
               onChange={handleInputChange}
               value={formData.find((data) => data.purity_id === item._id)?.rate || ""}
                 onWheel={(e)=>e.target.blur()}
                 onKeyDown={(e) => {
                   if (
                     e.key === "ArrowUp" ||
                     e.key === "ArrowDown" ||
                     e.key === "e" ||
                     e.key === "E" ||
                     e.key === "-"
                   ) {
                     e.preventDefault();
                   }
                 }}
                 className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                 placeholder={`Enter ${item.purity_name} Rate`}
               />
               <span
                 className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                 style={{ backgroundColor: layout_color }}
               >
                 INR
               </span>
             </div>
             {formErrors[item._id] && (
            <span className="text-red-500 text-sm mt-1">{formErrors[item._id]}
            </span>
          )}
           </div>
          ))}

         
          </div>
          <div className="bg-white">
            <div className="flex justify-end gap-4">
              <button
                className="bg-[#E2E8F0] text-black rounded-md p-3 w-full lg:w-20"
                type="button"
                // onClick={handleCancle}
              >
                Cancel
              </button>
              <button
                className="bg-[#61A375] text-white rounded-md p-2 w-full lg:w-20"
                type="button"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateMetalRate;
