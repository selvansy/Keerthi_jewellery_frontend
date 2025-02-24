import React, { useState, useEffect } from "react";
import {
  getalluserrole,
  getuserpermission,
  updatemenupermission,
} from "../../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Select from "react-select";
import { customSelectStyles } from "../purity";
import Loading from "../../common/Loading";
import { useDispatch } from "react-redux";
import { openModal } from "../../../../redux/modalSlice";
import { eventEmitter } from "../../../../utils/EventEmitter";
import Modal from "../../common/Modal";
const UserAccessForm = () => {
  const [activeProfile, setActiveProfile] = useState(1);
  const [userRolesList, setUserRoleList] = useState([]);
  const [selectRoleData, setSelectRoleData] = useState([]);
  const [menuPermissionList, setMenuPermissionList] = useState([]);
  const [id_role, setidrole] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [updateData, setUpdateData] = useState(null);
  const dispatch = useDispatch();

  const showAccess = (selectedRole) => {
    setIsLoading(true);
    setActiveProfile(selectedRole.value);
    setidrole(selectedRole.value);
    getuserpermissionmutate({ id_role: selectedRole.value });
  };

  const { mutate: getUserRoleData } = useMutation({
    mutationFn: getalluserrole,
    onSuccess: (response) => {
      if (response) {
        setUserRoleList(response.data);
        setActiveProfile(response.data[0].id_role);
        setidrole(response.data[0]._id);
        getuserpermissionmutate({ id_role: response.data[0]._id });
        setSelectRoleData(
          response.data.map((item) => ({
            value: item._id,
            label: item.role_name,
          }))
        );
      }
    },
  });

  const { mutate: getuserpermissionmutate } = useMutation({
    mutationFn: getuserpermission,
    onSuccess: (response) => {
      if (response) {
        setMenuPermissionList(response.data);
      }
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const confirmUpdatePermission = (value, action, id_submenu) => {
    if (!id_role) {
      toast.error("Please select a role before updating permissions.");
      return;
    }

    const body = {
      id_submenu: id_submenu,
      id_role: id_role,
      view_permit: action === "all" ? value : undefined,
      add_permit: action === "all" ? value : undefined,
      edit_permit: action === "all" ? value : undefined,
      delete_permit: action === "all" ? value : undefined,
    };

    if (action !== "all") {
      body[`${action}_permit`] = value;
    }

    setUpdateData(body);
    dispatch(
      openModal({
        modalType: "CONFIRMATION",
        header: "Confirm Permission Update",
        formData: {
          message: "Are you sure you want to update this permission?",
        },
        buttons: {
          cancel: {
            text: "Cancel",
          },
          submit: {
            text: "Update",
          },
        },
      })
    );
  };

  const { mutate: updatePermission } = useMutation({
    mutationFn: updatemenupermission,
    onSuccess: (response) => {
      if (response !== null) {
        getuserpermissionmutate({ id_role: id_role });
        toast.success(response.message);
      }
    },
  });

  useEffect(() => {
    const handleUpdate = () => {
      if (updateData) {
        updatePermission(updateData);
      }
    };

    eventEmitter.on("CONFIRMATION_SUBMIT", handleUpdate);

    return () => {
      eventEmitter.off("CONFIRMATION_SUBMIT", handleUpdate);
    };
  }, [updateData]);

  useEffect(() => {
    getUserRoleData();
  }, []);

  return (
    <div className="w-full p-4">
      <div className="flex justify-end py-5">
        <div className="w-1/4">
          <Select
            name="id_role"
            options={selectRoleData}
            value={selectRoleData.find((option) => option.value === id_role)}
            onChange={showAccess}
            placeholder="Select Role"
            styles={customSelectStyles}
            classNamePrefix="react-select"
          />
        </div>
      </div>
      <div className="bg-white shadow rounded-md">
        <div className="flex flex-wrap">
          <div className="w-full p-4">
            <div className="bg-gray-50 rounded-md p-4">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 text-left">No</th>
                    <th className="border px-4 py-2 text-left">Menu</th>
                    <th className="border px-4 py-2 text-left">All</th>
                    <th className="border px-4 py-2">View</th>
                    <th className="border px-4 py-2">Edit</th>
                    <th className="border px-4 py-2">Add</th>
                    <th className="border px-4 py-2">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {!isLoading ? (
                    menuPermissionList.map((menu,index) => (
                      <tr key={menu.menu_id}>
                        <td className="border px-4 py-2">{index+1}</td>
                        <td className="border px-4 py-2">{menu.menu_name}</td>
                        <td className="border px-2 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={
                              menu.view_permit &&
                              menu.add_permit &&
                              menu.edit_permit &&
                              menu.delete_permit
                            }
                            onChange={(e) =>
                              confirmUpdatePermission(
                                e.target.checked,
                                "all",
                                menu.menu_id
                              )
                            }
                          />
                        </td>
                        <td className="border px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={menu.view_permit}
                            onChange={(e) =>
                              confirmUpdatePermission(
                                e.target.checked,
                                "view",
                                menu.menu_id
                              )
                            }
                          />
                        </td>
                        <td className="border px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={menu.add_permit}
                            onChange={(e) =>
                              confirmUpdatePermission(
                                e.target.checked,
                                "add",
                                menu.menu_id
                              )
                            }
                          />
                        </td>
                        <td className="border px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={menu.edit_permit}
                            onChange={(e) =>
                              confirmUpdatePermission(
                                e.target.checked,
                                "edit",
                                menu.menu_id
                              )
                            }
                          />
                        </td>
                        <td className="border px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={menu.delete_permit}
                            onChange={(e) =>
                              confirmUpdatePermission(
                                e.target.checked,
                                "delete",
                                menu.menu_id
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <Loading />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal/>
    </div>
  );
};

export default UserAccessForm;
