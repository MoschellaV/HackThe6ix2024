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
  const [tone, setTone] = useState('');
  
  const handleClick = () => {
    postData(value, tone);
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
      <FormControl>
        <InputLabel id="demo-simple-select-label">tone</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={tone}
          label="tone"
          onChange={(event) => setTone(event.target.value)}
        >
          <MenuItem value={10}>Flirty</MenuItem>
          <MenuItem value={20}>Funny</MenuItem>
          <MenuItem value={30}>Normal</MenuItem>
          <MenuItem value={30}>Mean</MenuItem>

        </Select>
      </FormControl>
      <Button onClick={handleClick} variant="contained" color="primary">
        Log Value
      </Button>
    </div>
  );
}
