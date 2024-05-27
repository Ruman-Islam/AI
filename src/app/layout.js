"use client";

import { Toaster } from "@/components/ui/toaster";

import { ChatContext } from "@/context";
import { chatReducer, initialState } from "@/reducer/ChatReducer";
import { useReducer } from "react";

import "./globals.css";

export default function RootLayout({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  return (
    <html lang="en">
      <body>
        <ChatContext.Provider value={{ state, dispatch }}>
          <section className="flex flex-col justify-between h-screen">
            <main className="mb-auto flex-1">{children}</main>
          </section>
          <Toaster />
        </ChatContext.Provider>
      </body>
    </html>
  );
}
