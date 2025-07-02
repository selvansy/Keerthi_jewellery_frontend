import React, { useState, useEffect } from "react";
import {
  getallprojects,
  getMenuById,
  addMenu,
  updateMenu,
} from "../../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { setid } from "../../../../redux/clientFormSlice";
import { toast } from "sonner";
import { Formik } from "formik";
import * as Yup from "yup";

function MenuForm({ setIsOpen }) {
  const [formData, setFormData] = useState({
    menu_name: "",
    menu_icon: null,
    id_project: "",
    display_order: "",
  });
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [iconPreview, setIconPreview] = useState(null);

  let dispatch = useDispatch();
  const MAX_FILE_SIZE = 102400;
  const id = useSelector((state) => state.clientForm.id);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const MenuSchema = Yup.object().shape({
    menu_name: Yup.string().required("Menu name is required"),
    menu_icon: Yup.mixed()
      .nullable()
      .test("fileSize", "File size must be less than 100KB", (value) => {
        if (!value || !(value instanceof File)) return true;
        return value.size <= MAX_FILE_SIZE;
      })
      .test("fileType", "Only SVG files are allowed", (value) => {
        if (!value || !(value instanceof File)) return true;
        return value.type === "image/svg+xml";
      }),
    id_project: Yup.string().required("Choose a project"),
    display_order: Yup.number().required("Display order is required"),
  });

  const { mutate: getallprojectsMutate } = useMutation({
    mutationFn: getallprojects,
    onSuccess: (response) => {
      if (response) {
        setProjects(response.data);
      }
    },
  });

  const { mutate: getmenuByid } = useMutation({
    mutationFn: getMenuById,
    onSuccess: (response) => {
      const { menu_name, display_order, id_project, menu_icon } = response.data;

      // Set form data
      setFormData({
        menu_name,
        display_order,
        id_project,
        menu_icon: menu_icon || null,
      });

      // Set icon preview for existing images
      if (menu_icon) {
        setIconPreview(
          `${import.meta.env.VITE_API_URL}/${menu_icon}`
        );
      } else {
        setIconPreview(null);
      }
    },
  });

  const { mutate: createMenuMutate } = useMutation({
    mutationFn: async (formData) => {
      return addMenu(formData);
    },
    onSuccess: () => {
      toast.success("Menu added successfully!");
    },
    onError: () => {
      toast.error("Error adding menu.");
    },
  });

  const { mutate: updateMenuMutate } = useMutation({
    mutationFn: async ({ id, formData }) => {
      return updateMenu(id, formData);
    },
    onSuccess: () => {
      toast.success("Menu updated successfully!");
    },
    onError: () => {
      toast.error("Error updating menu.");
    },
  });

  const handleFileChange = (event, setFieldValue, setFieldTouched) => {
    const file = event.target.files[0];

    if (file) {
      if (file.type !== "image/svg+xml") {
        toast.error("Please upload only SVG files");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size must be less than 100KB");
        return;
      }

      // Generate a preview URL for the new file
      const previewUrl = URL.createObjectURL(file);
      setIconPreview(previewUrl);
      setFieldValue("menu_icon", file);
      setFieldTouched("menu_icon", false);
    }
  };

  const handleSubmit = (values, { resetForm }) => {
    if (!values.menu_name || !values.id_project || !values.display_order) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("menu_name", values.menu_name);
    formDataObj.append("id_project", values.id_project);
    formDataObj.append("display_order", values.display_order);

    if (values.menu_icon instanceof File) {
      formDataObj.append("menu_icon", values.menu_icon);
    }

    if (id) {
      updateMenuMutate({ id, formData: formDataObj });
    } else {
      createMenuMutate(formDataObj);
    }

    resetForm();
    setIsOpen(false);
  };

  useEffect(() => {
    if (id) {
      getmenuByid(id);
    }
    getallprojectsMutate();
  }, [id]);

  // Clean up the preview URL when the component unmounts or when a new image is uploaded
  useEffect(() => {
    return () => {
      if (iconPreview && iconPreview.startsWith("blob:")) {
        URL.revokeObjectURL(iconPreview);
      }
    };
  }, [iconPreview]);

  return (
    <div>
      <Formik
        initialValues={formData}
        validationSchema={MenuSchema}
        enableReinitialize={true}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          setFieldValue,
          setFieldTouched,
          resetForm,
          handleSubmit,
          handleChange,
        }) => (
          <form
            className="flex w-full flex-col  bg-white space-y-4"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">
                Menu Name<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="menu_name"
                value={values.menu_name || ""}
                onChange={(e) => {
                  handleChange(e);
                  setFieldTouched("menu_name", false);
                }}
                onBlur={handleBlur}
                placeholder="Enter Menu Name"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.menu_name && touched.menu_name && (
                <div className="text-red-500 text-sm">{errors.menu_name}</div>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">
                Menu Icon {!id && <span className="text-red-400">*</span>}
              </label>
              <div className="flex flex-col items-center space-y-2">
                {iconPreview && (
                  <div className="w-16 h-16 flex items-center justify-center border rounded-md">
                    <img
                      src={iconPreview}
                      alt="Icon Preview"
                      className="max-w-full max-h-full"
                    />
                  </div>
                )}
                <label className="flex justify-center items-center w-full h-12 border-2 border-dashed border-gray-300 text-black cursor-pointer px-4 rounded-md hover:bg-gray-50">
                  <span className="text-gray-600">
                    {iconPreview ? "Change Icon" : "Upload SVG Icon"}
                  </span>
                  <input
                    type="file"
                    name="menu_icon"
                    onChange={(e) =>
                      handleFileChange(e, setFieldValue, setFieldTouched)
                    }
                    accept=".svg"
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500">
                  Max size: 100KB, SVG only
                </p>
              </div>
              {errors.menu_icon && touched.menu_icon && (
                <div className="text-red-500 text-sm">{errors.menu_icon}</div>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">
                Project<span className="text-red-400">*</span>
              </label>
              <select
                name="id_project"
                value={values.id_project || ""}
                onChange={(e) => {
                  handleChange(e);
                  setFieldTouched("id_project", false);
                }}
                onBlur={handleBlur}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Project</option>
                {projects.map((project) => {
                  if(project.id_project === 1){
                    return (
                      <option key={project._id} value={project._id}>
                        {project.project_name}
                      </option>
                    )
                  }
                })}
              </select>
              {errors.id_project && touched.id_project && (
                <div className="text-red-500 text-sm">{errors.id_project}</div>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">
                Display Order<span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="display_order"
                value={values.display_order || ""}
                onChange={(e) => {
                  handleChange(e);
                  setFieldTouched("display_order", false);
                }}
                onBlur={handleBlur}
                placeholder="Enter Display Order"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.display_order && touched.display_order && (
                <div className="text-red-500 text-sm">
                  {errors.display_order}
                </div>
              )}
            </div>
            <div className="bg-white p-2 mt-4">
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
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="text-white rounded-md p-2 w-full lg:w-20"
                    style={{ backgroundColor: layout_color }}
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="text-white rounded-md p-2 w-full lg:w-20 bg-[#004181]"
                    // style={{ backgroundColor: layout_color }}
                  >
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