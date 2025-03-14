// @deno-types="npm:@types/node"
import { serve } from "std/http/server.ts";
import { corsHeaders, handleCors } from "../cors.ts";

// Define interfaces for request and response
interface ScrapeJobRequest {
  url: string;
  userId?: string;
}

interface ScrapeJobResponse {
  title: string;
  company: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  error?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) {
    return corsResponse;
  }
  
  try {
    // Parse request body
    const { url } = await req.json() as ScrapeJobRequest;
    
    // Validate request
    if (!url) {
      return new Response(
        JSON.stringify({ error: "Missing required field: url" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Attempting to scrape job posting from URL: ${url}`);
    
    // Scrape job posting
    const jobData = await scrapeJobPosting(url);
    
    console.log(`Successfully scraped job data: ${JSON.stringify(jobData).substring(0, 100)}...`);
    
    // Return job data
    return new Response(
      JSON.stringify(jobData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    // Handle errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error scraping job posting:", errorMessage);
    
    return new Response(
      JSON.stringify({
        title: null,
        company: null,
        description: null,
        responsibilities: [],
        qualifications: [],
        error: errorMessage
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Scrape a job posting from a URL
 */
async function scrapeJobPosting(url: string): Promise<ScrapeJobResponse> {
  try {
    // Set up headers to mimic a browser request
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'max-age=0'
    };
    
    // Fetch the webpage content
    console.log(`Fetching URL: ${url}`);
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    console.log(`Fetched HTML content length: ${html.length} characters`);
    
    if (html.length < 100) {
      throw new Error("Received too little HTML content, likely blocked or invalid URL");
    }
    
    // Extract job information
    const title = extractJobTitle(html, url);
    const company = extractCompany(html, url);
    const description = extractDescription(html);
    const responsibilities = extractResponsibilities(html);
    const qualifications = extractQualifications(html);
    
    console.log(`Extracted job title: ${title}`);
    console.log(`Extracted company: ${company}`);
    console.log(`Extracted description length: ${description.length} characters`);
    
    return {
      title,
      company,
      description,
      responsibilities,
      qualifications
    };
  } catch (error: unknown) {
    // Handle errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in job scraping:", errorMessage);
    throw error;
  }
}

/**
 * Extract job title from HTML
 */
function extractJobTitle(html: string, url: string): string {
  // Common selectors for job titles
  const titleSelectors = [
    // Common job board selectors
    /<title>([^|<]+)/i,                       // Title tag format: "Job Title | Company"
    /<h1[^>]*>([^<]+)<\/h1>/i,               // H1 tag (common for job titles)
    /"jobTitle"[^>]*>([^<]+)<\/[^>]+>/i,     // Schema.org markup
    /"title"[^>]*>([^<]+)<\/[^>]+>/i,        // Generic title class
    /class="[^"]*job-title[^"]*"[^>]*>([^<]+)<\/[^>]+>/i, // Class-based job title
    /class="[^"]*title[^"]*"[^>]*>([^<]+)<\/[^>]+>/i,     // Generic title class
    /property="og:title"[^>]*content="([^"]+)"/i,        // Open Graph title
    /name="title"[^>]*content="([^"]+)"/i,             // Meta title
    
    // LinkedIn specific
    /<h1[^>]*class="[^"]*job-title[^"]*"[^>]*>([^<]+)<\/h1>/i,
    /<h1[^>]*class="[^"]*topcard__title[^"]*"[^>]*>([^<]+)<\/h1>/i,
    
    // Indeed specific
    /<h1[^>]*class="[^"]*jobsearch-JobInfoHeader-title[^"]*"[^>]*>([^<]+)<\/h1>/i,
    /<h1[^>]*class="[^"]*icl-u-xs-mb--xs[^"]*"[^>]*>([^<]+)<\/h1>/i,
    
    // Glassdoor specific
    /<div[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)<\/div>/i,
    /<div[^>]*class="[^"]*job-title[^"]*"[^>]*>([^<]+)<\/div>/i
  ];
  
  // Try each selector
  for (const selector of titleSelectors) {
    const match = html.match(selector);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // Fallback: Extract from URL
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart) {
      return lastPart.replace(/-|_/g, " ").trim();
    }
  } catch (e) {
    console.error("Error parsing URL:", e);
  }
  
  return "Job Title Not Found";
}

/**
 * Extract company name from HTML
 */
function extractCompany(html: string, url: string): string {
  // Common selectors for company names
  const companySelectors = [
    // Common job board selectors
    /<title>[^|<]+[|]\s*([^<]+)<\/title>/i,  // Title tag format: "Job Title | Company"
    /"company"[^>]*>([^<]+)<\/[^>]+>/i,      // Schema.org markup
    /"employer"[^>]*>([^<]+)<\/[^>]+>/i,     // Generic employer class
    /class="[^"]*company[^"]*"[^>]*>([^<]+)<\/[^>]+>/i, // Class-based company
    /class="[^"]*employer[^"]*"[^>]*>([^<]+)<\/[^>]+>/i, // Class-based employer
    /property="og:site_name"[^>]*content="([^"]+)"/i,   // Open Graph site name
    /name="author"[^>]*content="([^"]+)"/i,             // Meta author
    
    // LinkedIn specific
    /<span[^>]*class="[^"]*company-name[^"]*"[^>]*>([^<]+)<\/span>/i,
    /<span[^>]*class="[^"]*topcard__org-name-link[^"]*"[^>]*>([^<]+)<\/span>/i,
    
    // Indeed specific
    /<div[^>]*class="[^"]*jobsearch-InlineCompanyRating[^"]*"[^>]*>([^<]+)<\/div>/i,
    /<div[^>]*class="[^"]*icl-u-lg-mr--sm[^"]*"[^>]*>([^<]+)<\/div>/i,
    
    // Glassdoor specific
    /<div[^>]*class="[^"]*employer-name[^"]*"[^>]*>([^<]+)<\/div>/i,
    /<span[^>]*class="[^"]*EmployerProfile[^"]*"[^>]*>([^<]+)<\/span>/i
  ];
  
  // Try each selector
  for (const selector of companySelectors) {
    const match = html.match(selector);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // Fallback: Extract from URL
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    // Extract domain name without TLD
    const domainParts = hostname.split(".");
    if (domainParts.length >= 2) {
      const domain = domainParts[domainParts.length - 2];
      if (domain !== "com" && domain !== "org" && domain !== "net") {
        return domain.charAt(0).toUpperCase() + domain.slice(1);
      }
    }
  } catch (e) {
    console.error("Error parsing URL for company:", e);
  }
  
  return "Company Not Found";
}

/**
 * Extract job description from HTML
 */
function extractDescription(html: string): string {
  // Common selectors for job descriptions
  const descriptionSelectors = [
    // Common job board selectors
    /<div[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*job-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*id="[^"]*job-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*id="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<section[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/section>/i,
    
    // LinkedIn specific
    /<div[^>]*class="[^"]*show-more-less-html[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*description__text[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    
    // Indeed specific
    /<div[^>]*id="[^"]*jobDescriptionText[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*jobsearch-jobDescriptionText[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    
    // Glassdoor specific
    /<div[^>]*class="[^"]*jobDescriptionContent[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*desc[^"]*"[^>]*>([\s\S]*?)<\/div>/i
  ];
  
  // Try each selector
  for (const selector of descriptionSelectors) {
    const match = html.match(selector);
    if (match && match[1]) {
      return cleanHtml(match[1]);
    }
  }
  
  // If no specific section found, try to extract the main content area
  const mainContentSelectors = [
    /<main[^>]*>([\s\S]*?)<\/main>/i,
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*main[^"]*"[^>]*>([\s\S]*?)<\/div>/i
  ];
  
  for (const selector of mainContentSelectors) {
    const match = html.match(selector);
    if (match && match[1] && match[1].length > 200) { // Ensure it's substantial content
      return cleanHtml(match[1]);
    }
  }
  
  return "Job description not found.";
}

/**
 * Extract responsibilities from job description
 */
function extractResponsibilities(html: string): string[] {
  // First try to find a dedicated responsibilities section
  const responsibilitiesSection = extractSection(html, [
    /responsibilities/i,
    /job duties/i,
    /what you'll do/i,
    /what you will do/i,
    /key responsibilities/i,
    /core responsibilities/i,
    /your role/i
  ]);
  
  if (responsibilitiesSection) {
    const items = extractListItems(responsibilitiesSection);
    if (items.length > 0) {
      return items;
    }
  }
  
  // Fallback: Try to extract list items from the full description
  const description = extractDescription(html);
  if (description) {
    return extractListItems(description).slice(0, 5); // Limit to first 5 items as a fallback
  }
  
  return [];
}

/**
 * Extract qualifications from job description
 */
function extractQualifications(html: string): string[] {
  // First try to find a dedicated qualifications section
  const qualificationsSection = extractSection(html, [
    /qualifications/i,
    /requirements/i,
    /skills( required)?/i,
    /what you'll need/i,
    /what you will need/i,
    /what we're looking for/i,
    /what we are looking for/i,
    /who you are/i,
    /about you/i
  ]);
  
  if (qualificationsSection) {
    const items = extractListItems(qualificationsSection);
    if (items.length > 0) {
      return items;
    }
  }
  
  // Fallback: Try to extract list items from the full description
  const description = extractDescription(html);
  if (description) {
    return extractListItems(description).slice(0, 5); // Limit to first 5 items as a fallback
  }
  
  return [];
}

/**
 * Extract a specific section from HTML based on section headers
 */
function extractSection(html: string, headerPatterns: RegExp[]): string {
  const cleanedHtml = cleanHtml(html);
  const paragraphs = cleanedHtml.split(/\n\s*\n/);
  
  for (let i = 0; i < paragraphs.length; i++) {
    for (const pattern of headerPatterns) {
      if (pattern.test(paragraphs[i])) {
        // Found a matching header, return this paragraph and the next few
        let sectionContent = paragraphs[i];
        
        // Include the next few paragraphs (up to 3) as part of this section
        for (let j = 1; j <= 3 && i + j < paragraphs.length; j++) {
          sectionContent += "\n\n" + paragraphs[i + j];
          
          // Stop if we hit another header
          if (paragraphs[i + j].match(/^[A-Z][\w\s]+:$/)) {
            break;
          }
        }
        
        return sectionContent;
      }
    }
  }
  
  return "";
}

/**
 * Extract list items from HTML content
 */
function extractListItems(html: string): string[] {
  const items: string[] = [];
  
  // Try to find list items
  const listItemRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match;
  
  while ((match = listItemRegex.exec(html)) !== null) {
    if (match[1]) {
      const cleanedItem = cleanHtml(match[1]).trim();
      if (cleanedItem && cleanedItem.length > 5) { // Ensure it's not just a short fragment
        items.push(cleanedItem);
      }
    }
  }
  
  // If no list items found, try to find bullet points in text
  if (items.length === 0) {
    const bulletPointRegex = /(^|\n)[\s•\-\*\+◦→]+(.*?)($|\n)/g;
    
    while ((match = bulletPointRegex.exec(html)) !== null) {
      if (match[2]) {
        const cleanedItem = cleanHtml(match[2]).trim();
        if (cleanedItem && cleanedItem.length > 5) {
          items.push(cleanedItem);
        }
      }
    }
  }
  
  // If still no items found, try to split by sentences and take the first few
  if (items.length === 0) {
    const sentences = html.split(/\.\s+/);
    for (let i = 0; i < Math.min(sentences.length, 5); i++) {
      const cleanedSentence = cleanHtml(sentences[i]).trim() + ".";
      if (cleanedSentence.length > 10) {
        items.push(cleanedSentence);
      }
    }
  }
  
  return items;
}

/**
 * Clean HTML content by removing tags and normalizing whitespace
 */
function cleanHtml(html: string): string {
  // Remove all HTML tags
  let text = html.replace(/<[^>]*>/g, " ");
  
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
  
  // Normalize whitespace
  text = text.replace(/\s+/g, " ").trim();
  
  return text;
}
