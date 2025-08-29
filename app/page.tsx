// import Image from "next/image";
// import Link from "next/link";
// import styles from "./page.module.css";

// export default function Home() {
//   return (
//     <div className={styles.page}>
//       <div>사이트명은 뭘로해야하죠</div>
//       <div>
//         <a
//           href={`https://notion.so/2584ec1ca6d080509599d0542bc2d48f?source=copy_link`}
//           target="_blank"
//         >
//           프로젝트 노션 바로가기
//         </a>
//       </div>
//       <div></div>
//       <Link href={"/testguide"}>테스트가이드</Link>
//     </div>
//   );
// }
// app/page.tsx 또는 다른 클라이언트 컴포넌트 파일
// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createServerClient } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const supabase = createServerClient();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessageContent, setNewMessageContent] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();

  // 사용자 세션 및 메시지 구독
  useEffect(() => {
    // 1. 사용자 세션 확인
    const getSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    // 2. 초기 메시지 가져오기
    const fetchInitialMessages = async () => {
      const { data } = await supabase
        .from("message")
        .select("*")
        .order("created_at", { ascending: true });
      if (data) {
        setMessages(data);
      }
    };

    // 3. 실시간 메시지 구독
    const subscribeToNewMessages = () => {
      const channel = supabase.channel("chat_room_1");
      channel
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "message" },
          (payload) => {
            setMessages((currentMessages) => [...currentMessages, payload.new]);
          }
        )
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    };

    getSession();
    fetchInitialMessages();
    subscribeToNewMessages();
  }, []);

  // 메시지 전송 함수
  const handleSendMessage = async () => {
    if (newMessageContent.trim() === "" || !user) {
      alert("로그인 후 메시지를 보낼 수 있습니다.");
      return;
    }

    const { error } = await supabase
      .from("message")
      .insert({ content: newMessageContent, uuid_id: user.id }); // 로그인한 사용자의 UUID가 자동으로 포함됩니다.

    if (error) {
      console.error("메시지 전송 실패:", error);
    } else {
      setNewMessageContent("");
    }
  };

  // 로그아웃 함수
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div>
      {/* 로그인/로그아웃 버튼 */}
      {user ? (
        <>
          <p>로그인 사용자: {user.email}</p>
          <button onClick={handleLogout}>로그아웃</button>
        </>
      ) : (
        <button onClick={() => router.push("/login")}>로그인</button>
      )}

      <h1>실시간 채팅방</h1>
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.uuid_id}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newMessageContent}
          onChange={(e) => setNewMessageContent(e.target.value)}
          placeholder={user ? "메시지를 입력하세요..." : "로그인이 필요합니다."}
          disabled={!user}
        />
        <button onClick={handleSendMessage} disabled={!user}>
          전송
        </button>
      </div>
    </div>
  );
}
