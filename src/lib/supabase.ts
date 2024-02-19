import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.SUPABASE_URL ?? "https://feiallwwiviuhpwluked.supabase.co/",
  process.env.ANON_KEY ??
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlaWFsbHd3aXZpdWhwd2x1a2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUwOTYyNDEsImV4cCI6MjAyMDY3MjI0MX0.F6zw9zG_ZpWrA0699uEP4YN7YKagsQsz3h17f0iuIhs",
  {
    global: {
      headers: {
        apiKey:
          process.env.ANON_KEY ??
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlaWFsbHd3aXZpdWhwd2x1a2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUwOTYyNDEsImV4cCI6MjAyMDY3MjI0MX0.F6zw9zG_ZpWrA0699uEP4YN7YKagsQsz3h17f0iuIhs",
      },
    },
  },
)
