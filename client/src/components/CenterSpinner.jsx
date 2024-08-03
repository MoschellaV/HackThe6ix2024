import { Box, CircularProgress } from "@mui/material";
import React from "react";

export default function CenterSpinner() {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <CircularProgress color="primary" />
        </Box>
    );
}
