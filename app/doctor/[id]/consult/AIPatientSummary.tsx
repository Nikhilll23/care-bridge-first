"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
}

interface Appointment {
  date: string;
  reason: string;
  diagnosis: string;
  prescription: string;
  notes: string;
}

interface Vitals {
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  oxygenSaturation: string;
}

interface AIPatientSummaryProps {
  appointments: Appointment[];
  vitals: Vitals;
  patientInfo: PatientInfo;
}

export function AIPatientSummary({
  appointments,
  vitals,
  patientInfo,
}: AIPatientSummaryProps) {
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function generateSummary() {
      try {
        const prompt = `
          Please analyze the following patient information and provide a comprehensive medical summary in 1 para with not more then 300 letters.:

          Patient Details:
          - Name: ${patientInfo.name}
          - Age: ${patientInfo.age}
          - Gender: ${patientInfo.gender}
          - Last Visit: ${patientInfo.lastVisit}

          Current Vitals:
          - Blood Pressure: ${vitals.bloodPressure}
          - Heart Rate: ${vitals.heartRate}
          - Temperature: ${vitals.temperature}
          - O2 Saturation: ${vitals.oxygenSaturation}

          Appointment History:
          ${appointments
            .map(
              (apt) => `
            Date: ${apt.date}
            Reason: ${apt.reason}
            Diagnosis: ${apt.diagnosis}
            Prescription: ${apt.prescription}
            Notes: ${apt.notes}
          `,
            )
            .join("\n---\n")}

          Please provide:
          1. Key medical conditions and their current status
          2. Treatment progress and medication effectiveness
          3. Vital signs analysis and trends
          4. Current treatment plan
          5. Specific recommendations for follow-up care
        `;

        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate summary");
        }

        const data = await response.json();
        
        // Handle both normal responses and fallback responses
        let summaryText = data.response;
        if (data.warning) {
          summaryText = `⚠️ ${data.warning}\n\n${data.response}`;
        }
        
        setSummary(summaryText);
      } catch (error) {
        console.error("Error generating summary:", error);
        setSummary(
          "Failed to generate medical summary. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    generateSummary();
  }, [appointments, vitals, patientInfo]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Generated Patient Summary</CardTitle>
        <CardDescription>
          Generated based on patient history and current vitals
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-line">{summary}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
