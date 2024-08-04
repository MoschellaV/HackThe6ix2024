import { voices } from "@/lib/voices";
import { Box, Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function ShowCompletionProgress({ docData }) {
  const currentVoice = voices[docData.voice];
  const [statusList, setStatusList] = useState([]);
  const [lastStatus, setLastStatus] = useState(null);
  const [lastCompletionStatus, setLastCompletionStatus] = useState(null);

  useEffect(() => {
    if (docData.completionStatus && docData.completionStatus !== lastCompletionStatus) {
      if (docData.completionStatus === "Making call") {
        setStatusList(prevList => [
          ...prevList,
          { text: docData.completionStatus, type: "title" },
          { text: "Ring, ring, ring ring...", type: "change" }
        ]);
        setLastCompletionStatus(docData.completionStatus);
      }

      if (docData.completionStatus === "Creating speech") {
        setStatusList(prevList => [
          ...prevList,
          { text: docData.completionStatus, type: "title" },
          { text: "Converting text to voice audio, woop!", type: "change" }
        ]);
        setLastCompletionStatus(docData.completionStatus);
      }

      if (docData.completionStatus === "Generating custom message" && !docData.textContent) {
        setStatusList(prevList => [...prevList, { text: docData.completionStatus, type: "title" }]);
        setLastCompletionStatus(docData.completionStatus);
      }

      if (docData.completionStatus === "pending") {
        setStatusList(prevList => [
          ...prevList,
          { text: "Processing", type: "title" },
          { text: "1 second while we handle all the heavy lifting 💪", type: "change" }
        ]);
        setLastCompletionStatus("pending");
      }
    }

    if (docData.textContent !== null && docData.textContent !== lastStatus) {
      setStatusList(prevList => [...prevList, { text: docData.textContent, type: "change" }]);
      setLastStatus(docData.textContent);
    }
  }, [docData.completionStatus, docData.textContent]);

  return (
    <Box sx={{ height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="w-3/4 h-3/4">
        <Grid container spacing={2} sx={{ height: "100%" }}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Box sx={{ p: { sm: 2, md: 5, lg: 7 }, display: "flex", alignItems: "center", flexDirection: "column" }}>
              <Image src={currentVoice.img} alt="Voice" width={200} height={200} draggable={false} />
              <Typography variant="h3" sx={{ textAlign: "center", my: 2 }}>
                {currentVoice.name}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: "center", fontSize: 16 }}>
                {currentVoice.description}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <div
              className="h-full bg-transparent p-8 rounded-lg flex flex-col shadow-lg"
              style={{ overflow: "auto", maxHeight: "70vh" }}>
              <Box sx={{ p: 3 }}>
                <Stack spacing={1}>
                  {statusList.map((status, index) => (
                    <div key={index}>
                      {status.type === "title" && (
                        <Typography variant="body1" sx={{ fontSize: 16 }}>
                          {status.text}
                        </Typography>
                      )}
                      {status.type === "change" && (
                        <Typography variant="body1" sx={{ fontWeight: 500, opacity: 0.6 }}>
                          {status.text}
                        </Typography>
                      )}
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
