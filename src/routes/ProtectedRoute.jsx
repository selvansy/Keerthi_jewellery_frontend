import { jwtDecode } from 'jwt-decode';
 
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout,SetMenu,SetsubMenu } from '../redux/authSlice';
import { useEffect } from 'react';
import { setRoleData } from '../redux/clientFormSlice';
import { getactivemenuaccess } from "../chit/api/Endpoints"
import { useMutation } from '@tanstack/react-query';
 
const ProtectedRoute = ({ children }) => {
  const { info } = useSelector((state) => state.auth);
  const { allowedRoute } = useSelector((state) => state.auth);
   
  
  const dispatch = useDispatch();
  
  const storedToken = localStorage.getItem('token');
  const token = info || storedToken;
 
  if (!storedToken) {
    return <Navigate to="/" replace />;
  }
 
    const decoded = jwtDecode(storedToken);

    let id = decoded.id_role._id;
 
      useEffect(() => {
        if(token){
              getAllMenusMutate(decoded.id_role._id);
          dispatch(setRoleData(decoded));
        }
      }, [token]);
 
     
  const { mutate: getAllMenusMutate } = useMutation({
    mutationFn: getactivemenuaccess,
    onSuccess: (response) => {      
      dispatch(SetMenu(response.data))
    },
  });
 
 
  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
  };
 
  if (!token) {
    return <Navigate to="/" replace />;
  }
 
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
 
    if (decodedToken.exp < currentTime) {
      handleLogout();
      return <Navigate to="/" replace />;
    }
   
    if (!decodedToken.id_employee) {
      return <Navigate to="/" replace />;
    }
 
    return children;
  } catch (error) {
    console.error('Invalid token:', error);
    handleLogout();
    return <Navigate to="/" replace />;
  }
};
 
export default ProtectedRoute;