"use client";

import { auth, db } from "@/app/firebase";
import { useToast } from "@/components/ui/use-toast";
import { ChatContext } from "@/context";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { TooltipProvider } from "../ui/tooltip";
import NoteBar from "./NoteBar";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  const [user, authLoading] = useAuthState(auth);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const chatId = searchParams.get("chatId");
  const { state, dispatch } = useContext(ChatContext);

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/");
    }
  }, [authLoading, router, user]);

  // Fetch chat based on chatId and chat titles;
  useEffect(() => {
    const fetchChats = async () => {
      try {
        dispatch({
          type: "LOADING",
          payload: true,
        });
        const chats = await getDocs(collection(db, "chatHistory"));
        const chatsData = chats?.docs.map((doc) => ({
          id: doc?.id,
          ...doc?.data(),
        }));

        if (pathname.includes("/chat") && chatId) {
          // Get one chat by ID
          const getOneChat = chatsData?.find((chat) => chat?.id === chatId);
          dispatch({
            type: "LOAD_CHAT",
            payload: getOneChat?.history?.length ? getOneChat?.history : [],
          });
        } else if (pathname.includes("/chat") && !chatId) {
          dispatch({
            type: "LOAD_CHAT",
            payload: [],
          });
        } else if (!pathname.includes("/chat") && !chatId) {
          dispatch({
            type: "LOAD_CHAT",
            payload: chatsData.filter((item) => item.userId === user?.uid),
          });
        }
      } catch (error) {
        return toast({
          title: <h1 className="text-lg">Something went wrong!</h1>,
          variant: "destructive",
          className: "bg-text__error text-white",
        });
      } finally {
        dispatch({
          type: "LOADING",
          payload: false,
        });
      }
    };

    fetchChats();
  }, [chatId, dispatch, pathname, toast, user?.uid]);

  useEffect(() => {
    const fetchChatTitles = async () => {
      try {
        dispatch({
          type: "LOADING",
          payload: true,
        });
        const q = query(
          collection(db, "chatHistory"),
          orderBy("createdAt", "desc")
        );
        const chatTitles = await getDocs(q);
        const chatTitlesData = chatTitles?.docs.map((doc) => ({
          id: doc?.id,
          ...doc?.data(),
        }));

        dispatch({
          type: "LOAD_CHAT_ID",
          payload: chatTitlesData
            .filter((item) => item.userId === user?.uid)
            .map((item) => ({
              id: item?.id,
              chatTitle: item?.chatTitle,
              createdAt: item?.createdAt,
            })),
        });
      } catch (error) {
        return toast({
          title: <h1 className="text-lg">Something went wrong!</h1>,
          variant: "destructive",
          className: "bg-text__error text-white",
        });
      } finally {
        dispatch({
          type: "LOADING",
          payload: false,
        });
      }
    };

    fetchChatTitles();
  }, [dispatch, toast, user?.uid]);

  useEffect(() => {
    const fetchNotes = async () => {
      const notes = await getDocs(collection(db, "notes"));
      const notesData = notes?.docs.map((doc) => ({
        id: doc?.id,
        ...doc?.data(),
      }));

      const filtered = notesData.filter((note) => note.userId === user?.uid);
      dispatch({
        type: "LOAD_NOTES",
        payload: filtered,
      });
    };

    fetchNotes();
  }, [dispatch, user?.uid]);

  return (
    <section className="h-screen w-full bg-[#EEEEEE]">
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
