import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Camera, X } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { getallprojects, addclient, getclientbyid, updateclient } from '../../../api/Endpoints';
import { useMutation } from '@tanstack/react-query';
import Webcam from 'react-webcam';
import profileplaceholder from '../../../../assets/profileplaceholder.png'
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

import { useSelector } from 'react-redux';
const ClientForm = () => {
  const navigate = useNavigate()
  const { id } = useParams();

  const [errors, setFormErrors] = useState({});
  const [projectData, setProjectData] = useState([]);
  const [id_project, setProjectId] = useState([]);
  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_role = roledata?.id_role?.id_role;
  const id_client = roledata?.id_client;
  const id_branch = roledata?.branch;
  const [formData, setFormData] = useState({
    company_name: "",
    shop_contact: "",
    md_name: "",
    md_mobile: "",
    organiz_spocname: "",
    organiz_spoccontact: "",
    id_project: id_project,
    sign_date: "",
    launch_date: ""
  });




  const { mutate: getclientbyidMutate } = useMutation({
    mutationFn: getclientbyid,
    onSuccess: (response) => {
      if (response?.data) {
        // Set the form data with the response
        setFormData(response?.data);

        // Assuming response.data.id_project is a single value (or an array of IDs in some cases)
        let projetidvalue = response?.data.id_project;

        // Loop through projectData and check the active state
        if (projectData.length > 0) {
          for (let i = 0; i < projectData.length; i++) {
            let isactive = false;

            if (Array.isArray(projetidvalue)) {

              if (projetidvalue[i] === projectData[i]._id) {
                isactive = true;
              }
            } else {
              // If it's a single project ID, directly compare it
              if (projetidvalue[i] === projectData[i]._id) {
                isactive = true;
              }
            }



            // Update formData with active state for each project
            setFormData((prevState) => ({
              ...prevState,
              [`${projectData[i].project_name.toLowerCase()}_active`]: isactive
            }));
          }
        }
      }
    },
  });


  const handleInputChange = (e) => {
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


  useEffect(() => {
    if (id) {
      setFormData((prevState) => ({
        ...prevState,
        id: id
      }));
      getclientbyidMutate(id);
    }
    getallprojectMutate();
  }, []);



  const { mutate: getallprojectMutate } = useMutation({
    mutationFn: getallprojects,
    onSuccess: (response) => {
      console.log(response.data)

      if (response?.data) {
        setProjectData(response.data);
      }
    },
  });


  const handleCancle = () => {
    navigate('/superadmin/clientmaster')
  }



  const validateForm = () => {
    const errors = {};

    if (!formData.company_name.trim()) errors.company_name = 'Company name is required';
    if (!formData.shop_contact) errors.shop_contact = 'Shop Contact Number  is required';
    if (!formData.md_name) errors.md_name = 'M.D Full Name  is required';
    if (!formData.md_mobile.trim()) errors.md_mobile = 'M.D Mobile Number is required';
    if (!formData.organiz_spocname) errors.organiz_spocname = 'Organization Spoc Name is required';
    if (!formData.organiz_spoccontact) errors.organiz_spoccontact = 'Organization Spoc mobile is required';
    if (!formData.sign_date) errors.sign_date = 'Sign Date is required';
    if (!formData.launch_date) errors.launch_date = 'Launch Date is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const { mutate: updateclientMutate } = useMutation({
    mutationFn: updateclient,
    onSuccess: (response) => {
      toast.success(response.message);
      navigate('/superadmin/clientmaster');
    },
    onError: (error) => {
      console.error('Error updating employee:', error);
    }
  });



  const { mutate: addclientMutate } = useMutation({
    mutationFn: (data) => addclient(data),
    onSuccess: (response) => {
      console.log(response);
      if (response) {
        toast.success(response.message);
        navigate('/superadmin/client');
      }
    },
    onError: (error) => {
      console.error('Error adding employee:', error);
    }
  });


  const handleSubmit = () => {
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }
    if (id) {
      formData.id = id;
      updateclientMutate(formData);
    } else {
      addclientMutate(formData);
    }

  };

  const handleCheckboxChange = (projectId, project_name) => (e) => {
   
    setProjectId((prevState) => {
      let updatedProjectIds = [...prevState];
      if (e.target.checked) {
        if (!updatedProjectIds.includes(projectId)) {
          updatedProjectIds.push(projectId);
        }
      } else {
        updatedProjectIds = updatedProjectIds.filter(id => id !== projectId);
      }
      return updatedProjectIds;
    });

    setFormData((prevState) => ({
      ...prevState,
      [`${project_name}_active`]: e.target.checked,
    }));
  };

  return (
    <>
      <div className='flex flex-row justify-between'>
        {id ? (
          <h2 className='text-2xl text-[#023453] font-bold justify-between'>Edit Client</h2>
        ) : (
          <h2 className='text-2xl text-[#023453] font-bold justify-between'>Add Client</h2>
        )}

      </div>
      <div className='w-full flex flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]'>
        <div className='flex flex-col bg-white pl-8 pr-8 pb-4 pt-2 relative'>
          <div>

            <div className='grid grid-rows-2 md:grid-cols-2 gap-6 mt-5'>
              <div className="flex flex-col mt-2">
                <label className="text-black mb-1 font-medium">
                  Company Name<span className="text-red-400"> *</span>
                </label>
                <input
                  type="text"
                  name="company_name"
                  className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter Company Name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                />
                {errors.company_name && <div className="text-red-500 text-sm">{errors.company_name}</div>}
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-black mb-1 font-medium">
                  Shop Contact Number<span className="text-red-400"> *</span>
                </label>
                <input
                  type="text"
                  name="shop_contact"
                  className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter Shop Contact Number"
                  value={formData.shop_contact}
                  onChange={handleInputChange}
                />
                {errors.shop_contact && <div className="text-red-500 text-sm">{errors.shop_contact}</div>}
              </div>

              <div className="flex flex-col mt-2">
                <label className="text-black mb-1 font-medium">
                  M.D Full Name<span className="text-red-400"> *</span>
                </label>
                <input
                  type="text"
                  name="md_name"
                  className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter M.D Full Name"
                  value={formData.md_name}
                  onChange={handleInputChange}
                />
                {errors.md_name && <div className="text-red-500 text-sm">{errors.md_name}</div>}
              </div>



              <div className="flex flex-col mt-2">
                <label className="text-black mb-1 font-medium">
                  M.D Mobile Number<span className="text-red-400"> *</span>
                </label>
                <input
                  type="text"
                  name="md_mobile"
                  className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter M.D Mobile Number"
                  value={formData.md_mobile}
                  onChange={handleInputChange}
                />
                {errors.md_mobile && <div className="text-red-500 text-sm">{errors.md_mobile}</div>}
              </div>

              <div className="flex flex-col mt-2">
                <label className="text-black mb-1 font-medium">
                  Organization Spoc Name<span className="text-red-400"> *</span>
                </label>
                <input
                  type="text"
                  name="organiz_spocname"
                  className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter Organization Spoc Name"
                  value={formData.organiz_spocname}
                  onChange={handleInputChange}
                />
                {errors.organiz_spocname && <div className="text-red-500 text-sm">{errors.organiz_spocname}</div>}
              </div>

              <div className="flex flex-col mt-2">
                <label className="text-black mb-1 font-medium whitespace-nowrap">
                  Organization Spoc mobile<span className="text-red-400"> *</span>
                </label>
                <input
                  type="text"
                  name="organiz_spoccontact"
                  className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter Organization Spoc Contact Number"
                  value={formData.organiz_spoccontact}
                  onChange={handleInputChange}
                />
                {errors.organiz_spoccontact && <div className="text-red-500 text-sm">{errors.organiz_spoccontact}</div>}
              </div>

            </div>

            <div className="w-full flex flex-col gap-6 mt-4">
              <label className="text-black mb-1 text-md font-medium">
                Project Config<span className="text-red-400"> *</span>
              </label>

              <div className="w-full overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-4 border-b-2 border-gray-300">Sno</th>
                      <th className="text-left p-4 border-b-2 border-gray-300">Project Name</th>
                      <th className="text-left p-4 border-b-2 border-gray-300">Status</th>
                      <th className="text-left p-4 border-b-2 border-gray-300">URL</th>
                      <th className="text-left p-4 border-b-2 border-gray-300">Sign Date</th>
                      <th className="text-left p-4 border-b-2 border-gray-300">Launch Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {projectData.map((proj, index) => (
                      <tr key={proj._id}>
                        <td className="p-4 border-b border-gray-200 text-center">{index + 1}</td>
                        <td className="p-4 border-b border-gray-200">{proj.project_name.toLowerCase()}</td>

                        <td className="p-4 border-b border-gray-200">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name={`${proj.project_name.toLowerCase()}_active`}
                              checked={formData[`${proj.project_name.toLowerCase()}_active`]}
                              onChange={handleCheckboxChange(proj._id, proj.project_name.toLowerCase())}
                              className="sr-only peer"
                            />
                            <div
                              className={`w-14 h-6 p-3 bg-white rounded-full border transition-all transform ${formData[`${proj.project_name.toLowerCase()}_active`] ? 'peer-checked:bg-green-500 border-green-500 shadow-lg' : 'peer-checked:bg-gray-400 border-gray-400 shadow-md'}`}
                            >
                              <div
                                className={`absolute top-0.5 left-1.5 bottom-0.5 w-5 h-5 bg-black rounded-full transform transition-transform ${formData[`${proj.project_name.toLowerCase()}_active`] ? 'translate-x-6 bg-white' : ''}`}
                              ></div>
                            </div>
                          </label>
                        </td>

                        <td className="p-4 border-b border-gray-200">
                          <input
                            type="text"
                            name={`${proj.project_name.toLowerCase()}_url`}
                            value={formData[`${proj.project_name.toLowerCase()}_url`]}
                            onChange={handleInputChange}
                            disabled={!formData[`${proj.project_name.toLowerCase()}_active`]}
                            placeholder="Enter the URL"
                            className={`border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black ${formData[`${proj.project_name.toLowerCase()}_active`] ? 'border-gray-300 shadow-lg' : 'border-gray-200 bg-gray-100 shadow-md'}`}
                          />
                        </td>

                        {/* Sign Date Column */}
                        <td className="p-4 border-b border-gray-200">
                          <input
                            type="text"
                            name={`${proj.sign_date}_url`}
                            value={formData[`${proj.sign_date}_url`]}
                            onChange={handleInputChange}
                            disabled={!formData[`${proj.project_name.toLowerCase()}_active`]}
                            placeholder="Enter the sign date"
                            className={`border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black ${formData[`${proj.project_name.toLowerCase()}_active`] ? 'border-gray-300 shadow-lg' : 'border-gray-200 bg-gray-100 shadow-md'}`}
                          />
                        </td>

                        {/* Launch Date Column */}
                        <td className="p-4 border-b border-gray-200">
                          <input
                            type="text"
                            name={`${proj.launch_date}_url`}
                            value={formData[`${proj.launch_date}_url`]}
                            onChange={handleInputChange}
                            disabled={!formData[`${proj.project_name.toLowerCase()}_active`]}
                            placeholder="Enter the launch date"
                            className={`border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black ${formData[`${proj.project_name.toLowerCase()}_active`] ? 'border-gray-300 shadow-lg' : 'border-gray-200 bg-gray-100 shadow-md'}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>

          <div className='mt-5'>
            <div className='bg-white mt-6'>
              <div className='flex justify-end gap-2 mt-3'>
                <button
                  className='bg-[#E2E8F0] mt-4 text-black rounded-md p-3 w-full lg:w-20'
                  type='button'
                  onClick={handleCancle}
                >
                  Cancel
                </button>
                <button
                  className='bg-[#61A375] mt-4 text-white rounded-md p-3 w-full lg:w-20'
                  type='button'
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default ClientForm;