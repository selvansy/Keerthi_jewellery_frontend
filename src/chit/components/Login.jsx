import React, { useState,useEffect} from "react";
import { useMutation } from "@tanstack/react-query";
import { staffLofgin,adminLogin} from "../api/Endpoints";
import { useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import SpinLoading from "./common/spinLoading";
// import Logo from "../../assets/login.svg"; //aupay default
import Logo from "../../assets/logo(3).svg";
import Background from "../../assets/LoginBg.png";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useLocation } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation()

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [superMan,setSuperMan]= useState(false)

  const { mutate: loginStaff } = useMutation({
    mutationFn: superMan ? adminLogin : staffLofgin,
    onSuccess: (response) => {
      setLoading(false);
      dispatch(login(response.token));
      dispatch(SetMenu(response.menuData));
      const decoded = jwtDecode(response.token);
      if (decoded.id_role.id_role === 1) {
        navigate("/superadmin/clientmaster");
      } else {
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.response.data.message);
      console.error("Error fetching countries:", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoading) {
      setLoading(true);
      loginStaff(formData);
    }
  };

  useEffect(() => {
    if (location.pathname === "/superdata") {
      
      setSuperMan(true);
    } else {
      setSuperMan(false);
    }
  }, [location.pathname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md bg-white shadow-lg rounded-[16px] p-6">
        <div className="text-center mb-1  flex justify-center py-3">
          <img src={Logo} alt="" srcSet="" />
        </div>
        <div className="text-center py-3">
          <h1 className="text-2xl font-bold text[#232323]">Sign-In</h1>
        </div>
        <div className="flex justify-center mb-4 -mt-2">
          <p className="w-[320px] text-[#6C7086] text-center ">
            Access the Aupay panel using your username and password.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
              <div className="">
            <label htmlFor="" className="font-semibold text-[#232323]">
                Username<span className="text-[#F04438]">*</span>{" "}
              </label>
              <div className="flex items-center border border-[#f2f3f8] rounded-lg mt-1">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent focus:ring-1 custom-height focus:ring-[#004181] outline-none  rounded-lg "
                />
              </div>
            </div>
            <div className="">
              <label htmlFor="" className=" font-semibold text-[#232323]">
                Password<span className="text-[#F04438]">*</span>{" "}
              </label>
              <div className="flex items-center border border-[#f2f3f8] rounded-lg  relative mt-1">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-0 custom-height focus:ring-1 focus:ring-[#004181] outline-none rounded-lg "
                />
                <div
                  className="absolute right-3 text-[#6C7086] cursor-pointer"
                  onClick={() => setShowPass((prev) => !prev)}
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button
              type={!isLoading ? "submit" : undefined}
              className="btn-pd w-full text-white rounded-lg bg-[#004181] font-semibold transition duration-200"
            >
              {isLoading ? (
                <div className="flex justify-center">
                  <SpinLoading />
                </div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
