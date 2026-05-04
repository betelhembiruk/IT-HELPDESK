import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import NewTicket from "./pages/NewTicket";
import EditTicket from "./pages/EditTicket";

import ProtectedRoute from "./components/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      {/* ROUTES */}
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* TICKETS */}
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <Tickets />
            </ProtectedRoute>
          }
        />

        {/* NEW TICKET */}
        <Route
          path="/new-ticket"
          element={
            <ProtectedRoute>
              <NewTicket />
            </ProtectedRoute>
          }
        />

        {/* EDIT TICKET */}
        <Route
          path="/edit-ticket/:id"
          element={
            <ProtectedRoute>
              <EditTicket />
            </ProtectedRoute>
          }
        />

      </Routes>

      {/* ✅ TOAST CONTAINER (GLOBAL) */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default App;