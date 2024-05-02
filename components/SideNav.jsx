// SideNav.js
"use client";
import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaUser, FaUsers, FaBars, FaUserPlus } from "react-icons/fa";

const SideNav = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut();
    router.push("/");
  };

  const userGroup = session?.user?.group || "";

  const showCloudAssurance = userGroup.includes("Cloud Assurance");
  const showKPI = userGroup.includes("KPI");
  const showAllocation = userGroup.includes("Allocation");

  return (
    <div className="bg-gray-800 text-white w-50 flex flex-col justify-between fixed top-0 left-0 h-full">
      {/* Logo */}
      <div className="py-4 px-6">
        <img src="/assets/Donyati-Logo.svg" alt="Logo" className="h-8" />
      </div>
      {/* Navigation Links */}
      <nav className="flex flex-col gap-2">
        <Link
          href="/dashboard"
          className="flex items-center px-6 py-3 hover:bg-gray-700"
        >
          <span>Profile</span>
        </Link>
        {session?.user?.role === "admin" && (
          <Link
            href="/userlist"
            className="flex items-center px-6 py-3 hover:bg-gray-700"
          >
            <span>Manage Users</span>
          </Link>
        )}
        {showCloudAssurance && (
          <Link
            href="/menu/cloudassurance"
            className="flex items-center px-6 py-3 hover:bg-gray-700"
          >
            <span>Cloud Assurance</span>
          </Link>
        )}
        {showKPI && (
          <Link
            href="/menu/kpi"
            className="flex items-center px-6 py-3 hover:bg-gray-700"
          >
            <span>KPI</span>
          </Link>
        )}
        {showAllocation && (
          <Link
            href="/menu/allocation"
            className="flex items-center px-6 py-3 hover:bg-gray-700"
          >
            <span>Allocation</span>
          </Link>
        )}
      </nav>
      {/* Logout Button */}
      <button
        className="font-bold text-black-500 bg-red-500 px-6 py-3"
        onClick={handleLogout}
      >
        LOGOUT
      </button>
    </div>
  );
};

export default SideNav;
