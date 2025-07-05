import React, { useState, useEffect } from "react";
import {
  getalluserrole,
  getuserpermission,
  updatemenupermission,
} from "../../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Select from "react-select";
import { customSelectStyles } from "../purity";
import Loading from "../../common/Loading";
import { useDispatch } from "react-redux";
import { openModal } from "../../../../redux/modalSlice";
import { eventEmitter } from "../../../../utils/EventEmitter";
import Modal from "../../common/Modal";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";
import { customStyles } from "../../ourscheme/scheme/AddScheme";

const UserAccessForm = () => {
  const [activeProfile, setActiveProfile] = useState(1);
  const [userRolesList, setUserRoleList] = useState([]);
  const [selectRoleData, setSelectRoleData] = useState([]);
  const [menuPermissionList, setMenuPermissionList] = useState([]);
  const [filteredMenuPermissionList, setFilteredMenuPermissionList] = useState([]);
  const [id_role, setidrole] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [updateData, setUpdateData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  const showAccess = (selectedRole) => {
    setIsLoading(true);
    setActiveProfile(selectedRole.value);
    setidrole(selectedRole.value);
    setSearchTerm(""); // Reset search when changing role
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
        // Apply existing search filter to new data if search term exists
        if (searchTerm.trim() !== "") {
          const filtered = response.data.filter(menu => 
            menu.menu_name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setFilteredMenuPermissionList(filtered);
        } else {
          setFilteredMenuPermissionList(response.data);
        }
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
        // Update the permission locally in both menuPermissionList and filteredMenuPermissionList
        // to avoid full refetch when possible
        if (updateData) {
          const updatedMenuList = menuPermissionList.map(menu => {
            if (menu.menu_id === updateData.id_submenu) {
              return {
                ...menu,
                view_permit: updateData.view_permit !== undefined ? updateData.view_permit : menu.view_permit,
                add_permit: updateData.add_permit !== undefined ? updateData.add_permit : menu.add_permit,
                edit_permit: updateData.edit_permit !== undefined ? updateData.edit_permit : menu.edit_permit,
                delete_permit: updateData.delete_permit !== undefined ? updateData.delete_permit : menu.delete_permit
              };
            }
            return menu;
          });
          
          setMenuPermissionList(updatedMenuList);
          
          // Also update the filtered list
          const updatedFilteredList = filteredMenuPermissionList.map(menu => {
            if (menu.menu_id === updateData.id_submenu) {
              return {
                ...menu,
                view_permit: updateData.view_permit !== undefined ? updateData.view_permit : menu.view_permit,
                add_permit: updateData.add_permit !== undefined ? updateData.add_permit : menu.add_permit,
                edit_permit: updateData.edit_permit !== undefined ? updateData.edit_permit : menu.edit_permit,
                delete_permit: updateData.delete_permit !== undefined ? updateData.delete_permit : menu.delete_permit
              };
            }
            return menu;
          });
          
          setFilteredMenuPermissionList(updatedFilteredList);
        }
        
        toast.success(response.message);
      }
    },
    onError: () => {
      // Fallback to full refetch if optimistic update fails
      getuserpermissionmutate({ id_role: id_role });
    }
  });

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term.trim() === "") {
      setFilteredMenuPermissionList(menuPermissionList);
    } else {
      const filtered = menuPermissionList.filter(menu => 
        menu.menu_name.toLowerCase().includes(term)
      );
      setFilteredMenuPermissionList(filtered);
    }
  };

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
    <>   
       <Breadcrumb
            items={[{ label: "Settings" }, { label: "User Access", active: true }]}
          />
    
          <div className="flex flex-col p-4  bg-white border border-[#F2F2F9]  rounded-[16px]">
    <div className="w-full p-4">
      <div className="flex justify-between">
        <div className="w-1/3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-[#004181] outline-none h-[36px]"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
              {/* You can add a search icon here if needed */}
              {searchTerm && (
                <button 
                  onClick={() => {
                    setSearchTerm("");
                    setFilteredMenuPermissionList(menuPermissionList);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </span>
          </div>
        </div>
        <div className="w-1/4">
          <Select
            name="id_role"
            options={selectRoleData}
            value={selectRoleData.find((option) => option.value === id_role)}
            onChange={showAccess}
            placeholder="Select Role"
            styles={customStyles(true)}
            classNamePrefix="react-select"
          />
        </div>
      </div>
      <div className="bg-white shadow rounded-[16px]">
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
                    filteredMenuPermissionList.length > 0 ? (
                      filteredMenuPermissionList.map((menu, index) => (
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
                        <td colSpan="7" className="text-center py-4">
                          No menus found matching "{searchTerm}"
                        </td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
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
    </div>
    </>
 
  );
};

export default UserAccessForm;