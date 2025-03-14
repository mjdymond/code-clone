-- Create a function to execute raw SQL queries (for debugging purposes only)
CREATE OR REPLACE FUNCTION public.execute_sql(sql_query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  row_data RECORD;
  json_result JSONB := '[]'::JSONB;
  i INTEGER := 0;
BEGIN
  -- Check if the query is a SELECT or returning query
  IF position('RETURNING' in upper(sql_query)) > 0 OR position('SELECT' in upper(sql_query)) > 0 THEN
    -- For queries that return rows
    FOR row_data IN EXECUTE sql_query LOOP
      json_result := json_result || jsonb_build_object(
        'index', i,
        'data', to_jsonb(row_data)
      );
      i := i + 1;
    END LOOP;
    
    -- If we have results, extract just the data array
    IF jsonb_array_length(json_result) > 0 THEN
      -- Create a new array with just the data objects
      result := '[]'::JSONB;
      FOR i IN 0..jsonb_array_length(json_result)-1 LOOP
        result := result || jsonb_extract_path(jsonb_extract_path(json_result, i::text), 'data');
      END LOOP;
    ELSE
      result := '[]'::JSONB;
    END IF;
  ELSE
    -- For non-returning queries, execute and return success message
    EXECUTE sql_query;
    result := jsonb_build_object('success', true, 'message', 'Query executed successfully');
  END IF;
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'error', SQLERRM,
    'detail', SQLSTATE,
    'context', format('Error executing query: %s', sql_query)
  );
END;
$$;
