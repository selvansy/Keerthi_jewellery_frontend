import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
 
const ProtectedRoute = ({ children }) => {
  const { info } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
 
  const storedToken = localStorage.getItem('token');
  const token = info || storedToken;
 
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
 