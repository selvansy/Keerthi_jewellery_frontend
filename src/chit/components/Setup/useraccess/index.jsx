import React, { useState, useEffect } from 'react';
import { getalluserrole,getuserpermission,updatemenupermission } from '../../../api/Endpoints';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
const UserAccessForm = () => {
  const [activeProfile, setActiveProfile] = useState(1);
  const [id_submenu, setid_submenu] = useState("1,2,3,5,6,7,8,9,11,12,14,20,21,22,23,27,29,31,32,33,34,37,38,41,42,44,45,46,47,57,59,60,61,62,63,64,66,68,69,70,71,72,73");
  const [userRolesList, setUserRoleList] = useState([]);
  const [menuPermissionList, setMenuPermissionList] = useState([]);
  const [id_role, setidrole] = useState(0);
  const showAccess = (profileId,id_role) => {
    setActiveProfile(profileId);
    setidrole(id_role);
    getuserpermissionmutate({id_role:id_role});
  };

  const showAllow = (allowId) => {
    console.log(`Toggle allow: ${allowId}`);
  };

  


 const { mutate: getUserRoleData } = useMutation({
        mutationFn: getalluserrole,
        onSuccess: (response) => {
            if (response) {
              setUserRoleList(response.data);
              console.log(response.data[0]._id);
              setActiveProfile(response.data[0].id_role);
              setidrole(response.data[0]._id);
              getuserpermissionmutate({id_role:response.data[0]._id});
            }
        },
    });


    const { mutate: getuserpermissionmutate } = useMutation({
      mutationFn: getuserpermission,
      onSuccess: (response) => {
          if (response) {
            console.log(response)
            setMenuPermissionList(response.data);
          }
      },
  });


  
  const updateMenuPermission = async (value, action, id_submenu) => {


    if (action === "all") {
      let body = {
        "id_submenu": id_submenu,
        "id_role": id_role,
        "view_permit": value,
        "add_permit": value,
        "edit_permit": value,
        "delete_permit": value,
      };

      updatePermission(body);
    } else if (action === "view") {
      let body = {
        id_subid_submenu: id_submenu,
        id_role: id_role,
        view_permit: value,
      };

      updatePermission(body);
    } else if (action === "add") {
      let body = {
        id_submenu: id_submenu,
        id_role: id_role,
        add_permit: value,
      };

      updatePermission(body);
    } else if (action === "edit") {
      let body = {
        id_submenu: id_submenu,
        id_role: id_role,
        edit_permit: value,
      };

      updatePermission(body);
    } else if (action === "delete") {
      let body = {
        id_submenu: id_submenu,
        id_role: id_role,
        delete_permit: value,
      };

      updatePermission(body);
    }
  };



  const { mutate: updatePermission } = useMutation({
      mutationFn: updatemenupermission,
      onSuccess: (response) => {
        if (response !== null) {

          getuserpermissionmutate({id_role:id_role});
          toast.success(response.message);
        }
      },
  });
  
  useEffect(() => {
    getUserRoleData();
  }, []);

  return (
    <div className="w-full p-4">
      <div className="bg-white shadow rounded-md">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/3 p-4">
            <div className="space-y-2" id="list-tab">
            {userRolesList.map((item, index) => (
          
              <button
                className={`w-full text-left py-2 px-4 rounded ${activeProfile === item.id_role ? "bg-[#034571] text-white" : "bg-gray-100"}`}
                onClick={() => showAccess(item.id_role,item._id)}
              >
                {item.role_name}
              </button>
           ))}
             
            </div>
          </div>

          <div className="w-full md:w-2/3 p-4">
            <div className="bg-gray-50 rounded-md p-4">
              <input
                type="hidden"
                id="set_id_profile"
                name="set_id_profile"
                value={activeProfile}
              />
              <input
                type="hidden"
                id="id_submenu"
                name="id_submenu"
                value={id_submenu}
              />

              <table className="w-full table-auto border-collapse">
                <thead>

                  <tr>
                    <th className="border px-4 py-2 text-left">Menu</th>
                    <th className="border px-4 py-2 text-left">All</th>
                    <th className="border px-4 py-2">View</th>
                    <th className="border px-4 py-2">Edit</th>
                    <th className="border px-4 py-2">Add</th>
                    <th className="border px-4 py-2">Delete</th>
                  </tr>
                </thead>
                <tbody>
                {menuPermissionList.map((menu) =>
                  <tr  key={menu.id}>
                    <td className="border px-4 py-2">{menu.menu_name}</td>
                    <td className="border px-2 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={
                          menu.view_permit &&
                          menu.add_permit &&
                          menu.edit_permit &&
                          menu.delete_permit
                            ? true
                            : false
                        }
                        onChange={(e) =>
                          updateMenuPermission(
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
                          updateMenuPermission(
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
                          updateMenuPermission(
                            e.target.checked,
                            "Add",
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
                          updateMenuPermission(
                            e.target.checked,
                            "Edit",
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
                          updateMenuPermission(
                            e.target.checked,
                            "Delete",
                            menu.menu_id
                          )
                        }
                      />
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccessForm;
