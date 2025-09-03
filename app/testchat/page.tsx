"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface Message {
  uuid_id: string;
  content: string;
  created_at: string;
  user_uuid: string;
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userUuid, setUserUuid] = useState<string | null>(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 localStorage에서 UUID를 가져옵니다.
    const storedUuid = localStorage.getItem("user_uuid");
    setUserUuid(storedUuid);

    // 초기 메시지를 가져옵니다.
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase.from("message").select("*");
    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data as Message[]);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userUuid) {
      alert("메시지를 입력해주세요 또는 로그인 상태를 확인해주세요.");
      return;
    }

    const { error } = await supabase.from("message").insert([
      {
        content: newMessage,
        user_uuid: "980be7f9-d7c1-4701-8225-5edaf529dbc5",
      },
    ]);

    if (error) {
      console.error("Error sending message:", error);
      alert("메시지 전송에 실패했습니다.");
    } else {
      setNewMessage("");
      // 메시지 목록을 다시 불러옵니다.
      await fetchMessages();
    }
  };

  return (
    <div>
      <h1>Messages</h1>
      <ul>
        {messages?.map((message, index) => (
          <li key={`${message.uuid_id}-${index}`}>
            <b>{message.user_uuid?.substring(0, 8)}:</b> {message.content} |{" "}
            {new Date(message.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
      <hr />
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}
