import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { X } from "lucide-react";
import {
  getmetalrateById,
  getBranchById,
  getallbranch,
  getbranchbyclient,
  updatemetalrate,
  createmetalrate,
} from "../../../api/Endpoints";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setbranchId, setid } from "../../../../redux/clientFormSlice";
import profileplaceholder from "../../../../../src/assets/profileplaceholder.png";
import { customSelectStyles } from "../../Setup/purity";
import Select from "react-select";

const CreateMetalRate = () => {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  let dispatch = useDispatch();
  const { id } = useParams();

  let navigate = useNavigate();
  // const id = useSelector((state) => state.clientForm.id);
  const roledata = useSelector((state) => state.clientForm.roledata);

  let admin = roledata?.id_role?.id_role;
  const id_branch = roledata?.branch;
  const branchId = roledata?.id_branch;

  const [typeOfScheme, setTypeOfScheme] = useState([]);
  const [branchdata, setBranchData] = useState([]);
  const [branch, setbranch] = useState("");

  const [formData, setFormData] = useState({
    goldrate_18ct: 0,
    goldrate_20ct: 0,
    goldrate_22ct: 0,
    goldrate_24ct: 0,
    silverrate_1gm: 0,
    goldcoin_1gm: 0,
    platinum_1gm: 0,
    diamond_1gm: 0,
    id_branch: branchId,
  });

  const [formErrors, setFormErrors] = useState({});
  const [logo, setLogo] = useState("Browse");
  const [logoPreview, setLogoPreview] = useState(null);

  const [desc_img, setdesc_image] = useState("Browse");
  const [descPreview, setdescPreview] = useState(null);

  // useEffect(() => {
  //   if (id) {
  //     fetchmetalrateById(id)
  //   }
  // }, [id])

  useEffect(() => {
    if (id_branch === "0" && admin === 2) {
      getallbranchmuate();
    }
  }, [id_branch]);

  // mutation functions
  const { mutate: getallbranchmuate } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      setBranchData(
        response.data.map((branch) => ({
          value: branch._id,
          label: branch.branch_name,
        }))
      );
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  // input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  //handle branch change
  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      id_branch: branchId,
    }));
  };

  //handle wheel
  const handleWheel = (e) => {
    e.target.blur();
  };

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (
      formData.goldrate_18ct === undefined ||
      formData.goldrate_18ct === null ||
      formData.goldrate_18ct <= 0
    )
      errors.goldrate_18ct = "Gold (18CT) Amount must be at least 1";

    if (
      formData.goldrate_20ct === undefined ||
      formData.goldrate_20ct === null ||
      formData.goldrate_20ct <= 0
    )
      errors.goldrate_20ct = "Gold (20CT) Amount must be at least 1";

    if (
      formData.goldrate_22ct === undefined ||
      formData.goldrate_22ct === null ||
      formData.goldrate_22ct <= 0
    )
      errors.goldrate_22ct = "Gold (22CT) Amount must be at least 1";

    if (
      formData.goldrate_24ct === undefined ||
      formData.goldrate_24ct === null ||
      formData.goldrate_24ct <= 0
    )
      errors.goldrate_24ct = "Gold (24CT) Amount must be at least 1";

    if (
      formData.goldcoin_1gm === undefined ||
      formData.goldcoin_1gm === null ||
      formData.goldcoin_1gm <= 0
    )
      errors.goldcoin_1gm = "Gold Coin Amount must be at least 1";

    if (
      formData.silverrate_1gm === undefined ||
      formData.silverrate_1gm === null ||
      formData.silverrate_1gm <= 0
    )
      errors.silverrate_1gm = "Silver Amount must be at least 1";

    if (
      formData.diamond_1gm === undefined ||
      formData.diamond_1gm === null ||
      formData.diamond_1gm <= 0
    )
      errors.diamond_1gm = "Diamond Amount must be at least 1";

    if (
      formData.platinum_1gm === undefined ||
      formData.platinum_1gm === null ||
      formData.platinum_1gm <= 0
    )
      errors.platinum_1gm = "Platinum Amount must be at least 1";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  //mutation to Create Metal Rate
  const { mutate: createmetalrateMutate } = useMutation({
    mutationFn: createmetalrate,
    onSuccess: (response) => {
      toast.success(response.message);
      setFormData({
        goldrate_18ct: 0,
        goldrate_20ct: 0,
        goldrate_22ct: 0,
        goldrate_24ct: 0,
        silverrate_1gm: 0,
        goldcoin_1gm: 0,
        platinum_1gm: 0,
        diamond_1gm: 0,
        id_branch: branchId,
      });
      navigate("/ourscheme/metalrate");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  //handle submit
  const handleSubmit = () => {
    if (!validateForm(formData)) {
      return;
    }
    const branch_id=id_branch==0?formData.id_branch:branchId
    setFormData((prev) => ({
      ...prev,
      id_branch: branch_id
    }));
    
    createmetalrateMutate(formData);
  };

  const handleCancle = () => {
    navigate("/ourscheme/metalrate");
  };

  //Edit form --------------------------

  //get metalrate by id
  const { mutate: fetchmetalrateById } = useMutation({
    mutationFn: getmetalrateById,
    onSuccess: (response) => {
      setFormData({
        goldrate_18ct: response.data.goldrate_18ct.$numberDecimal,
        goldrate_20ct: response.data.goldrate_20ct.$numberDecimal,
        goldrate_22ct: response.data.goldrate_22ct.$numberDecimal,
        goldrate_24ct: response.data.goldrate_24ct.$numberDecimal,
        silverrate_1gm: response.data.silverrate_1gm.$numberDecimal,
        goldcoin_1gm: response.data.goldcoin_1gm.$numberDecimal,
        platinum_1gm: response.data.platinum_1gm.$numberDecimal,
        diamond_1gm: response.data.diamond_1gm.$numberDecimal,
        id_branch: response.data.id_branch._id,
      });
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });

  //update metalrate
  const { mutate: updatemetalratemuate } = useMutation({
    mutationFn: updatemetalrate,
    onSuccess: (response) => {
      toast.success(response.message);
      handleRemoveLogo();
      handleRemovegoldrate_22ctImage();
      dispatch(setid(null));
      navigate("/ourscheme/metalrate");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  useEffect(() => {
    if (id) {
      fetchmetalrateById(id);
    }
  }, [id]);

  const handleUpdate = () => {
    if (!validateForm()) {
      toast.error("Fill required fields");
      return;
    }
    updatemetalratemuate({ id: id, data: formData });
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    const input = document.getElementById("main_image");
    if (input) input.value = "";
  };

  const handleRemovegoldrate_22ctImage = () => {
    setdesc_image(null);
    setdescPreview(null);
    const input = document.getElementById("desc_img");
    if (input) input.value = "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange1 = (e) => {
    const file = e.target.files[0];
    if (file) {
      setdesc_image(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setdescPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelect=(selectedOption)=>{
    setFormData((prev) => ({
      ...prev,
      id_branch: selectedOption ? selectedOption.value : "",
    }));
  
    setFormErrors((prev) => ({
      ...prev,
      id_branch: "",
    }));  
  }

  return (
    <>
      <div className="flex flex-row justify-between">
        {id ? (
          <h2 className="text-2xl text-[#023453] font-bold justify-between">
            Edit Scheme metalrate
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
            <div className="flex flex-col mt-2">
              <label className="text-black mb-2 font-normal">
                Gold (24CT) Amount<span className="text-red-400"> *</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="goldrate_24ct"
                  onChange={handleInputChange}
                  value={formData.goldrate_24ct}
                  onWheel={handleWheel}
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
                  placeholder="Enter Pending Due Installment"
                />
                <span
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}
                >
                  INR
                </span>
              </div>
              {formErrors.goldrate_24ct && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.goldrate_24ct}
                </span>
              )}
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-black mb-2 font-normal">
                Gold (22CT) Amount<span className="text-red-400"> *</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="goldrate_22ct"
                  onChange={handleInputChange}
                  value={formData.goldrate_22ct}
                  onWheel={handleWheel}
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
                  placeholder="Enter Pending Due Installment"
                />
                <span
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}
                >
                  INR
                </span>
              </div>
              {formErrors.goldrate_22ct && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.goldrate_22ct}
                </span>
              )}
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-black mb-2 font-normal">
                Gold (20CT) Amount<span className="text-red-400"> *</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="goldrate_20ct"
                  onChange={handleInputChange}
                  value={formData.goldrate_20ct}
                  onWheel={handleWheel}
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
                  placeholder="Enter Pending Due Installment"
                />
                <span
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}
                >
                  INR
                </span>
              </div>
              {formErrors.goldrate_20ct && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.goldrate_20ct}
                </span>
              )}
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-black mb-2 font-normal">
                Gold (18CT) Amount<span className="text-red-400"> *</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="goldrate_18ct"
                  onChange={handleInputChange}
                  value={formData.goldrate_18ct}
                  onWheel={handleWheel}
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
                  placeholder="Enter Pending Due Installment"
                />
                <span
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}
                >
                  INR
                </span>
              </div>
              {formErrors.goldrate_18ct && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.goldrate_18ct}
                </span>
              )}
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-black mb-2 font-normal">
                Gold Coin Amount<span className="text-red-400"> *</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="goldcoin_1gm"
                  onChange={handleInputChange}
                  value={formData.goldcoin_1gm}
                  onWheel={handleWheel}
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
                  placeholder="Enter Pending Due Installment"
                />
                <span
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}
                >
                  INR
                </span>
              </div>
              {formErrors.goldcoin_1gm && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.goldcoin_1gm}
                </span>
              )}
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-black mb-2 font-normal">
                Platinum Amount<span className="text-red-400"> *</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="platinum_1gm"
                  onChange={handleInputChange}
                  value={formData.platinum_1gm}
                  onWheel={handleWheel}
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
                  placeholder="Enter Pending Due Installment"
                />
                <span
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}
                >
                  INR
                </span>
              </div>
              {formErrors.platinum_1gm && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.platinum_1gm}
                </span>
              )}
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-black mb-2 font-normal">
                Diamond Amount<span className="text-red-400"> *</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="diamond_1gm"
                  onChange={handleInputChange}
                  value={formData.diamond_1gm}
                  onWheel={handleWheel}
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
                  placeholder="Enter Pending Due Installment"
                />
                <span
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}
                >
                  INR
                </span>
              </div>
              {formErrors.diamond_1gm && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.diamond_1gm}
                </span>
              )}
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-black mb-2 font-normal">
                Silver Amount<span className="text-red-400"> *</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="silverrate_1gm"
                  onChange={handleInputChange}
                  value={formData.silverrate_1gm}
                  onWheel={handleWheel}
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
                  placeholder="Enter Pending Due Installment"
                />
                <span
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}
                >
                  INR
                </span>
              </div>
              {formErrors.silverrate_1gm && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.silverrate_1gm}
                </span>
              )}
            </div>

            {id_branch == "0" && (
              <>
                <div className="flex flex-col">
                  <label className="text-gray-700 mb-2 mt-2 font-medium">
                    Branch<span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Select
                      name="id_branch"
                      options={branchdata}
                      value={branchdata.find(
                        (option) => option.value === formData.id_branch
                      )}
                      onChange={handleSelect}
                      placeholder="Select State"
                      styles={customSelectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />

                   
                  </div>
                  {formErrors.id_branch && (
                    <span className="text-red-500 text-sm mt-1">
                      {formErrors.id_branch}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="bg-white">
            <div className="flex justify-end gap-4">
              <button
                className="bg-[#E2E8F0] text-black rounded-md p-3 w-full lg:w-20"
                type="button"
                onClick={handleCancle}
              >
                Cancel
              </button>
              <button
                className="bg-[#61A375] text-white rounded-md p-2 w-full lg:w-20"
                type="button"
                onClick={id ? handleUpdate : handleSubmit}
              >
                {id ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateMetalRate;
