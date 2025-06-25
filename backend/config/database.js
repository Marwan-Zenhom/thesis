import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Ensure main user exists
export const ensureMainUser = async () => {
  const FIXED_USER_ID = process.env.FIXED_USER_ID || '550e8400-e29b-41d4-a716-446655440000';
  
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', FIXED_USER_ID)
      .single();

    if (!existingUser) {
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          id: FIXED_USER_ID,
          name: 'Main User',
          email: 'user@onboarding-chat.local'
        }]);

      if (userError) {
        console.error('Failed to create main user:', userError);
      } else {
        console.log('✅ Main user created for database');
      }
    }
  } catch (err) {
    console.error('User setup error:', err);
  }
}; 