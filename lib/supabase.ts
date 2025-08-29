// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or anonymous key not found.");
}

// 클라이언트 컴포넌트용 클라이언트 인스턴스를 생성하여 export합니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
