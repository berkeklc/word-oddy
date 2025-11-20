import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tfjcyzsryigjzrbazgxu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmamN5enNyeWlnanpyYmF6Z3h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDkwOTUsImV4cCI6MjA3OTIyNTA5NX0.AJ6RVT1f_5KUBwaNvDUohxN7Tss8itoml4hiOrhAt-U'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
