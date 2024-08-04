import useFloatingEffect from "@/hooks/useFloatingEffect";
import { Button, Grid, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

export default function HeroCard({ index, item }) {
  const floatingStyle = useFloatingEffect();

  return (
    <div
      style={{
        marginTop: index === 0 || index === 3 ? "-100px" : "0px",
        ...floatingStyle
      }}>
      <Grid
        container
        rowSpacing={1}
        sx={{
          width: "300px",
          height: "250px",
          backgroundColor: "rgba(246, 246, 246, 0.4)",
          borderRadius: "8px",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.10)",
          p: 2
        }}>
        <Grid item xs={6} md={6} sx={{ position: "relative", height: "70%" }}>
          <Image src={item.img} fill alt="Picture of the author" style={{ objectFit: "contain" }} draggable={false} />
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
            sx={{ border: "1px solid rgb(57, 100, 239)" }}
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
    </div>
  );
}
