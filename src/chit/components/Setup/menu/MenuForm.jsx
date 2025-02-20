import React, { useState, useEffect } from "react";
import { getallprojects, getMenuById, addMenu, updateMenu } from '../../../api/Endpoints';
import { useMutation } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { setid } from "../../../../redux/clientFormSlice";
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import * as Yup from 'yup';

function MenuForm({ setIsOpen }) {

  const [formData, setFormData] = useState({
    menu_name: "",
    menu_icon: "",
    id_project: "",
    display_order: "",
  });
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let dispatch = useDispatch();
  const id = useSelector((state) => state.clientForm.id);
  
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const MenuSchema = Yup.object().shape({
    menu_name: Yup.string().required('menu_name is required'),
    menu_icon: Yup.string(),
    id_project: Yup.string().required('id_project is required'),
    display_order: Yup.number().required('display_order required'),
  });

  const { mutate: getallprojectsMutate } = useMutation({
    mutationFn: getallprojects,
    onSuccess: (response) => {
      console.log(response);
      if (response) {
        setProjects(response.data);
      }
    },
  });

  const { mutate: getmenuByid } = useMutation({
    mutationFn: getMenuById,
    onSuccess: (response) => {
      setFormData({
        id: id,
        menu_name: response.data.menu_name,
        menu_icon: response.data.menu_icon,
        display_order: response.data.display_order,
        id_project: response.data.id_project,
        projects: projects,
      });
    },
  });

  const { mutate: createMenuMutate } = useMutation({
    mutationFn: addMenu,
    onSuccess: () => {
      toast.success("Menu added successfully!");
    },
    onError: () => {
      toast.error("Error adding menu.");
    },
  });
 
 
//accept id and data
  const { mutate: updateMenuMutate } = useMutation({
    mutationFn:({id,data}) => updateMenu(id, data),
    onSuccess: () => {
      toast.success("Menu updated successfully!");
    },
    onError: () => {
      toast.error("Error updating menu.");
    },
  });
 
  const handleSubmit = (formData, resetForm) => {
 
    if (!formData.menu_name || !formData.id_project || !formData.display_order) {
      toast.error("Please fill in all required fields.");
      return;
    }
 
    //pass id and data
    if (id) {
      const updateData ={
        menu_name: formData.menu_name,
        menu_icon: formData.menu_icon,
        display_order: formData.display_order,
        id_project: formData.id_project,
      };
      updateMenuMutate({id:id,data:updateData})
    } else {
      createMenuMutate({
        menu_name: formData.menu_name,
        menu_icon: formData.menu_icon,
        display_order: formData.display_order,
        id_project: formData.id_project,
      });
    }
 
    resetForm();
    setIsOpen(false); // Close the form modal
  };
  useEffect(() => {
    if (id) {
      getmenuByid(id);
    }
    getallprojectsMutate();
  }, []);

  return (
    <div>
      <Formik
        initialValues={formData}
        validationSchema={MenuSchema}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values, resetForm);
        }}
      >
        {({ values, errors, handleBlur, setFieldValue, resetForm, handleSubmit, handleChange }) => (
          <form className="flex w-full flex-col pl-8 pr-8 pb-4 bg-white space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">
                Menu Name<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="menu_name"
                value={values.menu_name || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Menu Name"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.menu_name && <div className="text-red-500 text-sm">{errors.menu_name}</div>}
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">
                Menu Icon
              </label>
              <input
                type="text"
                name="menu_icon"
                value={values.menu_icon || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Menu Icon"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.menu_icon && <div className="text-red-500 text-sm">{errors.menu_icon}</div>}
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">
                Project<span className="text-red-400">*</span>
              </label>
              <select
                name="id_project"
                value={values.id_project || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.project_name}
                  </option>
                ))}
              </select>
              {errors.id_project && <div className="text-red-500 text-sm">{errors.id_project}</div>}
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">
                Display Order<span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="display_order"
                value={values.display_order || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Display Order"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.display_order && <div className="text-red-500 text-sm">{errors.display_order}</div>}
            </div>
            <div className="bg-white p-2 border-t-2 border-gray-300 mt-4">
              <div className="flex justify-end gap-2 mt-3">
                <button
                  className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setid(null));
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </button>
                {!id ? (
                  <button type="submit" disabled={isLoading} className=" text-white rounded-md p-2 w-full lg:w-20"
                  style={{ backgroundColor: layout_color }} >
                    Submit
                  </button>
                ) : (
                  <button disabled={isLoading} className=" text-white rounded-md p-2 w-full lg:w-20"
                  style={{ backgroundColor: layout_color }} >
                    Update
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default MenuForm;
