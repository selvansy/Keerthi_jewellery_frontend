import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/modalSlice";
import { eventEmitter } from "../../../utils/EventEmitter";
import { getgiftvendorbranchById } from "../../api/Endpoints";
import Barcode from "react-barcode";
import Table from "./Table";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const Modal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen, modalType, header, formData, buttons } = useSelector(
    (state) => state.modal
  );

  const [localFormData, setLocalFormData] = useState(formData || {});
  const [activeTab, setActiveTab] = useState("userInfo");
  const [isLoading, setisLoading] = useState(false);
  useEffect(() => {
    setLocalFormData(formData || {});
  }, [formData]);

  // const handleVendorChange = async (e) => {

  //     const selectedBranchId = e.target.value;
  //     if (!selectedBranchId) return;
  //     const response = await getgiftvendorbranchById({ "id_branch": selectedBranchId });
  //     if (response) {
  //         setVendor(response.data);
  //     }
  // };

  const handleInputChange = (e) => {
    const { name, type, value, files } = e.target;
    setLocalFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));

    if (name === "id_client" && modalType === "USER_ACCESS") {
      eventEmitter.emit("CLIENT_SELECTED", value);
    }
    if (name === "id_branch" && modalType === "USER_ACCESS") {
      eventEmitter.emit("BRANCH_SELECTED", value);
    }
  };

  const handleSubmit = () => {
    switch (modalType) {
      case "CONFIRMATION":
        eventEmitter.emit(`${modalType}_SUBMIT`, formData);
        if (formData.redirectTo) {
          navigate(formData.redirectTo);
        }
        dispatch(closeModal());
        break;
      case "SUCCESS":
        eventEmitter.emit(`${modalType}_SUBMIT`, formData);
        dispatch(closeModal());
        break;
      case "SENDCONFIRMATION":
        eventEmitter.emit(`${modalType}_SUBMIT`, formData);
        dispatch(closeModal());
        break;
      case "EDIT_PROJECT":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      case "ADD_PROJECT":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      case "BARCODE":
        window.print();
        dispatch(closeModal());
        break;
      case "USER_ACCESS":
        if (activeTab === "userInfo") {
          eventEmitter.emit("NEXT");
          setActiveTab("roles");
        } else if (activeTab === "roles") {
          eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
          dispatch(closeModal());
        }
        break;
      case "DROP_NOTIFICATION":
      case "EDIT_MENU":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      case "ADD_MENU":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      case "EDIT_SUBMENU":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      case "ADD_SUBMENU":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      case "ADD_USERROLE":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      case "EDIT_USERROLE":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      case "ADD_STAFFUSERROLE":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      case "EDIT_STAFFUSERROLE":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      case "ADD_PAYMENTMODE":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      case "EDIT_PAYMENTMODE":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      case "ADD_PURITY":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      case "EDIT_PURITY":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      case "ADD_SCHEMETYPE":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      case "EDIT_SCHEMETYPE":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      case "ADD_METAL":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      case "EDIT_METAL":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      case "ADD_GIFTITEM":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      case "EDIT_GIFTITEM":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      case "ADD_GIFTVENDOR":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      case "EDIT_GIFTVENDOR":
        eventEmitter.emit(`${modalType}_SUBMIT`, localFormData);
        dispatch(closeModal());
        break;
      default:
        ;
        dispatch(closeModal());
    }
  };

  const handleCancel = () => {
    if (modalType === "CONFIRMATION") {
      if (modalType === "CONFIRMATION" && formData.onCancel) {
        formData.onCancel();
      } else if (modalType === "CONFIRMATION" && formData.onCancelRedirect) {
        navigate(formData.onCancelRedirect);
      }
      dispatch(closeModal());

      if (modalType === "NAVIGATION") {
        dispatch(closeModal());
      }
    } else if (modalType === "SUCCESS") {
      dispatch(closeModal());
    } else if (modalType === "SENDCONFIRMATION") {
      dispatch(closeModal());
    } else if (modalType === "ADD_PROJECT") {
      dispatch(closeModal());
    } else if (modalType === "ADD_GIFTITEM") {
      dispatch(closeModal());
    } else if (modalType === "ADD_GIFTVENDOR") {
      dispatch(closeModal());
    } else if (modalType === "ADD_MENU") {
      dispatch(closeModal());
    } else if (modalType === "ADD_SUBMENU") {
      dispatch(closeModal());
    } else if (modalType === "ADD_USERROLE") {
      dispatch(closeModal());
    } else if (modalType === "ADD_METAL") {
      dispatch(closeModal());
    } else if (modalType === "ADD_PURITY") {
      dispatch(closeModal());
    } else if (modalType === "ADD_PAYMENTMODE") {
      dispatch(closeModal());
    } else if (modalType === "ADD_SCHEMETYPE") {
      dispatch(closeModal());
    } else if (modalType === "ADD_STAFFUSERROLE") {
      dispatch(closeModal());
    } else if (activeTab === "roles") {
      setActiveTab("userInfo");
    } else if (modalType === "LEDGER_MODAL") {
      dispatch(closeModal());
    } else {
      dispatch(closeModal());
    }
  };

  ;

  const renderForm = () => {
    switch (modalType) {
      case "BARCODE":
        return (
          <div className="flex justify-center">
            <Barcode value={formData.barcodeData} />
          </div>
        );
      case "DROP_NOTIFICATION":
        return (
          <form className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">
                Title<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={localFormData.title || ""}
                onChange={handleInputChange}
                placeholder="Enter Title"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">
                Image<span className="text-red-400">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                  className="hidden"
                  id="image"
                  accept="image/*"
                  required
                />
                <label htmlFor="image" className="cursor-pointer">
                  {localFormData.image
                    ? localFormData.image.name
                    : "Click to upload or drag and drop an image"}
                </label>
                {localFormData.image && (
                  <img
                    src={URL.createObjectURL(localFormData.image)}
                    alt="Preview"
                    className="mt-2 max-w-[200px] max-h-[200px] object-contain mx-auto"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">
                Description<span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={localFormData.description || ""}
                onChange={handleInputChange}
                placeholder="Enter Description"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
          </form>
        );

      case "NAVIGATION":
        return (
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-[#6C7086]">
              {formData.message}
            </p>
          </div>
        );

      case "CONFIRMATION":
        return (
          <div className="text-start py-4 px-4">
            <p className="text-sm font-semibold text-[#6C7086]">
              {formData.message}
            </p>
          </div>
        );

      case "SUCCESS":
        return (
          <div className="text-center px-4">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full mt-4 bg-green-500">
              <RiVerifiedBadgeFill className="text-white text-4xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">
              {formData.message}
            </h3>
          </div>
        );

      case "SENDCONFIRMATION":
        return (
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                strokeLinejoin="round"
                className="lucide lucide-message-circle-reply"
              >
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                <path d="m10 15-3-3 3-3" />
                <path d="M7 12h7a2 2 0 0 1 2 2v1" />
              </svg>
            </div>
            <p className="text-sm text-[#6C7086]">{formData.message}</p>
          </div>
        );
      case "EDIT_GIFTVENDOR":
        return (
          <form className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">
                Branch<span className="text-red-400">*</span>
              </label>
              <select
                name="id_branch"
                value={localFormData.id_branch || ""}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Branch</option>
                {formData.branchfilter.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.branch_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">
                Gift Vendor Name<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="vendor_name"
                value={localFormData.vendor_name || ""}
                onChange={handleInputChange}
                placeholder="Enter Gift Vendor Name"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">
                Address<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={localFormData.address || ""}
                onChange={handleInputChange}
                placeholder="Enter Address"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">
                Mobile<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="mobile"
                value={localFormData.mobile || ""}
                onChange={handleInputChange}
                placeholder="Enter Mobile"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">
                Gst Number<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="gst"
                value={localFormData.gst || ""}
                onChange={handleInputChange}
                placeholder="Enter Gst Number"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </form>
        );
      case "ADD_GIFTVENDOR":
        return (
          <form className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">
                Branch<span className="text-red-400">*</span>
              </label>
              <select
                name="id_branch"
                value={localFormData.id_branch || ""}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Branch</option>
                {formData.branchfilter.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.branch_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">
                Gift Vendor Name<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="vendor_name"
                value={localFormData.vendor_name || ""}
                onChange={handleInputChange}
                placeholder="Enter Gift Vendor Name"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">
                Address<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={localFormData.address || ""}
                onChange={handleInputChange}
                placeholder="Enter Address"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">
                Mobile<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="mobile"
                value={localFormData.mobile || ""}
                onChange={handleInputChange}
                placeholder="Enter Mobile"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">
                Gst Number<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="gst"
                value={localFormData.gst || ""}
                onChange={handleInputChange}
                placeholder="Enter Gst Number"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </form>
        );
      case "LEDGER_MODAL":
        return (
          <div className="flex justify-center flex-col">
            <div className="bg-[#f5f5dc] mb-2 p-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700">
                    Customer Name{" "}
                  </p>
                  <p className="text-sm">
                    {localFormData?.customer_name || "N/A"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700">
                    Mobile Number
                  </p>
                  <p className="text-sm">{localFormData?.mobile || "N/A"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700">
                    Scheme Type
                  </p>
                  <p className="text-sm">
                    {localFormData?.scheme_typename || "N/A"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700">
                    Classification
                  </p>
                  <p className="text-sm">
                    {localFormData?.classification_name || "N/A"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700">
                    Scheme Name
                  </p>
                  <p className="text-sm">
                    {(() => {
                      if (
                        localFormData.scheme_type == 0 ||
                        localFormData.scheme_type == 1 ||
                        localFormData.scheme_type == 2
                      ) {
                        return (
                          localFormData.scheme_name +
                          " ( Rs. " +
                          localFormData.amount +
                          ")"
                        );
                      } else if (
                        localFormData.scheme_type == 4 ||
                        localFormData.scheme_type == 6 ||
                        localFormData.scheme_type == 7 ||
                        localFormData.scheme_type == 8 ||
                        localFormData.scheme_type == 9 ||
                        localFormData.scheme_type == 10
                      ) {
                        return (
                          localFormData.scheme_name +
                          " ( Rs. " +
                          localFormData.min_amount +
                          ")" +
                          " (" +
                          localFormData.max_amount +
                          ")"
                        );
                      } else if (localFormData.scheme_type == 3) {
                        return (
                          localFormData.scheme_name +
                          " (" +
                          localFormData.min_weight +
                          ")" +
                          " (" +
                          localFormData.max_weight +
                          ")"
                        );
                      } else {
                        return (
                          localFormData.scheme_name +
                          " ( Rs. " +
                          localFormData.payamount +
                          ")"
                        );
                      }
                    })()}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700">
                    Account No
                  </p>
                  <p className="text-sm">
                    {localFormData?.scheme_acc_number || "N/A"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700">
                    Account Name
                  </p>
                  <p className="text-sm">
                    {localFormData?.account_name || "N/A"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700">
                    Start Date
                  </p>
                  <p className="text-sm">
                    {localFormData?.start_date || "N/A"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700">Bill No</p>
                  <p className="text-sm">{localFormData?.bill_no || "N/A"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700">
                    Bill Date
                  </p>
                  <p className="text-sm">{localFormData?.bill_date || "N/A"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700">
                    Total Installment
                  </p>
                  <p className="text-sm">
                    {localFormData?.total_installments || "0"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700">
                    Paid Installments
                  </p>
                  {localFormData?.total_paidinstallments || "0"}
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700">
                    Paid Amount
                  </p>
                  <p className="text-sm">
                    Rs. {localFormData?.total_paidamount || "0"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700">Bonus</p>
                  <p className="text-sm">
                    Rs. {localFormData?.total_paidamount || "0"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700">
                    Total Amount
                  </p>
                  <p className="text-sm">
                    Rs. {localFormData?.total_paidamount || "0"}
                  </p>
                </div>
              </div>
            </div>
            <div className="h-[300px] overflow-scroll">
              <Table
                data={localFormData?.schemeaccount}
                columns={localFormData?.columns}
                isLoading={isLoading}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className={`bg-white rounded-2xl shadow-md ${
          modalType !== "SUCCESS" ? "lg:w-[550px]" : "lg:w-[400px]"
        }`}
      >
        {header && (
          <div
            className={`flex items-center justify-between p-4 ${
              modalType !== "SUCCESS" ? "border-b" : ""
            }`}
          >
            <h2 className="text-lg font-semibold mx-3 text-[#232323]">
              {header}
            </h2>
            <button
              onClick={() => dispatch(closeModal())}
              className="flex items-center justify-center text-gray-500 hover:text-gray-700 bg-[#E6E6E670] rounded-full w-6 h-6 px-1 py-1 text-center"
            >
              <X />
            </button>
          </div>
        )}
        <div className="p-3 mx-3 ">{renderForm()}</div>
        <div className="flex justify-end space-x-3 py-4 px-9">
          {buttons?.cancel && (
            <button
              onClick={handleCancel}
              className={`px-6 py-2 rounded-lg
      ${
        modalType === "CONFIRMATION" || modalType === "SENDCONFIRMATION"
          ? "bg-red-600 text-sm text-white hover:bg-red-700"
          : "bg-[#61A375] text-white hover:bg-[#528f63]"
      }`}
            >
              {buttons.cancel.text ||
                (modalType === "CONFIRMATION"
                  ? "Confirm"
                  : modalType === "SENDCONFIRMATION"
                  ? "Send"
                  : "Submit")}
            </button>
          )}

          {buttons?.submit.text && (
            <button
              onClick={handleSubmit}
              className={`px-4 py-2 rounded-md
            ${
              modalType === "CONFIRMATION" || modalType === "SENDCONFIRMATION"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-[#61A375] text-white hover:bg-[#528f63]"
            }`}
            >
              {buttons.submit.text}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
