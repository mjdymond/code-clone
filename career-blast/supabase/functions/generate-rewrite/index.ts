// @deno-types="npm:@types/node"
import { serve } from "std/http/server.ts";

// Import OpenAI client
import { OpenAI } from "openai";

// Define interfaces for request and response
interface GenerateRewriteRequest {
  section: string;
  originalContent: string;
  jobDescription: string;
  userId?: string;
}

interface GenerateRewriteResponse {
  suggestedContent: string;
  improvements: string[];
  error?: string;
}

serve(async (req: Request) => {
  try {
    // Parse request body
    const { section, originalContent, jobDescription } = await req.json() as GenerateRewriteRequest;
    
    // Validate request
    if (!section || !originalContent || !jobDescription) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: section, originalContent, or jobDescription" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Get OpenAI API key from environment
    const apiKey = Deno?.env?.get("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Initialize OpenAI API
    const openai = new OpenAI({ apiKey });
    
    // Generate rewrite suggestion
    const result = await generateRewriteSuggestion(openai, section, originalContent, jobDescription);
    
    // Return the result
    return new Response(
      JSON.stringify(result),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    // Handle errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error generating rewrite suggestion:", errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage, suggestedContent: "", improvements: [] }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

/**
 * Generate a rewrite suggestion for a resume section based on a job description
 */
async function generateRewriteSuggestion(
  openai: OpenAI,
  section: string,
  originalContent: string,
  jobDescription: string
): Promise<GenerateRewriteResponse> {
  try {
    // Prepare prompt for OpenAI
    const prompt = `
    I need to optimize the "${section}" section of my resume to better match this job description.
    
    ORIGINAL CONTENT:
    ${originalContent}
    
    JOB DESCRIPTION:
    ${jobDescription}
    
    Please rewrite this section to better align with the job description while maintaining accuracy and authenticity.
    Focus on highlighting relevant skills, experiences, and accomplishments that match the job requirements.
    Improve the language, be specific with achievements, and use industry-relevant keywords.
    
    Please provide the following in JSON format:
    1. A rewritten version of the section
    2. A list of specific improvements made
    `;
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert resume writer with deep knowledge of ATS systems and hiring practices. Your goal is to help job seekers optimize their resumes for specific job descriptions." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });
    
    // Parse response
    const responseContent = response.choices[0]?.message?.content || "{}";
    const result = JSON.parse(responseContent);
    
    return {
      suggestedContent: result.rewrittenSection || result.suggestedContent || "",
      improvements: result.improvements || []
    };
  } catch (error: unknown) {
    // Handle errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in rewrite generation:", errorMessage);
    
    // Return a basic response
    return {
      suggestedContent: originalContent,
      improvements: ["Unable to generate improvements due to an error"],
      error: errorMessage
    };
  }
}
