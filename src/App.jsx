import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RouteList from "./routes/RouteList";
import ProtectedRoute from "./routes/ProtectedRoute";
import ErrorPage from "./chit/components/common/ErrorPage";
 
function App() {
  return (
    <Router>
      <Routes>
        {RouteList.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              route.path === "/" ? (
                route.element
              ) : (
                <ProtectedRoute>
                  {route.element}
                </ProtectedRoute>
              )
            }
          />
        ))}
         <Route path="*" element={<ErrorPage/>} />
      </Routes>
    </Router>
  );
}
 
export default App;
 