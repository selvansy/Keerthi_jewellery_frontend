import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { staffLofgin } from '../api/Endpoints';
import { useDispatch,useSelector } from 'react-redux';
import { login  } from '../../redux/authSlice';
import { setAccessmenudata,setLayoutColor } from '../../redux/clientFormSlice';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Loading from '../components/common/Loading';
import { RotatingLines } from 'react-loader-spinner';
const Login = () => {
    const dispatch= useDispatch()
    const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading,setLoading]=useState(false)

  const {mutate: loginStaff } = useMutation({
    mutationFn: staffLofgin,
    onSuccess: (response) => {
      setLoading(false)
      console.log(response)
      dispatch(login(response.token));  
      const decoded = jwtDecode(response.token);
      if (decoded.id_role.id_role === 1) {
        navigate("/superadmin/clientmaster")
      } else {
        navigate("/dashboard")
      }
    },
    onError: (error) => {
      setLoading(false)
      console.error('Error fetching countries:', error);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!isLoading){
      setLoading(true)
    loginStaff(formData)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Login</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center border rounded-lg p-2 bg-gray-50">
                <User className="text-gray-500" size={20} />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full p-2 bg-transparent border-0 focus:outline-none text-gray-700"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center border rounded-lg p-2 bg-gray-50">
                <Lock className="text-gray-500" size={20} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-2 bg-transparent border-0 focus:outline-none text-gray-700"
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button
              type={!isLoading?"submit":undefined}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {isLoading?
              <div className='flex justify-center'>
                <RotatingLines
              visible={true}
              height="10"
              width="26"
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
              wrapperStyle={{}}
              wrapperClass=""
              
              />
              </div>
              :"Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;