import React, { useState, useEffect } from "react";
import { getallprojects, typeway, getpaymentmodebyid, addpaymentmode, updatepaymentmode } from '../../../api/Endpoints'; // Add addpaymentmode and updatepaymentmode API
import { useMutation } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { setid } from "../../../../redux/clientFormSlice";
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import * as Yup from 'yup';

function PaymentmodeForm({ setIsOpen }) {

    const [isLoading, setisLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [filtertype, setFiltertype] = useState([]);

    const [formData, setFormData] = useState({
        mode_name: '',
        payment_method_type: '',
        id_project: '',
    });

    let dispatch = useDispatch();
    const id = useSelector((state) => state.clientForm.id);
    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    const PaymentmodeSchema = Yup.object().shape({
        mode_name: Yup.string().required('Mode name is required'),
        id_project: Yup.string().required('Project is required'),
        payment_method_type: Yup.string().required('Payment method type is required'),
    });

    // Fetching all projects
    const { mutate: getallprojectsMutate } = useMutation({
        mutationFn: getallprojects,
        onSuccess: (response) => {
            if (response) {
                setProjects(response.data);
            }
        },
    });

    // Fetching existing payment mode details for editing
    const { mutate: getPaymentmodeId } = useMutation({
        mutationFn: getpaymentmodebyid,
        onSuccess: (response) => {
            setFormData({
                mode_name: response.data.mode_name,
                payment_method_type: response.data.payment_method_type,
                id_project: response.data.id_project,
            });
        },
    });

    // Fetching all types of ways (payment types)
    const { mutate: typewayMutate } = useMutation({
        mutationFn: typeway,
        onSuccess: (response) => {
            if (response) {
                setFiltertype(response.data);
            }
        },
    });

    const handleCancel = (e) => {
        e.preventDefault();
        dispatch(setid(null));
        setIsOpen(false);
    };

    const handleSubmit = (formData, resetForm) => {
        ;

        if (id) {
            // Update payment mode
            updatepaymentmode({id:id}, {data:formData})
                .then(() => {
                    toast.success("Payment mode updated successfully");
                    resetForm();
                    dispatch(setid(null));
                    setIsOpen(false);
                })
                .catch((error) => {
                    toast.error("Error updating payment mode");
                    console.error(error);
                });
        } else {
            // Create new payment mode
            addpaymentmode(formData)
                .then(() => {
                    toast.success("Payment mode added successfully");
                    resetForm();
                    setIsOpen(false);
                })
                .catch((error) => {
                    toast.error("Error adding payment mode");
                    console.error(error);
                });
        }
    };

    useEffect(() => {
        if (id) {
            getPaymentmodeId(id); // Fetch data for editing if id is available
        }
    }, [id]);

    useEffect(() => {
        getallprojectsMutate(); // Fetch all projects
        typewayMutate(); // Fetch payment types
    }, []);

    return (
        <div>
            <Formik
                initialValues={formData}
                validationSchema={PaymentmodeSchema}
                enableReinitialize={true}
                onSubmit={(values, { resetForm }) => {
                    handleSubmit(values, resetForm);
                }}
            >
                {({ values, errors, handleBlur, handleSubmit, handleChange }) => (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="flex flex-col space-y-2">
                            <label className="font-medium text-gray-700">
                                Mode Name<span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="mode_name"
                                value={values.mode_name || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter Mode Name"
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.mode_name && <div className="text-red-500 text-sm">{errors.mode_name}</div>}
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="font-medium text-gray-700">
                                Payment Method Type<span className="text-red-400">*</span>
                            </label>
                            <select
                                name="payment_method_type"
                                value={values.payment_method_type || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select</option>
                                {filtertype.map((way) => (
                                    <option key={way.id} value={way.name}>
                                        {way.name}
                                    </option>
                                ))}
                            </select>
                            {errors.payment_method_type && <div className="text-red-500 text-sm">{errors.payment_method_type}</div>}
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
                                    readOnly={isLoading}
                                    className=" text-white rounded-md p-2 w-full lg:w-20"
                                    style={{ backgroundColor: layout_color }} >
                                    {id ? 'Update' : 'Submit'}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
}

export default PaymentmodeForm;
