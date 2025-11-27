"use client"
import React, { useEffect, useState, use } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Webcam from 'react-webcam';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import Link from 'next/link';

function Interview({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interveiwId));

    setInterviewData(result[0]);
  };

  return (
    <div className="my-6 sm:my-10 px-4 sm:px-6 md:px-10 max-w-5xl mx-auto">

      <h2 className="font-bold text-xl sm:text-2xl">Let's Get Started</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mt-6">

        {/* LEFT SIDE */}
        <div className="flex flex-col gap-5">

          <div className="flex flex-col p-4 sm:p-5 rounded-lg border gap-4">
            <h2 className="text-base sm:text-lg">
              <strong>Job Role/Job Position:</strong> {interviewData?.jobPosition}
            </h2>

            <h2 className="text-base sm:text-lg">
              <strong>Job Description/Tech Stack:</strong> {interviewData?.jobDesc}
            </h2>

            <h2 className="text-base sm:text-lg">
              <strong>Years of Experience:</strong> {interviewData?.jobExperience}
            </h2>

            <h2 className="text-base sm:text-lg">
              <strong>Interview Round:</strong> {interviewData?.interviewRound}
            </h2>
          </div>

          <div className="p-4 sm:p-5 border rounded-lg border-yellow-300 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-600 text-sm sm:text-base">
              <Lightbulb />
              <strong>Information</strong>
            </h2>

            <h2 className="mt-3 text-yellow-600 text-xs sm:text-sm leading-relaxed">
              Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview.
              It has 5 questions you can answer, and at the end you will get a report based on your answers.
              We never record your video; you can disable webcam access anytime.
            </h2>
          </div>
        </div>

        {/* RIGHT SIDE – WEBCAM */}
        <div className="flex flex-col items-center justify-start">

          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              className="rounded-lg border"
              style={{
                width: "100%",
                maxWidth: "350px",
                height: "auto"
              }}
            />
          ) : (
            <>
              <div className="w-full max-w-xs sm:max-w-sm mx-auto">
                <WebcamIcon className="h-60 sm:h-72 w-full p-10 sm:p-20 bg-secondary rounded-lg border mt-4" />
              </div>

              <Button
                variant="ghost"
                className="w-full mt-4"
                onClick={() => setWebCamEnabled(true)}
              >
                Enable Web Cam and Microphone
              </Button>
            </>
          )}
        </div>

      </div>

      <div className="flex justify-end mt-8">
        <Link href={`/dashboard/interveiw/${params.interveiwId}/start`}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;
