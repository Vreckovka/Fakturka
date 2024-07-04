import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = () => {
    return createServerClient(
        "https://yyjneoulqyevtjwdxzhs.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5am5lb3VscXlldnRqd2R4emhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkzODc2NzAsImV4cCI6MjAyNDk2MzY3MH0.CMarkh6kdnhcEOl6G913LaIRR5z1GpvZpoY1_p3R9pg",
        {
            cookies: {
            },
        },
    );
};