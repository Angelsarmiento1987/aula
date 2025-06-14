


import { createClient } from '@supabase/supabase-js';

// Tus claves de Supabase (del dashboard)
const supabaseUrl = 'https://sdxrovwbtdimsiwwmhvh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkeHJvdndidGRpbXNpd3dtaHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NDkwMjgsImV4cCI6MjA2NTQyNTAyOH0.5Y-vwLGxiQWB-FXAmOSnnicgzP2Jhx9Em0OBsxZkXOM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
