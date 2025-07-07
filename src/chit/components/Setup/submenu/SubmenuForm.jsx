import React, { useState, useEffect } from 'react';
import { getallprojects, getallmenu, getallsubmenudatatable, changesubmenuStatus, deletesubmenu, getsubmenuById, updatesubmenu, addsubmenu } from '../../../api/Endpoints';
import { useMutation,useQuery} from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { setid } from "../../../../redux/clientFormSlice"
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from "react-select";
import { useNavigate } from 'react-router-dom';

function SubmenuForm({ setIsOpen, getallsubmenusMutate, menus,id,clearId }) {
    const [projects, setProjects] = useState([]);
    const [menuData,setMenuData]= useState([])
    // const roledata = useSelector((state) => state.clientForm.roledata);
    // // const id_role = roledata?.id_role?.id_role;
    // // const id_client = roledata?.id_client;
    // // const id_branch = roledata?.branch;
    // // const id_project = roledata?.id_project;
    const [isLoading, setisLoading] = useState(false);
    const layout_color = useSelector((state) => state.clientForm.layoutColor);
    const navigate=useNavigate()

    const validationSchema = Yup.object({
        submenu_name: Yup.string().required('Submenu name is required'),
        id_project: Yup.string().required('Project is required'),
        id_menu: Yup.string().required('Menu is required'),
        display_order: Yup.number().required('Display Order is required'),
        pathurl: Yup.string()
        .required('Path URL is required')
        .test('starts-with-slash', 'Path URL must start with /', 
            value => value && value.startsWith('/'))

    });

    useEffect(()=>{
        return ()=>{
            clearId()
        }
    },[])

    const customSelectStyles = {
        control: (provided) => ({
          ...provided,
          minHeight: "50px",
          height: "50px",
          borderWidth: "2px",
          borderColor: "#d1d5db",
          "&:hover": {
            borderColor: "#d1d5db",
          },
        }),
        valueContainer: (provided) => ({
          ...provided,
          height: "50px",
          padding: "0 12px",
        }),
        input: (provided) => ({
          ...provided,
          margin: "0px",
        }),
        indicatorsContainer: (provided) => ({
          ...provided,
          height: "50px",
        }),
      };

    const formik = useFormik({
        initialValues: {
            submenu_name: '',
            id_menu: '',
            display_order: '',
            id_project: '',
            pathurl: '/'
        },
        validationSchema,
        onSubmit: (values) => {
            try {
                const updateData = {
                    submenu_name: values.submenu_name,
                    display_order: values.display_order,
                    id_menu: values.id_menu,
                    id_project: values.id_project,
                    pathurl: values.pathurl.startsWith('/') ? values.pathurl : `/${values.pathurl}`
                };

                if (id) {
                    updatesubmenumutate(updateData);
                } else {
                    createsubmenuMutate(updateData);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }
    });

    const handlePathChange = (e) => {
        let value = e.target.value;
                if (!value.startsWith('/')) {
            value = '/' + value;
        }
        
        formik.setFieldValue('pathurl', value);
    };


    const { data: projectResponse } = useQuery({
        queryKey: ["projects"],
        queryFn: getallprojects,
      });
    
      useEffect(()=>{
        if(projectResponse){
            const projectData = projectResponse.data.map((project)=>({
                value:project._id,
                label:project.project_name
            }))
            setProjects(projectData)
        }
        if(menus){
            const menuData = menus.map((menu)=>({
                value: menu._id,
                label:menu.menu_name
            }))
            setMenuData(menuData)
        }
      },[projectResponse,menus])

    const { mutate: getallsubid } = useMutation({
        mutationFn: getsubmenuById,
        onSuccess: (response) => {
            if (response) {
                formik.setValues(response.data);
            }
        },
    });

    const handleCancel = (e) => {
        e.preventDefault();
        clearId('')
        setIsOpen(false);
    };

    const { mutate: createsubmenuMutate } = useMutation({
        mutationFn: addsubmenu,
        onSuccess: (response) => {
            
            toast.success(response.data.message);
            setIsOpen(false);
            navigate("/setup/submenu");
        },
        onError: (error) => {
            toast.error(error.response.data.message);
        },
        onMutate: () => setisLoading(true),
        onSettled: () => setisLoading(false),
    });

    const { mutate: updatesubmenumutate } = useMutation({
        mutationFn: (data) => updatesubmenu(id, data),
        onSuccess: (response) => {
          try {
            toast.success(response.message);
            setIsOpen(false);
            clearId('')
            navigate("/setup/submenu");
            
          } catch (error) {
            
          }
        },
        onError: (error) => {
            
            toast.error(error.response.data.message);
        },
        onMutate: () => setisLoading(true),
        onSettled: () => setisLoading(false),
    });

    useEffect(() => {
        if (id) {
            getallsubid(id);
        }
    }, [id]);

    const handleProjects = (selectedOption) => {
        formik.setFieldValue(
          "id_project",
          selectedOption ? selectedOption.value : ""
        );
      };

      const handleMenuSelect = (selectedOption) => {
        formik.setFieldValue(
          "id_menu",
          selectedOption ? selectedOption.value : ""
        );
      };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-2">
                <label className="font-medium text-gray-700">
                    Sub Menu Name<span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    id="submenu_name"
                    {...formik.getFieldProps('submenu_name')}
                    placeholder="Enter Sub Menu Name"
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-describedby="submenuNameError"
                />
                {formik.touched.submenu_name && formik.errors.submenu_name && (
                    <div id="submenuNameError" className="text-red-500 text-sm" aria-live="assertive">
                        {formik.errors.submenu_name}
                    </div>
                )}
            </div>

            <div className="flex flex-col space-y-2">
                <label className="font-medium text-gray-700">
                    Menu<span className="text-red-400">*</span>
                </label>
                <Select
                options={menuData}
                value={menuData.find(
                  (menu) => menu.value === formik.values.id_menu
                )}
                onChange={handleMenuSelect}
                onBlur={formik.handleBlur}
                placeholder="Select Menu"
                styles={customSelectStyles}
                className="react-select-container"
                classNamePrefix="react-select"
              />
                {formik.touched.id_menu && formik.errors.id_menu && (
                    <div id="menuError" className="text-red-500 text-sm" aria-live="assertive">
                        {formik.errors.id_menu}
                    </div>
                )}
            </div>

            <div className="flex flex-col space-y-2">
                <label className="font-medium text-gray-700">
                    Project<span className="text-red-400">*</span>
                </label>
                <Select
                options={projects}
                value={projects.find(
                  (projects) => projects.value === formik.values.id_project
                )}
                onChange={handleProjects}
                onBlur={formik.handleBlur}
                placeholder="Select Project"
                styles={customSelectStyles}
                className="react-select-container"
                classNamePrefix="react-select"
              />
                {formik.touched.id_project && formik.errors.id_project && (
                    <div id="projectError" className="text-red-500 text-sm" aria-live="assertive">
                        {formik.errors.id_project}
                    </div>
                )}
            </div>

            <div className="flex flex-col space-y-2">
                <label className="font-medium text-gray-700">
                    Display Order<span className="text-red-400">*</span>
                </label>
                <input
                    type="number"
                    id="display_order"
                    {...formik.getFieldProps('display_order')}
                    placeholder="Enter Display Order"
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-describedby="displayOrderError"
                />
                {formik.touched.display_order && formik.errors.display_order && (
                    <div id="displayOrderError" className="text-red-500 text-sm" aria-live="assertive">
                        {formik.errors.display_order}
                    </div>
                )}
            </div>

            <div className="flex flex-col space-y-2">
                <label className="font-medium text-gray-700">
                    Path Url<span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    id="pathurl"
                      value={formik.values.pathurl}
                        onChange={handlePathChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter Path Url (starts with /)"
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-describedby="pathUrlError"
                />
                 <span className="text-xs text-gray-500 mt-1 block">Path must start with a forward slash (/)</span>
               {formik.touched.pathurl && formik.errors.pathurl && (
                    <div id="pathUrlError" className="text-red-500 text-sm" aria-live="assertive">
                        {formik.errors.pathurl}
                    </div>
                )}
            </div>

            <div className="bg-white p-2 border-t-2 border-gray-300 mt-4">
                <div className="flex justify-end gap-2 mt-3">
                    <button
                        type="button"
                        className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="text-white rounded-md p-2 w-full lg:w-20 flex justify-center items-center"
                        style={{ backgroundColor: layout_color }}
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-t-2 border-white rounded-full animate-spin"></div>
                        ) : (
                            id ? 'Update' : 'Submit'
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default SubmenuForm;