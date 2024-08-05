import { Button, Grid, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

export default function HeroCardsSmall({ voices }) {
  return (
    <Grid container spacing={5}>
      {Object.keys(voices).map((key, index) => {
        const item = voices[key];
        return (
          <Grid xs={12} sm={6} item key={index} container rowSpacing={1}>
            <Grid item xs={6} md={6} sx={{ position: "relative", height: "70%" }}>
              <Image
                src={item.img}
                fill
                alt="Picture of the author"
                style={{ objectFit: "contain" }}
                draggable={false}
              />
            </Grid>

            <Grid
              item
              xs={6}
              md={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}>
              <Typography variant="body1" sx={{ textAlign: "center", mb: 1, fontWeight: 600 }}>
                {item.name}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: "center", fontSize: 14 }}>
                {item.description}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                sx={{ border: "1px solid rgb(57, 100, 239)", p: 0.5 }}
                onClick={() => {
                  const audio = new Audio(item.voice);
                  audio.play();
                }}>
                <div className="flex flex-row items-center">
                  <PlayCircleOutlineIcon sx={{ mr: 1 }} />
                  {`Play ${item.name}'s voice`}
                </div>
              </Button>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
}
