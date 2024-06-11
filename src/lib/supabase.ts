import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? "https://feiallwwiviuhpwluked.supabase.co/",
  import.meta.env.VITE_ANON_KEY ??
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlaWFsbHd3aXZpdWhwd2x1a2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUwOTYyNDEsImV4cCI6MjAyMDY3MjI0MX0.F6zw9zG_ZpWrA0699uEP4YN7YKagsQsz3h17f0iuIhs",
  {
    global: {
      headers: {
        apiKey:
          import.meta.env.VITE_ANON_KEY ??
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlaWFsbHd3aXZpdWhwd2x1a2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUwOTYyNDEsImV4cCI6MjAyMDY3MjI0MX0.F6zw9zG_ZpWrA0699uEP4YN7YKagsQsz3h17f0iuIhs",
      },
    },
  },
)
