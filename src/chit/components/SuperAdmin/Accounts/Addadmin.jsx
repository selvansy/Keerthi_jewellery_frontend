import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import { Formik } from 'formik';
import * as Yup from 'yup';


function Addadmin({ isLoading = false, setisAdmin }) {

    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    let [errorMessage, setErrorMessage] = useState("");
    let [submit, setSubmit] = useState(false);
    let navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        password: "",
    });

    const adminSchema = Yup.object().shape({
        name: Yup.string().required('* Required'),
        email: Yup.string().email('* Invalid Email').required('* Required'),
        contact: Yup.string().matches(/^\d{10}$/, '* Invalid Phone Number').required('* Required'),
        password: Yup.string().required('*Required'),
        role: Yup.string()
    })

    const handleCancel = () => {
        setisAdmin(true);
        navigate("/superadmin/admin")
        if (id) {
            setisAdmin(false);
        }
    };

    const handleSubmit = (values) => {

        
    }


    return <>
        <div className="flex justify-center items-center bg-gray-100">
            <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">Add Admin</h2>
                <div className="mb-8">
                    {/* Formik  */}
                    <Formik
                        initialValues={formData}
                        validationSchema={adminSchema}
                        enableReinitialize={true}
                        onSubmit={(values, e) => {
                            handleSubmit(values, e)
                        }}>
                        {({ values, errors, handleBlur, handleSubmit, handleChange }) => (
                            <>
                                <div className='flex flex-col gap-2 mt-4'>
                                    <label className="text-black mb-1 font-medium">
                                        Name<span className="text-red-400"> *</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        placeholder="Enter Name"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                                </div>

                                <div className='flex flex-col gap-2 mt-4'>
                                    <label className="text-black mb-1 font-medium">
                                        Contact Number<span className="text-red-400"> *</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="contact"
                                        className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        placeholder="Enter Contact Number"
                                        value={values.contact}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.contact && <div className="text-red-500 text-sm">{errors.contact}</div>}
                                </div>


                                <div className='flex flex-col gap-2 mt-4'>
                                    <label className="text-black mb-1 font-medium">
                                        Email<span className="text-red-400"> *</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="email"
                                        className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        placeholder="Enter Email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                                </div>

                                <div className='relative flex flex-col gap-2 mt-4'>
                                    <label className="text-black mb-1 font-medium">
                                        Password<span className="text-red-400"> *</span>
                                    </label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        placeholder="Enter Password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <span
                                        className="absolute top-11 inline-block right-3 cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}>
                                        <i className={showPassword ? "bi bi-eye-fill" : "bi bi-eye-slash"}></i>
                                    </span>
                                    {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
                                </div>


                                <div className="bg-white p-2 border-t-2 border-gray-300 mt-4">
                                    <div className="flex justify-end gap-2 mt-3">
                                        <button
                                            className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
                                            type="button"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            readOnly={isLoading}
                                            className=" text-white rounded-md p-2 w-full lg:w-20"
                                            onClick={(values) => handleSubmit(values)}
                                            style={{ backgroundColor: layout_color }}  >
                                            Submit
                                        </button>
                                    </div>
                                </div>

                            </>

                        )}

                    </Formik>
                </div >
            </div>
        </div>

    </>

}

export default Addadmin