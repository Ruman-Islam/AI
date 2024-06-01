"use client";
import ChatMessages from "@/components/ChatMessages";
import DashboardLayout from "@/components/common/DashboardLayout";
import Spinner from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ChatContext } from "@/context";
import { useChat } from "ai/react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import "katex/dist/katex.min.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { IoSendSharp } from "react-icons/io5";
import { auth, db } from "../firebase";

const AutoResizableTextarea = ({
  input,
  handleChange,
  isLoading,
  isUploading,
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to correctly calculate the scrollHeight
      textareaRef.current.style.height = "auto";
      // Set the height of the textarea to match its scrollHeight
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <Textarea
      ref={textareaRef}
      type="text"
      placeholder="Message AI"
      className="focus-outline-none border-none focus-visible:ring-0 py-6 pr-12 pl-4 bg-primary text-white"
      style={{ overflow: "hidden", resize: "none" }}
      value={input}
      onChange={handleChange}
      disabled={isLoading || isUploading}
    />
  );
};

export default function Chat() {
  const { toast } = useToast();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const chatId = searchParams.get("chatId");
  const [user] = useAuthState(auth);
  const { state, dispatch } = useContext(ChatContext);
  const [isUploading, setIsUploading] = useState(false);
  const {
    messages,
    input,
    isLoading,
    handleSubmit,
    handleInputChange,
    reload,
    stop,
  } = useChat({
    api: "https://zpunktragback-3ktw2.ondigitalocean.app/api/chat",
    headers: {
      "Content-Type": "application/json",
    },
    onError: (error) => {
      return toast({
        title: <h1 className="text-lg">Something went wrong!</h1>,
        variant: "destructive",
        className: "bg-text__error text-white",
      });
    },
  });

  const scrollableChatContainerRef = useRef(null);
  const messageLength = messages.length;
  const lastMessage = messages[messageLength - 1];

  const scrollToBottom = () => {
    if (scrollableChatContainerRef.current) {
      scrollableChatContainerRef.current.scrollTop =
        scrollableChatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageLength, lastMessage]);

  useEffect(() => {
    if (lastMessage && !isLoading) {
      const saveMessageToDatabase = async () => {
        try {
          setIsUploading(true);
          if (chatId) {
            const docRef = doc(db, "chatHistory", chatId);
            await updateDoc(docRef, {
              history: [...state.chats, ...messages],
              createdAt: serverTimestamp(),
            });
          } else {
            const chatBody = {
              userId: user?.uid,
              chatTitle: messages[0].content,
              history: messages,
            };

            const docRef = await addDoc(collection(db, "chatHistory"), {
              ...chatBody,
              createdAt: serverTimestamp(),
            });

            const docSnap = await getDoc(docRef);
            const doc = docSnap.data();

            dispatch({
              type: "ADD_CHAT_ID",
              payload: {
                id: docSnap?.id,
                chatTitle: doc?.chatTitle,
                createdAt: doc?.createdAt,
              },
            });

            const params = new URLSearchParams(searchParams);
            params.set("chatId", docSnap?.id);
            replace(`${pathname}?${params.toString()}`);
          }
        } catch (error) {
          return toast({
            title: <h1 className="text-lg">Something went wrong!</h1>,
            variant: "destructive",
            className: "bg-text__error text-white",
          });
        } finally {
          setIsUploading(false);
        }
      };

      saveMessageToDatabase();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isLoading, lastMessage, messages, user?.uid]);

  // Fetch chat based on chatId and chat titles;
  useEffect(() => {
    if (!lastMessage) {
      const fetchChats = async () => {
        try {
          if (pathname.includes("/chat") && chatId) {
            const chats = await getDocs(collection(db, "chatHistory"));
            const chatsData = chats?.docs.map((doc) => ({
              id: doc?.id,
              ...doc?.data(),
            }));

            const getChatById = chatsData?.find((chat) => chat?.id === chatId);

            dispatch({
              type: "LOAD_CHAT",
              payload: getChatById?.history?.length ? getChatById?.history : [],
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

      fetchChats();
    }
  }, [chatId, dispatch, lastMessage, pathname, toast]);

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col justify-between px-3 pb-3 container">
        {state?.chats?.length > 0 || messages?.length > 0 ? (
          <div
            ref={scrollableChatContainerRef}
            className="overflow-y-auto flex-1 h-full px-0 md:px-20"
          >
            <ChatMessages messages={[...state.chats, ...messages]} />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="bg-gradient-to-tr from-primary to-[#119D8E] text-white text-center max-w-[700px] w-full mx-auto p-5 font-brand__font__600 border border-text__primary rounded-xl">
              <h1 className="text-brand__font__size__xl mb-10">z-Punkt</h1>

              <p className="mb-5">
                Hallo ich bin ihr AI-Zukunftsassistent, Ihr künstlicher
                Intelligenzassistent für Zukunftsfragen
              </p>
              <p className="mb-5">
                Dieses hochmoderne KI-Werkzeug ist sorgfältig konzipiert, um
                professionelle Beratung mit bemerkenswerter Genauigkeit und
                Einsicht zu bieten. Der AI-Zukunftsassistent ist darauf
                ausgerichtet, maßgeschneiderte Expertenunterstützung für Ihre
                einzigartigen Herausforderungen zu liefern.
              </p>
              <p>Bitte zögern Sie nicht, Ihre Fragen zu stellen...</p>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-0 md:px-20">
          <form onSubmit={onSubmit}>
            <div className="relative">
              <AutoResizableTextarea
                input={input}
                handleChange={handleInputChange}
                isLoading={isLoading}
                isUploading={isUploading}
              />
              <div className="text-primary">
                <Button
                  disabled={isLoading || isUploading}
                  className="bg-transparent hover:bg-transparent absolute top-6 -right-1 text-white"
                >
                  {isLoading || isUploading ? (
                    <Spinner styles="w-5 h-5" />
                  ) : (
                    <IoSendSharp size={25} />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
