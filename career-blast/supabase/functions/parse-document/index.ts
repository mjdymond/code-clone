// @deno-types="npm:@types/node"
import { serve } from "std/http/server.ts";
import { corsHeaders, handleCors } from "../cors.ts";

// Define interfaces for request and response
interface ParseDocumentRequest {
  fileType: string;
  fileName: string;
  fileContent: string;
  userId?: string;
}

// Response interface used by the Edge Function
interface ParseDocumentResponse {
  text: string;
  structure: {
    sections: Record<string, string>;
    metadata: Record<string, string>;
  };
  error?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse request body
    const { fileType, fileName, fileContent } = await req.json() as ParseDocumentRequest;
    
    // Validate request
    if (!fileType || !fileContent) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: fileType or fileContent" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Decode base64 file content
    const base64Data = fileContent.split(',')[1] || fileContent;
    const fileBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Parse document based on file type
    let parsedContent: ParseDocumentResponse;
    
    if (fileType.includes('pdf')) {
      parsedContent = await parsePDF(fileBuffer);
    } else if (fileType.includes('word') || fileType.includes('docx')) {
      parsedContent = await parseDOCX(fileBuffer, fileName);
    } else {
      return new Response(
        JSON.stringify({ error: "Unsupported file type. Please upload a PDF or DOCX file." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Return parsed content
    return new Response(
      JSON.stringify(parsedContent),
      { headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    // Handle errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error parsing document:", errorMessage);
    
    return new Response(
      JSON.stringify({
        text: "",
        structure: { sections: {}, metadata: {} },
        error: errorMessage
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});

/**
 * Parse PDF document
 */
async function parsePDF(fileBuffer: Uint8Array): Promise<ParseDocumentResponse> {
  try {
    // Import PDF.js dynamically
    const { getDocument, GlobalWorkerOptions } = await import("pdfjs");
    
    // Set worker URL
    const PDFJS_WORKER_URL = Deno?.env?.get("PDFJS_WORKER_URL") || 
                           "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.worker.min.js";
    GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
    
    // Load the PDF document
    const pdf = await getDocument({ data: fileBuffer }).promise;
    
    // Extract text from each page
    let fullText = "";
    const numPages = pdf.numPages;
    
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => (item as any).str).join(" ");
      fullText += pageText + "\n\n";
    }
    
    // Extract document structure
    const structure = extractDocumentStructure(fullText);
    
    return {
      text: fullText,
      structure
    };
  } catch (error: unknown) {
    // Handle errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error parsing PDF:", errorMessage);
    throw error;
  }
}

/**
 * Parse DOCX document
 */
async function parseDOCX(fileBuffer: Uint8Array, _fileName: string): Promise<ParseDocumentResponse> {
  try {
    // For DOCX parsing, we'll use a simple approach since Deno doesn't have great DOCX libraries
    // In a production environment, consider using a more robust solution
    
    // Convert buffer to text (this is a simplified approach)
    // In reality, DOCX is a ZIP file containing XML, so proper parsing would require more work
    let text = "";
    
    try {
      // Try to extract text from XML content in the DOCX
      const textDecoder = new TextDecoder("utf-8");
      const content = textDecoder.decode(fileBuffer);
      
      // Simple regex to extract text from XML-like content
      // This is a very basic approach and won't work well for all DOCX files
      text = content.replace(/<[^>]*>/g, " ")
                   .replace(/\s+/g, " ")
                   .trim();
    } catch (e) {
      console.warn("Basic DOCX parsing failed, using fallback method");
      // Fallback: Just convert binary data to string (will include garbage)
      const textDecoder = new TextDecoder("utf-8");
      text = textDecoder.decode(fileBuffer);
    }
    
    // Extract document structure
    const structure = extractDocumentStructure(text);
    
    return {
      text,
      structure
    };
  } catch (error: unknown) {
    // Handle errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error parsing DOCX:", errorMessage);
    throw error;
  }
}

/**
 * Extract document structure (sections, metadata)
 */
function extractDocumentStructure(text: string): {
  sections: Record<string, string>;
  metadata: Record<string, string>;
} {
  // Initialize structure
  const sections: Record<string, string> = {};
  const metadata: Record<string, string> = {};
  
  // Extract common resume sections
  const sectionPatterns = [
    { name: "contact", pattern: /(?:contact|email|phone|address|location)(?:\s+information)?\s*:?[\s\S]*?(?=\n\s*\n|$)/i },
    { name: "summary", pattern: /(?:summary|profile|objective|about me)\s*:?[\s\S]*?(?=\n\s*\n|$)/i },
    { name: "experience", pattern: /(?:experience|work|employment|job)(?:\s+history)?\s*:?[\s\S]*?(?=\n\s*\n(?:education|skills|projects|references)|$)/i },
    { name: "education", pattern: /education\s*:?[\s\S]*?(?=\n\s*\n(?:skills|projects|references)|$)/i },
    { name: "skills", pattern: /(?:skills|technologies|competencies)\s*:?[\s\S]*?(?=\n\s*\n(?:projects|references)|$)/i },
    { name: "projects", pattern: /projects\s*:?[\s\S]*?(?=\n\s*\n(?:references)|$)/i },
    { name: "certifications", pattern: /(?:certifications|certificates)\s*:?[\s\S]*?(?=\n\s*\n|$)/i },
    { name: "languages", pattern: /languages\s*:?[\s\S]*?(?=\n\s*\n|$)/i },
    { name: "references", pattern: /references\s*:?[\s\S]*?(?=\n\s*\n|$)/i }
  ];
  
  // Extract sections
  for (const { name, pattern } of sectionPatterns) {
    const match = text.match(pattern);
    if (match) {
      sections[name] = match[0].trim();
    }
  }
  
  // Extract metadata
  // Name (usually at the beginning of the resume)
  const nameMatch = text.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\s*\n/);
  if (nameMatch) {
    metadata["name"] = nameMatch[1].trim();
  }
  
  // Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    metadata["email"] = emailMatch[0].trim();
  }
  
  // Phone
  const phoneMatch = text.match(/(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) {
    metadata["phone"] = phoneMatch[0].trim();
  }
  
  // Location/Address
  const locationMatch = text.match(/(?:^|\n)([A-Za-z\s]+,\s*[A-Za-z]{2}(?:\s+\d{5})?)(?:$|\n)/);
  if (locationMatch) {
    metadata["location"] = locationMatch[1].trim();
  }
  
  return { sections, metadata };
}
