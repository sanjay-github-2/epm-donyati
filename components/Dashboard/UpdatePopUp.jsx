"use client";

import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { FaRegWindowClose } from "react-icons/fa";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { TextField, FormGroup, FormControlLabel, Switch } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function UpdateUserDialog({ open, handleClose, userData }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [group, setGroup] = useState([]);
  const [accessType, setaccessType] = useState({
    "Cloud Assurance": false,
    KPI: false,
    Allocation: false,
  });

  useEffect(() => {
    console.log(userData);
    if (userData) {
      setEmail(userData.email);
      setRole(userData.role);
      setGroup(Array.isArray(userData.group) ? userData.group : []);
    }
  }, [userData]);

  const handleRoleChange = (event) => {
    setRole(event.target.checked ? "admin" : "user");
  };

  const handleGroupChange = (event) => {
    const { value } = event.target;
    const updatedValue = Array.isArray(value) ? value : [value];
    setGroup(updatedValue);

    const newaccessType = { ...accessType };
    for (const group of Object.keys(accessType)) {
      newaccessType[group] = false;
    }
    setaccessType(newaccessType);
  };

  const handleToggleAccess = (groupName) => {
    setaccessType({
      ...accessType,
      [groupName]: !accessType[groupName],
    });
  };

  const handleSubmit = async () => {
    try {
      const formattedGroup = Array.isArray(group) ? group.join(", ") : group;
      const response = await fetch("api/updateuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          role,
          group: formattedGroup,
          accessType,
        }),
      });

      if (response.ok) {
        // Form submission successful
        window.location.reload();
        handleClose();
      } else {
        // Handle error if submission failed
        console.error("Failed to update user details");
        // Optionally, display an error message to the user
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error if fetch or server error occurred
      // Optionally, display an error message to the user
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Update User Details
        <FaRegWindowClose
          onClick={handleClose}
          sx={{ cursor: "pointer", position: "absolute", right: 1, top: 8 }}
        />
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          margin="normal"
          fullWidth
          value={email}
          disabled
        />
        <FormGroup className="flex flex-row justify-between ">
          <div className="py-2">
            <p className="w-full ">Role</p>
          </div>
          <div className=" p-2">
            <FormControlLabel
              className=" mt-0"
              control={
                <Switch
                  checked={role === "admin"}
                  onChange={handleRoleChange}
                  inputProps={{ "aria-label": "admin toggle" }}
                />
              }
              labelPlacement="end"
              label={role === "admin" ? "Admin" : "User"}
            />
          </div>
        </FormGroup>

        <FormControl fullWidth>
          <InputLabel id="group-select-label">Group</InputLabel>
          <Select
            labelId="group-select-label"
            id="group-select"
            value={group}
            onChange={handleGroupChange}
            variant="outlined"
            multiple
            label="Group"
          >
            <MenuItem value="Cloud Assurance">Cloud Assurance</MenuItem>
            <MenuItem value="KPI">KPI</MenuItem>
            <MenuItem value="Allocation">Allocation</MenuItem>
          </Select>
        </FormControl>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Group Name</TableCell>
                <TableCell>Access</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {group.map((groupName) => (
                <TableRow key={groupName}>
                  <TableCell>{groupName}</TableCell>
                  <TableCell>
                    <Switch
                      checked={accessType[groupName] || false}
                      onChange={() => handleToggleAccess(groupName)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          className="bg-blue-400"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
