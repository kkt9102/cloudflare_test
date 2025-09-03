"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    // const res = await fetch("http://localhost:3005/auth/login", {
    const res = await fetch("https://ktkim9102.com:3307/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: loginId, password: loginPw }),
    });

    console.log("res", res);
    if (!res.ok) {
      alert("로그인 실패");
      return;
    }
    alert("로그인 성공");

    const data = await res.json();
    if (data.user.uuid) {
      localStorage.setItem("user_uuid", data.user.uuid);
      router.push("/");
    } else {
      console.error("UUID not found in login response");
      alert("로그인에 성공했지만 UUID를 받지 못했습니다.");
    }
  };
  return (
    <>
      <div>테스트</div>
      <input
        type="text"
        value={loginId}
        onChange={(e) => setLoginId(e.target.value)}
      />
      <input
        type="password"
        value={loginPw}
        onChange={(e) => setLoginPw(e.target.value)}
      />

      <div onClick={() => handleLogin()}>로그인</div>
    </>
  );
}
