import * as React from "react"
import { useGeminiStream } from "@/hooks/use-gemini-stream"
import { useCreateGeminiConversation } from "@workspace/api-client-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Send, Loader2 } from "lucide-react"

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "pt", label: "Português" },
  { value: "zh", label: "中文" },
  { value: "ar", label: "العربية" }
]

export function AiChatWidget({ persona }: { persona: "fan" | "operations" | "volunteer" }) {
  const { messages, sendMessage, isStreaming } = useGeminiStream()
  const createConversation = useCreateGeminiConversation()
  
  const [input, setInput] = React.useState("")
  const [language, setLanguage] = React.useState("en")
  const [conversationId, setConversationId] = React.useState<number | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    // Initialize a new conversation when the widget mounts
    createConversation.mutateAsync({ data: { title: `${persona} session` } })
      .then(res => setConversationId(res.id))
      .catch(err => console.error("Failed to init conversation:", err))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming || !conversationId) return
    sendMessage(conversationId, input, persona, language)
    setInput("")
  }

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden" role="dialog" aria-label="StadiumIQ Assistant Chat">
      <div className="p-4 border-b border-border bg-secondary/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">StadiumIQ Assistant</h3>
            <p className="text-xs text-muted-foreground">Always active</p>
          </div>
        </div>
        {persona === "fan" && (
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[120px] h-8 text-xs bg-background/50" aria-label="Select language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map(lang => (
                <SelectItem key={lang.value} value={lang.value} className="text-xs">
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <ScrollArea className="flex-1 p-4" aria-live="polite">
        <div className="space-y-4 pr-4">
          {messages.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground p-8 flex flex-col items-center gap-3">
              <Bot className="w-10 h-10 opacity-20" />
              <p>How can I help you navigate the stadium today?</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-primary/20 text-primary border border-primary/20'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-3 rounded-lg text-sm max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-secondary text-secondary-foreground rounded-tr-none' 
                    : 'bg-muted text-foreground rounded-tl-none border border-border/50'
                }`}>
                  {msg.isStreaming && !msg.content ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-3 bg-secondary/10 border-t border-border">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask StadiumIQ..."
            className="bg-background"
            disabled={isStreaming || !conversationId}
            aria-label="Chat input"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isStreaming || !conversationId} aria-label="Send message">
            <Send className="w-4 h-4" aria-hidden="true" />
          </Button>
        </form>
      </div>
    </div>
  )
}
