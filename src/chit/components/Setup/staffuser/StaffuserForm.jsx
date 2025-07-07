import React, { useState, useEffect } from "react";
import Select from 'react-select';
import {
  getstaffbyid,
  getemployeebybranch,
  getbranchbyclient,
  getprojectbyclient,
  getalluserrole,
  getallclient,
  addstaff,
  updatestaff,
  getallbranch,
} from "../../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { setid } from "../../../../redux/clientFormSlice";
import { openModal } from "../../../../redux/modalSlice";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";

function StaffuserForm({ setIsOpen }) {
  const [branchData, setBranchData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [project, setProject] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const { extraData } = useSelector((state) => state.modal);
  const decodedata = useSelector((state) => state.clientForm.roledata);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const id_role = decodedata?.id_role?.id_role;
  const id_client = decodedata?.id_client;
  const id_branch = decodedata?.id_branch;
  const id_project = decodedata?.id_project;

  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();
  const id = useSelector((state) => state.clientForm.id);

  const customStyles = (isReadOnly) => ({
    control: (base, state) => ({
      ...base,
      minHeight: "42px",
      backgroundColor: "white",
      border: state.isFocused ? "1px solid black" : "2px solid #f2f3f8",
      boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
      borderRadius: "0.375rem",
      "&:hover": {
        color: "#e2e8f0",
      },
      pointerEvents: !isReadOnly ? "none" : "auto",
      opacity: !isReadOnly ? 1 : 1,
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#858293",
      fontWeight: "thin",
      // fontStyle: "bold",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: "#232323",
      "&:hover": {
        color: "#232323",
      },
    }),
  });

  const inputHeight = "42px";

  const MenuSchema = Yup.object().shape({
    id_employee: Yup.string().required("Employee is required"),
    access_branch: Yup.string().required("Access branch is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
    id_role: Yup.string().required("Role is required"),
    id_branch: Yup.string().required("Branch is required"),
  });

  const formik = useFormik({
    initialValues: {
      id_employee: "",
      id_branch: "",
      id_client: id_client || "",
      access_branch: "",
      username: "",
      password: "",
      id_role: "",
    },
    validationSchema: MenuSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values) => {
      if (id) {
        
        updatestaffmutate({id,values});
      } else {
        addstaffmutate(values);
      }
    },
  });

  const { mutate: getallclientMutate } = useMutation({
    mutationFn: getallclient,
    onSuccess: (response) => {
      if (response?.data) {
        setClientData(response.data.map(client => ({
          value: client._id,
          label: client.company_name
        })));
      }
    },
    onError: (error) => {
      console.error("Error fetching clients:", error);
    },
  });

  const { mutate: getbranchbyclientmutate } = useMutation({
    mutationFn: () => getallbranch(),
    onSuccess: (response) => {
      if (response?.data) {
        setBranchData(response.data.map(branch => ({
          value: branch._id,
          label: branch.branch_name
        })));
      }
    },
    onError: (error) => console.error("Error fetching branches:", error),
  });

  const { mutate: getEmployeeByBranch } = useMutation({
    mutationFn: () => getemployeebybranch({ id_branch: id_branch }),
    onSuccess: (response) => {
      if (response?.data) {
        setEmployeeData(response.data.map(employee => ({
          value: employee._id,
          label: `${employee.firstname} ${employee.lastname}`
        })));
      }
    },
    onError: (error) => console.error("Error fetching employees:", error),
  });

  const { mutate: getAllRoles } = useMutation({
    mutationFn: getalluserrole,
    onSuccess: (response) => {
      if (response) {
        setRoleData(response.data.map(role => ({
          value: role._id,
          label: role.role_name
        })));
      }
    },
    onError: (error) => console.error("Error fetching roles:", error),
  });

  const { mutate: updatestaffmutate } = useMutation({
    mutationFn: ({ id, values }) => updatestaff(id, values),
    onSuccess: (response) => {
      toast.success("Staff updated successfully");
      dispatch(setid(null));
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error("Error updating staff");
      console.error("Error updating staff:", error);
    },
  });
  
  const { mutate: addstaffmutate } = useMutation({
    mutationFn: addstaff,
    onSuccess: (response) => {
      toast.success("Staff added successfully");
      dispatch(setid(null));
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error("Error adding staff");
      console.error("Error adding staff:", error);
    },
  });

  const handleCancel = (e) => {
    e.preventDefault();
    dispatch(setid(null));
    setIsOpen(false);
  };

  const { mutate: getstaffbyidmutate } = useMutation({
    mutationFn: getstaffbyid,
    onSuccess: (response) => {
      if (response) {
        formik.setValues({
          id: response.data._id,
          id_employee: response.data.id_employee,
          id_branch: response.data.id_branch,
          id_client: response.data.id_client,
          id_project: response.data.id_project,
          access_branch: response.data.access_branch,
          username: response.data.username,
          password: "",
          id_role: response.data.id_role,
        });

        getbranchbyclientmutate(id_client);
        getEmployeeByBranch(response.data.id_branch);
      }
    },
  });


  useEffect(() => {
    getAllRoles();

    if (parseInt(id_role) === 1) {
      // Super Admin
      getallclientMutate();
      getbranchbyclientmutate(id_client);
    } else if (parseInt(id_role) == 2) {
      // Admin
      getbranchbyclientmutate();
      formik.setValues({
          ...formik.values,
          id_client: id_client,
      });
      getEmployeeByBranch(id_branch);
    } else {
      formik.setValues({
        ...formik.values,
        id_project: id_project,
        id_client: id_client,
        id_branch: id_branch,
      });
      getbranchbyclientmutate(id_client);
      getEmployeeByBranch(id_branch);
    }

    if (id_branch !== "0") {
      formik.setValues({
        ...formik.values,
        id_branch: id_branch,
        id_project: id_project,
        id_client: id_client,
      });
    }

    if (id) {
      getstaffbyidmutate(id);
    }
  }, []);


  return (
    <div>
      <div className="flex flex-col w-full gap-4">
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-2 gap-4">
            <div className="flex flex-row justify-between gap-3">
              {id_role === 1 && (
                <div className="flex flex-col space-y-2 w-1/2">
                  <label className="font-sm text-gray-700">
                    Client<span className="text-red-400">*</span>
                  </label>
                  <Select
                    name="id_client"
                    options={clientData}
                    value={clientData.find(option => option.value === formik.values.id_client)}
                    onChange={(selectedOption) => {
                      formik.setFieldValue("id_client", selectedOption?.value || "");
                      getbranchbyclientmutate(selectedOption?.value);
                    }}
                    styles={customStyles}
                    placeholder="Select Client"
                    isClearable
                  />
                  {formik.errors.id_client && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.id_client}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-row justify-between gap-3">
              <div className="flex flex-col space-y-2 w-full">
                <label className="font-sm text-gray-700">
                  Employee<span className="text-red-400">*</span>
                </label>
                <Select
                  name="id_employee"
                  options={employeeData}
                  value={employeeData.find(option => option.value === formik.values.id_employee)}
                  onChange={(selectedOption) => {
                    formik.setFieldValue("id_employee", selectedOption?.value || "");
                  }}
                  styles={customStyles(true)}
                  placeholder="Select Employee"
                  isClearable
                />
                {formik.errors.id_employee && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.id_employee}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-sm text-gray-700">
                Username<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formik.values.username || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Username"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {formik.errors.username && (
                <div className="text-red-500 text-sm">
                  {formik.errors.username}
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-sm text-gray-700">
                Password<span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formik.values.password || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Password"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {formik.errors.password && (
                <div className="text-red-500 text-sm">
                  {formik.errors.password}
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-sm text-gray-700">
                Branch Access<span className="text-red-400">*</span>
              </label>
              <Select
                name="access_branch"
                options={[
                  { value: "0", label: "All Branch" },
                  ...branchData
                ]}
                value={formik.values.access_branch === "0" 
                  ? { value: "0", label: "All Branch" }
                  : branchData.find(option => option.value === formik.values.access_branch)}
                onChange={(selectedOption) => {
                  formik.setFieldValue("access_branch", selectedOption?.value || "");
                }}
                styles={customStyles(true)}
                placeholder="Select Branch Access"
                isClearable
              />
              {formik.errors.access_branch && (
                <div className="text-red-500 text-sm">
                  {formik.errors.access_branch}
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-sm text-gray-700">
                Role<span className="text-red-400">*</span>
              </label>
              <Select
                name="id_role"
                options={roleData}
                value={roleData.find(option => option.value === formik.values.id_role)}
                onChange={(selectedOption) => {
                  formik.setFieldValue("id_role", selectedOption?.value || "");
                }}
                styles={customStyles(true)}
                placeholder="Select Role"
                isClearable
              />
              {formik.errors.id_role && (
                <div className="text-red-500 text-sm">
                  {formik.errors.id_role}
                </div>
              )}
            </div>

            <div className="bg-white p-2 mt-6">
              <div className="flex justify-end gap-2 mt-3">
                <button
                  className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="text-white rounded-md p-2 w-full lg:w-20"
                  style={{ backgroundColor: layout_color }}
                >
                  {id ? "Update" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StaffuserForm;