import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/SideBar";

const DashboardHome = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Content Area */}
      <div className="flex flex-col w-full">
        <Navbar />
        <main className="bg-primary p-6 flex-grow overflow-y-scroll">
          <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
          <p className="mt-4">Manage your products and account here.</p>
        </main>
      </div>
    </div>
  );
};

export default DashboardHome;
