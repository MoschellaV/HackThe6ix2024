"use client";
import React, { useState, useEffect } from "react";
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
import { Box, CircularProgress, Slider, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function Dashboard() {
  const [submissionId, setSubmissionId] = useState();
  const [activeDoc, setActiveDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openAdvanced, setOpenAdvanced] = useState(false);

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

      // Cleanup function to unsubscribe from the listener when the component unmounts
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
      document.getElementById("call-progress").scrollIntoView({ behavior: "smooth" });

      // reset(); // comment out for now
    } else {
      setLoading(false);
      console.log("Error saving data");
    }
  };

  return (
    <>
      <AuroraBackground className={"h-fit"}>
        <div className="flex flex-col w-full items-center justify-center w-full overflow-hidden">
          <div className="overflow-hidden p-5 rounded-md w-full h-screen flex items-center justify-center flex flex-col gap-4">
            <label className="text-8xl font-sans font-semibold">Call Me Maybe</label>
            <label className="text-2xl font-san font-medium "> Speak Less, Achieve More</label>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-5 rounded-md w-full h-screen flex items-center justify-center w-full">
            <div className="w-1/2 h-screen flex items-center justify-center">
              <div className="bg-transparent p-8 rounded-lg flex flex-col items-center gap-10 shadow-lg w-full ">
                <label className="text-2xl font-semibold">Make your first call 🚀</label>

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
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </div>
      </AuroraBackground>
      <div id="call-progress">
        {submissionId && (activeDoc ? <ShowCompletionProgress docData={activeDoc} /> : <CircularProgress />)}
      </div>
    </>
  );
}
