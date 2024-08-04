"use client";
import React, { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuroraBackground } from "@/components/aurora-background";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { postData, saveCallData } from "@/services/api";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import ShowCompletionProgress from "@/components/ShowCompletionProgress";
import { Box, CircularProgress, Grid, Slider, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Image from "next/image";

import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

import { voices } from "@/lib/voices";

function useFloatingEffect() {
  const [style, setStyle] = useState({});
  useEffect(() => {
    let mounted = true;
    const amplitude = Math.random() * 10 + 5;
    const speed = Math.random() * 2000 + 1000;
    const angle = Math.random() * 2 * Math.PI;

    const updatePosition = () => {
      if (!mounted) return;
      const y = Math.sin(Date.now() / speed + angle) * amplitude;
      setStyle({
        transform: `translateY(${y}px)`
      });
    };

    const intervalId = setInterval(updatePosition, 40);
    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return style;
}

export default function Home() {
  const [submissionId, setSubmissionId] = useState();
  const [activeDoc, setActiveDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openAdvanced, setOpenAdvanced] = useState(false);

  const actors = [{ name: "Billy" }, { name: "Mike" }, { name: "Freya" }, { name: "Dorthy" }];
  const formRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    if (submissionId) {
      const unsub = onSnapshot(
        doc(db, "calls", submissionId),
        doc => {
          if (doc.exists()) {
            console.log("Document data:", doc.data());
            setActiveDoc(doc.data());
          } else {
            console.log("No such document!");
          }
        },
        error => {
          console.log("Error getting document:", error);
        }
      );

      return () => unsub();
    }
  }, [submissionId]);

  const schema = z.object({
    prompt: z.string().min(1, { message: "Required" }),
    purpose: z.string().min(1, { message: "Required" }),
    phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
    lengthOfCall: z.enum(["small", "medium", "large"], { errorMap: () => ({ message: "Required" }) }),
    tone: z.enum(["Flirty", "Funny", "Mean", "Normal"], { errorMap: () => ({ message: "Required" }) }),
    voice: z.enum(["pqHfZKP75CvOlQylNhV4", "jsCqWAovK2LkecY7zXl4", "bIHbv24MWmeRgasZH58o", "ThT5KcBeYPX3keUQqHPh"], {
      errorMap: () => ({ message: "Required" })
    }),
    stability: z.number().min(0).max(1).default(0.5),
    similarity: z.number().min(0).max(1).default(0.75)
  });

  const { handleSubmit, control } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async data => {
    setLoading(true);
    setActiveDoc(null);
    setSubmissionId(null);
    const savedData = await saveCallData(
      data.prompt,
      data.tone,
      data.phoneNumber,
      data.purpose,
      data.voice,
      data.lengthOfCall,
      data.stability,
      data.similarity
    );

    if (savedData.status === 201) {
      const {
        id,
        prompt,
        tone,
        phoneNumber,
        purpose,
        voice,
        lengthOfCall,
        createdAt,
        completionStatus,
        recordingURL,
        stability,
        similarity
      } = savedData.data.document;

      setSubmissionId(id);

      postData(id, prompt, tone, phoneNumber, purpose, voice, lengthOfCall, stability, similarity);
      setLoading(false);

      let element = document.getElementById("call-progress");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
      }
    } else {
      setLoading(false);
      console.log("Error saving data");
    }
  };

  return (
    <>
      <AuroraBackground className={"h-fit"}>
        <div className="flex flex-col w-full items-center justify-center w-full overflow-hidden">
          <div
            id="Header"
            className="overflow-hidden p-5 rounded-md w-full h-screen flex items-center justify-center flex-col gap-20">
            <div className="w-full flex flex-col items-center justify-center gap-2">
              <label
                className="text-8xl font-sans font-semibold mt-10 text-center"
                style={{ color: "rgb(43, 77, 189, 1)" }}>
                Call Me Maybe
              </label>{" "}
              <label className="text-lg font-san font-medium my-3 text-center">
                Hey I just met you, and this is crazy, but here's my number, so call me maybe.
              </label>
              <Button
                variant="contained"
                sx={{
                  width: 1 / 3,
                  borderRadius: "8px",
                  mt: 2,
                  fontWeight: 600
                }}
                onClick={() => formRef.current.scrollIntoView({ behavior: "smooth" })}>
                Try us out!
              </Button>
            </div>
            <div className="flex flex-row w-full justify-between p-4">
              {Object.keys(voices).map((key, index) => {
                const item = voices[key];
                const floatingStyle = useFloatingEffect();

                return (
                  <div
                    key={index}
                    style={{
                      marginTop: index === 0 || index === actors.length - 1 ? "-100px" : "0px",
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
                        <Image src={item.img} fill alt="Picture of the author" style={{ objectFit: "contain" }} />
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
                          key={key}
                          onClick={() => {
                            const audio = new Audio(voices[key].voice);
                            audio.play();
                          }}>
                          <div className="flex flex-row items-center">
                            <PlayCircleOutlineIcon sx={{ mr: 1 }} />
                            Play {voices[key].name}'s voice
                          </div>
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                );
              })}
            </div>
          </div>

          <form
            ref={formRef}
            id="Form"
            onSubmit={handleSubmit(onSubmit)}
            className="p-5 rounded-md w-full h-screen flex items-center justify-center align-center h-full w-full">
            <div className="flex flex-col w-1/2 h-screen flex items-center justify-center">
              <div className="flex flex-col bg-transparent p-8 rounded-lg flex flex-col items-center gap-4 shadow-lg w-full ">
                <label className="text-2xl font-semibold">Try it out and make a call 🚀</label>

                <Controller
                  control={control}
                  name="purpose"
                  render={({ field, fieldState }) => (
                    <TextField
                      label="Call subject (ex. Reminder for dad)"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="prompt"
                  render={({ field, fieldState }) => (
                    <TextField
                      label="Call message (ex. Don't forget to pick up the milk)"
                      variant="outlined"
                      fullWidth
                      size="small"
                      multiline
                      rows={4}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field, fieldState }) => (
                    <TextField
                      label="Recipient Phone Number"
                      type="tel"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />

                <div className="flex flex-row w-full gap-2">
                  <Controller
                    control={control}
                    name="lengthOfCall"
                    render={({ field, fieldState }) => (
                      <div className="flex flex-col w-full">
                        <FormControl variant="outlined" size="small" fullWidth>
                          <InputLabel>Call length</InputLabel>
                          <Select {...field} label="Call length" error={!!fieldState.error}>
                            <MenuItem value="small">Short</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="large">Large</MenuItem>
                          </Select>
                          {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
                        </FormControl>
                      </div>
                    )}
                  />

                  <Controller
                    control={control}
                    name="tone"
                    render={({ field, fieldState }) => (
                      <div className="flex flex-col w-full">
                        <FormControl variant="outlined" size="small" fullWidth>
                          <InputLabel>Tone</InputLabel>
                          <Select {...field} label="Tone" error={!!fieldState.error}>
                            <MenuItem value="Flirty">Flirty 🥰</MenuItem>
                            <MenuItem value="Funny">Funny 😂</MenuItem>
                            <MenuItem value="Mean">Mean 😡</MenuItem>
                            <MenuItem value="Normal">Normal 😐</MenuItem>
                          </Select>
                          {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
                        </FormControl>
                      </div>
                    )}
                  />

                  <Controller
                    control={control}
                    name="voice"
                    render={({ field, fieldState }) => (
                      <div className="flex flex-col w-full">
                        <FormControl variant="outlined" size="small" fullWidth>
                          <InputLabel>Voice</InputLabel>
                          <Select {...field} label="Voice" error={!!fieldState.error}>
                            <MenuItem value="pqHfZKP75CvOlQylNhV4">Bill</MenuItem>
                            <MenuItem value="jsCqWAovK2LkecY7zXl4">Freya</MenuItem>
                            <MenuItem value="bIHbv24MWmeRgasZH58o">Will</MenuItem>
                            <MenuItem value="ThT5KcBeYPX3keUQqHPh">Dorothy</MenuItem>
                          </Select>
                          {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
                        </FormControl>
                      </div>
                    )}
                  />
                </div>

                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                    onClick={() => setOpenAdvanced(!openAdvanced)}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 12, opacity: 0.4, mr: 0.5 }}>
                      Advanced settings
                    </Typography>
                    {openAdvanced ? <ExpandLessIcon sx={{ opacity: 0.3 }} /> : <ExpandMoreIcon sx={{ opacity: 0.3 }} />}
                  </Box>
                </Box>

                {openAdvanced && (
                  <>
                    <Controller
                      control={control}
                      name="stability"
                      defaultValue={0.5}
                      render={({ field, fieldState }) => (
                        <div className="flex flex-col w-full">
                          <Typography sx={{ fontSize: 14, opacity: 0.6 }} id="stability-slider" gutterBottom>
                            Stability
                          </Typography>
                          <Slider
                            {...field}
                            aria-labelledby="stability-slider"
                            valueLabelDisplay="auto"
                            step={0.01}
                            min={0}
                            max={1}
                            error={!!fieldState.error}
                          />
                          {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
                        </div>
                      )}
                    />
                    <Controller
                      control={control}
                      name="similarity"
                      defaultValue={0.75}
                      render={({ field, fieldState }) => (
                        <div className="flex flex-col w-full">
                          <Typography sx={{ fontSize: 14, opacity: 0.6 }} id="similarity-slider" gutterBottom>
                            Similarity
                          </Typography>
                          <Slider
                            {...field}
                            aria-labelledby="similarity-slider"
                            valueLabelDisplay="auto"
                            step={0.01}
                            min={0}
                            max={1}
                            error={!!fieldState.error}
                          />
                          {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
                        </div>
                      )}
                    />
                  </>
                )}

                <Button sx={{ borderRadius: "8px" }} fullWidth variant="contained" type="submit" disabled={loading}>
                  Make call
                </Button>
              </div>
              <div className="mt-32"></div>
            </div>
          </form>
        </div>
      </AuroraBackground>

      <div ref={progressRef} id="call-progress">
        {submissionId &&
          (activeDoc ? (
            <div ref={progressRef} className="w-full h-screen">
              <ShowCompletionProgress docData={activeDoc} />
            </div>
          ) : (
            <CircularProgress />
          ))}
      </div>
    </>
  );
}
