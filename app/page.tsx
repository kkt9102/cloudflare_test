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
export const runtime = "edge";
("use client"); // <-- 이 지시어를 반드시 추가해야 합니다.

import { useState, useEffect } from "react";
import { createServerClient } from "../lib/supabase";

export default function ChatPage() {
  const supabase = createServerClient();
  // 메시지 목록을 저장할 상태
  const [messages, setMessages] = useState<any[]>([]);
  // 메시지 입력 상태
  const [newMessageContent, setNewMessageContent] = useState("");

  // 1. 초기 메시지 불러오기 및 실시간 구독 설정
  useEffect(() => {
    // DB에서 기존 메시지 목록을 가져오는 비동기 함수
    const fetchInitialMessages = async () => {
      const { data } = await supabase
        .from("message")
        .select("*")
        .order("created_at", { ascending: true });
      if (data) {
        setMessages(data);
      }
    };

    // 실시간으로 새로운 메시지를 구독하는 함수
    const subscribeToNewMessages = () => {
      const channel = supabase.channel("chat_room_1"); // 채널 이름을 고유하게 설정
      channel
        .on(
          "postgres_changes", // 데이터베이스 변경 이벤트 감지
          {
            event: "INSERT", // 'message' 테이블에 새로운 행이 추가될 때만
            schema: "public",
            table: "message",
          },
          (payload) => {
            // 새로운 메시지가 추가되면 실행될 콜백 함수
            // payload.new에 새 메시지 데이터가 들어있음
            setMessages((currentMessages) => [...currentMessages, payload.new]);
          }
        )
        .subscribe();

      return () => {
        // 컴포넌트 언마운트 시 구독 해제
        supabase.removeChannel(channel);
      };
    };

    fetchInitialMessages();
    subscribeToNewMessages();
  }, []); // 의존성 배열이 비어 있어 컴포넌트가 처음 렌더링될 때만 실행됩니다.

  // 2. 메시지를 전송하는 함수
  const handleSendMessage = async () => {
    if (newMessageContent.trim() === "") return;

    // Supabase DB에 새 메시지 추가
    const { error } = await supabase.from("message").insert({
      content: newMessageContent,
      uuid_id: "980be7f9-d7c1-4701-8225-5edaf529dbc5",
    }); // uuid_id에 실제 유저 ID를 넣어야 함

    if (error) {
      console.error("메시지 전송 실패:", error);
    } else {
      setNewMessageContent(""); // 입력창 비우기
    }
  };

  return (
    <div>
      <h1>실시간 채팅방</h1>
      <div>
        {/* 메시지 목록 렌더링 */}
        {messages.map((msg) => (
          <div key={msg.id || msg.uuid_id}>{msg.content}</div>
        ))}
      </div>
      <div>
        {/* 메시지 입력 폼 */}
        <input
          type="text"
          value={newMessageContent}
          onChange={(e) => setNewMessageContent(e.target.value)}
        />
        <button onClick={handleSendMessage}>전송</button>
      </div>
    </div>
  );
}
