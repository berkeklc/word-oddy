
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tfjcyzsryigjzrbazgxu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmamN5enNyeWlnanpyYmF6Z3h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDkwOTUsImV4cCI6MjA3OTIyNTA5NX0.AJ6RVT1f_5KUBwaNvDUohxN7Tss8itoml4hiOrhAt-U';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    console.log('Testing Leaderboard fetch with Anon Key...');
    const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .limit(5);

    if (error) {
        console.error('Error fetching leaderboard:', error);
    } else {
        console.log('Success! Data received:', data);
        if (data.length === 0) {
            console.log('Warning: Data is empty.');
        }
    }
}

test();
