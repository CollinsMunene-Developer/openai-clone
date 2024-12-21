import { ChatLayout } from "@/components/chat-layout"
export default function Home() {
  return (
    <ChatLayout>
      {/* Chat content will go here */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <h1 className="text-2xl font-bold">Welcome to ChatGPT Clone</h1>
          <p className="mt-4">Start a conversation to begin chatting!</p>
        </div>
      </div>
    </ChatLayout>
  )
}

