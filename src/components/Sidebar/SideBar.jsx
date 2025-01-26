import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FcBullish } from "react-icons/fc";
import { HiOutlineLogout } from "react-icons/hi";

import {
  HiOutlineViewGrid,
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineUsers,
  HiOutlineDocumentText,
  HiOutlineAnnotation,
  HiOutlineQuestionMarkCircle,
  HiOutlineCog,
} from "react-icons/hi";

const DASHBOARD_SIDEBAR_LINKS = [
  {
    label: "Overview",
    path: "/dashboard?tab=overview",
    icon: <HiOutlineViewGrid />,
  },
  {
    label: "Profile",
    path: "/dashboard?tab=profile",
    icon: <HiOutlineCube />,
  },
  {
    label: "Upload Product",
    path: "/dashboard?tab=upload-product",
    icon: <HiOutlineCube />,
  },
  {
    label: "Products",
    path: "/dashboard?tab=products",
    icon: <HiOutlineCube />,
  },
  {
    label: "Orders",
    path: "/dashboard?tab=orders",
    icon: <HiOutlineShoppingCart />,
  },
];

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  {
    label: "Settings",
    path: "/settings",
    icon: <HiOutlineCog />,
  },
  {
    label: "Billing",
    path: "/dashboard?tab=billing",
    icon: <HiOutlineCog />,
  },
  {
    label: "Help & Support",
    path: "/support",
    icon: <HiOutlineQuestionMarkCircle />,
  },
];

const Sidebar = ({ activeTab }) => {
  console.log(activeTab);
  return (
    <div className="bg-secondary text-light text-primary-base shadow-md w-[250px] p-2 flex flex-col border h-screen sticky top-0">
      <div className="flex items-center p-4">
        <FcBullish fontSize={24} />
        <span className="font-bold text-sm">LOGO SELLER CENTRAL</span>
      </div>
      <div className="py-8 flex flex-col gap-0.5 overflow-y-auto ">
        {DASHBOARD_SIDEBAR_LINKS.map((link) => (
          <Link
            key={link.label}
            to={link.path}
            className={`flex  items-center gap-2 px-4 py-2 rounded ${
              activeTab === link.path ? "bg-gray-300" : "hover:bg-primary"
            }`}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-0.5 pt-2 border-t  ">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
          <Link
            key={link.label}
            to={link.path}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              activeTab === link.path ? "bg-gray-300" : " hover:bg-primary"
            }`}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
        <div className="cursor-pointer text-red-500 flex items-center gap-2 font-light px-4 py-2 hover:bg-primary rounded">
          <span>
            <HiOutlineLogout />
          </span>
          Logout
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
