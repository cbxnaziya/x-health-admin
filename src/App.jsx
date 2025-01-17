import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { Toaster } from "react-hot-toast";

// Mock Authentication Check (Replace with your actual logic)
const isAuthenticated = () => {
  // Example: Check token in localStorage or session
  return !!localStorage.getItem("token");
};

// PrivateRoute Component
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/auth/sign-in" replace />;
};

// PublicRoute Component
const PublicRoute = ({ children }) => {
  return !isAuthenticated() ? children : <Navigate to="/dashboard/home" replace />;
};

function App() {
  return (
    <>
      <div className="App">
        {/* Global Toaster Component */}
        <Toaster />

        <Routes>
          {/* Private Routes */}
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Public Routes */}
          <Route
            path="/auth/*"
            element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;



// import { Routes, Route, Navigate } from "react-router-dom";
// import { Dashboard, Auth } from "@/layouts";
// import { Toaster } from "react-hot-toast";

// function App() {
//   return (
//     <>
//          <div className="App">
//         <Toaster  />
//     <Routes>

//         {/* Global Toaster Component */}
      
//       <Route path="/dashboard/*" element={<Dashboard />} />
//       <Route path="/auth/*" element={<Auth />} />
//       <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
//     </Routes>
//          </div>
//     </>
//   );
// }

// export default App;
