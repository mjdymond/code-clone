// @deno-types="npm:@types/node"
import { serve } from "std/http/server.ts";

// Import OpenAI client
import { OpenAI } from "openai";

// Define interfaces for request and response
interface AnalyzeResumeRequest {
  resumeContent: string;
  jobDescription: string;
  userId?: string;
}

interface AnalyzeResumeResponse {
  score: number;
  summary: string;
  keywordMatches: string[];
  missingSkills: string[];
  sectionAnalysis: Record<string, any>;
  atsCompatibility: {
    score: number;
    issues: string[];
  };
  error?: string;
}

serve(async (req: Request) => {
  try {
    // Add CORS headers
    const headers = new Headers({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    });

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, { headers, status: 204 });
    }
    
    // Parse request body
    const { resumeContent, jobDescription } = await req.json() as AnalyzeResumeRequest;
    
    // Validate request
    if (!resumeContent || !jobDescription) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields: resumeContent and jobDescription" }),
        { status: 400, headers }
      );
    }
    
    // Get OpenAI API key from environment
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    console.log("API Key status:", apiKey ? "Found" : "Not found");
    
    if (!apiKey) {
      console.error("OpenAI API key not configured");
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 500, headers }
      );
    }
    
    // Initialize OpenAI API
    const openai = new OpenAI({ apiKey });
    console.log("OpenAI client initialized");
    
    // Perform AI-powered analysis
    const analysis = await performAIAnalysis(openai, resumeContent, jobDescription);
    console.log("Analysis completed successfully");
    
    // Return analysis results
    return new Response(
      JSON.stringify(analysis),
      { headers }
    );
  } catch (error: unknown) {
    // Handle errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error analyzing resume:", errorMessage);
    
    return new Response(
      JSON.stringify({
        score: 0,
        summary: "Error analyzing resume",
        keywordMatches: [],
        missingSkills: [],
        sectionAnalysis: {},
        atsCompatibility: { score: 0, issues: ["Analysis failed"] },
        error: errorMessage
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

/**
 * Perform AI-powered analysis of resume against job description
 */
async function performAIAnalysis(
  openai: OpenAI,
  resumeContent: string,
  jobDescription: string
): Promise<AnalyzeResumeResponse> {
  try {
    console.log("Starting AI analysis");
    // Prepare prompt for OpenAI
    const prompt = `
    Analyze this resume against the job description and provide detailed feedback.
    
    RESUME:
    ${resumeContent}
    
    JOB DESCRIPTION:
    ${jobDescription}
    
    Please provide the following in JSON format:
    1. An overall match score (0-100)
    2. A summary of the match (2-3 sentences)
    3. Keywords from the job description that match the resume
    4. Skills or qualifications mentioned in the job description but missing from the resume
    5. Section-by-section analysis with improvement suggestions
    6. ATS compatibility analysis (score 0-100 and specific issues)
    `;
    
    console.log("Sending request to OpenAI");
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert resume analyst and career coach. Provide detailed, honest feedback on how well a resume matches a job description." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });
    
    console.log("Received response from OpenAI");
    // Parse response
    const responseContent = response.choices[0]?.message?.content || "{}";
    const analysisResult = JSON.parse(responseContent);
    
    // Format and return analysis
    return {
      score: analysisResult.score || 0,
      summary: analysisResult.summary || "No summary provided",
      keywordMatches: analysisResult.keywordMatches || [],
      missingSkills: analysisResult.missingSkills || [],
      sectionAnalysis: analysisResult.sectionAnalysis || {},
      atsCompatibility: analysisResult.atsCompatibility || { score: 0, issues: ["No ATS analysis provided"] }
    };
  } catch (error: unknown) {
    // Handle errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in AI analysis:", errorMessage);
    
    // Fallback to rule-based analysis if AI fails
    return {
      score: 50,
      summary: "Basic analysis completed (AI analysis failed).",
      keywordMatches: extractCommonKeywords(resumeContent, jobDescription),
      missingSkills: [],
      sectionAnalysis: {},
      atsCompatibility: { score: 70, issues: ["Basic analysis only"] }
    };
  }
}

/**
 * Extract common keywords between resume and job description
 */
function extractCommonKeywords(resumeContent: string, jobDescription: string): string[] {
  const resumeLower = resumeContent.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  
  // Common technical skills to look for
  const commonSkills = [
    'javascript', 'typescript', 'react', 'angular', 'vue', 'node.js', 'express',
    'python', 'django', 'flask', 'java', 'spring', 'c#', '.net', 'php', 'laravel',
    'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind', 'material-ui',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ci/cd',
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
    'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence',
    'agile', 'scrum', 'kanban', 'waterfall', 'lean',
    'machine learning', 'ai', 'data science', 'nlp', 'computer vision',
    'project management', 'team leadership', 'communication', 'problem-solving'
  ];
  
  // Find skills that appear in both resume and job description
  return commonSkills.filter(skill => 
    resumeLower.includes(skill) && jobLower.includes(skill)
  );
}
