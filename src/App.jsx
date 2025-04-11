import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RouteList from "./routes/RouteList";
import ProtectedRoute from "./routes/ProtectedRoute";
import ErrorPage from "./chit/components/common/ErrorPage";
import React, { lazy, Suspense } from "react";
import Loading from "./chit/components/common/Loading";
import { useSelector } from "react-redux";
import { requestNotificationPermission } from "./firebase";
import { useEffect } from "react";

 
function App() {

  // useEffect(() => {
  //   const runNotificationPermission = async () => {
  //     if (Notification.permission === 'default') {
  //       console.log('Requesting permission on load...');
  //       await requestNotificationPermission();
  //     } else {
  //       console.log('Notification already:', Notification.permission);
  //     }
  //   };

  //   runNotificationPermission();
  // }, []);

  const auth=localStorage.getItem("token")
  const { menu } = useSelector((state) => state.auth);
  
  return (
    <Router>
        <Suspense fallback={<Loading />}>
      <Routes>
        {RouteList.map((route, index) => (
          <Route
          key={index}
          path={route.path}
          element={
            route.path === "/" && !auth ? (
              route.element
            ) : route.path === "/" && auth ? (
              <Navigate to="/dashboard" />
            ) : (
              <ProtectedRoute>{route.element}</ProtectedRoute>
            )
          }
        />
        ))}
       
         <Route path="*" element={<ErrorPage/>} />
      </Routes>
      </Suspense>
    </Router>
  );
}
 
export default App;