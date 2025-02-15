import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RouteList from "./routes/RouteList";
import ProtectedRoute from "./routes/ProtectedRoute";
import ErrorPage from "./chit/components/common/ErrorPage";
import React, { lazy, Suspense } from "react";
import Loading from "./chit/components/common/Loading";

 
function App() {

  const auth=localStorage.getItem("token")

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
              route.element // If not authenticated, show the root route
            ) : route.path === "/" && auth ? (
              <Navigate to="/dashboard" /> // Redirect authenticated users to /dashboard
            ) : (
              <ProtectedRoute>{route.element}</ProtectedRoute> // Wrap other routes in ProtectedRoute
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
 