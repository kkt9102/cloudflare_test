import { createServerClient } from "../../lib/supabase"; // 서버용 클라이언트 임포트

export default async function Page() {
  const supabase = createServerClient();
  const { data: messages, error } = await supabase.from("message").select("*");

  if (error) {
    console.error("Error fetching messages:", error);
  }

  console.log("Messages:", messages);
  return (
    <div>
      <h1>Messages (From Server Component)</h1>
      <ul>
        {messages?.map((message) => (
          <li key={message.uuid_id}>{message.content}</li>
        ))}
      </ul>
    </div>
  );
}
