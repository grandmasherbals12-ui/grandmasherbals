import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Bot, User, Sparkles } from "lucide-react";

export const Route = createFileRoute("/chatbot")({
  head: () => ({
    meta: [
      { title: "Wellness Assistant Chatbot — Grandma's Herbals" },
      {
        name: "description",
        content: "Interact with our AI Wellness Assistant powered by OpenRouter for advice on organic compounds, wellness protocols, and herbology.",
      },
    ],
  }),
  component: ChatbotPage,
});

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string;

function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "system",
      content: "You are Grandma's Herbals Wellness Assistant, an expert in organic herbal remedies, holistic wellness protocols, and concierge wellness care. You help users understand their options, explain the difference between our personalized formula memberships, and offer educational information on natural herbs. Remember to mention that your suggestions are for educational purposes, do not replace medical advice, and have not been evaluated by the FDA. Keep your responses warm, professional, encouraging, and concise."
    },
    {
      role: "assistant",
      content: "Welcome to Grandma's Herbals! I am your Wellness Assistant. How can I help guide your holistic health journey today? Ask me about our customized organic formulas, concierge consultations, or natural ingredients."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessageContent = input.trim();
    setInput("");

    // Add user message to state
    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: userMessageContent }
    ];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Call OpenRouter completions endpoint
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://grandmasherbals.com",
          "X-Title": "Grandma's Herbals",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct:free",
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content
          })),
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const botResponse = data.choices?.[0]?.message?.content || "I'm sorry, I encountered an issue processing that. Please try again.";

      setMessages((current) => [
        ...current,
        { role: "assistant", content: botResponse }
      ]);
    } catch (error) {
      console.error("Chatbot API Error:", error);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "I apologize, but I am unable to connect to the wellness network right now. Please ensure your network is connected, or check back in a few moments."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <SiteLayout>
      <section className="min-h-[90vh] bg-gradient-to-b from-olive-100/30 via-stone-50 to-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl flex flex-col h-[700px] rounded-[2.5rem] border border-olive-200/60 bg-white/80 backdrop-blur-md shadow-xl overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-olive-600 to-olive-750 px-6 py-5 md:px-8 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                  <Bot className="w-6 h-6 text-amber-200" />
                </div>
                <div>
                  <h1 className="font-cormorant text-xl md:text-2xl font-bold tracking-wide flex items-center gap-2">
                    Wellness Assistant
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  </h1>
                  <p className="text-xs text-olive-100/90 font-medium">Holistic Support & Guidance</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 text-amber-200 font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> AI Consult
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-stone-50/50">
              {messages
                .filter((m) => m.role !== "system")
                .map((message, index) => {
                  const isUser = message.role === "user";
                  return (
                    <div
                      key={index}
                      className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                        } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${isUser
                          ? "bg-amber-100 border-amber-200 text-amber-800"
                          : "bg-olive-100 border-olive-200 text-olive-650"
                          }`}
                      >
                        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`rounded-[1.5rem] px-5 py-3.5 text-sm leading-relaxed shadow-sm ${isUser
                          ? "bg-gradient-to-br from-olive-600 to-olive-700 text-white rounded-tr-none font-medium"
                          : "bg-white border border-stone-200/70 text-stone-800 rounded-tl-none"
                          }`}
                      >
                        {message.content.split("\n").map((line, i) => (
                          <p key={i} className={i > 0 ? "mt-2" : ""}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-3 max-w-[80%] mr-auto animate-pulse">
                  <div className="w-9 h-9 rounded-xl bg-olive-100 border border-olive-200 text-olive-600 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="bg-white border border-stone-200/70 rounded-[1.5rem] rounded-tl-none px-5 py-4 text-sm text-stone-500 shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-olive-600" />
                    <span>Formulating guidance...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 md:p-6 bg-white border-t border-olive-100 flex gap-3 items-center">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about concierge formulas, scheduled follow-ups, or organic ingredients..."
                disabled={isLoading}
                className="rounded-full bg-stone-50/80 border-stone-200 focus-visible:ring-olive-500 py-6 px-6 text-sm flex-1 placeholder:text-stone-400"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="rounded-full bg-olive-600 hover:bg-olive-700 text-white p-6 shadow-md transition-all hover:scale-105 shrink-0 flex items-center justify-center aspect-square"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
