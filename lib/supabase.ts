// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://hjvoutpgcveoxwoextvq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqdm91dHBnY3Zlb3h3b2V4dHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNTU3NDYsImV4cCI6MjA2NTYzMTc0Nn0.5YZ-CC9px2wq4cXtjT014SxIZe16zhYx6pPEZb0RH7o";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
