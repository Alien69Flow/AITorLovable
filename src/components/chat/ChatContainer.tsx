import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { AI_MODELS } from "@/lib/ai-models";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { EmptyState } from "./EmptyState";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SpaceBackground } from "@/components/SpaceBackground";

export function ChatContainer() {
  const [selectedModel, setSelectedModel] = useState("google/gemini-2.5-flash");
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentModel = AI_MODELS.find(m => m.id === selectedModel);
  const supportsVision = currentModel?.supportsVision ?? false;

  const handleSend = (content: string, imageData?: string) => {
    sendMessage(content, selectedModel, imageData);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <SpaceBackground />
      <div className="flex h-screen flex-col bg-transparent relative z-10">
      <ChatHeader
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        onClear={clearChat}
        hasMessages={messages.length > 0}
      />
      
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="mx-auto max-w-3xl px-4">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-3 py-4">
              <div className="bg-muted rounded-lg px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  <span>Pensando...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="mx-auto w-full max-w-3xl">
        <ChatInput
          onSend={handleSend}
          isLoading={isLoading}
          supportsVision={supportsVision}
        />
      </div>
      </div>
    </>
  );
}
