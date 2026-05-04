import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "20px", background: "#f5f5f5" }}>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;