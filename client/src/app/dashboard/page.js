"use client";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { postData } from "@/services/api";
import { useUserContext } from "@/context/UserContext";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

export default function Dashboard() {
  const { user } = useUserContext();
  const [value, setValue] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [tone, setTone] = useState("");

  const [purpose, setPurpose] = useState("");

  const handleClick = () => {
    postData({ value, tone, phoneNumber, purpose });
  };

  return (
    <div className="flex flex-col gap-2 p-10">
      <TextField
        id="filled-basic"
        label="Filled"
        variant="filled"
        multiline
        rows={4}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <TextField
        id="phone-number"
        label="Phone Number"
        variant="filled"
        value={phoneNumber}
        onChange={e => setPhoneNumber(e.target.value)}
      />
      <TextField
        id="purpose"
        label="Purpose"
        variant="filled"
        value={purpose}
        onChange={e => setPurpose(e.target.value)}
      />
      <FormControl>
        <InputLabel id="demo-simple-select-label">Value</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={tone}
          label="Value"
          onChange={(event) => setTone(event.target.value)}
        >
          <MenuItem value="Flirty">Flirty</MenuItem>
          <MenuItem value="Funny">Funny</MenuItem>
          <MenuItem value="Normal">Normal</MenuItem>
          <MenuItem value="Mean">Mean</MenuItem>
        </Select>
      </FormControl>
      <Button onClick={handleClick} variant="contained" color="primary">
        Log Value
      </Button>
    </div>
  );
}
