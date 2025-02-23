import React, { useState, useEffect } from 'react';
import { getallprojects, getallmenu, getallsubmenudatatable, changesubmenuStatus, deletesubmenu, getsubmenuById, updatesubmenu, addsubmenu } from '../../../api/Endpoints';
import { useMutation } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { setid } from "../../../../redux/clientFormSlice"
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import * as Yup from 'yup';


function SubmenuForm({ setIsOpen, getallsubmenusMutate, menus }) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 2;
    const [projects, setProjects] = useState([]);
    const roledata = useSelector((state) => state.clientForm.roledata);
    const id_role = roledata?.id_role?.id_role;
    const id_client = roledata?.id_client;
    const id_branch = roledata?.branch;
    const id_project = roledata?.id_project;
    const [isLoading, setisLoading] = useState(false);
    const layout_color = useSelector((state) => state.clientForm.layoutColor);
    let dispatch = useDispatch();
    const id = useSelector((state) => state.clientForm.id);

    const [formData, setFormData] = useState({
        submenu_name: '',
        id_menu: '',
        display_order: '',
        id_project: '',
        pathurl: ''
    });

    const [formErrors, setFormErrors] = useState({});

    // ✅ Improved Validation Function
    const validateForm = () => {
        let errors = {};

        if (!formData.submenu_name.trim()) errors.submenu_name = 'Submenu name is required';
        if (!formData.id_project) errors.id_project = 'Project selection is required';
        if (!formData.id_menu) errors.id_menu = 'Menu selection is required';
        if (!formData.display_order || isNaN(formData.display_order) || Number(formData.display_order) <= 0) {
            errors.display_order = 'Valid display order is required';
        }
        if (!formData.pathurl.trim()) errors.pathurl = 'Path URL is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setFormErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const { mutate: getallprojectsMutate } = useMutation({
        mutationFn: getallprojects,
        onSuccess: (response) => {
            if (response) {
                setProjects(response.data);
            }
        },
    });

    const { mutate: getallsubid } = useMutation({
        mutationFn: getsubmenuById,
        onSuccess: (response) => {
            if (response) {
                setFormData(response.data);
            }
        },
    });

    const handleCancel = (e) => {
        e.preventDefault();
        dispatch(setid(null));
        setIsOpen(false);
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            toast.error("Please fill in all required fields correctly.");
            return;
        }
        try {
            const updateData = {
                submenu_name: formData.submenu_name.trim(),
                display_order: formData.display_order,
                id_menu: formData.id_menu,
                id_project: formData.id_project,
                pathurl: formData.pathurl.trim()
            };

            console.log(updateData);

            if (id) {
                updatesubmenumutate(updateData);
            } else {
                createsubmenuMutate(updateData);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const { mutate: createsubmenuMutate } = useMutation({
        mutationFn: addsubmenu,
        onSuccess: (response) => {
            console.log(response);
            toast.success(response.message);
            dispatch(setid(null));
            setIsOpen(false);
            navigate("/setup/submenu");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Error occurred while adding submenu.");
        },
        onMutate: () => setisLoading(true),
        onSettled: () => setisLoading(false),
    });

    const { mutate: updatesubmenumutate } = useMutation({
        mutationFn: (data) => updatesubmenu(id, data),
        onSuccess: (response) => {
            console.log(response);
            toast.success(response.message);
            dispatch(setid(null));
            setIsOpen(false);
            navigate("/setup/submenu");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Error occurred while updating submenu.");
        },
        onMutate: () => setisLoading(true),
        onSettled: () => setisLoading(false),
    });

    useEffect(() => {
        getallprojectsMutate();
        if (id) {
            getallsubid(id);
        }
    }, [id]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col space-y-2">
                <label className="font-medium text-gray-700">
                    Sub Menu Name<span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    name="submenu_name"
                    value={formData.submenu_name}
                    onChange={handleChange}
                    placeholder="Enter Sub Menu Name"
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.submenu_name && <div className="text-red-500 text-sm">{formErrors.submenu_name}</div>}
            </div>

            <div className="flex flex-col space-y-2">
                <label className="font-medium text-gray-700">
                    Menu<span className="text-red-400">*</span>
                </label>
                <select name="id_menu" value={formData.id_menu} onChange={handleChange} className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Menu</option>
                    {menus.map((menu) => (
                        <option key={menu._id} value={menu._id}>{menu.menu_name}</option>
                    ))}
                </select>
                {formErrors.id_menu && <div className="text-red-500 text-sm">{formErrors.id_menu}</div>}
            </div>

            <div className="flex flex-col space-y-2">
                <label className="font-medium text-gray-700">
                    Project<span className="text-red-400">*</span>
                </label>
                <select name="id_project" value={formData.id_project} onChange={handleChange} className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Project</option>
                    {projects.map((project) => (
                        <option key={project._id} value={project._id}>{project.project_name}</option>
                    ))}
                </select>
                {formErrors.id_project && <div className="text-red-500 text-sm">{formErrors.id_project}</div>}
            </div>

            <div className="flex flex-col space-y-2">
                <label className="font-medium text-gray-700">
                    Display Order<span className="text-red-400">*</span>
                </label>
                <input type="number" name="display_order" value={formData.display_order} onChange={handleChange} placeholder="Enter Display Order" className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {formErrors.display_order && <div className="text-red-500 text-sm">{formErrors.display_order}</div>}
            </div>

            <div className="flex flex-col space-y-2">
                <label className="font-medium text-gray-700">
                    Path Url<span className="text-red-400">*</span>
                </label>
                <input type="text" name="pathurl" value={formData.pathurl} onChange={handleChange} placeholder="Enter Path Url" className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {formErrors.pathurl && <div className="text-red-500 text-sm">{formErrors.pathurl}</div>}
            </div>

            <button onClick={handleSubmit} className="bg-blue-500 text-white p-3 rounded-md">Submit</button>
        </div>
    );
}
export default SubmenuForm;