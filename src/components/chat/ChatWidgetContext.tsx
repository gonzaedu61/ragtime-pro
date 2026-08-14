"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export interface ChatOrigin {
  x: number;
  y: number;
}

interface ChatWidgetContextValue {
  isOpen: boolean;
  origin: ChatOrigin | null;
  open: (origin: ChatOrigin) => void;
  close: () => void;
}

const ChatWidgetContext = createContext<ChatWidgetContextValue | null>(null);

export function ChatWidgetProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [origin, setOrigin] = useState<ChatOrigin | null>(null);

  const open = useCallback((newOrigin: ChatOrigin) => {
    setOrigin(newOrigin);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ChatWidgetContext.Provider value={{ isOpen, origin, open, close }}>
      {children}
    </ChatWidgetContext.Provider>
  );
}

export function useChatWidget(): ChatWidgetContextValue {
  const ctx = useContext(ChatWidgetContext);
  if (!ctx) {
    throw new Error("useChatWidget must be used within a ChatWidgetProvider");
  }
  return ctx;
}
