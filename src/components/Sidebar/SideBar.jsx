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
    label: "Dashboard",
    path: "/",
    icon: <HiOutlineViewGrid />,
  },
  {
    label: "Products",
    path: "/products",
    icon: <HiOutlineCube />,
  },
  {
    label: "Orders",
    path: "/orders",
    icon: <HiOutlineShoppingCart />,
  },
  {
    label: "Customers",
    path: "/customers",
    icon: <HiOutlineUsers />,
  },
  {
    label: "Transactions",
    path: "/transactions",
    icon: <HiOutlineDocumentText />,
  },
  {
    label: "Messages",
    path: "/messages",
    icon: <HiOutlineAnnotation />,
  },
];

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  {
    label: "Settings",
    path: "/settings",
    icon: <HiOutlineCog />,
  },
  {
    label: "Help & Support",
    path: "/support",
    icon: <HiOutlineQuestionMarkCircle />,
  },
];

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <div className="bg-secondary text-light text-primary-base shadow-md w-72 p-2 flex flex-col border h-screen sticky top-0">
      <div className="flex items-center p-4">
        <FcBullish fontSize={24} />
        <span className="font-bold">LOGO</span>
      </div>
      <div className="py-8 flex flex-col gap-0.5 overflow-y-auto ">
        {DASHBOARD_SIDEBAR_LINKS.map((link) => (
          <Link
            key={link.label}
            to={link.path}
            className={`flex  items-center gap-2 px-4 py-2 rounded ${
              pathname === link.path ? "bg-primary" : "hover:bg-primary"
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
              pathname === link.path ? "bg-primary" : " hover:bg-primary"
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
