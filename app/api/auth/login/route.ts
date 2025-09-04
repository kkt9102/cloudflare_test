export const runtime = "edge";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, password } = body;
    const baseUrl = process.env.NODE_ENV
      ? "http://localhost:3005/auth/login"
      : "https://ktkim9102.com:3307/auth/login";

    const res = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, password }),
    });

    if (!res.ok) {
      // 백엔드에서 받은 에러 응답을 그대로 전달합니다.
      const errorData = await res.text();
      console.error("Backend Error:", errorData);
      return new NextResponse(errorData, {
        status: res.status,
        statusText: res.statusText,
      });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in API route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
