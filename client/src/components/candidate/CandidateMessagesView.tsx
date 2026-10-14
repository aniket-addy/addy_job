"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  Building2,
  CheckCircle2,
  Clock,
  User,
  Paperclip,
  MoreVertical,
  ExternalLink,
} from "lucide-react";

export interface ChatMessage {
  id: string;
  sender: "candidate" | "recruiter";
  senderName: string;
  time: string;
  text: string;
}

export interface ConversationThread {
  id: string;
  companyName: string;
  companyId?: string;
  role?: string;
  lastActive?: string;
  unread?: boolean;
  messages: ChatMessage[];
}

interface CandidateMessagesViewProps {
  threads: ConversationThread[];
  onSendMessage: (threadId: string, text: string) => void;
}

export default function CandidateMessagesView({
  threads = [],
  onSendMessage,
}: CandidateMessagesViewProps) {
  const [activeThreadId, setActiveThreadId] = useState<string>(
    threads[0]?.id || ""
  );
  const [inputText, setInputText] = useState("");

  const activeThread =
    threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;
    onSendMessage(activeThread.id, inputText.trim());
    setInputText("");
  };

  if (threads.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-2xl mx-auto my-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">No Messages Yet</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
          When hiring companies and recruiters reach out to you about your applications or interview invites, their messages will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* ================= LEFT CONVERSATION LIST (lg:col-span-4) ================= */}
        <div className="lg:col-span-4 border-r border-slate-200/80 flex flex-col bg-slate-50/50">
          <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-white">
            <h3 className="text-base font-bold text-slate-900">Messages & Inquiries</h3>
            <p className="text-xs text-slate-500 mt-0.5">Direct communication with hiring companies</p>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {threads.map((thread) => {
              const isSelected = (activeThread?.id || "") === thread.id;
              const lastMsg = thread.messages[thread.messages.length - 1];

              return (
                <div
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`p-4 transition cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? "bg-white border-l-4 border-blue-600 shadow-2xs"
                      : "hover:bg-slate-100/70"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0">
                    {(thread.companyName || "C").charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {thread.companyName}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {lastMsg?.time || "Today"}
                      </span>
                    </div>

                    <p className="text-[11px] text-blue-600 font-semibold truncate mt-0.5">
                      {thread.role || "Recruiter Outreach"}
                    </p>

                    <p className="text-xs text-slate-500 truncate mt-1">
                      {lastMsg?.text || "No messages yet"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT CHAT WINDOW (lg:col-span-8) ================= */}
        <div className="lg:col-span-8 flex flex-col bg-white">
          {activeThread ? (
            <>
              {/* Chat Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0 border border-blue-100">
                    {activeThread.companyName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {activeThread.companyName}
                    </h4>
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{activeThread.lastActive || "Active on AddyJob"}</span>
                    </p>
                  </div>
                </div>

                {activeThread.companyId && (
                  <Link
                    href={`/companies/${activeThread.companyId}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                  >
                    <span>Company Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {/* Chat Messages Body */}
              <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4 bg-slate-50/20 max-h-[500px]">
                {activeThread.messages.map((msg) => {
                  const isCandidate = msg.sender === "candidate";

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isCandidate ? "items-end" : "items-start"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[10px] font-bold text-slate-500">
                          {msg.senderName}
                        </span>
                        <span className="text-[9px] text-slate-400">{msg.time}</span>
                      </div>

                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                          isCandidate
                            ? "bg-blue-600 text-white rounded-tr-xs font-medium"
                            : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Composer Input */}
              <form
                onSubmit={handleSend}
                className="p-3.5 sm:p-4 border-t border-slate-200/80 bg-white flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder={`Reply to ${activeThread.companyName}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs font-medium outline-hidden"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs my-auto">
              Select a conversation to read and reply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
