import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://uxiwbbdhmdndeupsjqum.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4aXdiYmRobWRuZGV1cHNqcXVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMDM0NDQsImV4cCI6MjA5NTU3OTQ0NH0.3st0bakHor5XOI9alc6XyMzyXhd-zqkWRynDFbyMGSs"
);