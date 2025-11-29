import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Add to your existing supabase.ts file
// In your supabase.ts file - REPLACE the current checkEmailAvailability function with this:
// Updated checkEmailAvailability function
// Simple direct approach
export const checkEmailAvailability = async (email: string): Promise<boolean> => {
  try {
    console.log('Checking email availability for:', email.toLowerCase());
    
    // Use the admin API (if you have access) or try a different approach
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase());

    console.log('Direct query result - Data:', data, 'Error:', error);

    // If we get any data array with items, email exists
    if (data && data.length > 0) {
      console.log('EMAIL EXISTS - Found', data.length, 'records');
      return false;
    }

    // If we get empty array, email doesn't exist
    if (data && data.length === 0) {
      console.log('EMAIL AVAILABLE - No records found');
      return true;
    }

    // If there's an error, log it but assume available
    if (error) {
      console.log('QUERY ERROR:', error);
      console.log('Assuming email available due to query error');
      return true;
    }

    console.log('Unexpected state, assuming available');
    return true;
  } catch (error) {
    console.error('CATCH ERROR:', error);
    return true;
  }
};
export default {};