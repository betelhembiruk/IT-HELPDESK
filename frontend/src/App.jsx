import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import NewTicket from "./pages/NewTicket";
import EditTicket from "./pages/EditTicket"; // ✅ ADD THIS

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
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

      {/* TICKETS LIST */}
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

      {/* ✏️ EDIT TICKET (NEW ROUTE) */}
      <Route
        path="/edit-ticket/:id"
        element={
          <ProtectedRoute>
            <EditTicket />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
};

export default App;