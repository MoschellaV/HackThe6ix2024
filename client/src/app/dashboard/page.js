"use client";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { postData } from "@/services/api";
import { useUserContext } from "@/context/UserContext";

export default function Dashboard() {
  const { user } = useUserContext();
  const [value, setValue] = useState("");

  console.log(user);

  const handleClick = () => {
    postData(value);
  };

  return (
    <div>
      <TextField
        id="filled-basic"
        label="Filled"
        variant="filled"
        multiline
        rows={4}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <Button onClick={handleClick} variant="contained" color="primary">
        Log Value
      </Button>
    </div>
  );
}
