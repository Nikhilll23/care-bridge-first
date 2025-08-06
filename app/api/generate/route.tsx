// app/api/generate/route.js
import { NextResponse } from "next/server";

// Make sure Ollama server is running!
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const MODEL_NAME = "llama3.2"; // Or dynamically get from request if needed

// Fallback medical summary function
function generateFallbackSummary(prompt: string): string {
  return "AI service temporarily unavailable. Patient requires manual review by healthcare provider. Please check recent vitals, medication compliance, and schedule appropriate follow-up based on presenting symptoms and medical history.";
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    console.log(
      `Sending prompt to Ollama: "${prompt}" using model ${MODEL_NAME}`,
    );

    // Call Ollama /api/generate endpoint with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          prompt: prompt,
          stream: false, // Get the full response at once. Set to true for streaming.
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Ollama API Error:", errorText);
        throw new Error(
          `Ollama API request failed with status ${response.status}: ${errorText}`,
        );
      }

      const data = await response.json();
      console.log("Received response from Ollama:", data.response);

      return NextResponse.json({ response: data.response });
    } catch (fetchError) {
      console.error("Ollama connection error:", fetchError);
      
      // Check if it's a connection refused error
      if (fetchError instanceof Error && fetchError.message.includes('ECONNREFUSED')) {
        console.log("Ollama service not available, using fallback response");
        const fallbackResponse = generateFallbackSummary(prompt);
        return NextResponse.json({ 
          response: fallbackResponse,
          warning: "AI service temporarily unavailable - using fallback response"
        });
      }
      
      throw fetchError; // Re-throw other errors
    }
  } catch (error) {
    console.error("Error in API route:", error);
    
    // Fallback for any error
    const fallbackResponse = generateFallbackSummary("");
    return NextResponse.json(
      {
        response: fallbackResponse,
        error: "AI service unavailable",
        warning: "Using fallback response - please review manually"
      },
      { status: 200 } // Return 200 so the client can still use the fallback
    );
  }
}
