import { voices } from "@/lib/voices";
import { Box, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function ShowCompletionProgress({ docData }) {
  const currentVoice = voices[docData.voice];
  //   console.log(docData);
  const [statusList, setStatusList] = useState([]);
  const [hasShownTextContent, setHasShownTextContent] = useState(false);
  //   console.log(docData);

  useEffect(() => {
    if (docData.completionStatus) {
      if (docData.completionStatus === "Generating custom message") {
        setHasShownTextContent(false);
        setStatusList(prevList => [...prevList, { title: docData.completionStatus, change: "" }]);
      } else if (docData.textContent && !hasShownTextContent) {
        setHasShownTextContent(true);
        setStatusList(prevList => [...prevList, { title: "", change: docData.textContent }]);
      } else if (docData.completionStatus === "Creating speech") {
        setStatusList(prevList => [
          ...prevList,
          { title: docData.completionStatus, change: "Converting text to voice audio, woop!" }
        ]);
      } else if (docData.completionStatus === "Making call") {
        setStatusList(prevList => [
          ...prevList,
          { title: docData.completionStatus, change: "Ring, ring, ring ring..." }
        ]);
      }
    }
  }, [docData.completionStatus]);

  return (
    <Box sx={{ height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="w-3/4 h-3/4">
        <Grid container spacing={2} sx={{ height: "100%" }}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Box sx={{ p: { sm: 2, md: 5, lg: 7 } }}>
              <Typography variant="h3" sx={{ textAlign: "center", mb: 2 }}>
                {currentVoice.name}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: "center" }}>
                {currentVoice.description}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="h-full bg-transparent p-8 rounded-lg flex flex-col shadow-lg overflow-auto">
              <Box sx={{ p: 3 }}>
                <Stack spacing={1}>
                  {statusList.map((status, index) => (
                    <div key={index}>
                      <Typography variant="body1" sx={{ fontSize: 16, mb: 0.5 }}>
                        {status.title}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5, opacity: 0.4 }}>
                        {status.change}
                      </Typography>
                    </div>
                  ))}
                </Stack>
              </Box>
            </div>
          </Grid>
        </Grid>
      </div>
    </Box>
  );
}
