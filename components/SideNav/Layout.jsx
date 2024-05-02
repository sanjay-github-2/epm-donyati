// Layout.jsx
import React from "react";
// import SideNav from "./SideNav";
import SideNav from "../SideNav";
const Layout = ({ children }) => {
  return (
    <div className="flex h-screen  ">
      {/* Left Side Navigation */}

      <SideNav />

      {/* Right Side Content */}
      <div className="p-8 ml-40">{children}</div>
    </div>
  );
};

export default Layout;
