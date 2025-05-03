import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/SideBar";
import { useLocation } from "react-router-dom";
import UploadProduct from "./ProductManagement/UploadProduct";
import Overview from "./Overview";
import AllProducts from "./ProductManagement/AllProducts";
import Orders from "./Orders";
import Profile from "./Profile";
import Billing from "./Billing";
import Settings from "./Settings";
import Reviews from "./ReviewsManagement/Reviews";
import Chat from "./Chat/Chat";
import SupportAndDisputes from "./SupportAndDisputes";

const DashboardHome = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tab, setTab] = useState("overview");
  const fullUrl = location.pathname + location.search;
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        activeTab={fullUrl}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Content Area */}
      <div className="flex flex-col w-full md:ml-[256px] bg-stone-200   overflow-auto">
        <Navbar />
        <div className="p-4">
          {tab === "upload-product" && <UploadProduct />}
          {tab === "overview" && <Overview />}
          {tab === "profile" && <Profile />}

          {tab === "products" && <AllProducts />}
          {tab === "orders" && <Orders />}
          {tab === "reviews" && <Reviews />}
          {tab === "settings" && <Settings />}
          {tab === "chat" && <Chat />}
          {tab === "billing" && <Billing />}
          {tab === "support" && <SupportAndDisputes />}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
