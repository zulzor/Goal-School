import { supabase } from './src/config/supabase';

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');

  try {
    // Test connection by fetching news
    const { data, error } = await supabase.from('news').select('*').limit(5);

    if (error) {
      console.error('Error fetching news:', error);
      return;
    }

    console.log('News data:', data);
    console.log('Number of news items:', data?.length || 0);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testSupabaseConnection();
