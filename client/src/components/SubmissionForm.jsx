import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { postData, saveCallData } from "@/services/api";
import { Alert, Box, IconButton, Slider, Snackbar, Tooltip, Typography, useMediaQuery } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { track } from "@vercel/analytics";

export default function SubmissionForm({
  formRef,
  setIsProgressActive,
  setSubmissionId,
  setActiveDoc,
  showError,
  setShowError
}) {
  const [loading, setLoading] = useState(false);
  const [openAdvanced, setOpenAdvanced] = useState(false);

  const schema = z.object({
    prompt: z.string().min(1, { message: "Required" }),
    purpose: z.string().min(1, { message: "Required" }),
    phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
    lengthOfCall: z.enum(["short", "medium", "long"], { errorMap: () => ({ message: "Required" }) }),
    tone: z.enum(["Flirty", "Funny", "Mean", "Normal"], { errorMap: () => ({ message: "Required" }) }),
    voice: z.enum(["pqHfZKP75CvOlQylNhV4", "jsCqWAovK2LkecY7zXl4", "bIHbv24MWmeRgasZH58o", "ThT5KcBeYPX3keUQqHPh"], {
      errorMap: () => ({ message: "Required" })
    }),
    stability: z.number().min(0).max(1).default(0.5),
    similarity: z.number().min(0).max(1).default(0.75)
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      prompt: "",
      purpose: "",
      phoneNumber: "",
      lengthOfCall: "",
      tone: "",
      voice: "",
      stability: 0.5,
      similarity: 0.75
    }
  });

  const { handleSubmit, control, reset } = form;

  const onSubmit = async data => {
    setLoading(true);
    setActiveDoc(null);
    setSubmissionId(null);
    setShowError(false);

    setIsProgressActive(true);

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

      try {
        await postData(id, prompt, tone, phoneNumber, purpose, voice, lengthOfCall, stability, similarity);
      } catch (error) {
        setShowError(true);
        setLoading(false);
        track("call-creation-failed", { id: id, createdAt: createdAt, purpose: purpose });
        return;
      }
      setLoading(false);

      track("call-creation-success", { id: id, createdAt: createdAt, purpose: purpose });
      reset(form);
    } else {
      setLoading(false);
      console.log("Error saving data");
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShowError(false);
  };

  return (
    <>
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
          {"Uh oh an error occurred while placing your call! "}
          <br />
          <br />
          {`Note: We're using some trial accounts to keep this app running lol. This error is likely related to the fact that the amount of "trial tokens" we have for the month has run out.`}
        </Alert>
      </Snackbar>

      <form
        ref={formRef}
        id="Form"
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-md w-full h-screen flex items-center justify-center align-center h-full sm:w-full">
        <div className="flex flex-col sm:w-full md:w-1/2 items-center justify-center">
          <div className="flex flex-col bg-transparent p-8 rounded-lg items-center gap-6 shadow-lg w-full ">
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
                  label="Call details (ex. Tell dad to pick up the milk)"
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
                  label="Recipient phone number"
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
                        <MenuItem value="short">Short</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="long">Long</MenuItem>
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
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography sx={{ fontSize: 14, opacity: 0.6, mb: 0 }} id="stability-slider" gutterBottom>
                          Stability
                        </Typography>
                        <Tooltip
                          title="Adjusts the voice consistency. Lower values produce a more emotive and varied performance while higher values lead to a more stable and consistent voice."
                          placement="top"
                          arrow>
                          <IconButton size="small">
                            <HelpOutlineOutlinedIcon sx={{ fontSize: 18, opacity: 0.7 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
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
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography sx={{ fontSize: 14, opacity: 0.6, mb: 0 }} id="similarity-slider" gutterBottom>
                          Similarity
                        </Typography>
                        <Tooltip
                          title="Controls how closely the AI replicates the original voice. Higher values ensure the generated voice closely matches the original, which might include artifacts or background noise if present in the source. Lower values allow for more flexibility and creativity in the voice generation."
                          placement="top"
                          arrow>
                          <IconButton size="small">
                            <HelpOutlineOutlinedIcon sx={{ fontSize: 18, opacity: 0.7 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
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
        </div>
      </form>
    </>
  );
}
