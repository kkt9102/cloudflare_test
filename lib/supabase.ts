// lib/supabase.server.ts (예시)
import { createClient } from "@supabase/supabase-js";
// import { cookies } from "next/headers";

// 서버 컴포넌트에서 사용될 Supabase 클라이언트
// 서버 컴포넌트는 next/headers의 cookies()를 사용하여
// 서버에서만 접근 가능한 요청 헤더를 가져올 수 있습니다.
export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: "pkce",
    },
  });
};
