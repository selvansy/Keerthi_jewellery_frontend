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


// import React, { Suspense } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import {jwtDecode} from "jwt-decode";

// import RouteList from "./routes/RouteList";
// import ProtectedRoute from "./routes/ProtectedRoute";
// import ErrorPage from "./chit/components/common/ErrorPage";
// import Loading from "./chit/components/common/Loading";

// function App() {
//   const auth = localStorage.getItem("token");
//   const { menu, info } = useSelector((state) => state.auth);

//   // Decode JWT to extract role
//   let isSuperAdmin = false;
//   try {
//     const decoded = jwtDecode(info);
//     isSuperAdmin = decoded?.id_role?.id_role === 1;
//   } catch (error) {
//     console.error("JWT decoding failed", error);
//   }

//   // Function to extract valid paths from menu
//   const getValidPathsFromMenu = (menu) => {
//     if (!Array.isArray(menu)) return [];

//     const paths = [];

//     const extractPaths = (items) => {
//       items.forEach((item) => {
//         if (item.pathurl) paths.push(item.pathurl);
//         if (Array.isArray(item.menu_list)) extractPaths(item.menu_list);
//       });
//     };

//     extractPaths(menu);
//     return paths;
//   };

//   const validPaths = getValidPathsFromMenu(menu);

//   // Routes that should always be allowed
//   const isExemptPath = (path) =>
//     ["/", "/login", "/logout", "/dashboard","/table"].includes(path);

//   return (
//     <Router>
//       <Suspense fallback={<Loading />}>
//         <Routes>
//           {RouteList.map((route, index) => {
//             const isAllowedPath =
//               isSuperAdmin || isExemptPath(route.path) || validPaths.includes(route.path);

//             if (!isAllowedPath) {
//               return null; // Skip unauthorized route
//             }

//             return (
//               <Route
//                 key={index}
//                 path={route.path}
//                 element={
//                   route.path === "/" && auth ? (
//                     <Navigate to="/dashboard" replace />
//                   ) : route.path === "/" && !auth ? (
//                     route.element
//                   ) : !auth ? (
//                     <Navigate to="/" replace />
//                   ) : (
//                     <ProtectedRoute>{route.element}</ProtectedRoute>
//                   )
//                 }
//               />
//             );
//           })}

//           {/* Catch-all for unmatched paths */}
//           <Route path="*" element={<ErrorPage />} />
//         </Routes>
//       </Suspense>
//     </Router>
//   );
// }

// export default App;
