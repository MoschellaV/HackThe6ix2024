"use client";
import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import { AuroraBackground } from "@/components/aurora-background";

import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import ShowCompletionProgress from "@/components/ShowCompletionProgress";
import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import { voices } from "@/lib/voices";
import HeroCard from "@/components/HeroCards";
import HeroCardsSmall from "@/components/HeroCardsSmall";
import SubmissionForm from "@/components/SubmissionForm";

export default function Home() {
  const [submissionId, setSubmissionId] = useState();
  const [activeDoc, setActiveDoc] = useState(null);
  const [isProgressActive, setIsProgressActive] = useState(false);
  const lgBreakpoint = useMediaQuery("(min-width:1260px)");

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

  return (
    <>
      <AuroraBackground className={"h-fit"}>
        <div className="flex flex-col w-full items-center justify-center w-full overflow-hidden">
          <div
            id="Header"
            className="overflow-hidden p-5 rounded-md w-full  flex items-center justify-center flex-col gap-20">
            <div className="w-full flex flex-col items-center justify-center gap-2">
              <label
                className="text-8xl font-sans font-semibold mt-10 text-center"
                style={{ color: "rgb(43, 77, 189, 1)" }}>
                Call Me Maybe
              </label>
              <label className="text-lg font-san font-medium my-3 text-center">
                {"Hey I just met you, and this is crazy, but here's my number, so call me maybe!"}
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
            {lgBreakpoint ? (
              <div className="flex flex-row w-full justify-between p-4">
                {Object.keys(voices).map((key, index) => {
                  return (
                    <Box key={index}>
                      <HeroCard index={index} item={voices[key]} />
                    </Box>
                  );
                })}
              </div>
            ) : (
              <HeroCardsSmall voices={voices} />
            )}
          </div>

          <SubmissionForm
            formRef={formRef}
            setIsProgressActive={setIsProgressActive}
            setSubmissionId={setSubmissionId}
            setActiveDoc={setActiveDoc}
          />
        </div>
      </AuroraBackground>

      <div ref={progressRef} id="call-progress" className={`${isProgressActive ? "w-full h-screen" : ""}`}>
        {submissionId && (activeDoc ? <ShowCompletionProgress docData={activeDoc} /> : <CircularProgress />)}
      </div>
    </>
  );
}
