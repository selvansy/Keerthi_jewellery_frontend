import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { X } from 'lucide-react'
import { getprojectaccessbyid, getbranchbyclient, getprojectbyclient, getallclient, updateprojectaccess, addprojectaccess } from "../../../api/Endpoints"
import { toast } from "sonner";
import { useDispatch, useSelector } from 'react-redux';
import { setid } from "../../../../redux/clientFormSlice"
import profileplaceholder from "../../../../../src/assets/profileplaceholder.png"


const ProjectAccessForm = ({ refetch, setIsOpen}) => {

    let dispatch = useDispatch();
   

    let navigate = useNavigate();
    const id = useSelector((state) => state.clientForm.id);
    const [clientfilter, setClientFilter] = useState([]);
    const [projectfilter, setProjectFilter] = useState([]);
    const [branchfilter, setBranchFilter] = useState([]);
    const [projectid, setProjectId] = useState([]);
    const [formData, setFormData] = useState({
        id_branch: '',
        id_project: [],
        id_client: '',
    });
    const [formErrors, setFormErrors] = useState({});


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // For the 'id_project' field (multiple select)
    
        if (name === "id_project") {
       
            const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
            setFormData((prev) => ({
                ...prev,
                [name]: selectedValues, // Update to an array
            }));
            setProjectId([selectedValues]); // Update projectid state as well
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
            setFormErrors((prev) => ({
                ...prev,
                [name]: "",
            }));

            if (name === "id_client") {
                if(value !==""){
                    getprojectbyclientMutate({ id_client: value });
                    getbranchbyclientMutate({ id_client: value });
                }
            }
        }
    };

    const validateForm = () => {
        const errors = {};
        
        const projectidArray = formData.id_project; 
        if (!formData.id_branch) errors.id_branch = "Branch is required";
        if (projectidArray.length === 0) errors.id_project = "Project is required";
        if (!formData.id_client) errors.id_client = "Client is required";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const { mutate: getallclientMutate } = useMutation({
        mutationFn: getallclient,
        onSuccess: (response) => {
            if (response) {
                setClientFilter(response.data);
            }
        },
    });

    const { mutate: getprojectbyclientMutate } = useMutation({
        mutationFn: (id) => getprojectbyclient(id),
        onSuccess: (response) => {

            if (response) {
                setProjectFilter(response.data.id_project);
            }
        },
    });

    const { mutate: getbranchbyclientMutate } = useMutation({
        mutationFn: (id) => getbranchbyclient(id),
        onSuccess: (response) => {
            if (response) {
                setBranchFilter(response.data);
            }
        },
    });



    //handle submit
    const handleSubmit = () => {
        if (!validateForm()) {
            toast.error("Fill required fields")
            return;
        }
        addprojectaccessMutate(formData);
    };

    useEffect(() => {
        getallclientMutate();
        if (id) {
            getprojectaccessbyidmutate(id);         
                
          }
    }, [])

    const handleCancle = (e) => {
        e.preventDefault();
        dispatch(setid(null))
        setIsOpen(false)
    };


    const { mutate: getprojectaccessbyidmutate } = useMutation({
        mutationFn: getprojectaccessbyid,
        onSuccess: (response) => {
            setFormData(response.data);
            setProjectId(response.data.id_project);
          
            getprojectbyclientMutate({ id_client: response.data.id_client });
            getbranchbyclientMutate({ id_client: response.data.id_client });
        },
        onError: (error) => {
            console.error("Error fetching countries:", error);
        },
    });


    const { mutate: addprojectaccessMutate } = useMutation({
        mutationFn: addprojectaccess,
        onSuccess: (response) => {
            toast.success(response.message)
            setFormData({
                id_branch: "",
                id_client: "",
                id_project: []
            });
         
            dispatch(setid(null))
            setIsOpen(false)
            navigate('/superadmin/projectaccess')
        },
        onError: (error) => {
            toast.error(error.response.message)
        }
    });
    const { mutate: updateprojectaccessmutate } = useMutation({
        mutationFn: updateprojectaccess,
        onSuccess: (response) => {
            toast.success(response.message);
            dispatch(setid(null))
            setIsOpen(false)
            navigate('/superadmin/projectaccess')
        },
        onError: (error) => {
            toast.error(error.response.message);
        },
    });



    const handleUpdate = () => {
        if (!validateForm()) {
            toast.error("Fill required fields")
            return;
        }
      
        updateprojectaccessmutate(formData);
    };

    return (
        <>

            <div className="w-full flex flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]">
                <div className="flex flex-col p-4 bg-white relative">
                    <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300 mb-10">

                        <div className="flex flex-col">
                            <label className="text-gray-700 mb-2 mt-2 font-medium">
                                Client<span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    name="id_client"
                                    value={formData.id_client}
                                    onChange={handleInputChange}
                                    className="appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                >
                                    <option value="">
                                        Select
                                    </option>
                                    {clientfilter.map((client) => (
                                        <option
                                            className="text-gray-700"
                                            key={client._id}
                                            value={client._id}
                                        >
                                            {client.company_name}
                                        </option>
                                    ))}
                                </select>

                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    <svg
                                        className="h-4 w-4 text-gray-400"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="3"
                                        viewBox="0 0 24 24"
                                        stroke="black"
                                    >
                                        <path d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                            {formErrors.id_client && (
                                <span className="text-red-500 text-sm mt-1">
                                    {formErrors.id_client}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 mb-2 mt-2 font-medium">
                                Branch<span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    name="id_branch"
                                    value={formData.id_branch}
                                    onChange={handleInputChange}
                                    className="appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                >
                                    <option value="">
                                        Select
                                    </option>
                                    {branchfilter.map((branch) => (
                                        <option
                                            className="text-gray-700"
                                            key={branch._id}
                                            value={branch._id}
                                        >
                                            {branch.branch_name}
                                        </option>
                                    ))}
                                </select>

                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    <svg
                                        className="h-4 w-4 text-gray-400"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="3"
                                        viewBox="0 0 24 24"
                                        stroke="black"
                                    >
                                        <path d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                            {formErrors.id_branch && (
                                <span className="text-red-500 text-sm mt-1">
                                    {formErrors.id_branch}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 mb-2 mt-2 font-medium">
                                Project<span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    multiple
                                    name="id_project"
                                    value={formData.id_project}
                                    onChange={handleInputChange}
                                    className="appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                >
                                    <option value="">Select</option>
                                    {projectfilter.map((project) => (
                                        <option
                                            className="text-gray-700"
                                            key={project._id}
                                            value={project._id}
                                        >
                                            {project.project_name}
                                        </option>
                                    ))}
                                </select>

                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    <svg
                                        className="h-4 w-4 text-gray-400"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="3"
                                        viewBox="0 0 24 24"
                                        stroke="black"
                                    >
                                        <path d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                            {formErrors.id_project && (
                                <span className="text-red-500 text-sm mt-1">
                                    {formErrors.id_project}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="bg-white">
                        <div className="flex justify-end gap-4">
                            <button
                                className="bg-[#E2E8F0] text-black rounded-md p-3 w-full lg:w-20"
                                type="button"
                                onClick={handleCancle}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-[#61A375] text-white rounded-md p-2 w-full lg:w-20"
                                type="button"
                                onClick={id ? handleUpdate : handleSubmit}
                            >
                                {id ? "Update" : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectAccessForm;