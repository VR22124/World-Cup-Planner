import { useState, useCallback, useRef } from "react";
import { AssistResponse } from "@workspace/api-client-react";

export interface StreamMessage {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  suggestions?: string[];
  urgency?: "normal" | "elevated" | "urgent";
  relatedZones?: string[];
}

export function useGeminiStream() {
  const [messages, setMessages] = useState<StreamMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (
    conversationId: number,
    query: string,
    persona: "fan" | "operations" | "volunteer",
    language?: string
  ) => {
    if (!query.trim()) return;

    // Add user message
    const userMessage: StreamMessage = { role: "user", content: query };
    setMessages(prev => [...prev, userMessage]);
    
    // Add empty assistant message to stream into
    const assistantMessageIdx = messages.length + 1;
    setMessages(prev => [...prev, { role: "assistant", content: "", isStreaming: true }]);
    
    setIsStreaming(true);
    abortControllerRef.current = new AbortController();

    try {
      const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
      const response = await fetch(`${BASE}/api/gemini/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: query, persona, language }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to stream response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullContent = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.done) {
                  // Sometimes done payload comes with suggestions/urgency if we want to model that
                  setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[assistantMessageIdx] = {
                      ...newMessages[assistantMessageIdx],
                      isStreaming: false
                    };
                    return newMessages;
                  });
                  done = true;
                  break;
                } else if (data.content) {
                  fullContent += data.content;
                  setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[assistantMessageIdx] = {
                      ...newMessages[assistantMessageIdx],
                      content: fullContent
                    };
                    return newMessages;
                  });
                }
              } catch (e) {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[assistantMessageIdx] = {
          role: "assistant",
          content: "Sorry, I encountered an error connecting to StadiumIQ AI. Please try again.",
          isStreaming: false,
          urgency: "elevated"
        };
        return newMessages;
      });
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [messages.length]);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      setMessages(prev => {
        if (prev.length > 0 && prev[prev.length - 1].role === "assistant") {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].isStreaming = false;
          return newMessages;
        }
        return prev;
      });
    }
  }, []);

  return { messages, sendMessage, isStreaming, stopStreaming };
}
