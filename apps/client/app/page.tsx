"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:4000/events/sse");

    eventSource.onopen = () => {
      setIsConnected(true);
      console.log("SSE 연결됨");
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, `${data.message} - ${data.timestamp}`]);
    };

    eventSource.onerror = (error) => {
      console.error("SSE 에러:", error);
      setIsConnected(false);
      eventSource.close();
    };

    return () => {
      console.log("SSE 연결 종료");
      eventSource.close();
      setIsConnected(false);
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">SSE 테스트</h1>
      <div className="mb-4">
        <span
          className={`inline-block px-2 py-1 rounded ${
            isConnected ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {isConnected ? "연결됨" : "연결 끊김"}
        </span>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto border rounded p-4">
        {messages.map((message, index) => (
          <div key={index} className="p-2 bg-gray-100 rounded shadow">
            {message}
          </div>
        ))}
      </div>
    </div>
  );
}
