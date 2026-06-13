import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Loader2, Bot, User, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string;

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "system",
      content: "You are Grandma's Herbals Wellness Assistant, an expert in organic herbal remedies, holistic wellness protocols, and concierge wellness care. You help users understand their options, explain the difference between our personalized formula memberships, and offer educational information on natural herbs. Remember to mention that your suggestions are for educational purposes, do not replace medical advice, and have not been evaluated by the FDA. Keep your responses warm, professional, encouraging, and concise."
    },
    {
      role: "assistant",
      content: "Welcome to Grandma's Herbals! 🌿 I'm your Wellness Assistant. How can I help guide your holistic health journey today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessageContent = input.trim();
    setInput("");

    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: userMessageContent }
    ];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Grandma's Herbals",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct:free",
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content
          })),
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
          content: "I apologize, but I am unable to connect to the wellness network right now. Please check back in a few moments or visit our consultation page for direct assistance."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-16 w-16 rounded-full bg-gradient-to-br from-olive-600 to-olive-700 hover:from-olive-700 hover:to-olive-800 shadow-2xl hover:shadow-olive-600/50 transition-all duration-300 hover:scale-110"
            >
              <MessageCircle className="h-7 w-7 text-white" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-amber-500 items-center justify-center text-[10px] font-bold text-white">
                  ?
                </span>
              </span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.3 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? "auto" : "600px"
            }}
            exit={{ opacity: 0, y: 100, scale: 0.3 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col rounded-[2rem] border border-olive-200/60 bg-white/95 backdrop-blur-xl shadow-2xl w-[380px] max-w-[calc(100vw-3rem)] overflow-hidden"
            style={{ maxHeight: isMinimized ? "auto" : "600px" }}
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-olive-600 to-olive-750 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                  <Bot className="w-5 h-5 text-amber-200" />
                </div>
                <div>
                  <h3 className="font-cormorant text-lg font-bold text-white flex items-center gap-2">
                    Wellness Assistant
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  </h3>
                  <p className="text-[10px] text-olive-100/90 font-medium">Online • Instant Response</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/80 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
                  aria-label="Minimize"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50 min-h-[400px] max-h-[450px]">
                  {messages
                    .filter((m) => m.role !== "system")
                    .map((message, index) => {
                      const isUser = message.role === "user";
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                        >
                          {/* Avatar */}
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isUser
                                ? "bg-amber-100 text-amber-800"
                                : "bg-olive-100 text-olive-650"
                            }`}
                          >
                            {isUser ? (
                              <User className="w-3.5 h-3.5" />
                            ) : (
                              <Bot className="w-3.5 h-3.5" />
                            )}
                          </div>

                          {/* Bubble */}
                          <div
                            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed max-w-[75%] ${
                              isUser
                                ? "bg-gradient-to-br from-olive-600 to-olive-700 text-white rounded-tr-md"
                                : "bg-white border border-stone-200/70 text-stone-800 rounded-tl-md shadow-sm"
                            }`}
                          >
                            {message.content.split("\n").map((line, i) => (
                              <p key={i} className={i > 0 ? "mt-2" : ""}>
                                {line}
                              </p>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}

                  {/* Loading Indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2"
                    >
                      <div className="w-8 h-8 rounded-lg bg-olive-100 text-olive-600 flex items-center justify-center shrink-0">
                        <Bot className="w-3.5 h-3.5 animate-bounce" />
                      </div>
                      <div className="bg-white border border-stone-200/70 rounded-2xl rounded-tl-md px-4 py-3 text-sm text-stone-500 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-olive-600" />
                        <span>Thinking...</span>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <div className="p-3 bg-white border-t border-olive-100 flex gap-2 items-center">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about our herbal formulas..."
                    disabled={isLoading}
                    className="rounded-full bg-stone-50/80 border-stone-200 focus-visible:ring-olive-500 py-5 px-4 text-sm flex-1 placeholder:text-stone-400"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="rounded-full bg-olive-600 hover:bg-olive-700 text-white p-3 h-10 w-10 shrink-0 flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
