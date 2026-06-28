"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, User, Upload, Send, Sparkles } from "lucide-react";

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! I'm your AI Pipeline Advisor. You can upload your resume or ask me anything about your job search." }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isBotLoading, setIsBotLoading] = useState(false);
  const [parsedDataCache, setParsedDataCache] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsParsing(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });
      const resPayload = await res.json();

      if (resPayload.data) {
        setParsedDataCache(resPayload.data);
        setMessages((prev) => [
          ...prev,
          { role: "user", content: "I uploaded my resume. Can you analyze it?" },
          { role: "bot", content: `Resume parsed successfully! Here are the key details I extracted:\n\n${resPayload.data}` }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleChatSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isBotLoading) return;

    const currentMsg = { role: "user", content: inputValue };
    const chatHistory = [...messages, currentMsg];
    
    setMessages(chatHistory);
    setInputValue("");
    setIsBotLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          extractedContext: parsedDataCache,
        }),
      });
      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBotLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Advisor</h1>
            <p className="text-sm text-slate-400 font-medium">Get AI-powered insights and recommendations for your job search.</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={() => { setMessages([messages[0]]); setParsedDataCache(""); }}
          className="text-xs font-semibold text-slate-600 border-slate-200 hover:bg-slate-50 px-4 h-9 rounded-lg"
        >
          + New Chat
        </Button>
      </div>

      <div className="border border-slate-200 rounded-2xl bg-white shadow-xs h-[560px] flex flex-col overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/20">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center border text-xs shrink-0 shadow-xs font-bold ${
                msg.role === "user" ? "bg-slate-100 border-slate-200 text-slate-700" : "bg-purple-50 border-purple-100 text-purple-600"
              }`}>
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`p-4 rounded-xl border text-xs leading-relaxed whitespace-pre-wrap ${
                msg.role === "user" ? "bg-slate-100 border-slate-200 text-slate-800" : "bg-purple-50/50 border-purple-100/50 text-slate-800"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isBotLoading && (
            <div className="text-xs text-slate-400 animate-pulse font-medium">
              Advisor is processing matches...
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white flex flex-col gap-3">
          <form onSubmit={handleChatSubmit} className="flex gap-3 items-center">
            <label className="flex items-center justify-center gap-2 border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs h-10 px-4 rounded-xl cursor-pointer shrink-0 transition-colors shadow-xs">
              <Upload className="h-4 w-4" />
              {isParsing ? "Parsing..." : "Upload PDF"}
              <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={isParsing || isBotLoading} />
            </label>

            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Upload your resume or ask a question about your pipeline strategy..."
              className="text-xs h-10 bg-white border-slate-200 focus-visible:ring-purple-500 rounded-xl"
              disabled={isBotLoading || isParsing}
            />

            <Button 
              type="submit" 
              disabled={isBotLoading || !inputValue.trim()} 
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-10 w-10 flex items-center justify-center shrink-0 shadow-sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}