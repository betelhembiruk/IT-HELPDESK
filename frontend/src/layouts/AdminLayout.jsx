import Sidebar from "../components/Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          background: "#f4f6f8",
          padding: "20px"
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;