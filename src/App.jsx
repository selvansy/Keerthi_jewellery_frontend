import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RouteList from "./routes/RouteList";
import ProtectedRoute from "./routes/ProtectedRoute";
 
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
      </Routes>
    </Router>
  );
}
 
export default App;
 