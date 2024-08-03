"use client";
import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuroraBackground } from "@/components/aurora-background";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function Dashboard() {
  const schema = z.object({
    prompt: z.string().min(1, { message: "Required" }),
    purpose: z.string().min(1, { message: "Required" }),
    phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
    tone: z.enum(["Flirty", "Funny", "Mean", "Normal"], { errorMap: () => ({ message: "Required" }) })
  });

  const { handleSubmit, control } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = data => {
    console.log(data);
  };

  // const firstContentRef = useRef(null);
  // const secondContentRef = useRef(null);

  // const scrollToFirstContent = () => {
  //   firstContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  // };

  // const scrollToSecondContent = () => {
  //   secondContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  // };

  return (
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
              <label className="text-2xl font-semibold">What can we do for you today?</label>

              <Controller
                control={control}
                name="prompt"
                render={({ field, fieldState }) => (
                  <TextField
                    label="What would you like to do?"
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
                name="purpose"
                render={({ field, fieldState }) => (
                  <TextField
                    label="What is the purpose for your call?"
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
                name="phoneNumber"
                render={({ field, fieldState }) => (
                  <TextField
                    label="Phone Number"
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

              <Controller
                control={control}
                name="tone"
                render={({ field, fieldState }) => (
                  <div className="flex flex-col w-full">
                    <FormControl variant="outlined" size="small" fullWidth>
                      <InputLabel>AI Tone</InputLabel>
                      <Select {...field} label="AI Tone" error={!!fieldState.error}>
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

              <Button type="submit">Submit</Button>
            </div>
          </div>
        </form>
      </div>
    </AuroraBackground>
  );
}
