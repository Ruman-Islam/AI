"use client";

import { auth, db } from "@/app/firebase";
import { useToast } from "@/components/ui/use-toast";
import { ChatContext } from "@/context";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  const { toast } = useToast();
  const router = useRouter();
  const [user, authLoading] = useAuthState(auth);
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/");
    }
  }, [authLoading, router, user]);

  // Fetch chat based on chatId;
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "chatHistory"));
        const docsData = querySnapshot?.docs.map((doc) => ({
          id: doc?.id,
          ...doc?.data(),
        }));

        if (chatId) {
          // Get one chat by ID
          const getOneChat = docsData?.find((chat) => chat?.id === chatId);
          dispatch({
            type: "LOAD_CHAT",
            payload: getOneChat?.history?.length ? getOneChat?.history : [],
          });
        } else {
          dispatch({
            type: "LOAD_CHAT",
            payload: [],
          });
        }
      } catch (error) {
        return toast({
          title: <h1 className="text-lg">Something went wrong!</h1>,
          variant: "destructive",
          className: "bg-text__error text-white",
        });
      }
    };

    fetchChat();
  }, [chatId, dispatch, toast]);

  useEffect(() => {
    const fetchChat = async () => {
      const q = query(
        collection(db, "chatHistory"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const docsData = querySnapshot?.docs.map((doc) => ({
        id: doc?.id,
        ...doc?.data(),
      }));

      dispatch({
        type: "LOAD_CHAT_ID",
        payload: docsData
          .filter((item) => item.userId === user?.uid)
          .map((item) => ({
            id: item?.id,
            chatTitle: item?.chatTitle,
            createdAt: item?.createdAt,
          })),
      });
    };

    fetchChat();
  }, [dispatch, user?.uid]);

  return (
    <section className="h-screen w-full bg-[#EEEEEE]">
      <div className="h-full w-full flex justify-between">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </section>
  );
}
