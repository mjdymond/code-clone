import { supabase } from '../lib/supabase';

/**
 * Response interface for document parsing operations
 */
export interface ParsedDocumentResponse {
  content: string | null;
  parsedContent: Record<string, any> | null;
  error: Error | null;
}

/**
 * Service for parsing different document types (PDF, DOCX, etc.)
 */
export const ParserService = {
  /**
   * Parse a document file based on its type
   * @param file - The file to parse
   * @returns Parsed content and structured data
   */
  async parseDocument(file: File): Promise<ParsedDocumentResponse> {
    try {
      const fileType = this._getFileType(file);
      
      // Convert file to base64 for sending to Edge Function
      const base64File = await this._fileToBase64(file);
      
      console.log('Calling parse-document Edge Function...');
      
      try {
        // Call Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('parse-document', {
          body: { 
            fileType, 
            fileName: file.name,
            fileContent: base64File 
          }
        });

        if (error) {
          console.error('Edge Function error:', error);
          throw error;
        }
        
        if (!data) {
          console.error('No data returned from Edge Function');
          throw new Error('No data returned from Edge Function');
        }
        
        console.log('Edge Function response:', data);
        
        return {
          content: data.content,
          parsedContent: data.parsedContent,
          error: null
        };
      } catch (edgeFunctionError) {
        console.warn('Edge Function failed, falling back to client-side parsing:', edgeFunctionError);
        
        // Fallback to client-side parsing
        return await this._parseDocumentClientSide(file);
      }
    } catch (error: unknown) {
      console.error('Error parsing document:', error);
      
      // Create a more user-friendly error message
      let errorMessage = 'Failed to parse document';
      
      if (error instanceof Error) {
        if (error.name === 'FunctionsFetchError' || error.message.includes('fetch')) {
          errorMessage = 'Failed to connect to the document parsing service. Please check your internet connection and try again.';
        } else {
          errorMessage = `${errorMessage}: ${error.message}`;
        }
      }
      
      return { 
        content: null, 
        parsedContent: null, 
        error: new Error(errorMessage) 
      };
    }
  },
  
  /**
   * Fallback method for parsing documents on the client side
   * @private
   * @param file - The file to parse
   * @returns Parsed content and structured data
   */
  async _parseDocumentClientSide(file: File): Promise<ParsedDocumentResponse> {
    try {
      console.log('Using client-side document parsing fallback');
      const fileType = this._getFileType(file);
      let content = '';
      
      // Basic text extraction based on file type
      if (fileType.includes('pdf')) {
        try {
          // Try to use pdf.js for PDF parsing if available
          const pdfjs = await import('pdfjs-dist');
          
          // Set worker
          pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
          
          // Convert file to ArrayBuffer
          const arrayBuffer = await file.arrayBuffer();
          
          // Load PDF document
          const loadingTask = pdfjs.getDocument(arrayBuffer);
          const pdf = await loadingTask.promise;
          
          // Extract text from each page
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n\n';
          }
          
          content = fullText;
          console.log('Successfully parsed PDF using pdf.js');
        } catch (pdfError) {
          console.warn('Failed to parse PDF with pdf.js, falling back to basic text extraction:', pdfError);
          // Fallback to basic text extraction
          content = await this._readFileAsText(file);
        }
      } else if (fileType.includes('docx') || fileType.includes('doc')) {
        try {
          // Try to use a DOCX parser if available
          const mammoth = await import('mammoth');
          
          // Convert file to ArrayBuffer
          const arrayBuffer = await file.arrayBuffer();
          
          // Extract text from DOCX
          const result = await mammoth.extractRawText({ arrayBuffer });
          content = result.value;
          console.log('Successfully parsed DOCX using mammoth');
        } catch (docxError) {
          console.warn('Failed to parse DOCX with mammoth, falling back to basic text extraction:', docxError);
          // Fallback to basic text extraction
          content = await this._readFileAsText(file);
        }
      } else {
        // For other file types, try to read as text
        content = await this._readFileAsText(file);
      }
      
      // Generate a basic parsed structure
      const parsedContent = this._identifySections(content);
      
      return {
        content,
        parsedContent,
        error: null
      };
    } catch (error) {
      console.error('Error in client-side parsing:', error);
      return {
        content: null,
        parsedContent: null,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },

  /**
   * Extract structured information from text content
   * @param content - The raw text content to process
   * @returns Structured content organized by sections
   */
  async extractStructuredContent(content: string): Promise<Record<string, any>> {
    // This functionality is now handled by the parse-document Edge Function
    // This method is kept for backward compatibility
    return this._identifySections(content);
  },

  /**
   * Parse job description text to extract structured information
   * @param description - Job description text
   * @returns Structured job information
   */
  async parseJobDescription(description: string): Promise<Record<string, any>> {
    try {
      // For simple text parsing, we can still use the local implementation
      // For more complex parsing, we would call an Edge Function
      return {
        sections: {
          responsibilities: this._extractSection(description, 'responsibilities', 'qualifications'),
          requirements: this._extractSection(description, 'requirements', 'benefits'),
          qualifications: this._extractSection(description, 'qualifications', 'about'),
          skills: this._extractSkills(description),
        },
      };
    } catch (error) {
      console.error('Error parsing job description:', error);
      return {};
    }
  },

  /**
   * Scrape and parse job content from a URL
   * @param url - The job posting URL
   * @returns Structured job data
   */
  async scrapeJobPosting(url: string): Promise<{ title: string | null; company: string | null; description: string | null; error: Error | null }> {
    try {
      console.log('Attempting to scrape job posting from URL:', url);
      
      // Since we're having CORS issues with the Edge Function, let's use the client-side fallback directly
      // We'll skip the edge function call for now
      return this._clientSideScrapeJobPosting(url);
      
      /* Commented out edge function call due to CORS issues
      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('scrape-job', {
        body: { url }
      });

      if (error) {
        console.error('Edge Function error, falling back to client-side scraping:', error);
        return this._clientSideScrapeJobPosting(url);
      }
      
      return {
        title: data.title,
        company: data.company,
        description: data.description,
        error: null
      };
      */
    } catch (error) {
      console.error('Error scraping job posting, falling back to client-side scraping:', error);
      return this._clientSideScrapeJobPosting(url);
    }
  },

  /**
   * Client-side fallback for job scraping when edge function fails
   * @private
   * @param url - The job posting URL
   * @returns Structured job data
   */
  async _clientSideScrapeJobPosting(url: string): Promise<{ title: string | null; company: string | null; description: string | null; error: Error | null }> {
    try {
      // Use a more reliable CORS proxy to fetch the job posting
      // const corsProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      
      console.log('Attempting client-side job scraping with CORS proxy:', corsProxyUrl);
      
      const response = await fetch(corsProxyUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
      }
      
      const html = await response.text();
      console.log('Successfully fetched HTML content, length:', html.length);
      
      // Extract job title from HTML using multiple patterns
      const titlePatterns = [
        /<title>([^|<]+)/i,
        /<h1[^>]*>([^<]+)<\/h1>/i,
        /class="[^"]*job-title[^"]*"[^>]*>([^<]+)<\/[^>]+>/i,
        /class="[^"]*title[^"]*"[^>]*>([^<]+)<\/[^>]+>/i,
        /id="[^"]*job-title[^"]*"[^>]*>([^<]+)<\/[^>]+>/i,
        /property="og:title"[^>]*content="([^"]+)"/i
      ];
      
      // Extract company name from HTML using multiple patterns
      const companyPatterns = [
        /<title>[^|<]+[|]\s*([^<]+)<\/title>/i,
        /class="[^"]*company[^"]*"[^>]*>([^<]+)<\/[^>]+>/i,
        /class="[^"]*employer[^"]*"[^>]*>([^<]+)<\/[^>]+>/i,
        /property="og:site_name"[^>]*content="([^"]+)"/i
      ];
      
      // Extract job description from HTML using multiple patterns
      const descriptionPatterns = [
        /<div[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
        /<div[^>]*class="[^"]*job-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
        /<div[^>]*class="[^"]*details[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
        /<section[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/section>/i,
        /property="og:description"[^>]*content="([^"]+)"/i
      ];
      
      // Try each pattern until we find a match
      const findMatch = (patterns: RegExp[]): string | null => {
        for (const pattern of patterns) {
          const match = html.match(pattern);
          if (match && match[1]) {
            return match[1];
          }
        }
        return null;
      };
      
      const titleMatch = findMatch(titlePatterns);
      const companyMatch = findMatch(companyPatterns);
      const descriptionMatch = findMatch(descriptionPatterns);
      
      console.log('Extraction results:', { 
        titleFound: !!titleMatch, 
        companyFound: !!companyMatch, 
        descriptionFound: !!descriptionMatch 
      });
      
      // Clean and extract text from HTML
      const cleanHtml = (htmlContent: string | null): string => {
        if (!htmlContent) return '';
        return htmlContent
          .replace(/<[^>]*>/g, " ")           // Remove HTML tags
          .replace(/&nbsp;/g, " ")            // Replace non-breaking spaces
          .replace(/&amp;/g, "&")              // Replace ampersands
          .replace(/&lt;/g, "<")               // Replace less than
          .replace(/&gt;/g, ">")               // Replace greater than
          .replace(/&quot;/g, '"')             // Replace quotes
          .replace(/\s+/g, " ")               // Normalize whitespace
          .trim();                             // Trim leading/trailing whitespace
      };
      
      // Extract URL components as fallback
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/").filter(Boolean);
      const lastPathPart = pathParts[pathParts.length - 1]?.replace(/-|_/g, " ").trim();
      const domainParts = urlObj.hostname.split(".");
      const domain = domainParts.length > 1 ? domainParts[domainParts.length - 2] : '';
      const domainName = domain.charAt(0).toUpperCase() + domain.slice(1);
      
      return {
        title: titleMatch ? cleanHtml(titleMatch) : lastPathPart || 'Job Title Not Found',
        company: companyMatch ? cleanHtml(companyMatch) : domainName || 'Company Not Found',
        description: descriptionMatch ? cleanHtml(descriptionMatch) : 'Job description not found.',
        error: null
      };
    } catch (error) {
      console.error('Error in client-side job scraping:', error);
      return { 
        title: null, 
        company: null, 
        description: null, 
        error: error instanceof Error ? error : new Error(String(error)) 
      };
    }
  },

  /**
   * Analyze a resume against a job description
   * @param resumeData - Resume data including content and parsed content
   * @param jobData - Job data including description
   * @returns Analysis results
   */
  async analyzeResume(resumeData: any, jobData: any): Promise<Record<string, any>> {
    try {
      console.log('Starting resume analysis with edge function');
      
      // Ensure we have the correct data format
      let resumeContent = '';
      if (resumeData) {
        if (resumeData.resume_versions && resumeData.resume_versions.length > 0) {
          // Get the latest version's content
          const latestVersion = resumeData.resume_versions[0];
          resumeContent = latestVersion.content || '';
          console.log('Using content from latest resume version');
        } else if (resumeData.content) {
          resumeContent = resumeData.content;
          console.log('Using content directly from resume data');
        }
      }
      
      const jobDescription = jobData?.description || '';
      
      console.log('Resume content length:', resumeContent.length);
      console.log('Job description length:', jobDescription.length);
      
      // Try with the Supabase client's functions.invoke method first
      try {
        console.log('Invoking analyze-resume edge function with Supabase client...');
        
        // Add a timestamp to prevent caching issues
        const timestamp = new Date().getTime();
        
        const { data, error } = await supabase.functions.invoke('analyze-resume', {
          body: { 
            resumeContent,
            jobDescription,
            timestamp // Add timestamp to prevent caching
          },
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (error) {
          console.error('Edge function error details:', error);
          throw error;
        }
        
        console.log('Edge function response successful with Supabase client');
        return data;
      } catch (supabaseError) {
        // If the Supabase client approach fails, try with a direct fetch
        console.log('Supabase client approach failed, trying direct fetch');
        console.error('Supabase error details:', supabaseError);
        
        // Use direct fetch as a fallback
        const functionUrl = 'https://tircatiycsdtccomxxzs.functions.supabase.co/analyze-resume';
        console.log('Attempting direct fetch to:', functionUrl);
        
        // Get the anon key from the Supabase configuration
        const { supabaseAnonKey } = await import('../lib/supabase');
        
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            resumeContent,
            jobDescription,
            timestamp: new Date().getTime()
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Direct fetch error:', response.status, response.statusText);
          console.error('Error response body:', errorText);
          throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Direct fetch successful');
        
        return data;
      }
    } catch (error: unknown) {
      console.error('Error analyzing resume:', error);
      
      // Provide more detailed error information
      let errorMessage = 'Unknown error in analysis';
      let errorDetails = {};
      
      if (error instanceof Error) {
        errorMessage = error.message;
        errorDetails = {
          name: error.name,
          stack: error.stack,
        };
        
        // Log specific details for network errors
        if (error.name === 'FunctionsFetchError' || error.message.includes('fetch')) {
          console.error('Network error when calling edge function. Check CORS and network connectivity.');
        }
      }
      
      console.error('Error details:', errorDetails);
      
      // Return a fallback analysis result
      return {
        score: 0,
        summary: 'Error analyzing resume: ' + errorMessage,
        keywordMatches: [],
        missingSkills: [],
        sectionAnalysis: {},
        atsCompatibility: { score: 0, issues: ['Analysis failed: ' + errorMessage] },
        error: errorMessage
      };
    }
  },

  /**
   * Generate a rewrite suggestion for a resume section
   * @param section - Resume section to rewrite
   * @param content - Original content of the section
   * @param jobDescription - Job description to tailor the rewrite to
   * @returns Suggested rewrite
   */
  async generateRewriteSuggestion(section: string, content: string, jobDescription: string): Promise<string> {
    try {
      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-rewrite', {
        body: { 
          section,
          originalContent: content,
          jobDescription
        }
      });

      if (error) throw error;
      
      return data.suggestedContent || '';
    } catch (error) {
      console.error('Error generating rewrite suggestion:', error);
      return '';
    }
  },

  // ==========================================
  // Private Helper Methods
  // ==========================================

  /**
   * Get the file type from a File object
   * @private
   * @param file - The file to check
   * @returns The file type (extension)
   */
  _getFileType(file: File): string {
    const fileName = file.name.toLowerCase();
    const extension = fileName.split('.').pop() || '';
    return extension;
  },

  /**
   * Convert a file to base64 encoding
   * @private
   * @param file - The file to convert
   * @returns Promise resolving to base64 string
   */
  async _fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let base64String = reader.result as string;
        // Remove the data URL prefix (e.g., 'data:application/pdf;base64,')
        base64String = base64String.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  },

  /**
   * Read a file as text
   * @private
   * @param file - The file to read
   * @returns Promise resolving to file content as text
   */
  async _readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  },

  /**
   * Identify sections in text content
   * @private
   * @param content - The content to process
   * @returns Sections identified in the content
   */
  _identifySections(content: string): Record<string, any> {
    // Simple rule-based approach to identify sections
    const sections: Record<string, string> = {};
    
    // Common resume section headers
    const sectionHeaders = [
      'summary', 'objective', 'profile',
      'experience', 'work experience', 'employment',
      'education', 'academic background',
      'skills', 'technical skills', 'competencies',
      'projects', 'portfolio',
      'certifications', 'certificates',
      'languages', 'references'
    ];
    
    // Split content by lines and look for section headers
    const lines = content.split('\n');
    let currentSection = '';
    let currentContent: string[] = [];
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase().trim();
      
      // Check if this line is a section header
      const matchedHeader = sectionHeaders.find(header => 
        lowerLine === header ||
        lowerLine === header.toUpperCase() ||
        lowerLine === `${header}:` ||
        lowerLine === `${header.toUpperCase()}:`
      );
      
      if (matchedHeader) {
        // Save previous section if it exists
        if (currentSection && currentContent.length > 0) {
          sections[currentSection] = currentContent.join('\n');
        }
        
        // Start new section
        currentSection = matchedHeader.toLowerCase().replace(':', '');
        currentContent = [];
      } else if (currentSection) {
        // Add line to current section
        currentContent.push(line);
      }
    }
    
    // Save the last section
    if (currentSection && currentContent.length > 0) {
      sections[currentSection] = currentContent.join('\n');
    }
    
    // If no sections were found, create a generic content section
    if (Object.keys(sections).length === 0) {
      sections['content'] = content;
    }
    
    return {
      sections,
      metadata: {
        processingTime: new Date().toISOString(),
        wordCount: content.split(/\s+/).length,
        characterCount: content.length,
      }
    };
  },

  /**
   * Extract a section from text content
   * @private
   * @param text - The text to process
   * @param sectionStart - The section start marker
   * @param sectionEnd - The section end marker
   * @returns Extracted section content
   */
  _extractSection(text: string, sectionStart: string, sectionEnd: string): string {
    const lowerText = text.toLowerCase();
    const startIndex = lowerText.indexOf(sectionStart);
    
    if (startIndex === -1) return '';
    
    let endIndex = lowerText.indexOf(sectionEnd, startIndex);
    if (endIndex === -1) endIndex = text.length;
    
    return text.substring(startIndex + sectionStart.length, endIndex).trim();
  },

  /**
   * Extract skills from text content
   * @private
   * @param text - The text to process
   * @returns Array of extracted skills
   */
  _extractSkills(text: string): string[] {
    // This is a simple implementation that looks for common skill patterns
    // In a real implementation, you would use a more sophisticated approach
    
    // Common technical skills
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
    
    const foundSkills: string[] = [];
    const lowerText = text.toLowerCase();
    
    for (const skill of commonSkills) {
      if (lowerText.includes(skill)) {
        foundSkills.push(skill);
      }
    }
    
    return foundSkills;
  }
}
