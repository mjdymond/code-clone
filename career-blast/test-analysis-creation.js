// Test script to verify analysis creation using the execute_sql function
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
const supabase = createClient(supabaseUrl, supabaseKey);

// Test data
const testData = {
  resumeId: '8ddfdf90-cbb0-4828-a0af-d31981b610b1',
  jobId: 'a46cd7d3-8932-4ad0-ac83-fe22bf23d9af',
  userId: 'bb35a6e3-c0f3-4268-abf2-adc82bd900f3'
};

async function testAnalysisCreation() {
  console.log('Starting analysis creation test...');
  console.log('Test data:', testData);
  
  try {
    // Method 1: Using direct SQL query via execute_sql function
    console.log('\nMethod 1: Using execute_sql function');
    const sqlQuery = `
      WITH inserted_analysis AS (
        INSERT INTO analyses (resume_id, job_id, user_id, status, created_at, updated_at)
        VALUES ('${testData.resumeId}', '${testData.jobId}', '${testData.userId}', 'pending', NOW(), NOW())
        RETURNING *
      )
      SELECT 
        id, 
        resume_id, 
        job_id, 
        user_id, 
        status, 
        created_at, 
        updated_at 
      FROM inserted_analysis;
    `;
    
    const { data: sqlResult, error: sqlError } = await supabase.rpc('execute_sql', { sql_query: sqlQuery });
    
    if (sqlError) {
      console.error('SQL execution error:', sqlError);
    } else {
      console.log('SQL execution successful:', sqlResult);
    }
    
    // Method 2: Using direct insert
    console.log('\nMethod 2: Using direct insert');
    const { data: insertResult, error: insertError } = await supabase
      .from('analyses')
      .insert({
        resume_id: testData.resumeId,
        job_id: testData.jobId,
        user_id: testData.userId,
        status: 'pending'
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Direct insert error:', insertError);
    } else {
      console.log('Direct insert successful:', insertResult);
    }
    
    console.log('\nTest completed!');
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the test
testAnalysisCreation();
