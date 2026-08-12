"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { ChatAssistant } from "@/components/tools/chat-assistant";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[35] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen && (
        <div className="flex h-[28rem] max-h-[70vh] w-[calc(100vw-2.5rem)] max-w-sm flex-col rounded-2xl border border-border bg-card p-4 shadow-2xl">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p className="font-heading text-sm font-semibold text-foreground">Tanya Mentor Dapur</p>
              <p className="text-xs text-neutral-500">Seputar HPP, menu, promosi makanan</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup chat"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <ChatAssistant className="min-h-0 flex-1" />
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Tutup chat" : "Buka chat asisten"}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 sm:h-14 sm:w-14"
      >
        {isOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />}
      </button>
    </div>
  );
}
