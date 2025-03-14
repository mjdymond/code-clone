// Test script for Edge Functions
import { load } from "https://deno.land/std@0.168.0/dotenv/mod.ts";

// Load environment variables
const env = await load({ envPath: "./supabase.env" });

// Set environment variables
for (const [key, value] of Object.entries(env)) {
  Deno.env.set(key, value);
}

console.log("Environment variables loaded:", Object.keys(env));

// Test parse-document function
async function testParseDocument() {
  console.log("\n=== Testing parse-document function ===");
  try {
    // This is a mock request - in a real scenario, you would use a real PDF/DOCX base64 content
    const mockRequest = {
      fileType: "application/pdf",
      fileName: "test-resume.pdf",
      fileContent: "mockBase64Content", // This won't actually work without real content
      userId: "test-user"
    };

    // Import the function handler
    const { default: handler } = await import("./parse-document/index.ts");
    
    console.log("Function imported successfully");
    console.log("Mock request:", JSON.stringify(mockRequest, null, 2));
    
    // Note: This won't actually work without real file content and proper setup
    console.log("To test with real files, use the Supabase CLI:");
    console.log("supabase functions serve parse-document --no-verify-jwt --env-file ./supabase.env");
  } catch (error) {
    console.error("Error testing parse-document:", error);
  }
}

// Test analyze-resume function
async function testAnalyzeResume() {
  console.log("\n=== Testing analyze-resume function ===");
  try {
    const mockRequest = {
      resumeContent: "Professional software engineer with 5 years of experience in TypeScript and React.",
      jobDescription: "Looking for a senior software engineer with React and TypeScript experience.",
      userId: "test-user"
    };

    // Import the function handler
    const { default: handler } = await import("./analyze-resume/index.ts");
    
    console.log("Function imported successfully");
    console.log("Mock request:", JSON.stringify(mockRequest, null, 2));
    
    // Note: This won't actually call OpenAI without proper setup
    console.log("To test with OpenAI, use the Supabase CLI:");
    console.log("supabase functions serve analyze-resume --no-verify-jwt --env-file ./supabase.env");
  } catch (error) {
    console.error("Error testing analyze-resume:", error);
  }
}

// Test scrape-job function
async function testScrapeJob() {
  console.log("\n=== Testing scrape-job function ===");
  try {
    const mockRequest = {
      url: "https://example.com/job-posting",
      userId: "test-user"
    };

    // Import the function handler
    const { default: handler } = await import("./scrape-job/index.ts");
    
    console.log("Function imported successfully");
    console.log("Mock request:", JSON.stringify(mockRequest, null, 2));
    
    console.log("To test with real URLs, use the Supabase CLI:");
    console.log("supabase functions serve scrape-job --no-verify-jwt --env-file ./supabase.env");
  } catch (error) {
    console.error("Error testing scrape-job:", error);
  }
}

// Test generate-rewrite function
async function testGenerateRewrite() {
  console.log("\n=== Testing generate-rewrite function ===");
  try {
    const mockRequest = {
      section: "experience",
      originalContent: "Developed web applications using React and TypeScript.",
      jobDescription: "Looking for a developer with React and TypeScript experience.",
      userId: "test-user"
    };

    // Import the function handler
    const { default: handler } = await import("./generate-rewrite/index.ts");
    
    console.log("Function imported successfully");
    console.log("Mock request:", JSON.stringify(mockRequest, null, 2));
    
    // Note: This won't actually call OpenAI without proper setup
    console.log("To test with OpenAI, use the Supabase CLI:");
    console.log("supabase functions serve generate-rewrite --no-verify-jwt --env-file ./supabase.env");
  } catch (error) {
    console.error("Error testing generate-rewrite:", error);
  }
}

// Run all tests
async function runAllTests() {
  console.log("Starting Edge Function tests...");
  await testParseDocument();
  await testAnalyzeResume();
  await testScrapeJob();
  await testGenerateRewrite();
  console.log("\nAll tests completed.");
}

runAllTests();
