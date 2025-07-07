import React, { useState, useEffect, useCallback } from "react";
import Table from "../../common/Table";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getalluserroletable,
  changeuserrolestatus,
  deleteuserrole,
  getuserroleById,
  updateuserrole,
  adduserrole,
} from "../../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { openModal } from "../../../../redux/modalSlice";
import { eventEmitter } from "../../../../utils/EventEmitter";
import { useSelector, useDispatch } from "react-redux";
import { setid } from "../../../../redux/clientFormSlice";
import Modal from "../../common/Modal";
import Modelone from "../../common/Modelone";
import { useDebounce } from "../../../hooks/useDebounce";
import { Formik } from "formik";
import * as Yup from "yup";
import Loading from "../../common/Loading";
import usePagination from "../../../hooks/usePagination";
import Action from "../../common/action";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";

const Userrole = () => {
  const dispatch = useDispatch();
  const [isviewOpen, setIsviewOpen] = useState(false);
  const [id, setId] = useState("");
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [userroleData, setuserroleData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const limit = 10;
  const [isLoading, setisLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalDocuments,setTotalDocuments]=useState(0)

  function closeIncommingModal() {
    setIsviewOpen(false);
  }

  const { mutate: getalluserroletableMutate } = useMutation({
    mutationFn: (payload) => getalluserroletable(payload),

    onSuccess: (response) => {
      
      if (response) {
        setuserroleData(response.data);
        setTotalPages(response.totalPages);
        setTotalDocuments(response.totalDocument)
      }
      setisLoading(false);
      setSearchLoading(false);
    },
    onError: () => {
      setisLoading(false);
      setSearchLoading(false);
      setuserroleData([]);
    },
  });

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      let response = await changeuserrolestatus(id);
      toast.success(response.message);

      setuserroleData((prevData) =>
        prevData.map((userrole) =>
          userrole._id === id
            ? { ...userrole, active: currentStatus === true ? false : true }
            : userrole
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    setisLoading(true);
    getalluserroletableMutate({
      search: debouncedSearch,
      page: currentPage,
      limit:itemsPerPage,
    });
  }, [currentPage, debouncedSearch,isviewOpen,itemsPerPage]);

  const handleEdit = (id) => {
    setId(id);
    setIsviewOpen(true);
  };

  const handleAdduserrole = () => {
    setIsviewOpen(true);
  };

  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
  };

  const handleDelete = (id) => {
    setId(id);
    dispatch(
      openModal({
        modalType: "CONFIRMATION",
        header: "Delete User Role",
        formData: {
          message: "Are you sure you want to delete this User Role?",
          userroleId: id,
        },
        buttons: {
          cancel: {
            text: "Cancel",
          },
          submit: {
            text: "Delete",
          },
        },
      })
    );
  };
  const { mutate: deleteUserRole } = useMutation({
    mutationFn: ({userroleId}) => deleteuserrole(userroleId),
    onSuccess: (response) => {
      if (response.message === "User role deleted successfully") {
        const isLastItemOnPage = userroleData.length === 1;
        const isNotFirstPage = currentPage > 1;
        if (isLastItemOnPage && isNotFirstPage) {
          setCurrentPage((prev) => prev - 1);
        } else {
          getalluserroletableMutate({
            search: debouncedSearch,
            page: currentPage,
            limit: itemsPerPage,
          });
        }

        toast.success(response.message);
        eventEmitter.off("CONFIRMATION_SUBMIT");
        setId("");
      }
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Failed to delete metal");
    },
  });

  useEffect(() => {
    const handleDelete = (id) => {
      deleteUserRole(id);
    };

    eventEmitter.on("CONFIRMATION_SUBMIT", handleDelete);

    return () => {
      eventEmitter.off("CONFIRMATION_SUBMIT", handleDelete);
    };
  }, []);

  useEffect(() => {
    return () => {
      eventEmitter.off("CONFIRMATION_SUBMIT");
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest(".dropdown-container")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeDropdown]);

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * limit,
    },
    {
      header: "Role Name",
      accessor: "role_name",
    },
    {
      header: "Status",
      accessor: "active",
      cell: (row) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={row?.active === true}
            onChange={() => handleStatusToggle(row?._id, row?.active)}
          />
            <div
 className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-[#E7EEF5] p-[2px] after:duration-300 after:bg-[#004181] ${
              row?.active === true
                ? "peer-checked:bg-[#E7EEF5] peer-checked:ring-[#E7EEF5]"
                : "peer-checked:bg-[#E7EEF5] peer-checked:ring-gray-400"
            } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-[${layout_color}] peer-hover:after:scale-95`}          ></div>
        </label>
      ),
    },
    {
      header: "Actions",
      cell: (row, rowIndex) => (
        <Action row={row} data={userroleData} rowIndex={rowIndex} activeDropdown={activeDropdown} setActive={hanldeActiveDropDown}  handleEdit={handleEdit} handleDelete={handleDelete}/>
      ),
      sticky: "right",
    },
  ];

  const handleSearch = (e) => {
    setSearchLoading(true);
    setSearchInput(e.target.value);
  };

  const clearId = () => {
    setId("");
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    const pageNumber = Number(page);
    if (
      !pageNumber ||
      isNaN(pageNumber) ||
      pageNumber < 1 ||
      pageNumber > totalPages
    ) {
      return;
    }

    setCurrentPage(pageNumber);
  };

 

  return (
    <>
     <Breadcrumb items={[
            {label:"Settings"},
            {label:"User Roles",active:true}
          ]}/>
     <div className="flex flex-col p-4  bg-white border-[1px] border-[#F2F2F9]  rounded-[16px]">
    <div className="flex flex-col relative">
      <>
        {/* <h2 className="text-2xl text-gray-900 font-bold">User Role</h2> */}
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
          <div className="relative w-full lg:w-1/3 min-w-[200px]">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {searchLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
              ) : (
                <Search className="text-[#6C7086] h-5 w-5" />
              )}
            </div>
            <input
              onChange={handleSearch}
              placeholder="Search..."
              className="px-4 py-2 ps-9 border-2 border-[#F2F2F9] rounded-lg w-full h-[36px] text-md sm:w-[228px]"
            />
          </div>
          {/* <div className="flex flex-row items-center justify-end gap-2">
            <button
              className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
              onClick={handleAdduserrole}
              style={{ backgroundColor: layout_color }}
            >
              + Add User Role
            </button>
          </div> */}
        </div>

        <div className="mt-4">
          
        <Table data={userroleData} columns={columns} isLoading={isLoading}  currentPage={currentPage} handlePageChange={handlePageChange} itemsPerPage={itemsPerPage} totalItems={totalDocuments} handleItemsPerPageChange={handleItemsPerPageChange} />

        </div>

     
      </>
      <Modelone
        title={id ? "Edit User Role" : "Add User Role"}
        extraClassName="w-96"
        setIsOpen={setIsviewOpen}
        isOpen={isviewOpen}
        closeModal={closeIncommingModal}
      >
        <UserRoleForm setIsOpen={setIsviewOpen} id={id} clearId={clearId} />
      </Modelone>
      <Modal />
    </div>
    </div>
    </>
  );
};

export default Userrole;

export const UserRoleForm = ({ setIsOpen, id, clearId }) => {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const [formData, setFormData] = useState({ role_name: "" });

  // Validation schema
  const rolenameSchema = Yup.object().shape({
    role_name: Yup.string().required("Role name is required"),
  });

  // Fetch user role by ID
  const getuserRoleId = useMutation({
    mutationFn: getuserroleById,
    onSuccess: (response) => {
      if (response?.data) {
        setFormData(response.data);
      }
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to fetch role data"
      );
    },
  });

  // Add user role mutation
  const addUserRoleMutation = useMutation({
    mutationFn: adduserrole,
    onSuccess: (response) => {
      if (response?.data?.message) {
        toast.success(response.data.message);
        setIsOpen(false);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to add user role");
    },
  });
  const updateUserRoleMutation = useMutation({
    mutationFn:({id,userRoleData})=> updateuserrole(id,userRoleData),
    onSuccess: (response) => {
      if (response?.data?.message) {
        toast.success(response.data.message);
        setIsOpen(false);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to add user role");
    },
  });

  useEffect(() => {
    if (id) {
      getuserRoleId.mutate(id);
    }
  }, [id]);

  useEffect(() => {
    return () => {
      clearId();
    };
  }, []);

  const handleSubmit = useCallback(
    async (values) => {
      const userRoleData = { role_name: values.role_name.trim() };
      if(id){
        updateUserRoleMutation.mutate({id,userRoleData})
      }else{
        addUserRoleMutation.mutate(userRoleData);
      }
    },
    [addUserRoleMutation]
  );

  const handleCancel = useCallback(
    (e) => {
      e.preventDefault();
      setIsOpen(false);
    },
    [setIsOpen]
  );

  return (
    <Formik
      initialValues={formData}
      validationSchema={rolenameSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        handleBlur,
        handleSubmit,
        handleChange,
        isValid,
      }) => (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700">
              Role Name<span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="role_name"
              value={values.role_name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter role name"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={addUserRoleMutation.isLoading}
            />
            {errors.role_name && (
              <div className="text-red-500 text-sm">{errors.role_name}</div>
            )}
          </div>

          <div className="bg-white p-2 border-t-2 border-gray-300 mt-4">
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
                onClick={handleCancel}
                disabled={addUserRoleMutation.isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addUserRoleMutation.isLoading || !isValid}
                className="text-white rounded-md p-2 w-full lg:w-20 disabled:opacity-50"
                style={{ backgroundColor: layout_color }}
              >
                {addUserRoleMutation.isLoading
                  ? "Submitting..."
                  : id
                  ? "Update"
                  : "Submit"}
              </button>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};
