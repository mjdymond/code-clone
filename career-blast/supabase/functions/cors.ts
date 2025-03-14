// CORS configuration for Supabase Edge Functions
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // In production, replace with your specific domain
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info',
  'Access-Control-Max-Age': '86400',
};

// Helper function to handle CORS preflight requests
export function handleCors(req: Request): Response | null {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204, // No content needed for OPTIONS response
      headers: corsHeaders,
    });
  }
  
  // For other requests, return null to continue processing
  return null;
}
