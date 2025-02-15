import { jwtDecode } from 'jwt-decode';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useEffect } from 'react';
import { setRoleData } from '../redux/clientFormSlice';

const ProtectedRoute = ({ children }) => {
  const location=useLocation()  
  const { allowedRoutes } = useSelector((state) => state.menuSlice);
  const dispatch = useDispatch();
  const storedToken = localStorage.getItem('token');
  const token =  storedToken;
  
  const menuSetting=[...allowedRoutes,'dashboard','']
  console.log(menuSetting);
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  let decoded;
  try {
    decoded = jwtDecode(token);
    
  } catch (error) {
    console.error('Invalid token:', error);
    handleLogout();
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    if (decoded) {
      dispatch(setRoleData(decoded));
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
  };

  const currentTime = Date.now() / 1000;

  // const allowedRoute=menuSetting.includes(location.pathname.slice(1))

  

  // if(!allowedRoute) return "Not access"

  if (decoded.exp < currentTime) {
    handleLogout();
    return <Navigate to="/" replace />;
  }

  if (!decoded.id_employee) {
    return <Navigate to="/" replace />;
  }



  return children;
};

export default ProtectedRoute;
