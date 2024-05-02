"use client";

import React, { useState, useEffect } from "react";
import Layout from "../SideNav/Layout";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { FaSearch, FaEdit, FaUserPlus, FaTrash } from "react-icons/fa";
import { IconButton } from "@mui/material";
import UpdateUserDialog from "./UpdatePopUp"; // Import the edit popup component

const UserList = () => {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // State to track selected user for editing
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); // State to track whether edit popup is open
  const [filterCriteria, setFilterCriteria] = useState("All"); // State to track filter criteria
  const router = useRouter();

  useEffect(() => {
    fetchUserDetails(); // Fetch user details when the component mounts
  }, []);
  const fetchUserDetails = async () => {
    const session = await getSession();

    if (!session) {
      router.push("/"); // Redirect to login page if session is not available
    } else {
      try {
        const response = await fetch("/api/userdetails");
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const userDetailsData = await response.json();
        setUserDetails(userDetailsData); // Set user details in state
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
  };

  // Function to handle fetching users based on filter criteria
  // Function to handle fetching users based on filter criteria
  const fetchFilteredUsers = async (criteria) => {
    try {
      const endpoint = "/api/userdetails";
      console.log(criteria);
      const response = await fetch(endpoint, {
        method: "POST", // Use POST method
        headers: {
          "Content-Type": "application/json", // Specify JSON content type
        },
        body: JSON.stringify({ criteria }), // Send filter criteria in the request body
      });

      if (!response.ok) {
        throw new Error("Failed to fetch filtered user details");
      }

      const userDetailsData = await response.json();
      setUserDetails(userDetailsData); // Set user details in state
    } catch (error) {
      console.error("Error fetching filtered user details:", error);
    }
  };

  // Function to handle toggling user's active status
  const toggleUserActiveStatus = async (userId) => {
    try {
      // Find the user by ID
      const user = userDetails.find((user) => user.id === userId);
      // Toggle the active status
      console.log(user);
      const updatedUser = { ...user, is_active: !user.is_active };
      console.log(updatedUser);

      // Update the database via an API endpoint
      const response = await fetch(`/api/updateactive`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      // Update the user details in state
      const updatedUserDetails = userDetails.map((user) =>
        user.id === userId ? updatedUser : user
      );
      setUserDetails(updatedUserDetails);
    } catch (error) {
      console.error("Error toggling user active status:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const filteredUsers = userDetails.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const formatAccessType = (accessType, group) => {
    if (!accessType) return "NA";

    const formattedAccessType = group.split(", ").map((type) => (
      <TableRow key={type}>
        <TableCell>{type}</TableCell>
        <TableCell>{accessType[type] ? "W" : "R"}</TableCell>
      </TableRow>
    ));
    return formattedAccessType;
  };

  // Function to render group rows
  const renderGroupRows = (group) => {
    const groupTypes = group.split(", ");
    return groupTypes.map((type, index) => (
      <TableRow key={index}>
        <TableCell>{type}</TableCell>
      </TableRow>
    ));
  };
  const handleDeleteUser = async (userId) => {
    try {
      console.log(userId);
      const response = await fetch(`/api/deleteuser`, {
        method: "DELETE",
        body: JSON.stringify({ userId }), // Include userId in an object
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Function to get group background color
  const getGroupBackgroundColor = (group) => {
    switch (group.toLowerCase()) {
      case "cloud assurance":
        return "#6BBF59"; // Green
      case "kpi":
        return "#8A2BE2"; // Violet
      case "allocation":
        return "#000000"; // Black
      default:
        return "inherit";
    }
  };

  // Function to format last logged-in date and time in Indian format
  const formatLastLoggedIn = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Kolkata", // Set timezone to Indian Standard Time
    };
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-IN", options);
  };

  // Update the user details in state

  // Function to handle opening the edit popup

  // Function to handle opening the edit popup
  const handleOpenEditPopup = (userId) => {
    const user = userDetails.find((user) => user.id === userId);
    setSelectedUser(user);
    setIsEditPopupOpen(true);
  };

  // Function to handle closing the edit popup
  const handleCloseEditPopup = () => {
    setIsEditPopupOpen(false);
  };

  // Function to handle changing the filter criteria
  const handleFilterChange = (criteria) => {
    // setFilterCriteria(criteria);
    if (criteria === "All") {
      fetchUserDetails();
    } else {
      fetchFilteredUsers(criteria);
    }
  };

  return (
    <Layout>
      <div className="flex-1 p-2">
        <h1 className="text-3xl font-bold mb-8">Users List</h1>
        <div className="flex justify-center items-center mb-4">
          <span className="inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm">
            <button
              className={`inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative ${
                filterCriteria === "All" ? "bg-gray-200" : ""
              }`}
              onClick={() => handleFilterChange("All")}
            >
              All
            </button>

            <button
              className={`inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative ${
                filterCriteria === "Active" ? "bg-gray-200" : ""
              }`}
              onClick={() => handleFilterChange("Active")}
            >
              Active Users
            </button>

            <button
              className={`inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative ${
                filterCriteria === "Registered" ? "bg-gray-200" : ""
              }`}
              onClick={() => handleFilterChange("Registered")}
            >
              Registered Users
            </button>
          </span>
        </div>

        <div className="search-container flex justify-end">
          <FaSearch className="mr-4 mt-2" />
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearch}
            className=" border border-blue-50 justify-end p-1 w-50"
          />
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Group</TableCell>
              <TableCell>Access Type</TableCell>
              <TableCell>Last Logged In</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Table>
                    <TableBody>{renderGroupRows(user.group)}</TableBody>
                  </Table>
                </TableCell>
                <TableCell>
                  <Table>
                    <TableBody>
                      {formatAccessType(user.access_type, user.group)}
                    </TableBody>
                  </Table>
                </TableCell>
                <TableCell>{formatLastLoggedIn(user.last_logged_in)}</TableCell>
                <TableCell>{user.is_active ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => toggleUserActiveStatus(user.id)}>
                    <FaUserPlus /> {/* User add icon */}
                  </IconButton>
                  <IconButton onClick={() => handleOpenEditPopup(user.id)}>
                    <FaEdit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteUser(user.id)}>
                    <FaTrash />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Render the edit popup component */}
        <UpdateUserDialog
          open={isEditPopupOpen}
          handleClose={handleCloseEditPopup}
          userData={selectedUser}
        />
      </div>
    </Layout>
  );
};

export default UserList;
