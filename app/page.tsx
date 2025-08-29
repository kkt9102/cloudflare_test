"use client";

export const runtime = "edge";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; // <-- 클라이언트용 supabase 인스턴스 임포트

// 메시지 객체에 대한 타입을 정의합니다.
interface Message {
  id: string; // 또는 number, bigint 등 실제 타입에 맞게
  content: string;
  uuid_id: string;
  created_at: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageContent, setNewMessageContent] = useState("");

  useEffect(() => {
    // 1. 초기 메시지 불러오기
    const fetchInitialMessages = async () => {
      const { data } = await supabase
        .from("message")
        .select("*")
        .order("created_at", { ascending: true });
      if (data) {
        setMessages(data as Message[]);
      }
    };

    // 2. 실시간으로 새로운 메시지 구독
    const subscribeToNewMessages = () => {
      const channel = supabase.channel("chat_room_1");
      channel
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "message",
          },
          (payload) => {
            setMessages((currentMessages) => [
              ...currentMessages,
              payload.new as Message,
            ]);
          }
        )
        .subscribe();

      // 컴포넌트가 언마운트될 때 구독 해제
      return () => {
        supabase.removeChannel(channel);
      };
    };

    fetchInitialMessages();
    subscribeToNewMessages();
  }, []); // 빈 의존성 배열로, 컴포넌트가 처음 렌더링될 때만 실행됩니다.

  const handleSendMessage = async () => {
    if (newMessageContent.trim() === "") return;

    // UUID를 하드코딩된 테스트 값으로 설정
    const testUuid = "980be7f9-d7c1-4701-8225-5edaf529dbc5";

    const { error } = await supabase.from("message").insert({
      content: newMessageContent,
      uuid_id: testUuid,
    });

    if (error) {
      console.error("메시지 전송 실패:", error);
    } else {
      setNewMessageContent("");
    }
  };

  return (
    <div>
      <h1>테스트 채팅방</h1>
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
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={handleSendMessage}>전송</button>
      </div>
    </div>
  );
}

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
