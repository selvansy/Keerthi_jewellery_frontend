import React, { useState, useEffect } from "react";
import { getstaffbyid, getemployeebybranch, getbranchbyclient,getprojectbyclient,  getalluserrole, getallclient, addstaff,updatestaff } from '../../../api/Endpoints';
import { useMutation } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { setid } from "../../../../redux/clientFormSlice";
import { openModal } from '../../../../redux/modalSlice';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import * as Yup from 'yup';

function StaffuserForm({ setIsOpen}) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 2;
    const [activeTab, setActiveTab] = useState('userInfo');
    const [branchData, setBranchData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [project, setProject] = useState([]);
    const [roleData, setRoleData] = useState([]);
     const [clientData, setClientData] = useState([])
    const { extraData } = useSelector((state) => state.modal);
    const decodedata = useSelector((state) => state.clientForm.roledata);

    const id_role = decodedata?.id_role?.id_role;
    const id_client = decodedata?.id_client;
    const id_branch = decodedata?.branch;
    const id_project = decodedata?.id_project;

    const [formData, setFormData] = useState({
        id_employee: '',
        id_branch: '',
        id_client: '',
        id_project: '',
        access_branch: 0,
        username: '',
        password: '',
        id_role: ''
    });

    const [isLoading, setisLoading] = useState(false);
    const dispatch = useDispatch();
    const id = useSelector((state) => state.clientForm.id);

    const MenuSchema = Yup.object().shape({
        id_employee: Yup.string().required('id_employee is required'),
        id_project: Yup.string().required('id_project is required'),
        id_client: Yup.string().required('id_client required'),
        access_branch: Yup.string().required('access_branch required'),
        username: Yup.string().required('username required'),
        password: Yup.string().required('password required'),
        id_role: Yup.string().required('id_role required'),
        id_branch: Yup.string().required('id_branch required')
    });


      const { mutate: getallclientMutate } = useMutation({
        mutationFn: getallclient,
        onSuccess: (response) => {
          if (response?.data) {
            setClientData(response.data);
          }
        },
        onError: (error) => {
          console.error('Error fetching states:', error);
        }
      })

    // Get all the required data for roles, projects, branches, employees.
    const { mutate: getAllProjects } = useMutation({
        mutationFn: (clientid) => getprojectbyclient({ id_client: clientid }),
        onSuccess: (response) => {
            if (response) {
                setProject(response.data.id_project);
            }
        },
        onError: (error) => console.error('Error fetching projects:', error),
    });

    const { mutate: getbranchbyclientmutate } = useMutation({
        mutationFn: (clientId) => getbranchbyclient({ id_client: clientId }),
        onSuccess: (response) => {
            if (response?.data) {
                setBranchData(response.data);
            }
        },
        onError: (error) => console.error('Error fetching branches:', error),
    });

    const { mutate: getEmployeeByBranch } = useMutation({
        mutationFn: (id_branch) => getemployeebybranch({ id_branch: id_branch }),
        onSuccess: (response) => {
            if (response?.data) {
                setEmployeeData(response.data);
            }
        },
        onError: (error) => console.error('Error fetching employees:', error),
    });
    

    const { mutate: getAllRoles } = useMutation({
        mutationFn: getalluserrole,
        onSuccess: (response) => {
            if (response) {
                setRoleData(response.data);
            }
        },
        onError: (error) => console.error('Error fetching roles:', error),
    });

    // Add new or update staff
    const { mutate: updatestaffmutate } = useMutation({
        mutationFn: updatestaff, // replace with your actual update endpoint
        onSuccess: (response) => {
            toast.success("Staff updated successfully");
            dispatch(setid(null)); // reset any global state
            setIsOpen(false); // close the form
        },
        onError: (error) => {
            toast.error("Error updating staff");
            console.error('Error updating staff:', error);
        }
    });

   
    // Add new or add staff
    const { mutate: addstaffmutate } = useMutation({
        mutationFn: addstaff, // replace with your actual add endpoint
        onSuccess: (response) => {
            toast.success("Staff added successfully");
            dispatch(setid(null)); // reset any global state
            setIsOpen(false); // close the form
        },
        onError: (error) => {
            toast.error("Error updating staff");
            console.error('Error updating staff:', error);
        }
    }); 
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCancel = (e) => {
        e.preventDefault();
        dispatch(setid(null));
        setIsOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (id) {
            updatestaffmutate({ id, ...formData });
        } else {
         
            toast.success("New staff added successfully");
            dispatch(setid(null));
        }
    };

    useEffect(() => {
        getAllRoles();

        if (parseInt(id_role) === 1) { // Super Admin
            getallclientMutate();
            getbranchbyclientmutate(id_client);
            getAllProjects(id_client);
        } else if (parseInt(id_role) === 2) { // Admin
            getbranchbyclientmutate(id_client);
            setFormData((prevData) => ({
                ...prevData,
                id_project: id_project,
                id_client: id_client,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                id_project: id_project,
                id_client: id_client,
                id_branch: id_branch,
            }));
            getbranchbyclientmutate(id_client);            
            getEmployeeByBranch(id_branch);
        }

        if (id_branch !== "0") {
            setFormData((prevData) => ({
                ...prevData,
                id_branch: id_branch,
                id_project: id_project,
                id_client: id_client,
            }));
        }

        if (id) {
            getstaffbyidmutate(id);
        }

    }, []);

    const { mutate: getstaffbyidmutate } = useMutation({
        mutationFn: getstaffbyid,
        onSuccess: (response) => {
            if (response) {
                setFormData({
                    id: response.data._id,
                    id_employee: response.data.id_employee,
                    id_branch: response.data.id_branch,
                    id_client: response.data.id_client,
                    id_project: response.data.id_project,
                    access_branch: response.data.access_branch,
                    username: response.data.username,
                    password: "", // Don't show old password
                    id_role: response.data.id_role,
                });

                getbranchbyclientmutate(id_client);     
                getAllProjects(response.data.id_client);
                getEmployeeByBranch(response.data.id_branch);

                
            }
        },
    });

    return (
        <div>
            <Formik
                initialValues={formData}
                validationSchema={MenuSchema}
                enableReinitialize={true}
                onSubmit={handleSubmit}>
                {({ values, errors, handleBlur, setFieldValue, handleSubmit, handleChange }) => (

                    <div className="flex flex-col w-full gap-4">
                        <div className="flex relative">
                            <div
                                className={`px-6 py-2 cursor-pointer  ${activeTab === 'userInfo'
                                    ? 'text-black border-t-2 border-l-2 border-r-2 border-gray-300'
                                    : 'text-black'
                                    }`}
                                onClick={() => setActiveTab('userInfo')}
                            >
                                User Information
                            </div>
                            <div
                                className={`px-6 py-2 cursor-pointer  ${activeTab === 'roles'
                                    ? 'text-black border-t-2 border-r-2 border-l-2 border-gray-300'
                                    : 'text-black'
                                    }`}
                                onClick={() => setActiveTab('roles')}
                            >
                                Roles
                            </div>
                            <hr className={`absolute bottom-0 transition-all duration-300 border ${activeTab === 'userInfo' ? 'hidden' : 'w-[230px] right-[-24px]'
                                }`} />
                            <hr className={`absolute bottom-0 transition-all duration-300 border ${activeTab === 'userInfo' ? 'user w-[320px] right-[-24px]' : 'w-[192px] left-[-23px]'
                                }`} />
                        </div>

                        <div className="mt-4 border border-[#E0E0E0] p-4 rounded-md">
                            <div className={activeTab === 'userInfo' ? 'block' : 'hidden'}>
                                <div className="space-y-2 gap-4">
                                    <div className='flex flex-row justify-between gap-3'>

                                        {id_role === 1 && (
                                            <div className="flex flex-col space-y-2 w-1/2">
                                                <label className="font-sm text-gray-700">
                                                    Client<span className="text-red-400">*</span>
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        name='id_client'
                                                        className='appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700'
                                                        onChange={(e) => {
                                                            const client = e.target.value;
                                                            setFieldValue("id_client", client);
                                                            getbranchbyclientmutate(client);
                                                            getAllProjects(client);
                                                        }}
                                                        value={values.id_client || ''}

                                                    >
                                                        <option value='' disabled className="text-gray-700">--Select--</option>
                                                        {clientData?.map((client) => (
                                                            <option className="text-gray-700" key={client._id} value={client._id}>
                                                                {client?.company_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                                        <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                                                            <path d="M19 9l-7 7-7-7"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                {errors.id_client && <div className="text-red-500 text-sm">{errors.id_client}</div>}

                                            </div>
                                        )}

                                        {id_branch === "0" && (
                                            <div className="flex flex-col space-y-2 w-1/2">
                                                <label className="font-sm text-gray-700">
                                                    Branch<span className="text-red-400">*</span>
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        name='id_branch'
                                                        className='appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700'
                                                        onChange={(e) => {
                                                            const branch = e.target.value;

                                                            setFieldValue("id_branch", branch);
                                                            getEmployeeByBranch(branch);

                                                        }}
                                                        value={values.id_branch || ''}

                                                    >
                                                        <option value='' disabled className="text-gray-700">--Select--</option>
                                                        {branchData?.map((branch) => (
                                                            <option className="text-gray-700" key={branch._id} value={branch._id}>
                                                                {branch?.branch_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                                        <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                                                            <path d="M19 9l-7 7-7-7"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                {errors.id_branch && <div className="text-red-500 text-sm">{errors.id_branch}</div>}

                                            </div>
                                        )}

                                    </div>

                                    <div className='flex flex-row justify-between gap-3'>
                                        {id_role === 1 && (
                                            <div className="flex flex-col space-y-2 w-1/2">
                                                <label className="font-sm text-gray-700">
                                                    All Project<span className="text-red-400">*</span>
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        name='id_project'
                                                        className='appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700'
                                                        onChange={(e) => {
                                                            setFieldValue("id_project", e.target.value);
                                                        }}   
                                                        value={values.id_project || ''}

                                                    >
                                                        <option value='' disabled className="text-gray-700">--Select--</option>
                                                        {project?.map((proj) => (
                                                            <option className="text-gray-700" key={proj._id} value={proj._id}>
                                                                {proj?.project_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                                        <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                                                            <path d="M19 9l-7 7-7-7"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                {errors.id_project && <div className="text-red-500 text-sm">{errors.id_project}</div>}

                                            </div>
                                        )}
                                        <div className="flex flex-col space-y-2 w-1/2">
                                            <label className="font-sm text-gray-700">
                                                Employee<span className="text-red-400">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name='id_employee'
                                                    className='appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700'
                                                    onChange={(e) => {
                                                        setFieldValue("id_employee", e.target.value);
                                                    }}   
                                                    value={values.id_employee || ''}

                                                >
                                                    <option value='' disabled className="text-gray-700">--Select--</option>
                                                    {employeeData?.map((employee) => (
                                                        <option className="text-gray-700" key={employee._id} value={employee._id}>
                                                            {`${employee?.firstname} ${employee?.lastname}`}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                                    <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                                                        <path d="M19 9l-7 7-7-7"></path>
                                                    </svg>
                                                </div>

                                            </div>
                                            {errors.id_employee && <div className="text-red-500 text-sm">{errors.id_employee}</div>}
                                        </div>

                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <label className="font-sm text-gray-700">
                                            Username<span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={values.username || ''}
                                            onChange={handleChange}
                                            onBlur={handleBlur}

                                            placeholder="Enter Username"
                                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.username && <div className="text-red-500 text-sm">{errors.username}</div>}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <label className="font-sm text-gray-700">
                                            Password<span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={values.password || ''}
                                            onChange={handleChange}
                                            onBlur={handleBlur}

                                            placeholder="Enter Password"
                                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}

                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <label className="font-sm text-gray-700">
                                            Access Branch<span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                name='access_branch'
                                                className='appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700'
                                                onChange={(e) => {
                                                    setFieldValue("access_branch", e.target.value);
                                                }}   
                                                value={values.access_branch || ''}
                                            >

                                                <option value='0' selected className="text-gray-700">All Branch</option>
                                                {branchData?.map((branch) => (
                                                    <option className="text-gray-700" key={branch._id} value={branch._id}>
                                                        {branch?.branch_name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                                <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                                                    <path d="M19 9l-7 7-7-7"></path>
                                                </svg>
                                            </div>
                                            {errors.access_branch && <div className="text-red-500 text-sm">{errors.access_branch}</div>}

                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className={activeTab === 'roles' ? 'block' : 'hidden'}>
                                <div className="space-y-4">
                                    <div className="flex flex-col space-y-2">
                                        <label className="font-sm text-gray-700">
                                            Role<span className="text-red-400">*</span>
                                        </label>
                                        <select
                                            name="id_role"
                                            value={values.id_role || ''}
                                            onChange={(e) => {
                                                setFieldValue("id_role", e.target.value);
                                            }}   
                                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Select a role</option>
                                            {roleData?.map((role, index) => (
                                                <option key={role._id} value={role._id}>
                                                    {role.role_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {errors.id_role && <div className="text-red-500 text-sm">{errors.id_role}</div>}

                            </div>

                            <div className="bg-white p-2  mt-6 ">
                                <div className="flex justify-end gap-2 mt-3">

                                    <>
                                        <button
                                            className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>
                                        {
                                            activeTab === 'userInfo' ?
                                                <>
                                                    {!id ?
                                                        <button
                                                            onClick={() => setCurrentPage(currentPage + 1)}
                                                            className="p-2 w-full lg:w-20  text-white rounded-md bg-[#61A375]"
                                                        >
                                                            Next
                                                        </button> :
                                                        <button
                                                            disabled={isLoading}
                                                            className=" text-white rounded-md p-2 w-full lg:w-20"
                                                            style={{ backgroundColor: layout_color }} 
                                                        >
                                                            Update
                                                        </button>
                                                    }
                                                </>
                                                :
                                                <>
                                                    <button
                                                        type="submit"
                                                        disabled={isLoading}
                                                        onClick={handleSubmit}
                                                        className=" text-white rounded-md p-2 w-full lg:w-20"
                                                        style={{ backgroundColor: layout_color }} 
                                                    >
                                                        submit
                                                    </button>
                                                </>
                                        }
                                    </>


                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </Formik>

        </div>
    );
}

export default StaffuserForm;
