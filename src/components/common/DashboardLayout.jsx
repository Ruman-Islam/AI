"use client";

import { auth } from "@/app/firebase";
import { ChatContext } from "@/context";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { TooltipProvider } from "../ui/tooltip";
import NoteBar from "./NoteBar";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  const [user, authLoading] = useAuthState(auth);
  const router = useRouter();
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/");
    }
  }, [authLoading, router, user]);

  return (
    <section className="h-screen w-full bg-secondary">
      <div className="h-full w-full flex justify-between">
        <TooltipProvider>
          <Sidebar />
          <div className="flex-1">{children}</div>
          <NoteBar />
        </TooltipProvider>
      </div>
    </section>
  );
}
